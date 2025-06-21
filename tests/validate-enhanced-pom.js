import puppeteer from 'puppeteer';
import { OriginalJaceAISite } from './original-site.pom.js';

async function validateEnhancedPOM() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const pom = new OriginalJaceAISite(page);
  
  console.log('🔍 Validating Enhanced POM against Original Site...\n');
  
  try {
    await pom.navigate();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Validate Typography Base
    console.log('📝 Typography Base:');
    const bodyStyles = await pom.getElementStyles('body');
    console.log('  Body font family:', bodyStyles.fontFamily);
    console.log('  Body font size:', bodyStyles.fontSize);
    console.log('  Body line height:', bodyStyles.lineHeight);
    console.log('  Body background:', bodyStyles.backgroundColor);
    
    // Validate Hero Title
    console.log('\n🎯 Hero Title:');
    const titleStyles = await pom.getElementStyles(pom.selectors.heroTitle);
    console.log('  Font size:', titleStyles.fontSize);
    console.log('  Font weight:', titleStyles.fontWeight);
    console.log('  Font family:', titleStyles.fontFamily);
    console.log('  Line height:', titleStyles.lineHeight);
    console.log('  Letter spacing:', titleStyles.letterSpacing);
    console.log('  Background image:', titleStyles.backgroundImage);
    console.log('  Color:', titleStyles.color);
    console.log('  Webkit text fill:', titleStyles.webkitTextFillColor);
    
    // Validate Hero Subtitle
    console.log('\n📄 Hero Subtitle:');
    const subtitleStyles = await pom.getElementStyles(pom.selectors.heroSubtitle);
    console.log('  Font size:', subtitleStyles.fontSize);
    console.log('  Font weight:', subtitleStyles.fontWeight);
    console.log('  Font family:', subtitleStyles.fontFamily);
    console.log('  Line height:', subtitleStyles.lineHeight);
    console.log('  Color:', subtitleStyles.color);
    console.log('  Margin top:', subtitleStyles.marginTop);
    
    // Validate Primary CTA Button
    console.log('\n🔘 Primary CTA Button:');
    const ctaStyles = await pom.getElementStyles(pom.selectors.heroCTAButton);
    console.log('  Background color:', ctaStyles.backgroundColor);
    console.log('  Text color:', ctaStyles.color);
    console.log('  Font size:', ctaStyles.fontSize);
    console.log('  Font weight:', ctaStyles.fontWeight);
    console.log('  Border radius:', ctaStyles.borderRadius);
    console.log('  Padding:', ctaStyles.padding);
    console.log('  Border:', ctaStyles.border);
    console.log('  Box shadow:', ctaStyles.boxShadow);
    
    // Validate Secondary Button (Login)
    console.log('\n🔒 Secondary Button (Login):');
    const loginStyles = await pom.getElementStyles(pom.selectors.loginButton);
    if (loginStyles) {
      console.log('  Background color:', loginStyles.backgroundColor);
      console.log('  Text color:', loginStyles.color);
      console.log('  Border radius:', loginStyles.borderRadius);
      console.log('  Padding:', loginStyles.padding);
      console.log('  Border:', loginStyles.border);
      console.log('  Font weight:', loginStyles.fontWeight);
    }
    
    // Validate Header
    console.log('\n🎨 Header:');
    const headerStyles = await pom.getElementStyles(pom.selectors.header);
    console.log('  Background color:', headerStyles.backgroundColor);
    
    // Validate Navigation Links
    console.log('\n🔗 Navigation Links:');
    const navLinkStyles = await page.evaluate(() => {
      const link = document.querySelector('header nav a');
      if (!link) return null;
      const styles = window.getComputedStyle(link);
      return {
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        textDecoration: styles.textDecoration
      };
    });
    if (navLinkStyles) {
      console.log('  Font size:', navLinkStyles.fontSize);
      console.log('  Font weight:', navLinkStyles.fontWeight);
      console.log('  Color:', navLinkStyles.color);
      console.log('  Text decoration:', navLinkStyles.textDecoration);
    }
    
    // Validate Logo
    console.log('\n🏷️ Logo:');
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
    if (logoStyles) {
      console.log('  Fill:', logoStyles.fill);
      console.log('  Width:', logoStyles.width);
      console.log('  Height:', logoStyles.height);
    }
    
    // Validate CASA Badge
    console.log('\n🛡️ CASA Badge:');
    const badgeStyles = await pom.getElementStyles(pom.selectors.casaBadge);
    if (badgeStyles) {
      console.log('  Background color:', badgeStyles.backgroundColor);
      console.log('  Border:', badgeStyles.border);
      console.log('  Border radius:', badgeStyles.borderRadius);
      console.log('  Color:', badgeStyles.color);
    }
    
    // Validate Trust Indicators (Avatars)
    console.log('\n👥 Trust Indicators (Avatars):');
    const avatarStyles = await page.evaluate(() => {
      const avatar = document.querySelector('.flex.-space-x-2 > div');
      if (!avatar) return null;
      const styles = window.getComputedStyle(avatar);
      return {
        width: styles.width,
        height: styles.height,
        border: styles.border,
        borderRadius: styles.borderRadius
      };
    });
    if (avatarStyles) {
      console.log('  Size:', avatarStyles.width, 'x', avatarStyles.height);
      console.log('  Border:', avatarStyles.border);
      console.log('  Border radius:', avatarStyles.borderRadius);
    }
    
    // Validate Video Container
    console.log('\n📹 Video Container:');
    const videoStyles = await pom.getElementStyles(pom.selectors.videoContainer);
    if (videoStyles) {
      console.log('  Background image:', videoStyles.backgroundImage);
      console.log('  Border radius:', videoStyles.borderRadius);
      console.log('  Aspect ratio:', videoStyles.aspectRatio);
    }
    
    // Validate Company Logos Section
    console.log('\n🏢 Company Logos:');
    const companySection = await page.evaluate(() => {
      const section = document.querySelector('.opacity-60');
      if (!section) return null;
      const styles = window.getComputedStyle(section);
      return {
        opacity: styles.opacity
      };
    });
    if (companySection) {
      console.log('  Opacity:', companySection.opacity);
    }
    
    // Validate Section Spacing
    console.log('\n📏 Section Spacing:');
    const heroSection = await page.evaluate(() => {
      const section = document.querySelector('section');
      if (!section) return null;
      const styles = window.getComputedStyle(section);
      return {
        paddingTop: styles.paddingTop,
        marginTop: styles.marginTop
      };
    });
    if (heroSection) {
      console.log('  Hero padding top:', heroSection.paddingTop);
      console.log('  Hero margin top:', heroSection.marginTop);
    }
    
    // Run validation
    console.log('\n\n✅ Running Full Validation...\n');
    const results = await pom.validateAll();
    
    Object.entries(results).forEach(([section, errors]) => {
      if (errors.length > 0) {
        console.log(`❌ ${section}:`, errors);
      } else {
        console.log(`✅ ${section}: Passed`);
      }
    });
    
  } catch (error) {
    console.error('Error during validation:', error);
  } finally {
    await browser.close();
  }
}

validateEnhancedPOM();