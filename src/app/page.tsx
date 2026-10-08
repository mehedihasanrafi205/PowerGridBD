import type { Metadata } from "next";
import { FeaturePanels } from "@/components/landing/FeaturePanels";
import { Hero } from "@/components/landing/Hero";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { LiveStatusStrip } from "@/components/landing/LiveStatusStrip";
import { OperationsTable } from "@/components/landing/OperationsTable";
import { PricingSection } from "@/components/landing/PricingSection";
import { RoleShowcase } from "@/components/landing/RoleShowcase";

export const metadata: Metadata = {
  title: "PowerGridBD — Load Shedding & Power Outage Management Platform",
  description:
    "Enterprise-grade power grid operations platform for Bangladesh. Report outages, manage load-shedding schedules, dispatch technicians, and subscribe to SLA-backed priority restoration.",
  keywords: [
    "power grid",
    "load shedding",
    "outage management",
    "electricity",
    "Bangladesh",
    "SLA",
    "SSLCommerz",
  ],
  openGraph: {
    title: "PowerGridBD — Load Shedding & Power Outage Management Platform",
    description:
      "Enterprise-grade power grid operations platform for Bangladesh.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-deep-charcoal font-sans">
      <LandingNav />
      <main>
        <div className="pt-16">
          <LiveStatusStrip />
        </div>
        <Hero />
        <FeaturePanels />
        <RoleShowcase />
        <OperationsTable />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  );
}