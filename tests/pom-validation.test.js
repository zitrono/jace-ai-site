// Test to validate POM against original site
import puppeteer from 'puppeteer';
import { OriginalJaceAISite } from './original-site.pom.js';

(async () => {
  console.log('🧪 Testing POM against original site...\n');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Create POM instance
    const originalSite = new OriginalJaceAISite(page);
    
    // Navigate to site
    console.log('📍 Navigating to original site...');
    await originalSite.navigate();
    
    // Run all validations
    console.log('🔍 Running validations...\n');
    const results = await originalSite.validateAll();
    
    // Report results
    let hasErrors = false;
    
    for (const [section, errors] of Object.entries(results)) {
      if (errors.length > 0) {
        hasErrors = true;
        console.log(`❌ ${section.toUpperCase()} Section:`);
        errors.forEach(error => console.log(`   - ${error}`));
      } else {
        console.log(`✅ ${section.toUpperCase()} Section: All checks passed`);
      }
    }
    
    // Additional style checks
    console.log('\n📐 Checking specific styles...');
    
    // Hero title gradient
    const titleStyles = await originalSite.getElementStyles(originalSite.selectors.heroTitle);
    console.log('Hero Title Gradient:', titleStyles.backgroundImage);
    
    // CTA button styles
    const ctaStyles = await originalSite.getElementStyles(originalSite.selectors.heroCTAButton);
    console.log('CTA Button:', {
      background: ctaStyles.backgroundColor,
      textColor: ctaStyles.color,
      radius: ctaStyles.borderRadius
    });
    
    // Header background
    const headerStyles = await page.evaluate(() => {
      const header = document.querySelector('header');
      const nav = header?.querySelector('nav > div');
      return {
        headerBg: window.getComputedStyle(header).backgroundColor,
        navBg: nav ? window.getComputedStyle(nav).backgroundColor : null
      };
    });
    console.log('Header Styles:', headerStyles);
    
    // Video section gradient
    const videoStyles = await page.evaluate(() => {
      const videoBox = document.querySelector('.bg-gradient-to-br, [class*="gradient"]');
      return videoBox ? {
        backgroundImage: window.getComputedStyle(videoBox).backgroundImage,
        borderRadius: window.getComputedStyle(videoBox).borderRadius
      } : null;
    });
    console.log('Video Box Styles:', videoStyles);
    
    // Company logos
    const companyInfo = await page.evaluate(() => {
      // Look for company logos or text
      const logos = document.querySelectorAll('img[alt*="logo"], svg[class*="logo"]');
      const companyText = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent.includes('Google') && 
        el.textContent.includes('Meta') && 
        el.textContent.includes('Tesla')
      );
      
      return {
        hasLogos: logos.length > 0,
        hasCompanyText: companyText.length > 0,
        companyDisplay: companyText.length > 0 ? 'text' : logos.length > 0 ? 'logos' : 'none'
      };
    });
    console.log('Company Display:', companyInfo);
    
    console.log(hasErrors ? '\n❌ POM validation failed' : '\n✅ POM validation successful');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();