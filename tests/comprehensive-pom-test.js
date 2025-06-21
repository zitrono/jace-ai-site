import puppeteer from 'puppeteer';
import { JaceAISitePOM } from './jace-ai-site.pom.js';

async function comprehensivePOMTest() {
  const browser = await puppeteer.launch({ headless: 'new' });
  
  console.log('🔍 COMPREHENSIVE POM TEST - Testing All Elements Including New Additions...\n');
  
  try {
    // Test both viewports for new elements
    const viewports = [
      { width: 320, height: 568, name: 'Mobile' },
      { width: 1280, height: 800, name: 'Desktop' }
    ];
    
    let totalErrors = 0;
    let totalTests = 0;
    
    for (const viewport of viewports) {
      console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      console.log('═'.repeat(60));
      
      const page = await browser.newPage();
      await page.setViewport({ width: viewport.width, height: viewport.height });
      
      const pom = new JaceAISitePOM(page);
      
      // Navigate to refactored site
      await pom.navigate('http://localhost:4321');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const errors = [];
      let testCount = 0;
      
      console.log('\n🧪 Running comprehensive POM validation...');
      
      // Run all POM validation methods including new ones
      const pomResults = await pom.validateAll();
      
      Object.entries(pomResults).forEach(([section, sectionErrors]) => {
        testCount++;
        console.log(`${testCount}. Validating ${section} section`);
        if (sectionErrors.length > 0) {
          errors.push(...sectionErrors.map(err => `${section}: ${err}`));
          console.log(`   ❌ ${sectionErrors.length} errors`);
          sectionErrors.forEach(err => console.log(`     - ${err}`));
        } else {
          console.log(`   ✅ Passed`);
        }
      });
      
      // Calculate viewport results
      const viewportErrorCount = errors.length;
      const viewportSuccessRate = testCount > 0 ? Math.round(((testCount - viewportErrorCount) / testCount) * 100) : 0;
      
      console.log(`\n📊 ${viewport.name} Results:`);
      console.log(`   Tests: ${testCount}`);
      console.log(`   Errors: ${viewportErrorCount}`);
      console.log(`   Success Rate: ${viewportSuccessRate}%`);
      
      totalErrors += viewportErrorCount;
      totalTests += testCount;
      
      await page.close();
    }
    
    // Overall Results
    console.log('\n\n══════════════════════════════════════════════════════════════');
    console.log('                          FINAL RESULTS                        ');
    console.log('══════════════════════════════════════════════════════════════\n');
    
    const overallSuccessRate = totalTests > 0 ? Math.round(((totalTests - totalErrors) / totalTests) * 100) : 0;
    
    console.log(`📊 Total Tests Across All Viewports: ${totalTests}`);
    console.log(`📋 Total Errors: ${totalErrors}`);
    console.log(`📈 Overall Success Rate: ${overallSuccessRate}%\n`);
    
    if (totalErrors === 0) {
      console.log('🎉 ALL POM ELEMENTS PASSED ACROSS ALL VIEWPORTS!');
      console.log('✅ Refactored site has 100% parity with original including new elements');
    } else {
      console.log(`❌ Found ${totalErrors} mismatches out of ${totalTests} tests`);
      console.log(`💯 Success Rate: ${overallSuccessRate}%\n`);
    }
    
    // Test interactive elements
    console.log('\n🎮 Testing Interactive Elements...');
    const testPage = await browser.newPage();
    await testPage.setViewport({ width: 1280, height: 800 });
    
    const testPom = new JaceAISitePOM(testPage);
    await testPom.navigate('http://localhost:4321');
    
    console.log('\n1. Testing Mobile Menu Toggle...');
    const mobileMenuErrors = await testPom.testMobileMenuToggle();
    if (mobileMenuErrors.length === 0) {
      console.log('   ✅ Mobile menu works correctly');
    } else {
      console.log('   ❌ Mobile menu issues:');
      mobileMenuErrors.forEach(err => console.log(`     - ${err}`));
    }
    
    console.log('\n2. Testing FAQ Accordion...');
    const faqErrors = await testPom.testFAQAccordion();
    if (faqErrors.length === 0) {
      console.log('   ✅ FAQ accordion works correctly');
    } else {
      console.log('   ❌ FAQ accordion issues:');
      faqErrors.forEach(err => console.log(`     - ${err}`));
    }
    
    console.log('\n3. Testing Hover States...');
    const hoverErrors = await testPom.testHoverStates();
    if (hoverErrors.length === 0) {
      console.log('   ✅ Hover states work correctly');
    } else {
      console.log('   ❌ Hover state issues:');
      hoverErrors.forEach(err => console.log(`     - ${err}`));
    }
    
    console.log('\n4. Testing Cookie Consent...');
    const cookieErrors = await testPom.testCookieConsentFunctionality();
    if (cookieErrors.length === 0) {
      console.log('   ✅ Cookie consent functionality works correctly');
    } else {
      console.log('   ❌ Cookie consent issues:');
      cookieErrors.forEach(err => console.log(`     - ${err}`));
    }
    
    await testPage.close();
    
  } catch (error) {
    console.error('Error during comprehensive testing:', error);
  } finally {
    await browser.close();
  }
}

comprehensivePOMTest();
