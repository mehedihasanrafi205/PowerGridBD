import { defineConfig, devices } from "@playwright/test";

/**
 * E2E smoke suite (Phase K).
 *
 * Runs against the dev server. All assertions are
 * backend-independent (markup, validation, navigation,
 * theme persistence) so the suite is deterministic
 * without a live backend session.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chromium-headless-shell",
      },
    },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
