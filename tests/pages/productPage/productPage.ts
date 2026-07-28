import { Locator, Page } from "@playwright/test";
import { BasePage } from "../basePage";


export class ProductPage extends BasePage {
  // Locators
  readonly backPackAddToCartBtn: Locator;
  readonly cartBtn: Locator;


  constructor(page: Page) {
    super(page);

    //this.backPackAddToCartBtn = page.getByTestId("add-to-cart-sauce-labs-backpack");
    this.backPackAddToCartBtn = page
      .locator(".inventory_item")
      .filter({ hasText: "Sauce Labs Backpack" })
      .getByRole('button',{name:'Add to cart'});
      
    this.cartBtn = page.locator(".shopping_cart_link");
    
  }


  async clickOnAddCart(){
    await this.clickOnElement(this.backPackAddToCartBtn);
  }

  async clickOnCartBtn(){
    await this.clickOnElement(this.cartBtn);
  }

}
