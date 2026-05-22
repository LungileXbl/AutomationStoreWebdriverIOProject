@login
Feature: User login
    As a registered user of Automation Test Store
    I want to be able to log into my account
    So that I can access my personal account dashboard

    Background:
        Given I am on the home page

    @smoke-testing @happy-path
    Scenario: Successfully log in with valid credentials
        When I click on the Login or Register link
        Then I should be navigated to the login page
        When I enter valid credentials and click login
        Then I should be logged in successfully

    @smoke-testing @negative
    Scenario: Login fails with invalid credentials
        When I click on the Login or Register link
        Then I should be navigated to the login page
        When I attempt to log in with invalid credentials
        Then I should see a login error message
