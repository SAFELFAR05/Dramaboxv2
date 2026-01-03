# DramaBox - Netflix Clone

## Overview

A Netflix-style streaming platform clone that displays drama content from an external API. The application features a React frontend with a cinematic dark theme, smooth animations, and a responsive design that mimics the Netflix user experience. Content is fetched from a third-party DramaBox API and displayed with a hero section, grid layouts, and modal details.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS with CSS variables for theming (dark Netflix-inspired theme)
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for smooth transitions and hover effects
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared/ for shared)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ES Modules)
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Pattern**: REST endpoints with Zod schema validation
- **Build**: esbuild for production bundling with selective dependency bundling

### Data Flow
1. Frontend calls `/api/dramas` endpoint
2. Backend proxies request to external DramaBox API (`https://dramabox-api-rho.vercel.app/api/home`)
3. Response is validated with Zod schemas defined in `shared/schema.ts`
4. Data displayed in Netflix-style grid with hero section

### Project Structure
- `client/` - React frontend application
  - `src/components/` - UI components including DramaCard, DramaModal, Hero, Navbar
  - `src/components/ui/` - shadcn/ui component library
  - `src/hooks/` - Custom React hooks (use-dramas, use-toast, use-mobile)
  - `src/pages/` - Page components (Home, not-found)
  - `src/lib/` - Utilities and query client configuration
- `server/` - Express backend
  - `routes.ts` - API route definitions
  - `db.ts` - Database connection
  - `storage.ts` - Data access layer
  - `vite.ts` - Vite dev server integration
- `shared/` - Shared code between frontend and backend
  - `schema.ts` - Drizzle schemas and Zod validation types
  - `routes.ts` - API route type definitions

### Key Design Decisions
- **Monorepo Structure**: Client and server in same repository with shared types
- **Type Safety**: End-to-end TypeScript with shared Zod schemas
- **Client-side Search**: Filtering performed on fetched data rather than server-side
- **Proxy Pattern**: Backend proxies external API to avoid CORS issues and enable future caching

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via DATABASE_URL environment variable)
- **Drizzle ORM**: Database toolkit with push migrations (`db:push` command)

### External APIs
- **DramaBox API**: `https://dramabox-api-rho.vercel.app/api/home` - Source for drama content including titles, covers, and chapter counts

### Third-Party Services
- **Fonts**: Google Fonts (Bebas Neue, Manrope, DM Sans, Fira Code, Geist Mono)
- **Icons**: Lucide React icon library

### Key NPM Packages
- `@tanstack/react-query` - Data fetching and caching
- `framer-motion` - Animation library
- `drizzle-orm` / `drizzle-zod` - Database ORM with Zod integration
- `wouter` - Lightweight routing
- `zod` - Schema validation
- `connect-pg-simple` - PostgreSQL session store
- Full shadcn/ui Radix component suite