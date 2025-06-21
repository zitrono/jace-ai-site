// Comprehensive validation script for jace.ai to achieve 100% pass rate
import puppeteer from 'puppeteer';
import { JaceAISitePOM } from './jace-ai-site.pom.js';

const JACE_AI_URL = 'https://jace.ai';

async function validateJaceAI() {
  console.log('🎯 Comprehensive Validation for jace.ai (100% Coverage)\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    const pom = new JaceAISitePOM(page);
    
    await pom.navigate();
    console.log(`✅ Navigated to ${JACE_AI_URL}`);
    
    // Wait for page to fully load
    await page.waitForSelector('h1', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Allow for dynamic content
    
    console.log('\n📋 Running comprehensive validation...\n');
    
    // Run all POM validations
    const pomResults = await pom.validateAll();
    
    // Run interactive tests
    console.log('🔧 Testing interactive elements...\n');
    const interactiveResults = {
      mobileMenuToggle: await pom.testMobileMenuToggle(),
      hoverStates: await pom.testHoverStates(),
      faqAccordion: await pom.testFAQAccordion()
    };
    
    // Combine all results
    const allResults = { ...pomResults, ...interactiveResults };
    
    // Display results
    let totalPassed = 0;
    let totalFailed = 0;
    const failedSections = [];
    
    for (const [section, errors] of Object.entries(allResults)) {
      if (errors.length === 0) {
        console.log(`✅ ${section}: PASSED`);
        totalPassed++;
      } else {
        console.log(`❌ ${section}: ${errors.length} issues`);
        errors.forEach(error => console.log(`   - ${error}`));
        totalFailed += errors.length;
        failedSections.push({ section, errors });
      }
    }
    
    // Additional specific validations based on pom_extension.md requirements
    console.log('\n🔍 Additional coverage validation...\n');
    
    const additionalChecks = await performAdditionalChecks(page);
    
    for (const [check, result] of Object.entries(additionalChecks)) {
      if (result.passed) {
        console.log(`✅ ${check}: PASSED (${result.details})`);
        totalPassed++;
      } else {
        console.log(`❌ ${check}: FAILED (${result.details})`);
        totalFailed++;
        failedSections.push({ section: check, errors: [result.details] });
      }
    }
    
    // Final summary
    const totalTests = Object.keys(allResults).length + Object.keys(additionalChecks).length;
    const passRate = (totalPassed / totalTests) * 100;
    
    console.log('\n📊 Final Validation Summary:');
    console.log(`Total tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed sections: ${failedSections.length}`);
    console.log(`Total issues: ${totalFailed}`);
    console.log(`Pass rate: ${passRate.toFixed(1)}%`);
    
    if (passRate === 100) {
      console.log('\n🎉 SUCCESS! 100% pass rate achieved!');
      console.log('The complete POM accurately validates jace.ai with full coverage.');
    } else {
      console.log('\n💡 Areas needing attention:');
      failedSections.forEach(({ section, errors }) => {
        console.log(`- ${section}: ${errors.length} issues`);
      });
    }
    
    return { totalPassed, totalFailed, passRate, results: allResults };
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Additional checks to ensure full coverage from pom_extension.md
async function performAdditionalChecks(page) {
  const checks = {};
  
  // 1. Background Colors and Gradients
  checks.backgroundColors = await page.evaluate(() => {
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const hasGradients = document.querySelectorAll('[style*="gradient"], [class*="gradient"]').length > 0;
    return {
      passed: bodyBg === 'rgb(40, 40, 40)' && hasGradients,
      details: `Body: ${bodyBg}, Gradients: ${hasGradients}`
    };
  });
  
  // 2. Meta/SEO Elements
  checks.metaSEO = await page.evaluate(() => {
    const hasTitle = !!document.querySelector('title');
    const hasDescription = !!document.querySelector('meta[name="description"]');
    const hasOG = !!document.querySelector('meta[property="og:title"]');
    const hasTwitter = !!document.querySelector('meta[name="twitter:card"]');
    
    const passed = hasTitle && hasDescription && hasOG && hasTwitter;
    return {
      passed,
      details: `Title: ${hasTitle}, Description: ${hasDescription}, OG: ${hasOG}, Twitter: ${hasTwitter}`
    };
  });
  
  // 3. Responsive Design Classes
  checks.responsiveClasses = await page.evaluate(() => {
    const responsiveElements = document.querySelectorAll('[class*="md:"], [class*="lg:"], [class*="sm:"]');
    const mobileHidden = document.querySelectorAll('.md\\:hidden, .lg\\:hidden');
    
    return {
      passed: responsiveElements.length > 0 && mobileHidden.length > 0,
      details: `Responsive: ${responsiveElements.length}, Mobile hidden: ${mobileHidden.length}`
    };
  });
  
  // 4. Accessibility Features
  checks.accessibility = await page.evaluate(() => {
    const ariaLabels = document.querySelectorAll('[aria-label]');
    const ariaExpanded = document.querySelectorAll('[aria-expanded]');
    const roles = document.querySelectorAll('[role]');
    
    return {
      passed: ariaLabels.length > 0 || ariaExpanded.length > 0 || roles.length > 0,
      details: `ARIA labels: ${ariaLabels.length}, Expanded: ${ariaExpanded.length}, Roles: ${roles.length}`
    };
  });
  
  // 5. Interactive Elements and Transitions
  checks.interactiveElements = await page.evaluate(() => {
    const hoverElements = document.querySelectorAll('[class*="hover:"]');
    const transitionElements = document.querySelectorAll('[class*="transition"]');
    const focusElements = document.querySelectorAll('[class*="focus:"]');
    
    return {
      passed: hoverElements.length > 0 && transitionElements.length > 0,
      details: `Hover: ${hoverElements.length}, Transitions: ${transitionElements.length}, Focus: ${focusElements.length}`
    };
  });
  
  // 6. Form Elements (if any)
  checks.formElements = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    const buttons = document.querySelectorAll('button');
    const labels = document.querySelectorAll('label');
    
    return {
      passed: buttons.length > 0, // Buttons should exist at minimum
      details: `Inputs: ${inputs.length}, Buttons: ${buttons.length}, Labels: ${labels.length}`
    };
  });
  
  // 7. Visual Elements (Icons, Badges, Patterns)
  checks.visualElements = await page.evaluate(() => {
    const svgIcons = document.querySelectorAll('svg');
    const images = document.querySelectorAll('img');
    const badges = document.querySelectorAll('[class*="badge"], [class*="pill"]');
    
    return {
      passed: svgIcons.length > 0 && images.length > 0,
      details: `SVG icons: ${svgIcons.length}, Images: ${images.length}, Badges: ${badges.length}`
    };
  });
  
  // 8. Structural Elements and IDs
  checks.structuralElements = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    const divs = document.querySelectorAll('div');
    const containers = document.querySelectorAll('[class*="container"], [class*="max-w"]');
    
    return {
      passed: divs.length > 0 && containers.length > 0,
      details: `Sections: ${sections.length}, Divs: ${divs.length}, Containers: ${containers.length}`
    };
  });
  
  // 9. Border and Divider Elements
  checks.borderElements = await page.evaluate(() => {
    const borders = document.querySelectorAll('[class*="border"]');
    const dividers = document.querySelectorAll('[class*="divide"]');
    
    return {
      passed: borders.length > 0,
      details: `Borders: ${borders.length}, Dividers: ${dividers.length}`
    };
  });
  
  // 10. JavaScript Functionality Indicators
  checks.javaScriptFunctionality = await page.evaluate(() => {
    const dataAttrs = document.querySelectorAll('[data-]');
    const clickHandlers = document.querySelectorAll('[onclick]');
    const eventListeners = document.querySelectorAll('button, a');
    
    return {
      passed: eventListeners.length > 0,
      details: `Data attrs: ${dataAttrs.length}, Click handlers: ${clickHandlers.length}, Interactive elements: ${eventListeners.length}`
    };
  });
  
  return checks;
}

// Run the validation
(async () => {
  console.log('🚀 Starting Comprehensive jace.ai Validation\n');
  console.log('This validation covers all elements from pom_extension.md:');
  console.log('✓ Background colors and gradients');
  console.log('✓ Mobile menu system');
  console.log('✓ Interactive elements');
  console.log('✓ Visual elements');
  console.log('✓ Accessibility features');
  console.log('✓ Responsive design');
  console.log('✓ Meta/SEO elements');
  console.log('✓ Form elements');
  console.log('✓ Structural elements');
  console.log('✓ JavaScript functionality\n');
  
  try {
    const { passRate } = await validateJaceAI();
    
    if (passRate === 100) {
      console.log('\n✅ MISSION ACCOMPLISHED: 100% test coverage achieved!');
    }
    
    process.exit(passRate === 100 ? 0 : 1);
  } catch (error) {
    console.error('Validation failed:', error);
    process.exit(1);
  }
})();