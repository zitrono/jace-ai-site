import puppeteer from 'puppeteer';
import { EnhancedOriginalJaceAISite } from './enhanced-original-site.pom.js';

async function testRefactoredEnhanced() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('🔍 TESTING ENHANCED POM AGAINST REFACTORED SITE...\n');
  
  try {
    const pom = new EnhancedOriginalJaceAISite(page);
    
    // Navigate to refactored site
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const errors = [];
    let testCount = 0;
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('              KEY ELEMENT VALIDATION                    ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test key selectors first
    const keySelectors = [
      { name: 'Hero Title', selector: pom.selectors.heroTitle },
      { name: 'Hero CTA Button', selector: pom.selectors.heroCTAButton },
      { name: 'CASA Badge', selector: pom.selectors.casaBadge },
      { name: 'Video Container', selector: pom.selectors.videoContainer },
      { name: 'Company Logos', selector: pom.selectors.companyLogos },
      { name: 'Header', selector: pom.selectors.header },
      { name: 'Footer', selector: pom.selectors.footer }
    ];
    
    for (const test of keySelectors) {
      testCount++;
      console.log(`${testCount}. Testing key selector: ${test.name}`);
      const elements = await page.$$(test.selector);
      if (elements.length === 0) {
        errors.push(`Key selector "${test.name}" (${test.selector}) not found`);
        console.log(`   ❌ Not found`);
      } else {
        console.log(`   ✅ Found (${elements.length} elements)`);
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('              CRITICAL STYLE VALIDATION                 ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test critical styles
    const criticalStyles = [
      // Hero title gradient
      {
        name: 'Hero Title Gradient',
        element: pom.selectors.heroTitle,
        tests: [
          { prop: 'fontSize', expected: pom.expectedStyles.hero.title.fontSize },
          { prop: 'fontWeight', expected: pom.expectedStyles.hero.title.fontWeight },
          { prop: 'backgroundImage', expected: pom.expectedStyles.hero.title.backgroundImage },
          { prop: 'color', expected: pom.expectedStyles.hero.title.color },
          { prop: 'webkitTextFillColor', expected: pom.expectedStyles.hero.title.webkitTextFillColor }
        ]
      },
      // Primary button
      {
        name: 'Primary CTA Button',
        element: pom.selectors.heroCTAButton,
        tests: [
          { prop: 'backgroundColor', expected: pom.expectedStyles.buttons.primary.backgroundColor },
          { prop: 'color', expected: pom.expectedStyles.buttons.primary.color },
          { prop: 'borderRadius', expected: pom.expectedStyles.buttons.primary.borderRadius },
          { prop: 'fontSize', expected: pom.expectedStyles.buttons.primary.fontSize },
          { prop: 'padding', expected: pom.expectedStyles.buttons.primary.padding }
        ]
      },
      // Secondary button
      {
        name: 'Secondary Button (Login)',
        element: pom.selectors.loginButton,
        tests: [
          { prop: 'backgroundColor', expected: pom.expectedStyles.buttons.secondary.backgroundColor },
          { prop: 'color', expected: pom.expectedStyles.buttons.secondary.color },
          { prop: 'borderRadius', expected: pom.expectedStyles.buttons.secondary.borderRadius }
        ]
      },
      // CASA Badge
      {
        name: 'CASA Badge',
        element: pom.selectors.casaBadge,
        tests: [
          { prop: 'backgroundColor', expected: pom.expectedStyles.trust.casaBadge.backgroundColor },
          { prop: 'borderRadius', expected: pom.expectedStyles.trust.casaBadge.borderRadius },
          { prop: 'fontSize', expected: pom.expectedStyles.trust.casaBadge.fontSize }
        ]
      }
    ];
    
    for (const styleGroup of criticalStyles) {
      testCount++;
      console.log(`${testCount}. Testing ${styleGroup.name} styles`);
      
      const styles = await pom.getElementStyles(styleGroup.element);
      if (!styles) {
        errors.push(`${styleGroup.name}: Element not found`);
        console.log(`   ❌ Element not found`);
        continue;
      }
      
      let groupErrors = 0;
      for (const test of styleGroup.tests) {
        const actual = styles[test.prop];
        
        if (test.expected instanceof RegExp) {
          if (!test.expected.test(actual)) {
            errors.push(`${styleGroup.name} ${test.prop}: ${actual} doesn't match pattern`);
            console.log(`   ❌ ${test.prop}: ${actual}`);
            groupErrors++;
          } else {
            console.log(`   ✅ ${test.prop}: ${actual}`);
          }
        } else {
          if (actual !== test.expected) {
            errors.push(`${styleGroup.name} ${test.prop}: ${actual} !== ${test.expected}`);
            console.log(`   ❌ ${test.prop}: ${actual} !== ${test.expected}`);
            groupErrors++;
          } else {
            console.log(`   ✅ ${test.prop}: ${actual}`);
          }
        }
      }
      
      if (groupErrors === 0) {
        console.log(`   🎉 All ${styleGroup.name} styles passed!`);
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('              CONTENT VALIDATION                        ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test key content
    const keyContent = [
      { name: 'Hero Title', selector: pom.selectors.heroTitle, expected: pom.expectedContent.heroTitle },
      { name: 'CTA Button', selector: pom.selectors.heroCTAButton, expected: pom.expectedContent.ctaButtonText }
    ];
    
    for (const content of keyContent) {
      testCount++;
      console.log(`${testCount}. Testing ${content.name} content`);
      const actual = await pom.getElementText(content.selector);
      if (actual !== content.expected) {
        errors.push(`${content.name}: "${actual}" !== "${content.expected}"`);
        console.log(`   ❌ "${actual}" !== "${content.expected}"`);
      } else {
        console.log(`   ✅ "${actual}"`);
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('              ENHANCED VALIDATION METHODS               ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Run enhanced validation methods
    const pomResults = await pom.validateAll();
    Object.entries(pomResults).forEach(([section, sectionErrors]) => {
      testCount++;
      console.log(`${testCount}. Enhanced validating ${section} section`);
      if (sectionErrors.length > 0) {
        errors.push(...sectionErrors.map(err => `${section}: ${err}`));
        console.log(`   ❌ ${sectionErrors.length} errors`);
        sectionErrors.forEach(err => console.log(`     - ${err}`));
      } else {
        console.log(`   ✅ Passed`);
      }
    });
    
    // Final Results
    console.log('\n\n══════════════════════════════════════════════════════════════');
    console.log('                    REFACTORED SITE RESULTS                     ');
    console.log('══════════════════════════════════════════════════════════════\n');
    
    console.log(`📊 Total Tests Executed: ${testCount}`);
    console.log(`🎯 Focus: Critical styling and functionality\n`);
    
    if (errors.length === 0) {
      console.log('🎉 ALL CRITICAL TESTS PASSED!');
      console.log('✅ Refactored site matches enhanced POM expectations');
    } else {
      console.log(`❌ Found ${errors.length} validation issues:`);
      console.log(`💯 Success Rate: ${Math.round(((testCount - errors.length) / testCount) * 100)}%\n`);
      
      console.log('REFACTORED SITE VALIDATION ERRORS:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
      
      console.log('\n🔧 These issues need to be fixed in the refactored site');
    }
    
  } catch (error) {
    console.error('Error during refactored site testing:', error);
  } finally {
    await browser.close();
  }
}

testRefactoredEnhanced();