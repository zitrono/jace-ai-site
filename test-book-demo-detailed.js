import puppeteer from 'puppeteer';

async function testSingleViewport() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // Test mobile viewport
  await page.setViewport({
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
  });

  console.log('Loading page on iPhone 12 Pro viewport...\n');

  await page.goto('http://localhost:4321/ralph-web/book-demo', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  // Wait a bit longer for iframe to render
  await page.waitForTimeout(3000);

  // Get detailed information about the page structure
  const pageInfo = await page.evaluate(() => {
    const containers = document.querySelectorAll('.calendar-container');
    const result = {
      containerCount: containers.length,
      containers: [],
    };

    containers.forEach((container, index) => {
      const isHidden = container.classList.contains('hidden');
      const displayStyle = window.getComputedStyle(container).display;
      const iframe = container.querySelector('iframe');
      const containerRect = container.getBoundingClientRect();

      result.containers.push({
        index,
        classes: container.className,
        isHidden,
        displayStyle,
        width: containerRect.width,
        height: containerRect.height,
        hasIframe: !!iframe,
        iframeInfo: iframe
          ? {
              width: iframe.getBoundingClientRect().width,
              height: iframe.getBoundingClientRect().height,
              src: iframe.src,
            }
          : null,
      });
    });

    // Also check viewport dimensions
    result.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    return result;
  });

  console.log('Page Analysis Results:');
  console.log('Viewport:', pageInfo.viewport);
  console.log(`Found ${pageInfo.containerCount} calendar containers:\n`);

  pageInfo.containers.forEach((container) => {
    console.log(`Container ${container.index}:`);
    console.log(`  Classes: ${container.classes}`);
    console.log(`  Hidden: ${container.isHidden}`);
    console.log(`  Display: ${container.displayStyle}`);
    console.log(`  Size: ${container.width}x${container.height}`);
    if (container.iframeInfo) {
      console.log(`  Iframe size: ${container.iframeInfo.width}x${container.iframeInfo.height}`);
    }
    console.log('');
  });

  // Take screenshot
  await page.screenshot({
    path: './screenshots/book-demo-mobile-debug.png',
    fullPage: true,
  });

  console.log('Screenshot saved as book-demo-mobile-debug.png');

  // Keep browser open for manual inspection
  console.log('\nBrowser will stay open for 10 seconds for manual inspection...');
  await page.waitForTimeout(10000);

  await browser.close();
}

testSingleViewport().catch(console.error);
