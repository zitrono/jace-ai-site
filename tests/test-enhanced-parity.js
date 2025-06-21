import puppeteer from 'puppeteer';
import { OriginalJaceAISite } from './original-site.pom.js';

async function testEnhancedParity() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const originalPage = await browser.newPage();
  const refactoredPage = await browser.newPage();
  
  await originalPage.setViewport({ width: 1280, height: 800 });
  await refactoredPage.setViewport({ width: 1280, height: 800 });
  
  const originalPOM = new OriginalJaceAISite(originalPage);
  
  console.log('🔍 Testing Enhanced Style Parity...\n');
  
  try {
    // Navigate to both sites
    await originalPOM.navigate();
    await refactoredPage.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
    await originalPage.waitForTimeout(2000);
    await refactoredPage.waitForTimeout(2000);
    
    const issues = [];
    
    // Test Typography Base
    console.log('📝 Testing Typography Base...');
    const origBodyStyles = await originalPOM.getElementStyles('body');
    const refBodyStyles = await refactoredPage.evaluate(() => {
      const body = document.querySelector('body');
      if (!body) return null;
      const styles = window.getComputedStyle(body);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight,
        backgroundColor: styles.backgroundColor
      };
    });
    
    if (!refBodyStyles.fontFamily.includes('Geist')) {
      issues.push('❌ Body font family missing Geist font');
    }
    if (refBodyStyles.backgroundColor !== 'rgb(40, 40, 40)') {
      issues.push(`❌ Body background color: ${refBodyStyles.backgroundColor} (expected: rgb(40, 40, 40))`);
    }
    
    // Test Hero Title
    console.log('🎯 Testing Hero Title...');
    const origTitleStyles = await originalPOM.getElementStyles(originalPOM.selectors.heroTitle);
    const refTitleStyles = await refactoredPage.evaluate(() => {
      const title = document.querySelector('h1');
      if (!title) return null;
      const styles = window.getComputedStyle(title);
      return {
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        fontFamily: styles.fontFamily,
        lineHeight: styles.lineHeight,
        letterSpacing: styles.letterSpacing,
        backgroundImage: styles.backgroundImage,
        color: styles.color,
        webkitTextFillColor: styles.webkitTextFillColor
      };
    });
    
    if (refTitleStyles.fontSize !== '60px') {
      issues.push(`❌ Title font size: ${refTitleStyles.fontSize} (expected: 60px)`);
    }
    if (refTitleStyles.letterSpacing !== '-1.5px') {
      issues.push(`❌ Title letter spacing: ${refTitleStyles.letterSpacing} (expected: -1.5px)`);
    }
    if (!refTitleStyles.backgroundImage.includes('353deg')) {
      issues.push(`❌ Title gradient angle: ${refTitleStyles.backgroundImage} (expected: 353deg)`);
    }
    
    // Test Hero Subtitle
    console.log('📄 Testing Hero Subtitle...');
    const refSubtitleStyles = await refactoredPage.evaluate(() => {
      const subtitle = document.querySelector('.hero-subtitle');
      if (!subtitle) return null;
      const styles = window.getComputedStyle(subtitle);
      return {
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
        marginTop: styles.marginTop
      };
    });
    
    if (refSubtitleStyles && !refSubtitleStyles.color.includes('255, 246, 238')) {
      issues.push(`❌ Subtitle color: ${refSubtitleStyles.color} (expected: rgba(255, 246, 238, 0.72))`);
    }
    
    // Test Primary CTA Button
    console.log('🔘 Testing Primary CTA Button...');
    const refCTAStyles = await refactoredPage.evaluate(() => {
      const cta = document.querySelector('.cta-button-original');
      if (!cta) return null;
      const styles = window.getComputedStyle(cta);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        borderRadius: styles.borderRadius,
        padding: styles.padding,
        border: styles.border,
        boxShadow: styles.boxShadow
      };
    });
    
    if (refCTAStyles) {
      if (!refCTAStyles.backgroundColor.includes('255, 220')) {
        issues.push(`❌ CTA background: ${refCTAStyles.backgroundColor} (expected: rgb(255, 220, 97))`);
      }
      if (refCTAStyles.color !== 'rgb(41, 48, 69)') {
        issues.push(`❌ CTA text color: ${refCTAStyles.color} (expected: rgb(41, 48, 69))`);
      }
      if (refCTAStyles.borderRadius !== '6px') {
        issues.push(`❌ CTA border radius: ${refCTAStyles.borderRadius} (expected: 6px)`);
      }
    }
    
    // Test Secondary Button (Login)
    console.log('🔒 Testing Secondary Button...');
    const refLoginStyles = await refactoredPage.evaluate(() => {
      const login = document.querySelector('a[href*="signin"]');
      if (!login) return null;
      const styles = window.getComputedStyle(login);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderRadius: styles.borderRadius,
        fontWeight: styles.fontWeight
      };
    });
    
    if (refLoginStyles && refLoginStyles.backgroundColor !== 'rgb(65, 65, 65)') {
      issues.push(`❌ Login button background: ${refLoginStyles.backgroundColor} (expected: rgb(65, 65, 65))`);
    }
    
    // Test Header
    console.log('🎨 Testing Header...');
    const refHeaderStyles = await refactoredPage.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return null;
      const styles = window.getComputedStyle(header);
      return {
        backgroundColor: styles.backgroundColor
      };
    });
    
    if (refHeaderStyles && refHeaderStyles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      issues.push(`❌ Header background: ${refHeaderStyles.backgroundColor} (expected: transparent)`);
    }
    
    // Test Logo
    console.log('🏷️ Testing Logo...');
    const refLogoStyles = await refactoredPage.evaluate(() => {
      const logo = document.querySelector('header svg');
      if (!logo) return null;
      const styles = window.getComputedStyle(logo);
      const rect = logo.getBoundingClientRect();
      return {
        fill: styles.fill,
        width: rect.width,
        height: rect.height
      };
    });
    
    if (refLogoStyles && refLogoStyles.fill !== 'rgb(255, 255, 255)') {
      issues.push(`❌ Logo fill: ${refLogoStyles.fill} (expected: rgb(255, 255, 255))`);
    }
    
    // Test CASA Badge
    console.log('🛡️ Testing CASA Badge...');
    const refBadgeStyles = await refactoredPage.evaluate(() => {
      // Find CASA badge by searching for the text
      const badges = Array.from(document.querySelectorAll('div')).find(el => 
        el.textContent.includes('CASA')
      );
      if (!badges) return null;
      const styles = window.getComputedStyle(badges);
      return {
        backgroundColor: styles.backgroundColor,
        border: styles.border,
        borderRadius: styles.borderRadius
      };
    });
    
    if (refBadgeStyles && refBadgeStyles.backgroundColor !== 'rgb(53, 53, 53)') {
      issues.push(`❌ CASA badge background: ${refBadgeStyles.backgroundColor} (expected: rgb(53, 53, 53))`);
    }
    
    // Print results
    console.log('\n\n📊 Enhanced Parity Test Results:\n');
    
    if (issues.length === 0) {
      console.log('✅ All enhanced style checks passed!');
    } else {
      console.log(`Found ${issues.length} style differences:\n`);
      issues.forEach(issue => console.log(issue));
    }
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
}

testEnhancedParity();