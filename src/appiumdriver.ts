/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';

import { WebDriver, Builder, until } from 'selenium-webdriver'
import { By } from './by';

export class AppiumDriver {
  private static windowsCapabilities(appName: string) {
    return {
      browserName: '',
      platformName: 'windows',
      deviceName: 'WindowsPC',
      app: appName
    };
  }

  driver_: WebDriver;

  static createWinAppDriver(appName: string, url = "http://localhost:4723/wd/hub"): Promise<AppiumDriver> {
    return new Promise<AppiumDriver>(resolve => {
      new Builder()
        .usingServer(url)
        .withCapabilities(AppiumDriver.windowsCapabilities(appName))
        .build().
        then((driver) => { resolve(new AppiumDriver(driver)); });
    });
  }

  webDriver(): WebDriver {
    return this.driver_;
  }

  constructor(driver: WebDriver) {
    this.driver_ = driver;
  }

  getByAccessibilityId(id: string, timeout = 0, message = undefined) {
    return this.driver_.wait(until.elementLocated(By.accessibilityId(id)), timeout, message);
  }

  getByName(name: string, timeout = 0, message = undefined) {
    return this.driver_.wait(until.elementLocated(By.name(name)), timeout, message);
  }

  getById(id: string, timeout = 0, message = undefined) {
    return this.driver_.wait(until.elementLocated(By.id(id)), timeout, message);
  }

  getByclassName(className: string, timeout = 0, message = undefined) {
    return this.driver_.wait(until.elementLocated(By.className(className)), timeout, message);
  }

  sleep(ms: number) {
    return this.driver_.sleep(ms);
  }
  quit() {
    return this.driver_.quit();
  }
}