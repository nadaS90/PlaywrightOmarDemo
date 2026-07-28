# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: heroKuApp.spec.ts >> herokuapp
- Location: tests\heroKuApp.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#flash')
Expected substring: "You logged into a secure area!"
Received string:    ""

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#flash')
  - Protocol error (Runtime.callFunctionOn): Internal server error, session closed.

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('herokuapp', async ({ page }) => {
  4  |   await page.goto('https://the-internet.herokuapp.com/');
  5  |   await expect(page.locator('h1')).toContainText('Welcome to the-internet');
  6  |   await page.getByRole('link', { name: 'Form Authentication' }).click();
  7  |   await expect(page.locator('#login')).toContainText('Username');
  8  |   await page.getByRole('textbox', { name: 'Username' }).click();
  9  |   await page.getByRole('textbox', { name: 'Username' }).fill('tomsmith');
  10 |   await expect(page.locator('#login')).toContainText('Password');
  11 |   await page.getByRole('textbox', { name: 'Password' }).click();
  12 |   await page.getByRole('textbox', { name: 'Password' }).fill('SuperSecretPassword!');
  13 |   await page.getByRole('button', { name: ' Login' }).click();
> 14 |   await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
     |                                        ^ Error: expect(locator).toContainText(expected) failed
  15 |   await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  16 |   await page.getByRole('link', { name: 'Logout' }).click();
  17 | });
```