import { test, expect } from "@playwright/test";

test("404", async ({ page }) => {
    await page.goto("http://localhost:3000/not-found");
});
