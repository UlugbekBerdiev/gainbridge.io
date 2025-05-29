import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Website Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // 🔹 Navigation Bar Tests
  test.describe('Navigation Bar', () => {
    test('TC01: Verify all top navigation links are present and clickable', async ({ page }) => {
      const navItems = ['Home', 'Products', 'Cart', 'Profile'];
      for (const item of navItems) {
        const navLink = page.locator(`nav.nav a:has-text("${item}")`);
        await expect(navLink).toBeVisible();
        await expect(navLink).toBeEnabled();
      }
    });

    test('TC02: Validate redirection to correct pages', async ({ page }) => {
      const navItems = ['Home', 'Products', 'Cart', 'Profile'];
      for (const item of navItems) {
        await page.click(`nav.nav a:has-text("${item}")`);
        await page.waitForLoadState('networkidle');
        await expect(page.locator(`nav.nav a:has-text("${item}")`)).toBeVisible();
      }
    });
  });

  // 🔹 Cart Item Display Tests
  test.describe('Cart Item Display', () => {
    test('TC03: Verify all items added to cart are listed', async ({ page }) => {
      const cartItems = page.locator('.cart-item');
      await expect(cartItems).toHaveCount(3); // Based on HTML, there are 3 items
    });

    test('TC04: Verify product details display', async ({ page }) => {
      const cartItem = page.locator('.cart-item').first();
      await expect(cartItem.locator('.product-name')).toBeVisible();
      await expect(cartItem.locator('.price')).toBeVisible();
      await expect(cartItem.locator('input.quantity')).toBeVisible();
    });

    test('TC05: Ensure Remove button is displayed', async ({ page }) => {
      const removeButtons = page.locator('button.remove-item');
      await expect(removeButtons).toHaveCount(3);
    });
  });

  // 🔹 Quantity Functionality Tests
  test.describe('Quantity Functionality', () => {
    test('TC06: Verify default quantity is 1', async ({ page }) => {
      const quantityInput = page.locator('input.quantity').first();
      await expect(quantityInput).toHaveValue('1');
    });

    test('TC07: Validate quantity increase/decrease', async ({ page }) => {
      const quantityInput = page.locator('input.quantity').first();
      await quantityInput.fill('2');
      await expect(quantityInput).toHaveValue('2');
    });

    test('TC08: Ensure price recalculation', async ({ page }) => {
      const quantityInput = page.locator('input.quantity').first();
      const initialTotal = await page.locator('#totalAmount').textContent();
      await quantityInput.fill('2');
      await page.waitForTimeout(1000);
      const newTotal = await page.locator('#totalAmount').textContent();
      expect(newTotal).not.toBe(initialTotal);
    });
  });

  // 🔹 Promotions & Timers Tests
  test.describe('Promotions & Timers', () => {
    test('TC09: Verify discount badge appearance', async ({ page }) => {
      const discountBadge = page.locator('.discount-badge');
      await expect(discountBadge).toBeVisible();
      await expect(discountBadge).toHaveText('15% off');
    });

    test('TC10: Validate countdown timer', async ({ page }) => {
      const timer = page.locator('#timer');
      await expect(timer).toBeVisible();
      const initialTime = await timer.textContent();
      await page.waitForTimeout(2000);
      const newTime = await timer.textContent();
      expect(newTime).not.toBe(initialTime);
    });
  });

  // 🔹 Remove Button Tests
  test.describe('Remove Button', () => {
    test('TC11: Verify item removal', async ({ page }) => {
      const initialItemCount = await page.locator('.cart-item').count();
      const removeButton = page.locator('button.remove-item').first();
      await removeButton.click();
      await page.click('button.confirm-remove');
      const newItemCount = await page.locator('.cart-item').count();
      expect(newItemCount).toBe(initialItemCount - 1);
    });

    test('TC12: Check total update after removal', async ({ page }) => {
      const initialTotal = await page.locator('#totalAmount').textContent();
      const removeButton = page.locator('button.remove-item').first();
      await removeButton.click();
      await page.click('button.confirm-remove');
      const newTotal = await page.locator('#totalAmount').textContent();
      expect(newTotal).not.toBe(initialTotal);
    });
  });

  // 🔹 Unavailable Items Tests
  test.describe('Unavailable Items', () => {
    test('TC13: Verify unavailable items cannot be checked out', async ({ page }) => {
      const outOfStockItem = page.locator('.cart-item.out-of-stock');
      await expect(outOfStockItem).toBeVisible();
      await expect(outOfStockItem.locator('input.quantity')).toBeDisabled();
    });

    test('TC14: Ensure different styling for unavailable items', async ({ page }) => {
      const outOfStockItem = page.locator('.cart-item.out-of-stock');
      await expect(outOfStockItem).toHaveClass(/out-of-stock/);
    });
  });

  // 🔹 Total Price Tests
  test.describe('Total Price', () => {
    test('TC15: Verify total price accuracy', async ({ page }) => {
      const totalPrice = page.locator('#totalAmount');
      await expect(totalPrice).toBeVisible();
      await expect(totalPrice).toHaveText('105.99');
    });

    test('TC16: Validate dynamic total updates', async ({ page }) => {
      const initialTotal = await page.locator('#totalAmount').textContent();
      const quantityInput = page.locator('input.quantity').first();
      await quantityInput.fill('2');
      await page.waitForTimeout(1000);
      const newTotal = await page.locator('#totalAmount').textContent();
      expect(newTotal).not.toBe(initialTotal);
    });
  });

  // 🔹 Checkout Button Tests
  test.describe('Checkout Button', () => {
    test('TC17: Ensure checkout button visibility', async ({ page }) => {
      const checkoutButton = page.locator('#checkoutBtn');
      await expect(checkoutButton).toBeVisible();
      await expect(checkoutButton).toHaveText('Checkout');
    });

    test('TC18: Verify checkout button state', async ({ page }) => {
      const checkoutButton = page.locator('#checkoutBtn');
      await expect(checkoutButton).toBeDisabled();
      await expect(checkoutButton).toHaveAttribute('title', 'Please remove out-of-stock items to proceed');
    });

    test('TC19: Validate checkout blocking for invalid cart', async ({ page }) => {
      const checkoutButton = page.locator('#checkoutBtn');
      await expect(checkoutButton).toBeDisabled();
    });
  });

  // 🎨 UI/UX Tests
  test.describe('UI/UX', () => {
    test('TC20: Verify cart item alignment', async ({ page }) => {
      const cartItems = page.locator('.cart-item');
      await expect(cartItems).toBeVisible();
    });

    test('TC21: Check responsive behavior', async ({ page }) => {
      // Test different viewport sizes
      await page.setViewportSize({ width: 375, height: 667 }); // Mobile
      await expect(page.locator('.cart-container')).toBeVisible();
      await page.setViewportSize({ width: 1024, height: 768 }); // Tablet
      await expect(page.locator('.cart-container')).toBeVisible();
      await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
      await expect(page.locator('.cart-container')).toBeVisible();
    });

    test('TC22: Validate availability warning', async ({ page }) => {
      const warningIcon = page.locator('.icon-warning');
      await expect(warningIcon).toBeVisible();
      await expect(warningIcon).toHaveAttribute('title', 'Limited availability');
    });

    test('TC23: Verify special badges', async ({ page }) => {
      const availabilityWarning = page.locator('.availability-warning');
      await expect(availabilityWarning).toBeVisible();
    });
  });

  // 🔐 Negative Tests
  test.describe('Negative Tests', () => {
    test('TC24: Validate quantity input restrictions', async ({ page }) => {
      const quantityInput = page.locator('input.quantity').first();
      await quantityInput.fill('-1');
      await expect(quantityInput).toHaveValue('1'); // Should revert to 1
    });

    test('TC25: Verify out-of-stock item behavior', async ({ page }) => {
      const outOfStockInput = page.locator('.cart-item.out-of-stock input.quantity');
      await expect(outOfStockInput).toBeDisabled();
    });

    test('TC26: Test cart state persistence', async ({ page }) => {
      const initialCartState = await page.locator('.cart-item').count();
      await page.reload();
      await page.waitForLoadState('networkidle');
      const newCartState = await page.locator('.cart-item').count();
      expect(newCartState).toBe(initialCartState);
    });
  });

  // 📱 Accessibility Tests
  test.describe('Accessibility', () => {
    test('TC27: Validate warning icon title', async ({ page }) => {
      const warningIcon = page.locator('.icon-warning');
      await expect(warningIcon).toHaveAttribute('title', 'Limited availability');
    });

    test('TC28: Check color contrast', async ({ page }) => {
      const textElements = page.locator('.cart-item');
      for (const element of await textElements.all()) {
        const color = await element.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.color;
        });
        const background = await element.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.backgroundColor;
        });
        expect(color).not.toBe(background);
      }
    });

    test('TC29: Validate keyboard navigation', async ({ page }) => {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBe('A');
    });

    test('TC30: Check modal accessibility', async ({ page }) => {
      const removeButton = page.locator('button.remove-item').first();
      await removeButton.click();
      const modal = page.locator('#remove-confirm-modal');
      await expect(modal).toBeVisible();
      await expect(modal.locator('button.confirm-remove')).toBeVisible();
      await expect(modal.locator('button.cancel-remove')).toBeVisible();
    });
  });
}); 