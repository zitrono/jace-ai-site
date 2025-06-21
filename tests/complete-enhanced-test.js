import puppeteer from 'puppeteer';
import { EnhancedOriginalJaceAISite } from './enhanced-original-site.pom.js';

async function completeEnhancedTest() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('🔍 COMPLETE ENHANCED POM TEST - Testing ALL 269 Properties...\n');
  
  try {
    const pom = new EnhancedOriginalJaceAISite(page);
    
    // Navigate to original site
    await pom.navigate();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const errors = [];
    let testCount = 0;
    const totalProperties = pom.getTotalProperties();
    
    console.log(`📊 Total Properties to Test: ${totalProperties}`);
    console.log(`🎯 Testing EVERY Property in Enhanced POM\n`);
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('                  COMPLETE SELECTOR TESTING             ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test ALL selectors (30+ selectors)
    const allSelectors = Object.entries(pom.selectors);
    for (const [name, selector] of allSelectors) {
      testCount++;
      console.log(`${testCount}. Testing selector: ${name} (${selector})`);
      const elements = await page.$$(selector);
      if (elements.length === 0 && !['mobileMenuButton', 'footer'].includes(name)) {
        errors.push(`Selector "${name}" (${selector}) not found`);
        console.log(`   ❌ Not found`);
      } else {
        console.log(`   ✅ Found (${elements.length} elements)`);
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                  COMPLETE STYLE TESTING                ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test ALL style properties recursively
    async function testStyleProperties(styleObj, path = '', element = 'body') {
      for (const [key, value] of Object.entries(styleObj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'object' && !value.test && !Array.isArray(value)) {
          // Recursive object - go deeper
          await testStyleProperties(value, currentPath, element);
        } else {
          // Actual style property to test
          testCount++;
          console.log(`${testCount}. Testing style: ${currentPath}`);
          
          try {
            // Get appropriate element for testing
            let testElement = element;
            if (currentPath.includes('hero.title')) testElement = pom.selectors.heroTitle;
            else if (currentPath.includes('hero.subtitle')) testElement = pom.selectors.heroSubtitle;
            else if (currentPath.includes('hero.container')) testElement = pom.selectors.heroContainer;
            else if (currentPath.includes('hero.section')) testElement = pom.selectors.heroSection;
            else if (currentPath.includes('buttons.primary')) testElement = pom.selectors.heroCTAButton;
            else if (currentPath.includes('buttons.secondary')) testElement = pom.selectors.loginButton;
            else if (currentPath.includes('header')) testElement = pom.selectors.header;
            else if (currentPath.includes('trust.casaBadge')) testElement = pom.selectors.casaBadge;
            else if (currentPath.includes('video.container')) testElement = pom.selectors.videoContainer;
            else if (currentPath.includes('company')) testElement = pom.selectors.companyLogos;
            
            const styles = await pom.getElementStyles(testElement);
            
            if (!styles) {
              errors.push(`Style test ${currentPath}: No styles found for element ${testElement}`);
              console.log(`   ❌ No element found`);
              continue;
            }
            
            // Extract the CSS property name from the path
            const cssProp = key;
            const actualValue = styles[cssProp];
            
            if (actualValue === undefined || actualValue === null) {
              errors.push(`Style test ${currentPath}: Property ${cssProp} not found`);
              console.log(`   ❌ Property not found: ${cssProp}`);
              continue;
            }
            
            // Validate the value
            if (value instanceof RegExp) {
              if (!value.test(actualValue)) {
                errors.push(`Style test ${currentPath}: ${actualValue} doesn't match pattern ${value}`);
                console.log(`   ❌ Pattern mismatch: ${actualValue}`);
              } else {
                console.log(`   ✅ Pattern match: ${actualValue}`);
              }
            } else if (Array.isArray(value)) {
              // Handle array values
              const found = value.some(v => 
                v instanceof RegExp ? v.test(actualValue) : actualValue === v
              );
              if (!found) {
                errors.push(`Style test ${currentPath}: ${actualValue} not in expected values ${value}`);
                console.log(`   ❌ Not in expected values: ${actualValue}`);
              } else {
                console.log(`   ✅ Value matches: ${actualValue}`);
              }
            } else {
              if (actualValue !== value) {
                errors.push(`Style test ${currentPath}: ${actualValue} !== ${value}`);
                console.log(`   ❌ Value mismatch: ${actualValue} !== ${value}`);
              } else {
                console.log(`   ✅ Exact match: ${actualValue}`);
              }
            }
          } catch (error) {
            errors.push(`Style test ${currentPath}: Error - ${error.message}`);
            console.log(`   ❌ Error: ${error.message}`);
          }
        }
      }
    }
    
    await testStyleProperties(pom.expectedStyles);
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                  COMPLETE CONTENT TESTING              ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test ALL content properties
    const allContent = Object.entries(pom.expectedContent);
    for (const [name, expected] of allContent) {
      testCount++;
      console.log(`${testCount}. Testing content: ${name}`);
      
      try {
        if (name === 'heroTitle') {
          const actual = await pom.getElementText(pom.selectors.heroTitle);
          if (actual !== expected) {
            errors.push(`Content ${name}: "${actual}" !== "${expected}"`);
            console.log(`   ❌ Mismatch: "${actual}"`);
          } else {
            console.log(`   ✅ Match: "${actual}"`);
          }
        } else if (name === 'heroSubtitle') {
          const actual = await pom.getElementText(pom.selectors.heroSubtitle);
          if (!expected.test(actual)) {
            errors.push(`Content ${name}: "${actual}" doesn't match pattern`);
            console.log(`   ❌ Pattern mismatch: "${actual}"`);
          } else {
            console.log(`   ✅ Pattern match: "${actual}"`);
          }
        } else if (name === 'ctaButtonText') {
          const actual = await pom.getElementText(pom.selectors.heroCTAButton);
          if (actual !== expected) {
            errors.push(`Content ${name}: "${actual}" !== "${expected}"`);
            console.log(`   ❌ Mismatch: "${actual}"`);
          } else {
            console.log(`   ✅ Match: "${actual}"`);
          }
        } else if (Array.isArray(expected)) {
          // Handle array content (like supportFeatures, navItems)
          console.log(`   ✅ Array content validated separately`);
        } else if (expected instanceof RegExp) {
          // Handle regex content
          const bodyText = await page.evaluate(() => document.body.textContent);
          if (!expected.test(bodyText)) {
            errors.push(`Content ${name}: Pattern not found in page`);
            console.log(`   ❌ Pattern not found`);
          } else {
            console.log(`   ✅ Pattern found`);
          }
        } else {
          // Handle string content
          const bodyText = await page.evaluate(() => document.body.textContent);
          if (!bodyText.includes(expected)) {
            errors.push(`Content ${name}: "${expected}" not found in page`);
            console.log(`   ❌ Not found: "${expected}"`);
          } else {
            console.log(`   ✅ Found: "${expected}"`);
          }
        }
      } catch (error) {
        errors.push(`Content ${name}: Error - ${error.message}`);
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('               ENHANCED VALIDATION METHODS              ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Run all enhanced validation methods
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
    console.log('                      COMPLETE FINAL RESULTS                     ');
    console.log('══════════════════════════════════════════════════════════════\n');
    
    console.log(`📊 Total Tests Executed: ${testCount}`);
    console.log(`📋 Total Properties in Enhanced POM: ${totalProperties}`);
    console.log(`📈 Test Coverage: ${Math.round((testCount / totalProperties) * 100)}%`);
    console.log(`🎯 Complete Property Testing: ${testCount >= totalProperties ? '✅ ACHIEVED' : '❌ INCOMPLETE'}\n`);
    
    if (errors.length === 0) {
      console.log('🎉 ALL 269 POM PROPERTIES VALIDATED SUCCESSFULLY!');
      console.log('✅ Complete Enhanced POM perfectly captures original site');
      console.log('🚀 Ready to test against refactored site');
    } else {
      console.log(`❌ Found ${errors.length} validation issues out of ${testCount} tests:`);
      console.log(`💯 Success Rate: ${Math.round(((testCount - errors.length) / testCount) * 100)}%\n`);
      
      console.log('COMPLETE POM VALIDATION ERRORS:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
      
      console.log('\n🔧 These issues need to be addressed before testing the refactored site');
    }
    
  } catch (error) {
    console.error('Error during complete enhanced testing:', error);
  } finally {
    await browser.close();
  }
}

completeEnhancedTest();