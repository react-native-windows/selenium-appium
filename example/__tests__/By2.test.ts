/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { By2, driver, WebDriver2 } from 'selenium-appium'
import { Builder, until } from 'selenium-webdriver';
import { capabilities } from '../Setup'

jest.setTimeout(50000);

const url = 'http://localhost:4723/wd/hub'

describe('By2', () => {
    test("By2 used in selenium-webdriver.WebDriver", async () => {
        const webdriver = await new Builder()
            .usingServer(url)
            .withCapabilities(capabilities)
            .build();
        const element = await webdriver.wait(until.elementLocated(By2.nativeName('One')));
        await element.click();
        await webdriver.quit();
    });

    test("By2 Supports multiple webdriver2", async () => {
        const webdriver = new WebDriver2();
        await webdriver.startWithCapabilities(capabilities)
        await By2.nativeName('One', webdriver).click();
        await webdriver.quit();
    });


    test("By2 deduced WebDriver2 for single WebDriver2", async () => {
        await driver.startWithCapabilities(capabilities)
        await By2.nativeName('One').click();
        await driver.quit();
    });
})