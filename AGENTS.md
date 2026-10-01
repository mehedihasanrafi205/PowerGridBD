<!-- BEGIN:nextjs-agent-rules -->

## Project Backend 
Backend Repository: https://github.com/mehedihasanrafi205/PowerGridBD-Backend
Backend Live: https://powergridbd-backend.vercel.app

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project-Specific Agent Guide

## Stack
- **Next.js 16.3.7** (App Router, React 19.2.8)
- **Bun 1.4.2** — package manager & runtime
- **Biome 2.4.2** — lint + format (replaces ESLint/Prettier)
- **Tailwind CSS v4** — CSS-first config, CSS variables for theming
- **shadcn/ui** — "base-nova" style, RSC enabled, lucide icons
- **React Compiler** — enabled via `babel-plugin-react-compiler`

## Commands
```bash
bun dev          # dev server (Turbopack)
bun build        # static export to /out
bun start        # serve static export
bun lint         # biome check
bun format       # biome format --write
```

## Key Config
- `output: "export"` in `next.config.ts` — produces static site in `/out`
- `reactCompiler: true` — automatic memoization, no `useMemo`/`useCallback` needed
- Path alias `@/*` → `./src/*` (tsconfig + components.json)
- CSS variables for all colors (globals.css) — dark mode via `.dark` class

## Conventions
- **No `useMemo`/`useCallback`** — React Compiler handles it
- **Class merging** — use `cn()` from `@/lib/utils` (re-exports `cn` package)
- **Components** — colocate in `src/components/ui/` for shadcn components
- **Fonts** — Geist Sans/Mono + Inter loaded via `next/font` in layout.tsx
- **Images** — use `next/image` (configured for static export)

## Gotchas
- `node_modules` + `.next` + `out` are ignored by Biome
- `sharp` and `unrs-resolver` are trusted deps with ignored scripts
- Static export means no API routes, no server components with dynamic data
- CSS uses `@import "tailwindcss"` (v4 syntax), not `@tailwind base/components/utilities`

