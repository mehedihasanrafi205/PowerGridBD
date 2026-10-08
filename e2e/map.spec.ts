"use client";

import { expect, test } from "@playwright/test";

test("hero map renders container and markers", async ({ page }) => {
  await page.goto("/");
  
  // Wait for the map wrapper to be visible first
  const mapWrapper = page.locator(".pg-map");
  await expect(mapWrapper).toBeVisible({ timeout: 15000 });
  
  // Wait for leaflet container to be visible
  const leafletContainer = page.locator(".pg-map .leaflet-container");
  await expect(leafletContainer).toBeVisible({ timeout: 30000 });

  // Deterministic demo topology markers.
  await expect(page.locator(".pg-node")).toHaveCount(8, {
    timeout: 20000,
  });

  await expect(page.locator(".pg-node").first()).toBeVisible({ timeout: 10000 });
});

test("map marker opens a detail popup on click", async ({ page }) => {
  await page.goto("/");
  
  // Wait for the map to be ready
  const mapWrapper = page.locator(".pg-map");
  await expect(mapWrapper).toBeVisible({ timeout: 15000 });
  
  const leafletContainer = page.locator(".pg-map .leaflet-container");
  await expect(leafletContainer).toBeVisible({ timeout: 30000 });
  
  // Wait for markers to render
  await expect(page.locator(".pg-node")).toHaveCount(8, { timeout: 20000 });
  
  // Click the first marker
  await page.locator(".pg-node").first().click();
  
  // Wait for popup to appear
  await expect(page.locator(".leaflet-popup")).toBeVisible({ timeout: 10000 });
});