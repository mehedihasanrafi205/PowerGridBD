import { Check, ChevronDown, Lock, Shield, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { LiveStatusStrip } from "@/components/landing/LiveStatusStrip";
import { SectionHeading } from "@/components/landing/SectionHeading";

export const metadata: Metadata = {
  title: "Pricing & FAQ — PowerGridBD",
  description:
    "PowerGridBD pricing: BDT 500 Priority Restoration Pass per outage and BDT 2,000 30-day SLA subscription, processed securely via SSLCommerz.",
  openGraph: {
    title: "Pricing & FAQ — PowerGridBD",
    description:
      "SSLCommerz-verified priority restoration and SLA subscription pricing.",
    type: "website",
  },
};

const products = [
  {
    name: "Priority Restoration Pass",
    price: "BDT 500",
    period: "per outage",
    icon: <Zap className="h-6 w-6" />,
    accent: "text-amber",
    description:
      "Move a single outage report to the top of every staff work queue, verified end-to-end by SSLCommerz.",
    features: [
      "Outage flagged PRIORITY instantly on payment success",
      "Leads every technician and operator work queue",
      "Server-side cascade verification (val_id → sessionkey → tran_id)",
      "Side effects applied inside a database transaction",
      "One pass per outage — purchase from the outage detail page",
    ],
    cta: "Report an Outage",
    href: "/customer/outage/report",
  },
  {
    name: "SLA Subscription",
    price: "BDT 2,000",
    period: "30 days",
    icon: <Shield className="h-6 w-6" />,
    accent: "text-smart-teal",
    description:
      "Thirty days of priority-backed service — every outage you report is automatically flagged priority.",
    features: [
      "All outages auto-flagged PRIORITY for 30 days",
      "Coverage window starts at verified payment success",
      "Auto-expiry with clear slaExpiryDate tracking",
      "Renew any time — new window extends from purchase date",
      "Refundable via admin flow with full audit trail",
    ],
    cta: "Subscribe via Sign-In",
    href: "/auth/login",
  },
];

const faqs = [
  {
    question: "How is my payment verified?",
    answer:
      "After you complete checkout, the backend runs a cascade validation against SSLCommerz: it validates the order with val_id, checks the signed status, validates by session key, and falls back to a tran_id query. Only after the gateway confirms the transaction does a database transaction apply the priority flag or activate your SLA.",
  },
  {
    question: "What happens if a payment fails or is cancelled?",
    answer:
      "Nothing is applied. The payment record is marked FAILED or CANCELLED, the outage stays in the standard queue, and no SLA is activated. There are no partial side effects because all changes happen inside a single database transaction that only runs on gateway-confirmed success.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes. An admin can issue a refund through the payment management console. The refund reverses the effects: priority flags are cleared and SLA coverage is deactivated with its expiry date removed. The full reversal is written to the audit log.",
  },
  {
    question: "Why does the amount have to match exactly?",
    answer:
      "Prices are server-authoritative. The backend compares the submitted amount against the configured product price and rejects any mismatch, which prevents underpayment or tampered checkout requests.",
  },
  {
    question: "Is this live payment processing?",
    answer:
      "The platform integrates SSLCommerz in test mode, so checkout runs through the real gateway flow (initiate, redirect, success/fail/cancel callbacks, verification) using test credentials. No real money is charged in test mode.",
  },
  {
    question: "Who can purchase these products?",
    answer:
      "Any authenticated customer. Priority Restoration must be purchased from your own outage report, and only one active SLA subscription is allowed per account at a time.",
  },
];

export default function PricingPage() {
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
            eyebrow="Pricing"
            title="Two products. Real payments."
            description="Both products are processed through SSLCommerz with server-side verification — no fake checkouts, no placeholder flows."
          />
        </section>

        {/* Products */}
        <section className="bg-zinc-950 py-16 border-t border-zinc-900">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {products.map((product) => (
              <article
                key={product.name}
                className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 transition-colors hover:border-zinc-600"
              >
                <div
                  className={`flex items-center gap-3 mb-5 ${product.accent}`}
                >
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    {product.icon}
                  </div>
                  <span className="font-medium text-lg text-white">
                    {product.name}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-mono text-4xl font-bold text-white tabular-nums">
                    {product.price}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {product.period}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  {product.description}
                </p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-zinc-300"
                    >
                      <Check
                        className={`h-4 w-4 mt-0.5 flex-shrink-0 ${product.accent}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={product.href} className="mt-auto">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-lg border border-zinc-700 bg-zinc-900/60 text-sm font-medium text-zinc-200 hover:bg-zinc-800/60 hover:text-white transition-colors"
                  >
                    {product.cta}
                  </button>
                </Link>

                <p className="flex items-center justify-center gap-1.5 mt-4 text-xs text-zinc-600">
                  <Lock className="h-3 w-3" />
                  SSLCommerz Test Mode
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-16 lg:py-24">
          <SectionHeading
            align="center"
            eyebrow="FAQ"
            title="Payment questions, answered."
          />
          <div className="max-w-3xl mx-auto mt-12 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/40 open:border-zinc-600 transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-4 text-sm font-medium text-zinc-200 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="h-4 w-4 flex-shrink-0 text-zinc-500 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
