import { test, expect } from '@playwright/test'
import { USERS } from '../data/users'
import { URLS } from '../data/urls'
import { CartPage } from '../pages/cart.page'
import { CheckoutCompletePage } from '../pages/checkoutComplete.page'
import { CheckoutStepOnePage } from '../pages/checkoutStepOne.page'
import { CheckoutStepTwoPage } from '../pages/checkoutStepTwo.page'
import { InventoryPage } from '../pages/inventory.page'
import { LoginPage } from '../pages/login.page'

test('Sanity test - full purchase flow', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const inventoryPage = new InventoryPage(page)
  const cartPage = new CartPage(page)
  const stepOne = new CheckoutStepOnePage(page)
  const stepTwo = new CheckoutStepTwoPage(page)
  const completePage = new CheckoutCompletePage(page)

  // Login
  await loginPage.navigate()
  await loginPage.login(USERS.standard.username, USERS.standard.password);
  await inventoryPage.assertPageLoaded()
  await expect(page).toHaveURL(URLS.inventory)

  // Add products
  await inventoryPage.addTwoProducts()
  await inventoryPage.assertCartBadge(2)

  // Cart
  await inventoryPage.goToCart()
  await cartPage.assertPageLoaded()
  await cartPage.assertCartItemsCount(2)
  await expect(page).toHaveURL(URLS.cart)

  // Checkout step one
  await cartPage.checkout()
  await stepOne.assertPageLoaded()
  await expect(page).toHaveURL(URLS.checkoutStepOne)
  await stepOne.fillForm()

  // Checkout step two
  await stepTwo.assertPageLoaded()
  await expect(page).toHaveURL(URLS.checkoutStepTwo)
  await stepTwo.finish()

  // Complete
  await completePage.assertPageLoaded()
  await expect(page).toHaveURL(URLS.checkoutComplete)
  await completePage.assertThankYouVisible()
})
