"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLenis } from "@/components/animation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#platform", label: "Platform" },
  { href: "/#roles", label: "Roles" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#contact", label: "Contact" },
];

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-deep-charcoal/95 backdrop-blur-sm border-b border-electric-blue/20">
      <nav className="container mx-auto px-4" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
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
            <span className="text-xl font-bold text-white hidden sm:block">
              PowerGridBD
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
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

            {/* Live Status Indicator */}
            <div className="flex items-center gap-4 px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-700">
              <div className="flex items-center gap-1.5 text-xs">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="font-mono text-emerald-400">LIVE</span>
              </div>
            </div>

            {/* Clock */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-700">
              <Clock className="h-3.5 w-3.5 text-zinc-500" />
              <span className="font-mono tabular-nums text-xs text-zinc-300">
                {formatTime(time)}
              </span>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-zinc-300 hover:text-white"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button className="bg-electric-blue hover:bg-electric-blue/90 text-white">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            type="button"
            className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800"
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

        {/* Mobile Drawer with Framer Motion */}
        <AnimatePresence mode="wait">
          {mobileOpen && (
            <motion.div
              key="drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="py-4 border-t border-zinc-800">
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
                      className="px-3 py-2 text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg"
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
                    className="pt-4 border-t border-zinc-800 flex flex-col gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button className="w-full justify-start">
                        Get Started
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
