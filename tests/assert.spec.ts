import { test, expect } from "@playwright/test";

test("to be hidden", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/dynamic_loading/1");
  await expect(page.locator("#finish")).toBeHidden();

  await page.locator("#start button").click();
  await expect(page.locator("#finish")).toBeVisible();
});
