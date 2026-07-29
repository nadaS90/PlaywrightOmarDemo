# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: formAuthentication.spec.ts >> user can log in through Form Authentication
- Location: tests\formAuthentication.spec.ts:4:5

# Error details

```
Error: page.goto: net::ERR_NETWORK_ACCESS_DENIED at https://the-internet.herokuapp.com/
Call log:
  - navigating to "https://the-internet.herokuapp.com/", waiting until "load"

```

# Test source

```ts
  1  | import { Locator, Page, expect } from "@playwright/test";
  2  | 
  3  | export abstract class BasePage {
  4  |   constructor(protected readonly page: Page) {}
  5  | 
  6  |   async goto(url: string) {
> 7  |     await this.page.goto(url);
     |                     ^ Error: page.goto: net::ERR_NETWORK_ACCESS_DENIED at https://the-internet.herokuapp.com/
  8  |   }
  9  | 
  10 | 
  11 |   async reload() {
  12 |     await this.page.reload();
  13 |   }
  14 | 
  15 |   async waitForPageLoaded() {
  16 |     await this.page.waitForLoadState("networkidle");
  17 |   }
  18 | 
  19 |   async verifyTitle(title: string | RegExp) {
  20 |     await expect(this.page).toHaveTitle(title);
  21 |   }
  22 | 
  23 |   async verifyUrl(url: string | RegExp) {
  24 |     await expect(this.page).toHaveURL(url);
  25 |   }
  26 | 
  27 |   async clickOnElement(element: Locator)
  28 |   {
  29 |     await element.click();
  30 |   }
  31 | 
  32 |   async SendTextToElement(element:Locator, text: string)
  33 |   {
  34 |     await element.fill(text);
  35 |   }
  36 | 
  37 | }
  38 | 
```