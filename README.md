# selenium-appium
selenium-appium is [selenium-webdriver](https://seleniumhq.github.io/selenium/docs/api/javascript/) extension to make selenium-webdriver to drive [Appium](https://github.com/appium/appium) to run automation for native, hybrid and mobile web and desktop apps.

[![NPM version](https://badge.fury.io/js/selenium-appium.svg)](https://npmjs.org/package/selenium-appium)
[![Monthly Downloads](https://img.shields.io/npm/dm/selenium-appium.svg)](https://npmjs.org/package/selenium-appium)
[![Build Status](https://dev.azure.com/licanhua/selenium-appium/_apis/build/status/react-native-windows.selenium-appium?branchName=master)](https://dev.azure.com/licanhua/selenium-appium/_build/latest?definitionId=4&branchName=master)

## Break changes
1. selenium-appium@1.0.0 The default URL is changed from `http://localhost:4723/wd/hub` to `http://localhost:4723`. The goal is to remove appium from the project and use [winappdriver](https://www.npmjs.com/package/winappdriver) to launch and stop WinAppDriver 

### Features
1. A bridge to make selenium-webdriver to drive appium for native app automation. Implement [Mobile JSON Wire Protocol Specification](https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md) locator which selenium-webdriver doesn't support.
2. Supports PageObject Pattern for selenium-webdriver
3. Supports iOS, Andriod, Windows which Appium supports.
4. Supports Typescript
5. Avoid webdriver.wait(until.elementLocated()).click() pattern and replaced it with By2.click()

### Installation
```
npm i selenium-appium --save-dev
```

### [By2 example](https://github.com/react-native-windows/selenium-appium/blob/master/example/__tests__/By2.test.ts)
- By2 is a subclass of selenium-webdriver.By. So you can use it anywhere which selenium-webdriver provides.
- Also By2 implements the WebElement interface, so you can call click and other element operation directly.
- No webdriver.wait needed. Instead of findElement, By2 itself loop until element is located before actual click happens.
```
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
```

### [driver example](https://github.com/react-native-windows/selenium-appium/blob/master/example/__tests__/Driver2.test.ts)
- driver is a wrapper of WebDriver which selenium-webdriver provides. 
- Implements all functions of WebDriver of selenium-webdriver.
- It provides the default driver for By2.
- It delayed the creation of WebDriver, and implement the interface of WebDriver.

There are two ways to initialize the driver: startWithWebDriver or startWithWebDriver. 

startWithWebDriver allows you to attach the driver to existing WebDriver if capability is not enough for your testing.

```
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
```

### [PageObject example](https://github.com/react-native-windows/selenium-appium/blob/master/example/__tests__/CalculatorWithPageObject.test.ts)
[PageObject](https://github.com/SeleniumHQ/selenium/wiki/PageObjects) reduces the amount of duplicated code and easy to maintain.
1. get in typescript would make you always get new instance of By2. For example, get resultTextBox()
2. waitForPageLoaded pairs with isPageLoaded. You only need to overload isPageLoaded. waitForPageLoaded would poll until isPageLoaded is true or timeout.
3. In practice, we only need simple instance of PageObject since it doesn't save state, and all state could be query by By2 from remote app.

PageObject
```
import { PageObject, By2 } from "selenium-appium";

class CalculatorPage extends PageObject {
  isPageLoaded() {
    return this.minusButton.isDisplayed();
  }

  get resultTextBox() { return By2.nativeAccessibilityId('CalculatorResults');}
  get equalButton() { return By2.nativeAccessibilityId('equalButton'); }
  get clearButton() { return By2.nativeName('Clear'); }
  get plusButton() { return By2.nativeName('Plus'); }
  get divideButton() { return By2.nativeAccessibilityId('divideButton'); }
  get multiplyButton() { return By2.nativeXpath("//Button[@Name='Multiply by']") }
  get minusButton() { return By2.nativeXpath("//Button[@AutomationId=\"minusButton\"]"); }
 

  private async pressKeys(keys: string) {
    for (var key of keys) {
      await By2.nativeAccessibilityId('num' + key + 'Button').click();
    }
  }
  async divid(a: string, b: string): Promise<string> {
    await this.pressKeys(a);
    await this.divideButton.click();
    await this.pressKeys(b);
    await this.equalButton.click();
    return await this.getCalculatorResultText();
  }

  async multiply(a: string, b: string): Promise<string> {
    await this.pressKeys(a);
    await this.multiplyButton.click();
    await this.pressKeys(b);
    await this.equalButton.click();
    return await this.getCalculatorResultText();
  }

  async plus(a: string, b: string): Promise<string> {
    await this.pressKeys(a);
    await this.plusButton.click();
    await this.pressKeys(b);
    await this.equalButton.click();
    return await this.getCalculatorResultText();
  }

  async minus(a: string, b: string): Promise<string> {
    await this.pressKeys(a);
    await this.minusButton.click();
    await this.pressKeys(b);
    await this.equalButton.click();
    return await this.getCalculatorResultText();
  }

  private async getCalculatorResultText(): Promise<string> {
    return (await this.resultTextBox.getText()).replace('Display is', '').trim();
  } 
}

export default new CalculatorPage();
```

use the PageObject
```
  beforeEach(async () => {
    await CalculatorPage.waitForPageLoaded();
    await CalculatorPage.clearButton.clear();
  });
  test('Addition', async () => {
    // Find the buttons by their names and click them in sequence to perform 1 + 7 = 8
    expect(await CalculatorPage.plus('1', '7')).toBe('8');
  });

  test('Division', async () => {
    // Find the buttons by their accessibility ids and click them in sequence to perform 88 / 11 = 8
    expect(await CalculatorPage.divid('88', '11')).toBe('8');
  });

  test('Multiplication', async () => {
    // Find the buttons by their names using XPath and click them in sequence to perform 9 x 9 = 81
    expect(await CalculatorPage.multiply('9', '9')).toBe('81');
  });

  test('Subtraction', async () => {
    // Find the buttons by their accessibility ids using XPath and click them in sequence to perform 9 - 1 = 8
    expect(await CalculatorPage.minus('9', '1')).toBe('8');
  });
```

### [Configuration example](https://github.com/react-native-windows/selenium-appium/blob/master/example/__tests__/Times.ts)
  There are two global timers: waitforPageTimeout and waitforTimeout.

  waitforTimeout is used by By2. When call any WebElement function of By2, it loops until the element is located

  waitforPageTimeout is used by PageObject. It defined the default timeout for waitForPageLoaded.

```
    Config.setWaitForPageTimeout(100);
    expect(Config.getWaitForPageTimeout()).toBe(100);
```
    Config.setWaitForTimeout(100);
    expect(Config.getWaitForTimeout()).toBe(100);

### driver.seleniumDriver
driver.seleniumDriver returns the instance of actual WebDriver.

### Note
Because of typescript error, unlike By.name, By2 only replaced it with By2.name2.

### Why selenium-appium
selenium-appium projected is created when I prototype automation for react-native Windows testing.
[Appium](https://github.com/appium/appium) is an open source, cross-platform test automation tool for native, hybrid and mobile web and desktop apps. We support simulators (iOS), emulators (Android), and real devices (iOS, Android, Windows, Mac).

[Selenium](https://github.com/SeleniumHQ/selenium) is a browser automation library. Most often used for testing web-applications.

[selenium-webdriver](https://seleniumhq.github.io/selenium/docs/api/javascript/) is the offical WebDriver Javascript binding from selenium project.

Although [WebDriverIO](https://webdriver.io/) provides webdriver for Appium, it has some restrictions:
1. Selenium has very large user base in browser automation, but [WebDriverIO API](https://webdriver.io/docs/api.html) is different from [selenium javascript API](https://seleniumhq.github.io/selenium/docs/api/javascript/)
2. [Already fixed] WebDriverIO has problem to support WinAppDriver, for example, https://github.com/webdriverio/webdriverio/pull/4369

Unfortunately selenium-webdriver doesn't support [
Mobile JSON Wire Protocol Specification](https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md). And that's why selenium-appium project is created.

## Note
To know more about how to integrate JavaScript test runner and WinAppDriver for UI automation, please refer to:
- [WinAppDriver + WebDriverIO example](https://github.com/licanhua/wdio-winappdriver-example). Example to demostrate WinAppDriver and WebDriver integration without appium dependency

- [E2E test](https://github.com/microsoft/react-native-windows/blob/master/vnext/docs/E2ETest.md) on React Native for Windows. [MoreAboutE2ETest.md](https://github.com/microsoft/react-native-windows/blob/master/vnext/docs/MoreAboutE2ETest.md) provides some background why React Native Windows choose WinAppDriver and node test runner for E2E testing.

- [winappdriver-js-webdriver-example](https://github.com/react-native-windows/winappdriver-js-webdriver-example), Which includes:
1. Jest + selenium-webdriver + WinAppDriver
2. Jasmine + WebDriverIO + WinAppDriver. This part is obselete, please refer to  [WinAppDriver + WebDriverIO example](https://github.com/licanhua/wdio-winappdriver-example) for newer change.

- [selenium-webdriver-winappdriver-example](https://github.com/react-native-windows/selenium-webdriver-winappdriver-example). 
An example of jest, selenium-webdriver and winappdriver integration

- [selenium-appium](https://github.com/react-native-windows/selenium-appium). selenium-appium is selenium-webdriver extension to make selenium-webdriver to drive Appium to run automation for native, hybrid and mobile web and desktop apps.

- [Choose the right E2E automation framework for React Native Windows](https://medium.com/@licanhua/choose-the-right-e2e-automation-framework-for-react-native-windows-83ade8b16b52)

- [How to: Use Jest + selenium-webdriver + WinAppDriver to do Windows UI testing](https://medium.com/@licanhua/how-to-use-jest-selenium-webdriver-winappdriver-to-do-windows-ui-testing-c9d074e698ed)

- [Automated Windows UI testing by Jest + selenium-appium + selenium-webdriver + WinAppDriver](https://medium.com/@licanhua/automated-windows-ui-testing-by-jest-selenium-appium-selenium-webdriver-winappdriver-6cb708121d71)

- [Inspecting UI Elements for WinAppDriver automation using Appium Desktop](https://medium.com/@licanhua/inspecting-ui-elements-for-winappdriver-automation-using-appium-desktop-8f178b2d0d6c)

## License
The selenium-appium and all newly contributed code is provided under the [MIT License](LICENSE). 
