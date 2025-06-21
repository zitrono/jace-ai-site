import puppeteer from 'puppeteer';

async function simplePOMTest() {
  let browser;
  
  try {
    console.log('Starting browser...');
    browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('Creating page...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('Navigating to http://localhost:4321...');
    await page.goto('http://localhost:4321', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('Page loaded successfully!');
    
    // Test body background
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    console.log('Body background:', bodyBg);
    
    // Test hero title
    const heroTitle = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      if (!h1) return null;
      const styles = window.getComputedStyle(h1);
      return {
        fontSize: styles.fontSize,
        backgroundImage: styles.backgroundImage,
        letterSpacing: styles.letterSpacing
      };
    });
    console.log('Hero title styles:', heroTitle);
    
    // Test CTA button
    const ctaButton = await page.evaluate(() => {
      const btn = document.querySelector('.cta-button-original');
      if (!btn) return null;
      const styles = window.getComputedStyle(btn);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderRadius: styles.borderRadius
      };
    });
    console.log('CTA button styles:', ctaButton);
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Error occurred:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
simplePOMTest().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});