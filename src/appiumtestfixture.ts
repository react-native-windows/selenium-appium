/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';

import { AppiumDriver } from "./appiumdriver";
import { WebDriver, Capabilities } from "selenium-webdriver";

export interface IAppiumTestFixture {
  start(): Promise<void>;
  stop(): Promise<void>;
  restart(): Promise<void>;
  isActive(): Promise<boolean>;
  appiumDriver(): AppiumDriver | undefined;
  seleniumDriver(): WebDriver | undefined;
  error(): any;
};

class AppiumTestFixture implements IAppiumTestFixture {
  error() {
    return this.error_;
  }

  appiumDriver(): AppiumDriver | undefined {
    return this.driver_;
  }
  seleniumDriver(): WebDriver | undefined {
    if (this.driver_)
      return this.driver_.seleniumWebDriver();
  }

  start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      AppiumDriver.createAppiumDriver(this.capabilities_, this.url_)
        .then(driver => { this.driver_ = driver; resolve(); }, reason => { this.error_ = reason; reject(reason); })
    });
  }

  stop(): Promise<void> {
    this.error_ = undefined;
    return new Promise<void>((resolve, reject) => {
      if (this.driver_) {
        this.driver_.quit()
          .then(() => { this.driver_ = undefined; resolve(); }, reason => reject(reason))
      }
      else {
        resolve();
      }
    });
  }

  restart(): Promise<void> {
    return this._restart();
  }

  private async _restart() {
    await this.stop();
    await this.start();
  }

  private driver_?: AppiumDriver;
  private capabilities_: Capabilities | {};
  private error_?: any;
  private url_?: string

  constructor(capabilities: Capabilities | {}, url?: string) {
    this.capabilities_ = capabilities;
    this.url_ = url;
  }

  isActive(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.driver_)
        this.driver_.seleniumWebDriver().getSession().then(() => resolve(), reason => reject(reason))
      else {
        return Promise.reject("no connection");
      }
    });
  }
}

export function createAppiumTestFixture(capabilities: Capabilities | {}, url?: string): IAppiumTestFixture {
  return new AppiumTestFixture(capabilities, url);
}