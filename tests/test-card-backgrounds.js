// Test Card Background Fix
import puppeteer from 'puppeteer';
import { StrictParityPOM } from './strict-parity.pom.js';

async function testCardBackgrounds() {
  console.log('🎨 Testing Card Background Fix...\n');
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Test refactor implementation
  console.log('🔍 Testing Astro Refactor Implementation...');
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
  
  const pom = new StrictParityPOM(page);
  
  // Run card background validation
  const cardErrors = await pom.validateCardBackgrounds();
  
  console.log('\n📊 Card Background Validation Results:');
  if (cardErrors.length === 0) {
    console.log('✅ All card backgrounds pass validation!');
  } else {
    console.log('❌ Card background issues found:');
    cardErrors.forEach(error => console.log(`   - ${error}`));
  }
  
  // Also run full validation to ensure nothing was broken
  console.log('\n🔍 Running Full POM Validation...');
  const allPassed = await pom.runAllValidations();
  
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('                        FINAL RESULTS                         ');
  console.log('══════════════════════════════════════════════════════════════');
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED - Card backgrounds successfully fixed!');
  } else {
    console.log('❌ Some tests failed - review validation results above');
  }
  
  await browser.close();
  return allPassed;
}

testCardBackgrounds().catch(console.error);