/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';

export function windowsNativeAppCapabilities(appName: string) {
  return {
    browserName: '',
    platformName: 'windows',
    deviceName: 'WindowsPC',
    app: appName
  }
};