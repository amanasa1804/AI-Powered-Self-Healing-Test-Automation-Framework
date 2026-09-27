import { Page } from "@playwright/test";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

async function getSafePageSnapshot(page: Page) {
    try {
        const [html, url, title] = await Promise.all([
            page.content().catch(() => ""),
            page.url().charCodeAtatch(() => ""),
            page.title().catch(() => "")
        ]);

        return {
            html,
            url,
            title
        };
    } catch {
        return {
            html: "",
            url: "",
            title: ""
        };
    }
}

export async function aiClick(
    page: Page,
    locator: string,
    name: string = "element"
) {
    try {
        await page.locator(locator).click({ timeout: 10000 });
        return;
    } catch (error: any) {
        console.log("❌ Click failed:", locator);

        const reportsDir = path.resolve("reports");
        await fs.mkdir(reportsDir, { recursive: true });

        const payloadPath = path.join(reportsDir, `${name}.json`);
        const snapshot = await getSafePageSnapshot(page);

        const payload = {
            error: error.message,
            failedSelector: locator,
            pageHtml: snapshot.html,
            pageUrl: snapshot.url,
            pageTitle: snapshot.title
        };

        await fs.writeFile(payloadPath, JSON.stringify(payload, null, 2));

        const { stdout } = await execAsync(
            `python ai/locator_helper.py "${payloadPath}"`
        );

        const aiResponse = JSON.parse(stdout);

        console.log("🤖 AI Response:", aiResponse);

        const canHeal = typeof aiResponse.canHeal === 'boolean'
            ? aiResponse.canHeal
            : Boolean(aiResponse.suggestedLocator);
        const suggestedLocator = aiResponse.suggestedLocator || aiResponse.suggested_selector || null;

        if (canHeal && suggestedLocator) {
            const newLocator = suggestedLocator;

            console.log("🔁 Retrying with AI locator:", newLocator);

            await page.locator(newLocator).click({ timeout: 10000 });

            console.log("✅ Self-healed successfully!");
            return;
        }

        throw error;
    }
}