import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage/loginPage";
import { ProductPage } from "../pages/productPage/productPage";

type PageFixtures = {
  loginPage: LoginPage;
  productPage: ProductPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
});

export { expect };
