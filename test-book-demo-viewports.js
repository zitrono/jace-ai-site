import puppeteer from 'puppeteer';
import fs from 'fs';

// Define viewport configurations
const viewports = [
  { name: 'iPhone SE', width: 375, height: 667, isMobile: true },
  { name: 'iPhone 12 Pro', width: 390, height: 844, isMobile: true },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932, isMobile: true },
  { name: 'Samsung Galaxy S21', width: 360, height: 800, isMobile: true },
  { name: 'iPad Mini', width: 768, height: 1024, isMobile: true },
  { name: 'iPad Pro', width: 1024, height: 1366, isMobile: true },
  { name: 'Desktop HD', width: 1366, height: 768, isMobile: false },
  { name: 'Desktop Full HD', width: 1920, height: 1080, isMobile: false },
  { name: 'iPhone SE Landscape', width: 667, height: 375, isMobile: true, isLandscape: true },
  { name: 'iPhone 12 Pro Landscape', width: 844, height: 390, isMobile: true, isLandscape: true }
];

async function testBookDemoPage() {
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: null 
  });

  console.log('Starting viewport tests for book-demo page...\n');

  for (const viewport of viewports) {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      isMobile: viewport.isMobile,
      hasTouch: viewport.isMobile,
      isLandscape: viewport.isLandscape || false
    });

    // Navigate to the page
    await page.goto('http://localhost:4321/ralph-web/book-demo', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for iframe to load
    await page.waitForSelector('iframe', { timeout: 5000 });

    // Take screenshot
    const screenshotName = `book-demo-${viewport.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    await page.screenshot({ 
      path: `./screenshots/${screenshotName}`, 
      fullPage: true 
    });

    // Check if iframe is visible and get its dimensions
    const iframeInfo = await page.evaluate(() => {
      const iframe = document.querySelector('iframe');
      if (!iframe) return null;
      
      const rect = iframe.getBoundingClientRect();
      const container = iframe.closest('.calendar-container');
      const containerRect = container ? container.getBoundingClientRect() : null;
      
      return {
        iframeVisible: rect.width > 0 && rect.height > 0,
        iframeWidth: rect.width,
        iframeHeight: rect.height,
        containerWidth: containerRect ? containerRect.width : 0,
        containerHeight: containerRect ? containerRect.height : 0,
        hasScroll: container ? (container.scrollHeight > container.clientHeight) : false
      };
    });

    // Check for mobile tip visibility
    const mobileTipVisible = await page.evaluate(() => {
      const tip = document.querySelector('.md\\:hidden .text-xs');
      return tip ? window.getComputedStyle(tip).display !== 'none' : false;
    });

    // Log results
    console.log(`📱 ${viewport.name} (${viewport.width}x${viewport.height})`);
    if (iframeInfo) {
      console.log(`   ✓ Iframe visible: ${iframeInfo.iframeVisible}`);
      console.log(`   ✓ Iframe size: ${Math.round(iframeInfo.iframeWidth)}x${Math.round(iframeInfo.iframeHeight)}`);
      console.log(`   ✓ Container size: ${Math.round(iframeInfo.containerWidth)}x${Math.round(iframeInfo.containerHeight)}`);
      console.log(`   ✓ Has scroll: ${iframeInfo.hasScroll}`);
      console.log(`   ✓ Mobile tip visible: ${mobileTipVisible}`);
    } else {
      console.log('   ✗ Could not find iframe');
    }
    console.log(`   ✓ Screenshot saved: ${screenshotName}\n`);

    await page.close();
  }

  // Test user interaction on mobile
  console.log('Testing user interaction on mobile...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true
  });
  
  await mobilePage.goto('http://localhost:4321/ralph-web/book-demo', {
    waitUntil: 'networkidle2'
  });

  // Try to interact with iframe
  try {
    const frame = mobilePage.frames().find(f => f.url().includes('calendar.google.com'));
    if (frame) {
      console.log('✓ Google Calendar iframe detected and accessible');
    } else {
      console.log('✗ Could not access Google Calendar iframe (expected due to cross-origin)');
    }
  } catch (error) {
    console.log('✗ Cross-origin iframe - interaction limited (this is normal)');
  }

  await mobilePage.close();
  await browser.close();
  
  console.log('\nViewport testing complete! Check the screenshots folder for visual results.');
}

// Create screenshots directory
if (!fs.existsSync('./screenshots')) {
  fs.mkdirSync('./screenshots');
}

// Run the test
testBookDemoPage().catch(console.error);