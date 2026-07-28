# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assert.spec.ts >> to be hidden
- Location: tests\assert.spec.ts:3:5

# Error details

```
Error: page.goto: net::ERR_NETWORK_ACCESS_DENIED at https://the-internet.herokuapp.com/dynamic_loading/1
Call log:
  - navigating to "https://the-internet.herokuapp.com/dynamic_loading/1", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("to be hidden", async ({ page }) => {
> 4  |   await page.goto("https://the-internet.herokuapp.com/dynamic_loading/1");
     |              ^ Error: page.goto: net::ERR_NETWORK_ACCESS_DENIED at https://the-internet.herokuapp.com/dynamic_loading/1
  5  |   await expect(page.locator("#finish")).toBeHidden();
  6  | 
  7  |   await page.locator("#start button").click();
  8  |   await expect(page.locator("#finish")).toHaveText("Hello World!", {
  9  |     timeout: 10_000,
  10 |   });
  11 | });
  12 | 
```