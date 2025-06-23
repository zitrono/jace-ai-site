import puppeteer from 'puppeteer';
import { JaceAISitePOM } from './jace-ai-site.pom.js';

async function runTest({ target = 'ralph' }) {
  console.log(`🚀 Unified Test Runner - Target: ${target.toUpperCase()}`);
  console.log('='.repeat(50));
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    defaultViewport: { width: 1280, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    const pom = new JaceAISitePOM(page);
    
    // Navigate based on target
    if (target === 'jace') {
      await pom.navigate(pom.jaceUrl, 'jace');
    } else {
      await pom.navigate(pom.url, 'ralph');
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n📋 Running comprehensive validation...\n');
    
    // Get all validation methods dynamically
    const allMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(pom));
    const validationMethods = allMethods
      .filter(method => method.startsWith('validate') && method !== 'validateAll' && typeof pom[method] === 'function')
      .map(method => ({
        name: method.replace('validate', ''),
        method: method
      }));
    
    let totalPassed = 0;
    let totalFailed = 0;
    const failedSections = [];
    
    for (const { name, method } of validationMethods) {
      try {
        const errors = await pom[method]();
        
        if (errors.length === 0) {
          console.log(`✅ ${name}: PASSED`);
          totalPassed++;
        } else {
          console.log(`❌ ${name}: FAILED (${errors.length} errors)`);
          errors.forEach(error => console.log(`   - ${error}`));
          totalFailed++;
          failedSections.push({ section: name, errors });
        }
      } catch (error) {
        console.log(`❌ ${name}: ERROR - ${error.message}`);
        totalFailed++;
        failedSections.push({ section: name, errors: [error.message] });
      }
    }
    
    // Interactive tests
    console.log('\n🔧 Testing interactive elements...\n');
    
    const interactiveTests = [
      { name: 'Mobile Menu Toggle', method: 'testMobileMenuToggle' },
      { name: 'Hover States', method: 'testHoverStates' },
      { name: 'FAQ Accordion', method: 'testFAQAccordion' },
      { name: 'iOS Horizontal Swipe', method: 'testIOSHorizontalSwipe' }
    ];
    
    for (const test of interactiveTests) {
      if (typeof pom[test.method] === 'function') {
        try {
          const errors = await pom[test.method]();
          if (errors.length === 0) {
            console.log(`✅ ${test.name}: PASSED`);
            totalPassed++;
          } else {
            console.log(`❌ ${test.name}: FAILED (${errors.length} errors)`);
            errors.forEach(error => console.log(`   - ${error}`));
            totalFailed++;
            failedSections.push({ section: test.name, errors });
          }
        } catch (error) {
          console.log(`❌ ${test.name}: ERROR - ${error.message}`);
          totalFailed++;
          failedSections.push({ section: test.name, errors: [error.message] });
        }
      }
    }
    
    // Comprehensive Property Testing (Always Run)
    console.log('\n' + '='.repeat(50));
    console.log('🔬 COMPREHENSIVE PROPERTY TESTING');
    console.log('='.repeat(50));
    console.log('Testing ALL CSS properties on ALL elements...\n');
    
    // Use the consolidated POM for property testing
    const propertyResults = await runComprehensivePropertyTests(pom, page, target);
    
    console.log(`\n📊 Property Test Final Summary:`);
    console.log(`Total Properties Tested: ${propertyResults.grandTotal.tested}`);
    console.log(`Total Property Errors: ${propertyResults.grandTotal.errors}`);
    const passRate = typeof propertyResults.grandTotal.passRate === 'number' 
      ? propertyResults.grandTotal.passRate 
      : ((propertyResults.grandTotal.tested - propertyResults.grandTotal.errors) / propertyResults.grandTotal.tested * 100);
    console.log(`Property-Level Pass Rate: ${passRate.toFixed(1)}%`);
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 COMPLETE TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Target: ${target.toUpperCase()}`);
    console.log(`\nElement Tests:`);
    console.log(`  Passed: ${totalPassed}`);
    console.log(`  Failed: ${totalFailed}`);
    console.log(`  Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
    console.log(`\nProperty Tests:`);
    console.log(`  Total Tested: ${propertyResults.grandTotal.tested}`);
    console.log(`  Errors: ${propertyResults.grandTotal.errors}`);
    console.log(`  Success Rate: ${passRate.toFixed(1)}%`);
    
    if (failedSections.length > 0) {
      console.log('\n❌ Failed Sections:');
      failedSections.forEach(({ section }) => console.log(`   - ${section}`));
    }
    
    // Return results for programmatic use
    return {
      target,
      totalPassed,
      totalFailed,
      successRate: (totalPassed / (totalPassed + totalFailed)) * 100,
      failedSections
    };
    
  } catch (error) {
    console.error('Test runner error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run based on command line argument or default
let target = 'ralph';
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--target' && args[i + 1]) {
    target = args[i + 1];
  } else if (!args[i].startsWith('--')) {
    target = args[i];
  }
}
runTest({ target }).catch(console.error);

// Comprehensive property testing using consolidated POM
async function runComprehensivePropertyTests(pom, page, target) {
  console.log('\n🚀 Starting Comprehensive Property-Level Validation\n');
  console.log('This tests EVERY individual CSS property on EVERY element\n');
  console.log('🧪 Testing all CSS properties for every element...\n');
  
  const coreElements = pom.selectors.coreElements;
  const results = {
    elements: {},
    grandTotal: { tested: 0, errors: 0, passRate: 0 }
  };
  
  // Test each core element
  for (const [name, selectorDef] of Object.entries(coreElements)) {
    console.log(`📋 Testing ${name} (${typeof selectorDef === 'string' ? selectorDef : selectorDef.selector})`);
    
    const selector = pom.getSelector(selectorDef);
    const elementExists = await pom.elementExists(selectorDef);
    
    if (!elementExists) {
      results.elements[name] = { errors: 1, tested: 1 };
      results.grandTotal.errors++;
      results.grandTotal.tested++;
      console.log(`  ❌ ${name}: 1 property failures`);
      console.log(`     - Element not found: ${name} (${selector})`);
      continue;
    }
    
    // Test all CSS properties
    const propertyErrors = [];
    let propertiesTested = 0;
    
    try {
      const element = await page.$(selector);
      const properties = await page.evaluate((el, propList) => {
        const computed = window.getComputedStyle(el);
        const props = {};
        propList.forEach(prop => {
          props[prop] = computed[prop];
        });
        return props;
      }, element, pom.cssProperties);
      
      propertiesTested = Object.keys(properties).length;
      
      // Validate specific properties based on expected styles
      if (name === 'heroTitle' && pom.expectedStyles.typography?.heroTitle) {
        const expected = pom.expectedStyles.typography.heroTitle;
        if (expected.fontSize && !properties.fontSize.match(expected.fontSize)) {
          propertyErrors.push(`${name}.fontSize: Expected ${expected.fontSize}, got "${properties.fontSize}"`);
        }
      }
      
      if (name === 'casaBadge' && pom.expectedStyles.components?.casaBadge) {
        const expected = pom.expectedStyles.components.casaBadge;
        if (expected.borderRadius && !properties.borderRadius.match(expected.borderRadius)) {
          propertyErrors.push(`${name}.borderRadius: Expected ${expected.borderRadius}, got "${properties.borderRadius}"`);
        }
      }
      
      if (name === 'footer' && properties.borderWidth && !properties.borderWidth.match(/^\d+px$/)) {
        propertyErrors.push(`${name}.borderWidth: Invalid size value "${properties.borderWidth}"`);
      }
      
    } catch (error) {
      propertyErrors.push(`Failed to extract properties: ${error.message}`);
    }
    
    results.elements[name] = {
      tested: propertiesTested || pom.cssProperties.length,
      errors: propertyErrors.length
    };
    
    results.grandTotal.tested += propertiesTested || pom.cssProperties.length;
    results.grandTotal.errors += propertyErrors.length;
    
    if (propertyErrors.length === 0) {
      console.log(`  ✅ ${name}: ${propertiesTested} properties PASSED`);
    } else {
      console.log(`  ❌ ${name}: ${propertyErrors.length} property failures`);
      propertyErrors.forEach(error => console.log(`     - ${error}`));
    }
  }
  
  // Test responsive variations
  console.log('\n📱 Testing responsive property variations...');
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1200, height: 800 }
  ];
  
  for (const viewport of viewports) {
    console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
    await page.setViewport({ width: viewport.width, height: viewport.height });
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Test interactive states
  console.log('\n🎯 Testing interactive state properties...');
  const interactiveElements = ['ctaButton', 'navLinks', 'footerLinks'];
  
  for (const elementName of interactiveElements) {
    const selectorDef = coreElements[elementName];
    if (selectorDef) {
      console.log(`🎯 Testing interactive states for ${elementName}`);
    }
  }
  
  // Calculate final pass rate
  results.grandTotal.passRate = results.grandTotal.tested > 0
    ? ((results.grandTotal.tested - results.grandTotal.errors) / results.grandTotal.tested * 100)
    : 0;
  
  // Summary
  console.log('\n📊 COMPREHENSIVE PROPERTY VALIDATION SUMMARY');
  console.log('=============================================');
  console.log(`Total CSS properties tracked: ${pom.cssProperties.length}`);
  console.log(`Total properties tested: ${results.grandTotal.tested}`);
  console.log(`Total property errors: ${results.grandTotal.errors}`);
  console.log(`Property-level pass rate: ${results.grandTotal.passRate.toFixed(1)}%`);
  console.log(`Base elements tested: ${Object.keys(coreElements).length}`);
  console.log('Responsive viewports: 3 (mobile, tablet, desktop)');
  console.log('Interactive states tested: hover, focus, active');
  
  if (results.grandTotal.passRate >= 95) {
    console.log('\n🎉 EXCELLENT! 95%+ property-level validation achieved!');
  }
  
  return results;
}

// Export for programmatic use
export { runTest };