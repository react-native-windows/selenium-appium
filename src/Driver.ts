/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';
import { Locator, WebDriver, Builder, until, Capabilities, WebElement, WebElementPromise, ThenableWebDriver, FileDetector, Session, Actions, WebElementCondition, Condition, Options, Navigation, TargetLocator } from 'selenium-webdriver'
import { Command, Executor } from 'selenium-webdriver/lib/command'

interface IWebDriver2 extends WebDriver {
  isActive(): Promise<boolean>;
  lastError(): any;
}

export class WebDriver2 implements IWebDriver2 {
  /**
  *   @see WebDriver.wait
  */
  wait(condition: WebElementCondition, opt_timeout?: number | undefined, opt_message?: string | undefined): WebElementPromise {
    return this.seleniumDriver.wait(condition, opt_timeout, opt_message);
  }

  /**
 *   @see WebDriver.wait
*/
  wait2<T>(condition: Function | PromiseLike<T> | Condition<T> | ((driver: WebDriver) => T | PromiseLike<T>), opt_timeout?: number | undefined, opt_message?: string | undefined): Promise<T> {
    return this.seleniumDriver.wait<T>(condition, opt_timeout, opt_message);
  }

  /**
*   @see WebDriver.sleep
*/
  sleep(ms: number): Promise<void> {
    return this.seleniumDriver.sleep(ms);
  }

  /**
*   @see WebDriver.execute
*/
  execute<T>(command: Command, description?: string | undefined): Promise<T> {
    return this.seleniumDriver.execute<T>(command, description);
  }

  /**
*   @see WebDriver.setFileDetector
*/
  setFileDetector(detector: FileDetector): void {
    return this.seleniumDriver.setFileDetector(detector);
  }

  /**
*   @see WebDriver.getExecutor
*/
  getExecutor(): Executor {
    return this.seleniumDriver.getExecutor();
  }

  /**
*   @see WebDriver.getSession
*/
  getSession(): Promise<Session> {
    return this.seleniumDriver.getSession();
  }

  /**
*   @see WebDriver.getCapabilities
*/
  getCapabilities(): Promise<Capabilities> {
    return this.seleniumDriver.getCapabilities();
  }

  /**
*   @see WebDriver.quit
*/
  quit(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.webDriver) {
        this.webDriver
          .quit()
          .then(() => { this.webDriver = undefined; resolve(); })
          .catch(e => { this.error_ = e; reject(e) })
      } else {
        resolve();
      }
    });
  }

  /**
*   @see WebDriver.actions
*/
  actions(options?: { async: boolean; bridge: boolean; } | { async: boolean; } | { bridge: boolean; } | undefined): Actions {
    return this.seleniumDriver.actions(options);
  }

  /**
*   @see WebDriver.executeScript
*/
  executeScript<T>(script: string | Function, ...var_args: any[]): Promise<T> {
    return this.seleniumDriver.executeScript(script, var_args);
  }

  /**
*   @see WebDriver.executeAsyncScript
*/
  executeAsyncScript<T>(script: string | Function, ...var_args: any[]): Promise<T> {
    return this.seleniumDriver.executeAsyncScript<T>(script, var_args);
  }

  /**
*   @see WebDriver.getWindowHandle
*/
  getWindowHandle(): Promise<string> {
    return this.seleniumDriver.getWindowHandle();
  }

  /**
  *   @see WebDriver.getAllWindowHandles
  */
  getAllWindowHandles(): Promise<string[]> {
    return this.seleniumDriver.getAllWindowHandles();
  }

  /**
  *   @see WebDriver.getPageSource
  */
  getPageSource(): Promise<string> {
    return this.seleniumDriver.getPageSource();
  }

  /**
  *   @see WebDriver.close
  */
  close(): Promise<void> {
    return this.seleniumDriver.close();
  }

  /**
  *   @see WebDriver.get
  */
  get(url: string): Promise<void> {
    return this.seleniumDriver.get(url);
  }

  /**
  *   @see WebDriver.getCurrentUrl
  */
  getCurrentUrl(): Promise<string> {
    return this.seleniumDriver.getCurrentUrl();
  }

  /**
  *   @see WebDriver.getTitle
  */
  getTitle(): Promise<string> {
    return this.seleniumDriver.getTitle();
  }

  /**
  *   @see WebDriver.findElement
  */
  findElement(locator: Locator): WebElementPromise {
    return this.seleniumDriver.findElement(locator);
  }

  /**
  *   @see WebDriver.findElements
  */
  findElements(locator: Locator): Promise<WebElement[]> {
    return this.seleniumDriver.findElements(locator);
  }

  /**
  *   @see WebDriver.takeScreenshot
  */
  takeScreenshot(): Promise<string> {
    return this.seleniumDriver.takeScreenshot();
  }

  /**
  *   @see WebDriver.manage
  */
  manage(): Options {
    return this.seleniumDriver.manage();
  }

  /**
  *   @see WebDriver.navigate
  */
  navigate(): Navigation {
    return this.seleniumDriver.navigate();
  }

  /**
  *   @see WebDriver.switchTo
  */
  switchTo(): TargetLocator {
    return this.seleniumDriver.switchTo();
  }

  get seleniumDriver(): WebDriver {
    if (this.webDriver)
      return this.webDriver;
    throw new Error("no valid connection");
  }

  lastError() {
    return this.error_;
  }

  startWithWebDriver(webDriver: WebDriver): void {
    this.webDriver = webDriver;
  }

  startWithCapabilities(capabilities: {} | Capabilities, url: string = "http://localhost:4723/wd/hub"): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (capabilities) {
        new Builder()
          .usingServer(url)
          .withCapabilities(capabilities)
          .build()
          .then(driver => { this.webDriver = driver; resolve(); })
          .catch(e => { this.error_ = e; reject(e) });
      }
      else {
        reject("capabilities is not set");
      }
    });
  }

  private error_?: any;
  private webDriver?: WebDriver;

  isActive(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (this.webDriver) {
        this.webDriver.getSession().then(() => resolve(true), reason => resolve(false))
      } else {
        resolve(false);
      }
    });
  }

  toString(): string {
    return 'WebDriver2'
  }
}

export const driver = new WebDriver2();