// Extract exact background colors and button padding from original site
import puppeteer from 'puppeteer';

async function extractBackgroundsAndPadding() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('🔍 Extracting backgrounds and button padding from original site...\n');
  
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  
  // 1. Extract all section backgrounds
  console.log('📦 Section Backgrounds:');
  const sectionBackgrounds = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    const mainBg = window.getComputedStyle(document.querySelector('main')).backgroundColor;
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    
    const results = sections.map((section, index) => {
      const styles = window.getComputedStyle(section);
      const heading = section.querySelector('h2');
      const id = section.id || section.className || `section-${index}`;
      
      return {
        id,
        heading: heading ? heading.textContent.trim() : 'No heading',
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        hasGradient: styles.backgroundImage !== 'none'
      };
    });
    
    return {
      body: bodyBg,
      main: mainBg,
      sections: results
    };
  });
  
  console.log('Body background:', sectionBackgrounds.body);
  console.log('Main background:', sectionBackgrounds.main);
  console.log('\nSections:');
  sectionBackgrounds.sections.forEach(s => {
    console.log(`- ${s.id}: ${s.backgroundColor} ${s.hasGradient ? '(has gradient)' : ''}`);
    console.log(`  Heading: "${s.heading}"`);
  });
  
  // 2. Extract all "Get Started for Free" button padding
  console.log('\n\n📱 Button Padding (Get Started for Free):');
  const buttonPadding = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
      .filter(btn => btn.textContent.includes('Get Started'));
    
    return buttons.map((btn, index) => {
      const styles = window.getComputedStyle(btn);
      const rect = btn.getBoundingClientRect();
      
      return {
        index,
        text: btn.textContent.trim(),
        padding: styles.padding,
        paddingTop: styles.paddingTop,
        paddingBottom: styles.paddingBottom,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        height: styles.height,
        computedHeight: rect.height + 'px',
        lineHeight: styles.lineHeight,
        fontSize: styles.fontSize,
        boxSizing: styles.boxSizing,
        className: btn.className
      };
    });
  });
  
  buttonPadding.forEach(btn => {
    console.log(`\nButton ${btn.index}:`);
    console.log(`  Padding: ${btn.padding}`);
    console.log(`  Padding breakdown: ${btn.paddingTop} ${btn.paddingRight} ${btn.paddingBottom} ${btn.paddingLeft}`);
    console.log(`  Height: ${btn.height} (computed: ${btn.computedHeight})`);
    console.log(`  Line height: ${btn.lineHeight}`);
    console.log(`  Font size: ${btn.fontSize}`);
    console.log(`  Box sizing: ${btn.boxSizing}`);
  });
  
  // 3. Check specific known sections
  console.log('\n\n🎯 Specific Sections:');
  const specificSections = await page.evaluate(() => {
    const results = {};
    
    // Hero section (usually first section or main > div)
    const hero = document.querySelector('main > section:first-child') || 
                 document.querySelector('main > div:first-child');
    if (hero) {
      results.hero = {
        tag: hero.tagName,
        backgroundColor: window.getComputedStyle(hero).backgroundColor,
        backgroundImage: window.getComputedStyle(hero).backgroundImage
      };
    }
    
    // Features section
    const features = Array.from(document.querySelectorAll('section'))
      .find(s => s.textContent.includes('Auto-drafts') || s.textContent.includes('Save hours'));
    if (features) {
      results.features = {
        backgroundColor: window.getComputedStyle(features).backgroundColor,
        backgroundImage: window.getComputedStyle(features).backgroundImage
      };
    }
    
    // Pricing section
    const pricing = document.querySelector('#pricing');
    if (pricing) {
      results.pricing = {
        backgroundColor: window.getComputedStyle(pricing).backgroundColor,
        backgroundImage: window.getComputedStyle(pricing).backgroundImage
      };
    }
    
    // FAQ section
    const faq = Array.from(document.querySelectorAll('section'))
      .find(s => s.textContent.includes('Frequently asked questions'));
    if (faq) {
      results.faq = {
        backgroundColor: window.getComputedStyle(faq).backgroundColor,
        backgroundImage: window.getComputedStyle(faq).backgroundImage
      };
    }
    
    return results;
  });
  
  console.log('Specific sections:', JSON.stringify(specificSections, null, 2));
  
  // Save to file
  const data = {
    backgrounds: sectionBackgrounds,
    buttonPadding,
    specificSections
  };
  
  const fs = await import('fs/promises');
  await fs.writeFile(
    'original-backgrounds-padding.json',
    JSON.stringify(data, null, 2)
  );
  
  console.log('\n✅ Data saved to original-backgrounds-padding.json');
  
  await browser.close();
}

extractBackgroundsAndPadding().catch(console.error);