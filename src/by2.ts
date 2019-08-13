/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

'use strict';
import { By } from 'selenium-webdriver'

export class  By2 extends By {
  static nativeId(id: string) {
    return new By('id', id);
  }

  static nativeAccessibilityId(id: string) {
    return new By('accessibility id', id);
  }

  // @ts-ignore: error TS2699: Static property 'name' conflicts with built-in property 'Function.name'
  static nativeName(name: string) {
    return new By('name', name);
  }

  static nativeClassName(name: string) {
    return new By('class name', name);
  }
}