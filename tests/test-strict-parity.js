// Test script for strict design parity
import puppeteer from 'puppeteer';
import { StrictParityPOM } from './strict-parity.pom.js';

async function testStrictParity() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const pom = new StrictParityPOM(page);

  console.log('🎯 Testing strict design parity on refactor site...\n');
  
  // Navigate to refactor site
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
  
  // Run all validations
  const success = await pom.runAllValidations();
  
  if (!success) {
    console.log('\n⚠️  Design parity issues found. The refactor must match the original exactly.');
  } else {
    console.log('\n✅ Perfect design parity achieved!');
  }

  await browser.close();
  process.exit(success ? 0 : 1);
}

testStrictParity().catch(console.error);