"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => ({
      label: segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      href: "/" + array.slice(0, index + 1).join("/"),
      isLast: index === array.length - 1,
    }));

  if (segments.length === 0) return null;

  return (
    <nav
      className="flex items-center gap-1 text-sm mb-4 lg:mb-6"
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className={cn(
          "flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors",
        )}
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {segments.map((segment, index) => (
        <span key={segment.href} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {segment.isLast ? (
            <span className="font-medium text-foreground">{segment.label}</span>
          ) : (
            <Link
              href={segment.href}
              className={cn(
                "flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors",
              )}
            >
              {segment.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
