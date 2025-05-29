import { test, expect } from '@playwright/test';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';

test.describe('Shopping Cart Tests', () => {
    let shoppingCartPage: ShoppingCartPage;

    test.beforeEach(async ({ page }) => {
        shoppingCartPage = new ShoppingCartPage(page);
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    // Navigation Tests
    test.describe('Navigation', () => {
        test('should have all navigation links visible and enabled', async () => {
            const navLinks = ['home', 'products', 'cart', 'profile'] as const;
            for (const link of navLinks) {
                expect(await shoppingCartPage.isNavigationLinkVisible(link)).toBe(true);
                expect(await shoppingCartPage.isNavigationLinkEnabled(link)).toBe(true);
            }
        });

        test('should navigate to different pages', async () => {
            await shoppingCartPage.navigateToProducts();
            expect(await shoppingCartPage.isNavigationLinkVisible('products')).toBe(true);
            
            await shoppingCartPage.navigateToCart();
            expect(await shoppingCartPage.isNavigationLinkVisible('cart')).toBe(true);
            
            await shoppingCartPage.navigateToProfile();
            expect(await shoppingCartPage.isNavigationLinkVisible('profile')).toBe(true);
            
            await shoppingCartPage.navigateToHome();
            expect(await shoppingCartPage.isNavigationLinkVisible('home')).toBe(true);
        });
    });

    // Page Title and Layout
    test.describe('Page Layout', () => {
        test('should display correct page title', async () => {
            const title = await shoppingCartPage.getPageTitle();
            expect(title).toBe('Your Shopping Cart');
        });

        test('should show cart container', async () => {
            expect(await shoppingCartPage.isCartContainerVisible()).toBe(true);
        });

        test('should display footer with copyright', async () => {
            expect(await shoppingCartPage.isFooterVisible()).toBe(true);
            const copyright = await shoppingCartPage.getCopyrightText();
            expect(copyright).toBe('© 2025 MyShop. All rights reserved.');
        });
    });

    // Cart Items
    test.describe('Cart Items', () => {
        test('should display correct number of items', async () => {
            expect(await shoppingCartPage.getCartItemsCount()).toBe(3);
        });

        test('should display first item details correctly', async () => {
            const itemDetails = await shoppingCartPage.getCartItemDetails(0);
            expect(itemDetails.name).toContain("Kid's T-shirt");
            expect(itemDetails.price).toBe('$19.99');
            expect(itemDetails.quantity).toBe('1');
            expect(itemDetails.hasWarning).toBe(true);
        });

        test('should display second item with discount', async () => {
            const itemDetails = await shoppingCartPage.getCartItemDetails(1);
            expect(itemDetails.name).toBe('Bluetooth Headphones');
            expect(itemDetails.price).toBe('$85.00');
            expect(itemDetails.hasDiscount).toBe(true);
        });

        test('should display third item as out of stock', async () => {
            const itemDetails = await shoppingCartPage.getCartItemDetails(2);
            expect(itemDetails.name).toBe('Travel Mug');
            expect(itemDetails.price).toBe('$14.50');
            expect(itemDetails.isOutOfStock).toBe(true);
        });
    });

    // Checkout Button
    test.describe('Checkout Button', () => {
        test('should show checkout button', async () => {
            expect(await shoppingCartPage.isCheckoutButtonVisible()).toBe(true);
        });

        test('should disable checkout with out of stock items', async () => {
            expect(await shoppingCartPage.isCheckoutButtonDisabled()).toBe(true);
            const title = await shoppingCartPage.getCheckoutButtonTitle();
            expect(title).toBe('Please remove out-of-stock items to proceed');
        });
    });

    // Cart Total
    test.describe('Cart Total', () => {
        test('should display correct total amount', async () => {
            const displayedTotal = await shoppingCartPage.getTotalAmount();
            const calculatedTotal = await shoppingCartPage.calculateTotalAmount();
            
            // Convert displayed total to number for comparison
            const displayedTotalNumber = parseFloat(displayedTotal?.replace('$', '') || '0');
            
            expect(displayedTotalNumber).toBe(calculatedTotal);
        });

        test('should show total label', async () => {
            const totalText = await shoppingCartPage.getCartTotalText();
            expect(totalText).toContain('Total:');
        });
    });

    // Responsive Design
    test.describe('Responsive Design', () => {
        test('should adapt to mobile viewport', async () => {
            const mobileLayout = await shoppingCartPage.checkResponsiveLayout({ width: 375, height: 667 });
            expect(mobileLayout.cartContainerVisible).toBe(true);
            expect(mobileLayout.cartItemsVisible).toBe(true);
            expect(mobileLayout.checkoutButtonVisible).toBe(true);
        });

        test('should adapt to tablet viewport', async () => {
            const tabletLayout = await shoppingCartPage.checkResponsiveLayout({ width: 768, height: 1024 });
            expect(tabletLayout.cartContainerVisible).toBe(true);
            expect(tabletLayout.cartItemsVisible).toBe(true);
            expect(tabletLayout.checkoutButtonVisible).toBe(true);
        });

        test('should adapt to desktop viewport', async () => {
            const desktopLayout = await shoppingCartPage.checkResponsiveLayout({ width: 1920, height: 1080 });
            expect(desktopLayout.cartContainerVisible).toBe(true);
            expect(desktopLayout.cartItemsVisible).toBe(true);
            expect(desktopLayout.checkoutButtonVisible).toBe(true);
        });
    });
}); 