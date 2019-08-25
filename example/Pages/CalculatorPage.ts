/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PageObject, By2 } from "selenium-appium";

class CalculatorPage extends PageObject {
  isPageLoaded() {
    return this.minusButton.isDisplayed();
  }

  get resultTextBox() { return By2.nativeAccessibilityId('CalculatorResults');}
  get equalButton() { return By2.nativeAccessibilityId('equalButton'); }
  get clearButton() { return By2.nativeName('Clear'); }
  get plusButton() { return By2.nativeName('Plus'); }
  get divideButton() { return By2.nativeAccessibilityId('divideButton'); }
  get multiplyButton() { return By2.nativeXpath("//Button[@Name='Multiply by']") }
  get minusButton() { return By2.nativeXpath("//Button[@AutomationId=\"minusButton\"]"); }
  get button0() { return By2.nativeAccessibilityId('num0Button'); }
  get button1() { return By2.nativeAccessibilityId('num1Button'); }
  get button2() { return By2.nativeAccessibilityId('num2Button'); }
  get button3() { return By2.nativeAccessibilityId('num3Button'); }
  get button4() { return By2.nativeAccessibilityId('num4Button'); }
  get button5() { return By2.nativeAccessibilityId('num5Button'); }
  get button6() { return By2.nativeAccessibilityId('num6Button'); }
  get button7() { return By2.nativeAccessibilityId('num7Button'); }
  get button8() { return By2.nativeAccessibilityId('num8Button'); }
  get button9() { return By2.nativeAccessibilityId('num9Button'); }

  private async pressKeys(keys: string) {
    for (var key of keys) {
      await By2.nativeAccessibilityId('num' + key + 'Button').click();
    }
  }
  async divid(a: string, b: string): Promise<string> {
    await this.pressKeys(a);
    await this.divideButton.click();
    await this.pressKeys(b);
    await this.equalButton.click();
    return await this.getCalculatorResultText();
  }

  async multiply(a: string, b: string): Promise<string> {
    await this.pressKeys(a);
    await this.multiplyButton.click();
    await this.pressKeys(b);
    await this.equalButton.click();
    return await this.getCalculatorResultText();
  }

  async plus(a: string, b: string): Promise<string> {
    await this.pressKeys(a);
    await this.plusButton.click();
    await this.pressKeys(b);
    await this.equalButton.click();
    return await this.getCalculatorResultText();
  }

  async minus(a: string, b: string): Promise<string> {
    await this.pressKeys(a);
    await this.minusButton.click();
    await this.pressKeys(b);
    await this.equalButton.click();
    return await this.getCalculatorResultText();
  }

  private async getCalculatorResultText(): Promise<string> {
    return (await this.resultTextBox.getText()).replace('Display is', '').trim();
  }
  
}

export default new CalculatorPage();