"use client";

import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  GitBranch,
  Home,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  Shield,
  User,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { useAuth } from "@/hooks";
import { roleBadgeVariant } from "@/lib/status-variants";
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

/**
 * Navigates unauthenticated visitors to the login page.
 * Rendered only in the unauthenticated branch so the
 * redirect effect itself stays unconditional.
 */
function AuthRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.push("/auth/login");
  }, [router]);
  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
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
        <AuthRedirect />
        Redirecting...
      </div>
    );
  }

  const userRole = user.role;
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole),
  );

  // Role-specific dashboard home route
  const roleHomeRoute: Record<string, string> = {
    CUSTOMER: "/customer",
    TECHNICIAN: "/technician",
    POWER_OPERATOR: "/operator",
    ADMIN: "/admin",
  };

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
              href={roleHomeRoute[userRole] || "/"}
              className="flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              {expanded ? (
                <Logo variant="full" size="md" className="gap-2" />
              ) : (
                <LogoMark size="md" className="text-primary" />
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
                pathname === item.href ||
                (item.name !== "Dashboard" &&
                  pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.name}
                  aria-current={isActive ? "page" : undefined}
                  title={!expanded ? item.name : undefined}
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
          {/* Header - shadcn style with theme toggle and user menu */}
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

                <div className="flex items-center gap-3">
                  {/* Theme Toggle */}
                  <ThemeToggle />

                  {/* User Menu Dropdown - shadcn style */}
                  {user && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label={`Account menu for ${user.name}`}
                          className="flex items-center gap-2 rounded-full p-1.5 transition-colors hover:bg-accent"
                        >
                          <img
                            src={user.profileImage || ""}
                            alt={user.name}
                            className="h-8 w-8 rounded-full bg-muted object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling?.classList.remove(
                                "hidden",
                              );
                            }}
                          />
                          <span className="hidden h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium md:block text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                          <span className="hidden text-sm font-medium md:block">
                            {user.name}
                          </span>
                          <ChevronDown className="h-4 w-4 hidden md:block text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64">
                        <div className="px-2 py-1.5">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                          <div className="mt-1.5">
                            <Badge variant={roleBadgeVariant(user.role)}>
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="flex items-center gap-2">
                          <Settings
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          Account
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link
                            href={roleHomeRoute[userRole] || "/"}
                            className="flex w-full items-center gap-2"
                            onClick={() => setMobileOpen(false)}
                          >
                            <LayoutDashboard
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        {userRole === "CUSTOMER" && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link
                                href="/customer/profile"
                                className="flex w-full items-center gap-2"
                              >
                                <UserRound
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                                Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href="/customer/payments"
                                className="flex w-full items-center gap-2"
                              >
                                <CreditCard
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                                Payments
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        {userRole === "TECHNICIAN" && (
                          <DropdownMenuItem asChild>
                            <Link
                              href="/technician/profile"
                              className="flex w-full items-center gap-2"
                            >
                              <UserRound
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                              Profile
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={async () => {
                            await logout();
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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
