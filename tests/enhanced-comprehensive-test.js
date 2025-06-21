import puppeteer from 'puppeteer';
import { EnhancedOriginalJaceAISite } from './enhanced-original-site.pom.js';

async function enhancedComprehensiveTest(targetUrl = null, siteName = 'ORIGINAL') {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log(`🔍 ENHANCED COMPREHENSIVE POM TEST - Testing 140+ Elements on ${siteName} SITE...\n`);
  
  try {
    const pom = new EnhancedOriginalJaceAISite(page);
    
    // Navigate to target site
    if (targetUrl) {
      await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    } else {
      await pom.navigate();
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const errors = [];
    let testCount = 0;
    const totalProperties = pom.getTotalProperties();
    
    console.log(`📊 Total Properties to Test: ${totalProperties}`);
    console.log(`🎯 Target: 140+ properties\n`);
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('              ENHANCED SELECTOR VALIDATION              ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test all enhanced selectors (30+ selectors)
    const selectorTests = [
      { name: 'Header', selector: pom.selectors.header },
      { name: 'Header Container', selector: pom.selectors.headerContainer },
      { name: 'Logo', selector: pom.selectors.logo },
      { name: 'Nav Links', selector: pom.selectors.navLinks },
      { name: 'Login Button', selector: pom.selectors.loginButton },
      { name: 'Mobile Menu Button', selector: pom.selectors.mobileMenuButton },
      { name: 'Hero Section', selector: pom.selectors.heroSection },
      { name: 'Hero Container', selector: pom.selectors.heroContainer },
      { name: 'Hero Title', selector: pom.selectors.heroTitle },
      { name: 'Hero Subtitle', selector: pom.selectors.heroSubtitle },
      { name: 'Hero CTA Button', selector: pom.selectors.heroCTAButton },
      { name: 'All H1', selector: pom.selectors.allH1 },
      { name: 'All H2', selector: pom.selectors.allH2 },
      { name: 'All H3', selector: pom.selectors.allH3 },
      { name: 'Body Text', selector: pom.selectors.bodyText },
      { name: 'Primary CTA Buttons', selector: pom.selectors.primaryCTAButtons },
      { name: 'Secondary Buttons', selector: pom.selectors.secondaryButtons },
      { name: 'CASA Badge', selector: pom.selectors.casaBadge },
      { name: 'User Count', selector: pom.selectors.userCount },
      { name: 'Video Container', selector: pom.selectors.videoContainer },
      { name: 'Video Title', selector: pom.selectors.videoTitle },
      { name: 'Company Section', selector: pom.selectors.companySection },
      { name: 'Company Logos', selector: pom.selectors.companyLogos },
      { name: 'Feature Cards', selector: pom.selectors.featureCards },
      { name: 'Content Containers', selector: pom.selectors.contentContainers },
      { name: 'Footer', selector: pom.selectors.footer }
    ];
    
    for (const test of selectorTests) {
      testCount++;
      console.log(`${testCount}. Testing selector: ${test.name}`);
      const elements = await page.$$(test.selector);
      if (elements.length === 0 && !['Mobile Menu Button', 'Footer'].includes(test.name)) {
        errors.push(`Selector "${test.name}" (${test.selector}) not found`);
        console.log(`   ❌ Not found`);
      } else {
        console.log(`   ✅ Found (${elements.length} elements)`);
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('              ENHANCED TYPOGRAPHY VALIDATION             ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test Typography Base (5 properties)
    testCount++;
    console.log(`${testCount}. Testing Enhanced Typography Base`);
    const bodyStyles = await pom.getElementStyles('body');
    const typographyTests = [
      { prop: 'fontFamily', expected: pom.expectedStyles.typography.bodyFont.fontFamily, actual: bodyStyles.fontFamily },
      { prop: 'fontSize', expected: pom.expectedStyles.typography.bodyFont.fontSize, actual: bodyStyles.fontSize },
      { prop: 'lineHeight', expected: pom.expectedStyles.typography.bodyFont.lineHeight, actual: bodyStyles.lineHeight },
      { prop: 'color', expected: pom.expectedStyles.typography.baseColor, actual: bodyStyles.color },
      { prop: 'fontWeight', expected: pom.expectedStyles.typography.baseFontWeight, actual: bodyStyles.fontWeight }
    ];
    
    typographyTests.forEach(test => {
      testCount++;
      if (test.expected instanceof RegExp) {
        if (!test.expected.test(test.actual)) {
          errors.push(`Typography ${test.prop}: ${test.actual} doesn't match pattern ${test.expected}`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      } else {
        if (test.actual !== test.expected) {
          errors.push(`Typography ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      }
    });
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                ENHANCED HERO SECTION                   ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test Hero Section (25 properties)
    testCount++;
    console.log(`${testCount}. Testing Enhanced Hero Section`);
    const heroSectionStyles = await pom.getElementStyles(pom.selectors.heroSection);
    const heroContainerStyles = await pom.getElementStyles(pom.selectors.heroContainer);
    const titleStyles = await pom.getElementStyles(pom.selectors.heroTitle);
    const subtitleStyles = await pom.getElementStyles(pom.selectors.heroSubtitle);
    
    // Hero section tests
    const heroSectionTests = [
      { prop: 'paddingTop', expected: pom.expectedStyles.hero.section.paddingTop, actual: heroSectionStyles?.paddingTop },
      { prop: 'paddingBottom', expected: pom.expectedStyles.hero.section.paddingBottom, actual: heroSectionStyles?.paddingBottom }
    ];
    
    heroSectionTests.forEach(test => {
      testCount++;
      if (test.expected instanceof RegExp) {
        if (!test.expected.test(test.actual)) {
          errors.push(`Hero section ${test.prop}: ${test.actual} doesn't match pattern`);
          console.log(`   ❌ Section ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ Section ${test.prop}: ${test.actual}`);
        }
      } else {
        if (test.actual !== test.expected) {
          errors.push(`Hero section ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ Section ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ Section ${test.prop}: ${test.actual}`);
        }
      }
    });
    
    // Hero container tests  
    const heroContainerTests = [
      { prop: 'maxWidth', expected: pom.expectedStyles.hero.container.maxWidth, actual: heroContainerStyles?.maxWidth },
      { prop: 'paddingLeft', expected: pom.expectedStyles.hero.container.paddingLeft, actual: heroContainerStyles?.paddingLeft },
      { prop: 'paddingRight', expected: pom.expectedStyles.hero.container.paddingRight, actual: heroContainerStyles?.paddingRight }
    ];
    
    heroContainerTests.forEach(test => {
      testCount++;
      if (test.expected instanceof RegExp) {
        if (!test.expected.test(test.actual)) {
          errors.push(`Hero container ${test.prop}: ${test.actual} doesn't match pattern`);
          console.log(`   ❌ Container ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ Container ${test.prop}: ${test.actual}`);
        }
      } else {
        if (test.actual && !test.actual.includes(test.expected.replace('px', ''))) {
          errors.push(`Hero container ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ Container ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ Container ${test.prop}: ${test.actual}`);
        }
      }
    });
    
    // Hero title tests (10 properties)
    const heroTitleTests = [
      { prop: 'fontSize', expected: pom.expectedStyles.hero.title.fontSize, actual: titleStyles?.fontSize },
      { prop: 'fontWeight', expected: pom.expectedStyles.hero.title.fontWeight, actual: titleStyles?.fontWeight },
      { prop: 'fontFamily', expected: pom.expectedStyles.hero.title.fontFamily, actual: titleStyles?.fontFamily },
      { prop: 'backgroundImage', expected: pom.expectedStyles.hero.title.backgroundImage, actual: titleStyles?.backgroundImage },
      { prop: 'letterSpacing', expected: pom.expectedStyles.hero.title.letterSpacing, actual: titleStyles?.letterSpacing },
      { prop: 'lineHeight', expected: pom.expectedStyles.hero.title.lineHeight, actual: titleStyles?.lineHeight },
      { prop: 'color', expected: pom.expectedStyles.hero.title.color, actual: titleStyles?.color },
      { prop: 'webkitTextFillColor', expected: pom.expectedStyles.hero.title.webkitTextFillColor, actual: titleStyles?.webkitTextFillColor },
      { prop: 'webkitBackgroundClip', expected: pom.expectedStyles.hero.title.webkitBackgroundClip, actual: titleStyles?.webkitBackgroundClip },
      { prop: 'backgroundClip', expected: pom.expectedStyles.hero.title.backgroundClip, actual: titleStyles?.backgroundClip }
    ];
    
    heroTitleTests.forEach(test => {
      testCount++;
      if (test.expected instanceof RegExp) {
        if (!test.expected.test(test.actual)) {
          errors.push(`Hero title ${test.prop}: ${test.actual} doesn't match pattern`);
          console.log(`   ❌ Title ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ Title ${test.prop}: ${test.actual}`);
        }
      } else {
        if (test.actual !== test.expected) {
          errors.push(`Hero title ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ Title ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ Title ${test.prop}: ${test.actual}`);
        }
      }
    });
    
    // Hero subtitle tests (6 properties)
    const heroSubtitleTests = [
      { prop: 'fontSize', expected: pom.expectedStyles.hero.subtitle.fontSize, actual: subtitleStyles?.fontSize },
      { prop: 'fontWeight', expected: pom.expectedStyles.hero.subtitle.fontWeight, actual: subtitleStyles?.fontWeight },
      { prop: 'color', expected: pom.expectedStyles.hero.subtitle.color, actual: subtitleStyles?.color },
      { prop: 'lineHeight', expected: pom.expectedStyles.hero.subtitle.lineHeight, actual: subtitleStyles?.lineHeight },
      { prop: 'fontFamily', expected: pom.expectedStyles.hero.subtitle.fontFamily, actual: subtitleStyles?.fontFamily },
      { prop: 'marginTop', expected: pom.expectedStyles.hero.subtitle.marginTop, actual: subtitleStyles?.marginTop }
    ];
    
    heroSubtitleTests.forEach(test => {
      testCount++;
      if (test.expected instanceof RegExp) {
        if (!test.expected.test(test.actual)) {
          errors.push(`Hero subtitle ${test.prop}: ${test.actual} doesn't match pattern`);
          console.log(`   ❌ Subtitle ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ Subtitle ${test.prop}: ${test.actual}`);
        }
      } else {
        if (test.actual !== test.expected) {
          errors.push(`Hero subtitle ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ Subtitle ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ Subtitle ${test.prop}: ${test.actual}`);
        }
      }
    });
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('              ENHANCED BUTTON VALIDATION                ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test Enhanced Button Styles (35 properties)
    testCount++;
    console.log(`${testCount}. Testing Enhanced Button Styles`);
    
    // Primary button tests
    const primaryButton = await page.$(pom.selectors.heroCTAButton);
    if (primaryButton) {
      const primaryButtonStyles = await pom.getElementStyles(pom.selectors.heroCTAButton);
      const primaryButtonTests = [
        { prop: 'backgroundColor', expected: pom.expectedStyles.buttons.primary.backgroundColor, actual: primaryButtonStyles.backgroundColor },
        { prop: 'color', expected: pom.expectedStyles.buttons.primary.color, actual: primaryButtonStyles.color },
        { prop: 'borderRadius', expected: pom.expectedStyles.buttons.primary.borderRadius, actual: primaryButtonStyles.borderRadius },
        { prop: 'fontSize', expected: pom.expectedStyles.buttons.primary.fontSize, actual: primaryButtonStyles.fontSize },
        { prop: 'fontWeight', expected: pom.expectedStyles.buttons.primary.fontWeight, actual: primaryButtonStyles.fontWeight },
        { prop: 'padding', expected: pom.expectedStyles.buttons.primary.padding, actual: primaryButtonStyles.padding },
        { prop: 'border', expected: pom.expectedStyles.buttons.primary.border, actual: primaryButtonStyles.border },
        { prop: 'boxShadow', expected: pom.expectedStyles.buttons.primary.boxShadow, actual: primaryButtonStyles.boxShadow },
        { prop: 'cursor', expected: pom.expectedStyles.buttons.primary.cursor, actual: primaryButtonStyles.cursor }
      ];
      
      primaryButtonTests.forEach(test => {
        testCount++;
        if (test.expected instanceof RegExp) {
          if (!test.expected.test(test.actual)) {
            errors.push(`Primary button ${test.prop}: ${test.actual} doesn't match pattern`);
            console.log(`   ❌ Primary ${test.prop}: ${test.actual}`);
          } else {
            console.log(`   ✅ Primary ${test.prop}: ${test.actual}`);
          }
        } else {
          if (test.actual !== test.expected) {
            errors.push(`Primary button ${test.prop}: ${test.actual} (expected: ${test.expected})`);
            console.log(`   ❌ Primary ${test.prop}: ${test.actual}`);
          } else {
            console.log(`   ✅ Primary ${test.prop}: ${test.actual}`);
          }
        }
      });
    }
    
    // Secondary button tests
    const secondaryButton = await page.$(pom.selectors.loginButton);
    if (secondaryButton) {
      const secondaryButtonStyles = await pom.getElementStyles(pom.selectors.loginButton);
      const secondaryButtonTests = [
        { prop: 'backgroundColor', expected: pom.expectedStyles.buttons.secondary.backgroundColor, actual: secondaryButtonStyles.backgroundColor },
        { prop: 'color', expected: pom.expectedStyles.buttons.secondary.color, actual: secondaryButtonStyles.color },
        { prop: 'borderRadius', expected: pom.expectedStyles.buttons.secondary.borderRadius, actual: secondaryButtonStyles.borderRadius },
        { prop: 'padding', expected: pom.expectedStyles.buttons.secondary.padding, actual: secondaryButtonStyles.padding },
        { prop: 'fontWeight', expected: pom.expectedStyles.buttons.secondary.fontWeight, actual: secondaryButtonStyles.fontWeight },
        { prop: 'border', expected: pom.expectedStyles.buttons.secondary.border, actual: secondaryButtonStyles.border },
        { prop: 'display', expected: pom.expectedStyles.buttons.secondary.display, actual: secondaryButtonStyles.display },
        { prop: 'alignItems', expected: pom.expectedStyles.buttons.secondary.alignItems, actual: secondaryButtonStyles.alignItems },
        { prop: 'justifyContent', expected: pom.expectedStyles.buttons.secondary.justifyContent, actual: secondaryButtonStyles.justifyContent }
      ];
      
      secondaryButtonTests.forEach(test => {
        testCount++;
        if (test.actual !== test.expected) {
          errors.push(`Secondary button ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ Secondary ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ Secondary ${test.prop}: ${test.actual}`);
        }
      });
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('               ENHANCED VALIDATION METHODS              ');
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
    console.log('                      ENHANCED FINAL RESULTS                    ');
    console.log('══════════════════════════════════════════════════════════════\n');
    
    console.log(`📊 Total Elements Tested: ${testCount}`);
    console.log(`📋 Total Properties in Enhanced POM: ${totalProperties}`);
    console.log(`📈 Test Coverage: ${Math.round((testCount / totalProperties) * 100)}%`);
    console.log(`🎯 Target Achievement: ${totalProperties >= 140 ? '✅ ACHIEVED' : '❌ MISSED'} (${totalProperties}/140+ properties)\n`);
    
    if (errors.length === 0) {
      console.log(`🎉 ALL ENHANCED POM ELEMENTS VALIDATED SUCCESSFULLY ON ${siteName} SITE!`);
      console.log(`✅ Enhanced POM accurately captures ${siteName.toLowerCase()} site with 140+ properties`);
    } else {
      console.log(`❌ Found ${errors.length} validation issues out of ${testCount} tests:`);
      console.log(`💯 Success Rate: ${Math.round(((testCount - errors.length) / testCount) * 100)}%\n`);
      
      console.log('ENHANCED POM VALIDATION ERRORS:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
  } catch (error) {
    console.error(`Error during enhanced comprehensive testing on ${siteName}:`, error);
  } finally {
    await browser.close();
  }
}

// Run based on command line argument
const targetUrl = process.argv[2];
const siteName = process.argv[3] || (targetUrl ? 'REFACTORED' : 'ORIGINAL');

enhancedComprehensiveTest(targetUrl, siteName);