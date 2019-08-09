/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';

import { WebDriver, Builder, until, Capabilities, WebElementPromise } from 'selenium-webdriver'
import { By } from './by';
import { By as SeleniumBy } from 'selenium-webdriver'

export interface IAppiumDriver{
  get(by: SeleniumBy, timeout?: number, message?: string): WebElementPromise;
  getByAccessibilityId(id: string, timeout?: number, message?: string): WebElementPromise;
  getByName(name: string, timeout?: number, message?: string): WebElementPromise;
  getById(id: string, timeout?: number, message?: string): WebElementPromise;
  getByclassName(className: string, timeout?: number, message?: string): WebElementPromise;
  sleep(ms: number): Promise<void>;
  quit(): Promise<void>;
}

export class AppiumDriver implements IAppiumDriver {
  driver_: WebDriver;

  static createAppiumDriver(appCapailities: Capabilities|{}, url = "http://localhost:4723/wd/hub") {
    return new Promise<AppiumDriver>((resolve, reject) => {
      new Builder()
        .usingServer(url)
        .withCapabilities(appCapailities)
        .build().
        then(driver => { resolve(new AppiumDriver(driver)); }, reason => reject(reason));
    });
  }

  seleniumWebDriver(): WebDriver {
    return this.driver_;
  }

  constructor(driver: WebDriver) {
    this.driver_ = driver;
  }

  get(by: SeleniumBy, timeout = 0, message = undefined) {
    return this.driver_.wait(until.elementLocated(by), timeout, message);
  }

  getByAccessibilityId(id: string, timeout = 0, message = undefined) {
    return this.get(By.accessibilityId(id), timeout, message);
  }

  getByName(name: string, timeout = 0, message = undefined) {
    return this.get(By.name(name), timeout, message);
  }

  getById(id: string, timeout = 0, message = undefined) {
    return this.get(By.id(id), timeout, message);
  }

  getByclassName(className: string, timeout = 0, message = undefined) {
    return this.get(By.className(className), timeout, message);
  }

  sleep(ms: number) {
    return this.driver_.sleep(ms);
  }
  quit() {
    return this.driver_.quit();
  }
}