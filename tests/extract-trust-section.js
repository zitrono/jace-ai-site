// Extract trust indicators section from original jace.ai site
import puppeteer from 'puppeteer';

async function extractTrustSection() {
  console.log('🔍 Extracting trust indicators from jace.ai...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://jace.ai', { waitUntil: 'networkidle0' });
    
    const trustInfo = await page.evaluate(() => {
      // Look for text patterns that might be trust indicators
      const allElements = Array.from(document.querySelectorAll('*'));
      
      // Search for various trust-related terms
      const patterns = [
        /CASA/i, /TIER/i, /CERTIFIED/i, /GDPR/i, /CCPA/i, 
        /1000\+/i, /enthusiast/i, /user/i, /customer/i,
        /secure/i, /privacy/i, /encryption/i
      ];
      
      const matches = {};
      patterns.forEach(pattern => {
        matches[pattern.source] = allElements.filter(el => {
          const text = el.textContent?.trim() || '';
          return pattern.test(text) && text.length < 200;
        }).slice(0, 3).map(el => ({
          text: el.textContent?.trim().slice(0, 100),
          tag: el.tagName,
          className: el.className || 'no-class'
        }));
      });
      
      // Look for badges, pills, or rounded elements
      const badgeElements = allElements.filter(el => {
        const styles = window.getComputedStyle(el);
        const className = (el.className || '').toLowerCase();
        return className.includes('badge') || 
               className.includes('pill') || 
               className.includes('tag') ||
               styles.borderRadius === '9999px' ||
               parseFloat(styles.borderRadius) > 20;
      });
      
      // Look for user count indicators
      const userCountElements = allElements.filter(el => {
        const text = el.textContent?.trim() || '';
        return text.includes('1000') || 
               text.includes('thousand') || 
               text.includes('users') ||
               text.includes('enthusiast');
      });
      
      return {
        patterns: matches,
        badges: badgeElements.slice(0, 5).map(el => ({
          text: el.textContent?.trim().slice(0, 50),
          tag: el.tagName,
          className: el.className,
          borderRadius: window.getComputedStyle(el).borderRadius,
          backgroundColor: window.getComputedStyle(el).backgroundColor
        })),
        userCount: userCountElements.slice(0, 3).map(el => ({
          text: el.textContent?.trim().slice(0, 100),
          tag: el.tagName,
          className: el.className
        }))
      };
    });
    
    console.log('\n📋 TRUST INDICATORS INFO:');
    console.log(JSON.stringify(trustInfo, null, 2));
    
    await browser.close();
    return trustInfo;
    
  } catch (error) {
    await browser.close();
    console.error('❌ Extraction failed:', error.message);
    return null;
  }
}

extractTrustSection().then(info => {
  if (info) {
    console.log('\n✅ Trust section extraction complete');
  }
});