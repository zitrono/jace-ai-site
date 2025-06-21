// Extended POM Test - Comprehensive testing with all new elements
import puppeteer from 'puppeteer';
import { ExtendedJaceAISite } from './extended-site.pom.js';

const ORIGINAL_URL = 'http://localhost:8080';
const REFACTORED_URL = 'http://localhost:4323';

async function runExtendedTests(url, siteName) {
  console.log(`\n🧪 Running extended tests for ${siteName} site...`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    const pom = new ExtendedJaceAISite(page);
    pom.url = url;
    
    await pom.navigate();
    console.log(`✅ Navigated to ${url}`);
    
    // Run all validations
    const results = await pom.validateAll();
    
    // Run additional interactive tests
    console.log('\n📱 Testing interactive elements...');
    const hoverErrors = await pom.testHoverStates();
    const mobileMenuErrors = await pom.testMobileMenuToggle();
    const faqErrors = await pom.testFAQAccordion();
    
    results.hover = hoverErrors;
    results.mobileMenuToggle = mobileMenuErrors;
    results.faqToggle = faqErrors;
    
    // Display results
    console.log('\n📊 Extended Test Results:');
    
    let totalErrors = 0;
    let totalPassed = 0;
    
    for (const [section, errors] of Object.entries(results)) {
      if (errors.length === 0) {
        console.log(`✅ ${section}: PASSED`);
        totalPassed++;
      } else {
        console.log(`❌ ${section}: ${errors.length} issues`);
        errors.forEach(error => console.log(`   - ${error}`));
        totalErrors += errors.length;
      }
    }
    
    // Test specific new elements
    console.log('\n🔍 Testing specific new elements...');
    
    // Test background colors
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    console.log(`Body background: ${bodyBg}`);
    
    // Test gradients
    const gradients = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="gradient"], [style*="gradient"]');
      return Array.from(elements).map(el => ({
        selector: el.className || el.tagName,
        gradient: window.getComputedStyle(el).backgroundImage
      })).filter(item => item.gradient && item.gradient !== 'none');
    });
    console.log(`Found ${gradients.length} gradient elements`);
    
    // Test mobile responsiveness
    console.log('\n📱 Testing mobile responsiveness...');
    await page.setViewport({ width: 375, height: 667 });
    
    const mobileElements = await page.evaluate(() => {
      const hiddenOnDesktop = document.querySelectorAll('.lg\\:hidden, .md\\:hidden');
      const visibleOnMobile = Array.from(hiddenOnDesktop).filter(el => {
        const styles = window.getComputedStyle(el);
        return styles.display !== 'none';
      });
      return visibleOnMobile.length;
    });
    console.log(`Mobile-specific elements visible: ${mobileElements}`);
    
    // Test accessibility
    console.log('\n♿ Testing accessibility...');
    const accessibilityData = await page.evaluate(() => {
      const ariaLabels = document.querySelectorAll('[aria-label]').length;
      const ariaDescribed = document.querySelectorAll('[aria-describedby]').length;
      const roles = document.querySelectorAll('[role]').length;
      const srOnly = document.querySelectorAll('.sr-only, .visually-hidden').length;
      
      return { ariaLabels, ariaDescribed, roles, srOnly };
    });
    console.log('Accessibility elements:', accessibilityData);
    
    // Summary
    console.log('\n📈 Extended Test Summary:');
    console.log(`Total sections tested: ${Object.keys(results).length}`);
    console.log(`Sections passed: ${totalPassed}`);
    console.log(`Total issues found: ${totalErrors}`);
    
    return { siteName, totalErrors, totalPassed, results };
    
  } catch (error) {
    console.error(`❌ Error testing ${siteName}:`, error.message);
    return { siteName, error: error.message };
  } finally {
    await browser.close();
  }
}

async function compareResults(originalResults, refactoredResults) {
  console.log('\n🔄 Comparing Original vs Refactored Sites...\n');
  
  const sections = new Set([
    ...Object.keys(originalResults.results || {}),
    ...Object.keys(refactoredResults.results || {})
  ]);
  
  for (const section of sections) {
    const originalErrors = originalResults.results?.[section]?.length || 0;
    const refactoredErrors = refactoredResults.results?.[section]?.length || 0;
    
    if (originalErrors === 0 && refactoredErrors === 0) {
      console.log(`✅ ${section}: Both sites pass`);
    } else if (originalErrors > 0 && refactoredErrors === 0) {
      console.log(`⚠️  ${section}: Original has issues, Refactored passes`);
    } else if (originalErrors === 0 && refactoredErrors > 0) {
      console.log(`❌ ${section}: Original passes, Refactored has ${refactoredErrors} issues`);
    } else {
      console.log(`⚠️  ${section}: Original has ${originalErrors} issues, Refactored has ${refactoredErrors} issues`);
    }
  }
}

// Main execution
(async () => {
  console.log('🚀 Starting Extended POM Tests\n');
  console.log('This test includes:');
  console.log('- Background colors and gradients');
  console.log('- Mobile menu system');
  console.log('- Interactive elements (FAQ, pricing toggle)');
  console.log('- Visual elements (badges, icons)');
  console.log('- Accessibility features');
  console.log('- Responsive design elements\n');
  
  const startTime = Date.now();
  
  // Test both sites
  const originalResults = await runExtendedTests(ORIGINAL_URL, 'Original');
  const refactoredResults = await runExtendedTests(REFACTORED_URL, 'Refactored');
  
  // Compare results
  await compareResults(originalResults, refactoredResults);
  
  // Final summary
  console.log('\n🏁 Extended Test Complete!');
  console.log(`Total time: ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
  
  // Exit with appropriate code
  const totalErrors = (originalResults.totalErrors || 0) + (refactoredResults.totalErrors || 0);
  process.exit(totalErrors > 0 ? 1 : 0);
})();