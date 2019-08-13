/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';
import { Locator, WebDriver, Builder, until, Capabilities, WebElement, WebElementPromise, ThenableWebDriver, FileDetector, Session, Actions, WebElementCondition, Condition, Options, Navigation, TargetLocator } from 'selenium-webdriver'
import { Command, Executor } from 'selenium-webdriver/lib/command'
import { By2 } from './by2';
import { MobileExtensionCommand, NetworkConnectionType } from './mobileextension';

interface INativeWaitAndGet {
  getByNativeAccessibilityId(id: string, timeout?: number, message?: string): WebElementPromise;
  getByNativeName(name: string, timeout?: number, message?: string): WebElementPromise;
  getByNativeId(id: string, timeout?: number, message?: string): WebElementPromise;
  getByNativeclassName(className: string, timeout?: number, message?: string): WebElementPromise;
}

interface IWaitAndGet extends INativeWaitAndGet {
  getBy(locator: Locator, timeout?: number, message?: string): WebElementPromise;
}

export interface IWebDriver2 extends IWaitAndGet {
  // internal WebDriver is created by user
  attach(webDriver: WebDriver): void;
  detach(): void;

  // internal WebDriver is create from Capabilities and url
  start(): Promise<void>;
  stop(): Promise<void>;
  restart(): Promise<void>;

  isActive(): Promise<boolean>;
  seleniumDriver(): WebDriver;
  lastError(): any;
  
}

export class WebDriver2 implements IWebDriver2 {
  /**
   * Schedules a command to get Chrome network emulation settings.
   * @return {!Promise} A promise that will be resolved when network
   *     emulation settings are retrievied.
   */
  getNetworkCondition(): Promise<{type: NetworkConnectionType}> {
    return this.execute(new Command(MobileExtensionCommand.GET_NETWORK_CONDITION));
  }

  setNetworkCondition(type: NetworkConnectionType) {    
    return this.execute(
        new Command(MobileExtensionCommand.SET_NETWORK_CONDITION)
            .setParameter('network_conditions', {type: type}));
  }

  wait(condition: WebElementCondition, opt_timeout?: number | undefined, opt_message?: string | undefined): WebElementPromise {
    return this.seleniumDriver().wait(condition, opt_timeout, opt_message);
  }

  wait2<T>(condition: Function | PromiseLike<T> | Condition<T> | ((driver: WebDriver) => T | PromiseLike<T>), opt_timeout?: number | undefined, opt_message?: string | undefined): Promise<T> {
    return this.seleniumDriver().wait<T>(condition, opt_timeout, opt_message);
  }

  sleep(ms: number): Promise<void> {
    return this.seleniumDriver().sleep(ms);
  }

  [Symbol.toStringTag]: string;
  execute<T>(command: Command, description?: string | undefined): Promise<T> {
    return this.seleniumDriver().execute<T>(command, description);
  }

  setFileDetector(detector: FileDetector): void {
    return this.seleniumDriver().setFileDetector(detector);
  }

  getExecutor(): Executor {
    return this.seleniumDriver().getExecutor();
  }

  getSession(): Promise<Session> {
    return this.seleniumDriver().getSession();
  }

  getCapabilities(): Promise<Capabilities> {
    return this.seleniumDriver().getCapabilities();
  }

  quit(): Promise<void> {
    return this.stop();
  }

  actions(options?: { async: boolean; bridge: boolean; } | { async: boolean; } | { bridge: boolean; } | undefined): Actions {
    return this.seleniumDriver().actions(options);
  }

  executeScript<T>(script: string | Function, ...var_args: any[]): Promise<T> {
    return this.seleniumDriver().executeScript(script, var_args);
  }

  executeAsyncScript<T>(script: string | Function, ...var_args: any[]): Promise<T> {
    return this.seleniumDriver().executeAsyncScript<T>(script, var_args);
  }

  getWindowHandle(): Promise<string> {
    return this.seleniumDriver().getWindowHandle();
  }

  getAllWindowHandles(): Promise<string[]> {
    return this.seleniumDriver().getAllWindowHandles();
  }

  getPageSource(): Promise<string> {
    return this.seleniumDriver().getPageSource();
  }

  close(): Promise<void> {
    return this.seleniumDriver().close();
  }

  get(url: string): Promise<void> {
    return this.seleniumDriver().get(url);
  }

  getCurrentUrl(): Promise<string> {
    return this.seleniumDriver().getCurrentUrl();
  }

  getTitle(): Promise<string> {
    return this.seleniumDriver().getTitle();
  }

  findElement(locator: Locator): WebElementPromise {
    return this.seleniumDriver().findElement(locator);
  }
  findElements(locator: Locator): Promise<WebElement[]> {
    return this.seleniumDriver().findElements(locator);
  }
  takeScreenshot(): Promise<string> {
    return this.seleniumDriver().takeScreenshot();
  }
  manage(): Options {
    return this.seleniumDriver().manage();
  }
  navigate(): Navigation {
    return this.seleniumDriver().navigate();
  }
  switchTo(): TargetLocator {
    return this.seleniumDriver().switchTo();
  }

  getBy(locator: Locator, timeout?: number, message?: string | undefined): WebElementPromise {
    if (this.webDriver)
      return this.webDriver.wait(until.elementLocated(locator), timeout, message);
    this.error_ = "no valid connection";
    throw this.error_;
  }

  getByNativeAccessibilityId(id: string, timeout?: number | undefined, message?: string | undefined): WebElementPromise {
    return this.getBy(By2.nativeAccessibilityId(id), timeout, message);
  }

  getByNativeName(name: string, timeout?: number | undefined, message?: string | undefined): WebElementPromise {
    return this.getBy(By2.nativeName(name), timeout, message);
  }

  getByNativeId(id: string, timeout?: number | undefined, message?: string | undefined): WebElementPromise {
    return this.getBy(By2.nativeId(id), timeout, message);
  }

  getByNativeclassName(className: string, timeout?: number | undefined, message?: string | undefined): WebElementPromise {
    return this.getBy(By2.nativeClassName(className), timeout, message);
  }

  seleniumDriver(): WebDriver {
    if (this.webDriver)
      return this.webDriver;
    throw new Error("no valid connection");
  }

  lastError() {
    return this.error_;
  }

  attach(webDriver: WebDriver): void {
    this.webDriver = webDriver;
  }

  detach(): void {
    this.webDriver = undefined;
  }

  start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.capabilities_) {
        new Builder()
          .usingServer(this.url_)
          .withCapabilities(this.capabilities_)
          .build()
          .then(driver => { this.webDriver = driver; resolve(); })
          .catch(e => { this.error_ = e; reject(e) });
      }
      else {
        reject("capabilities is not set");
      }
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
    await this.stop().then().catch(); //ignore stop error
    await this.start();
  }

  private capabilities_?: Capabilities | {};
  private error_?: any;
  private url_: string
  private webDriver?: WebDriver;

  constructor(capabilities?: Capabilities | {}, url?: string) {
    this.capabilities_ = capabilities;
    this.url_ = url ? url : "http://localhost:4723/wd/hub";
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

export function createWebDriver2(capabilities?: Capabilities | {}, url?: string): WebDriver2 {
  return new WebDriver2(capabilities, url);
}