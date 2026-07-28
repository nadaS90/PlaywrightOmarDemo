# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: actions.spec.ts >> iframe
- Location: tests\actions.spec.ts:94:5

# Error details

```
Error: page.goto: net::ERR_NETWORK_ACCESS_DENIED at https://the-internet.herokuapp.com/iframe
Call log:
  - navigating to "https://the-internet.herokuapp.com/iframe", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect ,  Page} from "@playwright/test";
  2   | 
  3   | test("textbox", async ({ page }) => {
  4   |   await page.goto("https://the-internet.herokuapp.com/login");
  5   |   await page.locator("#username").fill("tomsmith");
  6   |   await page
  7   |     .locator("#password")
  8   |     .pressSequentially("SuperSecretPassword!", { delay: 200 });
  9   |   await page.locator("#password").press("Enter");
  10  | });
  11  | 
  12  | test("mouse Clicks", async ({ page }) => {
  13  |   await page.goto("https://play1.automationcamp.ir/mouse_events.html");
  14  |   await page.locator("#click_area").click();
  15  |   await expect(page.locator("#click_x")).toContainText("Left");
  16  | 
  17  |   await page.locator("#click_area").dblclick();
  18  |   await expect(page.locator("#click_type")).toContainText("Double-Click");
  19  | 
  20  |   await page.locator("#click_area").click({button:'right'});
  21  |   await expect(page.locator("#click_type")).toContainText("Right-Click");
  22  | });
  23  | 
  24  | test("radio button", async ({ page }) => {
  25  |   await page.goto("http://test.rubywatir.com/radios.php");
  26  |   await page.locator(".radioclass").check();
  27  |   await expect(page.locator(".radioclass")).toBeChecked();
  28  | 
  29  |     await expect(page.locator("#radioId")).not.toBeChecked();
  30  | 
  31  | });
  32  | 
  33  | test("check box ", async ({ page }) => {
  34  |   await page.goto("https://the-internet.herokuapp.com/checkboxes");
  35  |   await page.locator("input[type=checkbox]").nth(1).uncheck();
  36  |   await expect(page.locator("input[type=checkbox]").nth(1)).not.toBeChecked();
  37  |   await page.locator("input[type=checkbox]").nth(0).check();
  38  |   await expect(page.locator("input[type=checkbox]").nth(0).isChecked()).toBeTruthy();
  39  | 
  40  | });
  41  | 
  42  | test("dropdown", async ({ page }) => {
  43  |   await page.goto("https://the-internet.herokuapp.com/dropdown");
  44  |   await page.selectOption("#dropdown", { value: "1" });
  45  |   await page.selectOption("#dropdown", { value: "2" });
  46  |   await page.selectOption("#dropdown", { label: "Option 1" });
  47  |   console.log(await page.locator("option[selected='selected']").textContent());
  48  | 
  49  | });
  50  | 
  51  | test("click Alert", async ({ page }) => {
  52  |       await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
  53  | 
  54  |   page.on("dialog", async (dialog) => {
  55  |     expect(dialog.message()).toBe("I am a JS Alert");
  56  | 
  57  |     await dialog.accept();
  58  |   });
  59  | 
  60  |   await page.locator("button[onclick='jsAlert()']").click();
  61  |     console.log(await page.locator("#result").textContent());
  62  | 
  63  | });
  64  | 
  65  | test("dismiss Alert", async ({ page }) => {
  66  |   await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
  67  | 
  68  |   page.on("dialog", async (dialog) => {
  69  |     expect(dialog.message()).toBe("I am a JS Confirm");
  70  | 
  71  |     await dialog.dismiss();
  72  |   });
  73  | 
  74  |   await page.locator("button[onclick='jsConfirm()']").click();
  75  |     console.log(await page.locator("#result").textContent());
  76  | 
  77  | });
  78  | 
  79  | test("prompt", async ({ page }) => {
  80  |   await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
  81  | 
  82  |   page.on("dialog", async (dialog) => {
  83  |     expect(dialog.message()).toBe("I am a JS prompt");
  84  | 
  85  |     await dialog.accept("Done");
  86  |   });
  87  | 
  88  |   await page.locator("button[onclick='jsPrompt()']").click();
  89  |   console.log(await page.locator("#result").textContent());
  90  |   await expect(page.locator("#result")).toHaveText("You entered: Done");
  91  | });
  92  | 
  93  | 
  94  | test("iframe", async ({ page }) => {
> 95  |   await page.goto("https://the-internet.herokuapp.com/iframe");
      |              ^ Error: page.goto: net::ERR_NETWORK_ACCESS_DENIED at https://the-internet.herokuapp.com/iframe
  96  | 
  97  |   const frame = page.frameLocator("#mce_0_ifr");
  98  |   const editor = frame.locator("#tinymce");
  99  | 
  100 |   // The demo currently exposes TinyMCE in read-only mode, so verify its
  101 |   // contents through the iframe instead of attempting to edit it.
  102 |   await expect(editor).toBeVisible();
  103 |   await expect(editor).toContainText("Your content goes here.");
  104 | });
  105 | 
  106 | 
  107 | test(" nested frame", async ({ page }) => {
  108 |   await page.goto("https://the-internet.herokuapp.com/nested_frames");
  109 | 
  110 |   const topFrame = page.frameLocator("frame[name='frame-top']");
  111 |    const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
  112 |    const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');
  113 |    const rightFrame = topFrame.frameLocator('frame[name="frame-right"]');
  114 |   const bottomFrame = page.frameLocator('frame[name="frame-bottom"]');
  115 | 
  116 |   await expect(leftFrame.locator("body")).toHaveText("LEFT");
  117 |  await expect(middleFrame.locator("body")).toHaveText("MIDDLE");
  118 |   await expect(rightFrame.locator("body")).toHaveText("RIGHT");
  119 |   await expect(bottomFrame.locator("body")).toHaveText("BOTTOM ");
  120 | 
  121 | });
  122 | 
  123 | test("Open new tab", async ({ page }) => {
  124 |   await page.goto("https://the-internet.herokuapp.com/windows");
  125 | 
  126 |  const newPagePromise = page.context().waitForEvent('page');
  127 |  await page.locator("text=Click Here").click();
  128 | 
  129 |  const newPage = await newPagePromise ;
  130 | await newPage.waitForLoadState();
  131 |   await expect(newPage.locator("h3")).toHaveText("New Window");
  132 | newPage.close();
  133 |   await expect(page.locator("h3")).toHaveText("Opening a new window");
  134 | 
  135 | });
  136 | 
  137 | test("Open new window", async ({ page }) => {
  138 |   await page.goto("https://demo.automationtesting.in/Windows.html");
  139 |    const newPagePromise = page.context().waitForEvent("page");
  140 | 
  141 |   await page.getByRole("link", { name: "Open New Seperate Windows" }).click();
  142 |   await expect(page.getByRole("paragraph")).toContainText("click the button to open a new window with some specifications");
  143 |   await page.getByRole("button", { name: "click" }).click();
  144 |   const newPage = await newPagePromise;
  145 | 
  146 |   await expect(newPage).toHaveTitle(/Selenium/); 
  147 |   await expect(newPage).toHaveURL("https://www.selenium.dev/");
  148 |   console.log(`Working on window #${getWindowNumber(newPage)}`);
  149 | 
  150 |   await page.title();
  151 | console.log(`Working on window #${getWindowNumber(page)}`);
  152 | 
  153 | });
  154 | 
  155 | function getWindowNumber(currentPage: Page): number {
  156 |   return currentPage.context().pages().indexOf(currentPage) + 1;
  157 | }
  158 | 
  159 | 
  160 | test("Drag and drop", async ({ page }) => {
  161 |   await page.goto("https://the-internet.herokuapp.com/drag_and_drop");
  162 | 
  163 |   await page.locator("#column-a").dragTo(page.locator("#column-b"));
  164 |   console.log(await page.locator("#column-a").textContent());
  165 | });
  166 | 
```