# PowerGridBD

PowerGridBD is a web application for Bangladesh-focused power-grid visibility and outage operations. This repository contains the Next.js frontend. Its REST API is maintained separately in [PowerGridBD-Backend](https://github.com/mehedihasanrafi205/PowerGridBD-Backend).

The platform brings customer outage reporting, technician work, grid and schedule management, payments, and role-based operations dashboards into one interface. The landing-page network map is explicitly a demonstration topology; it does not represent live grid telemetry.

## Project links

| Resource | URL |
| --- | --- |
| Frontend | [powergridbd.vercel.app](https://powergridbd.vercel.app/) |
| Backend API | [powergridbd-backend.vercel.app](https://powergridbd-backend.vercel.app/) |
| Backend source | [mehedihasanrafi205/PowerGridBD-Backend](https://github.com/mehedihasanrafi205/PowerGridBD-Backend) |

The frontend and backend URLs are the project links supplied for this README; their availability is not guaranteed by this repository.

## Features

- **Grid visualization:** An interactive Leaflet map, grid hierarchy pages, and a landing-page topology marked as demonstration data.
- **Outage operations:** Customer outage reports, technician assignment, status updates, and role-scoped report views.
- **Grid management:** Zones, substations, feeders, and areas, with management tools for administrators and power operators.
- **Load-shedding schedules:** Create, review, update, and manage schedules associated with feeders or areas.
- **Role-based workspaces:** Separate dashboards for customers, technicians, power operators, and administrators.
- **Analytics and audit history:** Operational, performance, geographical, financial, and trend views; customer and technician summaries; and an admin audit-log view.
- **Technician onboarding:** Application submission, email verification, and operator/admin review.
- **Payments:** Backend SSLCommerz flows for priority-restoration and SLA-subscription payment types, including provider callbacks and refunds.
- **Account features:** Email-OTP registration and password recovery, Google sign-in, profile editing, and profile-image upload.
- **Public information pages:** Landing, about, services, pricing, and contact pages. The contact form validates input and opens a prefilled email in the visitor's mail client; it does not submit to a contact API.

## Technology

| Area | Technologies found in the project |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript |
| Frontend data and forms | TanStack Query, `ofetch`, Zod, React Hook Form |
| Backend (separate repository) | Express 5, TypeScript |
| Database | PostgreSQL with Prisma 7 and the `pg` adapter |
| Authentication | JWT access/refresh tokens, `bcryptjs`, Google OAuth; the frontend stores returned tokens in browser `localStorage` and sends bearer tokens |
| Maps | Leaflet, React Leaflet, Stadia Maps Alidade Smooth Dark tiles |
| UI and styling | Tailwind CSS 4, shadcn/ui components, Biome |
| Animation and charts | GSAP, Framer Motion, Lenis, CSS/Intersection Observer animations, Recharts |
| Backend integrations | Redis for OTP-related storage, Nodemailer/SMTP, Cloudinary uploads, SSLCommerz payments |
| Deployment configuration | Frontend static export; backend Vercel routing configuration |

The frontend is configured with `output: "export"` and produces static files in `out/`. It calls the separate API from the browser; it does not contain the Express backend or a frontend API route implementation.

## Architecture

```text
Browser
  └── Next.js static frontend
        └── ofetch API client (/api/v1)
              └── Express backend (separate repository)
                    ├── Feature routes → controllers → services
                    ├── Prisma → PostgreSQL
                    └── Redis, SMTP, Cloudinary, Google OAuth, SSLCommerz
```

The frontend groups route pages using the App Router, composes API calls in `src/api/`, and uses hooks and TanStack Query for client-side data fetching. Authentication state and the query client are provided by `src/providers/`. Shared UI, map, landing, and animation components live under `src/components/`.

The backend organizes its API by feature module. Its Express application mounts the modules under `/api/v1`; authorization middleware checks the JWT, account status, and any required role. The backend repository also contains the Prisma schema and database migrations.

### Important frontend directories

| Path | Contents |
| --- | --- |
| `src/app/` | Public, authentication, application, payment-result, and role-based dashboard pages |
| `src/api/` | Typed client functions for auth, users, grid, outages, schedules, payments, applications, and analytics |
| `src/components/landing/` | Public landing-page sections |
| `src/components/map/` | Leaflet map, map types, styles, and demonstration topology |
| `src/components/animation/` | Lenis, GSAP, and reduced-motion providers |
| `src/components/ui/` | Shared UI components |
| `src/hooks/` | Query and feature hooks |
| `src/lib/` | API client, utilities, and shared helpers |
| `src/providers/` | Authentication and application providers |
| `src/types/` | Shared frontend types |
| `e2e/` | Playwright end-to-end tests |

## User roles

These roles are enforced by the backend API. Dashboard navigation is also role-aware in the frontend; hiding a link is not a substitute for backend authorization.

| Role | Main capabilities |
| --- | --- |
| `CUSTOMER` | Report and follow outages, view schedules and personal summaries, manage a profile, and use customer payment/SLA pages |
| `TECHNICIAN` | View assigned outage work, update eligible work statuses, and view technician summary/profile pages |
| `POWER_OPERATOR` | Manage grid resources and schedules, assign technicians, review technician applications, and view operational analytics |
| `ADMIN` | Manage users and roles, oversee grid and outage operations, and access administration, payments, analytics, and audit-log pages |

Technician access is associated with the application/review flow or a role grant. Power-operator and administrator privileges are managed by the backend rather than public registration.

## Pages and routes

The paths below are frontend pages. Dashboard pages are intended for signed-in users with the corresponding role.

| Page/route | Purpose | Access |
| --- | --- | --- |
| `/` | Public landing page | Public |
| `/about`, `/services`, `/pricing`, `/contact` | Public project information, pricing, and contact form | Public |
| `/auth/login`, `/auth/register`, `/auth/verify-email` | Sign-in, customer registration, and email verification | Public |
| `/auth/forgot-password`, `/auth/reset-password` | Password recovery | Public |
| `/apply`, `/apply/verify` | Technician application and verification | Public |
| `/payment/success`, `/payment/cancel` | Payment-provider return pages | Public |
| `/customer`, `/customer/outage`, `/customer/outages`, `/customer/outage/report` | Customer dashboard and outage reporting | Customer |
| `/customer/payments`, `/customer/schedules`, `/customer/sla`, `/customer/profile` | Customer account and service pages | Customer |
| `/technician`, `/technician/outage`, `/technician/outages`, `/technician/summary`, `/technician/profile` | Technician dashboard, work, summary, and profile | Technician |
| `/operator`, `/operator/outage`, `/operator/outages`, `/operator/grid`, `/operator/schedules`, `/operator/schedules/create` | Operator dashboard and grid/outage/schedule tools | Power operator |
| `/operator/analytics`, `/operator/applications`, `/operator/audit-logs` | Operator analytics and application/audit-log pages | Power operator UI |
| `/admin`, `/admin/outage`, `/admin/outages`, `/admin/grid`, `/admin/users`, `/admin/payments` | Administrative dashboard and management pages | Admin |
| `/admin/analytics`, `/admin/applications`, `/admin/audit-logs` | Administrative analytics, application, and audit-log pages | Admin |

## API reference

The API is maintained in the separate backend repository. The route and access details below are based on its checked-in route modules at revision `22ecab16250d992043c82f9bacfbd6c6a9aae880`; check that repository for subsequent changes.

| Environment | API base URL |
| --- | --- |
| Local backend | `http://localhost:5000/api/v1` |
| Project-provided deployment | `https://powergridbd-backend.vercel.app/api/v1` |

The backend also exposes `GET /` (outside `/api/v1`) as a basic service response. Authenticated routes accept a bearer token or the backend's authentication cookie. The frontend API client currently persists token values in `localStorage` and attaches the access token as a bearer token.

In the tables, **any authenticated role** means `CUSTOMER`, `TECHNICIAN`, `POWER_OPERATOR`, or `ADMIN`.

### Authentication — `/auth`

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/register` | Public | Register a customer and send an email verification OTP |
| `POST` | `/verify-email` | Public | Verify the registration OTP |
| `POST` | `/login` | Public | Authenticate with credentials |
| `GET` | `/me` | Any authenticated role | Retrieve the current user |
| `POST` | `/refresh-token` | Public route; refresh cookie required | Issue refreshed tokens |
| `POST` | `/google` | Public | Google sign-in |
| `POST` | `/forgot-password` | Public | Start password recovery |
| `POST` | `/reset-password` | Public | Complete password recovery |

### Users — `/user`

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `PATCH` | `/profile` | Any authenticated role | Update the current profile |
| `PATCH` | `/profile-image` | Any authenticated role | Upload a profile image (`profileImage` multipart field) |
| `GET` | `/` | Admin | List users |
| `GET` | `/:id` | Admin | Retrieve a user |
| `PATCH` | `/:id/status` | Admin | Change user status |
| `PATCH` | `/:id/role` | Admin or power operator | Change a role; operator grants/revokes are limited to technician role |
| `DELETE` | `/:id` | Admin | Soft-delete a user |

### Grid — `/grid`

The resource paths are `/zones`, `/substations`, `/feeders`, and `/areas`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/zones`, `/substations`, `/feeders`, `/areas` | Any authenticated role | List grid resources |
| `POST` | `/zones`, `/substations`, `/feeders`, `/areas` | Admin or power operator | Create a grid resource |
| `PATCH` | `/zones/:id`, `/substations/:id`, `/feeders/:id`, `/areas/:id` | Admin or power operator | Update a grid resource |
| `DELETE` | `/zones/:id`, `/substations/:id`, `/feeders/:id`, `/areas/:id` | Admin or power operator | Delete a grid resource |

The backend route modules do not define `GET /:id` handlers for these grid resources.

### Outages — `/outage`

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/` | Customer | Report an outage |
| `GET` | `/` | Any authenticated role | List outage reports with role-scoped results |
| `GET` | `/:id` | Any authenticated role | Retrieve an outage report |
| `PATCH` | `/:id/assign` | Admin or power operator | Assign a technician |
| `PATCH` | `/:id/status` | Admin, power operator, or technician | Update outage status |
| `DELETE` | `/:id` | Admin, power operator, or customer | Delete an outage report, subject to service-level ownership/state rules |

### Schedules — `/schedule`

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/` and `/:id` | Any authenticated role | List or retrieve schedules |
| `POST` | `/` | Admin or power operator | Create a schedule |
| `PATCH` | `/:id` and `/:id/status` | Admin or power operator | Update a schedule or its status |
| `DELETE` | `/:id` | Admin or power operator | Delete a schedule |

### Payments — `/payment`

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/` | Customer | Initiate a payment |
| `POST` | `/ipn`, `/success`, `/fail`, `/cancel` | Public provider callbacks | Process SSLCommerz callbacks |
| `GET` | `/transaction/:id` | Any authenticated role | Retrieve a transaction |
| `GET` | `/my-payments` | Customer | List the current customer's payments |
| `POST` | `/refund` | Customer | Initiate a refund request |

### Analytics — `/analytics`

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/operational`, `/performance`, `/geographical`, `/financial`, `/trends` | Admin or power operator | Retrieve operational and business analytics |
| `GET` | `/my-summary` | Customer | Retrieve the customer summary |
| `GET` | `/technician-summary` | Technician | Retrieve the technician summary |
| `GET` | `/audit-logs` | Admin | Retrieve audit logs |

### Technician applications — `/applications`

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/`, `/verify-email`, `/resend-otp` | Public | Submit an application and verify/resend its email OTP |
| `GET` | `/my` | Public route; email query parameter | Check application status |
| `GET` | `/` | Admin or power operator | List applications |
| `PATCH` | `/:id/review` | Admin or power operator | Approve or reject an application |

### Frontend/backend integration gaps

The following calls or pages exist in the frontend, but corresponding handlers are absent from the backend route modules listed above. They should not be treated as available API features without confirming or implementing backend support:

| Frontend reference | Current backend route status |
| --- | --- |
| `POST /auth/logout` | No logout route is registered |
| `GET /payment/all` | No all-payments route is registered |
| `GET /analytics/technician-workload`, `GET /analytics/sla-plans`, `POST /analytics/sla/subscribe` | No matching analytics routes are registered |
| `GET /applications/:id` | No application-by-ID route is registered |
| `GET /grid/{zones,substations,feeders,areas}/:id` | The backend registers list/create/update/delete routes, but no grid-by-ID GET handlers |
| Operator audit-log page | The backend's `/analytics/audit-logs` route is restricted to admins |

## Environment variables

### Frontend

The frontend reads `NEXT_PUBLIC_BASE_URL` in `src/lib/apiClient.ts`. Set it before building; because it is a public Next.js variable, it is included in the browser bundle and must not contain a secret.

Create `.env.local` in the frontend root:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api/v1
```

For a deployed frontend, use the backend API base URL ending in `/api/v1`.

### Backend

The backend repository provides `.env.example`. The names below are taken from its configuration/example; values here are placeholders, not project credentials.

| Variables | Purpose |
| --- | --- |
| `NODE_ENV`, `PORT` | Runtime mode and HTTP port |
| `BACKEND_URL`, `FRONTEND_URL` | Backend callback URLs, frontend CORS origin, and redirects |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN` | JWT signing and token lifetimes |
| `BCRYPT_SALT_ROUNDS` | Password-hashing cost |
| `GOOGLE_CLIENT_ID` | Backend Google OAuth verification |
| `TESTER_ADMIN_NAME`, `TESTER_ADMIN_EMAIL`, `TESTER_ADMIN_PASSWORD` | Seeded administrator account |
| `TESTER_POWER_OPERATOR_NAME`, `TESTER_POWER_OPERATOR_EMAIL`, `TESTER_POWER_OPERATOR_PASSWORD` | Seeded power-operator account |
| `TESTER_TECHNICIAN_NAME`, `TESTER_TECHNICIAN_EMAIL`, `TESTER_TECHNICIAN_PASSWORD` | Seeded technician account |
| `REDIS_USER`, `REDIS_PASSWORD`, `REDIS_HOST`, `REDIS_PORT` | Redis connection for OTP storage |
| `EMAIL_SENDER`, `SMTP_USER`, `SMTP_PASSWORD` | Email sender and SMTP authentication |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Profile-image uploads |
| `SSLC_STORE_ID`, `SSLC_STORE_PASSWORD`, `SSLC_IS_LIVE` | SSLCommerz credentials and mode |
| `PRIORITY_RESTORATION_PRICE`, `SLA_SUBSCRIPTION_PRICE` | Server-side product prices; the backend code defaults these to 500 and 2000 respectively |

Do not commit `.env`, `.env.local`, real tester-account credentials, or any provider secrets.

## Local setup

### Frontend

Prerequisite: Bun (the project declares Bun 1.4.2).

```bash
git clone https://github.com/mehedihasanrafi205/PowerGridBD.git
cd PowerGridBD
bun install
```

Create `.env.local` as shown above, then run:

```bash
bun run dev
```

The frontend expects the API to be reachable at `NEXT_PUBLIC_BASE_URL`. To run the backend locally, use the separate setup below.

### Backend (separate repository)

Prerequisites: Node.js 20+, PostgreSQL, Redis, and working SMTP settings. The backend startup connects to PostgreSQL and Redis and verifies SMTP.

```bash
git clone https://github.com/mehedihasanrafi205/PowerGridBD-Backend.git
cd PowerGridBD-Backend
npm install
```

Copy `.env.example` to `.env`, replace every needed placeholder with private credentials, and set `FRONTEND_URL=http://localhost:3000` for local frontend development. Then prepare the database and start the API:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

The local API base URL is `http://localhost:5000/api/v1` when `PORT=5000`.

## Scripts

### Frontend

| Command | Script | Purpose |
| --- | --- | --- |
| `bun run dev` | `next dev` | Run the development server |
| `bun run build` | `next build` | Build the application and static export in `out/` |
| `bun run start` | `next start` | Script declared by the package; the configured production output is a static export, so deployment should serve `out/` as static files |
| `bun run lint` | `biome check` | Run Biome checks |
| `bun run test` | `bun test` | Run Bun tests |
| `bun run test:e2e` | `playwright test` | Run Playwright end-to-end tests |
| `bun run format` | `biome format --write` | Format files with Biome |

### Backend

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the TypeScript API with `tsx watch` |
| `npm run build` | Compile with TypeScript |
| `npm start` | Run `dist/src/server.js` |
| `npm run lint:check` / `npm run lint:fix` | Check or apply Biome lint fixes |
| `npm run format:check` / `npm run format:fix` | Check or apply Biome formatting |
| `npm test` | Placeholder script; the backend package currently exits with “no test specified” |

## Map configuration

The map uses Leaflet/React Leaflet and loads Stadia Maps' `alidade_smooth_dark` tile URL. The source includes attribution for Stadia Maps, OpenMapTiles, and OpenStreetMap. No map-provider API-key environment variable is configured in this frontend. Confirm the tile provider's current access requirements and usage terms before relying on it in production.

The landing-page map renders a deterministic topology with illustrative Bangladesh coordinates and statuses. The UI labels it “Demonstration topology”; the backend does not currently provide per-node map coordinates and live statuses to that map. Do not interpret its markers or status colors as live outage telemetry.

## Deployment

### Frontend

`next.config.ts` sets `output: "export"`. Run `bun run build` and deploy the generated `out/` directory to a static web host. Set `NEXT_PUBLIC_BASE_URL` in the build environment to the intended backend URL ending in `/api/v1`. This repository does not include a frontend-specific Vercel or other hosting configuration; the frontend URL above was supplied for this project.

### Backend

The backend repository contains a `vercel.json` that routes requests to `dist/src/server.js` using `@vercel/node`. Its package build script is `tsc`; ensure the deployment build produces the configured entry point and provide backend environment variables and external services in the hosting environment. Database, Redis, SMTP, and provider credentials must be provisioned separately.

## Screenshots and demo

Live links are listed under [Project links](#project-links). Screenshot files are not currently included in this repository.

> Screenshot placeholders: add captures for the landing page, customer workspace, and operator/admin dashboards under `docs/screenshots/`, then link them here.

## Future improvements

These are ideas, not claims about existing functionality:

- Connect the landing-page topology to authoritative grid coordinates and current statuses.
- Align the frontend's outstanding API calls with backend routes and access permissions.
- Add integration tests covering API authorization, payment callbacks, and end-to-end role workflows.

## License

No `LICENSE` file or license declaration is present in this frontend repository, so no frontend license is specified here. The separate backend package metadata declares `ISC`; that does not specify a license for this frontend repository.
