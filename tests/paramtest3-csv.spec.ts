import { test, expect } from "@playwright/test";
import fs from "fs";
import { parse } from "csv-parse/sync";
//Reading data from csv
const csvPath = "testdata/data.csv";
const fileContent = fs.readFileSync(csvPath, "utf-8");

type LoginRecord = {
  email: string;
  password: string;
  validity: string;
};

const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
}) as LoginRecord[];

for (const record of records) {
  test.describe("Login data driven test", () => {
    test(`Login test for ${record.email} and ${record.password}`, async ({ page }) => {
      await page.goto("https://demowebshop.tricentis.com/login");

      // Fill login form
      await page.locator("#Email").fill(record.email);
      await page.locator("#Password").fill(record.password);
      await page.locator('input[value="Log in"]').click();

      if (record.validity.toLowerCase() === "valid") {
        // Assert logout link is visible - indicates successful login
        const logoutLink = page.locator('a[href="/logout"]');
        await expect(logoutLink).toBeVisible({ timeout: 5000 });
      } else {
        // Assert error message is visible
        const errorMessage = page.locator(".validation-summary-errors");
        await expect(errorMessage).toBeVisible({ timeout: 5000 });

        // Assert user is still on the login page
        await expect(page).toHaveURL("https://demowebshop.tricentis.com/login");
      }
    });
  });
}
