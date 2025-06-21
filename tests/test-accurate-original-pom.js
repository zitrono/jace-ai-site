// Test the Accurate Original Site POM
import puppeteer from 'puppeteer';
import { AccurateOriginalSitePOM } from './original-site-accurate.pom.js';

const ORIGINAL_URL = 'http://localhost:8080';

async function testAccuratePOM() {
  console.log('🧪 Testing Accurate POM against Original Site\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    const pom = new AccurateOriginalSitePOM(page);
    
    await pom.navigate();
    console.log(`✅ Navigated to ${ORIGINAL_URL}`);
    
    // Run all validations
    const results = await pom.validateAll();
    
    // Display results
    console.log('\n📊 Validation Results:\n');
    
    let totalErrors = 0;
    let totalPassed = 0;
    const detailedResults = {};
    
    for (const [section, errors] of Object.entries(results)) {
      if (errors.length === 0) {
        console.log(`✅ ${section}: PASSED`);
        totalPassed++;
        detailedResults[section] = 'PASSED';
      } else {
        console.log(`❌ ${section}: ${errors.length} issues`);
        errors.forEach(error => console.log(`   - ${error}`));
        totalErrors += errors.length;
        detailedResults[section] = errors;
      }
    }
    
    // Additional specific checks
    console.log('\n🔍 Additional Validation Checks:\n');
    
    // Check specific elements that were problematic
    const specificChecks = await page.evaluate(() => {
      const checks = {};
      
      // Hero title exact text
      const h1 = document.querySelector('h1');
      checks.heroTitleText = h1?.textContent?.trim() || 'NOT FOUND';
      
      // Check if spaces are correct in title
      checks.heroTitleHasCorrectSpacing = h1?.textContent?.includes('Gain 2 Hours Daily');
      
      // Navigation items
      const navLinks = Array.from(document.querySelectorAll('nav a'));
      checks.navigationItems = navLinks.map(link => link.textContent?.trim());
      
      // Mobile menu button
      const mobileButton = document.querySelector('button.mobile-menu-toggle');
      checks.hasMobileMenuButton = !!mobileButton;
      
      // CASA badge
      const casaBadge = document.querySelector('.casa-badge');
      checks.hasCasaBadge = !!casaBadge;
      
      // Company logos
      const companyLogos = document.querySelectorAll('.company-logos-opacity img');
      checks.companyLogosCount = companyLogos.length;
      
      // Pricing toggle
      const pricingToggle = document.querySelector('.pricing-toggle');
      checks.hasPricingToggle = !!pricingToggle;
      
      // FAQ items
      const faqItems = document.querySelectorAll('.faq-item');
      checks.faqItemsCount = faqItems.length;
      
      return checks;
    });
    
    console.log('Specific element checks:');
    Object.entries(specificChecks).forEach(([check, value]) => {
      console.log(`  ${check}: ${JSON.stringify(value)}`);
    });
    
    // Test summary
    console.log('\n📈 Test Summary:');
    console.log(`Total sections tested: ${Object.keys(results).length}`);
    console.log(`Sections passed: ${totalPassed}`);
    console.log(`Total issues found: ${totalErrors}`);
    console.log(`Pass rate: ${((totalPassed / Object.keys(results).length) * 100).toFixed(1)}%`);
    
    if (totalErrors === 0) {
      console.log('\n🎉 All tests passed! The POM accurately represents the original site.');
    } else {
      console.log('\n⚠️  Some tests failed. Review the errors above.');
    }
    
    return { totalErrors, totalPassed, detailedResults };
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
(async () => {
  console.log('🚀 Starting Accurate POM Test\n');
  
  try {
    const { totalErrors } = await testAccuratePOM();
    
    if (totalErrors === 0) {
      console.log('\n✅ SUCCESS: 100% pass rate achieved!');
    }
    
    process.exit(totalErrors > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
})();