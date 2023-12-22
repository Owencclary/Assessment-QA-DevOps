const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });
});

test('clicking the Draw button displays choices', async () => {
  await page.click('#draw');
  await page.waitForSelector('#choices', { visible: true });
});

test('when a bot is removed, it goes back to choices', async () => {
  await page.click('.bot-btn');
  await page.waitForSelector('#choices', { visible: true });
});