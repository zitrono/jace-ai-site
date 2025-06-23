import puppeteer from 'puppeteer';
import fs from 'fs';

async function extractJaceValues() {
  console.log('🔍 Extracting all values from jace.ai...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    await page.goto('https://jace.ai', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract all values comprehensively
    const extractedData = await page.evaluate(() => {
      const data = {
        elements: {},
        styles: {},
        content: {},
        structure: {}
      };
      
      // Helper to get computed styles
      const getStyles = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const styles = window.getComputedStyle(el);
        return {
          // Typography
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          lineHeight: styles.lineHeight,
          letterSpacing: styles.letterSpacing,
          textAlign: styles.textAlign,
          textTransform: styles.textTransform,
          textDecoration: styles.textDecoration,
          
          // Colors
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          borderColor: styles.borderColor,
          
          // Spacing
          padding: styles.padding,
          paddingTop: styles.paddingTop,
          paddingRight: styles.paddingRight,
          paddingBottom: styles.paddingBottom,
          paddingLeft: styles.paddingLeft,
          margin: styles.margin,
          marginTop: styles.marginTop,
          marginRight: styles.marginRight,
          marginBottom: styles.marginBottom,
          marginLeft: styles.marginLeft,
          
          // Dimensions
          width: styles.width,
          height: styles.height,
          minWidth: styles.minWidth,
          minHeight: styles.minHeight,
          maxWidth: styles.maxWidth,
          maxHeight: styles.maxHeight,
          
          // Border
          border: styles.border,
          borderRadius: styles.borderRadius,
          borderWidth: styles.borderWidth,
          borderStyle: styles.borderStyle,
          
          // Display
          display: styles.display,
          position: styles.position,
          opacity: styles.opacity,
          visibility: styles.visibility,
          
          // Flex
          flexDirection: styles.flexDirection,
          justifyContent: styles.justifyContent,
          alignItems: styles.alignItems,
          gap: styles.gap,
          
          // Effects
          boxShadow: styles.boxShadow,
          filter: styles.filter,
          backdropFilter: styles.backdropFilter,
          transform: styles.transform,
          transition: styles.transition,
          
          // Background extras
          backgroundImage: styles.backgroundImage,
          backgroundClip: styles.backgroundClip,
          webkitBackgroundClip: styles.webkitBackgroundClip,
          webkitTextFillColor: styles.webkitTextFillColor
        };
      };
      
      // Extract key elements
      const selectors = {
        // Structure
        body: 'body',
        header: 'header',
        nav: 'nav',
        main: 'main',
        footer: 'footer',
        
        // Hero
        heroSection: 'section:first-of-type',
        heroTitle: 'h1',
        heroSubtitle: 'h1 + p',
        heroCTA: 'button',
        
        // Navigation
        logo: 'header svg',
        navLinks: 'nav a',
        headerCTA: 'header button',
        
        // Trust indicators
        casaBadge: '.bg-\\[\\#353535\\]',
        userCount: 'span',
        
        // Company logos
        companySection: 'section',
        companyText: 'p',
        
        // Features
        featureCards: '.bg-\\[\\#353535\\]',
        featureIcons: '.bg-\\[\\#353535\\] svg',
        
        // Pricing
        pricingSection: '#pricing',
        pricingTitle: '#pricing h2',
        pricingCards: '#pricing .bg-white',
        
        // FAQ
        faqSection: 'section',
        faqTitle: 'h2',
        faqCards: 'div[class*="divide-y"] > div',
        
        // Buttons
        primaryButtons: 'button[class*="bg-surface-highlight"], button[class*="yellow"]',
        secondaryButtons: 'button:not([class*="bg-surface-highlight"]):not([class*="yellow"])'
      };
      
      // Extract styles for each element
      for (const [key, selector] of Object.entries(selectors)) {
        const styles = getStyles(selector);
        if (styles) {
          data.styles[key] = styles;
        }
      }
      
      // Extract text content
      data.content = {
        heroTitle: document.querySelector('h1')?.textContent?.trim(),
        heroSubtitle: document.querySelector('h1 + p')?.textContent?.trim(),
        ctaText: document.querySelector('button')?.textContent?.trim(),
        navItems: Array.from(document.querySelectorAll('nav a')).map(a => a.textContent?.trim()),
        companyText: document.querySelector('p')?.textContent?.trim(),
        faqQuestions: Array.from(document.querySelectorAll('button[aria-expanded]')).map(b => b.textContent?.trim()),
        footerLinks: Array.from(document.querySelectorAll('footer a')).map(a => a.textContent?.trim())
      };
      
      // Check what sections exist
      data.structure = {
        hasHero: !!document.querySelector('h1'),
        hasFeatures: !!document.querySelector('.bg-\\[\\#353535\\]'),
        hasPricing: !!document.querySelector('#pricing'),
        hasTestimonials: Array.from(document.querySelectorAll('h2')).some(h => h.textContent?.toLowerCase().includes('testimonial')),
        hasFAQ: !!document.querySelector('button[aria-expanded]'),
        hasFooter: !!document.querySelector('footer'),
        hasCookieBanner: !!document.querySelector('[class*="cookie"]')
      };
      
      // Extract specific values that vary
      data.elements = {
        // Colors
        bodyBg: getStyles('body')?.backgroundColor,
        primaryButtonBg: getStyles('button')?.backgroundColor,
        cardBg: getStyles('.bg-\\[\\#353535\\]')?.backgroundColor,
        
        // Typography
        heroTitleSize: getStyles('h1')?.fontSize,
        heroTitleWeight: getStyles('h1')?.fontWeight,
        bodyFont: getStyles('body')?.fontFamily,
        
        // Spacing
        sectionPadding: getStyles('section')?.padding,
        containerMaxWidth: getStyles('main > div')?.maxWidth,
        
        // Specific elements
        casaBadgeText: document.querySelector('.bg-\\[\\#353535\\]')?.textContent?.trim(),
        userCountText: Array.from(document.querySelectorAll('span')).find(s => s.textContent?.includes('Join'))?.textContent?.trim()
      };
      
      return data;
    });
    
    // Save extracted data
    const outputPath = '/Users/zitrono/dev/web/ralph-web/jace-ai-site/tests/jace-extracted-values.json';
    fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2));
    
    console.log('✅ Extraction complete! Saved to jace-extracted-values.json');
    
    // Print summary
    console.log('\n📊 EXTRACTION SUMMARY:');
    console.log(`Styles extracted: ${Object.keys(extractedData.styles).length}`);
    console.log(`Content items: ${Object.keys(extractedData.content).length}`);
    console.log(`\n🏗️ Structure found on jace.ai:`);
    Object.entries(extractedData.structure).forEach(([key, value]) => {
      console.log(`  ${key}: ${value ? '✅' : '❌'}`);
    });
    
    console.log('\n🎨 Key values:');
    console.log(`  Body BG: ${extractedData.elements.bodyBg}`);
    console.log(`  Hero Title Size: ${extractedData.elements.heroTitleSize}`);
    console.log(`  Primary Button BG: ${extractedData.elements.primaryButtonBg}`);
    console.log(`  CASA Badge: "${extractedData.elements.casaBadgeText}"`);
    console.log(`  User Count: "${extractedData.elements.userCountText}"`);
    
    return extractedData;
    
  } catch (error) {
    console.error('Extraction error:', error);
  } finally {
    await browser.close();
  }
}

// Run extraction
extractJaceValues().then(data => {
  console.log('\n🔄 Next steps:');
  console.log('1. Review jace-extracted-values.json');
  console.log('2. Update POM with these exact values');
  console.log('3. Ensure ralph matches these values (except unique elements)');
}).catch(console.error);