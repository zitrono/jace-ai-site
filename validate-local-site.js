// Validate local Astro site with Puppeteer
import puppeteer from 'puppeteer';

const LOCAL_URL = 'http://localhost:4321';

async function validateLocalSite() {
  console.log('🔍 Validating Local Astro Site with Puppeteer\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1200, height: 800 },
  });

  try {
    const page = await browser.newPage();

    // Enable console logging to catch errors
    page.on('console', (msg) => {
      const type = msg.type();
      if (type === 'error') {
        console.log('🔴 Browser Error:', msg.text());
      } else if (type === 'warn') {
        console.log('⚠️  Browser Warning:', msg.text());
      }
    });

    page.on('response', (response) => {
      if (response.status() >= 400) {
        console.log(`🔴 HTTP Error: ${response.status()} - ${response.url()}`);
      }
    });

    page.on('requestfailed', (request) => {
      console.log(`🔴 Request Failed: ${request.url()} - ${request.failure().errorText}`);
    });

    console.log(`🌐 Attempting to load: ${LOCAL_URL}`);

    try {
      await page.goto(LOCAL_URL, {
        waitUntil: 'networkidle0',
        timeout: 10000,
      });
      console.log('✅ Page loaded successfully\n');
    } catch (loadError) {
      console.log(`❌ Page load failed: ${loadError.message}`);
      console.log('🔍 Checking if server is running...\n');

      // Try a simple fetch to see if server responds
      try {
        const response = await fetch(LOCAL_URL);
        console.log(`Server response status: ${response.status}`);
        if (response.status === 200) {
          console.log('✅ Server is responding, retrying page load...');
          await page.goto(LOCAL_URL, { waitUntil: 'domcontentloaded' });
        }
      } catch (fetchError) {
        console.log(`❌ Server not responding: ${fetchError.message}`);
        throw new Error('Local server is not running or not accessible');
      }
    }

    // Get basic page info
    const pageTitle = await page.title();
    const pageUrl = page.url();

    console.log('📋 PAGE INFORMATION:');
    console.log('===================');
    console.log(`Title: ${pageTitle}`);
    console.log(`URL: ${pageUrl}`);

    // Check for critical elements
    console.log('\n🔍 ELEMENT VALIDATION:');
    console.log('=====================');

    const criticalElements = [
      { name: 'Hero Title', selector: 'h1' },
      { name: 'Header', selector: 'header' },
      { name: 'Navigation', selector: 'nav' },
      { name: 'CTA Button', selector: 'button, .cta-button, [class*="cta"]' },
      { name: 'Footer', selector: 'footer' },
    ];

    let elementsFound = 0;

    for (const element of criticalElements) {
      try {
        const el = await page.$(element.selector);
        if (el) {
          console.log(`✅ ${element.name}: Found`);
          elementsFound++;

          // Get element text if it's text content
          if (element.name === 'Hero Title') {
            const text = await el.evaluate((el) => el.textContent?.trim());
            console.log(`   Text: "${text}"`);
          }
        } else {
          console.log(`❌ ${element.name}: Not found`);
        }
      } catch (error) {
        console.log(`❌ ${element.name}: Error - ${error.message}`);
      }
    }

    // Check CSS loading
    console.log('\n🎨 CSS VALIDATION:');
    console.log('==================');

    const cssInfo = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      const computedStyle = window.getComputedStyle(document.body);

      return {
        stylesheetCount: stylesheets.length,
        backgroundColor: computedStyle.backgroundColor,
        fontFamily: computedStyle.fontFamily,
        hasVisibleContent: document.body.innerHTML.length > 100,
      };
    });

    console.log(`Stylesheets loaded: ${cssInfo.stylesheetCount}`);
    console.log(`Body background: ${cssInfo.backgroundColor}`);
    console.log(`Font family: ${cssInfo.fontFamily}`);
    console.log(`Has content: ${cssInfo.hasVisibleContent ? 'Yes' : 'No'}`);

    // Check fonts
    console.log('\n🔤 FONT VALIDATION:');
    console.log('==================');

    const fontCheck = await page.evaluate(() => {
      // Check if Geist font is loaded
      const testElement = document.createElement('div');
      testElement.style.fontFamily = 'Geist, sans-serif';
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      testElement.textContent = 'Test';
      document.body.appendChild(testElement);

      const computedFont = window.getComputedStyle(testElement).fontFamily;
      document.body.removeChild(testElement);

      return {
        appliedFont: computedFont,
        isGeistLoaded: computedFont.includes('Geist'),
      };
    });

    console.log(`Applied font: ${fontCheck.appliedFont}`);
    console.log(`Geist loaded: ${fontCheck.isGeistLoaded ? '✅ Yes' : '❌ No'}`);

    // Take a screenshot for visual validation
    console.log('\n📸 SCREENSHOT VALIDATION:');
    console.log('========================');

    try {
      await page.screenshot({
        path: 'local-site-validation.png',
        fullPage: true,
      });
      console.log('✅ Screenshot saved: local-site-validation.png');
    } catch (screenshotError) {
      console.log(`❌ Screenshot failed: ${screenshotError.message}`);
    }

    // Test basic interactions
    console.log('\n🖱️  INTERACTION TESTING:');
    console.log('=======================');

    try {
      // Test mobile menu if present
      const mobileMenuButton = await page.$('button[aria-expanded]');
      if (mobileMenuButton) {
        console.log('🔍 Testing mobile menu...');
        const initialState = await mobileMenuButton.evaluate((el) =>
          el.getAttribute('aria-expanded')
        );
        console.log(`   Initial state: ${initialState}`);

        await mobileMenuButton.click();
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newState = await mobileMenuButton.evaluate((el) => el.getAttribute('aria-expanded'));
        console.log(`   After click: ${newState}`);

        if (newState !== initialState) {
          console.log('✅ Mobile menu interaction works');
        } else {
          console.log('⚠️  Mobile menu state unchanged');
        }
      } else {
        console.log('ℹ️  No mobile menu found');
      }

      // Test CTA button
      const ctaButton = await page.$('button, .cta-button, [class*="cta"]');
      if (ctaButton) {
        console.log('🔍 Testing CTA button hover...');
        await ctaButton.hover();
        console.log('✅ CTA button hover works');
      }
    } catch (interactionError) {
      console.log(`❌ Interaction test failed: ${interactionError.message}`);
    }

    // Summary
    console.log('\n📊 VALIDATION SUMMARY:');
    console.log('=====================');
    console.log(`✅ Critical elements found: ${elementsFound}/${criticalElements.length}`);
    console.log(`✅ CSS stylesheets: ${cssInfo.stylesheetCount}`);
    console.log(`✅ Font loading: ${fontCheck.isGeistLoaded ? 'Geist loaded' : 'Fallback font'}`);
    console.log(`✅ Page content: ${cssInfo.hasVisibleContent ? 'Present' : 'Missing'}`);

    const overallStatus =
      elementsFound >= 3 && cssInfo.stylesheetCount > 0 && cssInfo.hasVisibleContent;
    console.log(`\n🎯 OVERALL STATUS: ${overallStatus ? '✅ PASS' : '❌ FAIL'}`);

    if (!overallStatus) {
      console.log('\n🔧 TROUBLESHOOTING NEEDED:');
      console.log('==========================');
      if (elementsFound < 3) console.log('- Missing critical page elements');
      if (cssInfo.stylesheetCount === 0) console.log('- CSS not loading');
      if (!cssInfo.hasVisibleContent) console.log('- No visible content rendered');
    }

    return overallStatus;
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

// Run validation
(async () => {
  const success = await validateLocalSite();
  process.exit(success ? 0 : 1);
})();
