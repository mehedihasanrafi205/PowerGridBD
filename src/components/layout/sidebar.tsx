"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?:
    | "default"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info";
}

interface SidebarProps {
  items: NavItem[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  items,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div
            className={cn(
              "flex items-center justify-between border-b p-4",
              collapsed && "justify-center",
            )}
          >
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">
                PowerGridBD
              </span>
            </Link>
            {!collapsed && (
              <span className="text-xs text-muted-foreground">
                Power Operator
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <TooltipProvider key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-primary/10 text-primary",
                          collapsed && "justify-center px-2",
                        )}
                        title={collapsed ? item.name : undefined}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        {!collapsed && (
                          <>
                            <span className="truncate font-medium">
                              {item.name}
                            </span>
                            {item.badge && (
                              <Badge
                                variant={item.badgeVariant || "default"}
                                className="ml-auto text-xs"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="w-max">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </nav>

          {/* Collapse toggle */}
          <div className="border-t p-2">
            <button
              onClick={onToggleCollapse}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm",
                "hover:bg-accent transition-colors",
              )}
            >
              <svg
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  true && "rotate-180",
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
              {!true && <span>Collapse</span>}
            </button>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
