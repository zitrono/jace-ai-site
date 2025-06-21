// Comprehensive validation script that tests every individual CSS property
import puppeteer from 'puppeteer';
import { ComprehensivePropertyPOM } from './comprehensive-property.pom.js';

const JACE_AI_URL = 'https://jace.ai';

async function validateAllProperties() {
  console.log('🎯 Comprehensive Property-Level Validation for jace.ai\n');
  console.log('Testing EVERY individual CSS property on EVERY element');
  console.log('Expected: 3000+ individual property tests\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    const pom = new ComprehensivePropertyPOM(page);
    
    await pom.navigate();
    console.log(`✅ Navigated to ${JACE_AI_URL}\n`);
    
    // Wait for page to fully load
    await page.waitForSelector('h1', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Run comprehensive property validation
    const results = await pom.validateComprehensive();
    
    // Detailed reporting
    console.log('\n📋 DETAILED RESULTS BY ELEMENT:');
    console.log('================================');
    
    Object.entries(results.baseResults.results).forEach(([elementName, result]) => {
      const status = result.errors.length === 0 ? '✅' : '❌';
      console.log(`${status} ${elementName.padEnd(15)}: ${result.tested} properties tested, ${result.errors.length} errors`);
      
      if (result.errors.length > 0 && result.errors.length <= 5) {
        result.errors.forEach(error => console.log(`    - ${error}`));
      } else if (result.errors.length > 5) {
        result.errors.slice(0, 3).forEach(error => console.log(`    - ${error}`));
        console.log(`    ... and ${result.errors.length - 3} more errors`);
      }
    });
    
    // Responsive results summary
    console.log('\n📱 RESPONSIVE TESTING SUMMARY:');
    console.log('==============================');
    Object.entries(results.responsiveResults).forEach(([viewport, elements]) => {
      let viewportErrors = 0;
      let viewportTested = 0;
      
      Object.values(elements).forEach(result => {
        viewportErrors += result.errors.length;
        viewportTested += result.tested;
      });
      
      const viewportPassRate = ((viewportTested - viewportErrors) / viewportTested * 100).toFixed(1);
      console.log(`📱 ${viewport.padEnd(8)}: ${viewportTested} properties, ${viewportErrors} errors (${viewportPassRate}% pass rate)`);
    });
    
    // Interactive states summary
    console.log('\n🎯 INTERACTIVE STATES SUMMARY:');
    console.log('==============================');
    Object.entries(results.interactiveResults).forEach(([element, states]) => {
      console.log(`🎯 ${element}:`);
      Object.entries(states).forEach(([state, result]) => {
        const statePassRate = ((result.tested - result.errors.length) / result.tested * 100).toFixed(1);
        console.log(`   ${state}: ${result.tested} properties, ${result.errors.length} errors (${statePassRate}% pass rate)`);
      });
    });
    
    // Final comprehensive summary
    console.log('\n🏆 FINAL COMPREHENSIVE SUMMARY:');
    console.log('===============================');
    console.log(`Total CSS properties: ${results.grandTotal.properties}`);
    console.log(`Properties tested: ${results.grandTotal.tested}`);
    console.log(`Property test errors: ${results.grandTotal.errors}`);
    console.log(`Overall pass rate: ${results.grandTotal.passRate}%`);
    
    // Property coverage breakdown
    const avgPropsPerElement = (results.grandTotal.properties / Object.keys(results.baseResults.results).length).toFixed(0);
    console.log(`Average properties per element: ${avgPropsPerElement}`);
    console.log(`Elements tested: ${Object.keys(results.baseResults.results).length}`);
    console.log(`Responsive viewports: 3`);
    console.log(`Interactive states: hover, focus, active`);
    
    // Success criteria
    if (results.grandTotal.passRate >= 95) {
      console.log('\n🎉 OUTSTANDING! 95%+ property-level validation achieved!');
      console.log('Every CSS property is properly validated and tested.');
    } else if (results.grandTotal.passRate >= 90) {
      console.log('\n✅ EXCELLENT! 90%+ property-level validation achieved!');
      console.log('Nearly all CSS properties are properly validated.');
    } else if (results.grandTotal.passRate >= 80) {
      console.log('\n👍 GOOD! 80%+ property-level validation achieved!');
      console.log('Most CSS properties are properly validated.');
    } else {
      console.log('\n⚠️  Property-level validation needs improvement');
      console.log('Many CSS properties need attention.');
    }
    
    // Compare with previous selector-only approach
    console.log('\n📊 COMPARISON WITH PREVIOUS APPROACH:');
    console.log('====================================');
    console.log('Previous approach: 103 selectors, 28 test methods');
    console.log(`New approach: ${results.grandTotal.properties} individual properties tested`);
    console.log(`Improvement: ${(results.grandTotal.properties / 103).toFixed(0)}x more granular testing`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Comprehensive property validation failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Count total testable properties for reporting
async function countTotalProperties() {
  console.log('📊 Counting total testable properties...\n');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const pom = new ComprehensivePropertyPOM(page);
  
  await pom.navigate();
  await page.waitForSelector('h1', { timeout: 10000 });
  
  let totalCount = 0;
  const breakdown = {};
  
  for (const [elementName, selector] of Object.entries(pom.coreSelectors)) {
    const properties = await pom.extractAllProperties(selector);
    if (properties) {
      breakdown[elementName] = properties.propertyCount;
      totalCount += properties.propertyCount;
    }
  }
  
  await browser.close();
  
  console.log('📋 Property count by element:');
  Object.entries(breakdown).forEach(([element, count]) => {
    console.log(`${element.padEnd(15)}: ${count} properties`);
  });
  console.log('=====================================');
  console.log(`TOTAL PROPERTIES: ${totalCount}`);
  
  // Add responsive and interactive multipliers
  const responsiveMultiplier = 3; // 3 viewports
  const interactiveMultiplier = 2; // hover + focus states for key elements
  const interactiveElements = 3; // buttons, nav links, footer links
  
  const responsiveProperties = totalCount * responsiveMultiplier;
  const interactiveProperties = breakdown.ctaButton * interactiveMultiplier * interactiveElements;
  const grandTotal = totalCount + responsiveProperties + interactiveProperties;
  
  console.log(`\nWith responsive testing: +${responsiveProperties}`);
  console.log(`With interactive states: +${interactiveProperties}`);
  console.log(`GRAND TOTAL TESTABLE: ${grandTotal} individual CSS properties`);
  
  return { totalCount, grandTotal, breakdown };
}

// Run the validation
(async () => {
  console.log('🚀 Starting Comprehensive Property-Level Testing\n');
  console.log('This approach tests every individual CSS property instead of just selectors');
  console.log('Expected outcome: 3000+ individual property tests with detailed validation\n');
  
  try {
    // First count what we're about to test
    const counts = await countTotalProperties();
    
    console.log('\n' + '='.repeat(60));
    console.log('Starting comprehensive validation...\n');
    
    // Run the actual validation
    const results = await validateAllProperties();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 MISSION ACCOMPLISHED!');
    console.log(`Successfully tested ${results.grandTotal.tested} individual CSS properties`);
    console.log(`Achieved ${results.grandTotal.passRate}% property-level validation`);
    
    if (parseFloat(results.grandTotal.passRate) >= 90) {
      console.log('\n🏆 PROPERTY-LEVEL TESTING EXCELLENCE ACHIEVED!');
      process.exit(0);
    } else {
      console.log('\n📈 Property-level testing established with room for improvement');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Comprehensive property validation failed:', error);
    process.exit(1);
  }
})();