import { test, expect ,  Page} from "@playwright/test";

test("textbox", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/login");
  await page.locator("#username").fill("tomsmith");
  await page
    .locator("#password")
    .pressSequentially("SuperSecretPassword!", { delay: 200 });
  await page.locator("#password").press("Enter");
});

test("mouse Clicks", async ({ page }) => {
  await page.goto("https://play1.automationcamp.ir/mouse_events.html");
  await page.locator("#click_area").click();
  await expect(page.locator("#click_x")).toContainText("Left");

  await page.locator("#click_area").dblclick();
  await expect(page.locator("#click_type")).toContainText("Double-Click");

  await page.locator("#click_area").click({button:'right'});
  await expect(page.locator("#click_type")).toContainText("Right-Click");
});

test("radio button", async ({ page }) => {
  await page.goto("http://test.rubywatir.com/radios.php");
  await page.locator(".radioclass").check();
  await expect(page.locator(".radioclass")).toBeChecked();

    await expect(page.locator("#radioId")).not.toBeChecked();

});

test("check box ", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/checkboxes");
  await page.locator("input[type=checkbox]").nth(1).uncheck();
  await expect(page.locator("input[type=checkbox]").nth(1)).not.toBeChecked();
  await page.locator("input[type=checkbox]").nth(0).check();
  await expect(page.locator("input[type=checkbox]").nth(0).isChecked()).toBeTruthy();

});

test("dropdown", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/dropdown");
  await page.selectOption("#dropdown", { value: "1" });
  await page.selectOption("#dropdown", { value: "2" });
  await page.selectOption("#dropdown", { label: "Option 1" });
  console.log(await page.locator("option[selected='selected']").textContent());

});

test("click Alert", async ({ page }) => {
      await page.goto("https://the-internet.herokuapp.com/javascript_alerts");

  page.on("dialog", async (dialog) => {
    expect(dialog.message()).toBe("I am a JS Alert");

    await dialog.accept();
  });

  await page.locator("button[onclick='jsAlert()']").click();
    console.log(await page.locator("#result").textContent());

});

test("dismiss Alert", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/javascript_alerts");

  page.on("dialog", async (dialog) => {
    expect(dialog.message()).toBe("I am a JS Confirm");

    await dialog.dismiss();
  });

  await page.locator("button[onclick='jsConfirm()']").click();
    console.log(await page.locator("#result").textContent());

});

test("prompt", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/javascript_alerts");

  page.on("dialog", async (dialog) => {
    expect(dialog.message()).toBe("I am a JS prompt");

    await dialog.accept("Done");
  });

  await page.locator("button[onclick='jsPrompt()']").click();
  console.log(await page.locator("#result").textContent());
  await expect(page.locator("#result")).toHaveText("You entered: Done");
});


test("iframe", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/iframe");

  const frame = page.frameLocator("#mce_0_ifr");
  const editor = frame.locator("#tinymce");

  // The demo currently exposes TinyMCE in read-only mode, so verify its
  // contents through the iframe instead of attempting to edit it.
  await expect(editor).toBeVisible();
  await expect(editor).toContainText("Your content goes here.");
});


test(" nested frame", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/nested_frames");

  const topFrame = page.frameLocator("frame[name='frame-top']");
   const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
   const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');
   const rightFrame = topFrame.frameLocator('frame[name="frame-right"]');
  const bottomFrame = page.frameLocator('frame[name="frame-bottom"]');

  await expect(leftFrame.locator("body")).toHaveText("LEFT");
 await expect(middleFrame.locator("body")).toHaveText("MIDDLE");
  await expect(rightFrame.locator("body")).toHaveText("RIGHT");
  await expect(bottomFrame.locator("body")).toHaveText("BOTTOM ");

});

test("Open new tab", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/windows");

 const newPagePromise = page.context().waitForEvent('page');
 await page.locator("text=Click Here").click();

 const newPage = await newPagePromise ;
await newPage.waitForLoadState();
  await expect(newPage.locator("h3")).toHaveText("New Window");
newPage.close();
  await expect(page.locator("h3")).toHaveText("Opening a new window");

});

test("Open new window", async ({ page }) => {
  await page.goto("https://demo.automationtesting.in/Windows.html");
   const newPagePromise = page.context().waitForEvent("page");

  await page.getByRole("link", { name: "Open New Seperate Windows" }).click();
  await expect(page.getByRole("paragraph")).toContainText("click the button to open a new window with some specifications");
  await page.getByRole("button", { name: "click" }).click();
  const newPage = await newPagePromise;

  await expect(newPage).toHaveTitle(/Selenium/); 
  await expect(newPage).toHaveURL("https://www.selenium.dev/");
  console.log(`Working on window #${getWindowNumber(newPage)}`);

  await page.title();
console.log(`Working on window #${getWindowNumber(page)}`);

});

function getWindowNumber(currentPage: Page): number {
  return currentPage.context().pages().indexOf(currentPage) + 1;
}


test("Drag and drop", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/drag_and_drop");

  await page.locator("#column-a").dragTo(page.locator("#column-b"));
  console.log(await page.locator("#column-a").textContent());
});
