import { test, expect } from "@playwright/test";

// test data
const searchItems: string[] = ["laptop", "Gift card", "smartphone", "monitor"];

/**
 * this method is using a for loop function
 * for (const item of searchItems)
{
  test(`search test for ${item}`, async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/");
    await page.locator("#small-searchterms").fill(item); // fill teh text in search box
    await page.locator("input[value='Search']").click(); // click on the button
    await expect
      .soft(page.locator("h2 a").nth(0))
      .toContainText(item, { ignoreCase: true }); //  check if results appear
  });
}
 */

/**
 * using for each function
 * it will be considered as 4 test cases according to eac item
searchItems.forEach((item)=>{
test(`search test for ${item}`, async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/");
    await page.locator("#small-searchterms").fill(item); // fill teh text in search box
    await page.locator("input[value='Search']").click(); // click on the button
    await expect
      .soft(page.locator("h2 a").nth(0))
      .toContainText(item, { ignoreCase: true }); //  check if results appear
  });
});
*/

/**
 * using the describe to group
 * it will be considered as one test case
 */
test.describe("searching for items", async () => {
  searchItems.forEach((item) => {
    test(`search test for ${item}`, async ({ page }) => {
      await page.goto("https://demowebshop.tricentis.com/");
      await page.locator("#small-searchterms").fill(item); // fill teh text in search box
      await page.locator("input[value='Search']").click(); // click on the button
      await expect
        .soft(page.locator("h2 a").nth(0))
        .toContainText(item, { ignoreCase: true }); //  check if results appear
    });
  });
});
