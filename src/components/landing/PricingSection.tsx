"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Lock, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks";
import { easing } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

interface Product {
  name: string;
  description: string;
  price: string;
  period: string;
  icon: React.ReactNode;
  iconColor: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  ctaVariant: "default" | "outline";
  badge?: string;
  badgeColor?: string;
}

const products: Product[] = [
  {
    name: "Priority Restoration Pass",
    description:
      "Jump any outage report to the top of every staff work queue with a verified SSLCommerz transaction.",
    price: "BDT 500",
    period: "per outage",
    icon: <Zap className="h-5 w-5" />,
    iconColor: "text-amber",
    features: [
      "Outage flagged as PRIORITY instantly",
      "Top of all technician work queues",
      "Verified via SSLCommerz cascade",
      "Full audit trail written",
      "One-time purchase per outage",
    ],
    ctaText: "Report Outage First",
    ctaHref: "/customer/outage/report",
    ctaVariant: "outline",
    badge: "PER OUTAGE",
    badgeColor: "text-amber",
  },
  {
    name: "SLA Subscription",
    description:
      "Thirty days of priority-backed service: every outage you report is automatically flagged priority, with a guaranteed response window.",
    price: "BDT 2,000",
    period: "30 days",
    icon: <Shield className="h-5 w-5" />,
    iconColor: "text-smart-teal",
    features: [
      "All outages auto-flagged PRIORITY",
      "30-day coverage window",
      "Auto-expiry with renewal",
      "Verified via SSLCommerz cascade",
      "Full audit trail written",
    ],
    ctaText: "Subscribe via Sign-In",
    ctaHref: "/auth/login",
    ctaVariant: "outline",
    badge: "30 DAYS",
    badgeColor: "text-smart-teal",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.easeOut },
  },
  hover: {
    y: -8,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
    transition: { duration: 0.3, ease: easing.easeOut },
  },
};

const iconVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, rotate: 3 },
  transition: { duration: 0.3, ease: easing.easeOut },
};

export function PricingSection() {
  const { ref, isVisible } = useReveal({ threshold: 0.05 });

  return (
    <section
      id="pricing"
      className="bg-zinc-950 py-20 lg:py-28 border-t border-zinc-900"
    >
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
        className="container mx-auto px-4"
      >
        <SectionHeading
          align="center"
          eyebrow="Service Products"
          title="Pay for priority when it matters."
          description="Two SSLCommerz-verified products. No hidden fees, no fake checkout — real payments processed through Bangladesh's leading gateway in test mode."
        />

        <motion.div
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
        >
          {products.map((product, index) => (
            <motion.article
              key={product.name}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className={cn(
                "relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {product.badge && (
                <motion.span
                  className={cn(
                    "absolute -top-3 left-8 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 font-mono text-[10px] uppercase tracking-widest text-zinc-400",
                    product.badgeColor,
                  )}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {product.badge}
                </motion.span>
              )}

              <motion.div
                className="flex items-center gap-3 mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className={cn(
                    "p-3 rounded-lg bg-zinc-900 border border-zinc-800",
                    product.iconColor,
                  )}
                  whileHover="hover"
                  variants={iconVariants}
                >
                  {product.icon}
                </motion.div>
                <span className="font-medium text-lg text-white">
                  {product.name}
                </span>
              </motion.div>

              <motion.div
                className="flex items-baseline gap-2 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="font-mono text-4xl font-bold text-white tabular-nums">
                  {product.price}
                </span>
                <span className="text-sm text-zinc-500">{product.period}</span>
              </motion.div>

              <motion.p
                className="text-sm text-zinc-400 leading-relaxed mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {product.description}
              </motion.p>

              <motion.ul
                className="space-y-2.5 mb-8 flex-1"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                initial="hidden"
                animate="visible"
              >
                {product.features.map((feature) => (
                  <motion.li
                    key={feature}
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className="flex items-start gap-2.5 text-sm text-zinc-300"
                  >
                    <motion.span
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.span>
                    {feature}
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                className="mt-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link href={product.ctaHref}>
                  <Button
                    variant={product.ctaVariant}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 h-12 rounded-lg",
                      product.ctaVariant === "default"
                        ? "bg-electric-blue hover:bg-electric-blue/90 text-white"
                        : "border-zinc-700 bg-zinc-900/60 text-sm font-medium text-zinc-200 hover:bg-zinc-800/60 hover:text-white transition-colors",
                    )}
                  >
                    {product.ctaText}
                    {product.ctaVariant === "default" && (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    {product.ctaVariant === "outline" && (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </Button>
                </Link>
                <motion.p
                  className="flex items-center justify-center gap-1.5 mt-4 text-xs text-zinc-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Lock className="h-3 w-3" />
                  SSLCommerz Test Mode
                </motion.p>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-xs font-mono text-zinc-600 mt-10 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          Prices are server-authoritative. The backend rejects any amount that
          does not match the configured product price, preventing underpayment.
        </motion.p>
      </motion.div>
    </section>
  );
}
