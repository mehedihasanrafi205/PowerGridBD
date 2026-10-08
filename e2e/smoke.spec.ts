import { expect, test } from "@playwright/test";

/**
 * Smoke suite — public surfaces, auth validation, theme,
 * route protection, and the custom 404. No test touches
 * the backend; everything asserted is deterministic markup,
 * client validation, or client-side navigation.
 */

test("landing renders the hero cockpit", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /national grid visibility/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /powergridbd/i }).first(),
  ).toBeVisible();
});

test("login renders the form and tester accounts", async ({ page }) => {
  await page.goto("/auth/login");
  await expect(
    page.getByRole("heading", { name: /sign in to console/i }),
  ).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/^password/i)).toBeVisible();
  // All three env tester personas are offered.
  await expect(
    page.getByRole("button", { name: /superadmin@powergrid\.bd/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /operator@powergrid\.bd/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /technician@powergrid\.bd/i }),
  ).toBeVisible();
});

test("login validates empty submission", async ({ page }) => {
  await page.goto("/auth/login");
  await page.getByRole("button", { name: /^sign in/i }).click();
  await expect(page.getByText(/invalid email address/i)).toBeVisible();
  await expect(page.getByText(/password is required/i)).toBeVisible();
});

test("register page renders", async ({ page }) => {
  await page.goto("/auth/register");
  await expect(
    page.getByRole("heading", { name: /create account/i }),
  ).toBeVisible();
  await expect(page.getByLabel(/confirm password/i)).toBeVisible();
});

test("theme toggle switches to dark and persists", async ({ page }) => {
  await page.goto("/auth/login");
  await page.getByRole("button", { name: /change theme/i }).click();
  await page.getByRole("menuitem", { name: /^dark/i }).click();
  await expect(page.locator("html.dark")).toHaveCount(1);
  const stored = await page.evaluate(() =>
    window.localStorage.getItem("powergridbd-theme"),
  );
  expect(stored).toBe("dark");
});

test("unauthenticated dashboard access redirects to login", async ({
  page,
}) => {
  await page.goto("/customer");
  await expect(page).toHaveURL(/\/auth\/login/);
});

test("unknown routes render the branded 404", async ({ page }) => {
  await page.goto("/nonexistent-xyz-route");
  await expect(
    page.getByRole("heading", { name: /page not found/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
});

test("technician application flow renders", async ({ page }) => {
  await page.goto("/apply");
  await expect(
    page.getByRole("heading", { name: /apply as a field technician/i }),
  ).toBeVisible();
  await expect(page.getByLabel(/full name/i)).toBeVisible();
  await expect(page.getByLabel(/experience/i)).toBeVisible();
  // Submission is intentionally never triggered here: it would
  // create a real applicant record and send a real OTP email.
});

test("application verification renders with prefilled email", async ({
  page,
}) => {
  await page.goto("/apply/verify?email=tech%40example.com");
  await expect(
    page.getByRole("heading", { name: /confirm your application/i }),
  ).toBeVisible();
  await expect(page.getByLabel(/email/i)).toHaveValue("tech@example.com");
});
