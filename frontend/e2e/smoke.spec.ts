/** Smoke test — verifies Store Workbench loads and login screen renders. */

import { test, expect } from "@playwright/test";

test("should load login screen", async ({ page }) => {
  await page.goto("/");
  // Should redirect to /login
  await expect(page).toHaveURL(/\/login/);
  // Login form should be visible
  await expect(page.getByTestId("username-input")).toBeVisible();
  await expect(page.getByTestId("password-input")).toBeVisible();
  await expect(page.getByTestId("login-button")).toBeVisible();
  // Title should show Health One
  await expect(page.locator("h1")).toContainText("Health One");
});

test("should redirect to login when accessing protected route", async ({
  page,
}) => {
  await page.goto("/customers");
  await expect(page).toHaveURL(/\/login/);
});
