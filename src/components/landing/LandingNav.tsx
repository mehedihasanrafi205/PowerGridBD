"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Radio, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLenis } from "@/components/animation";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/#platform", label: "Platform" },
  { href: "/#roles", label: "Roles" },
  { href: "/#operations", label: "Operations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

/**
 * LandingNav — edge-to-edge utility bar.
 *
 * Brand left, cockpit navigation center, utility cluster right
 * (live status pill + real clock, Report Outage quick link,
 * Operator Console CTA). The telemetry rail below it is the
 * separate LiveStatusStrip.
 *
 * The live pill reports platform connectivity (LIVE + real clock)
 * — never an invented grid measurement such as frequency or MW.
 */
export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const { lenis } = useLenis();

  // Live clock — starts after mount to avoid hydration mismatch on static export
  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Smooth scroll to anchor links using Lenis
  const handleAnchorClick = (href: string) => {
    if (href.startsWith("#") && lenis) {
      const target = document.querySelector(href) as HTMLElement | null;
      if (target) {
        lenis.scrollTo(target, { offset: -80, immediate: false });
      }
    }
  };

  const formatTime = (date: Date | null) =>
    date
      ? date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      : "00:00:00";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-electric-blue/20 bg-deep-charcoal/95 backdrop-blur-sm">
      <nav className="container mx-auto px-4" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="PowerGridBD Home"
            onClick={(e) => {
              if (lenis) e.preventDefault();
              handleAnchorClick("/");
            }}
          >
            <Image
              src="/logo.svg"
              alt="PowerGridBD logo"
              width={750}
              height={750}
              className="h-8 w-8"
              priority
            />
            <span className="hidden text-xl font-bold text-white sm:block">
              PowerGridBD
            </span>
          </Link>

          {/* Center cockpit navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                onClick={(e) => {
                  if (link.href.startsWith("#")) {
                    e.preventDefault();
                    handleAnchorClick(link.href);
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right utility cluster */}
          <div className="flex items-center gap-3">
            {/* Live status pill — platform connectivity, not a grid metric */}
            <div className="hidden items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1.5 md:flex">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-xs font-semibold text-emerald-400">
                LIVE
              </span>
              <Radio className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
              <span className="hidden font-mono tabular-nums text-xs text-zinc-300 xl:inline">
                {formatTime(time)}
              </span>
            </div>

            {/* Report Outage quick link */}
            <Link
              href="/customer/outage/report"
              className="hidden items-center gap-1.5 text-sm font-medium text-zinc-300 transition-colors hover:text-white lg:flex"
            >
              <Radio
                className="h-4 w-4 text-electric-blue"
                aria-hidden="true"
              />
              Report Outage
            </Link>

            {/* Operator Console CTA */}
            <Link href="/auth/login" className="hidden lg:block">
              <Button className="bg-electric-blue text-white hover:bg-electric-blue/90">
                Operator Console
              </Button>
            </Link>

            {/* Mobile menu button */}
            <motion.button
              type="button"
              className="rounded-lg p-2 text-zinc-300 hover:bg-zinc-800 hover:text-white lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence mode="wait">
          {mobileOpen && (
            <motion.div
              key="drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden lg:hidden"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="border-t border-zinc-800 py-4">
                <motion.div
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, staggerChildren: 0.05 }}
                >
                  {navLinks.map((link) => (
                    <motion.link
                      key={link.href}
                      href={link.href}
                      className="rounded-lg px-3 py-2 text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      onClick={(e) => {
                        if (link.href.startsWith("#")) {
                          e.preventDefault();
                          handleAnchorClick(link.href);
                        }
                        setMobileOpen(false);
                      }}
                    >
                      {link.label}
                    </motion.link>
                  ))}
                  <motion.div
                    className="flex flex-col gap-2 border-t border-zinc-800 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/customer/outage/report"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Report Outage
                      </Button>
                    </Link>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button className="w-full justify-start">
                        Operator Console
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
