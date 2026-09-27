import {test,expect} from "@playwright/test";

test("alert", async({page}) => {
    await page.goto("url");
    page.on("dialog", async(alert) => {
        
        const alertMessege = alert.message();
        await alert.accept();
        await alert.accept("sriram");
        await alert.dismiss();
    })
    page.on("dialog", async (dialog) => {
    expect(dialog.type()).toBe("prompt");
    expect(dialog.message()).toContain("Enter your name");
    await dialog.accept("Sriram");
});

    page.locator("some locator to accept initate alert");
})