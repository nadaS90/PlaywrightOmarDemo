import { Page, Locator } from "@playwright/test";

export class CartPage {
  private readonly page: Page;
  private readonly productNamesInCart: Locator;

  constructor(page: Page) {
    this.page = page;

    // Product name column in the cart table
    this.productNamesInCart = this.page.locator("#tbodyid tr td:nth-child(2)");
  }

  // Check whether a specific product exists in the cart
  async checkProductInCart(productName: string){
    await this.productNamesInCart.first().waitFor({ state: "visible" });
    const products = await this.productNamesInCart.all();

    for (const product of products) {
      const name = (await product.textContent())?.trim();

      console.log(name);

      if (name === productName) {
        return true;
      }
    }

    return false;
  }
}
