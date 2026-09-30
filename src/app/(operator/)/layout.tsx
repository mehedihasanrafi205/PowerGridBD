import Link from "next/link";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/operator", icon: "home" },
  { name: "Grid Hierarchy", href: "/operator/grid", icon: "git-branch" },
  {
    name: "Outage Management",
    href: "/operator/outages",
    icon: "alert-triangle",
  },
  { name: "Schedules", href: "/operator/schedules", icon: "calendar" },
  { name: "Applications", href: "/operator/applications", icon: "user-plus" },
  { name: "Analytics", href: "/operator/analytics", icon: "bar-chart" },
  { name: "Audit Logs", href: "/operator/audit-logs", icon: "file-text" },
];

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r min-h-screen flex flex-col">
        <div className="p-4 border-b">
          <Link href="/operator" className="text-xl font-bold text-amber">
            PowerGridBD
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Power Operator</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Link
            href="/auth/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <div className="container mx-auto py-8">{children}</div>
      </main>
    </div>
  );
}
