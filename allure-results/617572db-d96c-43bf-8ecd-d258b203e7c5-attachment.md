# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: paramtest1.spec.ts >> searching for items >> search test for monitor
- Location: tests\paramtest1.spec.ts:42:9

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h2 a').first()
Expected substring: "monitor"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "soft toContainText" with timeout 5000ms
  - waiting for locator('h2 a').first()

```

```yaml
- link "Tricentis Demo Web Shop":
  - /url: /
  - img "Tricentis Demo Web Shop"
- list:
  - listitem:
    - link "Register":
      - /url: /register
  - listitem:
    - link "Log in":
      - /url: /login
  - listitem:
    - link "Shopping cart (0)":
      - /url: /cart
  - listitem:
    - link "Wishlist (0)":
      - /url: /wishlist
- status
- textbox: Search store
- button "Search"
- list:
  - listitem:
    - link "Books":
      - /url: /books
  - listitem:
    - link "Computers":
      - /url: /computers
  - listitem:
    - link "Electronics":
      - /url: /electronics
  - listitem:
    - link "Apparel & Shoes":
      - /url: /apparel-shoes
  - listitem:
    - link "Digital downloads":
      - /url: /digital-downloads
  - listitem:
    - link "Jewelry":
      - /url: /jewelry
  - listitem:
    - link "Gift Cards":
      - /url: /gift-cards
- strong: Categories
- list:
  - listitem:
    - link "Books":
      - /url: /books
  - listitem:
    - link "Computers":
      - /url: /computers
  - listitem:
    - link "Electronics":
      - /url: /electronics
  - listitem:
    - link "Apparel & Shoes":
      - /url: /apparel-shoes
  - listitem:
    - link "Digital downloads":
      - /url: /digital-downloads
  - listitem:
    - link "Jewelry":
      - /url: /jewelry
  - listitem:
    - link "Gift Cards":
      - /url: /gift-cards
- strong: Manufacturers
- list:
  - listitem:
    - link "Tricentis":
      - /url: /tricentis
- strong: Newsletter
- text: "Sign up for our newsletter:"
- textbox
- button "Subscribe"
- heading "Search" [level=1]
- text: "Search keyword:"
- textbox "Search keyword:": monitor
- checkbox "Advanced search"
- text: Advanced search
- button "Search"
- strong: No products were found that matched your criteria.
- heading "Information" [level=3]
- list:
  - listitem:
    - link "Sitemap":
      - /url: /sitemap
  - listitem:
    - link "Shipping & Returns":
      - /url: /shipping-returns
  - listitem:
    - link "Privacy Notice":
      - /url: /privacy-policy
  - listitem:
    - link "Conditions of Use":
      - /url: /conditions-of-use
  - listitem:
    - link "About us":
      - /url: /about-us
  - listitem:
    - link "Contact us":
      - /url: /contactus
- heading "Customer service" [level=3]
- list:
  - listitem:
    - link "Search":
      - /url: /search
  - listitem:
    - link "News":
      - /url: /news
  - listitem:
    - link "Blog":
      - /url: /blog
  - listitem:
    - link "Recently viewed products":
      - /url: /recentlyviewedproducts
  - listitem:
    - link "Compare products list":
      - /url: /compareproducts
  - listitem:
    - link "New products":
      - /url: /newproducts
- heading "My account" [level=3]
- list:
  - listitem:
    - link "My account":
      - /url: /customer/info
  - listitem:
    - link "Orders":
      - /url: /customer/orders
  - listitem:
    - link "Addresses":
      - /url: /customer/addresses
  - listitem:
    - link "Shopping cart":
      - /url: /cart
  - listitem:
    - link "Wishlist":
      - /url: /wishlist
- heading "Follow us" [level=3]
- list:
  - listitem:
    - link "Facebook":
      - /url: http://www.facebook.com/nopCommerce
  - listitem:
    - link "Twitter":
      - /url: https://twitter.com/nopCommerce
  - listitem:
    - link "RSS":
      - /url: /news/rss/1
  - listitem:
    - link "YouTube":
      - /url: http://www.youtube.com/user/nopCommerce
  - listitem:
    - link "Google+":
      - /url: https://plus.google.com/+nopcommerce
- text: Powered by
- link "nopCommerce":
  - /url: http://www.nopcommerce.com/
- text: Copyright © 2026 Tricentis Demo Web Shop. All rights reserved.
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | // test data
  4  | const searchItems: string[] = ["laptop", "Gift card", "smartphone", "monitor"];
  5  | 
  6  | /**
  7  |  * this method is using a for loop function
  8  |  * for (const item of searchItems)
  9  | {
  10 |   test(`search test for ${item}`, async ({ page }) => {
  11 |     await page.goto("https://demowebshop.tricentis.com/");
  12 |     await page.locator("#small-searchterms").fill(item); // fill teh text in search box
  13 |     await page.locator("input[value='Search']").click(); // click on the button
  14 |     await expect
  15 |       .soft(page.locator("h2 a").nth(0))
  16 |       .toContainText(item, { ignoreCase: true }); //  check if results appear
  17 |   });
  18 | }
  19 |  */
  20 | 
  21 | /**
  22 |  * using for each function
  23 |  * it will be considered as 4 test cases according to eac item
  24 | searchItems.forEach((item)=>{
  25 | test(`search test for ${item}`, async ({ page }) => {
  26 |     await page.goto("https://demowebshop.tricentis.com/");
  27 |     await page.locator("#small-searchterms").fill(item); // fill teh text in search box
  28 |     await page.locator("input[value='Search']").click(); // click on the button
  29 |     await expect
  30 |       .soft(page.locator("h2 a").nth(0))
  31 |       .toContainText(item, { ignoreCase: true }); //  check if results appear
  32 |   });
  33 | });
  34 | */
  35 | 
  36 | /**
  37 |  * using the describe to group
  38 |  * it will be considered as one test case
  39 |  */
  40 | test.describe("searching for items", async () => {
  41 |   searchItems.forEach((item) => {
  42 |     test(`search test for ${item}`, async ({ page }) => {
  43 |       await page.goto("https://demowebshop.tricentis.com/");
  44 |       await page.locator("#small-searchterms").fill(item); // fill teh text in search box
  45 |       await page.locator("input[value='Search']").click(); // click on the button
  46 |       await expect
  47 |         .soft(page.locator("h2 a").nth(0))
> 48 |         .toContainText(item, { ignoreCase: true }); //  check if results appear
     |          ^ Error: expect(locator).toContainText(expected) failed
  49 |     });
  50 |   });
  51 | });
  52 | 
```