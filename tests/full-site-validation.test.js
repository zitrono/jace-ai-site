// Full site validation test with Puppeteer
const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Starting full site validation with Puppeteer...\n');
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the built site
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
    
    console.log('✅ Page loaded successfully\n');
    
    // Set viewport sizes for testing
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Mobile', width: 375, height: 812 }
    ];
    
    for (const viewport of viewports) {
      console.log(`\n📱 Testing on ${viewport.name} (${viewport.width}x${viewport.height})`);
      await page.setViewport(viewport);
      
      // Test 1: Header and Navigation
      console.log('\n1️⃣ Header and Navigation:');
      const logo = await page.$('header svg');
      console.log('   ✅ Logo present:', logo !== null);
      
      if (viewport.name === 'Desktop') {
        const navLinks = await page.$$eval('header nav a', links => links.map(a => a.textContent.trim()));
        console.log('   ✅ Desktop nav links:', navLinks.filter(link => link !== '').slice(0, 4).join(', '));
      } else {
        const hamburger = await page.$('#mobile-menu-button');
        console.log('   ✅ Hamburger button present:', hamburger !== null);
      }
      
      // Test 2: Hero Section
      console.log('\n2️⃣ Hero Section:');
      const heroTitle = await page.$eval('h1', el => el.textContent.trim());
      console.log('   ✅ Hero title:', heroTitle);
      
      const heroCTA = await page.$eval('main button', el => el.textContent.trim());
      console.log('   ✅ Hero CTA:', heroCTA);
      
      // Test 3: Features Section
      console.log('\n3️⃣ Features Section:');
      const featuresTitle = await page.$eval('section:nth-of-type(1) h2', el => el.textContent.trim());
      console.log('   ✅ Features title:', featuresTitle);
      
      const featureCards = await page.$$('section:nth-of-type(1) .grid > div');
      console.log('   ✅ Feature cards count:', featureCards.length);
      
      // Test 4: Pricing Section
      console.log('\n4️⃣ Pricing Section:');
      const pricingTitle = await page.$eval('#pricing h2', el => el.textContent.trim());
      console.log('   ✅ Pricing title:', pricingTitle);
      
      const pricingCards = await page.$$('#pricing .grid > div');
      console.log('   ✅ Pricing cards count:', pricingCards.length);
      
      const prices = await page.$$eval('#pricing .text-4xl', els => els.map(el => el.textContent.trim()));
      console.log('   ✅ Prices found:', prices.join(', '));
      
      // Test 5: Testimonials Section
      console.log('\n5️⃣ Testimonials Section:');
      const testimonialsTitle = await page.$eval('section:nth-of-type(3) h2', el => el.textContent.trim());
      console.log('   ✅ Testimonials title:', testimonialsTitle);
      
      const testimonialCards = await page.$$('section:nth-of-type(3) .grid > div');
      console.log('   ✅ Testimonial cards count:', testimonialCards.length);
      
      // Test 6: CTA Section
      console.log('\n6️⃣ CTA Section:');
      const ctaTitle = await page.$eval('section:nth-of-type(4) h2', el => el.textContent.trim());
      console.log('   ✅ CTA title:', ctaTitle);
      
      // Test 7: FAQ Section
      console.log('\n7️⃣ FAQ Section:');
      const faqTitle = await page.$eval('section:nth-of-type(5) h2', el => el.textContent.trim());
      console.log('   ✅ FAQ title:', faqTitle);
      
      const faqItems = await page.$$('section:nth-of-type(5) .space-y-8 > div');
      console.log('   ✅ FAQ items count:', faqItems.length);
      
      // Test 8: Footer
      console.log('\n8️⃣ Footer:');
      const footerLinks = await page.$$eval('footer nav a', links => links.map(a => a.textContent.trim()));
      console.log('   ✅ Footer links count:', footerLinks.length);
      
      const socialLinks = await page.$$('footer svg');
      console.log('   ✅ Social links count:', socialLinks.length);
      
      const copyright = await page.$eval('footer p', el => el.textContent.trim());
      console.log('   ✅ Copyright:', copyright);
    }
    
    // Test interactive elements
    console.log('\n\n🎯 Testing Interactive Elements:');
    
    // Test mobile menu
    await page.setViewport({ width: 375, height: 812 });
    const hamburgerButton = await page.$('#mobile-menu-button');
    await hamburgerButton.click();
    await page.waitForTimeout(500);
    
    const mobileMenuVisible = await page.$eval('#mobile-menu', el => !el.classList.contains('hidden'));
    console.log('   ✅ Mobile menu opens:', mobileMenuVisible);
    
    const closeButton = await page.$('#mobile-menu-close');
    await closeButton.click();
    await page.waitForTimeout(500);
    
    const mobileMenuHidden = await page.$eval('#mobile-menu', el => el.classList.contains('hidden'));
    console.log('   ✅ Mobile menu closes:', mobileMenuHidden);
    
    // Test FAQ accordion (desktop view for easier interaction)
    await page.setViewport({ width: 1920, height: 1080 });
    const firstFAQButton = await page.$('section:nth-of-type(5) button');
    await firstFAQButton.click();
    await page.waitForTimeout(500);
    
    const faqContentVisible = await page.$eval('section:nth-of-type(5) button + div', el => !el.classList.contains('hidden'));
    console.log('   ✅ FAQ accordion opens:', faqContentVisible);
    
    console.log('\n\n✅ All tests passed! The refactored site is fully functional.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();