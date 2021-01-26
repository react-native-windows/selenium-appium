/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';

class Configuration {
  private waitforTimeout = 10000;
  private waitforPageTimeout = 30000;

  setWaitForTimeout(timeout: number) {
    this.waitforTimeout = timeout;
  }
  getWaitForTimeout(): number {
    return this.waitforTimeout;
  }

  setWaitForPageTimeout(timeout: number) {
    this.waitforPageTimeout = timeout;
  }
  getWaitForPageTimeout(): number {
    return this.waitforPageTimeout;
  }
}

export const Config = new Configuration();