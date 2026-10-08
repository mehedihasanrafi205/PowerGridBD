"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

/** User-selectable theme preference. */
export type Theme = "light" | "dark" | "system";
/** The effective theme after resolving `system` against the OS. */
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

/** localStorage key for the persisted preference. */
export const THEME_STORAGE_KEY = "powergridbd-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Resolve the OS-level color scheme. */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Apply the resolved theme to <html>.
 *
 * Light mode is the default (no class); dark mode adds `.dark`,
 * which the design tokens in globals.css key off.
 */
function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * ThemeProvider — manages Light / Dark / System preference.
 *
 * SSR-safe: the initial render is identical on server and client
 * (defaults to "system"). The stored preference is read in a
 * `useEffect` after mount, so there is no hydration mismatch.
 * The pre-hydration theme (flash prevention) is handled by the
 * inline script rendered in the root layout.
 *
 * The preference is persisted to localStorage and the OS-level
 * `prefers-color-scheme` is respected while in System mode.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    // Read the stored preference after mount (client-only).
    let stored: Theme = "system";
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      if (raw === "light" || raw === "dark" || raw === "system") {
        stored = raw;
      }
    } catch {
      /* localStorage unavailable (private mode, etc.) */
    }
    setThemeState(stored);

    const resolved = stored === "system" ? getSystemTheme() : stored;
    setResolvedTheme(resolved);
    applyTheme(resolved);

    // Follow the OS preference while in System mode.
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setThemeState((current) => {
        if (current === "system") {
          const next: ResolvedTheme = event.matches ? "dark" : "light";
          setResolvedTheme(next);
          applyTheme(next);
        }
        return current;
      });
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore persistence errors */
    }
    const resolved = next === "system" ? getSystemTheme() : next;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Access the theme context from the nearest ThemeProvider. */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
