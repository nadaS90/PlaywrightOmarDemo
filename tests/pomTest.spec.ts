import test, { expect } from "@playwright/test";

import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";

test('user can login, add a product to the cart',async({page})=>{

    await page.goto("https://www.demoblaze.com/index.html");

    // Login page
    const loginPage = new LoginPage(page);
    await loginPage.performLogin('test20_26@test.com','test2');
    

    //home page
        const homePage = new HomePage(page);
        await homePage.addProductToCart('Samsung galaxy s6');
        await homePage.gotoCart();

    // cart page
        const cartPage = new CartPage(page);
       const isProductInCart =  await cartPage.checkProductInCart("Samsung galaxy s6");
       expect(isProductInCart).toBe(true);


})
