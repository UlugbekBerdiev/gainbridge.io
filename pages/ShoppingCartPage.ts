import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShoppingCartPage extends BasePage {
    // Locators
    private readonly pageTitle = 'h1.logo';
    private readonly cartContainer = '#cartContainer';
    private readonly cartItems = '.cart-item';
    private readonly cartTotal = '#cartTotal';
    private readonly totalAmount = '#totalAmount';
    private readonly checkoutButton = '#checkoutBtn';
    private readonly footer = '.footer';
    private readonly copyright = '.footer p';
    private readonly navLinks = {
        home: 'nav.nav a:has-text("Home")',
        products: 'nav.nav a:has-text("Products")',
        cart: 'nav.nav a:has-text("Cart")',
        profile: 'nav.nav a:has-text("Profile")'
    };

    constructor(page: Page) {
        super(page);
    }

    // Navigation Methods
    async navigateToHome(): Promise<void> {
        await this.clickElement(this.navLinks.home);
        await this.waitForPageLoad();
    }

    async navigateToProducts(): Promise<void> {
        await this.clickElement(this.navLinks.products);
        await this.waitForPageLoad();
    }

    async navigateToCart(): Promise<void> {
        await this.clickElement(this.navLinks.cart);
        await this.waitForPageLoad();
    }

    async navigateToProfile(): Promise<void> {
        await this.clickElement(this.navLinks.profile);
        await this.waitForPageLoad();
    }

    async isNavigationLinkVisible(linkName: keyof typeof this.navLinks): Promise<boolean> {
        return await this.isElementVisible(this.navLinks[linkName]);
    }

    async isNavigationLinkEnabled(linkName: keyof typeof this.navLinks): Promise<boolean> {
        return await this.page.locator(this.navLinks[linkName]).isEnabled();
    }

    // Page Title
    async getPageTitle(): Promise<string | null> {
        return await this.getElementText(this.pageTitle);
    }

    // Cart Container
    async isCartContainerVisible(): Promise<boolean> {
        return await this.isElementVisible(this.cartContainer);
    }

    // Cart Items
    async getCartItemsCount(): Promise<number> {
        return await this.page.locator(this.cartItems).count();
    }

    // Cart Total
    async getCartTotalText(): Promise<string | null> {
        return await this.getElementText(this.cartTotal);
    }

    async getTotalAmount(): Promise<string | null> {
        return await this.getElementText(this.totalAmount);
    }

    // Checkout Button
    async isCheckoutButtonVisible(): Promise<boolean> {
        return await this.isElementVisible(this.checkoutButton);
    }

    async isCheckoutButtonDisabled(): Promise<boolean> {
        return await this.page.locator(this.checkoutButton).isDisabled();
    }

    async getCheckoutButtonTitle(): Promise<string | null> {
        return await this.page.locator(this.checkoutButton).getAttribute('title');
    }

    // Footer
    async isFooterVisible(): Promise<boolean> {
        return await this.isElementVisible(this.footer);
    }

    async getCopyrightText(): Promise<string | null> {
        return await this.getElementText(this.copyright);
    }

    // Cart Item Details
    async getCartItemDetails(index: number = 0) {
        const item = this.page.locator(this.cartItems).nth(index);
        return {
            name: await item.locator('.product-name').textContent(),
            price: await item.locator('.price').textContent(),
            quantity: await item.locator('input.quantity').inputValue(),
            isOutOfStock: await item.locator('.out-of-stock').isVisible(),
            hasDiscount: await item.locator('.discount-badge').isVisible(),
            hasWarning: await item.locator('.availability-warning').isVisible()
        };
    }

    // Calculate total amount from cart items
    async calculateTotalAmount(): Promise<number> {
        const itemsCount = await this.getCartItemsCount();
        let total = 0;

        for (let i = 0; i < itemsCount; i++) {
            const item = await this.getCartItemDetails(i);
            if (!item.isOutOfStock) {
                const price = parseFloat(item.price?.replace('$', '') || '0');
                const quantity = parseInt(item.quantity || '0');
                total += price * quantity;
            }
        }

        return Number(total.toFixed(2));
    }

    // Responsive Design
    async checkResponsiveLayout(viewport: { width: number; height: number }) {
        await this.page.setViewportSize(viewport);
        return {
            cartContainerVisible: await this.isCartContainerVisible(),
            cartItemsVisible: await this.page.locator(this.cartItems).first().isVisible(),
            checkoutButtonVisible: await this.isCheckoutButtonVisible()
        };
    }
} 