/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { driver, By2, windowsAppDriverCapabilities } from 'selenium-appium'
import CalculatorPage from '../Pages/CalculatorPage'

jest.setTimeout(50000);

const calculatorAppId = 'Microsoft.WindowsCalculator_8wekyb3d8bbwe!App'
const capabilites = windowsAppDriverCapabilities(calculatorAppId)

beforeAll(() => {
  return driver.startWithCapabilities(capabilites);
});

afterAll(() => {
  return driver.quit();
});


describe('Calulator Test', () => {
  // Applies only to tests in this describe block
  beforeEach(async () => {
    await CalculatorPage.waitForPageLoaded();
    await CalculatorPage.clearButton.clear();
  });
  test('Addition', async () => {
    // Find the buttons by their names and click them in sequence to perform 1 + 7 = 8
    expect(await CalculatorPage.plus('1', '7')).toBe('8');
  });

  test('Division', async () => {
    // Find the buttons by their accessibility ids and click them in sequence to perform 88 / 11 = 8
    expect(await CalculatorPage.divid('88', '11')).toBe('8');
  });

  test('Multiplication', async () => {
    // Find the buttons by their names using XPath and click them in sequence to perform 9 x 9 = 81
    expect(await CalculatorPage.multiply('9', '9')).toBe('81');
  });

  test('Subtraction', async () => {
    // Find the buttons by their accessibility ids using XPath and click them in sequence to perform 9 - 1 = 8
    expect(await CalculatorPage.minus('9', '1')).toBe('8');
  });
});