# PowerGridBD

Load Shedding & Power Outage Management Platform for Bangladesh

---

## Overview

**PowerGridBD** is a full-stack Load Shedding & Power Outage Management Platform designed for Bangladesh's power distribution ecosystem. It enables customers to report outages, operators to manage grid infrastructure and dispatch technicians, technicians to track and resolve assigned outages, and administrators to oversee the entire system with analytics and audit capabilities.

The platform solves the real-world problem of uncoordinated outage reporting and resolution by providing a centralized, role-based platform where:
- **Customers** report outages with location hierarchy (Zone → Substation → Feeder → Area)
- **Operators** manage grid infrastructure, dispatch technicians, create load-shedding schedules
- **Technicians** receive assignments, update status in real-time, track performance
- **Admins** oversee users, payments, audit logs, and system-wide analytics

The frontend communicates with a RESTful backend API via TanStack Query for server state management, using cookie-based authentication with JWT tokens. All critical workflows (outage lifecycle, technician onboarding, SLA subscriptions, priority restoration payments, load-shedding scheduling) are fully implemented and integrated with the backend API.

---

## Key Features

### Authentication & Authorization
- **JWT-based authentication** with HttpOnly cookie storage
- **OTP-based email verification** for registration and technician applications
- **Role-based access control** (CUSTOMER, TECHNICIAN, POWER_OPERATOR, ADMIN)
- **Protected routes** with middleware and client-side guards
- **Google OAuth** support
- **Forgot/Reset password** with OTP flow
- One-click demo login for all 4 roles

### Customer Features
- **Outage reporting** with location hierarchy (Zone → Substation → Feeder → Area)
- **Outage tracking** with real-time status timeline (PENDING → ASSIGNED → IN_PROGRESS → RESOLVED → RESTORED)
- **Priority restoration** via SSLCommerz payment (jumps outage to top of work queue)
- **SLA subscriptions** (30-day, auto-renewal, priority flag on outages)
- **Payment history** with SSLCommerz integration (success/failure/cancel callbacks)
- **Profile management** with avatar upload

### Technician Features
- **Assigned outages list** with filters (ASSIGNED, IN_PROGRESS, RESOLVED)
- **Status transitions** (ASSIGNED → IN_PROGRESS → RESOLVED → RESTORED)
- **Resolution notes** and timestamps (assignedAt, inProgressAt, resolvedAt)
- **Performance dashboard** (first-time fix rate, avg resolution time, workload)
- **Profile management**

### Power Operator Features
- **Grid hierarchy management** (Zone → Substation → Feeder → Area CRUD)
- **Outage management & dispatch** (assignment, priority flagging, status control)
- **Load-shedding scheduler** (FEEDER/AREA based, recurrence, conflict detection)
- **Technician application review** (approve/reject with OTP, auto-credential generation)
- **Operational analytics** (MTTR, assignment time, first-time fix rate, critical feeders)
- **Geographical analytics** (outages by area/zone, worst feeders)
- **Trend analytics** (daily outages, peak load-shedding hours)
- **Audit log viewer** with filters and export

### Admin Features
- **Executive dashboard** (users, revenue, SLA, outages KPIs)
- **User management** (CRUD, role/status toggle, pagination, search)
- **Application oversight** (approve/reject technician applications)
- **Payment management** (all transactions, filters, refunds)
- **Financial analytics** (revenue by type, success rates, payment status breakdown)
- **Operational analytics** (MTTR, assignment time, first-time fix, critical feeders)
- **Geographical analytics** (outages by area/zone, worst feeders)
- **Audit logs** (entity/action/date/role filters, export)
- **Grid management & outage oversight**

### Grid Management
- **Hierarchical structure**: Zone → Substation → Feeder → Area
- **Tabbed CRUD interface** for each hierarchy level
- **Relationship visualization** with counts (substations/zone, feeders/substation, areas/feeder)
- **Active/inactive status** toggle

### Load-Shedding Scheduling
- **Schedule creation** (FEEDER/AREA based, start/end time, recurrence)
- **Recurrence support** (NONE, DAILY, WEEKLY, MONTHLY with day selection)
- **Conflict detection** (visual overlap highlighting)
- **Status management** (SCHEDULED → ACTIVE → COMPLETED → CANCELLED)
- **Filtering, sorting, pagination**

### Payment / SLA / Priority Restoration
- **SSLCommerz integration** (test mode)
- **Priority restoration** (BDT 500, links to outage, jumps queue on success)
- **SLA subscription** (30-day, BDT amount, auto-expiry, priority flag on outages)
- **Payment flow**: initiate → SSLCommerz redirect → success/fail/cancel callbacks → backend verification → activate SLA/priority
- **Payment history** with filters (status, type, date range)
- **Admin refund flow** with audit trail

### Analytics
- **Operational**: active outages, priority outages, available/total technicians, active schedules
- **Performance**: MTTR, avg assignment time, first-time fix rate, technician workload
- **Geographical**: outages by area/zone, top worst feeders
- **Financial**: total revenue, success rate, SLA subscriptions, revenue by type, payment status breakdown
- **Trends**: daily outages (30-day bar chart), peak load-shedding hours
- **Customer/Technician summaries** with KPI cards

### Audit Logging
- **Entity/Action/Date/Role filters**
- **Pagination, date range, export**
- **Entity types**: outage, schedule, user, application, payment, zone, substation, feeder, area
- **Actor metadata** (ID, name, email, role)

### Notifications
- **Sonner toast notifications** for all async operations
- **Real-time status updates** via TanStack Query invalidation

---

## User Roles

| Role | Primary Responsibilities | Key Pages |
|------|-------------------------|-----------|
| **CUSTOMER** | Report outages, track status, manage SLA, make payments, view schedules | Dashboard, My Outages, Report Outage, SLA, Payments, Profile |
| **TECHNICIAN** | View assigned outages, update status, add resolution notes, track performance | Dashboard, Assigned Outages, Outage Detail, Performance Summary, Profile |
| **POWER_OPERATOR** | Grid management, outage dispatch, scheduling, technician applications, analytics | Dashboard, Grid, Outages, Schedules, Applications, Analytics, Audit Logs |
| **ADMIN** | User management, payments, analytics, audit logs, grid oversight, system health | Dashboard, Users, Applications, Payments, Analytics, Audit Logs, Grid, Outages |

---

## Core Workflows

### Outage Lifecycle
```
Customer reports outage (with location hierarchy)
      ↓
Operator reviews → Assigns technician (ASSIGNED)
      ↓
Technician starts work (IN_PROGRESS) → Resolves (RESOLVED)
      ↓
Operator confirms restoration (RESTORED)
```
- **Priority path**: Customer pays via SSLCommerz → Outage jumps to top of queue
- **Timestamps tracked**: reportedAt, assignedAt, inProgressAt, resolvedAt, restoredAt

### Grid Hierarchy
```
Zone
  └── Substation
        └── Feeder
              └── Area
```

### Load-Shedding Schedule
```
Create schedule (type, area/feeder, start/end, recurrence)
      ↓
Conflict detection (visual overlap)
      ↓
Publish → Customer notification → Execute
```

### Technician Onboarding
```
Public application (name, email, phone, skills, experience)
      ↓
Email OTP verification (1-hour TTL)
      ↓
Operator/Admin review → Approve/Reject
      ↓
Approved → User created (TECHNICIAN role) → Temp password emailed
```

### Payment / SLA / Priority Restoration
```
Customer clicks "Make Priority" / "Subscribe SLA"
      ↓
POST /payment → Payment PENDING → SSLCommerz redirect
      ↓
SSLCommerz success → Cascade validation + prisma.$transaction:
  • Payment → SUCCESS
  • Priority: outage.isPriority = true + queue jump
  • SLA: slaActive = true, slaExpiryDate = now + 30d, isPriority = true on outages
      ↓
Toast notification → Redirect to success page
```

---

## Application Pages / Routes

### Public
| Route | Description |
|-------|-------------|
| `/` | Home / Landing |
| `/about` | About page |
| `/services` | Services / Features |
| `/contact` | Contact |
| `/pricing` | Pricing / FAQ |

### Authentication
| Route | Description |
|-------|-------------|
| `/auth/login` | Login with One-Click Demo buttons (3 roles) |
| `/auth/register` | Register with OTP verification |
| `/auth/verify-email` | OTP email verification |
| `/auth/forgot-password` | Forgot password (OTP) |
| `/auth/reset-password` | Reset password |

### Customer (CUSTOMER)
| Route | Description |
|-------|-------------|
| `/customer` | Dashboard (stats, recent outages, SLA status, quick actions) |
| `/customer/outages` | My Outages list (filters, pagination) |
| `/customer/outage/report` | Report new outage (location hierarchy, priority) |
| `/customer/outage/[id]` | Outage detail (timeline, status, technician) |
| `/customer/sla` | SLA plans, subscription, status |
| `/customer/payments` | Payment history (filters, pagination) |
| `/customer/profile` | Profile (name, phone, address, avatar) |

### Technician (TECHNICIAN)
| Route | Description |
|-------|-------------|
| `/technician` | Dashboard (stats, assigned tasks, performance) |
| `/technician/outages` | Assigned outages list (filters) |
| `/technician/outage/[id]` | Outage detail (status actions, timeline, notes) |
| `/technician/summary` | Performance (fix rate, avg time, workload) |
| `/technician/profile` | Profile, skills, certifications |

### Power Operator (POWER_OPERATOR)
| Route | Description |
|-------|-------------|
| `/operator` | Dashboard (stats, quick actions, critical feeders, schedules) |
| `/operator/grid` | Grid hierarchy (tabs: Zones, Substations, Feeders, Areas) |
| `/operator/outages` | All outages (search, filters, assign, status, priority) |
| `/operator/schedules` | Schedule list (filters, pagination) |
| `/operator/schedules/create` | Create schedule (type, location, timing, recurrence) |
| `/operator/applications` | Technician applications (review modal, approve/reject) |
| `/operator/analytics` | Operational, performance, geographical, trends analytics |
| `/operator/audit-logs` | Audit logs (filters, export) |

### Admin (ADMIN)
| Route | Description |
|-------|-------------|
| `/admin` | Dashboard (KPIs, quick links, financial, recent outages) |
| `/admin/users` | User management (CRUD, roles, status, pagination) |
| `/admin/applications` | Technician applications (review, approve/reject) |
| `/admin/payments` | All payments (filters, pagination, refund) |
| `/admin/analytics` | Platform, financial, performance, geo, trends analytics |
| `/admin/audit-logs` | System audit logs (filters, export) |
| `/admin/grid` | Grid hierarchy management |
| `/admin/outages` | Outage oversight (full CRUD) |

### Payment
| Route | Description |
|-------|-------------|
| `/payment/success` | SSLCommerz success callback (verify, activate SLA/priority) |
| `/payment/cancel` | SSLCommerz cancel (cancelled/declined/timeout) |

### System
| Route | Description |
|-------|-------------|
| `/not-found` | Custom 404 page |
| `/error` | Global error boundary |

---

## Technology Stack

### Frontend
| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 16.3.7 |
| Language | TypeScript | 5.x |
| Runtime | React | 19.2.8 |
| Package Manager | Bun | 1.4.2 |
| Styling | Tailwind CSS | v4 |
| UI Library | shadcn/ui (Radix UI) | base-nova style |
| State Management | TanStack Query | v5.104.0 |
| Forms | React Hook Form + Zod | latest |
| Auth | Custom JWT + Middleware | Custom |
| Payment | SSLCommerz | Test Mode |
| Charts | Recharts | latest |
| Icons | Lucide React | 1.48.0 |
| Notifications | Sonner | 2.0.8 |
| Linting | Biome | 2.4.2 |
| React Compiler | Enabled | 1.0.0 |

### Backend (Reference)
| Category | Technology |
|----------|------------|
| Runtime | Node.js + Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Cache | Redis |
| Auth | JWT (HttpOnly cookies) |
| Payment | SSLCommerz |
| Email | Nodemailer |
| File Upload | Cloudinary |
| Scheduler | node-cron |

---

## Frontend Architecture

### Folder Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (public)/           # Public routes (auth pages)
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── customer/       # Customer portal
│   │   ├── technician/     # Technician portal
│   │   ├── operator/       # Operator portal
│   │   ├── admin/          # Admin console
│   │   └── layout.tsx      # Dashboard layout (sidebar, header, breadcrumbs)
│   ├── layout.tsx          # Root layout (providers, fonts)
│   ├── page.tsx            # Home page
│   └── globals.css         # Tailwind + CSS variables
├── api/                    # API modules (ofetch-based)
│   ├── auth.api.ts
│   ├── outage.api.ts
│   ├── schedule.api.ts
│   ├── payment.api.ts
│   ├── grid.api.ts
│   ├── user.api.ts
│   ├── application.api.ts
│   ├── analytics.api.ts
│   └── index.ts            # Barrel export
├── components/
│   ├── ui/                 # 21 shadcn/ui components
│   └── layout/             # Sidebar, Header, Breadcrumbs, UserMenu
├── hooks/                  # TanStack Query hooks
│   ├── *.hook.ts           # Feature-specific hooks
│   ├── useAuth.ts
│   ├── usePagination.ts
│   ├── useDebounce.ts
│   ├── useMobile.ts
│   └── index.ts
├── lib/
│   ├── apiClient.ts        # ofetch client + api.* helpers
│   └── utils.ts            # cn() class merger
├── providers/
│   ├── index.tsx           # Providers composition
│   ├── auth.provider.tsx   # AuthProvider + QueryClientProvider
│   └── query.provider.tsx  # QueryClientProvider
├── types/                  # Centralized TypeScript types
│   ├── *.type.ts           # Domain-specific types
│   └── index.ts            # Barrel export
├── validation/             # Zod schemas
└── routes/                 # Route definitions
```

### Architectural Decisions
- **API + Hooks pattern**: `src/api/*.api.ts` modules + `src/hooks/*.hook.ts` (TanStack Query)
- **Centralized types**: `src/types/*.type.ts` with barrel export at `src/types/index.ts`
- **Providers composition**: `AuthProvider` (with embedded QueryClient) + `Toaster` in `Providers`
- **Route groups**: `(public)` for auth, `(dashboard)` with role-based sub-routes
- **Role checks**: `useAuth()` hook → `user.role` for conditional rendering
- **API calls**: `api.get/post/put/patch/delete` from `@/lib/apiClient`
- **Forms**: React Hook Form + Zod resolver, real-time validation
- **No `useMemo`/`useCallback`**: React Compiler handles memoization
- **Class merging**: `cn()` utility from `@/lib/utils`

---

## Backend Integration

### Backend Repository
- **Repository**: https://github.com/mehedihasanrafi205/PowerGridBD-Backend
- **Live API**: https://powergridbd-backend.vercel.app

### API Communication
- **Base URL**: `NEXT_PUBLIC_BASE_URL` (e.g., `https://powergridbd-backend.vercel.app/api/v1`)
- **Client**: `ofetch` with `credentials: "include"` for cookie-based auth
- **Wrapper**: `src/lib/apiClient.ts` → `api.get/post/put/patch/delete`

### Authentication
- **Mechanism**: JWT in HttpOnly cookies
- **Endpoints**: `/auth/login`, `/auth/register`, `/auth/verify-email`, `/auth/me`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/google`
- **Session**: Hydrated on client via `AuthProvider` → `getMe()` call

### Authorization
- **Middleware**: Route protection via `middleware.ts`
- **Role checks**: Frontend `useAuth()` → `user.role` for UI; Backend enforces per-endpoint

### Query Parameters (Supported)
- **Pagination**: `page`, `limit`
- **Search**: `searchTerm`
- **Filters**: `status[]`, `type[]`, `areaId`, `isPriority`, `role`, `status`, `entity`, `action`, `from`, `to`
- **Sorting**: `sortBy`, `sortOrder` (asc/desc)
- **URL sync**: `useSearchParams` for filter/sort/pagination persistence

### Error Handling
- **API**: Standardized `ApiResponse<T>` with `success`, `statusCode`, `message`, `data`, `meta`
- **Frontend**: Toast notifications (Sonner) + `error.tsx` boundary + `loading.tsx` skeletons

---

## Authentication & Authorization

### Registration Flow
1. User submits name, email, password, confirmPassword
2. Backend sends OTP to email (10-min TTL)
3. User submits OTP → `/auth/verify-email`
2. Success → User created, redirected to login

### Login
- Email + Password → `/auth/login` → JWT cookies set
- **Demo login**: One-click buttons for CUSTOMER, TECHNICIAN, POWER_OPERATOR, ADMIN

### OTP Verification
- 6-digit code, 10-min TTL (registration), 1-hour (technician applications)
- Resend OTP with 60s cooldown

### Session Management
- `AuthProvider` creates client-side `QueryClient`
- `getMe()` called on mount (client-side only)
- `useAuth()` hook provides `user`, `isLoading`, `isAuthenticated`, `refresh()`

### Route Protection
- **Middleware**: Protects `/dashboard/*`, `/admin/*`, `/operator/*`, `/customer/*`, `/technician/*`
- **Dashboard layout**: Redirects to login if `!isAuthenticated`
- **Role-based nav**: `navItems` filtered by `user.role`

### Password Reset
1. `/auth/forgot-password` → email → OTP sent
2. `/auth/reset-password` → OTP + new password + confirm

---

## Payments

### Products
| Product | Type | Amount | Effect |
|---------|------|--------|--------|
| Priority Restoration | PRIORITY_RESTORATION | BDT 500 | `outage.isPriority = true`, queue jump |
| SLA Subscription | SLA_SUBSCRIPTION | Configurable | `slaActive=true`, `slaExpiryDate=now+30d`, `isPriority=true` on outages |

### Flow
```
1. Customer clicks "Make Priority" / "Subscribe SLA"
2. POST /payment {type, amount, outageId?} → Payment PENDING
3. Redirect to SSLCommerz gatewayUrl
4. SSLCommerz callbacks:
   - Success: POST /payment/success → cascade validation + prisma.$transaction
     • Payment → SUCCESS
     • Priority: outage.isPriority = true + queue jump
     • SLA: slaActive=true, slaExpiryDate=now+30d
   - Fail: POST /payment/fail → Payment → FAILED
   - Cancel: POST /payment/cancel → Payment → CANCELLED
5. Frontend on mount: fetch verification → activate SLA/priority UI
```

### Admin Refund
- `POST /payment/refund {paymentId}` → `prisma.$transaction`:
  - Payment → REFUNDED
  - Priority: `outage.isPriority = false`
  - SLA: `slaActive = false`, clear `slaExpiryDate`
  - AuditLog write

### Frontend Pages
- `/customer/sla` - Plans, features, subscribe
- `/customer/payments` - History (status, type, date filters)
- `/payment/success` - Verify → activate
- `/payment/cancel` - Cancel/declined/timeout messages

---

## UI / UX

### Design System
- **Colors**: Deep Charcoal `#0F172A`, Electric Blue `#007BFF`, Smart Teal `#13C8A3`, Amber `#F59E0B`, Emerald `#10B981`, White `#FFFFFF`
- **Typography**: Geist Sans/Mono + Inter (via `next/font`)
- **Components**: shadcn/ui "base-nova" style (21 components)
- **Dark mode**: `.dark` class support via CSS variables

### Responsive Design
- **Breakpoints**: xs (<640), sm (≥640), md (≥768), lg (≥1024), xl (≥1280), 2xl (≥1536)
- **Sidebar**: Collapsed icons (lg), Hamburger drawer (mobile)
- **Tables**: Column stack (mobile), Action menu dropdown (mobile)
- **Charts**: Responsive Recharts (legend reposition, bar reduction)

### Dashboard UI
- **Stat cards** with icons, trends, color-coded
- **Data tables** with pagination, search, filters, sort
- **Status badges** (color-coded per status)
- **KPI cards** with progress bars (targets)
- **Charts**: Recharts (bar, line, area, pie)

### Forms
- **React Hook Form + Zod** validation
- **Real-time errors** on blur/submit
- **Date pickers**: datetime-local (15-min steps)
- **File upload**: Avatar (5MB, JPEG/PNG/WebP, progress bar)

### States
- **Loading**: `loading.tsx` per route + `SkeletonCard/Table/Image/Button`
- **Empty**: Illustrated (icon + message + CTA)
- **Error**: Toast (Sonner) + `error.tsx` boundary + inline field errors

---

## Environment Variables

```env
# Required
NEXT_PUBLIC_BASE_URL=https://powergridbd-backend.vercel.app/api/v1

# Optional (when features implemented)
# NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxxxxxxxxx
```

### Backend (separate .env)
```
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
REDIS_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Getting Started

### Prerequisites
- **Bun** ≥ 1.4.2
- **Node.js** ≥ 20
- Backend API running (see backend repo)

### Installation
```bash
cd powergridbd
bun install
```

### Environment Setup
```bash
cp .env.example .env.local  # Create with NEXT_PUBLIC_BASE_URL
```

### Development
```bash
bun dev          # Turbopack dev server on http://localhost:3000
```

### Production Build
```bash
bun run build    # Next.js production build
bun run start    # Serve production build
```

### Code Quality
```bash
bun run lint     # Biome check
bun run format   # Biome format --write
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Dev server (Turbopack) |
| `bun run build` | Production build |
| `bun start` | Serve production build |
| `bun run lint` | Biome check |
| `bun run format` | Biome format --write |

---

## Deployment

### Production Build
```bash
bun run build
```
Outputs static + dynamic pages to `.next/`. Dynamic routes (`/customer/outage/[id]`, `/technician/outage/[id]`) are server-rendered on demand.

### Environment Variables
Set in deployment platform (Vercel, Netlify, Cloudflare):
- `NEXT_PUBLIC_BASE_URL` - Backend API URL

### Backend Requirements
- Backend API must be accessible at `NEXT_PUBLIC_BASE_URL`
- CORS configured for frontend domain
- SSLCommerz webhook URLs configured

### Recommended Platform
- **Vercel** (native Next.js support)
- **Netlify** / **Cloudflare Pages** (with adapter)

### Build Output
```
Route (app)                              Size     Type
├ ○ /                                    Static
├ ○ /_not-found                          Static
├ ○ /admin                               Static
├ ○ /admin/analytics                     Static
├ ○ /admin/applications                  Static
├ ○ /admin/audit-logs                    Static
├ ○ /admin/grid                          Static
├ ○ /admin/outages                       Static
├ ○ /admin/payments                      Static
├ ○ /admin/users                         Static
├ ○ /auth/login                          Static
├ ○ /auth/register                       Static
├ ○ /auth/verify-email                   Static
├ ○ /customer                            Static
├ ƒ /customer/outage/[id]                Dynamic
├ ○ /customer/outage/report              Static
├ ○ /customer/outages                    Static
├ ○ /customer/payments                   Static
├ ○ /customer/profile                    Static
├ ○ /customer/sla                        Static
├ ○ /operator                            Static
├ ƒ /operator/analytics                  Static
├ ○ /operator/applications               Static
├ ○ /operator/audit-logs                 Static
├ ○ /operator/grid                       Static
├ ○ /operator/outages                    Static
├ ○ /operator/schedules                  Static
├ ○ /operator/schedules/create           Static
├ ○ /technician                          Static
├ ƒ /technician/outage/[id]              Dynamic
├ ○ /technician/outages                  Static
├ ○ /technician/profile                  Static
├ ○ /technician/summary                  Static
├ ○ /auth/login                          Static
├ ○ /auth/register                       Static
├ ○ /auth/verify-email                   Static
```

---

## API / Repository Links

| Resource | Link |
|----------|------|
| **Frontend Repository** | https://github.com/mehedihasanrafi205/PowerGridBD |
| **Backend Repository** | https://github.com/mehedihasanrafi205/PowerGridBD-Backend |
| **Backend Live API** | https://powergridbd-backend.vercel.app |
| **Live Application** | https://powergridbd.vercel.app |

---

## Project Status

| Aspect | Status |
|--------|--------|
| Core Features | ✅ Complete |
| All 4 Roles | ✅ Implemented |
| Authentication | ✅ Complete |
| Payment Integration | ✅ Complete (SSLCommerz test mode) |
| 32 Routes | ✅ Implemented |
| TypeScript | ✅ Strict mode, zero errors |
| Build | ✅ Passing (35 pages) |
| Deployment | ✅ Production-ready |

**Status**: Production-oriented, feature-complete for assignment requirements. Ready for deployment to Vercel/Netlify/Cloudflare with backend API.

---

## Future Improvements

*Not yet implemented - clearly labeled as future work*

- [ ] Unit tests for critical hooks (outage, payment, auth)
- [ ] E2E tests for critical flows (outage report, payment, technician workflow)
- [ ] Storybook for component documentation
- [ ] Service worker for offline support
- [ ] WebSocket/SSE for real-time outage status updates
- [ ] Multi-language support (Bangla/English)
- [ ] Advanced map visualization (Mapbox integration)
- [ ] Scheduled report generation (PDF/Excel export)
- [ ] Advanced notification system (email/SMS/push)
- [ ] Performance monitoring (Web Vitals, Sentry)

---

## Author

**Mehedi Hasan Rafi**  
GitHub: [@mehedihasanrafi205](https://github.com/mehedihasanrafi205)

---

## License

MIT License - See [LICENSE](LICENSE) for details.