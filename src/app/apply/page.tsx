import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { SectionHeading } from "@/components/landing/SectionHeading";
import TechnicianApplicationForm from "./TechnicianApplicationForm";

export const metadata: Metadata = {
  title: "Apply as Technician — PowerGridBD",
  description:
    "Join the PowerGridBD field force. Submit your technician application for review by grid operators.",
};

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-deep-charcoal font-sans">
      <LandingNav />
      <main className="pt-16">
        <section className="container mx-auto px-4 pt-16 pb-8 lg:pt-24">
          <SectionHeading
            align="center"
            eyebrow="Field Force Recruitment"
            title="Apply as a field technician."
            description="Submit your credentials for operator review. Verified technicians receive outage dispatches in their zone."
          />
          <TechnicianApplicationForm />
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
