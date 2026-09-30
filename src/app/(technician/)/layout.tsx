import Link from "next/link";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/technician", icon: "home" },
  {
    name: "Assigned Outages",
    href: "/technician/outages",
    icon: "alert-triangle",
  },
  { name: "Performance", href: "/technician/summary", icon: "bar-chart" },
  { name: "Profile", href: "/technician/profile", icon: "user" },
];

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r min-h-screen flex flex-col">
        <div className="p-4 border-b">
          <Link href="/technician" className="text-xl font-bold text-emerald">
            PowerGridBD
          </Link>
          <p className="text-xs text-muted-foreground mt-1">
            Technician Portal
          </p>
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
