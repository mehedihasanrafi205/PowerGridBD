"use client";

import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  GitBranch,
  Home,
  PlusCircle,
  Shield,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
  badge?: string;
  badgeVariant?:
    | "default"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info";
}

const navItems: NavItem[] = [
  // Customer items
  {
    name: "Dashboard",
    href: "/customer",
    icon: <Home className="h-5 w-5" />,
    roles: ["CUSTOMER"],
  },
  {
    name: "My Outages",
    href: "/customer/outages",
    icon: <AlertTriangle className="h-5 w-5" />,
    roles: ["CUSTOMER"],
  },
  {
    name: "Report Outage",
    href: "/customer/outage/report",
    icon: <PlusCircle className="h-5 w-5" />,
    roles: ["CUSTOMER"],
  },
  {
    name: "Schedules",
    href: "/customer/schedules",
    icon: <Calendar className="h-5 w-5" />,
    roles: ["CUSTOMER"],
  },
  {
    name: "SLA Subscription",
    href: "/customer/sla",
    icon: <Shield className="h-5 w-5" />,
    roles: ["CUSTOMER"],
  },
  {
    name: "Payments",
    href: "/customer/payments",
    icon: <CreditCard className="h-5 w-5" />,
    roles: ["CUSTOMER"],
  },
  {
    name: "Profile",
    href: "/customer/profile",
    icon: <User className="h-5 w-5" />,
    roles: ["CUSTOMER"],
  },

  // Technician items
  {
    name: "Dashboard",
    href: "/technician",
    icon: <Home className="h-5 w-5" />,
    roles: ["TECHNICIAN"],
  },
  {
    name: "Assigned Outages",
    href: "/technician/outages",
    icon: <AlertTriangle className="h-5 w-5" />,
    roles: ["TECHNICIAN"],
  },
  {
    name: "Performance",
    href: "/technician/summary",
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ["TECHNICIAN"],
  },
  {
    name: "Profile",
    href: "/technician/profile",
    icon: <User className="h-5 w-5" />,
    roles: ["TECHNICIAN"],
  },

  // Operator items
  {
    name: "Dashboard",
    href: "/operator",
    icon: <Home className="h-5 w-5" />,
    roles: ["POWER_OPERATOR"],
  },
  {
    name: "Grid Hierarchy",
    href: "/operator/grid",
    icon: <GitBranch className="h-5 w-5" />,
    roles: ["POWER_OPERATOR"],
  },
  {
    name: "Outage Management",
    href: "/operator/outages",
    icon: <AlertTriangle className="h-5 w-5" />,
    roles: ["POWER_OPERATOR"],
  },
  {
    name: "Schedules",
    href: "/operator/schedules",
    icon: <Calendar className="h-5 w-5" />,
    roles: ["POWER_OPERATOR"],
  },
  {
    name: "Applications",
    href: "/operator/applications",
    icon: <UserPlus className="h-5 w-5" />,
    roles: ["POWER_OPERATOR"],
  },
  {
    name: "Analytics",
    href: "/operator/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ["POWER_OPERATOR"],
  },
  {
    name: "Audit Logs",
    href: "/operator/audit-logs",
    icon: <FileText className="h-5 w-5" />,
    roles: ["POWER_OPERATOR"],
  },

  // Admin items
  {
    name: "Dashboard",
    href: "/admin",
    icon: <Home className="h-5 w-5" />,
    roles: ["ADMIN"],
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
    roles: ["ADMIN"],
  },
  {
    name: "Applications",
    href: "/admin/applications",
    icon: <UserPlus className="h-5 w-5" />,
    roles: ["ADMIN"],
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: <CreditCard className="h-5 w-5" />,
    roles: ["ADMIN"],
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ["ADMIN"],
  },
  {
    name: "Audit Logs",
    href: "/admin/audit-logs",
    icon: <FileText className="h-5 w-5" />,
    roles: ["ADMIN"],
  },
  {
    name: "Grid Management",
    href: "/admin/grid",
    icon: <GitBranch className="h-5 w-5" />,
    roles: ["ADMIN"],
  },
  {
    name: "Outages",
    href: "/admin/outages",
    icon: <AlertCircle className="h-5 w-5" />,
    roles: ["ADMIN"],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile drawer with Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <aside className="w-64 border-r bg-card min-h-screen">
          <div className="p-4 border-b">
            <span className="text-xl font-bold text-primary">PowerGridBD</span>
          </div>
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 w-3/4 bg-muted rounded animate-pulse"
              />
            ))}
          </div>
        </aside>
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto py-8">
            <div className="h-8 w-1/4 bg-muted rounded animate-pulse mb-4" />
            <div className="h-64 bg-muted rounded animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Redirecting...
      </div>
    );
  }

  const userRole = user.role;
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole),
  );

  // Labels are visible in the mobile drawer and whenever the
  // desktop sidebar is expanded.
  const expanded = mobileOpen || !collapsed;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar — overlay drawer on mobile, collapsible rail on desktop */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          collapsed ? "lg:w-16" : "lg:w-64",
          "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div
            className={cn(
              "flex items-center justify-between border-b p-4",
              !expanded && "lg:justify-center",
            )}
          >
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              {expanded ? (
                <span className="text-xl font-bold text-primary">
                  PowerGridBD
                </span>
              ) : (
                <span
                  className="hidden text-xl font-bold text-primary lg:block"
                  aria-hidden="true"
                >
                  PG
                </span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav
            className="flex-1 overflow-y-auto p-2 space-y-1"
            aria-label="Dashboard"
          >
            {filteredNavItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-primary/10 text-primary",
                    !expanded && "lg:justify-center lg:px-2",
                  )}
                >
                  <span className="shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                  {expanded && (
                    <>
                      <span className="truncate font-medium">{item.name}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "ml-auto text-xs px-2 py-0.5 rounded-full",
                            item.badgeVariant === "destructive" &&
                              "bg-destructive/10 text-destructive",
                            item.badgeVariant === "success" &&
                              "bg-emerald/10 text-emerald",
                            item.badgeVariant === "warning" &&
                              "bg-amber/10 text-amber",
                            item.badgeVariant === "info" &&
                              "bg-electric-blue/10 text-electric-blue",
                            "bg-muted text-muted-foreground",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Collapse toggle — desktop only */}
          <div className="hidden border-t p-2 lg:block">
            <button
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setCollapsed((prev) => !prev)}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm",
                "hover:bg-accent transition-colors",
              )}
            >
              <svg
                aria-hidden="true"
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  collapsed && "rotate-180",
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 min-h-screen",
          collapsed ? "lg:ml-16" : "lg:ml-64",
        )}
      >
        <div className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Mobile nav trigger */}
                  <button
                    type="button"
                    aria-label="Open navigation"
                    onClick={() => setMobileOpen(true)}
                    className="rounded-md p-2 hover:bg-accent lg:hidden"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-3">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        userRole === "CUSTOMER" &&
                          "bg-electric-blue/10 text-electric-blue",
                        userRole === "TECHNICIAN" &&
                          "bg-smart-teal/10 text-smart-teal",
                        userRole === "POWER_OPERATOR" &&
                          "bg-amber/10 text-amber",
                        userRole === "ADMIN" &&
                          "bg-destructive/10 text-destructive",
                      )}
                    >
                      {user?.role}
                    </span>
                  </div>

                  <ThemeToggle />

                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      {user?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Breadcrumbs & Content */}
          <div className="container mx-auto py-6 px-4">
            <nav
              className="flex items-center gap-1 text-sm mb-4 lg:mb-6"
              aria-label="Breadcrumb"
            >
              <span className="text-muted-foreground">Dashboard</span>
              <span className="mx-1 text-muted-foreground">/</span>
              <span className="font-medium text-foreground">
                {pathname.split("/").pop() || "Dashboard"}
              </span>
            </nav>

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
