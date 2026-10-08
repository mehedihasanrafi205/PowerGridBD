import { Mail, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/landing/ContactForm";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { LiveStatusStrip } from "@/components/landing/LiveStatusStrip";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact — PowerGridBD",
  description:
    "Contact the PowerGridBD operations team for outages, schedules, SLA subscriptions, or technician applications.",
  openGraph: {
    title: "Contact — PowerGridBD",
    description: "Reach the PowerGridBD operations team.",
    type: "website",
  },
};

const SUPPORT_EMAIL = "support@powergridbd.com";

export default function ContactPage() {
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
            eyebrow="Contact"
            title="Talk to the operations team."
            description="Questions about outages, schedules, SLA subscriptions, or technician applications — reach the team through your email client."
          />
        </section>

        <section className="bg-zinc-950 py-16 border-t border-zinc-900">
          <div className="container mx-auto px-4 grid lg:grid-cols-5 gap-10">
            {/* Channels */}
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-smart-teal">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white">Email Support</h3>
                </div>
                <p className="text-sm text-zinc-400 mb-3">
                  For outage reports, billing questions, and account help.
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-mono text-sm text-electric-blue hover:underline break-all"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white">In-Platform</h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Signed-in users can report outages, manage schedules, and
                  track payments directly in their role dashboard.
                </p>
                <p className="mt-3">
                  <Button
                    asChild
                    variant="outline"
                    className="border-zinc-700 text-zinc-200 hover:bg-zinc-800/60"
                  >
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </p>
              </div>
            </div>

            {/* Form (client component) */}
            <div className="lg:col-span-3">
              <ContactForm supportEmail={SUPPORT_EMAIL} />
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
