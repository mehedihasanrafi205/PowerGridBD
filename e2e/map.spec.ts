"use client";

import { expect, test } from "@playwright/test";

test("hero map renders container and markers", async ({ page }) => {
  await page.goto("/");
  const map = page.locator(".pg-map .leaflet-container");
  await expect(map).toBeVisible({ timeout: 30000 });

  // Deterministic demo topology markers.
  // Wait longer for tiles and markers to render
  await expect(page.locator(".pg-node")).toHaveCount(8, {
    timeout: 30000,
  });

  await expect(page.locator(".pg-node").first()).toBeVisible({ timeout: 10000 });
});

test("map marker opens a detail popup on click", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".pg-map .leaflet-container")).toBeVisible({
    timeout: 30000,
  });
  await page.locator(".pg-node").first().click();
  await expect(page.locator(".leaflet-popup")).toBeVisible({
    timeout: 15000,
  });
});