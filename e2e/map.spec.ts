"use client";

import { expect, test } from "@playwright/test";

test("hero map renders container and markers", async ({ page }) => {
  await page.goto("/");
  const map = page.locator(".pg-map .leaflet-container");
  await expect(map).toBeVisible({ timeout: 25000 });

  // Deterministic demo topology markers.
  await expect(page.locator(".pg-node")).toHaveCount(8, {
    timeout: 15000,
  });

  expect(page.locator(".pg-node").first()).toBeVisible();
});

test("map marker opens a detail popup on click", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".pg-map .leaflet-container")).toBeVisible({
    timeout: 25000,
  });
  await page.locator(".pg-node").first().click();
  await expect(page.locator(".leaflet-popup")).toBeVisible({
    timeout: 10000,
  });
});
