import { Site as PrismaSite } from "@prisma/client";

export interface UserDetails {
  userId: string;
  email: string;
  hasAccess: boolean;
  stripeCustomerId?: string | null;
  trialExpiresAt?: Date;
}

export interface Site extends PrismaSite {
  isOwner: boolean;
}

declare module "next-auth" {
  interface User {
    hasAccess?: boolean;
    stripeCustomerId?: string | null;
    trialExpiresAt?: Date;
  }
}
