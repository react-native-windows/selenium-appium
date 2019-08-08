/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';

import { AppiumDriver } from "./appiumdriver";
import { WebDriver, Capabilities } from "selenium-webdriver";

export interface ITestExecutionCallback {
  setupForTest(connection: AppiumTestFixture): Promise<void>;
  tearDownForTest(connection: AppiumTestFixture): Promise<void>;
  assertBeforeTest(connection: AppiumTestFixture): Promise<void>;
}

export class AppiumTestFixture {
  private driver_?: AppiumDriver;
  private capabilities_: Capabilities;
  private cb_?: ITestExecutionCallback;
  private error_?: any;
  private url_?: string

  constructor(capabilities: Capabilities, cb?: ITestExecutionCallback, url?: string) {
    this.capabilities_ = capabilities;
    this.cb_ = cb;
    this.url_ = url;
  }

  private async setupAppiumDriver() {
    try {
      this.driver_ = await AppiumDriver.createAppiumDriver(this.capabilities_, this.url_);
    }
    catch (reason) {
      this.error_ = reason;
      throw reason;
    }
  }

  private async tearDownAppiumDriver() {
    if (this.driver_ != null) {
      try {
        await this.driver_.quit();
      }
      catch (e) { }
      this.driver_ = undefined;
    }
  }

  private async isActive(): Promise<boolean> {
    return (this.driver_ != null && await this.driver_.seleniumWebDriver().getSession() != null);
  }

  appiumDriver(): AppiumDriver | undefined {
    return this.driver_;
  }

  seleniumWebDriver(): WebDriver | null {
    return this.driver_ != null ? this.driver_.seleniumWebDriver() : null;
  }

  beforeAll() {
    return this.setupAppiumDriver();
  }

  afterAll() {
    return this.tearDownAppiumDriver();
  }

  async beforeEach() {
    if (await this.isActive() && this.cb_) {
      return await this.cb_.setupForTest(this);
    }
  }

  async afterEach() {
    if (await this.isActive() && this.cb_) {
      return await this.cb_.tearDownForTest(this);
    }
  }

  async assertBeforeTest() {
    if (!await this.isActive()) {
      throw new Error("There is no active connection: " + this.error_);
    }
    if (this.cb_) {
      return await this.cb_.assertBeforeTest(this);
    }
  }
}
