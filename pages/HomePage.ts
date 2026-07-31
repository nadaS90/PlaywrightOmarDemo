import { Page, Locator } from "@playwright/test";

export class HomePage {
  private readonly page: Page;
  private readonly productsList: Locator;
  private readonly addToCartButton: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsList = this.page.locator(
      "div#tbodyid div.card h4.card-title a",
    );
    this.addToCartButton = this.page.locator('a:has-text("Add to cart")');
    this.cartLink = this.page.locator("#cartur");
  }

  // Method to add a specific product to cart
  async addProductToCart(productName: string) {
    const productElements = await this.productsList.all();

    for (const product of await productElements) {
      const name = await product.textContent();

      if (name?.trim() === productName) {
        await product.click();
        break;
      }
    }

    // Wait for the confirmation to be accepted before navigating away.
    const dialogPromise = this.page.waitForEvent("dialog");
    await this.addToCartButton.click();
    const dialog = await dialogPromise;
    await dialog.accept();
  }

  // Method to navigate to the cart
  async gotoCart() {
    await this.cartLink.click();
  }
}
