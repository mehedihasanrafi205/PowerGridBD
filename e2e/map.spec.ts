"use client";

import { expect, test } from "@playwright/test";

test("hero map renders container and markers", async ({ page }) => {
  await page.goto("/");

  // Wait for the map container to be visible (the inner div with explicit height)
  const mapContainer = page.locator('[data-testid="hero-map-container"]');
  await expect(mapContainer).toBeVisible({ timeout: 15000 });

  // Wait for leaflet container to be visible
  const leafletContainer = page.locator(".leaflet-container");
  await expect(leafletContainer).toBeVisible({ timeout: 30000 });

  // Deterministic demo topology markers.
  await expect(page.locator(".pg-node")).toHaveCount(8, {
    timeout: 20000,
  });

  await expect(page.locator(".pg-node").first()).toBeVisible({
    timeout: 10000,
  });
});

test("map marker opens a detail popup on click", async ({ page }) => {
  await page.goto("/");

  // Wait for the map to be ready
  const mapContainer = page.locator('[data-testid="hero-map-container"]');
  await expect(mapContainer).toBeVisible({ timeout: 15000 });

  const leafletContainer = page.locator(".leaflet-container");
  await expect(leafletContainer).toBeVisible({ timeout: 30000 });

  // Wait for markers to render
  await expect(page.locator(".pg-node")).toHaveCount(8, { timeout: 20000 });

  // Click the first marker
  await page.locator(".pg-node").first().click();

  // Wait for popup to appear
  await expect(page.locator(".leaflet-popup")).toBeVisible({ timeout: 10000 });
});

test("hero map stays contained and responsive across viewport sizes", async ({
  page,
}) => {
  const viewports = [
    { width: 375, height: 812, expectedMapHeight: 320 },
    { width: 768, height: 1024, expectedMapHeight: 392 },
    { width: 1440, height: 900, expectedMapHeight: 500 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const mapCard = page.getByTestId("hero-map-card");
    await expect(mapCard).toBeVisible();
    await expect(page.locator(".leaflet-container")).toBeVisible();

    const bounds = await page.evaluate(() => {
      const card = document
        .querySelector('[data-testid="hero-map-card"]')
        ?.getBoundingClientRect();
      const map = document
        .querySelector(".leaflet-container")
        ?.getBoundingClientRect();
      const navbar = document.querySelector("header")?.getBoundingClientRect();
      const heading = document.querySelector("h1")?.getBoundingClientRect();

      if (!card || !map || !navbar || !heading) {
        throw new Error(
          "Expected hero map, navbar, and heading to be rendered",
        );
      }

      return {
        card: {
          top: card.top,
          bottom: card.bottom,
          left: card.left,
          right: card.right,
          height: card.height,
        },
        map: { top: map.top, bottom: map.bottom, height: map.height },
        navbarBottom: navbar.bottom,
        heading: {
          left: heading.left,
          right: heading.right,
          top: heading.top,
          bottom: heading.bottom,
        },
      };
    });

    expect(bounds.card.height).toBe(viewport.expectedMapHeight);
    expect(bounds.map.top).toBeGreaterThanOrEqual(bounds.card.top);
    expect(bounds.map.bottom).toBeLessThanOrEqual(bounds.card.bottom);
    expect(bounds.card.top).toBeGreaterThanOrEqual(bounds.navbarBottom);
    expect(
      bounds.card.bottom <= bounds.heading.top ||
        bounds.card.top >= bounds.heading.bottom ||
        bounds.card.right <= bounds.heading.left ||
        bounds.card.left >= bounds.heading.right,
    ).toBe(true);
    if (viewport.width >= 1024) {
      const textTop = await page
        .locator("h1")
        .evaluate(
          (heading) => heading.parentElement?.getBoundingClientRect().top,
        );
      expect(bounds.card.top).toBeLessThanOrEqual(textTop ?? Infinity);
    }

    await page.evaluate(() => {
      const card = document
        .querySelector('[data-testid="hero-map-card"]')
        ?.getBoundingClientRect();
      if (!card) throw new Error("Expected hero map card to be rendered");
      window.scrollTo({
        top: card.top + window.scrollY - 4,
        behavior: "instant",
      });
    });
    await page.waitForFunction(() => {
      const card = document.querySelector('[data-testid="hero-map-card"]');
      const header = document.querySelector("header");
      return Boolean(
        card &&
          header &&
          card.getBoundingClientRect().top <
            header.getBoundingClientRect().bottom,
      );
    });

    const navbar = page.locator("header");
    await expect(navbar).toBeVisible();
    const navbarLayering = await page.evaluate(() => {
      const header = document.querySelector("header");
      const card = document.querySelector('[data-testid="hero-map-card"]');
      if (!header || !card) {
        throw new Error("Expected navbar and hero map card to be rendered");
      }

      const headerStyle = getComputedStyle(header);
      const headerRect = header.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const overlapTop = Math.max(cardRect.top, headerRect.top);
      const elementAtHeader = document.elementFromPoint(
        cardRect.left + Math.min(12, cardRect.width / 2),
        overlapTop + Math.min(12, headerRect.bottom - overlapTop - 1),
      );

      return {
        headerZIndex: Number(headerStyle.zIndex),
        cardZIndex: Number(getComputedStyle(card).zIndex),
        headerBackground: headerStyle.backgroundColor,
        overlap: cardRect.top < headerRect.bottom,
        headerCoversMap: header.contains(elementAtHeader),
      };
    });

    expect(navbarLayering.headerZIndex).toBeGreaterThan(
      navbarLayering.cardZIndex,
    );
    expect(navbarLayering.headerBackground).toBe("rgb(9, 12, 20)");
    expect(navbarLayering.overlap).toBe(true);
    expect(navbarLayering.headerCoversMap).toBe(true);
  }
});
