import { By2, driver, WebDriver2 } from 'selenium-appium'
import { Builder, until } from 'selenium-webdriver';
import { capabilities } from '../Setup';

jest.setTimeout(50000);

const url = 'http://localhost:4723'

describe('driver', () => {
    test("simple webdriver2, and driver create from WebDriver", async () => {
        const webdriver = await new Builder()
            .usingServer(url)
            .withCapabilities(capabilities)
            .build();
        await driver.startWithWebDriver(webdriver);
        await By2.nativeName('One').click();
        await webdriver.quit();
    });

    test("Multiple webdriver2", async () => {
        const webdriver = new WebDriver2();
        await webdriver.startWithCapabilities(capabilities)
        await By2.nativeName('One', webdriver).click();
        await webdriver.quit();
    });


    test("Simple Webdriver2, and Driver create from capabilities", async () => {
        await driver.startWithCapabilities(capabilities)
        await By2.nativeName('One').click();
        await driver.quit();
    });
})