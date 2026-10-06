<!-- BEGIN:nextjs-agent-rules -->

## Project Backend 
Backend Repository: https://github.com/mehedihasanrafi205/PowerGridBD-Backend
Backend Live: https://powergridbd-backend.vercel.app

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project-Specific Agent Guide

## Stack
- **Next.js 16.3.7** (App Router, React 19.2.8)
- **Bun 1.4.2** — package manager & runtime
- **Biome 2.4.2** — lint + format (replaces ESLint/Prettier)
- **Tailwind CSS v4** — CSS-first config, CSS variables for theming
- **shadcn/ui** — "base-nova" style, RSC enabled, lucide icons
- **React Compiler** — enabled via `babel-plugin-react-compiler`
- **TanStack Query** — server state management
- **Zod** — validation schemas

## Commands
```bash
bun dev          # dev server (Turbopack)
bun build        # production build (SSR + static pages)
bun start        # serve production build
bun lint         # biome check
bun format       # biome format --write
```

## Key Config
- `reactCompiler: true` in `next.config.ts` — automatic memoization, no `useMemo`/`useCallback` needed
- Path alias `@/*` → `./src/*` (tsconfig + components.json)
- CSS variables for all colors (globals.css) — dark mode via `.dark` class
- `NEXT_PUBLIC_BASE_URL` env var for API base URL
- **No `output: "export"`** — SSR enabled for dynamic routes; static pages prerendered

## Architecture
- **Route groups**: `(public)` for auth pages, `(dashboard)` for role-based dashboards
- **Dashboard structure**: Single `(dashboard)` route group with role-based sub-routes:
  - `(dashboard)/customer/*` — Customer portal (outages, SLA, payments)
  - `(dashboard)/technician/*` — Technician portal (assigned tasks, performance)
  - `(dashboard)/operator/*` — Power Operator portal (grid, schedules, analytics)
  - `(dashboard)/admin/*` — Admin console (users, payments, audit logs)
- **API + Hooks pattern**: `src/api/*.api.ts` modules + `src/hooks/*.hook.ts` (TanStack Query)
- **Types**: Centralized in `src/types/` with barrel export at `src/types/index.ts`
- **Providers**: `AuthProvider` (with embedded QueryClient), composed in `Providers` at `src/providers/index.tsx`

## Conventions
- **No `useMemo`/`useCallback`** — React Compiler handles it
- **Class merging** — use `cn()` from `@/lib/utils` (re-exports `cn` package)
- **Components** — colocate in `src/components/ui/` for shadcn components
- **Fonts** — Geist Sans/Mono + Inter loaded via `next/font` in layout.tsx
- **Images** — use `next/image` (configured for SSR)
- **Role checks** — use `useAuth()` hook, check `user.role` for conditional rendering
- **API calls** — use `api.get/post/put/patch/delete` from `@/lib/apiClient`
- **Type files** — use `.type.ts` suffix for type definitions (e.g., `outage.type.ts`)
- **Hook files** — use `.hook.type.ts` suffix for hook type definitions (e.g., `outage.hook.type.ts`)

## Gotchas
- `node_modules` + `.next` + `out` are ignored by Biome
- `sharp` and `unrs-resolver` are trusted deps with ignored scripts
- **No `output: "export"`** — SSR enabled; dynamic routes render on demand
- CSS uses `@import "tailwindcss"` (v4 syntax), not `@tailwind base/components/utilities`
- **CSS warnings**: `var(--color-xxx / 0.1)` syntax produces warnings but doesn't block build
- **TypeScript strict**: `noImplicitAny: true`, `alwaysStrict: true` — must type everything
- **No `baseUrl` in tsconfig** — deprecated in TS 5.0+, use only `paths`
- **Static export + Auth**: `AuthProvider` creates its own `QueryClient` to avoid "No QueryClient set" during static generation
- **Filter types**: Hook filters use strict union types (`Role`, `OutageStatus`, `ApplicationStatus`) — cast when passing string values from URL params
- **Dynamic routes**: `/customer/outage/[id]` and `/technician/outage/[id]` are server-rendered (Dynamic); use `generateStaticParams` returning `[{id: "1"}]` for build to pass
- **AuthProvider**: Creates its own `QueryClient` to avoid "No QueryClient set" during static generation

## File Write Best Practice
For large TSX files (>5KB), avoid shell here-documents. Use:
```bash
node -e "
const fs = require('fs');
const content = \`...entire file content...\`;
fs.writeFileSync('path/to/file.tsx', content);
"
```
Or write via Python with proper encoding.

## UI Components (shadcn/ui)
All components in `src/components/ui/` — installed via `bunx --bun shadcn@latest add <component>`
Key components: `button`, `input`, `textarea`, `select`, `dialog`, `dropdown-menu`, `tabs`, `table`, `card`, `badge`, `avatar`, `tooltip`, `pagination`, `skeleton`, `separator`, `checkbox`, `label`, `input-otp`, `toast`

## Features Implemented
- Outage reporting & lifecycle (PENDING → ASSIGNED → IN_PROGRESS → RESOLVED → RESTORED)
- Grid hierarchy (Zone → Substation → Feeder → Area)
- Load-shedding schedules with CRUD
- SLA subscriptions with SSLCommerz payments
- Priority restoration payments
- Technician applications with OTP verification
- Role-based dashboards with analytics
- Audit logs (admin only)

## Landing Page & Public Site
- Public pages: `/` (landing), `/about`, `/services`, `/contact`, `/pricing` — Server Components with full metadata
- Landing components in `src/components/landing/` (LandingNav, LiveStatusStrip, HeroCockpit, FeaturePanels, RoleShowcase, OperationsTable, PricingSection, LandingFooter, SectionHeading)
- Brand colors registered in `@theme inline` in globals.css — opacity modifiers (`bg-electric-blue/10`) work natively
- `font-mono` utility resolves to JetBrains Mono (loaded in layout.tsx); Inter is `font-sans`
- Landing pages are always dark (explicit zinc/white classes, not theme-dependent `text-foreground`)
- LiveStatusStrip + OperationsTable fetch real data via TanStack Query only when authenticated; anonymous visitors see an honest sign-in prompt (no mock data)
- Scroll animations: `useReveal` hook (IntersectionObserver) + CSS keyframes — no animation library
- Contact form is Zod-validated and composes a `mailto:` link (no backend contact endpoint exists)

## Type Safety Notes
- `OperationalAnalytics` includes optional fields: `totalUsers`, `criticalFeeders`, `mttr`, `avgAssignmentTime`, `firstTimeFixRate`
- `CustomerSummary` includes optional: `slaActive`, `slaExpiryDate`
- `TechnicianSummary` includes optional: `firstTimeFixRate`
- Hook filters use strict union types (`Role`, `OutageStatus`, `ApplicationStatus`) — cast when passing string values