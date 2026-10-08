import type { Page } from "@playwright/test";

/** Shared sign-in helpers for authenticated specs. */

export async function loginAsOperator(page: Page) {
  await loginViaForm(
    page,
    "operator@powergrid.bd",
    "Operator@12345",
    /\/operator/,
  );
}

export async function loginAsTechnician(page: Page) {
  await loginViaForm(
    page,
    "technician@powergrid.bd",
    "Tech@12345",
    /\/technician/,
  );
}

export async function loginAsAdmin(page: Page) {
  await loginViaForm(page, "superadmin@powergrid.bd", "Admin@12345", /\/admin/);
}

async function loginViaForm(
  page: Page,
  email: string,
  password: string,
  dashboardPattern: RegExp,
) {
  await page.goto("/auth/login");
  // Grace period for dev-hydration before interacting.
  await page.waitForTimeout(2000);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/^password/i).fill(password);
  await page.getByRole("button", { name: /^sign in/i }).click();
  await page.waitForURL(dashboardPattern, { timeout: 40000 });
}
