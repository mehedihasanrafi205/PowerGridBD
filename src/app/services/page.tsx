import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  CreditCard,
  FileSearch,
  GitBranch,
  UserCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { LiveStatusStrip } from "@/components/landing/LiveStatusStrip";
import { SectionHeading } from "@/components/landing/SectionHeading";

export const metadata: Metadata = {
  title: "Services — PowerGridBD",
  description:
    "PowerGridBD services: outage lifecycle management, load-shedding scheduling, grid hierarchy management, SLA subscriptions, technician dispatch, and audit-grade analytics.",
  openGraph: {
    title: "Services — PowerGridBD",
    description: "Enterprise power grid operations services.",
    type: "website",
  },
};

const services = [
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    accent: "text-amber-400",
    title: "Outage Lifecycle Management",
    summary:
      "Customer reports flow into a five-stage pipeline — PENDING, ASSIGNED, IN_PROGRESS, RESOLVED, RESTORED — with timestamps at every transition.",
    details: [
      "Location-anchored reports via Zone → Substation → Feeder → Area picker",
      "Technician assignment with workload visibility",
      "Resolution notes and full transition timestamps",
      "Priority flagging that jumps the work queue",
    ],
    href: "/customer/outage/report",
  },
  {
    icon: <CalendarClock className="h-6 w-6" />,
    accent: "text-electric-blue",
    title: "Load-Shedding Scheduling",
    summary:
      "Publish FEEDER or AREA based load-shedding windows with NONE, DAILY, WEEKLY, or MONTHLY recurrence and automatic conflict detection.",
    details: [
      "Schedule windows validated server-side (end after start)",
      "Overlap conflict detection before publication",
      "SCHEDULED → ONGOING → COMPLETED → CANCELLED state control",
      "Filterable, paginated schedule feed for all roles",
    ],
    href: "/operator/schedules",
  },
  {
    icon: <GitBranch className="h-6 w-6" />,
    accent: "text-smart-teal",
    title: "Grid Hierarchy Management",
    summary:
      "Operate the four-level grid tree with relational CRUD, active/inactive flags, and per-parent child counts for instant capacity awareness.",
    details: [
      "Tabbed CRUD for Zones, Substations, Feeders, and Areas",
      "Relational integrity enforced by the backend",
      "Child counts (substations/zone, feeders/substation, areas/feeder)",
      "Active/inactive toggles without data loss",
    ],
    href: "/operator/grid",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    accent: "text-emerald-400",
    title: "SLA & Priority Restoration",
    summary:
      "Two SSLCommerz-verified products: a BDT 500 per-outage Priority Restoration Pass and a BDT 2,000 30-day SLA subscription.",
    details: [
      "Server-authoritative pricing — mismatched amounts are rejected",
      "Cascade validation: val_id → sessionkey → tran_id",
      "Transactional side effects inside prisma.$transaction",
      "Admin refund flow that reverses priority and SLA state",
    ],
    href: "/pricing",
  },
  {
    icon: <UserCheck className="h-6 w-6" />,
    accent: "text-electric-blue",
    title: "Technician Onboarding & Dispatch",
    summary:
      "Public technician applications with email OTP verification, operator review, and auto-generated credentials on approval.",
    details: [
      "Application form with skills and experience capture",
      "Email OTP verification (1-hour TTL)",
      "Approve creates a TECHNICIAN user and emails a temp password",
      "Reject requires a reason and notifies the applicant",
    ],
    href: "/operator/applications",
  },
  {
    icon: <FileSearch className="h-6 w-6" />,
    accent: "text-amber-400",
    title: "Audit Logging & Analytics",
    summary:
      "Every authenticated action is recorded with entity, action, actor, and metadata — filterable, exportable, and paired with five analytics views.",
    details: [
      "Entity/action/date/role filters on audit logs",
      "CSV export for compliance review",
      "Operational, performance, geographical, financial, and trends analytics",
      "MTTR, first-time-fix rate, and assignment-time KPIs",
    ],
    href: "/admin/audit-logs",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-deep-charcoal font-sans">
      <LandingNav />
      <div className="pt-16">
        <LiveStatusStrip />
      </div>

      <main>
        <section className="container mx-auto px-4 pt-20 pb-16 lg:pt-28">
          <SectionHeading
            align="center"
            eyebrow="Services"
            title="One platform, six operational services."
            description="Every service is backed by the live PowerGridBD API — no mocks, no placeholders. What you see on this page is what the platform actually does."
          />
        </section>

        <section className="bg-zinc-950 py-16 lg:py-24 border-t border-zinc-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/40 p-7 transition-colors hover:border-zinc-600"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`p-3 rounded-lg bg-zinc-900 border border-zinc-800 ${service.accent}`}
                    >
                      {service.icon}
                    </div>
                    <Link
                      href={service.href}
                      className={`p-2 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-800 transition-colors ${service.accent}`}
                      aria-label={`Learn more about ${service.title}`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed mb-5">
                    {service.summary}
                  </p>

                  <ul className="space-y-2.5 mt-auto">
                    {service.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-2.5 text-sm text-zinc-300"
                      >
                        <span
                          className={`mt-1.5 h-1 w-1 rounded-full flex-shrink-0 bg-current ${service.accent}`}
                        />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
