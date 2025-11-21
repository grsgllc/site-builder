export interface UserDetails {
  userId: string;
  email: string;
  hasAccess: boolean;
  stripeCustomerId?: string | null;
  trialExpiresAt?: Date;
}

declare module "next-auth" {
  interface User {
    hasAccess?: boolean;
    stripeCustomerId?: string | null;
    trialExpiresAt?: Date;
  }
}
