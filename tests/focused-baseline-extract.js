// Extract focused baseline values from original jace.ai site
import puppeteer from 'puppeteer';

async function extractFocusedBaseline() {
  console.log('🔍 Extracting focused baseline from jace.ai...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://jace.ai', { waitUntil: 'networkidle0' });
    
    // Extract specific elements that should exist
    const baseline = await page.evaluate(() => {
      const results = {};
      
      // CTA Button - find first button with yellow background
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const ctaButton = buttons.find(btn => {
        const styles = window.getComputedStyle(btn);
        return styles.backgroundColor.includes('255') && 
               styles.backgroundColor.includes('220') &&
               btn.textContent?.includes('Get Started');
      });
      
      if (ctaButton) {
        const styles = window.getComputedStyle(ctaButton);
        results.ctaButton = {
          text: ctaButton.textContent?.trim(),
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderRadius: styles.borderRadius,
          padding: styles.padding,
          fontSize: styles.fontSize
        };
      }
      
      // CASA Badge - look for specific text
      const casaElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent?.includes('CASA') && el.textContent?.includes('TIER')
      );
      
      if (casaElements.length > 0) {
        const casaBadge = casaElements[0];
        const styles = window.getComputedStyle(casaBadge);
        results.casaBadge = {
          text: casaBadge.textContent?.trim(),
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          border: styles.border
        };
      }
      
      // User count - look for "1000+" text
      const userElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const text = el.textContent?.trim() || '';
        return text.includes('1000+') && text.length < 50; // Avoid script tags
      });
      
      results.userCount = {
        found: userElements.length > 0,
        elements: userElements.length,
        texts: userElements.slice(0, 3).map(el => el.textContent?.trim())
      };
      
      // Secondary button - login button
      const loginBtn = Array.from(document.querySelectorAll('a, button')).find(el => 
        el.textContent?.includes('Log In') || el.getAttribute('href')?.includes('signin')
      );
      
      if (loginBtn) {
        const styles = window.getComputedStyle(loginBtn);
        results.secondaryButton = {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          padding: styles.padding
        };
      }
      
      return results;
    });
    
    console.log('\n📋 FOCUSED BASELINE VALUES:');
    console.log(JSON.stringify(baseline, null, 2));
    
    await browser.close();
    return baseline;
    
  } catch (error) {
    await browser.close();
    console.error('❌ Extraction failed:', error.message);
    return null;
  }
}

extractFocusedBaseline().then(baseline => {
  if (baseline) {
    console.log('\n✅ Focused baseline extraction complete');
  }
});