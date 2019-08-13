/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';
import { Locator, WebDriver, Builder, until, Capabilities, WebElement, WebElementPromise, ThenableWebDriver, FileDetector, Session, Actions, WebElementCondition, Condition, Options, Navigation, TargetLocator } from 'selenium-webdriver'
import { Command, Executor } from 'selenium-webdriver/lib/command'
import { By2 } from './by2';
import { MobileJSONWireCommand, NetworkConnectionParam, configureMobileJSONWireExtension } from './mobileextension';

interface INativeWaitAndGet {
  /**
 * wait until element by accessibility id exists or timeout
 */
  getByNativeAccessibilityId(id: string, timeout?: number, message?: string): WebElementPromise;
  /**
 * wait until element by name exists or timeout
 */
  getByNativeName(name: string, timeout?: number, message?: string): WebElementPromise;
  /**
 * wait until element by id exists or timeout
 */
  getByNativeId(id: string, timeout?: number, message?: string): WebElementPromise;
  /**
 * wait until element by class name exists or timeout
 */
  getByNativeclassName(className: string, timeout?: number, message?: string): WebElementPromise;
}

interface IWaitAndGet extends INativeWaitAndGet {
  /**
   * wait until element by locator exists or timeout
   */
  getBy(locator: Locator, timeout?: number, message?: string): WebElementPromise;
}

/**
 * @see https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md
 */
export interface IMobileJSONWireExtension {
  /**
   * A workaround before WebDriver supports Mobile JSONWire
   */
  enableMobileJSONWire(): void;
 
  getNetworkCondition(): Promise<NetworkConnectionParam>;
  setNetworkCondition(params: NetworkConnectionParam): Promise<NetworkConnectionParam>;
}

export interface IWebDriver2 extends IWaitAndGet, IMobileJSONWireExtension {
  // For user who want to customize the WebDriver create process
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
  enableMobileJSONWire() {
    configureMobileJSONWireExtension(this.getExecutor());
  }

  getNetworkCondition(): Promise<NetworkConnectionParam> {
    return this.execute<NetworkConnectionParam>(new Command(MobileJSONWireCommand.GET_NETWORK_CONDITION));
  }

  setNetworkCondition(params: NetworkConnectionParam) {
    return this.execute<NetworkConnectionParam>(
      new Command(MobileJSONWireCommand.SET_NETWORK_CONDITION)
        .setParameter('type', params.type));
  }

  /**
  *   @see WebDriver.wait
  */
  wait(condition: WebElementCondition, opt_timeout?: number | undefined, opt_message?: string | undefined): WebElementPromise {
    return this.seleniumDriver().wait(condition, opt_timeout, opt_message);
  }

  /**
*   @see WebDriver.wait
*/
  wait2<T>(condition: Function | PromiseLike<T> | Condition<T> | ((driver: WebDriver) => T | PromiseLike<T>), opt_timeout?: number | undefined, opt_message?: string | undefined): Promise<T> {
    return this.seleniumDriver().wait<T>(condition, opt_timeout, opt_message);
  }

  /**
*   @see WebDriver.sleep
*/
  sleep(ms: number): Promise<void> {
    return this.seleniumDriver().sleep(ms);
  }

  /**
*   @see WebDriver.execute
*/
  execute<T>(command: Command, description?: string | undefined): Promise<T> {
    return this.seleniumDriver().execute<T>(command, description);
  }

  /**
*   @see WebDriver.setFileDetector
*/
  setFileDetector(detector: FileDetector): void {
    return this.seleniumDriver().setFileDetector(detector);
  }

  /**
*   @see WebDriver.getExecutor
*/
  getExecutor(): Executor {
    return this.seleniumDriver().getExecutor();
  }

  /**
*   @see WebDriver.getSession
*/
  getSession(): Promise<Session> {
    return this.seleniumDriver().getSession();
  }

  /**
*   @see WebDriver.getCapabilities
*/
  getCapabilities(): Promise<Capabilities> {
    return this.seleniumDriver().getCapabilities();
  }

  /**
*   @see WebDriver.quit
*/
  quit(): Promise<void> {
    return this.stop();
  }

  /**
*   @see WebDriver.actions
*/
  actions(options?: { async: boolean; bridge: boolean; } | { async: boolean; } | { bridge: boolean; } | undefined): Actions {
    return this.seleniumDriver().actions(options);
  }

  /**
*   @see WebDriver.executeScript
*/
  executeScript<T>(script: string | Function, ...var_args: any[]): Promise<T> {
    return this.seleniumDriver().executeScript(script, var_args);
  }

  /**
*   @see WebDriver.executeAsyncScript
*/
  executeAsyncScript<T>(script: string | Function, ...var_args: any[]): Promise<T> {
    return this.seleniumDriver().executeAsyncScript<T>(script, var_args);
  }

  /**
*   @see WebDriver.getWindowHandle
*/
  getWindowHandle(): Promise<string> {
    return this.seleniumDriver().getWindowHandle();
  }

  /**
  *   @see WebDriver.getAllWindowHandles
  */
  getAllWindowHandles(): Promise<string[]> {
    return this.seleniumDriver().getAllWindowHandles();
  }

  /**
  *   @see WebDriver.getPageSource
  */
  getPageSource(): Promise<string> {
    return this.seleniumDriver().getPageSource();
  }

  /**
  *   @see WebDriver.close
  */
  close(): Promise<void> {
    return this.seleniumDriver().close();
  }

  /**
  *   @see WebDriver.get
  */
  get(url: string): Promise<void> {
    return this.seleniumDriver().get(url);
  }

  /**
  *   @see WebDriver.getCurrentUrl
  */
  getCurrentUrl(): Promise<string> {
    return this.seleniumDriver().getCurrentUrl();
  }

  /**
  *   @see WebDriver.getTitle
  */
  getTitle(): Promise<string> {
    return this.seleniumDriver().getTitle();
  }

  /**
  *   @see WebDriver.findElement
  */
  findElement(locator: Locator): WebElementPromise {
    return this.seleniumDriver().findElement(locator);
  }

  /**
  *   @see WebDriver.findElements
  */
  findElements(locator: Locator): Promise<WebElement[]> {
    return this.seleniumDriver().findElements(locator);
  }

  /**
  *   @see WebDriver.takeScreenshot
  */
  takeScreenshot(): Promise<string> {
    return this.seleniumDriver().takeScreenshot();
  }

  /**
  *   @see WebDriver.manage
  */
  manage(): Options {
    return this.seleniumDriver().manage();
  }

  /**
  *   @see WebDriver.navigate
  */
  navigate(): Navigation {
    return this.seleniumDriver().navigate();
  }

  /**
  *   @see WebDriver.switchTo
  */
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