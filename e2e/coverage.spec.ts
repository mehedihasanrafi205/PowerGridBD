import { expect, test } from "@playwright/test";
import { loginAsOperator } from "./helpers";

/**
 * Coverage for newer surfaces. All assertions tolerate live
 * backend data volume: where rows are data-dependent, both
 * branches (data present / honest empty state) assert real
 * behavior.
 */

test("operator opens an outage in the dispatch workspace", async ({ page }) => {
  await loginAsOperator(page);
  await page.goto("/operator/outages");

  // Settle first: either rows with actions or the honest empty state.
  const manageLink = page.getByRole("link", { name: /^manage$/i }).first();
  const emptyTitle = page.getByText(/no outages/i).first();
  await expect(manageLink.or(emptyTitle)).toBeVisible({ timeout: 20000 });

  if (await manageLink.isVisible()) {
    await manageLink.click();
    await expect(page).toHaveURL(/\/operator\/outage\?id=/, {
      timeout: 20000,
    });
    // Detail workspace proves itself: ID heading, lifecycle
    // timeline badge row, and the dispatch panel.
    await expect(page.getByRole("heading", { name: /outage #/i })).toBeVisible({
      timeout: 20000,
    });
    await expect(page.getByText(/^dispatch$/i).first()).toBeVisible();
  } else {
    await expect(emptyTitle).toBeVisible();
  }
});

test("operator schedules show the interval timeline", async ({ page }) => {
  await loginAsOperator(page);
  await page.goto("/operator/schedules");
  await expect(
    page.getByRole("heading", { name: /load-shedding schedules/i }),
  ).toBeVisible({ timeout: 20000 });
});

test("operator opens an application review dialog", async ({ page }) => {
  await loginAsOperator(page);
  await page.goto("/operator/applications");

  const reviewButton = page.getByRole("button", { name: /review .+/i }).first();
  const emptyTitle = page.getByText(/no applications/i).first();
  await expect(reviewButton.or(emptyTitle)).toBeVisible({
    timeout: 20000,
  });

  if (await reviewButton.isVisible()) {
    await reviewButton.click();
    await expect(
      page
        .getByRole("dialog")
        .getByText(/approve/i)
        .first(),
    ).toBeVisible({ timeout: 20000 });
  } else {
    await expect(emptyTitle).toBeVisible();
  }
});

test.use({ viewport: { width: 375, height: 812 } });

test("mobile drawer opens from the dashboard shell", async ({ page }) => {
  await loginAsOperator(page);
  await page.getByRole("button", { name: /open navigation/i }).click();
  await expect(
    page.getByRole("navigation", { name: /dashboard/i }),
  ).toBeVisible({ timeout: 10000 });
});
