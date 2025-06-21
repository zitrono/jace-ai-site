// Check why sub-pages are not showing on jace.ai
import puppeteer from 'puppeteer';

const JACE_AI_URL = 'https://jace.ai';

async function checkSubPages() {
  console.log('🔍 Checking Sub-Page Navigation on jace.ai\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging to catch errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🔴 Browser Error:', msg.text());
      }
    });
    
    page.on('response', response => {
      if (response.status() >= 400) {
        console.log(`🔴 HTTP Error: ${response.status()} - ${response.url()}`);
      }
    });
    
    await page.goto(JACE_AI_URL, { waitUntil: 'networkidle0' });
    console.log('✅ Loaded main page\n');
    
    // 1. Check all navigation links
    console.log('📋 NAVIGATION ANALYSIS:');
    console.log('======================');
    
    const navLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('nav a, header a');
      return Array.from(links).map(link => ({
        text: link.textContent?.trim(),
        href: link.href,
        hasClick: link.onclick !== null,
        target: link.target,
        dataAttributes: Array.from(link.attributes)
          .filter(attr => attr.name.startsWith('data-'))
          .map(attr => `${attr.name}="${attr.value}"`),
        classes: link.className
      })).filter(link => link.text && link.text.length > 0);
    });
    
    navLinks.forEach((link, index) => {
      console.log(`${index + 1}. "${link.text}"`);
      console.log(`   href: ${link.href}`);
      console.log(`   target: ${link.target || 'same window'}`);
      console.log(`   onclick: ${link.hasClick ? 'YES' : 'NO'}`);
      if (link.dataAttributes.length > 0) {
        console.log(`   data-*: ${link.dataAttributes.join(', ')}`);
      }
      console.log('');
    });
    
    // 2. Check for SPA routing indicators
    console.log('🔍 SPA ROUTING ANALYSIS:');
    console.log('========================');
    
    const routingInfo = await page.evaluate(() => {
      // Check for common SPA frameworks/routers
      const frameworks = {
        react: !!window.React,
        reactRouter: !!window.__REACT_ROUTER_VERSION__,
        nextjs: !!window.__NEXT_DATA__,
        vue: !!window.Vue,
        angular: !!window.ng,
        history: !!window.history.pushState,
        hashRouter: window.location.hash.length > 0
      };
      
      // Check for router event listeners
      const hasHistoryListeners = window.addEventListener.toString().includes('popstate') ||
                                 document.addEventListener.toString().includes('popstate');
      
      // Check for preventDefault on links
      const linksWithPreventDefault = Array.from(document.querySelectorAll('a')).some(link => {
        return link.onclick && link.onclick.toString().includes('preventDefault');
      });
      
      return {
        frameworks,
        hasHistoryListeners,
        linksWithPreventDefault,
        currentUrl: window.location.href,
        baseUrl: window.location.origin,
        pathname: window.location.pathname
      };
    });
    
    console.log('Framework detection:');
    Object.entries(routingInfo.frameworks).forEach(([framework, detected]) => {
      console.log(`  ${framework}: ${detected ? '✅ YES' : '❌ NO'}`);
    });
    console.log(`History API listeners: ${routingInfo.hasHistoryListeners ? '✅ YES' : '❌ NO'}`);
    console.log(`Links with preventDefault: ${routingInfo.linksWithPreventDefault ? '✅ YES' : '❌ NO'}`);
    console.log(`Current URL: ${routingInfo.currentUrl}`);
    console.log(`Pathname: ${routingInfo.pathname}`);
    
    // 3. Test clicking navigation links
    console.log('\n🖱️  TESTING NAVIGATION CLICKS:');
    console.log('==============================');
    
    // Try clicking each nav link to see what happens
    for (const link of navLinks.slice(0, 5)) { // Test first 5 links
      if (link.href && !link.href.includes('mailto:') && !link.href.includes('tel:')) {
        console.log(`\nTesting click on: "${link.text}"`);
        
        try {
          // Get the link element again
          const linkElement = await page.evaluateHandle((linkText) => {
            const links = Array.from(document.querySelectorAll('nav a, header a'));
            return links.find(l => l.textContent?.trim() === linkText);
          }, link.text);
          
          if (linkElement.asElement()) {
            const initialUrl = page.url();
            console.log(`  Initial URL: ${initialUrl}`);
            
            // Click the link
            await linkElement.asElement().click();
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for navigation
            
            const newUrl = page.url();
            console.log(`  After click: ${newUrl}`);
            
            if (newUrl !== initialUrl) {
              console.log(`  ✅ Navigation successful!`);
              
              // Check if page content changed
              const pageTitle = await page.title();
              console.log(`  Page title: ${pageTitle}`);
              
              // Go back for next test
              await page.goBack();
              await new Promise(resolve => setTimeout(resolve, 500));
            } else {
              console.log(`  ❌ No navigation occurred`);
              
              // Check if it's SPA routing (content change without URL change)
              const bodyChanged = await page.evaluate(() => {
                return document.body.innerHTML.length > 1000; // Basic content check
              });
              
              if (bodyChanged) {
                console.log(`  🔄 Possible SPA routing (content may have changed)`);
              }
            }
          }
        } catch (clickError) {
          console.log(`  ❌ Click error: ${clickError.message}`);
        }
      }
    }
    
    // 4. Check for mobile menu
    console.log('\n📱 MOBILE MENU ANALYSIS:');
    console.log('========================');
    
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mobileMenuInfo = await page.evaluate(() => {
      const mobileButtons = document.querySelectorAll('button[aria-expanded]');
      const hamburgerMenus = document.querySelectorAll('[class*="hamburger"], [class*="menu-toggle"], button[aria-label*="menu"]');
      
      return {
        mobileButtons: mobileButtons.length,
        hamburgerMenus: hamburgerMenus.length,
        hiddenElements: document.querySelectorAll('.md\\:hidden, .lg\\:hidden').length,
        visibleElements: document.querySelectorAll('.md\\:block, .lg\\:block').length
      };
    });
    
    console.log(`Mobile menu buttons: ${mobileMenuInfo.mobileButtons}`);
    console.log(`Hamburger menus: ${mobileMenuInfo.hamburgerMenus}`);
    console.log(`Hidden on mobile: ${mobileMenuInfo.hiddenElements}`);
    console.log(`Visible on desktop: ${mobileMenuInfo.visibleElements}`);
    
    // Try to open mobile menu
    try {
      const mobileMenuButton = await page.$('button[aria-expanded]');
      if (mobileMenuButton) {
        console.log('\nTesting mobile menu:');
        const isExpanded = await mobileMenuButton.evaluate(el => el.getAttribute('aria-expanded'));
        console.log(`  Initial state: ${isExpanded}`);
        
        await mobileMenuButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const isExpandedAfter = await mobileMenuButton.evaluate(el => el.getAttribute('aria-expanded'));
        console.log(`  After click: ${isExpandedAfter}`);
        
        if (isExpandedAfter === 'true') {
          console.log('  ✅ Mobile menu opened!');
          
          // Check for mobile navigation links
          const mobileNavLinks = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('nav a, [aria-expanded="true"] ~ * a, [role="dialog"] a'))
              .map(link => link.textContent?.trim())
              .filter(text => text && text.length > 0);
          });
          
          console.log(`  Mobile nav links found: ${mobileNavLinks.length}`);
          mobileNavLinks.forEach(link => console.log(`    - ${link}`));
        }
      }
    } catch (mobileError) {
      console.log(`  ❌ Mobile menu test error: ${mobileError.message}`);
    }
    
    // Reset viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('\n📊 SUMMARY:');
    console.log('===========');
    console.log(`Total navigation links found: ${navLinks.length}`);
    console.log(`SPA framework detected: ${Object.values(routingInfo.frameworks).some(Boolean) ? 'YES' : 'NO'}`);
    console.log(`Client-side routing: ${routingInfo.hasHistoryListeners || routingInfo.linksWithPreventDefault ? 'LIKELY' : 'NO'}`);
    
    // Final recommendation
    console.log('\n💡 POSSIBLE REASONS FOR MISSING SUB-PAGES:');
    console.log('==========================================');
    console.log('1. Single Page Application (SPA) - All content on one page');
    console.log('2. Links might be anchor links (#section) to page sections');
    console.log('3. External links opening in new tabs/windows');
    console.log('4. JavaScript-based navigation not yet implemented');
    console.log('5. Sub-pages may not be publicly accessible yet');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the analysis
(async () => {
  await checkSubPages();
})();