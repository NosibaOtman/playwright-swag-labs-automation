import { test, expect } from '@playwright/test'
import { NEGATIVE_LOGIN_USERS, POSITIVE_LOGIN_USERS, USERS } from '../data/users'
import { InventoryPage } from '../pages/inventory.page'
import { LoginPage } from '../pages/login.page'
import { URLS } from '../data/urls'



test.describe('Valid Login Tests', () => {
  for (const userKey of POSITIVE_LOGIN_USERS) {
    test(`Login with ${userKey} user`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const user = USERS[userKey];
      await loginPage.navigate();
      await loginPage.login(user.username, user.password);
      await inventoryPage.assertPageLoaded();
      await expect(page).toHaveURL(URLS.inventory);
    })
  }
})

test.describe('Invalid Login Tests', () => {
  for (const testData of NEGATIVE_LOGIN_USERS) {
    test(`Login with ${testData.description}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(testData.username, testData.password);
      await loginPage.assertErrorMessageVisible();
      await expect(page).toHaveURL(URLS.login);
    })
  }

  test('Login with locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    await loginPage.assertErrorMessage('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).toHaveURL(URLS.login);
  })
})
