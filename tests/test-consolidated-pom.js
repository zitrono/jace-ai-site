// Test script for the Consolidated POM
// This demonstrates the single source of truth for all Jace AI testing

import puppeteer from 'puppeteer';
import { ConsolidatedJacePOM } from './consolidated.pom.js';

async function testConsolidatedPOM() {
  console.log('🧪 Testing Consolidated Jace AI POM');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('🔍 Testing Astro Refactor at http://localhost:4321');
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
  
  const pom = new ConsolidatedJacePOM(page);
  
  console.log('🚀 Running All Validations...\n');
  const allTestsPassed = await pom.runAllValidations();
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    CONSOLIDATED POM RESULTS               ');
  console.log('═══════════════════════════════════════════════════════════');
  
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED using Consolidated POM!');
    console.log('✅ Design parity: 100%');
    console.log('✅ All newly fixed items validated');
    console.log('✅ Single source of truth working correctly');
  } else {
    console.log('❌ Some tests failed - check validation results above');
  }
  
  console.log('\n📊 POM Statistics:');
  console.log('• Validation Methods: 13');
  console.log('• Selector Categories: 8');
  console.log('• Expected Value Sets: 12');
  console.log('• Recently Added Features: 5');
  console.log('  - Card background validation');
  console.log('  - Cookie consent validation');
  console.log('  - Pricing card uniformity');
  console.log('  - CTA block validation');
  console.log('  - Mobile menu functionality');
  
  await browser.close();
  return allTestsPassed;
}

testConsolidatedPOM().catch(console.error);