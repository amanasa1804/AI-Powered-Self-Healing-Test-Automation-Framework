import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import * as path from 'path';
import { mkdir, writeFile } from 'fs/promises';

test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('Admin', 'admin123');
});

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
        const reportsDir = path.resolve('reports');
        await mkdir(reportsDir, { recursive: true });

        const testName = testInfo.title.replace(/\s+/g, '-');
        const screenshotPath = path.join(reportsDir, `${testName}.png`);
        const htmlPath = path.join(reportsDir, `${testName}.html`);
        const errorPath = path.join(reportsDir, `${testName}.txt`);
        const payloadPath = path.join(reportsDir, `${testName}.json`);

        let pageHtml = '';

        try {
            await page.screenshot({ path: screenshotPath, fullPage: true });
        } catch {
            // Ignore screenshot issues during teardown
        }

        try {
            pageHtml = await page.content();
        } catch {
            // Ignore page-content issues if the page is already closed
        }

        await writeFile(htmlPath, pageHtml, 'utf8');

        const errorMessage =
            testInfo.errors?.[0]?.message || 'No error message captured';

        await writeFile(errorPath, errorMessage, 'utf8');

        const failedSelector =
            errorMessage.match(/locator\(['\"](.*?)['\"]\)/)?.[1] ||
            'No selector found';

        const payload = {
            testName: testInfo.title,
            status: testInfo.status,
            error: errorMessage,
            failedSelector,
            pageHtml
        };

        await writeFile(payloadPath, JSON.stringify(payload, null, 2), 'utf8');

        console.log(`Failure artifacts saved for: ${testInfo.title}`);
    }
});