/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';
import { By as SeleniumBy } from 'selenium-webdriver'

export class By {
  static id(id: string) {
    return new SeleniumBy('id', id);
  }

  static accessibilityId(id: string) {
    return new SeleniumBy('accessibility id', id);
  }

  // @ts-ignore: error TS2699: Static property 'name' conflicts with built-in property 'Function.name'
  static name(name: string) {
    return new SeleniumBy('name', name);
  }

  static className(name: string) {
    return new SeleniumBy('class name', name);
  }
}