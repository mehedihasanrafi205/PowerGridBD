import { Activity, GitBranch, MapPin, Users, Zap } from "lucide-react";
import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { LiveStatusStrip } from "@/components/landing/LiveStatusStrip";
import { SectionHeading } from "@/components/landing/SectionHeading";

export const metadata: Metadata = {
  title: "About — PowerGridBD",
  description:
    "PowerGridBD is an enterprise load-shedding and power outage management platform for Bangladesh, uniting customers, technicians, power operators, and admins on one operational grid.",
  openGraph: {
    title: "About — PowerGridBD",
    description: "Enterprise power grid operations for Bangladesh.",
    type: "website",
  },
};

const pillars = [
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Real Grid Topology",
    description:
      "Every outage is anchored to a physical location through the Zone → Substation → Feeder → Area hierarchy, so dispatch decisions are made on geography, not guesswork.",
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: "Auditable Operations",
    description:
      "Every authenticated action — assignment, status change, schedule publication, payment — writes an audit record with entity, actor, and metadata for compliance-grade traceability.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Verified Payments",
    description:
      "Priority restoration and SLA subscriptions are processed through SSLCommerz with server-side cascade validation, so a payment only takes effect after the gateway confirms it.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Four Roles, One Picture",
    description:
      "Customers report, technicians resolve, operators dispatch, and admins oversee. Role-based access is enforced at the route, UI, and API levels simultaneously.",
  },
];

const hierarchy = [
  {
    level: "L1",
    name: "Zone",
    detail: "Top-level service region",
    color: "text-electric-blue",
  },
  {
    level: "L2",
    name: "Substation",
    detail: "Grid substation within a zone",
    color: "text-smart-teal",
  },
  {
    level: "L3",
    name: "Feeder",
    detail: "Distribution feeder line",
    color: "text-amber",
  },
  {
    level: "L4",
    name: "Area",
    detail: "Customer service area",
    color: "text-emerald",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-deep-charcoal font-sans">
      <LandingNav />
      <div className="pt-16">
        <LiveStatusStrip />
      </div>

      <main>
        {/* Intro */}
        <section className="container mx-auto px-4 pt-20 pb-16 lg:pt-28">
          <SectionHeading
            align="center"
            eyebrow="About the Platform"
            title="Built for the people who keep the lights on."
            description="PowerGridBD replaces fragmented outage calls and manual dispatch sheets with a single, role-aware operations platform covering the full lifecycle of a power outage — from the first customer report to verified restoration."
          />
        </section>

        {/* Pillars */}
        <section className="bg-zinc-950 py-16 lg:py-24 border-t border-zinc-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-5">
              {pillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-7 transition-colors hover:border-zinc-600"
                >
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-smart-teal mb-5">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Grid hierarchy explainer */}
        <section className="container mx-auto px-4 py-16 lg:py-24">
          <SectionHeading
            eyebrow="Grid Hierarchy"
            title="Four levels of operational truth."
            description="The platform models Bangladesh's distribution network as a strict four-level tree. Outages, schedules, and technician assignments all resolve to a leaf Area — making location the backbone of every workflow."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {hierarchy.map((node, index) => (
              <div
                key={node.name}
                className="relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-zinc-500">
                    {node.level}
                  </span>
                  <span className={node.color}>
                    <GitBranch className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {node.name}
                </h3>
                <p className="text-sm text-zinc-400">{node.detail}</p>
                {index < hierarchy.length - 1 && (
                  <span className="hidden lg:block absolute top-1/2 -right-3 z-10 font-mono text-zinc-600">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
