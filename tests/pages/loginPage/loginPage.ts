import { Locator, Page } from "@playwright/test";
import { BasePage } from "../basePage";


export class LoginPage extends BasePage {
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.getByPlaceholder("Username");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.errorMessage = page.locator(".error-message");
  }

//   // Actions
//   async login(username: string, password: string){
//     await this.SendTextToElement(this.usernameInput, username);
//     await this.SendTextToElement(this.passwordInput, password);
//     await this.clickOnElement(this.loginButton, login);
//   }

  async enterUsername(username: string) {
    await this.SendTextToElement(this.usernameInput, username);
  }

  async enterPassword(password: string) {
    await this.SendTextToElement(this.passwordInput, password);
  }

  async clickLogin() {
    await this.clickOnElement(this.loginButton);
  }
}
