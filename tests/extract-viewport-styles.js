// Extract viewport-specific styles and special backgrounds from original site
import puppeteer from 'puppeteer';

async function extractViewportStyles() {
  console.log('🔍 Extracting viewport styles and backgrounds from jace.ai...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    const results = {};
    
    // Test multiple viewports
    const viewports = [
      { width: 320, height: 568, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop-small' },
      { width: 1920, height: 1080, name: 'desktop-large' }
    ];
    
    for (const viewport of viewports) {
      console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      await page.setViewport({ width: viewport.width, height: viewport.height });
      await page.goto('https://jace.ai', { waitUntil: 'networkidle0' });
      
      const viewportData = await page.evaluate(() => {
        const data = {
          headerButtons: [],
          checkmarks: [],
          faqElements: [],
          sectionBackgrounds: []
        };
        
        // 1. Header buttons - Get Started for Free
        const headerButtons = document.querySelectorAll('header button, header a[class*="btn"]');
        data.headerButtons = Array.from(headerButtons).map(btn => {
          const styles = window.getComputedStyle(btn);
          const text = btn.textContent?.trim();
          if (text?.includes('Get Started') || text?.includes('Free')) {
            return {
              text: text,
              padding: styles.padding,
              paddingLeft: styles.paddingLeft,
              paddingRight: styles.paddingRight,
              fontSize: styles.fontSize,
              display: styles.display,
              visibility: styles.visibility,
              className: btn.className
            };
          }
          return null;
        }).filter(Boolean);
        
        // 2. Checkmarks in pricing sections
        const checkmarks = document.querySelectorAll('svg[class*="check"], [class*="check"] svg, .text-green-400, [fill*="green"]');
        data.checkmarks = Array.from(checkmarks).slice(0, 5).map(check => {
          const styles = window.getComputedStyle(check);
          const parent = check.closest('li, div, span');
          return {
            tagName: check.tagName,
            fill: check.getAttribute('fill'),
            color: styles.color,
            parentText: parent?.textContent?.trim().slice(0, 50),
            className: check.className
          };
        });
        
        // 3. FAQ elements with interactivity
        const faqElements = document.querySelectorAll('[data-state], button[aria-expanded], details, .faq');
        data.faqElements = Array.from(faqElements).map(faq => {
          const styles = window.getComputedStyle(faq);
          return {
            tagName: faq.tagName,
            dataState: faq.getAttribute('data-state'),
            ariaExpanded: faq.getAttribute('aria-expanded'),
            text: faq.textContent?.trim().slice(0, 100),
            cursor: styles.cursor,
            className: faq.className,
            isClickable: faq.onclick !== null || faq.getAttribute('onclick') !== null
          };
        });
        
        // 4. Section backgrounds
        const sections = document.querySelectorAll('section, main > div, [class*="section"]');
        data.sectionBackgrounds = Array.from(sections).map((section, i) => {
          const styles = window.getComputedStyle(section);
          return {
            index: i,
            backgroundColor: styles.backgroundColor,
            backgroundImage: styles.backgroundImage,
            background: styles.background,
            className: section.className,
            hasContent: section.textContent?.trim().length > 10,
            isVisible: styles.display !== 'none' && styles.visibility !== 'hidden'
          };
        }).filter(s => 
          (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') ||
          s.backgroundImage !== 'none' ||
          s.background.includes('gradient')
        );
        
        return data;
      });
      
      results[viewport.name] = viewportData;
    }
    
    console.log('\n📋 VIEWPORT STYLES EXTRACTION:');
    console.log(JSON.stringify(results, null, 2));
    
    await browser.close();
    return results;
    
  } catch (error) {
    await browser.close();
    console.error('❌ Extraction failed:', error.message);
    return null;
  }
}

extractViewportStyles().then(results => {
  if (results) {
    console.log('\n✅ Viewport styles extraction complete');
    
    // Summary analysis
    console.log('\n📊 ANALYSIS SUMMARY:');
    
    Object.keys(results).forEach(viewport => {
      const data = results[viewport];
      console.log(`\n${viewport.toUpperCase()}:`);
      console.log(`  Header Buttons: ${data.headerButtons.length}`);
      console.log(`  Checkmarks: ${data.checkmarks.length}`);
      console.log(`  FAQ Elements: ${data.faqElements.length}`);
      console.log(`  Section Backgrounds: ${data.sectionBackgrounds.length}`);
      
      if (data.headerButtons.length > 0) {
        console.log(`  Sample Button Padding: ${data.headerButtons[0].padding}`);
      }
      
      if (data.checkmarks.length > 0) {
        console.log(`  Sample Checkmark Color: ${data.checkmarks[0].color || data.checkmarks[0].fill}`);
      }
    });
  }
});