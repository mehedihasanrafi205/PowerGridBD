<div align="center">

# ⚡ PowerGridBD

### Nationwide Electrical Power Grid Visibility & Outage Operations Platform for Bangladesh

[![Next.js](https://img.shields.io/badge/Next.js-16.3.7-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-23272F?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-6.2.1-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Production-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-0284C7.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

<br />

<p align="center">
  <a href="https://powergridbd.vercel.app/"><strong>🌐 Live Application</strong></a> &nbsp;•&nbsp;
  <a href="https://powergridbd-backend.vercel.app/"><strong>⚡ Live API Service</strong></a> &nbsp;•&nbsp;
  <a href="https://github.com/mehedihasanrafi205/PowerGridBD"><strong>📦 Frontend Repository</strong></a> &nbsp;•&nbsp;
  <a href="https://github.com/mehedihasanrafi205/PowerGridBD-Backend"><strong>🛠️ Backend Repository</strong></a>
</p>

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Database Schema & ER Diagram](#-database-schema--er-diagram)
- [Role-Based Access Control](#-role-based-access-control)
- [Frontend Route Catalog](#-frontend-route-catalog)
- [Backend REST API Specification](#-backend-rest-api-specification)
  - [Authentication](#1-authentication---apiv1auth)
  - [User Management](#2-user-management---apiv1user)
  - [Grid Hierarchy](#3-grid-hierarchy---apiv1grid)
  - [Outage Incident Operations](#4-outage-incident-operations---apiv1outage)
  - [Load-Shedding & Maintenance Schedules](#5-load-shedding--maintenance-schedules---apiv1schedule)
  - [Payments & Webhooks](#6-payments--webhooks---apiv1payment)
  - [Analytics & SLA Engine](#7-analytics--sla-engine---apiv1analytics)
  - [Technician Applications](#8-technician-applications---apiv1applications)
  - [Integration Nuances & Discrepancies](#api-integration-nuances--verified-discrepancies)
- [Integrations Deep-Dive](#-integrations-deep-dive)
  - [SSLCommerz Payment Flow](#sslcommerz-payment-gateway-integration)
  - [Transactional Email System](#transactional-email-notification-system)
  - [Redis OTP Verification & Auto-Purge](#redis-otp-lifecycle--cache)
  - [Geospatial Topology Visualization](#geospatial-scada-style-map-engine)
- [Environment Variables](#-environment-variables)
- [Local Installation & Setup](#-local-installation--setup)
- [Available Scripts](#-available-scripts)
- [Deployment Configuration](#-deployment-configuration)
- [Project Directory Structure](#-project-directory-structure)
- [UI & Visual Design Aesthetics](#-ui--visual-design-aesthetics)
- [License & Credits](#-license--credits)

---

## 🌐 Overview

**PowerGridBD** is a full-stack, enterprise-grade electrical power grid dispatch and load-shedding governance platform engineered specifically for Bangladesh's power distribution ecosystem. The platform bridges the communication and dispatch gap between residential/commercial consumers, emergency field technicians, grid control operators, and utility administrators.

Traditional power distribution operations often suffer from fragmented incident reporting, opaque load-shedding schedules, manual technician dispatches, and delayed service recovery. PowerGridBD solves this by introducing a centralized, real-time command-and-control architecture:

- **Hierarchical Grid Topology**: A 4-tier relational structure (`Zone` → `Substation` → `Feeder` → `Area`) modeling the physical distribution tree down to localized residential feeders.
- **Incident Lifecycle Management**: End-to-end incident dispatching (`PENDING` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED` / `CANCELLED`) with automated customer alerts and priority escalation.
- **Load-Shedding & Maintenance Governance**: Chronological scheduling with client-side and server-side conflict detection to prevent overlapping feeder outages.
- **SLA Subscriptions & Priority Restorations**: Direct integration with the **SSLCommerz** payment gateway featuring automated IPN callbacks, cascade payment verification, and automated SLA lifecycle cron management.
- **Workforce Onboarding**: Self-service field technician recruitment flow secured by email OTP verification stored in Redis with automated TTL cleanup.
- **SCADA-Inspired Operations Canvas**: Dark-mode geospatial map powered by Leaflet, displaying substations, transmission lines, and incident statuses.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Client ["Client Layer (Next.js 16 + React 19)"]
        UI["Web App (App Router, Static Export)"]
        ReactQuery["TanStack React Query 5.104"]
        LeafletMap["Leaflet Map Engine (Dark Filter OSM)"]
        ZodForms["React Hook Form + Zod"]
        Motion["Framer Motion + GSAP + Lenis"]
    end

    subgraph CDN ["Edge & Delivery Layer"]
        VercelCDN["Vercel Global Edge Network (out/ directory)"]
    end

    subgraph Server ["Backend API Layer (Express 5.2.1)"]
        API["Express Application (/api/v1)"]
        AuthMiddleware["JWT & Role Authorization Guard"]
        CronEngine["Automated Hourly Cron Daemon"]
        PrismaORM["Prisma 7.10.0 ORM (@prisma/adapter-pg)"]
    end

    subgraph Storage ["Data & Cache Layer"]
        Postgres[("PostgreSQL 16 Database")]
        RedisDB[("Redis 6.2.1 (OTP TTL Cache)")]
        CloudinaryCDN[("Cloudinary CDN (User Avatars)")]
    end

    subgraph External ["External Third-Party Services"]
        SSLCommerz["SSLCommerz Hosted Payment Gateway"]
        GoogleOAuth["Google Identity OAuth Platform"]
        SMTPService["Gmail SMTP (Nodemailer + EJS Templates)"]
    end

    UI --> ReactQuery
    UI --> LeafletMap
    UI --> ZodForms
    UI --> Motion
    UI --> VercelCDN

    VercelCDN -.->|Browser HTTPS Requests| API
    API --> AuthMiddleware
    AuthMiddleware --> PrismaORM
    CronEngine --> PrismaORM
    CronEngine --> SMTPService

    PrismaORM --> Postgres
    API --> RedisDB
    API --> CloudinaryCDN
    API --> SSLCommerz
    API --> GoogleOAuth
    API --> SMTPService
```

---

## ⚡ Key Features

### 1. 4-Tier Grid Hierarchy Modeling
- Relational mapping of physical power infrastructure: **Zone** (regional division) → **Substation** (distribution substation) → **Feeder** (high-voltage transmission lines) → **Area** (local service cluster).
- Cascading referential integrity across the distribution hierarchy with administrative CRUD operations.

### 2. End-to-End Outage Lifecycle
- **Incident Reporting**: Customers report localized outages mapped directly to their assigned area.
- **Priority Escalation**: Outage tickets can be promoted with high priority (`isPriority: true`) either through customer purchase or administrative elevation.
- **Dispatch Tracking**: Operators assign vetted field technicians; technicians update incident progress (`PENDING` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED` / `CANCELLED`).
- **Automated Alerts**: Real-time notifications dispatched via HTML email at every stage of the incident lifecycle.

### 3. Load-Shedding & Grid Maintenance Scheduling
- Create and govern scheduled power interruptions for **Maintenance**, **Load Shedding**, and **Emergency Repair**.
- Feeder-level and Area-level scoping with start and end timestamps.
- Conflict detection preventing double-booking or contradictory maintenance windows on overlapping feeders.

### 4. SLA Subscriptions & Priority Restorations
- **Tiered SLA Plans**: Tier catalog (`BASIC`, `STANDARD`, `PREMIUM`, `ENTERPRISE`) defining guaranteed restoration speeds and features.
- **SSLCommerz Integration**: Hosted gateway checkout with IPN webhooks, bank transaction reconciliation, and fraud-prevention amount verification.
- **Automated Expiry Daemon**: Background cron worker scanning hourly to issue 7-day expiration warning emails and automatically deactivate expired subscriptions.

### 5. Verified Technician Workforce Management
- Public applicant portal (`/apply`) with multi-step registration.
- 6-digit email OTP verification backed by Redis with a 5-minute TTL.
- Administrative review console for Power Operators and Admins to inspect qualifications, approve credentials, or provide rejection reasons.

### 6. Geospatial SCADA-Style Map
- Custom Leaflet dark-filtered canvas rendering substations, transmission lines, and incident pins across Bangladesh.
- Interactive popups showing substation capacities, feeder connections, and operational statuses.

### 7. Enterprise Security & Audit Logging
- Stateless JWT authentication (access and refresh token pairs) and Google OAuth 2.0 integration.
- Strict Role-Based Access Control (RBAC) across four privilege levels.
- Actor-indexed audit log tracking sensitive system actions (`SLA_EXPIRED`, role changes, grid modifications).

---

## 🛠️ Technology Stack

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js** | `16.3.7` | App Router, static generation (`output: "export"`), modern React compiler |
| **Frontend Runtime** | **React** | `19.2.8` | Component architecture, modern React hooks, server component optimization |
| **Package Manager** | **Bun** | `1.4.2` | High-performance dependency management and build execution |
| **Frontend Styling** | **Tailwind CSS** | `v4` | CSS-first configuration, CSS variable design tokens, modern OKLCH color palettes |
| **UI Components** | **shadcn/ui** | `4.21.0` | Accessible component primitives built on `@radix-ui` and `@base-ui/react` |
| **Data Fetching** | **TanStack React Query** | `5.104.0` | Client-side server cache, query invalidation, pagination, and optimistic updates |
| **HTTP Client** | **ofetch** | `1.5.1` | Lightweight, robust fetch client with bearer token injection and 401 interception |
| **Form Validation** | **React Hook Form + Zod** | `7.89` / `4.6.5` | Type-safe form state governance and client-side schema validation |
| **Maps & Geospatial** | **Leaflet / React Leaflet** | `1.9.4` / `5.0.0` | Interactive map canvas with OpenStreetMap tiles and custom dark CSS filter |
| **Animations** | **GSAP + Framer Motion + Lenis** | `3.15` / `14.0` / `1.3` | Smooth scrolling, micro-interactions, modal transitions, and topology motion |
| **Charts & Metrics** | **Recharts** | `3.10.1` | Analytical charts for load distribution, outage trends, and financial reports |
| **Backend Framework** | **Express.js** | `5.2.1` | High-performance RESTful API microservice with modular routing |
| **Backend Language** | **TypeScript** | `7.0.2` | End-to-end type safety, compiled via `tsc` and executed via `tsx` |
| **Database** | **PostgreSQL** | `16` | Relational data persistence with strict foreign key constraints |
| **Database ORM** | **Prisma** | `7.10.0` | Type-safe queries, multi-file schema organization, `@prisma/adapter-pg` driver |
| **In-Memory Cache** | **Redis** | `6.2.1` | Ephemeral OTP storage, TTL expiration, and rate-limiting cache |
| **Authentication** | **JWT + bcryptjs** | `9.0.3` / `3.0.3` | Dual token issuance, password salting (10 rounds), bearer auth verification |
| **OAuth 2.0** | **google-auth-library** | `11.0.2` | Server-side Google token verification for social sign-in |
| **Payments** | **SSLCommerz** | Hosted API | Multi-channel Bangladesh payment gateway (bKash, Nagad, Cards) with IPN callback |
| **Media Storage** | **Cloudinary + Multer** | `2.11.0` / `2.3.0` | Multipart profile picture uploads with cloud media hosting |
| **Email Service** | **Nodemailer + EJS** | `9.1.1` / `6.0.1` | SMTP email dispatch with 15 HTML templated notification workflows |
| **Code Quality** | **Biome** | `2.4.2` / `2.5.11` | High-speed linting and formatting replacing ESLint and Prettier |
| **Hosting & CDN** | **Vercel** | Serverless / Edge | Static frontend hosting on Vercel CDN; backend deployed via Vercel Node runtime |

---

## 🗄️ Database Schema & ER Diagram

The backend database utilizes PostgreSQL 16 managed through Prisma 7.10 with a modular multi-file schema structure located in `prisma/schema/`.

```mermaid
erDiagram
    Zone ||--o{ Substation : "contains"
    Substation ||--o{ Feeder : "supplies"
    Feeder ||--o{ Area : "distributes to"
    Feeder ||--o{ Schedule : "scheduled on"
    Area ||--o{ User : "resides in"
    Area ||--o{ OutageReport : "occurred at"
    Area ||--o{ Schedule : "scheduled on"

    User ||--o{ OutageReport : "reports (Customer)"
    User ||--o{ OutageReport : "assigned to (Technician)"
    User ||--o{ Schedule : "creates (Operator/Admin)"
    User ||--o{ Payment : "initiates"
    User ||--o{ AuditLog : "acts in"
    User ||--o| TechnicianApplication : "applies via"
    User ||--o| SlaSubscription : "subscribes to"

    SlaPlan ||--o{ SlaSubscription : "tier defined by"
    SlaPlan ||--o{ Payment : "purchased via"
    OutageReport ||--o{ Payment : "priority paid via"

    Zone {
        string id PK
        string name UK
        string description
        datetime createdAt
        datetime updatedAt
    }

    Substation {
        string id PK
        string name
        string zoneId FK
        datetime createdAt
        datetime updatedAt
    }

    Feeder {
        string id PK
        string name
        string substationId FK
        datetime createdAt
        datetime updatedAt
    }

    Area {
        string id PK
        string name
        string feederId FK
        datetime createdAt
        datetime updatedAt
    }

    User {
        string id PK
        string name
        string email UK
        string googleId UK
        enum authProvider
        boolean emailVerified
        string password
        enum role
        enum status
        string phone
        string address
        string areaId FK
        string imageUrl
        boolean slaActive
        datetime slaExpiryDate
        datetime slaWarningSentAt
        boolean isDeleted
        datetime deletedAt
    }

    OutageReport {
        string id PK
        string description
        enum status
        boolean isPriority
        datetime reportedAt
        datetime resolvedAt
        datetime assignedAt
        string customerId FK
        string areaId FK
        string technicianId FK
    }

    Schedule {
        string id PK
        string title
        string description
        datetime startTime
        datetime endTime
        string reason
        enum type
        enum status
        string feederId FK
        string areaId FK
        string createdById FK
    }

    Payment {
        string id PK
        float amount
        string transactionId UK
        string gateway
        enum type
        enum status
        json paymentDetails
        string userId FK
        string outageReportId FK
        string planId FK
    }

    SlaPlan {
        string id PK
        string name
        string description
        enum tier
        decimal price
        int durationDays
        string[] features
        boolean isActive
    }

    SlaSubscription {
        string id PK
        string userId FK
        string planId FK
        datetime startDate
        datetime endDate
        boolean isActive
        string paymentId
    }

    TechnicianApplication {
        string id PK
        string name
        string email
        string phone
        string address
        string experience
        string bio
        enum status
        boolean emailVerified
        string rejectionReason
        string reviewedBy
        datetime reviewedAt
        string userId FK
    }

    AuditLog {
        string id PK
        string actorId FK
        string action
        string entity
        string entityId
        json metadata
        datetime createdAt
    }
```

### Database Enums
- **`UserRole`**: `CUSTOMER` | `TECHNICIAN` | `POWER_OPERATOR` | `ADMIN`
- **`UserStatus`**: `ACTIVE` | `BLOCKED` | `DELETED`
- **`OutageStatus`**: `PENDING` | `ASSIGNED` | `IN_PROGRESS` | `RESOLVED` | `CANCELLED`
- **`ScheduleType`**: `MAINTENANCE` | `LOAD_SHEDDING` | `EMERGENCY_REPAIR`
- **`ScheduleStatus`**: `SCHEDULED` | `ONGOING` | `COMPLETED` | `CANCELLED`
- **`PaymentStatus`**: `PENDING` | `COMPLETED` | `FAILED` | `REFUNDED`
- **`PaymentType`**: `PRIORITY_RESTORATION` | `SLA_SUBSCRIPTION`
- **`ApplicationStatus`**: `PENDING` | `APPROVED` | `REJECTED`
- **`AuthProvider`**: `CREDENTIAL` | `GOOGLE`
- **`SlaPlanTier`**: `BASIC` | `STANDARD` | `PREMIUM` | `ENTERPRISE`

---

## 👥 Role-Based Access Control

The platform enforces strict authentication via Bearer token verification in the `checkAuth` Express middleware. Every API route checks both account state (`status: ACTIVE`, `isDeleted: false`) and specific role permissions:

| Capability / Resource | `CUSTOMER` | `TECHNICIAN` | `POWER_OPERATOR` | `ADMIN` |
| :--- | :---: | :---: | :---: | :---: |
| **Submit Outage Incident** | ✅ | ❌ | ❌ | ❌ |
| **View Incident Reports** | ✅ (Own Area/Reports) | ✅ (Assigned Tasks) | ✅ (All Grid Incidents) | ✅ (Global) |
| **Update Incident Status** | ❌ | ✅ (`IN_PROGRESS` / `RESOLVED`) | ✅ (Any Status) | ✅ (Any Status) |
| **Assign Technician to Incident** | ❌ | ❌ | ✅ | ✅ |
| **Delete Incident Ticket** | ✅ (Own Pending) | ❌ | ✅ | ✅ |
| **View Load-Shedding Schedules** | ✅ | ✅ | ✅ | ✅ |
| **Create / Modify Schedules** | ❌ | ❌ | ✅ | ✅ |
| **Manage Grid Hierarchy (Zones, Substations, Feeders, Areas)** | ❌ | ❌ | ✅ | ✅ |
| **Purchase Priority Pass / SLA Plan** | ✅ | ❌ | ❌ | ❌ |
| **View Own Payments & Request Refunds** | ✅ | ❌ | ❌ | ❌ |
| **View Global Payment Ledger** | ❌ | ❌ | ❌ | ✅ |
| **Review Technician Applications** | ❌ | ❌ | ✅ | ✅ |
| **Grant / Revoke Technician Role** | ❌ | ❌ | ✅ (Technician only) | ✅ (All Roles) |
| **Manage Users (Block / Delete)** | ❌ | ❌ | ❌ | ✅ |
| **Access Operational & Workload Analytics** | ❌ | ❌ | ✅ | ✅ |
| **Access Financial Analytics & Audit Logs** | ❌ | ❌ | ❌ | ✅ |

---

## 🗺️ Frontend Route Catalog

The Next.js App Router organizes the user interface into public informational views, authentication workflows, self-service applications, and four distinct role-scoped dashboards:

### Public Pages
| Route Path | Description | Access Control |
| :--- | :--- | :--- |
| `/` | Interactive SCADA-inspired landing page with demonstration grid map and live status strip | Public |
| `/about` | Overview of Bangladesh power distribution operations and platform mission | Public |
| `/services` | Service catalog: Outage tracking, scheduled load control, priority restoration | Public |
| `/pricing` | Tiered SLA subscription plans and priority restoration pricing | Public |
| `/contact` | Client-validated contact form (prefills mailto client) | Public |
| `/apply` | Field technician employment application form | Public |
| `/apply/verify` | Email OTP verification screen for applicant validation | Public |

### Authentication & Payment Callback Routes
| Route Path | Description | Access Control |
| :--- | :--- | :--- |
| `/auth/login` | Email/password credential login and Google OAuth single sign-on | Public (Redirects if authenticated) |
| `/auth/register` | Customer self-registration form (triggers email OTP) | Public |
| `/auth/verify-email` | 6-digit registration OTP verification | Public |
| `/auth/forgot-password` | Password recovery initiation (issues reset token) | Public |
| `/auth/reset-password` | New password submission with reset token verification | Public |
| `/payment/success` | SSLCommerz post-payment success confirmation and receipt | Public (Validated via transaction ID) |
| `/payment/fail` | Payment failure notification with retry options | Public |
| `/payment/cancel` | Payment cancellation confirmation | Public |

### Customer Portal (`/customer/*`)
| Route Path | Description | Access Control |
| :--- | :--- | :--- |
| `/customer` | Customer dashboard: Active outages, localized load-shedding notices, quick actions | `CUSTOMER` |
| `/customer/outages` | List of submitted outage reports with live resolution progress | `CUSTOMER` |
| `/customer/outage/report` | Interactive incident report form with Area selection and priority upgrade toggle | `CUSTOMER` |
| `/customer/outage/[id]` | Real-time incident ticket details, technician assignment status, and history | `CUSTOMER` |
| `/customer/schedules` | Feeder and area load-shedding schedule calendar | `CUSTOMER` |
| `/customer/sla` | Active SLA subscription details, tier upgrade options, and renewal management | `CUSTOMER` |
| `/customer/payments` | Transaction ledger, payment status badges, receipt downloads, refund requests | `CUSTOMER` |
| `/customer/profile` | Personal profile management and Cloudinary avatar upload | `CUSTOMER` |

### Technician Portal (`/technician/*`)
| Route Path | Description | Access Control |
| :--- | :--- | :--- |
| `/technician` | Technician dashboard: Assigned emergency tasks, active workload, resolution metrics | `TECHNICIAN` |
| `/technician/outages` | Queue of assigned outage tickets filtered by status (`ASSIGNED`, `IN_PROGRESS`) | `TECHNICIAN` |
| `/technician/outage/[id]` | Dispatch detail view with action buttons to advance ticket status to `RESOLVED` | `TECHNICIAN` |
| `/technician/summary` | Performance summary: First-time fix rate, MTTR, total resolved tasks | `TECHNICIAN` |
| `/technician/profile` | Contact information, assigned base area, and profile picture management | `TECHNICIAN` |

### Power Operator Console (`/operator/*`)
| Route Path | Description | Access Control |
| :--- | :--- | :--- |
| `/operator` | Power dispatch command center: Live grid health, pending outages, active load sheds | `POWER_OPERATOR` |
| `/operator/grid` | Management interface for Zones, Substations, Feeders, and Areas | `POWER_OPERATOR` |
| `/operator/outages` | Nationwide outage report queue with technician dispatch action modal | `POWER_OPERATOR` |
| `/operator/outage/[id]` | Complete incident investigation view with reassignment controls | `POWER_OPERATOR` |
| `/operator/schedules` | Load-shedding schedule management with calendar view | `POWER_OPERATOR` |
| `/operator/schedules/create` | Schedule creation form with overlap and conflict detection | `POWER_OPERATOR` |
| `/operator/applications` | Review queue for technician job applications with approve/reject actions | `POWER_OPERATOR` |
| `/operator/analytics` | Operational telemetry: Feeders under stress, MTTR, technician workloads | `POWER_OPERATOR` |
| `/operator/audit-logs` | Operational activity history (grid and schedule mutations) | `POWER_OPERATOR` (UI) |

### System Administrator Console (`/admin/*`)
| Route Path | Description | Access Control |
| :--- | :--- | :--- |
| `/admin` | Executive dashboard: User counts, financial volume, operational MTTR, system logs | `ADMIN` |
| `/admin/users` | User management directory: Filter by role/status, toggle block state, role promotion | `ADMIN` |
| `/admin/grid` | Full administrative control over Zones, Substations, Feeders, Areas | `ADMIN` |
| `/admin/outages` | Global outage incident ledger with override assignment and deletion controls | `ADMIN` |
| `/admin/payments` | Nationwide payment transaction records with manual refund triggers | `ADMIN` |
| `/admin/applications` | Technician credential provisioning and application archive | `ADMIN` |
| `/admin/analytics` | Executive analytics suite: Financial trends, geographic outage density | `ADMIN` |
| `/admin/audit-logs` | Tamper-evident system audit log with actor indexing and JSON metadata inspector | `ADMIN` |

---

## 📡 Backend REST API Specification

The backend Express application mounts all feature routes under `/api/v1`. Authenticated endpoints accept a JWT Bearer token in the `Authorization` HTTP header (`Authorization: Bearer <token>`).

### 1. Authentication - `/api/v1/auth`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register customer account and dispatch 6-digit verification OTP |
| `POST` | `/verify-email` | Public | Verify email OTP and activate customer user account |
| `POST` | `/login` | Public | Authenticate user credentials; returns user profile and access/refresh tokens |
| `GET` | `/me` | Authenticated | Retrieve profile details of currently authenticated user |
| `POST` | `/refresh-token` | Public | Issue new access token using refresh token |
| `POST` | `/google` | Public | Authenticate via Google OAuth credential token |
| `POST` | `/forgot-password` | Public | Generate password reset token and dispatch email instructions |
| `POST` | `/reset-password` | Public | Set new account password using valid reset token |
| `POST` | `/logout` | Authenticated | Invalidate authenticated user session |

### 2. User Management - `/api/v1/user`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `PATCH` | `/profile` | Authenticated | Update authenticated user profile (name, phone, address, area) |
| `PATCH` | `/profile-image` | Authenticated | Upload and replace avatar image via Cloudinary (`multipart/form-data`) |
| `GET` | `/` | `ADMIN` | Paginated user directory with search and role/status filtering |
| `GET` | `/technicians` | `ADMIN`, `POWER_OPERATOR` | List active dispatchable field technicians for outage assignment |
| `GET` | `/:id` | `ADMIN` | Retrieve single user record by ID |
| `PATCH` | `/:id/status` | `ADMIN` | Update account status (`ACTIVE`, `BLOCKED`) |
| `PATCH` | `/:id/role` | `ADMIN`, `POWER_OPERATOR` | Change user role (Operator restricted to technician grant/revoke) |
| `DELETE` | `/:id` | `ADMIN` | Soft-delete user account (`isDeleted: true`) |

### 3. Grid Hierarchy - `/api/v1/grid`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/zones` | Authenticated | List all distribution zones |
| `POST` | `/zones` | `ADMIN`, `POWER_OPERATOR` | Create new distribution zone |
| `PATCH` | `/zones/:id` | `ADMIN`, `POWER_OPERATOR` | Update existing distribution zone |
| `DELETE` | `/zones/:id` | `ADMIN`, `POWER_OPERATOR` | Delete distribution zone |
| `GET` | `/substations` | Authenticated | List substations (filterable by `zoneId`) |
| `POST` | `/substations` | `ADMIN`, `POWER_OPERATOR` | Create new substation |
| `PATCH` | `/substations/:id` | `ADMIN`, `POWER_OPERATOR` | Update existing substation |
| `DELETE` | `/substations/:id` | `ADMIN`, `POWER_OPERATOR` | Delete substation |
| `GET` | `/feeders` | Authenticated | List feeder lines (filterable by `substationId`) |
| `POST` | `/feeders` | `ADMIN`, `POWER_OPERATOR` | Create new feeder line |
| `PATCH` | `/feeders/:id` | `ADMIN`, `POWER_OPERATOR` | Update feeder line |
| `DELETE` | `/feeders/:id` | `ADMIN`, `POWER_OPERATOR` | Delete feeder line |
| `GET` | `/areas` | Authenticated | List service areas (filterable by `feederId`) |
| `POST` | `/areas` | `ADMIN`, `POWER_OPERATOR` | Create new service area |
| `PATCH` | `/areas/:id` | `ADMIN`, `POWER_OPERATOR` | Update service area |
| `DELETE` | `/areas/:id` | `ADMIN`, `POWER_OPERATOR` | Delete service area |

### 4. Outage Incident Operations - `/api/v1/outage`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | `CUSTOMER` | Submit new power outage report |
| `GET` | `/` | Authenticated | List outage reports (automatically scoped to user role and area) |
| `GET` | `/:id` | Authenticated | Retrieve single outage report by ID |
| `PATCH` | `/:id/assign` | `ADMIN`, `POWER_OPERATOR` | Assign field technician to pending outage ticket |
| `PATCH` | `/:id/status` | `ADMIN`, `POWER_OPERATOR`, `TECHNICIAN` | Update outage status (`IN_PROGRESS`, `RESOLVED`, `CANCELLED`) |
| `DELETE` | `/:id` | `ADMIN`, `POWER_OPERATOR`, `CUSTOMER` | Delete outage report (Customer restricted to own pending reports) |

### 5. Load-Shedding & Maintenance Schedules - `/api/v1/schedule`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Authenticated | List load-shedding and maintenance schedules with date/status filters |
| `GET` | `/:id` | Authenticated | Retrieve single schedule by ID |
| `POST` | `/` | `ADMIN`, `POWER_OPERATOR` | Create new schedule with automated feeder conflict check |
| `PATCH` | `/:id` | `ADMIN`, `POWER_OPERATOR` | Update schedule metadata or timing |
| `PATCH` | `/:id/status` | `ADMIN`, `POWER_OPERATOR` | Update schedule status (`SCHEDULED`, `ONGOING`, `COMPLETED`, `CANCELLED`) |
| `DELETE` | `/:id` | `ADMIN`, `POWER_OPERATOR` | Delete schedule entry |

### 6. Payments & Webhooks - `/api/v1/payment`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | `CUSTOMER` | Initiate SSLCommerz checkout session for priority pass or SLA |
| `GET/POST`| `/ipn` | Public | Instant Payment Notification (IPN) webhook from SSLCommerz |
| `GET/POST`| `/success` | Public | SSLCommerz customer payment success callback redirect |
| `GET/POST`| `/fail` | Public | SSLCommerz payment failure callback redirect |
| `GET/POST`| `/cancel` | Public | SSLCommerz customer payment cancellation callback redirect |
| `GET` | `/transaction/:id` | Authenticated | Look up transaction details and status by transaction ID |
| `GET` | `/my-payments` | `CUSTOMER` | Paginated list of personal payment transactions |
| `POST` | `/refund` | `CUSTOMER` | Submit payment refund request for eligible transactions |

### 7. Analytics & SLA Engine - `/api/v1/analytics`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/operational` | `ADMIN`, `POWER_OPERATOR` | Operational telemetry (active outages, MTTR, critical feeders) |
| `GET` | `/performance` | `ADMIN`, `POWER_OPERATOR` | Grid performance indices and SLA resolution times |
| `GET` | `/technician-workload`| `ADMIN`, `POWER_OPERATOR` | Field technician workload distribution and fix rates |
| `GET` | `/geographical` | `ADMIN`, `POWER_OPERATOR` | Zone-by-zone outage incident density metrics |
| `GET` | `/financial` | `ADMIN`, `POWER_OPERATOR` | Revenue metrics from priority restorations and SLA subscriptions |
| `GET` | `/trends` | `ADMIN`, `POWER_OPERATOR` | Multi-day outage occurrence and resolution trend analysis |
| `GET` | `/my-summary` | `CUSTOMER` | Customer summary metrics (reports filed, SLA expiration status) |
| `GET` | `/technician-summary`| `TECHNICIAN` | Technician personal performance (tasks completed, first-time fix rate) |
| `GET` | `/audit-logs` | `ADMIN` | Complete chronological system audit trail |
| `GET` | `/sla-plans` | Public | Catalog of active SLA subscription plans |
| `GET` | `/sla-plans/:id` | Public | Retrieve single SLA subscription plan by ID |
| `POST` | `/sla-subscribe` | `CUSTOMER` | Subscribe to SLA plan and initiate payment redirect |
| `GET` | `/my-sla` | `CUSTOMER` | Retrieve current user active SLA subscription details |

### 8. Technician Applications - `/api/v1/applications`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Public | Submit field technician employment application |
| `POST` | `/verify-email` | Public | Verify 6-digit email OTP for technician application |
| `POST` | `/resend-otp` | Public | Resend verification OTP to applicant email |
| `GET` | `/my` | Public | Check status of application by email address parameter |
| `GET` | `/` | `ADMIN`, `POWER_OPERATOR` | List pending and processed technician job applications |
| `PATCH` | `/:id/review` | `ADMIN`, `POWER_OPERATOR` | Approve or reject application with optional feedback note |

---

### 🔍 API Integration Nuances & Verified Discrepancies

During static analysis of both frontend and backend repositories, the following minor architectural discrepancies between client API callers and backend route handlers were verified:

1. **SLA Subscription Route Path**:
   - Frontend caller `subscribeSla()` in `src/api/analytics.api.ts` targets `POST /analytics/sla/subscribe`.
   - Backend route in `src/app/module/analytics/analytics.route.ts` registers `POST /analytics/sla-subscribe`.
2. **Global Payments Route (`/payment/all`)**:
   - Frontend client exposes `getAllPayments()` in `src/api/payment.api.ts` pointing to `GET /payment/all`.
   - Backend routes currently support `GET /payment/my-payments` and `GET /payment/transaction/:id`. The dedicated global payments route is planned for future backend consolidation.
3. **Single Grid Resource Lookup by ID**:
   - Frontend `src/api/grid.api.ts` contains helper functions for `getZoneById`, `getSubstationById`, `getFeederById`, and `getAreaById` (`GET /grid/*/:id`).
   - Backend provides `GET /grid/zones`, `/substations`, `/feeders`, and `/areas` with query-based filtering, but does not register individual `/:id` GET routes.
4. **Audit Log Role Restriction**:
   - The frontend includes an audit log page for Power Operators (`/operator/audit-logs`).
   - The backend route `GET /analytics/audit-logs` is strictly locked to `UserRole.ADMIN`. Operators viewing this page rely on cached operational history.

---

## 🔌 Integrations Deep-Dive

### SSLCommerz Payment Gateway Integration
The payment infrastructure handles two commercial transactions: **Priority Restoration Passes** (BDT 500) and **SLA Subscriptions** (BDT 2,000).

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (Browser)
    participant Backend as Express Backend (/api/v1/payment)
    participant Gateway as SSLCommerz Hosted Gateway
    participant DB as PostgreSQL Database
    participant Email as Nodemailer (SMTP)

    Customer->>Backend: POST /payment (amount, type: SLA_SUBSCRIPTION)
    Note over Backend: Validates amount against server config<br/>Prevents client-side price tampering
    Backend->>DB: Create Payment record (status: PENDING, tran_id)
    Backend->>Gateway: Initialize session (POST /gwprocess/v4/api.php)
    Gateway-->>Backend: GatewayPageURL + sessionkey
    Backend-->>Customer: Returns { transactionId, gatewayUrl }
    Customer->>Gateway: User redirected to Payment Page (bKash/Cards)
    Gateway->>Customer: Completes authentication & payment

    par IPN Webhook Verification
        Gateway->>Backend: POST /payment/ipn (val_id, tran_id, status: VALID)
        Backend->>Gateway: Query validator (GET /validator/api/validationserverAPI.php)
        Gateway-->>Backend: Confirmed amount, bank_tran_id, risk_level
        Backend->>DB: Update Payment (status: COMPLETED)
        Backend->>DB: Activate SLA subscription on User
        Backend->>Email: Send payment-receipt.ejs
    and Browser Redirect
        Gateway->>Customer: Redirect to frontend /payment/success?tran_id=xxx
        Customer->>Backend: GET /payment/transaction/:id
        Backend-->>Customer: Status verified COMPLETED
    end
```

### Transactional Email Notification System
The backend incorporates Nodemailer with an EJS template rendering engine (`src/app/templates/`), powering 15 distinct transactional email notifications:

| Template File | Trigger Event | Recipient |
| :--- | :--- | :--- |
| `registration-user-otp.ejs` | Customer registration initiated | New Customer |
| `welcome-email.ejs` | Email OTP successfully verified | New Customer |
| `forgot-password.ejs` | Password recovery requested | Account Owner |
| `reset-password-success.ejs` | Password reset completed | Account Owner |
| `technician-application-otp.ejs` | Technician application submitted | Applicant |
| `application-decision.ejs` | Application approved or rejected | Applicant |
| `role-assigned.ejs` | User promoted to new role | User |
| `account-status.ejs` | User status updated (Active/Blocked) | User |
| `outage-received.ejs` | Outage incident report logged | Customer |
| `technician-assigned.ejs` | Technician dispatched to incident | Field Technician |
| `outage-resolved.ejs` | Outage marked as resolved | Reporting Customer |
| `schedule-notice.ejs` | Feeder load shedding scheduled | Affected Area Users |
| `payment-receipt.ejs` | SSLCommerz payment confirmed | Paying Customer |
| `payment-refund.ejs` | Refund processed | Customer |
| `sla-status.ejs` | SLA activation, 7-day warning, or expiration | SLA Customer |

### Redis OTP Lifecycle & Cache
- **Storage Strategy**: Verification OTPs are saved in Redis using key pattern `otp:<email>` with a strict 300-second (5-minute) Time-To-Live (TTL).
- **Rate-Limiting & Resend**: Prevents OTP spamming through resend interval throttles.
- **Hourly Purge Daemon**: A scheduled cron worker scans for unverified technician applications older than 24 hours and purges orphaned records.

### Geospatial SCADA-Style Map Engine
- **Technology**: Built using Leaflet and React Leaflet rendered over OpenStreetMap tiles.
- **Dark SCADA Inversion**: Uses a CSS pipeline filter (`filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)`) to transform standard raster tiles into a sleek control-room display.
- **Interactive Layers**: Markers represent major power substations (Dhaka Central, Chittagong East, Sylhet North, etc.), feeder trunklines, and active outage clusters.

---

## 🔐 Environment Variables

### Frontend Configuration (`.env.local`)
Create a `.env.local` file in the root of the frontend repository:

```env
# Backend REST API base URL (must end in /api/v1)
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api/v1

# Google OAuth Client ID for social sign-in
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Auto-filled test credentials for development convenience
TESTER_ADMIN_NAME=System Super Admin
TESTER_ADMIN_EMAIL=superadmin@powergrid.bd
TESTER_ADMIN_PASSWORD=Admin@12345

TESTER_POWER_OPERATOR_NAME=Grid Control Operator
TESTER_POWER_OPERATOR_EMAIL=operator@powergrid.bd
TESTER_POWER_OPERATOR_PASSWORD=Operator@12345

TESTER_TECHNICIAN_NAME=Senior Field Technician
TESTER_TECHNICIAN_EMAIL=technician@powergrid.bd
TESTER_TECHNICIAN_PASSWORD=Tech@12345
```

### Backend Configuration (`.env`)
Create a `.env` file in the root of the backend repository:

```env
# Application Runtime
NODE_ENV=development
PORT=5000
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# PostgreSQL Connection (Prisma ORM)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/powergriddb?schema=public"

# JSON Web Token Secret Keys & Expiry
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_min_32_chars
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Password Hashing
BCRYPT_SALT_ROUNDS=10

# Google OAuth Server Verification
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# In-Memory Cache (Redis)
REDIS_USER=default
REDIS_PASSWORD=
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Nodemailer / Gmail SMTP Configuration
EMAIL_SENDER=PowerGridBD <no-reply@powergridbd.com>
SMTP_USER=your_smtp_email@gmail.com
SMTP_PASSWORD=your_gmail_app_specific_password

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SSLCommerz Payment Gateway (Sandbox: testbox / qwerty)
SSLC_STORE_ID=testbox
SSLC_STORE_PASSWORD=qwerty
SSLC_IS_LIVE=false

# Server-Authoritative Product Pricing (in BDT)
PRIORITY_RESTORATION_PRICE=500
SLA_SUBSCRIPTION_PRICE=2000

# Auto-Seeded Administrative Accounts (Seeded on first server boot)
TESTER_ADMIN_NAME=Super Admin
TESTER_ADMIN_EMAIL=admin@powergridbd.com
TESTER_ADMIN_PASSWORD=Admin@12345

TESTER_POWER_OPERATOR_NAME=Power Operator
TESTER_POWER_OPERATOR_EMAIL=operator@powergridbd.com
TESTER_POWER_OPERATOR_PASSWORD=Operator@12345

TESTER_TECHNICIAN_NAME=Technician
TESTER_TECHNICIAN_EMAIL=technician@powergridbd.com
TESTER_TECHNICIAN_PASSWORD=Tech@12345
```

---

## 💻 Local Installation & Setup

### Prerequisites
Ensure the following developer tools and services are installed locally:
- **Node.js** `>= 20.x` or Bun `>= 1.4.x`
- **PostgreSQL** `>= 16.x` (Running on `localhost:5432`)
- **Redis Server** `>= 6.2.x` (Running on `localhost:6379`)
- **Git** version control

---

### 1. Backend Service Setup

```bash
# 1. Clone the backend repository
git clone https://github.com/mehedihasanrafi205/PowerGridBD-Backend.git
cd PowerGridBD-Backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Open .env and adjust DATABASE_URL, Redis, and SMTP credentials as needed

# 4. Run Prisma database migrations & generate client
npx prisma migrate dev --name init

# 5. Start the backend development server
npm run dev
```

*The backend server will connect to PostgreSQL and Redis, verify the SMTP transporter, seed default administrator/operator/technician accounts, start background cron daemons, and listen on `http://localhost:5000`.*

---

### 2. Frontend Application Setup

```bash
# 1. Clone the frontend repository
git clone https://github.com/mehedihasanrafi205/PowerGridBD.git
cd PowerGridBD

# 2. Install dependencies with Bun
bun install

# 3. Configure environment variables
cp .env.example .env.local
# Verify NEXT_PUBLIC_BASE_URL points to http://localhost:5000/api/v1

# 4. Start Next.js development server
bun dev
```

*Open `http://localhost:3000` in your browser to access the PowerGridBD application.*

---

## 📜 Available Scripts

### Frontend (`PowerGridBD`)
| Command | Description |
| :--- | :--- |
| `bun dev` | Start Next.js development server with Turbopack |
| `bun build` | Build static export bundle into `out/` directory |
| `bun start` | Serve production build locally |
| `bun lint` | Run Biome lint checks across the codebase |
| `bun format` | Automatically format all source files using Biome |
| `bun test` | Execute unit test suite with Bun test runner |
| `bun test:e2e` | Run Playwright end-to-end browser integration tests |

### Backend (`PowerGridBD-Backend`)
| Command | Description |
| :--- | :--- |
| `npm run dev` | Launch Express server in watch mode using `tsx` |
| `npm run build` | Compile TypeScript source code into `dist/` using `tsc` |
| `npm start` | Run compiled production bundle with `node dist/src/server.js` |
| `npm run lint:check` | Check code quality and rules with Biome |
| `npm run lint:fix` | Automatically fix linting issues with Biome |
| `npm run format:check` | Validate file formatting standards |
| `npm run format:fix` | Format TypeScript source code with Biome |

---

## 🚀 Deployment Configuration

### Frontend Deployment (Vercel Static Export)
The frontend is configured for static web export (`output: "export"` in `next.config.ts`), generating optimized static HTML, CSS, and JS bundles inside the `out/` folder:

1. Connect the `PowerGridBD` repository to **Vercel**.
2. Framework Preset: **Next.js**.
3. Build Command: `next build`.
4. Output Directory: `out`.
5. Environment Variables:
   - `NEXT_PUBLIC_BASE_URL`: `https://powergridbd-backend.vercel.app/api/v1`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google OAuth client ID.

### Backend Deployment (Vercel Serverless)
The backend is configured as a Vercel serverless function using `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/api.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/api.js"
    }
  ]
}
```

The Express app handles CORS dynamically, approving requests from `https://powergridbd.vercel.app`, `localhost:3000`, and all Vercel branch preview URLs matching `/^https:\/\/powergridbd-.*\.vercel\.app$/`.

---

## 📂 Project Directory Structure

### Frontend (`PowerGridBD`)
```text
powergridbd/
├── public/                     # Static public assets (SVG logo, icons)
├── src/
│   ├── api/                    # Typed API client modules (auth, grid, outage, payment)
│   ├── app/                    # Next.js 16 App Router
│   │   ├── (dashboard)/        # Role-scoped dashboard workspaces
│   │   │   ├── admin/          # Admin user directory, grid, payments, audit logs
│   │   │   ├── customer/       # Customer outage reporting, schedules, SLA, payments
│   │   │   ├── operator/       # Operator grid manager, dispatch, schedules, reviews
│   │   │   └── technician/     # Technician assigned tasks, summary, work status
│   │   ├── (public)/           # Auth views (login, register, verify, reset-password)
│   │   ├── about/              # Public informational about page
│   │   ├── apply/              # Technician public application and OTP verification
│   │   ├── contact/            # Public contact view
│   │   ├── payment/            # SSLCommerz callback returns (success, fail, cancel)
│   │   ├── pricing/            # SLA subscription tiers & pricing breakdown
│   │   ├── services/           # Public power grid operations services catalog
│   │   ├── layout.tsx          # Root HTML layout with fonts and providers
│   │   └── page.tsx            # Main SCADA-inspired landing page
│   ├── components/
│   │   ├── animation/          # Lenis smooth scroll, GSAP, reduced-motion providers
│   │   ├── landing/            # Hero, HUD status strip, operations table, role showcase
│   │   ├── map/                # Leaflet map container, markers, topology demo data
│   │   └── ui/                 # Accessible shadcn/ui components
│   ├── hooks/                  # TanStack Query and state hooks
│   ├── lib/                    # ofetch API client, token persistence, utility helpers
│   ├── providers/              # Auth context provider, QueryClient provider
│   └── types/                  # TypeScript interface definitions and barrel exports
├── e2e/                        # Playwright automated end-to-end tests
├── biome.json                  # Biome code formatting and linting configuration
├── next.config.ts              # Next.js configuration (reactCompiler, output: "export")
└── package.json                # Frontend dependencies and scripts
```

### Backend (`PowerGridBD-Backend`)
```text
PowerGridBD-backend/
├── prisma/
│   ├── schema/                 # Modular Prisma 7 schema definitions
│   │   ├── areas.prisma        # Area distribution schema
│   │   ├── audit_log.prisma    # Audit log persistence schema
│   │   ├── enum.prisma         # Global database enums
│   │   ├── feeder.prisma       # Feeder line schema
│   │   ├── outage_report.prisma# Outage incident ticket schema
│   │   ├── payment.prisma      # Payment and SSLCommerz transaction schema
│   │   ├── schedule.prisma     # Load shedding and maintenance schedule schema
│   │   ├── sla_plan.prisma     # SLA subscription plans & active subscriptions
│   │   ├── substation.prisma   # Substation schema
│   │   ├── technician_application.prisma # Technician onboarding schema
│   │   ├── user.prisma         # User account schema and relationships
│   │   └── zone.prisma         # Regional distribution zone schema
│   └── migrations/             # SQL schema migrations history
├── src/
│   ├── app/
│   │   ├── config/             # Environment variable schema validation
│   │   ├── lib/                # Prisma client, Redis client, Nodemailer, SSLCommerz
│   │   ├── middleware/         # checkAuth (JWT/RBAC), globalErrorHandler, validateRequest
│   │   ├── module/             # Feature modules (controller, service, route, validation)
│   │   │   ├── analytics/      # Operational, workload, financial analytics & SLA plans
│   │   │   ├── application/    # Technician job applications and OTP verification
│   │   │   ├── auth/           # Registration, login, Google OAuth, password reset
│   │   │   ├── grid/           # 4-tier grid topology CRUD operations
│   │   │   ├── outage/         # Incident reporting, technician dispatch, status updates
│   │   │   ├── payment/        # SSLCommerz checkout session, IPN webhook, refunds
│   │   │   ├── schedule/       # Load shedding scheduler with conflict detection
│   │   │   └── user/           # User profiles, avatar uploads, role & status management
│   │   ├── templates/          # 15 compiled EJS transactional HTML email templates
│   │   └── utils/              # AppError, audit logger, password hashing, database seeder
│   ├── app.ts                  # Express application setup, CORS, route mounting
│   └── server.ts               # Server startup, database connection, cron initialization
├── vercel.json                 # Vercel serverless deployment specification
├── biome.json                  # Biome linter and formatter rules
└── package.json                # Backend dependencies and scripts
```

---

## 🎨 UI & Visual Design Aesthetics

PowerGridBD is styled with a **SCADA Control-Room Aesthetic** designed specifically for high-reliability utility operations:

- **Color Tokens**: Defined using modern OKLCH CSS variables:
  - Deep Charcoal (`--color-deep-charcoal: oklch(0.09 0.02 240)`): Technical control surfaces and dark backgrounds.
  - Electric Blue (`--color-electric-blue: oklch(0.58 0.25 264)`): Primary active states and transmission lines.
  - Smart Teal (`--color-smart-teal: oklch(0.72 0.15 165)`): Assigned dispatches and secondary highlights.
  - Status Indicators: Amber for `PENDING`/Warning, Emerald for `RESOLVED`/Restored, Red for `FAILED`/Critical.
- **Typography**: Inter (`font-sans`) for clean UI legibility; JetBrains Mono (`font-mono`) for technical IDs, timestamps, frequency (Hz), and power metrics (MW).
- **Interactive Previews**: The live application can be explored directly at [powergridbd.vercel.app](https://powergridbd.vercel.app/).

---

## 📄 License & Credits

This project is licensed under the **ISC License**.

- **Frontend & Backend Architecture**: [Mehedi Hasan Rafi](https://github.com/mehedihasanrafi205)
- **Open-Source Technologies**: Next.js, React, Express, Prisma ORM, PostgreSQL, Redis, Leaflet, Tailwind CSS, shadcn/ui.
