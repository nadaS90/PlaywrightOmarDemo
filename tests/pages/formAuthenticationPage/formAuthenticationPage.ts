import { Locator, Page } from "@playwright/test";
import { BasePage } from "../basePage";

export class FormAuthenticationPage extends BasePage {
  readonly formAuthenticationLink: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly flashMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.formAuthenticationLink = page.getByRole("link", {
      name: "Form Authentication",
      exact: true,
    });
    this.usernameInput = page.getByRole("textbox", { name: "Username" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: /Login/ });
    this.flashMessage = page.locator("#flash");
  }

  async navigateToHomePage() {
    await this.goto("https://the-internet.herokuapp.com/");
  }

  async openFormAuthentication() {
    await this.clickOnElement(this.formAuthenticationLink);
  }

  async login(username: string, password: string) {
    await this.SendTextToElement(this.usernameInput, username);
    await this.SendTextToElement(this.passwordInput, password);
    await this.clickOnElement(this.loginButton);
  }

  async waitForTenSeconds() {
    await this.page.waitForTimeout(10_000);
  }
}
