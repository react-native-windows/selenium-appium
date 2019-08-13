/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WebDriver, WebElementCondition, By } from "selenium-webdriver";
import { IWebDriver2 } from './webdriver2';

export interface IPageObject {
  elementExists(by: By): Promise<boolean>;
  clickAndWaitForPage<T extends IPageObject>(type: (new (...args: any[]) => T), by: By, timeout?: number): Promise<T>;
  waitForPage<T extends IPageObject>(type: (new (...args: any[]) => T), timeout?: number): Promise<T>;
  isReadyConditions(): WebElementCondition[];
  waitUntilReady(timeout?: number): Promise<void>;
};

function getInstance<T>(type: (new (...args: any[]) => T), ...args: any[]): T {
  return new type(...args);
};

export function waitForPage<T extends IPageObject>(type: (new (...args: any[]) => T), driver: IWebDriver2, timeout?: number): Promise<T> {
  const page = getInstance(type, driver);
  return new Promise<T>((resolve) => {
    page.waitUntilReady(timeout).then(() => resolve(page))
  });
}

export function clickAndWaitForPage<T extends IPageObject>(type: (new (...args: any[]) => T), driver: IWebDriver2, by: By, timeout?: number): Promise<T> {
  return new Promise<T>((resolve) => {
    driver.getBy(by, timeout)
      .then(el => { return el.click(); })
      .then(() => { return waitForPage(type, driver, timeout); })
      .then(page => resolve(page));
  });
}

export class PageObject implements IPageObject {
  private static defaultTimeout: number = 20000; //ms
  private timeout?: number;
  private getTimeout(timeout?: number): number {
    if (timeout)
      return timeout;
    if (this.timeout)
      return this.timeout;
    return PageObject.defaultTimeout;
  }

  static setDefaultTimeout(ms: number) {
    this.defaultTimeout = ms;
  }

  protected appiumDriver: IWebDriver2;

  constructor(driver: IWebDriver2, timeout?: number) {
    this.timeout = timeout;
    this.appiumDriver = driver;
  }

  elementExists(by: By): Promise<boolean> {
    return new Promise<boolean>(resolve =>
      this.appiumDriver.seleniumDriver().findElement(by)
        .then(() => resolve(true))
        .catch(() => resolve(false))
    );
  }

  isReadyConditions(): WebElementCondition[] {
    throw new Error("Not implemented");
  }

  waitUntilReady(timeout?: number): Promise<void> {
    const webDriver = this.appiumDriver.seleniumDriver();
    if (webDriver) {
      return PageObject.waitForConditions(webDriver, this.isReadyConditions(), this.getTimeout(timeout));
    } else {
      return Promise.reject("no driver found");
    }
  }

  clickAndWaitForPage<T extends IPageObject>(type: (new (...args: any[]) => T), by: By, timeout?: number): Promise<T> {
    return clickAndWaitForPage(type, this.appiumDriver, by, this.getTimeout(timeout));
  }

  waitForPage<T extends IPageObject>(type: (new (...args: any[]) => T), timeout?: number): Promise<T> {
    return waitForPage(type, this.appiumDriver, this.getTimeout(timeout));
  }

  private static async  waitForConditions(driver: WebDriver, conditions: WebElementCondition[], timeout?: number) {
    for (var i = 0; i < conditions.length; i++) {
      if (conditions[i]) {
        await driver.wait(conditions[i], timeout);
      }
    }
  }
}