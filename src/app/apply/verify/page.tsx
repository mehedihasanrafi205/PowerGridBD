import type { Metadata } from "next";
import { Suspense } from "react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { SectionHeading } from "@/components/landing/SectionHeading";
import ApplicationVerifyForm from "./ApplicationVerifyForm";

export const metadata: Metadata = {
  title: "Verify Application Email — PowerGridBD",
  description:
    "Enter the verification code sent to your email to complete your technician application.",
};

export default function ApplyVerifyPage() {
  return (
    <div className="min-h-screen bg-deep-charcoal font-sans">
      <LandingNav />
      <main className="pt-16">
        <section className="container mx-auto px-4 pt-16 pb-8 lg:pt-24">
          <SectionHeading
            align="center"
            eyebrow="Email Verification"
            title="Confirm your application."
            description="Enter the 6-digit code we sent to your email address."
          />
          <Suspense
            fallback={
              <p className="text-center text-muted-foreground">
                Loading verification…
              </p>
            }
          >
            <ApplicationVerifyForm />
          </Suspense>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
