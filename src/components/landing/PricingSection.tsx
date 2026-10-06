"use client";

import { ArrowRight, Check, Lock, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useReveal } from "@/hooks";
import { cn } from "@/lib/utils";

interface PricingCard {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  accent: string;
  icon: React.ReactNode;
  cta: string;
  href: string;
  badge?: string;
}

const products: PricingCard[] = [
  {
    name: "Priority Restoration Pass",
    price: "BDT 500",
    period: "per outage",
    description:
      "Jump any outage report to the top of every staff work queue with a verified SSLCommerz transaction.",
    features: [
      "Outage flagged as PRIORITY instantly",
      "Top of all technician work queues",
      "Verified via SSLCommerz cascade",
      "Full audit trail written",
      "One-time purchase per outage",
    ],
    accent: "text-amber-400",
    icon: <Zap className="h-5 w-5" />,
    cta: "Report Outage First",
    href: "/customer/outage/report",
    badge: "PER OUTAGE",
  },
  {
    name: "SLA Subscription",
    price: "BDT 2,000",
    period: "30 days",
    description:
      "Thirty days of priority-backed service: every outage you report is automatically flagged priority, with a guaranteed response window.",
    features: [
      "All outages auto-flagged PRIORITY",
      "30-day coverage window",
      "Auto-expiry with renewal",
      "Verified via SSLCommerz cascade",
      "Full audit trail written",
    ],
    accent: "text-smart-teal",
    icon: <Shield className="h-5 w-5" />,
    cta: "Subscribe via Sign-In",
    href: "/auth/login",
    badge: "30 DAYS",
  },
];

export function PricingSection() {
  const { ref, isVisible } = useReveal({ threshold: 0.05 });

  return (
    <section
      id="pricing"
      className="bg-zinc-950 py-20 lg:py-28 border-t border-zinc-900"
    >
      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-widest uppercase text-smart-teal mb-3">
            <span className="h-0.5 w-12 bg-smart-teal/30" />
            Service Products
            <span className="h-0.5 w-12 bg-smart-teal/30" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Pay for priority when it matters.
          </h2>
          <p className="text-lg text-zinc-400">
            Two SSLCommerz-verified products. No hidden fees, no fake checkout —
            real payments processed through Bangladesh&apos;s leading gateway in
            test mode.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {products.map((product, index) => (
            <article
              key={product.name}
              className={cn(
                "relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 transition-all duration-500 hover:border-zinc-600 hover:bg-zinc-900/60",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {product.badge && (
                <span className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  {product.badge}
                </span>
              )}

              <div
                className={cn("flex items-center gap-3 mb-5", product.accent)}
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
                <span className="text-sm text-zinc-500">{product.period}</span>
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
                      className={cn(
                        "h-4 w-4 mt-0.5 flex-shrink-0",
                        product.accent,
                      )}
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
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>

              <p className="flex items-center justify-center gap-1.5 mt-4 text-xs text-zinc-600">
                <Lock className="h-3 w-3" />
                SSLCommerz Test Mode
              </p>
            </article>
          ))}
        </div>

        <p className="text-center text-xs font-mono text-zinc-600 mt-10 max-w-xl mx-auto leading-relaxed">
          Prices are server-authoritative. The backend rejects any amount that
          does not match the configured product price, preventing underpayment.
        </p>
      </div>
    </section>
  );
}
