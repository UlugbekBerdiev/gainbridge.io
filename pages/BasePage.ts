import { Page } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async getElementText(selector: string): Promise<string> {
        return await this.page.locator(selector).textContent() || '';
    }

    async isElementVisible(selector: string): Promise<boolean> {
        return await this.page.locator(selector).isVisible();
    }

    async clickElement(selector: string) {
        await this.page.locator(selector).click();
    }

    async fillInput(selector: string, value: string) {
        await this.page.locator(selector).fill(value);
    }
} 