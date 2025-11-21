import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe, findCheckoutSession } from "@/lib/stripe";
import { approveAccess, revokeAccess } from "@/lib/prisma";
import config from "@/config";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// This is where we receive Stripe webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
// See more: https://shipfa.st/docs/features/payments
export async function POST(req: NextRequest) {
  const body = await req.text();

  const signature = req.headers.get("stripe-signature");
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature ?? "",
      webhookSecret ?? ""
    );
  } catch (err: any) {
    console.log(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product
        const stripeObject: Stripe.Checkout.Session = event.data
          .object as Stripe.Checkout.Session;

        const session = await findCheckoutSession(stripeObject.id);

        const priceId = session?.line_items?.data[0]?.price?.id || "";
        const plan = config.stripe.plans.find((p) => p.priceId === priceId);
        if (!plan) break;

        const customerId = session?.customer as string;
        const userId = stripeObject.client_reference_id || "";

        await approveAccess(userId, customerId);

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail(...);
        // } catch (e) {
        //   console.error("Email issue:" + e?.message);
        // }

        break;
      }

      case "customer.subscription.deleted": {
        // The customer subscription stopped
        // ❌ Revoke access to the product
        const stripeObject: Stripe.Subscription = event.data
          .object as Stripe.Subscription;
        const subscription = await stripe.subscriptions.retrieve(
          stripeObject.id
        );

        await revokeAccess(subscription.customer as string);
        break;
      }

      case "invoice.paid": {
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product
        const stripeObject: Stripe.Invoice = event.data
          .object as Stripe.Invoice;
        const customerId = stripeObject.customer;

        await approveAccess(customerId as string, customerId as string);

        break;
      }

      default:
      // Unhandled event type
    }
  } catch (e: any) {
    console.error("stripe error: ", e.message);
  }

  return NextResponse.json({});
}
