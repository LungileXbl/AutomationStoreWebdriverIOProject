import { browser } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import { allureStep } from '../support/allure-step.ts';
import { DEFAULT_TIMEOUT_MS } from '../support/constants.ts';

export default class BasePage {
    async open(path: string = '/') {
        await allureStep(`Open URL: ${path}`, async () => {
            await browser.url(path);
        });
    }

    async click(element: ChainablePromiseElement) {
        const label = await this.describe(element);
        await allureStep(`Click element: ${label}`, async () => {
            await element.waitForExist({ timeout: DEFAULT_TIMEOUT_MS });
            await element.click();
        });
    }

    async fill(element: ChainablePromiseElement, value: string) {
        const label = await this.describe(element);
        await allureStep(`Fill input: ${label}`, async () => {
            await element.waitForExist({ timeout: DEFAULT_TIMEOUT_MS });
            await element.clearValue();
            await element.setValue(value);
        });
    }

    async getText(element: ChainablePromiseElement) {
        const label = await this.describe(element);
        return allureStep(`Get text from element: ${label}`, async () => {
            await element.waitForExist({ timeout: DEFAULT_TIMEOUT_MS });
            return element.getText();
        });
    }

    async isVisible(element: ChainablePromiseElement) {
        const label = await this.describe(element);
        return allureStep(`Check element visible: ${label}`, async () => {
            try {
                await element.waitForExist({ timeout: DEFAULT_TIMEOUT_MS });
                return await element.isDisplayed();
            } catch (error) {
                console.warn(`Visibility check failed for ${label}: ${(error as Error).message}`);
                return false;
            }
        });
    }

    async waitForUrlToContain(substring: string, timeout: number = DEFAULT_TIMEOUT_MS) {
        await allureStep(`Wait for URL to contain "${substring}"`, async () => {
            await browser.waitUntil(async () => (await browser.getUrl()).includes(substring), {
                timeout,
                timeoutMsg: `Expected URL to contain "${substring}" after ${timeout}ms`
            });
        });
    }

    async getCurrentUrl() {
        return allureStep('Get current URL', () => browser.getUrl());
    }

    async getPageTitle() {
        return allureStep('Get page title', () => browser.getTitle());
    }

    async scrollTo(element: ChainablePromiseElement) {
        const label = await this.describe(element);
        await allureStep(`Scroll to element: ${label}`, async () => {
            await element.waitForExist({ timeout: DEFAULT_TIMEOUT_MS });
            await element.scrollIntoView();
        });
    }

    private async describe(element: ChainablePromiseElement): Promise<string> {
        return String(element.selector);
    }
}
