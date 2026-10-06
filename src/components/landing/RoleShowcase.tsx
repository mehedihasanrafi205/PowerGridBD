"use client";

import { ArrowRight, Gauge, ShieldCheck, User, Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks";
import { cn } from "@/lib/utils";

interface RoleCard {
  role: string;
  title: string;
  icon: React.ReactNode;
  accent: string;
  border: string;
  description: string;
  capabilities: string[];
  demoEmail: string;
}

const roles: RoleCard[] = [
  {
    role: "CUSTOMER",
    title: "Customer",
    icon: <User className="h-5 w-5" />,
    accent: "text-electric-blue",
    border: "border-electric-blue/30",
    description:
      "Report outages with precise grid-location targeting, track restoration progress, and manage SLA-backed priority service.",
    capabilities: [
      "Report & track outages",
      "Zone → Area location picker",
      "Priority restoration passes",
      "30-day SLA subscription",
    ],
    demoEmail: "customer@powergridbd.com",
  },
  {
    role: "TECHNICIAN",
    title: "Technician",
    icon: <Wrench className="h-5 w-5" />,
    accent: "text-emerald-400",
    border: "border-emerald-400/30",
    description:
      "Receive assigned outages, advance them through resolution stages, and maintain first-time-fix performance metrics.",
    capabilities: [
      "Assigned outage queue",
      "Status transitions with notes",
      "Resolution timestamping",
      "Performance summary",
    ],
    demoEmail: "technician@powergridbd.com",
  },
  {
    role: "POWER_OPERATOR",
    title: "Power Operator",
    icon: <Gauge className="h-5 w-5" />,
    accent: "text-amber-400",
    border: "border-amber-400/30",
    description:
      "Run grid operations: manage hierarchy, dispatch technicians, publish load-shedding schedules, and monitor operational KPIs.",
    capabilities: [
      "Grid hierarchy CRUD",
      "Technician dispatch",
      "Load-shedding scheduler",
      "Application review & approval",
    ],
    demoEmail: "operator@powergridbd.com",
  },
  {
    role: "ADMIN",
    title: "Admin",
    icon: <ShieldCheck className="h-5 w-5" />,
    accent: "text-red-400",
    border: "border-red-400/30",
    description:
      "Full platform oversight: user management, payment administration, system-wide analytics, and compliance-grade audit logs.",
    capabilities: [
      "User management & roles",
      "Payment oversight & refunds",
      "Financial & operational analytics",
      "Audit log export",
    ],
    demoEmail: "admin@powergridbd.com",
  },
];

export function RoleShowcase() {
  const { ref, isVisible } = useReveal({ threshold: 0.05 });

  return (
    <section id="roles" className="bg-deep-charcoal py-20 lg:py-28">
      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-widest uppercase text-smart-teal mb-3">
            <span className="h-0.5 w-12 bg-smart-teal/30" />
            Role-Based Access
            <span className="h-0.5 w-12 bg-smart-teal/30" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Four roles. One operational picture.
          </h2>
          <p className="text-lg text-zinc-400">
            Every role sees exactly the data and actions it needs — enforced at
            the route level, the UI level, and the API level.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {roles.map((role, index) => (
            <article
              key={role.role}
              className={cn(
                "group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-500 hover:border-zinc-600 hover:bg-zinc-900/60 hover:-translate-y-1",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className={cn(
                    "p-3 rounded-lg bg-zinc-900 border",
                    role.border,
                    role.accent,
                  )}
                >
                  {role.icon}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  {role.role}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {role.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                {role.description}
              </p>

              <ul className="space-y-2 mb-6 flex-1">
                {role.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="flex items-start gap-2 text-sm text-zinc-300"
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-1 w-1 rounded-full flex-shrink-0",
                        role.accent.replace("text-", "bg-"),
                      )}
                    />
                    {capability}
                  </li>
                ))}
              </ul>

              <Link href="/auth/login" className="mt-auto">
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between border-zinc-700 text-zinc-200 hover:bg-zinc-800/60 hover:text-white group-hover:border-current",
                    role.border,
                  )}
                >
                  Try Demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </article>
          ))}
        </div>

        <p className="text-center text-xs font-mono text-zinc-600 mt-10">
          Demo accounts available on the sign-in page — one click per role, no
          password required.
        </p>
      </div>
    </section>
  );
}
