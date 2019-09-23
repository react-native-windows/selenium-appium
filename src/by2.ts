/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';

import { By, Locator, WebDriver, ISize, IRectangle, ILocation, until, IWebElementId, WebElement, WebElementPromise, ThenableWebDriver, FileDetector, Session, Actions, WebElementCondition, Condition, Options, Navigation, TargetLocator } from 'selenium-webdriver'
import { driver, WebDriver2 } from './driver'
import { Config } from './config'

interface IWebElement extends WebElement {

}

interface IBy extends By { }

export class By2 implements IWebElement, IBy {
  using: string;
  value: string;
  toString(): string {
    // The static By.name() overrides this.constructor.name.  Shame...
    return `By2(${this.using}, ${this.value}, ${this.webDriver2_})`;
  }

  private get webElement(): WebElementPromise {
    const webDriver = this.webDriver2_ ? this.webDriver2_ : driver;
    try {
      return webDriver.wait(
        until.elementLocated(this),
        Config.getWaitForTimeout(),
        'Timeout in By2: ' + this.toString(),
      );
    } catch (e) {
      return new WebElementPromise(webDriver, Promise.reject(e));
    }
  }

  getDriver(): WebDriver {
    return this.webElement.getDriver();
  }
  getId(): Promise<string> {
    return this.webElement.getId();
  }
  findElement(locator: Locator): WebElementPromise {
    return this.webElement.findElement(locator);
  }
  findElements(locator: Locator): Promise<WebElement[]> {
    return this.webElement.findElements(locator);
  }

  click(): Promise<void> {
    return this.webElement.click();
  }
  sendKeys(...var_args: (string | number | Promise<string | number>)[]): Promise<void> {
    return this.webElement.sendKeys(...var_args);
  }
  getTagName(): Promise<string> {
    return this.webElement.getTagName();
  }
  getCssValue(cssStyleProperty: string): Promise<string> {
    return this.webElement.getCssValue(cssStyleProperty);
  }
  getAttribute(attributeName: string): Promise<string> {
    return this.webElement.getAttribute(attributeName);
  }
  getText(): Promise<string> {
    return this.webElement.getText();
  }
  getSize(): Promise<ISize> {
    return this.webElement.getSize();
  }
  getRect(): Promise<IRectangle> {
    return this.webElement.getRect();
  }
  getLocation(): Promise<ILocation> {
    return this.webElement.getLocation();
  }
  isEnabled(): Promise<boolean> {
    return this.webElement.isEnabled();
  }
  isSelected(): Promise<boolean> {
    return this.webElement.isSelected();
  }
  submit(): Promise<void> {
    return this.webElement.submit();
  }
  clear(): Promise<void> {
    return this.webElement.clear();
  }
  isDisplayed(): Promise<boolean> {
    return this.webElement.isDisplayed();
  }
  takeScreenshot(opt_scroll?: boolean): Promise<string> {
    return this.webElement.takeScreenshot(opt_scroll);
  }
  serialize(): Promise<IWebElementId> {
    return this.webElement.serialize();
  }

  private webDriver2_?: WebDriver2;
  constructor(using: string, value: string, webDriver2?: WebDriver2) {
    this.using = using;
    this.value = value;
    this.webDriver2_ = webDriver2;
  }

  /**
   * Locates elements that have a specific class name.
   *
   * @param {string} name The class name to search for.
   * @return {!By} The new locator.
   * @see http://www.w3.org/TR/2011/WD-html5-20110525/elements.html#classes
   * @see http://www.w3.org/TR/CSS2/selector.html#class-html
   */
  static className(name: string, webDriver2?: WebDriver2): By2 {
    return By2.from(By.className(name), webDriver2);
  }

  /**
   * Locates elements using a CSS selector.
   *
   * @param {string} selector The CSS selector to use.
   * @return {!By} The new locator.
   * @see http://www.w3.org/TR/CSS2/selector.html
   */
  static css(selector: string, webDriver2?: WebDriver2): By2 {
    return By2.from(By.css(selector), webDriver2);
  }

  /**
   * Locates eleemnts by the ID attribute. This locator uses the CSS selector
   * `*[id='$ID']`, _not_ `document.getElementById`.
   *
   * @param {string} id The ID to search for.
   * @return {!By} The new locator.
   */
  static id(id: string, webDriver2?: WebDriver2): By2 {
    return By2.from(By.id(id), webDriver2);
  }

  /**
   * Locates link elements whose
   * {@linkplain WebElement#getText visible text} matches the given
   * string.
   *
   * @param {string} text The link text to search for.
   * @return {!By} The new locator.
   */
  static linkText(text: string, webDriver2?: WebDriver2): By2 {
    return By2.from(By.linkText(text), webDriver2);
  }

  /**
   * Locates elements whose `name` attribute has the given value. This locator uses the CSS selector
   *
   * @param {string} name The name attribute to search for.
   * @return {!By} The new locator.
   */
  static name2(name: string, webDriver2?: WebDriver2): By2 {
    return By2.from(By.name(name), webDriver2);
  }

  /**
   * Locates link elements whose
   * {@linkplain WebElement#getText visible text} contains the given
   * substring.
   *
   * @param {string} text The substring to check for in a link's visible text.
   * @return {!By} The new locator.
   */
  static partialLinkText(text: string, webDriver2?: WebDriver2): By2 {
    return By2.from(By.partialLinkText(text), webDriver2);
  }

  /**
   * Locates elements with a given tag name. This locator uses the CSS selector
   *
   * @param {string} name The tag name to search for.
   * @return {!By} The new locator.
   * @deprecated Use {@link By.css() By.css(tagName)} instead.
   */
  static tagName(name: string, webDriver2?: WebDriver2): By2 {
    return By2.from(By.tagName(name), webDriver2);
  }

  /**
   * Locates elements matching a XPath selector. Care should be taken when
   * using an XPath selector with a {@link WebElement} as WebDriver
   * will respect the context in the specified in the selector. For example,
   * given the selector `//div`, WebDriver will search from the document root
   * regardless of whether the locator was used with a WebElement.
   *
   * @param {string} xpath The XPath selector to use.
   * @return {!By} The new locator.
   * @see http://www.w3.org/TR/xpath/
   */
  static xpath(xpath: string, webDriver2?: WebDriver2): By2 {
    return By2.from(By.xpath(xpath), webDriver2);
  }

  static from(by: By, webDriver2?: WebDriver2): By2 {
    return new By2(by.using, by.value, webDriver2);
  }

  /**
   * "using": "name", only for WinAppDriver
   * @param name 
   * @param webDriver2 
   */
  static nativeName(name: string, webDriver2?: WebDriver2): By2 {
    return new By2('name', name, webDriver2);
  }

  /**
   * "using": "class name"
   * @see https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#locator-strategies
   * @param className 
   * @param webDriver2 
   */
  static nativeClassName(className: string, webDriver2?: WebDriver2): By2 {
    return new By2('class name', className, webDriver2);
  }

  /**
   * "using": "accessibility id"
   * @see https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#locator-strategies
   * @param accessibilityId 
   * @param webDriver2 
   */
  static nativeAccessibilityId(accessibilityId: string, webDriver2?: WebDriver2): By2 {
    return new By2('accessibility id', accessibilityId, webDriver2);
  }

  /**
   * "using": "xpath"
   * @see https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#locator-strategies
   * @param xpath 
   * @param webDriver2 
   */
  static nativeXpath(xpath: string, webDriver2?: WebDriver2): By2 {
    return new By2('xpath', xpath, webDriver2);
  }

  /**
   * "using": "id"
   * @see https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#locator-strategies
   * @param id 
   * @param webDriver2 
   */
  static nativeId(id: string, webDriver2?: WebDriver2): By2 {
    return new By2('id', id, webDriver2);
  }

  /**
   * "using": "-android uiautomator"
   * @see https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#locator-strategies
   * @param uiautomator 
   * @param webDriver2 
   */
  static nativeAndriod(uiautomator: string, webDriver2?: WebDriver2): By2 {
    return new By2('-android uiautomator', uiautomator, webDriver2)
  }

  /** "using": "-ios uiautomator"
   * @see https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#locator-strategies
   * @param uiautomator 
   * @param webDriver2 
   */
  static nativeIos(uiautomator: string, webDriver2?: WebDriver2): By2 {
    return new By2('-ios uiautomation', uiautomator, webDriver2);
  }
}