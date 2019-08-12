/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';
import { WebDriver, Builder, until, Capabilities, WebElementPromise } from 'selenium-webdriver'
import { By2 } from './by2';
import { By } from 'selenium-webdriver'

interface IAppiumWaitUntilFound {
  get(by: By, timeout?: number, message?: string): WebElementPromise;
  getByAccessibilityId(id: string, timeout?: number, message?: string): WebElementPromise;
  getByName(name: string, timeout?: number, message?: string): WebElementPromise;
  getById(id: string, timeout?: number, message?: string): WebElementPromise;
  getByclassName(className: string, timeout?: number, message?: string): WebElementPromise;
}

export interface IAppiumDriver extends IAppiumWaitUntilFound {
  start(): Promise<void>;
  stop(): Promise<void>;
  restart(): Promise<void>;
  isActive(): Promise<boolean>;
  seleniumDriver(): WebDriver;
  lastError(): any;
  sleep(ms: number): Promise<void>;
}

class AppiumDriver implements IAppiumDriver {
  get(by: By, timeout?: number, message?: string | undefined): WebElementPromise {
    if (this.webDriver)
      return this.webDriver.wait(until.elementLocated(by), timeout, message);
    throw new Error("no valid connection");
  }

  getByAccessibilityId(id: string, timeout?: number | undefined, message?: string | undefined): WebElementPromise {
    return this.get(By2.accessibilityId(id), timeout, message);
  }

  getByName(name: string, timeout?: number | undefined, message?: string | undefined): WebElementPromise {
    return this.get(By2.name(name), timeout, message);
  }

  getById(id: string, timeout?: number | undefined, message?: string | undefined): WebElementPromise {
    return this.get(By2.id(id), timeout, message);
  }

  getByclassName(className: string, timeout?: number | undefined, message?: string | undefined): WebElementPromise {
    return this.get(By2.className(className), timeout, message);
  }

  sleep(ms: number): Promise<void> {
    if (this.webDriver)
      return this.webDriver.sleep(ms);
    throw new Error("no valid connection");
  }

  seleniumDriver(): WebDriver {
    if (this.webDriver)
      return this.webDriver;
    throw new Error("no valid connection");
  }

  lastError() {
    return this.error_;
  }

  start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      new Builder()
        .usingServer(this.url_)
        .withCapabilities(this.capabilities_)
        .build()
        .then(driver => { this.webDriver = driver; resolve(); })
        .catch(e => { this.error_ = e; reject(e) });
    });
  }

  stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.webDriver && this.webDriver
        .quit()
        .then(() => resolve())
        .catch(e => { this.error_ = e; reject(e) });
      resolve();
    });
  }

  restart(): Promise<void> {
    return this._restart();
  }

  private async _restart() {
    await this.stop().catch(); //ignore stop error
    await this.start();
  }

  private capabilities_: Capabilities | {};
  private error_?: any;
  private url_: string
  private webDriver?: WebDriver;

  constructor(capabilities: Capabilities | {}, url: string = "http://localhost:4723/wd/hub") {
    this.capabilities_ = capabilities;
    this.url_ = url;
  }

  isActive(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.webDriver && this.webDriver
        .getSession()
        .then(() => resolve(true), reason => resolve(false))
      resolve(false);
    });
  }
}

export function createAppiumWebDriver(capabilities: Capabilities | {}, url?: string): IAppiumDriver {
  return new AppiumDriver(capabilities, url);
}