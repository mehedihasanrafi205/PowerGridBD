import { Activity, ArrowUpRight, GitBranch, Shield, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Platform",
    links: [
      { label: "Outage Management", href: "/#platform" },
      { label: "Load-Shedding Scheduler", href: "/#platform" },
      { label: "Grid Hierarchy", href: "/#platform" },
      { label: "SLA & Priority", href: "/pricing" },
    ],
  },
  {
    title: "Roles",
    links: [
      { label: "Customer Portal", href: "/#roles" },
      { label: "Technician Portal", href: "/#roles" },
      { label: "Power Operator", href: "/#roles" },
      { label: "Admin Console", href: "/#roles" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
      { label: "Pricing & FAQ", href: "/pricing" },
    ],
  },
  {
    title: "Repositories",
    links: [
      {
        label: "Frontend",
        href: "https://github.com/mehedihasanrafi205/PowerGridBD",
        external: true,
      },
      {
        label: "Backend",
        href: "https://github.com/mehedihasanrafi205/PowerGridBD-Backend",
        external: true,
      },
    ],
  },
];

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2">
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
              />
              <span className="text-xl font-bold text-white">PowerGridBD</span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6 max-w-xs">
              Load Shedding &amp; Power Outage Management Platform for
              Bangladesh&apos;s power distribution ecosystem.
            </p>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-400">
                <Activity className="h-3 w-3 text-emerald-400" />
                v1.0
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-400">
                <Shield className="h-3 w-3 text-smart-teal" />
                SSLCommerz
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-400">
                <Zap className="h-3 w-3 text-amber-400" />4 ROLES
              </span>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                      {link.external && <ArrowUpRight className="h-3 w-3" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            © {year} PowerGridBD. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/#platform"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Platform
            </Link>
            <Link
              href="/#roles"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Roles
            </Link>
            <Link
              href="/pricing"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="https://github.com/mehedihasanrafi205/PowerGridBD"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
            >
              <GitBranch className="h-3.5 w-3.5" />
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
