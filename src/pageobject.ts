/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';

import { driver, WebDriver2 } from "./driver";
import { Config } from './config'

export class PageObject {
  private webDriver2_?: WebDriver2;
  get driver(): WebDriver2 {
    if (this.webDriver2_) {
      return this.webDriver2_;
    } else {
      return driver;
    }
  }
  constructor(webDriver2?: WebDriver2) {
    this.webDriver2_ = webDriver2;
  }

  isPageLoaded(): Promise<boolean> {
    throw new Error('Not implemented');
  }

  waitForPageLoaded(timeout?: number) {
    const theTimeout = timeout ? timeout : Config.getWaitForPageTimeout();
    return this.driver.wait2(
      () => {
        return this.isPageLoaded();
      },
      theTimeout,
      'Wait for page ' + this.constructor.name + ' timeout'
    );
  }
}