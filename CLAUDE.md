# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SiteForge is a collaborative, real-time website builder with a brutalist aesthetic. Users can create sites with unique subdomains, use a drag-and-drop visual editor, and collaborate with others in real-time.

**Tech Stack:**
- Next.js 15.5.6 (App Router with route groups)
- TypeScript 5.x
- MongoDB + Prisma ORM
- NextAuth v5 (email authentication via ForwardEmail)
- Tailwind CSS 4.x + daisyUI (brutalist design system)
- @dnd-kit for drag-and-drop
- Stripe for payments (configured but not enforced)
- Yjs + y-websocket (installed but not yet integrated for real-time collaboration)

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Database Commands
```bash
# Generate Prisma client after schema changes (REQUIRED after any schema.prisma edits)
npm run db:generate
# OR
npx prisma generate

# Push schema changes to MongoDB without migrations
npm run db:push
# OR
npx prisma db push

# Seed default layouts (Brutalist Stack, Asymmetric Grid, Split Screen, Freeform Canvas)
npm run db:seed

# Open Prisma Studio to view/edit database visually
npx prisma studio
```

**IMPORTANT:** After any changes to `prisma/schema.prisma`, you MUST run `npm run db:generate` to regenerate the Prisma client before running the app.

## Architecture & Structure

### Route Groups (Dual Root Layouts)

The app uses Next.js route groups to provide two distinct root layouts:

- **`(main)`**: Standard app layout with header/footer for dashboard, landing, auth
  - Layout: `src/app/(main)/layout.tsx`
  - Routes: `/`, `/dashboard`, `/dashboard/new`, `/signin`, `/api/*`

- **`(editor)`**: Fullscreen editor layout without header/footer
  - Layout: `src/app/(editor)/layout.tsx`
  - Routes: `/editor/[siteId]`

This architecture allows the editor to have a completely different layout structure without navigation chrome.

### Prisma Client Location

The Prisma client is generated to a custom location: `generated/prisma/` (see `prisma/schema.prisma` line 9). Import it from:
```typescript
import { prisma } from "@/lib/prisma";
```

All database operations should use the helper functions in `src/lib/prisma.ts` which provide a clean API layer over Prisma.

### Database Schema Structure

**Core Models:**
- `User` - Authentication + Stripe integration
- `Site` - User-created websites with unique subdomain
- `SiteCollaborator` - Many-to-many relationship for multi-user editing
- `Page` - Pages within a site (currently sites have one page, slug-based routing ready)
- `Component` - Draggable components with JSON props, positioned via x/y coordinates
- `Layout` - Pre-defined layout templates (seeded via `prisma/seed.ts`)
- `Asset` - File uploads (Vercel Blob integration prepared but not active)

**Important Relationships:**
- Sites belong to a User and optionally reference a Layout
- Pages belong to a Site
- Components belong to a Page and store all visual properties in the `props` JSON field
- Components use `positionX`, `positionY`, `width`, `height`, `zIndex` for absolute positioning

### Visual Editor Architecture

The editor (`/editor/[siteId]`) is built with these key components:

1. **EditorLayout.tsx** - Main container managing editor state
2. **EditorToolbar.tsx** - Top toolbar with Save/Preview/Publish actions
3. **ComponentSidebar.tsx** - Left panel with component library (Basic, Media, Effects categories)
4. **EditorCanvas.tsx** - Center canvas using @dnd-kit for drag-and-drop
5. **ComponentRenderer.tsx** - Renders individual components based on type
6. **PropertiesPanel.tsx** - Right panel for editing selected component properties

**Component System:**
- Components are categorized (Basic, Media, Effects)
- Each component type has default props defined in ComponentSidebar
- Component rendering happens in ComponentRenderer based on `type` field
- Properties are stored as JSON in the database `Component.props` field

### API Routes

All API routes are in `src/app/(main)/api/`:

**Sites:**
- `POST /api/sites` - Create new site
- `GET /api/sites/check-subdomain?subdomain=x` - Validate subdomain availability

**Components:**
- `POST /api/pages/[pageId]/components` - Add component to page
- `PUT /api/pages/[pageId]/components` - Bulk update components (for drag operations)
- `PATCH /api/components/[componentId]` - Update single component
- `DELETE /api/components/[componentId]` - Delete component

**Stripe:**
- `POST /api/webhook/stripe` - Handle Stripe webhooks

**NextAuth:**
- `/api/auth/[...nextauth]` - NextAuth handlers (uses `src/lib/auth.ts` config)

## Configuration

### Environment Variables Required

```env
# Database - MongoDB connection string
DATABASE_URL="mongodb+srv://..."

# NextAuth v5
AUTH_EMAIL_FROM="noreply@yourdomain.com"
AUTH_SECRET="..." # Generate with: openssl rand -base64 32
FORWARDEMAIL_SECRET="..." # SMTP password from ForwardEmail

# Stripe (optional, not enforced)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PRODUCT_ID="prod_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Application
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Config File

`src/config.ts` contains app configuration:
- `appName`: "SiteForge"
- `domainName`: **MUST be updated** to your actual domain for subdomain routing
- `defaultPage`: Landing page after login
- `stripe.plans`: Pricing plan configuration

**CRITICAL:** Before deploying, update `domainName` in `src/config.ts` and set up wildcard DNS (`*.yourdomain.com`) to handle subdomains.

## Brutalist Design Philosophy

This project uses a bold, brutalist aesthetic:
- Thick borders (4px-8px solid black)
- High contrast colors (bright yellows, reds, greens against black/white)
- Monospace fonts where appropriate
- Strong box shadows for depth
- Asymmetric, grid-based layouts
- Raw, unpolished, intentionally "ugly but striking" design

When adding components or layouts, maintain this aesthetic. Reference existing components in `src/components/editor/ComponentRenderer.tsx` for styling patterns.

## Current Implementation Status

**Working:**
- User authentication with email magic links
- Site creation with subdomain validation
- Dashboard showing owned and collaborated sites
- Visual editor with drag-and-drop canvas
- Component library with categorized components
- Properties panel for editing components
- Layout templates (4 types seeded by default)
- API endpoints for CRUD operations

**Not Yet Implemented:**
- Save functionality (editor doesn't persist to database yet)
- Load existing components when opening editor
- Public site rendering at subdomains
- Publish/unpublish workflow
- Real-time collaboration (Yjs/WebSocket)
- Asset upload system (Vercel Blob integration)
- Component resize handles
- Undo/redo functionality

## Key Development Patterns

### Database Operations

Always use the helper functions from `src/lib/prisma.ts` instead of direct Prisma queries. Examples:

```typescript
import { getSite, updateComponent, createPage } from "@/lib/prisma";

// Get site with all relations
const site = await getSite(siteId);

// Update component position
await updateComponent(componentId, { positionX: 100, positionY: 200 });
```

### Authentication

Use NextAuth v5 with the `auth()` helper:

```typescript
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }
  // ... use session.user
}
```

### API Route Pattern

API routes follow this pattern:

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ... handle request
}
```

## Path Aliases

TypeScript path alias configured in `tsconfig.json`:
```typescript
import { Component } from "@/components/Component";
import { helper } from "@/lib/helper";
```

`@/*` maps to `./src/*`
