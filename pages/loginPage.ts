import { Page } from '@playwright/test';
import * as locators from '../locators/locators.json';
import { aiClick } from '../utils/aiClick';

export class LoginPage {

  constructor(private page: Page) {}

  async open() {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/');
  }

  async login(userName: string, password: string) {

    await this.page.fill(locators.loginPage.usernameInput, userName);
    await this.page.fill(locators.loginPage.passwordInput, password);

    await aiClick(
      this.page,
      locators.loginPage.loginButton,
      "Login Button"
    );
  }
}