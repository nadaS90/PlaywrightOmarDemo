# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assert.spec.ts >> to be hidden
- Location: tests\assert.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('#finish')
Expected: visible
Received: hidden

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#finish')
    7 × locator resolved to <div id="finish">…</div>
      - unexpected value "hidden"
  - Test timeout of 30000ms exceeded.

```

```yaml
- link "Fork me on GitHub":
  - /url: https://github.com/tourdedave/the-internet
  - img "Fork me on GitHub"
- heading "Dynamically Loaded Page Elements" [level=3]
- 'heading "Example 1: Element on page that is hidden" [level=4]'
- button "Start"
- separator
- text: Powered by
- link "Elemental Selenium":
  - /url: http://elementalselenium.com/
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("to be hidden", async ({ page }) => {
  4  |   await page.goto("https://the-internet.herokuapp.com/dynamic_loading/1");
  5  |   await expect(page.locator("#finish")).toBeHidden();
  6  | 
  7  |   await page.locator("#start button").click();
> 8  |   await expect(page.locator("#finish")).toBeVisible();
     |                                         ^ Error: expect(locator).toBeVisible() failed
  9  | });
  10 | 
```