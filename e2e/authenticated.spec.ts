import { expect, test } from "@playwright/test";
import { loginAsAdmin, loginAsOperator, loginAsTechnician } from "./helpers";

/**
 * Authenticated flows — real tester credentials against the
 * live backend. Read-only navigation plus logout (no
 * mutations), so the suite is safe to run repeatedly.
 *
 * Credentials mirror the TESTER_* accounts in `.env.local`
 * and the login page persona cards.
 */

test("technician one-click login lands on the field dashboard", async ({
  page,
}) => {
  await page.goto("/auth/login");
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: /technician@powergrid\.bd/i }).click();
  await expect(page).toHaveURL(/\/technician/, { timeout: 40000 });
  await expect(
    page.getByRole("heading", { name: /welcome back|assigned/i }).first(),
  ).toBeVisible({ timeout: 20000 });
});

test("technician can open assigned outages and log out", async ({ page }) => {
  await loginAsTechnician(page);

  // Navigate to the outage queue (heading proves the page loaded
  // with a live session; row counts are data-dependent).
  await page.goto("/technician/outages");
  await expect(
    page.getByRole("heading", { name: /assigned outages/i }),
  ).toBeVisible({ timeout: 20000 });

  // Logout returns to the login screen.
  await page.getByRole("button", { name: /account menu/i }).click();
  await page.getByRole("menuitem", { name: /logout/i }).click();
  await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15000 });
});

test("operator form login lands on the command dashboard", async ({ page }) => {
  await loginAsOperator(page);
  await expect(
    page.getByRole("heading", { name: /operator dashboard/i }).first(),
  ).toBeVisible({ timeout: 20000 });
});

test("admin form login lands on the console", async ({ page }) => {
  await loginAsAdmin(page);
  await expect(
    page.getByRole("heading", { name: /admin console/i }).first(),
  ).toBeVisible({ timeout: 20000 });
});
