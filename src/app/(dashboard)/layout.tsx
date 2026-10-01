"use client";


import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { UserMenu } from "@/components/layout/user-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  AlertTriangle,
  PlusCircle,
  Shield,
  CreditCard,
  User,
  BarChart3,
  GitBranch,
  Calendar,
  UserPlus,
  FileText,
  Users,
  Settings,
  AlertCircle,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "success" | "warning" | "info";
}

const navItems: NavItem[] = [
  // Customer items
  { name: "Dashboard", href: "/customer", icon: <Home className="h-5 w-5" />, roles: ["CUSTOMER"] },
  { name: "My Outages", href: "/customer/outages", icon: <AlertTriangle className="h-5 w-5" />, roles: ["CUSTOMER"] },
  { name: "Report Outage", href: "/customer/outage/report", icon: <PlusCircle className="h-5 w-5" />, roles: ["CUSTOMER"] },
  { name: "SLA Subscription", href: "/customer/sla", icon: <Shield className="h-5 w-5" />, roles: ["CUSTOMER"] },
  { name: "Payments", href: "/customer/payments", icon: <CreditCard className="h-5 w-5" />, roles: ["CUSTOMER"] },
  { name: "Profile", href: "/customer/profile", icon: <User className="h-5 w-5" />, roles: ["CUSTOMER"] },

  // Technician items
  { name: "Dashboard", href: "/technician", icon: <Home className="h-5 w-5" />, roles: ["TECHNICIAN"] },
  { name: "Assigned Outages", href: "/technician/outages", icon: <AlertTriangle className="h-5 w-5" />, roles: ["TECHNICIAN"] },
  { name: "Performance", href: "/technician/summary", icon: <BarChart3 className="h-5 w-5" />, roles: ["TECHNICIAN"] },
  { name: "Profile", href: "/technician/profile", icon: <User className="h-5 w-5" />, roles: ["TECHNICIAN"] },

  // Operator items
  { name: "Dashboard", href: "/operator", icon: <Home className="h-5 w-5" />, roles: ["POWER_OPERATOR"] },
  { name: "Grid Hierarchy", href: "/operator/grid", icon: <GitBranch className="h-5 w-5" />, roles: ["POWER_OPERATOR"] },
  { name: "Outage Management", href: "/operator/outages", icon: <AlertTriangle className="h-5 w-5" />, roles: ["POWER_OPERATOR"] },
  { name: "Schedules", href: "/operator/schedules", icon: <Calendar className="h-5 w-5" />, roles: ["POWER_OPERATOR"] },
  { name: "Applications", href: "/operator/applications", icon: <UserPlus className="h-5 w-5" />, roles: ["POWER_OPERATOR"] },
  { name: "Analytics", href: "/operator/analytics", icon: <BarChart3 className="h-5 w-5" />, roles: ["POWER_OPERATOR"] },
  { name: "Audit Logs", href: "/operator/audit-logs", icon: <FileText className="h-5 w-5" />, roles: ["POWER_OPERATOR"] },

  // Admin items
  { name: "Dashboard", href: "/admin", icon: <Home className="h-5 w-5" />, roles: ["ADMIN"] },
  { name: "Users", href: "/admin/users", icon: <Users className="h-5 w-5" />, roles: ["ADMIN"] },
  { name: "Applications", href: "/admin/applications", icon: <UserPlus className="h-5 w-5" />, roles: ["ADMIN"] },
  { name: "Payments", href: "/admin/payments", icon: <CreditCard className="h-5 w-5" />, roles: ["ADMIN"] },
  { name: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="h-5 w-5" />, roles: ["ADMIN"] },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: <FileText className="h-5 w-5" />, roles: ["ADMIN"] },
  { name: "Grid Management", href: "/admin/grid", icon: <GitBranch className="h-5 w-5" />, roles: ["ADMIN"] },
  { name: "Outages", href: "/admin/outages", icon: <AlertCircle className="h-5 w-5" />, roles: ["ADMIN"] },
];

const roleColors: Record<string, string> = {
  CUSTOMER: "text-primary",
  TECHNICIAN: "text-emerald-600",
  POWER_OPERATOR: "text-amber-600",
  ADMIN: "text-red-600",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <aside className="w-64 border-r bg-card min-h-screen">
          <div className="p-4 border-b">
            <span className="text-xl font-bold text-primary">PowerGridBD</span>
          </div>
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-3/4 bg-muted rounded animate-pulse" />
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
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
  }

  const userRole = user.role;
  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));
  const roleColor = roleColors[userRole] || "text-gray-600";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
          true ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className={cn("flex items-center justify-between border-b p-4", true && "justify-center")}>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">PowerGridBD</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-primary/10 text-primary",
                    true && "justify-center px-2"
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!true && (
                    <>
                      <span className="truncate font-medium">{item.name}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "ml-auto text-xs px-2 py-0.5 rounded-full",
                            item.badgeVariant === "destructive" && "bg-red-100 text-red-600",
                            item.badgeVariant === "success" && "bg-green-100 text-green-600",
                            item.badgeVariant === "warning" && "bg-yellow-100 text-yellow-600",
                            item.badgeVariant === "info" && "bg-blue-100 text-blue-600",
                            "bg-gray-100 text-gray-600"
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

          {/* Collapse toggle */}
          <div className="border-t p-2">
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm",
                "hover:bg-accent transition-colors"
              )}
            >
              <svg
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  true && "rotate-180"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("flex-1 min-h-screen", true ? "lg:ml-16" : "lg:ml-64")}>
        <div className={cn("flex-1", true ? "lg:ml-16" : "lg:ml-64")}>
          {/* Header */}
          <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
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
                        userRole === "CUSTOMER" && "bg-blue-100 text-blue-600",
                        userRole === "TECHNICIAN" && "bg-green-100 text-green-600",
                        userRole === "POWER_OPERATOR" && "bg-yellow-100 text-yellow-600",
                        userRole === "ADMIN" && "bg-red-100 text-red-600"
                      )}
                    >
                      {user?.role}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Breadcrumbs & Content */}
          <div className="container mx-auto py-6 px-4">
            <nav className="flex items-center gap-1 text-sm mb-4 lg:mb-6" aria-label="Breadcrumb">
              <span className="text-muted-foreground">Dashboard</span>
              <span className="mx-1 text-muted-foreground">/</span>
              <span className="font-medium text-foreground">{pathname.split("/").pop() || "Dashboard"}</span>
            </nav>

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}