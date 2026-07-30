import { test, expect, Page } from "@playwright/test";

test.describe("this is the first group", async () => {
  test("test1", async ({ page }) => {
    console.log("this is test 1 ......");
  });

  test.fixme("test needs fix", async ({ page }) => {
    console.log("this is test need fix ......");
  });

  test("test2", async ({ page, browserName }) => {
    test.skip(browserName === "chromium", "this is test skipped");
    console.log("this is test 2 ......");
  });
});

test.describe("sanity", () => {
  // skip the test based on condition
  test.skip("test3", async ({ page }) => {
    console.log("this is test 3 ......");
  });

  test("test4", { tag: "@sanity" }, async ({ page }) => {
    console.log("this is test 4 ......");
  });

  test("test slow", { tag: ["@sanity", "@smoke"] }, async ({ page }) => {
    // will take 3 times of the original wait time
    test.slow();
    console.log("this is slow test  ......");
  });

  test.fail("test fail", async ({ page }) => {
    console.log("this is test failed ......");
  });
});
