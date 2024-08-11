import { test, expect } from "@playwright/test";

test("404 Page", async ({ page }) => {
    await page.goto("http://localhost:3000/not-found");
    await expect(page).toHaveTitle(/Not Found/);
});
