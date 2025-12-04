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

export interface Template {
  id: string;
  subdomain: string;
  name: string;
  description?: string | null;
  previewImg?: string | null;
}

export type ViewportMode = 'mobile' | 'desktop';

export interface CanvasDimensions {
  width: number;
  height: number;
}

export interface ComponentData {
  id: string;
  type: string;
  props: any;
  positionX: number;
  positionY: number;
  width: number | null;
  height: number | null;
  zIndex: number;
  layoutSection: string | null;
}

declare module "next-auth" {
  interface User {
    hasAccess?: boolean;
    stripeCustomerId?: string | null;
    trialExpiresAt?: Date;
  }
}
