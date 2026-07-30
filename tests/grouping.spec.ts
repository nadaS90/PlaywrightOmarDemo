import { test, expect, Page } from "@playwright/test";

test.describe("this is the first group", async () => {
  test("test1", async ({ page }) => {
    console.log("this is test 1 ......");
  });

  test("test2", async ({ page }) => {
    console.log("this is test 2 ......");
  });
});

test.describe("this is the second group", async () => {
  test("test3", async ({ page }) => {
    console.log("this is test 3 ......");
  });

  test("test4", async ({ page }) => {
    console.log("this is test 4 ......");
  });
});
