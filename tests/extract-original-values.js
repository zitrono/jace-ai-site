// Extract exact original values for new POM elements
import puppeteer from 'puppeteer';

async function extractOriginalValues() {
  console.log('🔍 Extracting exact original values from jace.ai...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    const results = {};
    
    // Test multiple viewports to get exact values
    const viewports = [
      { width: 320, height: 568, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      console.log(`📱 Extracting from ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      await page.setViewport({ width: viewport.width, height: viewport.height });
      await page.goto('https://jace.ai', { waitUntil: 'networkidle0' });
      
      const viewportData = await page.evaluate(() => {
        const data = {};
        
        // 1. Header button exact styles
        const headerButtons = Array.from(document.querySelectorAll('header button, header a'))
          .filter(btn => btn.textContent?.includes('Get Started') || btn.textContent?.includes('Free'));
        
        data.headerButtons = headerButtons.map(btn => {
          const styles = window.getComputedStyle(btn);
          return {
            text: btn.textContent?.trim(),
            padding: styles.padding,
            paddingLeft: styles.paddingLeft,
            paddingRight: styles.paddingRight,
            paddingTop: styles.paddingTop,
            paddingBottom: styles.paddingBottom,
            fontSize: styles.fontSize,
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            borderRadius: styles.borderRadius,
            display: styles.display,
            visibility: styles.visibility,
            className: btn.className
          };
        });
        
        // 2. Checkmark exact colors and properties
        const checkmarks = Array.from(document.querySelectorAll('svg'))
          .filter(svg => {
            const parent = svg.closest('li, div');
            const parentText = parent?.textContent?.toLowerCase() || '';
            return parentText.includes('everything') || 
                   parentText.includes('plus') || 
                   parentText.includes('pro') ||
                   parentText.includes('draft') ||
                   parentText.includes('label') ||
                   parentText.includes('email');
          });
        
        data.checkmarks = checkmarks.slice(0, 10).map(svg => {
          const styles = window.getComputedStyle(svg);
          const parent = svg.closest('li, div');
          return {
            fill: svg.getAttribute('fill'),
            stroke: svg.getAttribute('stroke'),
            color: styles.color,
            width: styles.width,
            height: styles.height,
            parentText: parent?.textContent?.trim().slice(0, 100),
            viewBox: svg.getAttribute('viewBox'),
            className: svg.className?.baseVal || svg.className
          };
        });
        
        // 3. FAQ button exact properties
        const faqButtons = Array.from(document.querySelectorAll('button[aria-expanded]'))
          .filter(btn => btn.textContent?.includes('?') || 
                        btn.getAttribute('aria-expanded') !== null);
        
        data.faqButtons = faqButtons.map(btn => {
          const styles = window.getComputedStyle(btn);
          return {
            ariaExpanded: btn.getAttribute('aria-expanded'),
            text: btn.textContent?.trim().slice(0, 100),
            cursor: styles.cursor,
            pointerEvents: styles.pointerEvents,
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            border: styles.border,
            className: btn.className
          };
        });
        
        // 4. Section backgrounds exact values
        const sections = Array.from(document.querySelectorAll('section, main > div, [class*="bg-"]'))
          .filter(section => {
            const styles = window.getComputedStyle(section);
            return styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                   styles.backgroundColor !== 'transparent';
          });
        
        data.sectionBackgrounds = sections.map((section, i) => {
          const styles = window.getComputedStyle(section);
          return {
            index: i,
            backgroundColor: styles.backgroundColor,
            backgroundImage: styles.backgroundImage,
            background: styles.background,
            className: section.className,
            tagName: section.tagName,
            textContent: section.textContent?.trim().slice(0, 200)
          };
        });
        
        // 5. Get all button variations for comprehensive padding check
        const allButtons = Array.from(document.querySelectorAll('button, a[class*="btn"], [role="button"]'))
          .filter(btn => btn.textContent?.trim());
        
        data.allButtons = allButtons.slice(0, 20).map(btn => {
          const styles = window.getComputedStyle(btn);
          return {
            text: btn.textContent?.trim().slice(0, 50),
            padding: styles.padding,
            paddingLeft: styles.paddingLeft,
            paddingRight: styles.paddingRight,
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            fontSize: styles.fontSize,
            display: styles.display,
            className: btn.className,
            tagName: btn.tagName
          };
        });
        
        return data;
      });
      
      results[viewport.name] = viewportData;
    }
    
    console.log('\n📋 ORIGINAL VALUES EXTRACTION:');
    console.log(JSON.stringify(results, null, 2));
    
    await browser.close();
    return results;
    
  } catch (error) {
    await browser.close();
    console.error('❌ Extraction failed:', error.message);
    return null;
  }
}

extractOriginalValues().then(results => {
  if (results) {
    console.log('\n✅ Original values extraction complete');
    
    // Generate exact POM values
    console.log('\n📊 EXACT VALUES FOR POM:');
    
    Object.keys(results).forEach(viewport => {
      const data = results[viewport];
      console.log(`\n${viewport.toUpperCase()}:`);
      
      if (data.headerButtons.length > 0) {
        const btn = data.headerButtons[0];
        console.log(`  Header Button:`);
        console.log(`    padding: '${btn.padding}'`);
        console.log(`    backgroundColor: '${btn.backgroundColor}'`);
        console.log(`    color: '${btn.color}'`);
        console.log(`    fontSize: '${btn.fontSize}'`);
        console.log(`    borderRadius: '${btn.borderRadius}'`);
      }
      
      if (data.checkmarks.length > 0) {
        const check = data.checkmarks[0];
        console.log(`  Checkmark:`);
        console.log(`    color: '${check.color}'`);
        console.log(`    fill: '${check.fill}'`);
        console.log(`    stroke: '${check.stroke}'`);
      }
      
      if (data.faqButtons.length > 0) {
        const faq = data.faqButtons[0];
        console.log(`  FAQ Button:`);
        console.log(`    ariaExpanded: '${faq.ariaExpanded}'`);
        console.log(`    cursor: '${faq.cursor}'`);
        console.log(`    pointerEvents: '${faq.pointerEvents}'`);
      }
      
      if (data.sectionBackgrounds.length > 0) {
        const section = data.sectionBackgrounds[0];
        console.log(`  Section Background:`);
        console.log(`    backgroundColor: '${section.backgroundColor}'`);
        console.log(`    backgroundImage: '${section.backgroundImage}'`);
      }
    });
  }
});