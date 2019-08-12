import { createAppiumWebDriver, windowsNativeAppCapabilities } from 'selenium-appium'
import { By } from 'selenium-webdriver'
jest.setTimeout(50000);

const calculatorAppId = 'Microsoft.WindowsCalculator_8wekyb3d8bbwe!App'
const driver = createAppiumWebDriver(windowsNativeAppCapabilities(calculatorAppId))

beforeAll(() => {
  return driver.start();
});

afterAll(() => {
  return driver.stop();
});

async function getCalculatorResultText() {
  const text = await driver.getByAccessibilityId('CalculatorResults').getText();
  return text.replace('Display is', '').trim();
}

describe('Addition', () => {
  // Applies only to tests in this describe block
  beforeEach(async () => {
    await driver.getByName('Clear').clear();
  });

  test('Addition', async () => {
    // Find the buttons by their names and click them in sequence to perform 1 + 7 = 8
    await driver.getByName('One').click();
    await driver.getByName('Plus').click();
    await driver.getByName('Seven').click();
    await driver.getByName('Equals').click();
    expect(await getCalculatorResultText()).toBe('8');
  });

  test('Division', async () => {
    // Find the buttons by their accessibility ids and click them in sequence to perform 88 / 11 = 8
    await driver.getByAccessibilityId('num8Button').click();
    await driver.getByAccessibilityId('num8Button').click();
    await driver.getByAccessibilityId('divideButton').click();
    await driver.getByAccessibilityId('num1Button').click();
    await driver.getByAccessibilityId('num1Button').click();
    await driver.getByAccessibilityId('equalButton').click();
    expect(await getCalculatorResultText()).toBe('8');
  });

  test('Multiplication', async () => {
    // Find the buttons by their names using XPath and click them in sequence to perform 9 x 9 = 81
    await driver.get(By.xpath("//Button[@Name='Nine']")).click();
    await driver.get(By.xpath("//Button[@Name='Multiply by']")).click();
    await driver.get(By.xpath("//Button[@Name='Nine']")).click();
    await driver.get(By.xpath("//Button[@Name='Equals']")).click();
    expect(await getCalculatorResultText()).toBe('81');
  });



  test('Subtraction', async () => {
    // Find the buttons by their accessibility ids using XPath and click them in sequence to perform 9 - 1 = 8
    await driver.get(By.xpath("//Button[@AutomationId=\"num9Button\"]")).click();
    await driver.get(By.xpath("//Button[@AutomationId=\"minusButton\"]")).click();
    await driver.get(By.xpath("//Button[@AutomationId=\"num1Button\"]")).click();
    await driver.get(By.xpath("//Button[@AutomationId=\"equalButton\"]")).click();
    expect(await getCalculatorResultText()).toBe('8');
  });
});