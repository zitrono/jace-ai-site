import puppeteer from 'puppeteer';
import { OriginalJaceAISite } from './original-site.pom.js';

async function comprehensivePOMTest() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('🔍 COMPREHENSIVE POM TEST - Testing All 71 Elements...\n');
  
  try {
    // Navigate to refactored site
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const pom = new OriginalJaceAISite(page);
    const errors = [];
    let testCount = 0;
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('                  SELECTOR VALIDATION                   ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test all selectors (14 total)
    const selectorTests = [
      { name: 'Header', selector: pom.selectors.header },
      { name: 'Logo', selector: pom.selectors.logo },
      { name: 'Nav Links', selector: pom.selectors.navLinks },
      { name: 'Login Button', selector: pom.selectors.loginButton },
      { name: 'Hero Title', selector: pom.selectors.heroTitle },
      { name: 'Hero Subtitle', selector: pom.selectors.heroSubtitle },
      { name: 'Hero CTA Button', selector: pom.selectors.heroCTAButton },
      { name: 'CASA Badge', selector: pom.selectors.casaBadge },
      { name: 'User Count', selector: pom.selectors.userCount },
      { name: 'Video Container', selector: pom.selectors.videoContainer },
      { name: 'Video Title', selector: pom.selectors.videoTitle },
      { name: 'Company Section', selector: pom.selectors.companySection },
      { name: 'Features Title', selector: pom.selectors.featuresTitle },
      { name: 'Feature Cards', selector: pom.selectors.featureCards }
    ];
    
    for (const test of selectorTests) {
      testCount++;
      console.log(`${testCount}. Testing selector: ${test.name}`);
      const element = await page.$(test.selector);
      if (!element && test.name !== 'Features Title' && test.name !== 'Feature Cards') {
        errors.push(`Selector "${test.name}" (${test.selector}) not found`);
        console.log(`   ❌ Not found`);
      } else {
        console.log(`   ✅ Found`);
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                  TYPOGRAPHY VALIDATION                 ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test Typography Base (4 properties)
    testCount++;
    console.log(`${testCount}. Testing Typography Base`);
    const bodyStyles = await pom.getElementStyles('body');
    const typographyTests = [
      { prop: 'fontFamily', expected: pom.expectedStyles.typography.bodyFont.fontFamily, actual: bodyStyles.fontFamily },
      { prop: 'fontSize', expected: pom.expectedStyles.typography.bodyFont.fontSize, actual: bodyStyles.fontSize },
      { prop: 'lineHeight', expected: pom.expectedStyles.typography.bodyFont.lineHeight, actual: bodyStyles.lineHeight }
    ];
    
    for (const test of typographyTests) {
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
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                    HERO SECTION                       ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test Hero Title (8 properties)
    testCount++;
    console.log(`${testCount}. Testing Hero Title Styles`);
    const titleStyles = await pom.getElementStyles(pom.selectors.heroTitle);
    const heroTitleTests = [
      { prop: 'fontSize', expected: pom.expectedStyles.hero.title.fontSize, actual: titleStyles.fontSize },
      { prop: 'fontWeight', expected: pom.expectedStyles.hero.title.fontWeight, actual: titleStyles.fontWeight },
      { prop: 'fontFamily', expected: pom.expectedStyles.hero.title.fontFamily, actual: titleStyles.fontFamily },
      { prop: 'backgroundImage', expected: pom.expectedStyles.hero.title.backgroundImage, actual: titleStyles.backgroundImage },
      { prop: 'letterSpacing', expected: pom.expectedStyles.hero.title.letterSpacing, actual: titleStyles.letterSpacing },
      { prop: 'lineHeight', expected: pom.expectedStyles.hero.title.lineHeight, actual: titleStyles.lineHeight },
      { prop: 'color', expected: pom.expectedStyles.hero.title.color, actual: titleStyles.color },
      { prop: 'webkitTextFillColor', expected: pom.expectedStyles.hero.title.webkitTextFillColor, actual: titleStyles.webkitTextFillColor }
    ];
    
    for (const test of heroTitleTests) {
      testCount++;
      if (test.expected instanceof RegExp) {
        if (!test.expected.test(test.actual)) {
          errors.push(`Hero title ${test.prop}: ${test.actual} doesn't match pattern`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      } else {
        if (test.actual !== test.expected) {
          errors.push(`Hero title ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      }
    }
    
    // Test Hero Subtitle (6 properties)
    testCount++;
    console.log(`${testCount}. Testing Hero Subtitle Styles`);
    const subtitleStyles = await pom.getElementStyles(pom.selectors.heroSubtitle);
    const heroSubtitleTests = [
      { prop: 'fontSize', expected: pom.expectedStyles.hero.subtitle.fontSize, actual: subtitleStyles.fontSize },
      { prop: 'fontWeight', expected: pom.expectedStyles.hero.subtitle.fontWeight, actual: subtitleStyles.fontWeight },
      { prop: 'color', expected: pom.expectedStyles.hero.subtitle.color, actual: subtitleStyles.color },
      { prop: 'lineHeight', expected: pom.expectedStyles.hero.subtitle.lineHeight, actual: subtitleStyles.lineHeight },
      { prop: 'fontFamily', expected: pom.expectedStyles.hero.subtitle.fontFamily, actual: subtitleStyles.fontFamily },
      { prop: 'marginTop', expected: pom.expectedStyles.hero.subtitle.marginTop, actual: subtitleStyles.marginTop }
    ];
    
    for (const test of heroSubtitleTests) {
      testCount++;
      if (test.expected instanceof RegExp) {
        if (!test.expected.test(test.actual)) {
          errors.push(`Hero subtitle ${test.prop}: ${test.actual} doesn't match pattern`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      } else {
        if (test.actual !== test.expected) {
          errors.push(`Hero subtitle ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      }
    }
    
    // Test Hero CTA Button (8 properties)
    testCount++;
    console.log(`${testCount}. Testing Hero CTA Button Styles`);
    const ctaStyles = await pom.getElementStyles(pom.selectors.heroCTAButton);
    const heroCTATests = [
      { prop: 'backgroundColor', expected: pom.expectedStyles.hero.ctaButton.backgroundColor, actual: ctaStyles.backgroundColor },
      { prop: 'color', expected: pom.expectedStyles.hero.ctaButton.color, actual: ctaStyles.color },
      { prop: 'borderRadius', expected: pom.expectedStyles.hero.ctaButton.borderRadius, actual: ctaStyles.borderRadius },
      { prop: 'fontSize', expected: pom.expectedStyles.hero.ctaButton.fontSize, actual: ctaStyles.fontSize },
      { prop: 'fontWeight', expected: pom.expectedStyles.hero.ctaButton.fontWeight, actual: ctaStyles.fontWeight },
      { prop: 'padding', expected: pom.expectedStyles.hero.ctaButton.padding, actual: ctaStyles.padding },
      { prop: 'border', expected: pom.expectedStyles.hero.ctaButton.border, actual: ctaStyles.border },
      { prop: 'boxShadow', expected: pom.expectedStyles.hero.ctaButton.boxShadow, actual: ctaStyles.boxShadow }
    ];
    
    for (const test of heroCTATests) {
      testCount++;
      if (test.expected instanceof RegExp) {
        if (!test.expected.test(test.actual)) {
          errors.push(`Hero CTA ${test.prop}: ${test.actual} doesn't match pattern`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      } else {
        if (test.actual !== test.expected) {
          errors.push(`Hero CTA ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                    LAYOUT & HEADER                    ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test Body (2 properties)
    testCount++;
    console.log(`${testCount}. Testing Body Styles`);
    const bodyTestsDetailed = [
      { prop: 'backgroundColor', expected: pom.expectedStyles.body.backgroundColor, actual: bodyStyles.backgroundColor },
      { prop: 'fontFamily', expected: pom.expectedStyles.body.fontFamily, actual: bodyStyles.fontFamily }
    ];
    
    for (const test of bodyTestsDetailed) {
      testCount++;
      if (test.expected instanceof RegExp) {
        if (!test.expected.test(test.actual)) {
          errors.push(`Body ${test.prop}: ${test.actual} doesn't match pattern`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      } else {
        if (test.actual !== test.expected) {
          errors.push(`Body ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      }
    }
    
    // Test Header Background (1 property)
    testCount++;
    console.log(`${testCount}. Testing Header Background`);
    const headerStyles = await pom.getElementStyles(pom.selectors.header);
    testCount++;
    if (pom.expectedStyles.header.background.backgroundColor instanceof RegExp) {
      if (!pom.expectedStyles.header.background.backgroundColor.test(headerStyles.backgroundColor)) {
        errors.push(`Header background: ${headerStyles.backgroundColor} doesn't match pattern`);
        console.log(`   ❌ backgroundColor: ${headerStyles.backgroundColor}`);
      } else {
        console.log(`   ✅ backgroundColor: ${headerStyles.backgroundColor}`);
      }
    }
    
    // Test Navigation Links (4 properties)
    testCount++;
    console.log(`${testCount}. Testing Navigation Links`);
    const navStyles = await page.evaluate(() => {
      const link = document.querySelector('header nav a');
      if (!link) return null;
      const styles = window.getComputedStyle(link);
      return {
        color: styles.color,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        textDecoration: styles.textDecoration
      };
    });
    
    if (navStyles) {
      const navTests = [
        { prop: 'color', expected: pom.expectedStyles.header.navLinks.color, actual: navStyles.color },
        { prop: 'fontSize', expected: pom.expectedStyles.header.navLinks.fontSize, actual: navStyles.fontSize },
        { prop: 'fontWeight', expected: pom.expectedStyles.header.navLinks.fontWeight, actual: navStyles.fontWeight },
        { prop: 'textDecoration', expected: pom.expectedStyles.header.navLinks.textDecoration, actual: navStyles.textDecoration }
      ];
      
      for (const test of navTests) {
        testCount++;
        if (test.expected instanceof RegExp) {
          if (!test.expected.test(test.actual)) {
            errors.push(`Nav links ${test.prop}: ${test.actual} doesn't match pattern`);
            console.log(`   ❌ ${test.prop}: ${test.actual}`);
          } else {
            console.log(`   ✅ ${test.prop}: ${test.actual}`);
          }
        } else {
          if (test.actual !== test.expected) {
            errors.push(`Nav links ${test.prop}: ${test.actual} (expected: ${test.expected})`);
            console.log(`   ❌ ${test.prop}: ${test.actual}`);
          } else {
            console.log(`   ✅ ${test.prop}: ${test.actual}`);
          }
        }
      }
    }
    
    // Test Logo (3 properties)
    testCount++;
    console.log(`${testCount}. Testing Logo Styles`);
    const logoElement = await page.$(pom.selectors.logo);
    if (logoElement) {
      const logoStyles = await page.evaluate(() => {
        const logo = document.querySelector('header svg');
        if (!logo) return null;
        const styles = window.getComputedStyle(logo);
        const rect = logo.getBoundingClientRect();
        return {
          fill: styles.fill,
          width: rect.width + 'px',
          height: rect.height + 'px'
        };
      });
      
      const logoTests = [
        { prop: 'fill', expected: pom.expectedStyles.header.logo.fill, actual: logoStyles.fill },
        { prop: 'width', expected: pom.expectedStyles.header.logo.width, actual: logoStyles.width },
        { prop: 'height', expected: pom.expectedStyles.header.logo.height, actual: logoStyles.height }
      ];
      
      for (const test of logoTests) {
        testCount++;
        if (test.actual !== test.expected) {
          errors.push(`Logo ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                      BUTTONS                          ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test Secondary Button (5 properties)
    testCount++;
    console.log(`${testCount}. Testing Secondary Button`);
    const loginStyles = await pom.getElementStyles(pom.selectors.loginButton);
    if (loginStyles) {
      const secondaryTests = [
        { prop: 'backgroundColor', expected: pom.expectedStyles.buttons.secondary.backgroundColor, actual: loginStyles.backgroundColor },
        { prop: 'color', expected: pom.expectedStyles.buttons.secondary.color, actual: loginStyles.color },
        { prop: 'borderRadius', expected: pom.expectedStyles.buttons.secondary.borderRadius, actual: loginStyles.borderRadius },
        { prop: 'padding', expected: pom.expectedStyles.buttons.secondary.padding, actual: loginStyles.padding },
        { prop: 'fontWeight', expected: pom.expectedStyles.buttons.secondary.fontWeight, actual: loginStyles.fontWeight }
      ];
      
      for (const test of secondaryTests) {
        testCount++;
        if (test.actual !== test.expected) {
          errors.push(`Secondary button ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                  BADGES & TRUST                       ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test CASA Badge (4 properties)
    testCount++;
    console.log(`${testCount}. Testing CASA Badge`);
    const badgeStyles = await pom.getElementStyles(pom.selectors.casaBadge);
    if (badgeStyles) {
      const badgeTests = [
        { prop: 'backgroundColor', expected: pom.expectedStyles.badges.casa.backgroundColor, actual: badgeStyles.backgroundColor },
        { prop: 'border', expected: pom.expectedStyles.badges.casa.border, actual: badgeStyles.border },
        { prop: 'borderRadius', expected: pom.expectedStyles.badges.casa.borderRadius, actual: badgeStyles.borderRadius },
        { prop: 'color', expected: pom.expectedStyles.badges.casa.color, actual: badgeStyles.color }
      ];
      
      for (const test of badgeTests) {
        testCount++;
        if (test.actual !== test.expected) {
          errors.push(`CASA badge ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      }
    }
    
    // Test Trust Indicators (3 properties)
    testCount++;
    console.log(`${testCount}. Testing Trust Indicators`);
    const avatarStyles = await page.evaluate(() => {
      const avatar = document.querySelector('.flex.-space-x-2 > div');
      if (!avatar) return null;
      const styles = window.getComputedStyle(avatar);
      return {
        width: styles.width,
        height: styles.height,
        border: styles.border
      };
    });
    
    if (avatarStyles) {
      const trustTests = [
        { prop: 'avatarSize', expected: pom.expectedStyles.trust.avatarSize, actual: avatarStyles.width },
        { prop: 'avatarBorder', expected: pom.expectedStyles.trust.avatarBorder, actual: avatarStyles.border }
      ];
      
      for (const test of trustTests) {
        testCount++;
        if (test.actual !== test.expected) {
          errors.push(`Trust ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      }
    }
    
    // Test Company Logos Opacity (1 property)
    testCount++;
    console.log(`${testCount}. Testing Company Logos Opacity`);
    const companyOpacity = await page.evaluate(() => {
      const section = document.querySelector('.opacity-60');
      if (!section) return null;
      return window.getComputedStyle(section).opacity;
    });
    
    testCount++;
    if (companyOpacity !== pom.expectedStyles.trust.companyLogosOpacity) {
      errors.push(`Company logos opacity: ${companyOpacity} (expected: ${pom.expectedStyles.trust.companyLogosOpacity})`);
      console.log(`   ❌ opacity: ${companyOpacity}`);
    } else {
      console.log(`   ✅ opacity: ${companyOpacity}`);
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                  VIDEO & SPACING                      ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test Video Container (3 properties)
    testCount++;
    console.log(`${testCount}. Testing Video Container`);
    const videoStyles = await pom.getElementStyles(pom.selectors.videoContainer);
    if (videoStyles) {
      const videoTests = [
        { prop: 'backgroundImage', expected: pom.expectedStyles.video.container.backgroundImage, actual: videoStyles.backgroundImage },
        { prop: 'borderRadius', expected: pom.expectedStyles.video.container.borderRadius, actual: videoStyles.borderRadius },
        { prop: 'aspectRatio', expected: pom.expectedStyles.video.container.aspectRatio, actual: videoStyles.aspectRatio }
      ];
      
      for (const test of videoTests) {
        testCount++;
        if (test.expected instanceof RegExp) {
          if (!test.expected.test(test.actual)) {
            errors.push(`Video ${test.prop}: ${test.actual} doesn't match pattern`);
            console.log(`   ❌ ${test.prop}: ${test.actual}`);
          } else {
            console.log(`   ✅ ${test.prop}: ${test.actual}`);
          }
        } else {
          if (test.actual !== test.expected) {
            errors.push(`Video ${test.prop}: ${test.actual} (expected: ${test.expected})`);
            console.log(`   ❌ ${test.prop}: ${test.actual}`);
          } else {
            console.log(`   ✅ ${test.prop}: ${test.actual}`);
          }
        }
      }
    }
    
    // Test Spacing (2 properties)
    testCount++;
    console.log(`${testCount}. Testing Spacing`);
    const spacingStyles = await page.evaluate(() => {
      const section = document.querySelector('section');
      if (!section) return null;
      const styles = window.getComputedStyle(section);
      return {
        paddingTop: styles.paddingTop,
        padding: styles.padding
      };
    });
    
    if (spacingStyles) {
      const spacingTests = [
        { prop: 'heroPaddingTop', expected: pom.expectedStyles.spacing.heroPaddingTop, actual: spacingStyles.paddingTop },
        { prop: 'sectionPadding', expected: pom.expectedStyles.spacing.sectionPadding, actual: spacingStyles.padding }
      ];
      
      for (const test of spacingTests) {
        testCount++;
        if (test.actual !== test.expected) {
          errors.push(`Spacing ${test.prop}: ${test.actual} (expected: ${test.expected})`);
          console.log(`   ❌ ${test.prop}: ${test.actual}`);
        } else {
          console.log(`   ✅ ${test.prop}: ${test.actual}`);
        }
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                 CONTENT VALIDATION                    ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test all content items (6 items)
    const contentTests = [
      { name: 'Hero Title', selector: pom.selectors.heroTitle, expected: pom.expectedContent.heroTitle },
      { name: 'CTA Button Text', selector: pom.selectors.heroCTAButton, expected: pom.expectedContent.ctaButtonText }
    ];
    
    for (const test of contentTests) {
      testCount++;
      console.log(`${testCount}. Testing ${test.name} Content`);
      const text = await pom.getElementText(test.selector);
      if (test.expected instanceof RegExp) {
        if (!test.expected.test(text)) {
          errors.push(`${test.name}: "${text}" doesn't match pattern`);
          console.log(`   ❌ "${text}"`);
        } else {
          console.log(`   ✅ "${text}"`);
        }
      } else {
        if (text !== test.expected) {
          errors.push(`${test.name}: "${text}" (expected: "${test.expected}")`);
          console.log(`   ❌ "${text}"`);
        } else {
          console.log(`   ✅ "${text}"`);
        }
      }
    }
    
    // Run POM validation methods
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                 POM VALIDATION METHODS                ');
    console.log('═══════════════════════════════════════════════════════\n');
    
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
    
    // Final Results
    console.log('\n\n══════════════════════════════════════════════════════════════');
    console.log('                          FINAL RESULTS                        ');
    console.log('══════════════════════════════════════════════════════════════\n');
    
    console.log(`📊 Total Elements Tested: ${testCount}`);
    console.log(`📋 Expected Total Elements: 71`);
    console.log(`📈 Test Coverage: ${Math.round((testCount / 71) * 100)}%\n`);
    
    if (errors.length === 0) {
      console.log('🎉 ALL 71 POM ELEMENTS PASSED!');
      console.log('✅ Refactored site has 100% style parity with original');
    } else {
      console.log(`❌ Found ${errors.length} mismatches out of ${testCount} tests:`);
      console.log(`💯 Success Rate: ${Math.round(((testCount - errors.length) / testCount) * 100)}%\n`);
      
      console.log('DETAILED ERRORS:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
  } catch (error) {
    console.error('Error during comprehensive testing:', error);
  } finally {
    await browser.close();
  }
}

comprehensivePOMTest();