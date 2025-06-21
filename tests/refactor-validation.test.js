#!/usr/bin/env node

/**
 * TDD Validation: Compare refactored Astro components against baseline
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REFACTORED_URL = 'http://localhost:4321';

async function validateRefactoredSite() {
  console.log('🧪 TDD Validation: Testing refactored Astro components...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    console.log(`🌐 Navigating to refactored site: ${REFACTORED_URL}`);
    await page.goto(REFACTORED_URL, { waitUntil: 'networkidle0' });
    
    // Test 1: Page Title
    console.log('\n📋 Test 1: Page Title');
    const title = await page.title();
    const expectedTitle = 'Jace AI | Email Assistant That Understands Your Voice';
    if (title === expectedTitle) {
      console.log('✅ Page title matches baseline:', title);
    } else {
      console.log('❌ Page title mismatch. Expected:', expectedTitle, 'Got:', title);
      return false;
    }
    
    // Test 2: Hero Section
    console.log('\n📋 Test 2: Hero Section');
    const heroHeading = await page.$eval('h1', el => el.textContent.trim());
    const expectedHero = 'Gain 2 Hours Daily with Jace';
    if (heroHeading === expectedHero) {
      console.log('✅ Hero heading matches baseline:', heroHeading);
    } else {
      console.log('❌ Hero heading mismatch. Expected:', expectedHero, 'Got:', heroHeading);
      return false;
    }
    
    // Test 3: Navigation Elements
    console.log('\n📋 Test 3: Navigation Elements');
    const navLinks = await page.$$eval('nav a', links => 
      links.map(link => link.textContent.trim()).filter(text => text && text !== 'Jace AI')
    );
    
    const expectedNavItems = ['Features', 'Company', 'Pricing', 'Blog', 'Log In'];
    const hasAllNavItems = expectedNavItems.every(item => 
      navLinks.some(navItem => navItem.includes(item))
    );
    
    if (hasAllNavItems) {
      console.log('✅ All navigation items found:', navLinks);
    } else {
      console.log('❌ Navigation items missing. Expected:', expectedNavItems, 'Found:', navLinks);
      return false;
    }
    
    // Test 4: CTA Buttons
    console.log('\n📋 Test 4: CTA Buttons');
    const ctaButtons = await page.$$eval('button', buttons => 
      buttons.map(btn => btn.textContent.trim())
    );
    
    const hasGetStarted = ctaButtons.some(text => text.includes('Get Started for Free'));
    if (hasGetStarted) {
      console.log('✅ Primary CTA button found:', ctaButtons.filter(text => text.includes('Get Started')));
    } else {
      console.log('❌ Primary CTA button missing. Found buttons:', ctaButtons);
      return false;
    }
    
    // Test 5: Responsive Design Check
    console.log('\n📋 Test 5: Mobile Responsiveness');
    await page.setViewport({ width: 375, height: 667 }); // iPhone SE
    await page.waitForTimeout(500); // Allow time for responsive changes
    
    const mobileNavVisible = await page.$eval('button[aria-label="Open main menu"]', el => 
      getComputedStyle(el).display !== 'none'
    );
    
    if (mobileNavVisible) {
      console.log('✅ Mobile navigation button visible on small screens');
    } else {
      console.log('❌ Mobile navigation button not visible on small screens');
      return false;
    }
    
    // Test 6: Visual Elements
    console.log('\n📋 Test 6: Visual Elements');
    await page.setViewport({ width: 1280, height: 720 }); // Back to desktop
    
    const logoExists = await page.$('svg[aria-labelledby="jace-logo-title"]') !== null;
    const demoVideoExists = await page.$('.bg-gradient-to-br.from-blue-500.to-teal-500') !== null;
    const companyLogosExist = await page.$$eval('.text-gray-400.font-bold', els => els.length >= 3);
    
    if (logoExists && demoVideoExists && companyLogosExist) {
      console.log('✅ All visual elements present (logo, demo video, company logos)');
    } else {
      console.log('❌ Missing visual elements. Logo:', logoExists, 'Demo:', demoVideoExists, 'Companies:', companyLogosExist);
      return false;
    }
    
    // Test 7: Tailwind CSS Loading
    console.log('\n📋 Test 7: Styling Verification');
    const bgColor = await page.$eval('body', el => getComputedStyle(el).backgroundColor);
    const hasDarkBg = bgColor.includes('rgb(17, 24, 39)') || bgColor.includes('rgba(17, 24, 39'); // gray-900
    
    if (hasDarkBg) {
      console.log('✅ Tailwind CSS loaded correctly - dark background applied');
    } else {
      console.log('❌ Tailwind CSS not loading properly. Background color:', bgColor);
      return false;
    }
    
    console.log('\n🎉 All refactored component tests passed!');
    console.log('✨ Astro + Tailwind refactoring successful - functionality preserved');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error during refactored site validation:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = await validateRefactoredSite();
  process.exit(success ? 0 : 1);
}

export { validateRefactoredSite };