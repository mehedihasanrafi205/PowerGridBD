"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type Theme, useTheme } from "./ThemeProvider";

interface ThemeOption {
  value: Theme;
  label: string;
  icon: typeof Sun;
}

const options: ThemeOption[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

/**
 * ThemeToggle — Light / Dark / System switcher.
 *
 * Built on the shadcn DropdownMenu (Radix) for full
 * keyboard accessibility (arrow keys, Escape, Enter).
 * The trigger is a fixed 36px square so opening the menu
 * never causes layout shift. The active option shows a
 * check mark; the choice persists via the ThemeProvider.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const ActiveIcon =
    options.find((option) => option.value === theme)?.icon ?? Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Change theme"
          className={cn(
            "inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
            className,
          )}
        >
          <ActiveIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Appearance
        </div>
        <DropdownMenuSeparator />
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex items-center gap-2",
                isActive && "font-medium",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="flex-1">{option.label}</span>
              {isActive && (
                <Check
                  className="h-3.5 w-3.5 text-primary"
                  aria-hidden="true"
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
