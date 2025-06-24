import puppeteer from 'puppeteer';

async function testLocalMobileMenu() {
  console.log('🧪 Testing Local Mobile Menu Z-Index Fix');
  console.log('==========================================\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 375, height: 667 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to local development server
    await page.goto('http://localhost:4321/ralph-web/', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check z-index values
    const zIndexes = await page.evaluate(() => {
      const cookieBanner = document.querySelector('[data-cookie-consent]') || 
                          document.querySelector('.fixed.bottom-4.left-4');
      const mobileMenu = document.querySelector('[data-mobile-menu-overlay]') ||
                        document.querySelector('#mobile-menu');
      
      return {
        cookie: {
          found: !!cookieBanner,
          zIndex: cookieBanner ? window.getComputedStyle(cookieBanner).zIndex : null,
          classes: cookieBanner?.className
        },
        mobileMenu: {
          found: !!mobileMenu,
          zIndex: mobileMenu ? window.getComputedStyle(mobileMenu).zIndex : null,
          classes: mobileMenu?.className
        },
        pomExpectations: {
          mobileMenuZIndex: '50',
          cookieBannerZIndex: '999'
        }
      };
    });
    
    console.log('📊 Z-Index Values:');
    console.log('Cookie Banner:', zIndexes.cookie.found ? `z-${zIndexes.cookie.zIndex}` : 'Not found');
    console.log('Mobile Menu:', zIndexes.mobileMenu.found ? `z-${zIndexes.mobileMenu.zIndex}` : 'Not found');
    console.log('\n📋 POM Expectations:');
    console.log('Mobile Menu should be:', `z-${zIndexes.pomExpectations.mobileMenuZIndex}`);
    console.log('Cookie Banner should be:', `z-${zIndexes.pomExpectations.cookieBannerZIndex}`);
    
    // Test mobile menu interaction
    console.log('\n🔧 Testing Mobile Menu Interaction:');
    
    // Click mobile menu button
    await page.click('button[aria-label="Open main menu"]');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if menu opened properly
    const menuState = await page.evaluate(() => {
      const menuPanel = document.querySelector('[data-mobile-menu-panel]');
      const menuOverlay = document.querySelector('[data-mobile-menu-overlay]');
      const cookieBanner = document.querySelector('[data-cookie-consent]');
      
      return {
        menuVisible: menuPanel ? window.getComputedStyle(menuPanel).transform : 'Not found',
        overlayDisplay: menuOverlay ? window.getComputedStyle(menuOverlay).display : 'Not found',
        cookieStillVisible: cookieBanner ? window.getComputedStyle(cookieBanner).display !== 'none' : false
      };
    });
    
    console.log('Menu Panel Transform:', menuState.menuVisible);
    console.log('Overlay Display:', menuState.overlayDisplay);
    console.log('Cookie Banner Still Visible:', menuState.cookieStillVisible);
    
    // Validation
    console.log('\n✅ Validation Results:');
    const cookieZIndexCorrect = zIndexes.cookie.zIndex === '999';
    const menuZIndexCorrect = zIndexes.mobileMenu.zIndex === '50';
    const zIndexOrderCorrect = parseInt(zIndexes.cookie.zIndex) > parseInt(zIndexes.mobileMenu.zIndex);
    
    console.log('Cookie Banner z-index correct (999):', cookieZIndexCorrect ? '✅' : '❌');
    console.log('Mobile Menu z-index correct (50):', menuZIndexCorrect ? '✅' : '❌');
    console.log('Z-index hierarchy correct (cookie > menu):', zIndexOrderCorrect ? '✅' : '❌');
    
    if (cookieZIndexCorrect && menuZIndexCorrect && zIndexOrderCorrect) {
      console.log('\n🎉 SUCCESS: Mobile menu z-index issue is fixed!');
      console.log('Cookie banner properly appears above mobile menu.');
    } else {
      console.log('\n❌ FAILED: Z-index values do not match POM expectations.');
    }
    
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browser.close();
  }
}

testLocalMobileMenu();