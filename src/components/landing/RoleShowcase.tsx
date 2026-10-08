"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gauge, ShieldCheck, User, Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks";
import { easing } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

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
    accent: "text-emerald",
    border: "border-emerald/30",
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
    accent: "text-amber",
    border: "border-amber/30",
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
    accent: "text-destructive",
    border: "border-destructive/30",
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.easeOut },
  },
  hover: {
    y: -6,
    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.3)",
    transition: { duration: 0.3, ease: easing.easeOut },
  },
};

const iconVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, rotate: 5 },
  transition: { duration: 0.3, ease: easing.easeOut },
};

export function RoleShowcase() {
  const { ref, isVisible } = useReveal({ threshold: 0.05 });

  return (
    <section id="roles" className="bg-deep-charcoal py-20 lg:py-28">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
        className="container mx-auto px-4"
      >
        <SectionHeading
          align="center"
          eyebrow="Role-Based Access"
          title="Four roles. One operational picture."
          description="Every role sees exactly the data and actions it needs — enforced at the route level, the UI level, and the API level."
        />

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {roles.map((role, index) => (
            <motion.article
              key={role.role}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className={cn(
                "group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/40 p-6",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-5">
                <motion.div
                  className={cn(
                    "p-3 rounded-lg bg-zinc-900 border",
                    role.border,
                    role.accent,
                  )}
                  whileHover="hover"
                  variants={iconVariants}
                >
                  {role.icon}
                </motion.div>
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
                {role.capabilities.map((capability, i) => (
                  <motion.li
                    key={capability}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex items-start gap-2 text-sm text-zinc-300"
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-1 w-1 rounded-full flex-shrink-0",
                        role.accent.replace("text-", "bg-"),
                      )}
                    />
                    {capability}
                  </motion.li>
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
            </motion.article>
          ))}
        </div>

        <motion.p
          className="text-center text-xs font-mono text-zinc-600 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Demo accounts available on the sign-in page — one click per role, no
          password required.
        </motion.p>
      </motion.div>
    </section>
  );
}
