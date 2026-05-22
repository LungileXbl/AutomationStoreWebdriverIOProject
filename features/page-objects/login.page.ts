import BasePage from './base.page.ts';
import { $ } from '@wdio/globals';

const LOGIN_URL = 'index.php?rt=account/login';

export class LoginPage extends BasePage {
    private get loginNameInput() {
        return $('#loginFrm_loginname');
    }

    private get passwordInput() {
        return $('#loginFrm_password');
    }

    private get loginButton() {
        return $('button[title="Login"]');
    }

    private get loginError() {
        return $('role=alert');
    }

    async open() {
        await super.open(LOGIN_URL);
    }

    async login(username: string, password: string) {
        await this.fill(this.loginNameInput, username);
        await this.fill(this.passwordInput, password);
        await this.click(this.loginButton);
    }

    async isLoginErrorVisible(): Promise<boolean> {
        return this.isVisible(this.loginError);
    }

    async isLoginSuccessful(): Promise<boolean> {
        const url = await this.getCurrentUrl();
        return url.includes('rt=account/account');
    }
}

export const loginPage = new LoginPage();
