import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from 'expect-webdriverio';
import { homePage } from '../page-objects/home.page.ts';
import { loginPage } from '../page-objects/login.page.ts';
import { expectStep } from '../support/allure-step.ts';
import { getEnv } from '../support/env.ts';
import users from '../fixtures/users.json' with { type: 'json' };

// ======================
// GIVEN (Setup)
// ======================

Given('I am on the home page', async () => {
    await homePage.open();
});

// ======================
// WHEN (Actions)
// ======================

When('I click on the Login or Register link', async () => {
    await homePage.clickLoginOrRegister();
});

When('I enter valid credentials and click login', async () => {
    const username = getEnv('TEST_USER_USERNAME');
    const password = getEnv('TEST_USER_PASSWORD');
    await loginPage.login(username, password);
});

When('I attempt to log in with invalid credentials', async () => {
    const invalidUsername = users.invalidLoginName;
    const invalidPassword = users.invalidPassword;
    await loginPage.login(invalidUsername, invalidPassword);
});

// ======================
// THEN (Assertions)
// ======================

Then('I should be navigated to the login page', async () => {
    const isLoginPage = await homePage.isOnLoginPage();
    expectStep(`Expect navigation to login page (got: ${isLoginPage})`, () =>
        expect(isLoginPage).toBe(true)
    );
});

Then('I should be logged in successfully', async () => {
    const isLoggedIn = await loginPage.isLoginSuccessful();
    expectStep(`Expect login to be successful (got: ${isLoggedIn})`, () =>
        expect(isLoggedIn).toBe(true)
    );
});

Then('I should see a login error message', async () => {
    const isErrorVisible = await loginPage.isLoginErrorVisible();
    expectStep(`Expect login error to be visible (got: ${isErrorVisible})`, () =>
        expect(isErrorVisible).toBe(true)
    );
});
