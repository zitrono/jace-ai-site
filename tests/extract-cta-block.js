// Extract CTA block styling from original site
import puppeteer from 'puppeteer';

async function extractCTABlock() {
  console.log('🎯 Extracting CTA Block from Original Site...\n');
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  
  const ctaInfo = await page.evaluate(() => {
    // Look for 'Start saving 90%' text
    const elements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent.includes('Start saving 90%') && 
      el.textContent.includes('of your email time')
    );
    
    if (elements.length === 0) return { found: false };
    
    // Find the container section
    let container = elements[0];
    while (container.parentElement && container.tagName !== 'SECTION') {
      container = container.parentElement;
    }
    
    const styles = window.getComputedStyle(container);
    
    return {
      found: true,
      tagName: container.tagName,
      backgroundColor: styles.backgroundColor,
      backgroundImage: styles.backgroundImage,
      padding: styles.padding,
      textAlign: styles.textAlign,
      className: container.className
    };
  });
  
  console.log('📊 Original CTA Block Styling:');
  if (ctaInfo.found) {
    console.log(`Tag: ${ctaInfo.tagName}`);
    console.log(`Background Color: ${ctaInfo.backgroundColor}`);
    console.log(`Background Image: ${ctaInfo.backgroundImage}`);
    console.log(`Text Align: ${ctaInfo.textAlign}`);
    console.log(`Padding: ${ctaInfo.padding}`);
    console.log(`Class: ${ctaInfo.className}`);
  } else {
    console.log('❌ CTA block not found in original site');
  }
  
  await browser.close();
}

extractCTABlock().catch(console.error);