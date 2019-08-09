/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';
import { By } from 'selenium-webdriver'

export class By2 {
  static id(id: string) {
    return new By('id', id);
  }

  static accessibilityId(id: string) {
    return new By('accessibility id', id);
  }

  // @ts-ignore: error TS2699: Static property 'name' conflicts with built-in property 'Function.name'
  static name(name: string) {
    return new By('name', name);
  }

  static className(name: string) {
    return new By('class name', name);
  }
}