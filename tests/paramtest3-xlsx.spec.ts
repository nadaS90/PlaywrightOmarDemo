import { test, expect } from "@playwright/test";
import fs from "fs";
import * as XLSX from 'xlsx'; 

import { parse } from "csv-parse/sync";
/**Reading data from XLSX file
 * open the file
 * find the workbook
 * select the targeted sheet
 * read the rows and columns
 */
const xlsxPath = "testdata/data.xlsx";
const workbook = XLSX.readFile(xlsxPath); 
const sheetNames = workbook.SheetNames[0];
const workSheet = workbook.Sheets[sheetNames];
/**
 * convert sheet into json
 */
const loginData:any = XLSX.utils.sheet_to_json(workSheet);

for (const {email,password,validity} of loginData) {
  test.describe("Login data driven test", () => {
    test(`Login test for ${email} and ${password}`, async ({ page }) => {
      await page.goto("https://demowebshop.tricentis.com/login");

      // Fill login form
      await page.locator("#Email").fill(email);
      await page.locator("#Password").fill(password);
      await page.locator('input[value="Log in"]').click();

      if (validity.toLowerCase() === "valid") {
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
