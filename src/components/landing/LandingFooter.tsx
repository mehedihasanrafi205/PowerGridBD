"use client";

import { motion, type Variants } from "framer-motion";
import { Activity, ArrowUpRight, GitBranch, Shield, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { easing } from "@/lib/animation";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing.easeOut },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: easing.easeOut },
  },
};

export function LandingFooter() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <motion.div
        className="container mx-auto px-4 py-14"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand Column */}
          <motion.div className="col-span-2" variants={columnVariants}>
            <Link
              href="/"
              className="flex items-center gap-2 mb-4"
              aria-label="PowerGridBD Home"
            >
              <Image
                src="/logo.svg"
                alt="PowerGridBD logo"
                width={750}
                height={750}
                className="h-8 w-8"
                loading="lazy"
                decoding="async"
              />
              <span className="text-xl font-bold text-white">PowerGridBD</span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6 max-w-xs">
              Load Shedding & Power Outage Management Platform for
              Bangladesh&apos;s power distribution ecosystem.
            </p>
            <div className="flex items-center gap-2">
              <motion.span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-400"
                whileHover={{ scale: 1.02 }}
              >
                <Activity className="h-3 w-3 text-emerald" />
                v1.0
              </motion.span>
              <motion.span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-400"
                whileHover={{ scale: 1.02 }}
              >
                <Shield className="h-3 w-3 text-smart-teal" />
                SSLCommerz
              </motion.span>
              <motion.span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-400"
                whileHover={{ scale: 1.02 }}
              >
                <Zap className="h-3 w-3 text-amber" />4 ROLES
              </motion.span>
            </div>
          </motion.div>

          {/* Platform Column */}
          <motion.nav variants={columnVariants} aria-label="Platform">
            <motion.h3
              className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4"
              variants={linkVariants}
            >
              Platform
            </motion.h3>
            <motion.ul
              className="space-y-2.5"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
            >
              {[
                { href: "/#platform", label: "Outage Management" },
                { href: "/#platform", label: "Load-Shedding Scheduler" },
                { href: "/#platform", label: "Grid Hierarchy" },
                { href: "/pricing", label: "SLA & Priority" },
              ].map((item) => (
                <motion.li key={item.href} variants={linkVariants}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>

          {/* Roles Column */}
          <motion.nav variants={columnVariants} aria-label="Roles">
            <motion.h3
              className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4"
              variants={linkVariants}
            >
              Roles
            </motion.h3>
            <motion.ul
              className="space-y-2.5"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
            >
              {[
                { href: "/#roles", label: "Customer Portal" },
                { href: "/#roles", label: "Technician Portal" },
                { href: "/#roles", label: "Power Operator" },
                { href: "/#roles", label: "Admin Console" },
              ].map((item) => (
                <motion.li key={item.href} variants={linkVariants}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>

          {/* Resources Column */}
          <motion.nav variants={columnVariants} aria-label="Resources">
            <motion.h3
              className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4"
              variants={linkVariants}
            >
              Resources
            </motion.h3>
            <motion.ul
              className="space-y-2.5"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
            >
              {[
                { href: "/about", label: "About" },
                { href: "/services", label: "Services" },
                { href: "/contact", label: "Contact" },
                { href: "/pricing", label: "Pricing & FAQ" },
              ].map((item) => (
                <motion.li key={item.href} variants={linkVariants}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>

          {/* Repositories Column */}
          <motion.nav variants={columnVariants} aria-label="Repositories">
            <motion.h3
              className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4"
              variants={linkVariants}
            >
              Repositories
            </motion.h3>
            <motion.ul
              className="space-y-2.5"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
            >
              {[
                {
                  href: "https://github.com/mehedihasanrafi205/PowerGridBD",
                  label: "Frontend",
                  external: true,
                },
                {
                  href: "https://github.com/mehedihasanrafi205/PowerGridBD-Backend",
                  label: "Backend",
                  external: true,
                },
              ].map((item) => (
                <motion.li key={item.href} variants={linkVariants}>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={item.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {item.label}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>
        </div>

        <motion.div
          className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-zinc-500">
            © 2026 PowerGridBD. All rights reserved.
          </p>
          <motion.div
            className="flex items-center gap-6"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
          >
            <motion.a
              href="/#platform"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              variants={linkVariants}
            >
              Platform
            </motion.a>
            <motion.a
              href="/#roles"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              variants={linkVariants}
            >
              Roles
            </motion.a>
            <motion.a
              href="/pricing"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              variants={linkVariants}
            >
              Pricing
            </motion.a>
            <motion.a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/mehedihasanrafi205/PowerGridBD"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
              variants={linkVariants}
            >
              <GitBranch className="h-3.5 w-3.5" />
              GitHub
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
