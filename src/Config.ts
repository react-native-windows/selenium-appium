/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';

class Configuration {
  private waitforTimeout: number = 10000;
  private waitforPageTimeout: number = 30000;

  setWaitForTimeout(timeout: number) {
    this.waitforTimeout = timeout;
  }
  getWaitForTimeout(): number {
    return this.waitforTimeout;
  }

  setWaitforPageTimeout(timeout: number) {
    this.waitforPageTimeout = timeout;
  }
  getWaitforPageTimeout(): number {
    return this.waitforPageTimeout;
  }
};

export const Config = new Configuration();