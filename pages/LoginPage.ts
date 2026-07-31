import { Page, Locator } from "@playwright/test";

export class LoginPage {
  // define variables - private and read only
  readonly page: Page;
  readonly loginLink: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;

  //Construction
  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.getByRole("link", { name: "Log in" });
    this.usernameInput = page.locator("#loginusername");
    this.passwordInput = page.locator("#loginpassword");
    this.loginBtn = page.getByRole("button", { name: "Log in" });
  }

  // action methods

  async clickLoginLink() {
    await this.loginLink.click();
  }

  async enterUserName(username: string) {
    await this.usernameInput.fill(username);
  }

  async enterUserPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLoginBtn() {
    await this.loginBtn.click();
  }

  async performLogin(username: string, password: string)
  {
      await this.clickLoginLink();
      await this.enterUserName(username);
      await this.enterUserPassword(password);
      await this.clickLoginBtn();
  }
}
