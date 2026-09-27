import {test,expect} from "@playwright/test"

test('login and search leave', async({page}) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/');
    await page.locator("input[name='username']").fill('Admin');
    await page.locator("input[name='password']").fill('admin123');
    await page.getByRole('button', {name: 'Login'}).click();

    await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');

    await page.getByRole('link', {name: 'Leave', exact: true}).click();

    //await page.locator("(//i[contains(@class,'oxd-icon bi-calendar oxd-date-input-icon')])[1]").click();

    await page.getByPlaceholder("yyyy-dd-mm").nth(0).fill('2026-06-17');

    await page.getByPlaceholder("yyyy-dd-mm").nth(1).fill('2026-06-17');

    await page.locator('.oxd-select-text-input').nth(0).click();
    await page.getByText('Scheduled').click();

    await page.locator('.oxd-select-text-input').nth(1).click();
    await page.getByText('CAN - FMLA').click();

    await page.getByPlaceholder('Type for hints...').fill('manda akhil user');
    await page.waitForTimeout(1000);
    await page.getByText('manda akhil user').first().click();

    await page.locator('.oxd-select-text-input').nth(2).click();
    await page.getByText('Engineering').click();

    await page.locator('.oxd-switch-input').click();
    await page.getByRole('button', {name: 'Search'}).click();
})