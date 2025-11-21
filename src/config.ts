type Config = {
  appName: string;
  appDescription: string;
  domainName: string;
  defaultPage: string;
  stripe: {
    plans: {
      priceId: string;
      name: string;
      description: string;
      price: string;
      featureList: string[];
      greatFor: string;
      mode: "payment" | "subscription";
    }[];
  };
};

const config: Config = {
  appName: "SiteForge",
  appDescription:
    "Build flashy, interactive websites with real-time collaboration",
  domainName: "yourapp.com", // Update this with your actual domain
  defaultPage: "dashboard",
  stripe: {
    plans: [
      {
        priceId: "price_placeholder_weekly",
        name: "Weekly Plan - $4.99/week",
        description: "Perfect for trying out site building",
        price: "$4.99/wk",
        mode: "subscription",
        featureList: [
          "✅ Unlimited sites",
          "✅ Real-time collaboration",
          "✅ All components and layouts",
          "✅ Cancel anytime",
        ],
        greatFor: "New users exploring site building",
      },
      {
        priceId: "price_placeholder_lifetime",
        name: "Lifetime Access - $49.99 (One-time payment)",
        description: "Best value for serious creators",
        price: "$49.99",
        mode: "payment",
        featureList: [
          "✅ Everything in Weekly Plan",
          "✅ Never pay again",
          "✅ Custom domain support",
          "✅ Priority support",
        ],
        greatFor: "Professional creators and agencies",
      },
    ],
  },
};

export default config;
