import { Locator, Page, expect } from "@playwright/test";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
  }


  async reload() {
    await this.page.reload();
  }

  async waitForPageLoaded() {
    await this.page.waitForLoadState("networkidle");
  }

  async verifyTitle(title: string | RegExp) {
    await expect(this.page).toHaveTitle(title);
  }

  async verifyUrl(url: string | RegExp) {
    await expect(this.page).toHaveURL(url);
  }

  async clickOnElement(element: Locator)
  {
    await element.click();
  }

  async SendTextToElement(element:Locator, text: string)
  {
    await element.fill(text);
  }

}
