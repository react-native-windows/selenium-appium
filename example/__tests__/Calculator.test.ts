/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { driver, By2, windowsAppDriverCapabilities } from 'selenium-appium'

jest.setTimeout(50000);

const calculatorAppId = 'Microsoft.WindowsCalculator_8wekyb3d8bbwe!App'
const capabilites = windowsAppDriverCapabilities(calculatorAppId)

beforeAll(() => {
  return driver.startWithCapabilities(capabilites); 
});

afterAll(() => {
  return driver.quit();
});

async function getCalculatorResultText() {
  const text = await By2.nativeAccessibilityId('CalculatorResults').getText();
  return text.replace('Display is', '').trim();
}

describe('Addition', () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return By2.nativeName('Clear').clear();
  });
  test('Addition', async () => {
    // Find the buttons by their names and click them in sequence to perform 1 + 7 = 8
    await By2.nativeName('One').click();
    await By2.nativeName('Plus').click();
    await By2.nativeName('Seven').click();
    await By2.nativeName('Equals').click();
    expect(await getCalculatorResultText()).toBe('8');
  });

  test('Division', async () => {
    // Find the buttons by their accessibility ids and click them in sequence to perform 88 / 11 = 8
    await By2.nativeAccessibilityId('num8Button').click();
    await By2.nativeAccessibilityId('num8Button').click();
    await By2.nativeAccessibilityId('divideButton').click();
    await By2.nativeAccessibilityId('num1Button').click();
    await By2.nativeAccessibilityId('num1Button').click();
    await By2.nativeAccessibilityId('equalButton').click();
    expect(await getCalculatorResultText()).toBe('8');
  });

  test('Multiplication', async () => {
    // Find the buttons by their names using XPath and click them in sequence to perform 9 x 9 = 81
    await By2.nativeXpath("//Button[@Name='Nine']").click();
    await By2.nativeXpath("//Button[@Name='Multiply by']").click();
    await By2.nativeXpath("//Button[@Name='Nine']").click();
    await By2.nativeXpath("//Button[@Name='Equals']").click();
    expect(await getCalculatorResultText()).toBe('81');
  });



  test('Subtraction', async () => {
    // Find the buttons by their accessibility ids using XPath and click them in sequence to perform 9 - 1 = 8
    await By2.nativeXpath("//Button[@AutomationId=\"num9Button\"]").click();
    await By2.nativeXpath("//Button[@AutomationId=\"minusButton\"]").click();
    await By2.nativeXpath("//Button[@AutomationId=\"num1Button\"]").click();
    await By2.nativeXpath("//Button[@AutomationId=\"equalButton\"]").click();
    expect(await getCalculatorResultText()).toBe('8');
  });
});