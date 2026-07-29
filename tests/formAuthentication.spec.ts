import { expect, test } from "@playwright/test";
import { FormAuthenticationPage } from "./pages/formAuthenticationPage/formAuthenticationPage";

test("user can log in through Form Authentication", async ({ page }) => {
  const formAuthenticationPage = new FormAuthenticationPage(page);

  await formAuthenticationPage.navigateToHomePage();
  await formAuthenticationPage.openFormAuthentication();
  await formAuthenticationPage.login("tomsmith", "SuperSecretPassword!");

  await expect(formAuthenticationPage.flashMessage).toContainText(
    "You logged into a secure area!",
  );

  await formAuthenticationPage.waitForTenSeconds();
});
