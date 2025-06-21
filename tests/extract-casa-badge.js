// Extract exact CASA badge values from original jace.ai site
import puppeteer from 'puppeteer';

async function extractCasaBadge() {
  console.log('🔍 Extracting CASA badge from jace.ai...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://jace.ai', { waitUntil: 'networkidle0' });
    
    const casaInfo = await page.evaluate(() => {
      // Find CASA badge by text content
      const allElements = Array.from(document.querySelectorAll('*'));
      const casaElements = allElements.filter(el => {
        const text = el.textContent?.trim() || '';
        return text.includes('CASA') && text.includes('TIER') && text.length < 100;
      });
      
      console.log('Found CASA elements:', casaElements.length);
      
      if (casaElements.length > 0) {
        const casaBadge = casaElements[0];
        const styles = window.getComputedStyle(casaBadge);
        
        return {
          found: true,
          text: casaBadge.textContent?.trim(),
          tagName: casaBadge.tagName,
          className: casaBadge.className,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          border: styles.border,
          borderRadius: styles.borderRadius,
          parent: casaBadge.parentElement?.tagName,
          parentClass: casaBadge.parentElement?.className
        };
      }
      
      // Also look for elements with purple/violet background
      const purpleElements = allElements.filter(el => {
        const styles = window.getComputedStyle(el);
        const bg = styles.backgroundColor;
        return bg.includes('128') || bg.includes('purple') || bg.includes('violet');
      });
      
      return {
        found: false,
        casaElements: casaElements.length,
        purpleElements: purpleElements.length,
        purpleExamples: purpleElements.slice(0, 3).map(el => ({
          tag: el.tagName,
          text: el.textContent?.trim().slice(0, 50),
          bg: window.getComputedStyle(el).backgroundColor
        }))
      };
    });
    
    console.log('\n📋 CASA BADGE INFO:');
    console.log(JSON.stringify(casaInfo, null, 2));
    
    await browser.close();
    return casaInfo;
    
  } catch (error) {
    await browser.close();
    console.error('❌ Extraction failed:', error.message);
    return null;
  }
}

extractCasaBadge().then(info => {
  if (info) {
    console.log('\n✅ CASA badge extraction complete');
  }
});