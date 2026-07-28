import { test, expect } from "./fixtures/fixture";
import * as testData from "./testData/testData.json"

test.beforeAll(async() => {
    console.log("Running before all tests");
})

test.beforeEach(async ({page}) => {
  console.log("Running before each tests");
        await page.goto("https://www.saucedemo.com/");

});

test.afterEach(async ({page}) => {
  console.log("Running after each tests");
  await page.close();
});

test.afterAll(async () => {
  console.log("Running after all tests");
});

test("E2e", async ({ page, loginPage, productPage }) => {
      console.log("Running sauce lab tests");

    //    await page.goto("https://www.saucedemo.com/");

  await loginPage.enterUsername(testData.username);
  await loginPage.enterPassword(testData.password);
  await loginPage.clickLogin();

  await productPage.clickOnAddCart();
  await productPage.clickOnCartBtn();

  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(page.getByText("Sauce Labs Backpack")).toBeVisible();
  
});

test("outside @smoke", async ({ page, loginPage, productPage }) => {
  console.log("Running sauce lab tests");

  await page.goto("https://www.saucedemo.com/");

});

test("outsideOne @smoke", async ({ page, loginPage, productPage }) => {
  console.log("Running sauce lab tests");

  await page.goto("https://www.saucedemo.com/");
});
