// Simple check for missing POM elements
import puppeteer from 'puppeteer';

async function simpleMissingCheck() {
  console.log('🔍 Simple check for missing POM elements...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://jace.ai', { waitUntil: 'networkidle0' });
    
    const results = await page.evaluate(() => {
      const findings = {};
      
      // 1. FAQ Questions
      const faqCount = document.querySelectorAll('button[aria-expanded], [data-state]').length;
      findings.faqQuestions = faqCount;
      
      // 2. Auto-drafts text
      const autoDraftText = document.body.textContent?.includes('Auto-draft') || 
                           document.body.textContent?.includes('auto-draft') ||
                           document.body.textContent?.includes('Intelligent email drafts');
      findings.autoDraftsText = autoDraftText;
      
      // 3. Rounded elements count
      const roundedCount = Array.from(document.querySelectorAll('*')).filter(el => {
        const br = parseFloat(window.getComputedStyle(el).borderRadius);
        return br > 4;
      }).length;
      findings.roundedElements = roundedCount;
      
      // 4. Mobile button classes
      const mobileButtonClasses = Array.from(document.querySelectorAll('button, a')).some(btn => {
        const className = btn.getAttribute('class') || '';
        return className.includes('sm:') || className.includes('md:') || className.includes('lg:');
      });
      findings.mobileButtonClasses = mobileButtonClasses;
      
      // 5. Special section backgrounds
      const specialBackgrounds = Array.from(document.querySelectorAll('section')).filter(section => {
        const bg = window.getComputedStyle(section).backgroundColor;
        return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
      }).length;
      findings.specialBackgrounds = specialBackgrounds;
      
      return findings;
    });
    
    console.log('\n📋 FINDINGS:');
    console.log(`FAQ Questions found: ${results.faqQuestions}`);
    console.log(`Auto-drafts text exists: ${results.autoDraftsText}`);
    console.log(`Rounded elements: ${results.roundedElements}`);
    console.log(`Mobile button classes: ${results.mobileButtonClasses}`);
    console.log(`Special section backgrounds: ${results.specialBackgrounds}`);
    
    await browser.close();
    return results;
    
  } catch (error) {
    await browser.close();
    console.error('❌ Check failed:', error.message);
    return null;
  }
}

simpleMissingCheck();