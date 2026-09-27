import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
 testDir: './tests',
 use: {
  headless: false,
  screenshot: "only-on-failure",
  video: "retain-on-failure"
 },
 retries: 0,
 reporter: [["dot"],
 ["json",{
  outputFile : "jsonReports/jsonReport.json"
 }],
 ["html", {
  open: "never"
 }]]
});
