import {Config} from 'selenium-appium'

describe('Timeout example', () => {

    // There are two global timers: waitforPageTimeout and waitforTimeout
    // waitforTimeout is used by By2. When call any WebElement function of By2, it loops until the element is located
    // waitforPageTimeout is used by PageObject. It defined the default timeout for waitForPageLoaded.
    test("Timer testing", () => {
    Config.setWaitForPageTimeout(100);
    expect(Config.getWaitForPageTimeout()).toBe(100);

    Config.setWaitForTimeout(100);
    expect(Config.getWaitForTimeout()).toBe(100);
    });
});