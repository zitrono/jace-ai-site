import puppeteer from 'puppeteer';

async function validateRefactorParity() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('🔍 Validating Refactored Site Styles...\n');
  
  try {
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    // Get all styles we need to check
    const styles = await page.evaluate(() => {
      const getStyles = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const styles = window.getComputedStyle(element);
        return {
          // Typography
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          fontFamily: styles.fontFamily,
          lineHeight: styles.lineHeight,
          letterSpacing: styles.letterSpacing,
          textDecoration: styles.textDecoration,
          
          // Colors
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          backgroundImage: styles.backgroundImage,
          webkitTextFillColor: styles.webkitTextFillColor,
          fill: styles.fill,
          
          // Box Model
          padding: styles.padding,
          margin: styles.margin,
          border: styles.border,
          borderRadius: styles.borderRadius,
          borderWidth: styles.borderWidth,
          borderColor: styles.borderColor,
          
          // Effects
          boxShadow: styles.boxShadow,
          opacity: styles.opacity,
          
          // Layout
          width: styles.width,
          height: styles.height,
          maxWidth: styles.maxWidth,
          aspectRatio: styles.aspectRatio,
          
          // Spacing
          marginTop: styles.marginTop,
          paddingTop: styles.paddingTop
        };
      };
      
      return {
        body: getStyles('body'),
        heroTitle: getStyles('h1'),
        heroSubtitle: getStyles('.hero-subtitle'),
        primaryCTA: getStyles('.cta-button-original'),
        loginButton: getStyles('a[href*="signin"]'),
        header: getStyles('header'),
        logo: (() => {
          const logo = document.querySelector('header svg');
          if (!logo) return null;
          const styles = window.getComputedStyle(logo);
          const rect = logo.getBoundingClientRect();
          return {
            fill: styles.fill,
            width: rect.width + 'px',
            height: rect.height + 'px'
          };
        })(),
        casaBadge: (() => {
          const badge = Array.from(document.querySelectorAll('div')).find(el => 
            el.textContent.includes('CASA')
          );
          if (!badge) return null;
          return getStyles(badge);
        })(),
        avatars: getStyles('.flex.-space-x-2 > div'),
        videoContainer: getStyles('.bg-gradient-to-br'),
        companyLogos: getStyles('.opacity-60')
      };
    });
    
    // Print all styles
    console.log('📝 Body Styles:');
    console.log('  Font family:', styles.body?.fontFamily);
    console.log('  Background:', styles.body?.backgroundColor);
    
    console.log('\n🎯 Hero Title:');
    console.log('  Font size:', styles.heroTitle?.fontSize);
    console.log('  Font weight:', styles.heroTitle?.fontWeight);
    console.log('  Letter spacing:', styles.heroTitle?.letterSpacing);
    console.log('  Background image:', styles.heroTitle?.backgroundImage);
    console.log('  Webkit text fill:', styles.heroTitle?.webkitTextFillColor);
    
    console.log('\n📄 Hero Subtitle:');
    console.log('  Font size:', styles.heroSubtitle?.fontSize);
    console.log('  Color:', styles.heroSubtitle?.color);
    
    console.log('\n🔘 Primary CTA:');
    console.log('  Background:', styles.primaryCTA?.backgroundColor);
    console.log('  Color:', styles.primaryCTA?.color);
    console.log('  Border radius:', styles.primaryCTA?.borderRadius);
    console.log('  Box shadow:', styles.primaryCTA?.boxShadow);
    
    console.log('\n🔒 Login Button:');
    console.log('  Background:', styles.loginButton?.backgroundColor);
    console.log('  Color:', styles.loginButton?.color);
    
    console.log('\n🎨 Header:');
    console.log('  Background:', styles.header?.backgroundColor);
    
    console.log('\n🏷️ Logo:');
    console.log('  Fill:', styles.logo?.fill);
    console.log('  Dimensions:', styles.logo?.width, 'x', styles.logo?.height);
    
    console.log('\n🛡️ CASA Badge:');
    console.log('  Background:', styles.casaBadge?.backgroundColor);
    console.log('  Border:', styles.casaBadge?.border);
    console.log('  Border radius:', styles.casaBadge?.borderRadius);
    
    // Check for issues
    const issues = [];
    
    // Typography checks
    if (!styles.body?.fontFamily?.includes('Geist')) {
      issues.push('❌ Missing Geist font in body');
    }
    
    // Color checks
    if (styles.body?.backgroundColor !== 'rgb(40, 40, 40)') {
      issues.push(`❌ Body background: ${styles.body?.backgroundColor} (expected: rgb(40, 40, 40))`);
    }
    
    if (!styles.heroTitle?.backgroundImage?.includes('353deg')) {
      issues.push(`❌ Hero gradient angle: ${styles.heroTitle?.backgroundImage} (expected: 353deg)`);
    }
    
    if (!styles.heroSubtitle?.color?.includes('255, 246, 238')) {
      issues.push(`❌ Subtitle color: ${styles.heroSubtitle?.color} (expected: rgba(255, 246, 238, 0.72))`);
    }
    
    if (!styles.primaryCTA?.backgroundColor?.includes('255, 220')) {
      issues.push(`❌ CTA background: ${styles.primaryCTA?.backgroundColor} (expected: rgb(255, 220, 97))`);
    }
    
    if (styles.primaryCTA?.color !== 'rgb(41, 48, 69)') {
      issues.push(`❌ CTA text color: ${styles.primaryCTA?.color} (expected: rgb(41, 48, 69))`);
    }
    
    // Print results
    console.log('\n\n📊 Validation Results:\n');
    if (issues.length === 0) {
      console.log('✅ All style checks passed!');
    } else {
      console.log(`Found ${issues.length} issues:\n`);
      issues.forEach(issue => console.log(issue));
    }
    
  } catch (error) {
    console.error('Error during validation:', error);
  } finally {
    await browser.close();
  }
}

validateRefactorParity();