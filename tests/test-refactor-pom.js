import puppeteer from 'puppeteer';
import { OriginalJaceAISite } from './original-site.pom.js';

async function testRefactorAgainstPOM() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('🔍 Testing Refactored Site Against Enhanced POM...\n');
  
  try {
    // Navigate to refactored site
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create POM instance but use it on refactored site
    const pom = new OriginalJaceAISite(page);
    
    // Test all expected styles
    const errors = [];
    
    // Body styles
    console.log('📝 Testing Body Styles...');
    const bodyStyles = await pom.getElementStyles('body');
    if (bodyStyles.backgroundColor !== pom.expectedStyles.body.backgroundColor) {
      errors.push(`Body background: ${bodyStyles.backgroundColor} (expected: ${pom.expectedStyles.body.backgroundColor})`);
    }
    
    // Hero Title
    console.log('🎯 Testing Hero Title...');
    const titleStyles = await pom.getElementStyles(pom.selectors.heroTitle);
    if (titleStyles.fontSize !== pom.expectedStyles.hero.title.fontSize) {
      errors.push(`Title font size: ${titleStyles.fontSize} (expected: ${pom.expectedStyles.hero.title.fontSize})`);
    }
    if (titleStyles.letterSpacing !== pom.expectedStyles.hero.title.letterSpacing) {
      errors.push(`Title letter spacing: ${titleStyles.letterSpacing} (expected: ${pom.expectedStyles.hero.title.letterSpacing})`);
    }
    if (!pom.expectedStyles.hero.title.backgroundImage.test(titleStyles.backgroundImage)) {
      errors.push(`Title gradient: ${titleStyles.backgroundImage} doesn't match expected pattern`);
    }
    
    // Hero Subtitle
    console.log('📄 Testing Hero Subtitle...');
    const subtitleStyles = await pom.getElementStyles('.hero-subtitle');
    if (subtitleStyles) {
      if (!pom.expectedStyles.hero.subtitle.color.test(subtitleStyles.color)) {
        errors.push(`Subtitle color: ${subtitleStyles.color} doesn't match expected pattern`);
      }
      if (subtitleStyles.fontSize !== pom.expectedStyles.hero.subtitle.fontSize) {
        errors.push(`Subtitle font size: ${subtitleStyles.fontSize} (expected: ${pom.expectedStyles.hero.subtitle.fontSize})`);
      }
    }
    
    // Primary CTA Button
    console.log('🔘 Testing Primary CTA...');
    const ctaStyles = await pom.getElementStyles('.cta-button-original');
    if (ctaStyles) {
      if (!pom.expectedStyles.hero.ctaButton.backgroundColor.test(ctaStyles.backgroundColor)) {
        errors.push(`CTA background: ${ctaStyles.backgroundColor} doesn't match expected pattern`);
      }
      if (!pom.expectedStyles.hero.ctaButton.color.test(ctaStyles.color)) {
        errors.push(`CTA text color: ${ctaStyles.color} doesn't match expected pattern`);
      }
      if (ctaStyles.borderRadius !== pom.expectedStyles.hero.ctaButton.borderRadius) {
        errors.push(`CTA border radius: ${ctaStyles.borderRadius} (expected: ${pom.expectedStyles.hero.ctaButton.borderRadius})`);
      }
    }
    
    // Secondary Button
    console.log('🔒 Testing Secondary Button...');
    const loginStyles = await pom.getElementStyles(pom.selectors.loginButton);
    if (loginStyles) {
      if (loginStyles.backgroundColor !== pom.expectedStyles.buttons.secondary.backgroundColor) {
        errors.push(`Login button background: ${loginStyles.backgroundColor} (expected: ${pom.expectedStyles.buttons.secondary.backgroundColor})`);
      }
    }
    
    // Header
    console.log('🎨 Testing Header...');
    const headerStyles = await pom.getElementStyles(pom.selectors.header);
    if (!pom.expectedStyles.header.background.backgroundColor.test(headerStyles.backgroundColor)) {
      errors.push(`Header background: ${headerStyles.backgroundColor} doesn't match expected pattern`);
    }
    
    // Logo
    console.log('🏷️ Testing Logo...');
    const logoElement = await page.$(pom.selectors.logo);
    if (logoElement) {
      const logoBox = await logoElement.boundingBox();
      if (Math.abs(logoBox.width - 70) > 1) {
        errors.push(`Logo width: ${logoBox.width}px (expected: 70px)`);
      }
    }
    
    // CASA Badge
    console.log('🛡️ Testing CASA Badge...');
    const badgeStyles = await pom.getElementStyles('.casa-badge');
    if (badgeStyles) {
      if (badgeStyles.backgroundColor !== pom.expectedStyles.badges.casa.backgroundColor) {
        errors.push(`CASA badge background: ${badgeStyles.backgroundColor} (expected: ${pom.expectedStyles.badges.casa.backgroundColor})`);
      }
    }
    
    // Trust Indicators
    console.log('👥 Testing Trust Indicators...');
    const avatarStyles = await pom.getElementStyles('.avatar-circle');
    if (avatarStyles) {
      if (avatarStyles.width !== pom.expectedStyles.trust.avatarSize) {
        errors.push(`Avatar size: ${avatarStyles.width} (expected: ${pom.expectedStyles.trust.avatarSize})`);
      }
    }
    
    // Video Container
    console.log('📹 Testing Video Container...');
    const videoStyles = await pom.getElementStyles('.video-gradient');
    if (videoStyles) {
      if (!pom.expectedStyles.video.container.backgroundImage.test(videoStyles.backgroundImage)) {
        errors.push(`Video gradient: ${videoStyles.backgroundImage} doesn't match expected pattern`);
      }
    }
    
    // Company Logos
    console.log('🏢 Testing Company Logos...');
    const companyLogoStyles = await page.evaluate(() => {
      const logo = document.querySelector('.company-logos-opacity');
      if (!logo) return null;
      return window.getComputedStyle(logo).opacity;
    });
    if (companyLogoStyles !== '0.8') {
      errors.push(`Company logos opacity: ${companyLogoStyles} (expected: 0.8)`);
    }
    
    // Print results
    console.log('\n\n📊 POM Test Results:\n');
    
    if (errors.length === 0) {
      console.log('✅ All POM style checks passed!');
    } else {
      console.log(`❌ Found ${errors.length} style mismatches:\n`);
      errors.forEach(error => console.log(`  - ${error}`));
    }
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
}

testRefactorAgainstPOM();