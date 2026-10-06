"use client";

import { Clock, Menu, Wifi, X, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState<Date | null>(null);

  // Live clock — starts after mount to avoid hydration mismatch on static export
  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date | null) =>
    date
      ? date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      : "00:00:00";

  const navLinks = [
    { href: "/#platform", label: "Platform" },
    { href: "/#roles", label: "Roles" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-deep-charcoal/95 backdrop-blur-sm border-b border-electric-blue/20">
      <nav className="container mx-auto px-4" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="PowerGridBD Home"
          >
            <svg
              className="h-8 w-8 text-white"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <rect
                width="32"
                height="32"
                rx="6"
                className="fill-electric-blue"
              />
              <path
                d="M16 6L16 26M6 16H26"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
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
              >
                {link.label}
              </Link>
            ))}

            {/* Live Status Indicators */}
            <div className="flex items-center gap-4 px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-700">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-emerald-400">LIVE</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-mono tabular-nums">0</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Wifi className="h-3.5 w-3.5 text-smart-teal" />
                <span className="font-mono tabular-nums">0</span>
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
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-zinc-800 animate-slide-down">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full justify-start">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
