// Extract exact baseline values from original jace.ai site
import puppeteer from 'puppeteer';

async function extractOriginalBaseline() {
  console.log('🔍 Extracting exact baseline from jace.ai...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://jace.ai', { waitUntil: 'networkidle0' });
    
    // Extract actual values from original site
    const baseline = await page.evaluate(() => {
      const results = {};
      
      // Hero title
      const heroTitle = document.querySelector('h1');
      if (heroTitle) {
        const styles = window.getComputedStyle(heroTitle);
        results.heroTitle = {
          text: heroTitle.textContent?.trim(),
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          fontFamily: styles.fontFamily,
          color: styles.color,
          backgroundImage: styles.backgroundImage,
          borderRadius: styles.borderRadius
        };
      }
      
      // Hero subtitle  
      const heroSubtitle = document.querySelector('h1 + p, .text-lg');
      if (heroSubtitle) {
        const styles = window.getComputedStyle(heroSubtitle);
        results.heroSubtitle = {
          text: heroSubtitle.textContent?.trim(),
          color: styles.color,
          fontSize: styles.fontSize
        };
      }
      
      // CTA Button
      const ctaButton = document.querySelector('button[class*="bg-"], a[class*="bg-"]');
      if (ctaButton) {
        const styles = window.getComputedStyle(ctaButton);
        results.ctaButton = {
          text: ctaButton.textContent?.trim(),
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderRadius: styles.borderRadius,
          padding: styles.padding,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight
        };
      }
      
      // CASA Badge
      const casaBadge = document.querySelector('[class*="badge"], [class*="pill"]');
      if (casaBadge) {
        const styles = window.getComputedStyle(casaBadge);
        results.casaBadge = {
          text: casaBadge.textContent?.trim(),
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          border: styles.border,
          borderRadius: styles.borderRadius
        };
      }
      
      // User count
      const userCount = document.querySelector('*');
      const userCountText = Array.from(document.querySelectorAll('*')).find(el => 
        el.textContent?.includes('1000') || el.textContent?.includes('enthusiast')
      );
      if (userCountText) {
        results.userCount = {
          text: userCountText.textContent?.trim(),
          exists: true
        };
      } else {
        results.userCount = { exists: false };
      }
      
      // Secondary button
      const secondaryBtn = document.querySelector('a[href*="signin"], button:not([class*="bg-surface"])');
      if (secondaryBtn) {
        const styles = window.getComputedStyle(secondaryBtn);
        results.secondaryButton = {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          padding: styles.padding
        };
      }
      
      return results;
    });
    
    console.log('\n📋 EXTRACTED BASELINE VALUES:');
    console.log(JSON.stringify(baseline, null, 2));
    
    await browser.close();
    return baseline;
    
  } catch (error) {
    await browser.close();
    console.error('❌ Extraction failed:', error.message);
    return null;
  }
}

extractOriginalBaseline().then(baseline => {
  if (baseline) {
    console.log('\n✅ Baseline extraction complete');
    console.log('Use these exact values to update expectedStyles in POM');
  }
});