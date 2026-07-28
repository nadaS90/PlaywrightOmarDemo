# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: actions.spec.ts >>  nested frame
- Location: tests\actions.spec.ts:106:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('frame[name=\'frame-top\']').contentFrame().locator('frame[name="frame-left"]').contentFrame().locator('body')
- Expected  - 1
+ Received  + 4

- LEFT
+
+     
+   
+

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('frame[name=\'frame-top\']').contentFrame().locator('frame[name="frame-left"]').contentFrame().locator('body')
  - Protocol error (Runtime.callFunctionOn): Internal server error, session closed.

```

```yaml
- iframe
```

# Test source

```ts
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
  45  |   await page.pause();
  46  |   await page.selectOption("#dropdown", { value: "2" });
  47  |   await page.pause();
  48  |   await page.selectOption("#dropdown", { label: "Option 1" });
  49  |   console.log(await page.locator("option[selected='selected']").textContent());
  50  | 
  51  | });
  52  | 
  53  | test("click Alert", async ({ page }) => {
  54  |       await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
  55  | 
  56  |   page.on("dialog", async (dialog) => {
  57  |     expect(dialog.message()).toBe("I am a JS Alert");
  58  | 
  59  |     await dialog.accept();
  60  |   });
  61  | 
  62  |   await page.locator("button[onclick='jsAlert()']").click();
  63  |     console.log(await page.locator("#result").textContent());
  64  | 
  65  | });
  66  | 
  67  | test("dismiss Alert", async ({ page }) => {
  68  |   await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
  69  | 
  70  |   page.on("dialog", async (dialog) => {
  71  |     expect(dialog.message()).toBe("I am a JS Confirm");
  72  | 
  73  |     await dialog.dismiss();
  74  |   });
  75  | 
  76  |   await page.locator("button[onclick='jsConfirm()']").click();
  77  |     console.log(await page.locator("#result").textContent());
  78  | 
  79  | });
  80  | 
  81  | test("prompt", async ({ page }) => {
  82  |   await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
  83  | 
  84  |   page.on("dialog", async (dialog) => {
  85  |     expect(dialog.message()).toBe("I am a JS prompt");
  86  | 
  87  |     await dialog.accept("Done");
  88  |   });
  89  | 
  90  |   await page.locator("button[onclick='jsPrompt()']").click();
  91  |   console.log(await page.locator("#result").textContent());
  92  |   await expect(page.locator("#result")).toHaveText("You entered: Done");
  93  | });
  94  | 
  95  | 
  96  | test("iframe", async ({ page }) => {
  97  |   await page.goto("https://the-internet.herokuapp.com/iframe");
  98  | 
  99  | const frame = page.frameLocator("#mce_0_ifr");
  100 | 
  101 |   await frame.locator("#tinymce").fill("Nada");
  102 |   await expect(page.locator("#tinymce")).toHaveText("Nada");
  103 | });
  104 | 
  105 | 
  106 | test(" nested frame", async ({ page }) => {
  107 |   await page.goto("https://the-internet.herokuapp.com/nested_frames");
  108 | 
  109 |   const topFrame = page.frameLocator("frame[name='frame-top']");
  110 |    const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
  111 |    const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');
  112 |    const rightFrame = topFrame.frameLocator('frame[name="frame-right"]');
  113 |   const bottomFrame = page.frameLocator('frame[name="frame-bottom"]');
  114 | 
> 115 |   await expect(leftFrame.locator("body")).toHaveText("LEFT");
      |                                           ^ Error: expect(locator).toHaveText(expected) failed
  116 |  await expect(middleFrame.locator("body")).toHaveText("MIDDLE");
  117 |   await expect(rightFrame.locator("body")).toHaveText("RIGHT");
  118 |   await expect(bottomFrame.locator("body")).toHaveText("BOTTOM ");
  119 | 
  120 | });
  121 | 
  122 | test("Open new tab", async ({ page }) => {
  123 |   await page.goto("https://the-internet.herokuapp.com/windows");
  124 | 
  125 |  const newPagePromise = page.context().waitForEvent('page');
  126 |  await page.locator("text=Click Here").click();
  127 | 
  128 |  const newPage = await newPagePromise ;
  129 | await newPage.waitForLoadState();
  130 |   await expect(newPage.locator("h3")).toHaveText("New Window");
  131 | newPage.close();
  132 |   await expect(page.locator("h3")).toHaveText("Opening a new window");
  133 | 
  134 | });
  135 | 
  136 | test("Open new window", async ({ page }) => {
  137 |   await page.goto("https://demo.automationtesting.in/Windows.html");
  138 |    const newPagePromise = page.context().waitForEvent("page");
  139 | 
  140 |   await page.getByRole("link", { name: "Open New Seperate Windows" }).click();
  141 |   await page.pause();
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
```