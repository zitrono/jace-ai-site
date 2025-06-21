// Validate Original Site with Extended POM
import puppeteer from 'puppeteer';
import { ExtendedJaceAISite } from './extended-site.pom.js';
import fs from 'fs';

const ORIGINAL_URL = 'http://localhost:8080';

async function extractAndValidate() {
  console.log('🔍 Validating Extended POM against Original Site\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    await page.goto(ORIGINAL_URL, { waitUntil: 'networkidle0' });
    console.log(`✅ Navigated to ${ORIGINAL_URL}`);
    
    // Extract actual values from the original site
    console.log('\n📊 Extracting actual values from original site...\n');
    
    const actualValues = await page.evaluate(() => {
      const values = {
        backgrounds: {},
        gradients: {},
        elements: {},
        mobile: {},
        interactive: {},
        visual: {}
      };
      
      // 1. Background Colors
      values.backgrounds.body = window.getComputedStyle(document.body).backgroundColor;
      
      // Check main sections
      const main = document.querySelector('main');
      if (main) {
        values.backgrounds.main = window.getComputedStyle(main).backgroundColor;
      }
      
      // Hero section background
      const heroSection = document.querySelector('section:has(h1)') || document.querySelector('.hero');
      if (heroSection) {
        const heroStyles = window.getComputedStyle(heroSection);
        values.backgrounds.hero = {
          backgroundColor: heroStyles.backgroundColor,
          backgroundImage: heroStyles.backgroundImage
        };
      }
      
      // 2. Gradients
      // Hero title gradient
      const heroTitle = document.querySelector('h1');
      if (heroTitle) {
        const titleStyles = window.getComputedStyle(heroTitle);
        values.gradients.heroTitle = {
          backgroundImage: titleStyles.backgroundImage,
          webkitBackgroundClip: titleStyles.webkitBackgroundClip,
          webkitTextFillColor: titleStyles.webkitTextFillColor,
          color: titleStyles.color
        };
      }
      
      // Video container gradient
      const videoContainer = document.querySelector('.bg-gradient-to-br');
      if (videoContainer) {
        values.gradients.videoContainer = window.getComputedStyle(videoContainer).backgroundImage;
      }
      
      // 3. Mobile Menu Elements
      // Look for hamburger menu button
      const possibleMenuButtons = [
        'button[aria-label*="menu"]',
        'button[aria-label*="Menu"]',
        '.hamburger',
        '.menu-button',
        'button svg.w-6.h-6',
        'nav button:has(svg)'
      ];
      
      for (const selector of possibleMenuButtons) {
        const menuButton = document.querySelector(selector);
        if (menuButton) {
          values.mobile.menuButton = {
            exists: true,
            selector: selector,
            classes: menuButton.className
          };
          break;
        }
      }
      
      // 4. Interactive Elements
      // FAQ items
      const faqItems = document.querySelectorAll('.faq-item, [data-faq], details');
      values.interactive.faqCount = faqItems.length;
      
      // Pricing toggle
      const pricingToggle = document.querySelector('.pricing-toggle, [aria-label*="pricing"]');
      values.interactive.hasPricingToggle = !!pricingToggle;
      
      // 5. Visual Elements
      // CASA badge
      const casaBadge = document.querySelector('.border-2');
      if (casaBadge) {
        const badgeStyles = window.getComputedStyle(casaBadge);
        values.visual.casaBadge = {
          exists: true,
          backgroundColor: badgeStyles.backgroundColor,
          border: badgeStyles.border,
          borderRadius: badgeStyles.borderRadius
        };
      }
      
      // Company logos
      const companyLogos = document.querySelectorAll('img[alt*="company"], img[alt*="logo"]');
      values.visual.companyLogosCount = companyLogos.length;
      
      // Feature icons
      const featureIcons = document.querySelectorAll('.feature-icon, svg:not([aria-hidden])');
      values.visual.featureIconsCount = featureIcons.length;
      
      // 6. Specific Elements
      // Check for specific text content
      values.elements.heroTitle = document.querySelector('h1')?.textContent?.trim();
      values.elements.heroSubtitle = document.querySelector('main p:first-of-type')?.textContent?.trim();
      values.elements.ctaButton = document.querySelector('main button:first-of-type')?.textContent?.trim();
      
      // Navigation items
      const navLinks = document.querySelectorAll('header nav a');
      values.elements.navItems = Array.from(navLinks).map(link => link.textContent.trim());
      
      // Check for responsive classes
      values.elements.hasResponsiveClasses = document.querySelector('[class*="md\\:"], [class*="lg\\:"]') !== null;
      
      return values;
    });
    
    // Display extracted values
    console.log('📋 Extracted Values from Original Site:\n');
    console.log(JSON.stringify(actualValues, null, 2));
    
    // Now run the extended POM tests
    console.log('\n\n🧪 Running Extended POM Validation...\n');
    
    const pom = new ExtendedJaceAISite(page);
    pom.url = ORIGINAL_URL;
    
    // We're already on the page, so don't navigate again
    const results = await pom.validateAll();
    
    // Display validation results
    console.log('\n📊 Validation Results:\n');
    
    let totalErrors = 0;
    let totalPassed = 0;
    const failedSections = [];
    
    for (const [section, errors] of Object.entries(results)) {
      if (errors.length === 0) {
        console.log(`✅ ${section}: PASSED`);
        totalPassed++;
      } else {
        console.log(`❌ ${section}: ${errors.length} issues`);
        errors.forEach(error => console.log(`   - ${error}`));
        totalErrors += errors.length;
        failedSections.push({ section, errors });
      }
    }
    
    // Save results for analysis
    const report = {
      timestamp: new Date().toISOString(),
      url: ORIGINAL_URL,
      extractedValues: actualValues,
      validationResults: results,
      summary: {
        totalSections: Object.keys(results).length,
        sectionsPassed: totalPassed,
        totalErrors: totalErrors,
        failedSections: failedSections
      }
    };
    
    fs.writeFileSync('original-site-validation-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Full report saved to original-site-validation-report.json');
    
    // Provide recommendations
    if (totalErrors > 0) {
      console.log('\n💡 Recommendations to achieve 100% pass rate:\n');
      console.log('1. Update the POM expected values based on the extracted actual values');
      console.log('2. Some elements might not exist on the original site - make them optional');
      console.log('3. Check if selectors need to be adjusted for the original site structure');
      console.log('\nNext steps:');
      console.log('- Review original-site-validation-report.json');
      console.log('- Update extended-site.pom.js with correct expected values');
      console.log('- Re-run this validation to confirm 100% pass rate');
    } else {
      console.log('\n🎉 All tests passed! The POM accurately represents the original site.');
    }
    
    return { totalErrors, totalPassed };
    
  } catch (error) {
    console.error('❌ Error during validation:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the validation
(async () => {
  try {
    const { totalErrors } = await extractAndValidate();
    process.exit(totalErrors > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
})();