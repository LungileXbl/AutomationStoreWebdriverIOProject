import BasePage from './base.page.ts';
import { $ } from '@wdio/globals';

const HOME_URL = '/';

export class HomePage extends BasePage {
    private get loginOrRegisterLink() {
        return $('=Login or register');
    }

    async open() {
        await super.open(HOME_URL);
    }

    async clickLoginOrRegister() {
        await this.click(this.loginOrRegisterLink);
    }

    async isOnLoginPage(): Promise<boolean> {
        const url = await this.getCurrentUrl();
        return url.includes('rt=account/login');
    }
}

export const homePage = new HomePage();
