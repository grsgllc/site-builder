"use server";

import Stripe from "stripe";
import { getUser, setUserCustomerId } from "@/lib/prisma";
import { getUrl } from "@/lib/utils";

const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
const stripe = new Stripe(stripeKey);

export async function getProduct() {
  const productId = process.env.STRIPE_PRODUCT_ID ?? "";
  const product = await stripe.products.retrieve(productId);
  return product;
}

export async function getPrices() {
  const productId = process.env.STRIPE_PRODUCT_ID ?? "";

  const priceList = await stripe.prices.list({ product: productId });
  const prices = priceList.data;
  return prices.sort((a, b) =>
    (a.unit_amount ?? 0) > (b.unit_amount ?? 0) ? 1 : -1
  );
}

export async function createCheckoutSession(
  userId: string,
  mode: "payment" | "subscription",
  priceId: string
) {
  const user = await getUser(userId);
  if (!user) throw new Error("User not found");

  const extraParams: {
    customer?: string;
    customer_creation?: "always";
    customer_email?: string;
    invoice_creation?: { enabled: boolean };
    payment_intent_data?: { setup_future_usage: "on_session" };
    tax_id_collection?: { enabled: boolean };
  } = {};

  if (user.stripeCustomerId) {
    extraParams.customer = user.stripeCustomerId;
  } else {
    if (mode === "payment") {
      extraParams.customer_creation = "always";
      extraParams.invoice_creation = { enabled: true };
      extraParams.payment_intent_data = { setup_future_usage: "on_session" };
    }
    if (user?.email) {
      extraParams.customer_email = user.email;
    }
    extraParams.tax_id_collection = { enabled: true };
  }
  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      client_reference_id: userId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: getUrl("/charts"),
      cancel_url: getUrl("/subscribe"),
      ...extraParams,
    });
    return session.url;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function createPortalSession(
  userId: string,
  redirectPath: string = "/"
) {
  console.log("createPortalSession");
  const user = await getUser(userId);
  if (!user) throw new Error("User not found");
  if (!user.stripeCustomerId) throw new Error("User has no customer id");
  let session;
  const params: Stripe.BillingPortal.SessionCreateParams = {
    customer: user.stripeCustomerId,
    return_url: getUrl(redirectPath),
  };
  try {
    console.log("Creating portal session with params", params);
    session = await stripe.billingPortal.sessions.create(params);
  } catch (e) {
    console.error(e);
    throw e;
  }
  if (session) return session.url;
  throw new Error("Failed to create session");
}

// This is used to get the uesr checkout session and populate the data so we get the planId the user subscribed to
export const findCheckoutSession = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export async function constructWebhookEvent(
  body: string,
  signature: string,
  secret: string
) {
  const event = await stripe.webhooks.constructEvent(body, signature, secret);
  return event;
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}
