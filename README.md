# SiteForge - Brutalist Site Builder

A collaborative, real-time website builder with a brutalist aesthetic. Build flashy, interactive websites from your browser with drag-and-drop components and live collaboration.

## Features Implemented ✅

### Core Infrastructure
- **Authentication**: NextAuth v5 with email provider (ForwardEmail)
- **Database**: Prisma + MongoDB with complete schema for sites, pages, components, collaborators, layouts, and assets
- **Payment Processing**: Stripe integration for subscriptions (configured but not enforced)
- **UI Framework**: Tailwind CSS 4.x + daisyUI with brutalist styling

### Site Management
- **Dashboard** (`/dashboard`): View all owned and collaborated sites
- **Site Creation** (`/dashboard/new`): Create new sites with subdomain validation
- **Subdomain System**: Each site gets a unique subdomain (e.g., `mysite.yourapp.com`)
- **Database Helpers**: Complete CRUD operations for all models

### Visual Editor (`/editor/[siteId]`)
- **Drag-and-Drop Canvas**: Position components anywhere with @dnd-kit
- **Component Library**: Categorized components (Basic, Media, Effects)
- **Properties Panel**: Edit component properties in real-time
- **Toolbar**: Save, Preview, Publish controls
- **Layout System**: Pre-defined brutalist layouts ready to use

### Components (Brutalist Styled)
- **Basic**: Text, Heading, Image, Button, Video
- **Media**: Gallery, Carousel, Embed (YouTube, etc.)
- **Effects**: Animated Text, Parallax, Particles

### Layouts
- **Brutalist Stack**: Vertical sections with bold borders
- **Asymmetric Grid**: Offset grid layout
- **Split Screen**: 50/50 dramatic split
- **Freeform Canvas**: Total creative freedom

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/sitebuilder"

# NextAuth
AUTH_EMAIL_FROM="noreply@yourdomain.com"
AUTH_SECRET="your-secret-here" # Generate with: openssl rand -base64 32
FORWARDEMAIL_SECRET="your-forwardemail-smtp-password"

# Stripe (optional for now)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PRODUCT_ID="prod_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Set Up MongoDB
1. Create a MongoDB Atlas account (free tier works)
2. Create a new cluster
3. Get your connection string and add it to `DATABASE_URL`

### 4. Initialize Database
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed default layouts
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── sites/                 # Site CRUD endpoints
│   │   ├── pages/[pageId]/        # Page components endpoints
│   │   ├── components/[id]/       # Component update/delete
│   │   └── webhook/stripe/        # Stripe webhooks
│   ├── dashboard/                 # Site management UI
│   │   ├── new/                   # Create site flow
│   │   └── page.tsx              # Dashboard listing
│   ├── editor/[siteId]/          # Visual editor
│   └── page.tsx                  # Landing page
├── components/
│   ├── editor/                    # Editor components
│   │   ├── EditorLayout.tsx      # Main editor container
│   │   ├── EditorToolbar.tsx     # Top toolbar
│   │   ├── ComponentSidebar.tsx  # Component library
│   │   ├── EditorCanvas.tsx      # Drag-drop canvas
│   │   ├── ComponentRenderer.tsx # Renders components
│   │   └── PropertiesPanel.tsx   # Edit properties
│   ├── Core.tsx                  # Reusable UI components
│   ├── Header.tsx                # Site header
│   ├── Footer.tsx                # Site footer
│   └── ...
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client + helpers
│   ├── stripe.ts                 # Stripe functions
│   └── ...
└── config.ts                     # App configuration

prisma/
├── schema.prisma                 # Database schema
└── seed.ts                       # Default layouts seed
```

## Database Schema

### Main Models
- **User**: Authentication, Stripe integration
- **Site**: User-created websites with subdomain
- **SiteCollaborator**: Multi-user collaboration
- **Page**: Pages within sites (currently 1 per site)
- **Component**: Drag-drop components with JSON props
- **Layout**: Pre-defined layout templates
- **Asset**: Uploaded files (Vercel Blob integration ready)

## What's Working Now

1. ✅ User authentication (email-based)
2. ✅ Create and manage sites
3. ✅ Subdomain validation
4. ✅ Visual editor with drag-and-drop
5. ✅ Component library (Basic, Media, Effects)
6. ✅ Properties panel for editing
7. ✅ Brutalist component styling
8. ✅ Layout templates
9. ✅ Database persistence (API routes ready)

## What Still Needs Implementation

### High Priority
1. **Save Functionality**: Wire up the save button in the editor to persist components to database
2. **Load Components**: Fetch existing components when opening the editor
3. **Site Renderer**: Public-facing site display at subdomains
4. **Publishing System**: Toggle published state and route to subdomain
5. **Preview Mode**: Preview unpublished changes

### Medium Priority
6. **Real-time Collaboration**: WebSocket server + Yjs for multi-user editing
7. **Presence Awareness**: See other users' cursors and selections
8. **Collaborator Invitations**: Invite others to edit sites
9. **Vercel Blob Integration**: Asset uploads and management
10. **Component Resize**: Drag handles to resize components

### Nice-to-Have
11. **Undo/Redo**: Command history
12. **Keyboard Shortcuts**: Faster editing
13. **Component Duplication**: Copy/paste components
14. **Mobile Responsive**: Responsive preview modes
15. **Animation Presets**: Pre-built animation effects
16. **Template Library**: Save and reuse component groups

## Tech Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5.x
- **Database**: MongoDB + Prisma ORM
- **Auth**: NextAuth v5 (ForwardEmail provider)
- **Styling**: Tailwind CSS 4.x + daisyUI 5.x
- **Drag & Drop**: @dnd-kit
- **Animation**: Framer Motion (installed, not yet used)
- **Storage**: @vercel/blob (installed, not yet integrated)
- **Real-time** (pending): Yjs + y-websocket
- **Payments**: Stripe

## API Endpoints

### Sites
- `POST /api/sites` - Create new site
- `GET /api/sites/check-subdomain?subdomain=x` - Check availability

### Components
- `POST /api/pages/[pageId]/components` - Add component
- `PUT /api/pages/[pageId]/components` - Bulk update
- `PATCH /api/components/[id]` - Update component
- `DELETE /api/components/[id]` - Delete component

### Stripe
- `POST /api/webhook/stripe` - Stripe webhooks

## Development Notes

### Important Files to Update
1. **src/config.ts** - Update `domainName` to your actual domain
2. **Wildcard DNS** - Set up `*.yourdomain.com` pointing to your server for subdomains
3. **Environment Variables** - Configure all required env vars

### Database Commands
```bash
# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (visual database editor)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# Seed layouts
npm run db:seed
```

### Styling Philosophy
This project uses a **brutalist design approach**:
- Bold, thick borders (4px+)
- High contrast colors
- Monospace fonts
- Box shadows for depth
- Asymmetric layouts
- Raw, unpolished aesthetic

## Next Steps

1. **Implement Save/Load**: Wire up editor to save components to database
2. **Build Site Renderer**: Display published sites at subdomains
3. **Add Real-time Collaboration**: Implement Yjs + WebSocket server
4. **Asset Management**: Integrate Vercel Blob for image uploads
5. **Publish Flow**: Complete the publish/unpublish workflow

## Contributing

This is a personal project template. Feel free to fork and modify for your own use.

## License

Private - All rights reserved
