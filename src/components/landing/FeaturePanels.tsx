"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  CreditCard,
  FileSearch,
  GitBranch,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useReveal } from "@/hooks";
import { cn } from "@/lib/utils";

interface FeaturePanel {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
  metrics: { label: string; value: string }[];
  href?: string;
}

const features: FeaturePanel[] = [
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    iconColor: "text-amber-400",
    title: "Outage Lifecycle Management",
    description:
      "End-to-end outage tracking from PENDING report to RESTORED power, with technician assignment, resolution notes, and full timestamp audit trail.",
    metrics: [
      { label: "STAGES", value: "05" },
      { label: "PRIORITY QUEUE", value: "SSLCommerz" },
    ],
    href: "/customer/outage/report",
  },
  {
    icon: <CalendarClock className="h-5 w-5" />,
    iconColor: "text-electric-blue",
    title: "Load-Shedding Scheduler",
    description:
      "FEEDER and AREA based schedules with DAILY/WEEKLY/MONTHLY recurrence, overlap conflict detection, and SCHEDULED → ONGOING → COMPLETED state control.",
    metrics: [
      { label: "RECURRENCE", value: "04 MODES" },
      { label: "CONFLICT DETECTION", value: "AUTO" },
    ],
    href: "/operator/schedules",
  },
  {
    icon: <GitBranch className="h-5 w-5" />,
    iconColor: "text-smart-teal",
    title: "Grid Hierarchy",
    description:
      "Four-level operational topology — Zone, Substation, Feeder, Area — with relational CRUD, active/inactive flags, and customer counts per area.",
    metrics: [
      { label: "LEVELS", value: "04" },
      { label: "ENTITIES", value: "CRUD" },
    ],
    href: "/operator/grid",
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    iconColor: "text-emerald-400",
    title: "SLA & Priority Restoration",
    description:
      "30-day SLA subscriptions and BDT 500 priority restoration passes via SSLCommerz, with server-side cascade verification and transactional side effects.",
    metrics: [
      { label: "PRIORITY PASS", value: "BDT 500" },
      { label: "SLA WINDOW", value: "30 DAYS" },
    ],
    href: "/customer/sla",
  },
  {
    icon: <UserCheck className="h-5 w-5" />,
    iconColor: "text-electric-blue",
    title: "Technician Dispatch & Onboarding",
    description:
      "Public technician applications with email OTP verification, operator review workflows, auto-generated credentials, and workload-aware assignment.",
    metrics: [
      { label: "OTP VERIFY", value: "EMAIL" },
      { label: "REVIEW FLOW", value: "APPROVE / REJECT" },
    ],
    href: "/operator/applications",
  },
  {
    icon: <FileSearch className="h-5 w-5" />,
    iconColor: "text-amber-400",
    title: "Audit Logging & Analytics",
    description:
      "Every authenticated action writes an audit record with entity, actor, and metadata. Filterable, exportable, and paired with operational analytics.",
    metrics: [
      { label: "ANALYTICS", value: "05 VIEWS" },
      { label: "EXPORT", value: "CSV" },
    ],
    href: "/admin/audit-logs",
  },
];

export function FeaturePanels() {
  const { ref, isVisible } = useReveal({ threshold: 0.05 });

  return (
    <section id="platform" className="bg-zinc-950 py-20 lg:py-28">
      <div ref={ref} className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={cn(
                "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-500 hover:border-electric-blue/40 hover:bg-zinc-900/60 hover:shadow-xl hover:shadow-black/30",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: `${(index % 3) * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className={cn(
                    "p-3 rounded-lg bg-zinc-900 border border-zinc-800",
                    feature.iconColor,
                  )}
                >
                  {feature.icon}
                </div>
                {feature.href && (
                  <Link
                    href={feature.href}
                    className="p-2 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-800 transition-colors"
                    aria-label={`Learn more about ${feature.title}`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-electric-blue transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                {feature.description}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800/80">
                {feature.metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      {metric.label}
                    </div>
                    <div className="font-mono text-sm font-medium text-zinc-200 tabular-nums">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
