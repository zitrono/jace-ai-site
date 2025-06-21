#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Inline config to avoid module issues
const config = {
  headless: true,
  viewport: { width: 1200, height: 800 },
  timeout: 30000,
  
  servers: {
    current: 'http://localhost:8000',
    new: 'http://localhost:4321',
    production: 'https://zitrono.github.io/jace-ai-site/'
  },
  
  screenshots: {
    enabled: true,
    path: './screenshots',
    fullPage: true
  },
  
  selectors: {
    logo: 'svg[aria-labelledby="jace-logo-title"]',
    heroTitle: 'h1',
    heroSubtitle: 'h1 + p',
    ctaButton: 'button:has-text("Get Started for Free"), button[class*="cursor-pointer"]',
    navLinks: 'nav a',
    mobileMenu: 'button[class*="lg:hidden"]',
    footer: 'footer'
  },
  
  content: {
    title: 'Jace AI | Email Assistant That Understands Your Voice',
    heroHeading: 'Gain 2 Hours Daily with Jace',
    navItems: ['Features', 'Company', 'Pricing', 'Blog', 'Log In']
  }
};

class BaselineTests {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
  }

  async setup() {
    console.log('🚀 Setting up Puppeteer...');
    this.browser = await puppeteer.launch({
      headless: config.headless,
      defaultViewport: config.viewport
    });
    this.page = await this.browser.newPage();
    
    // Ensure screenshots directory exists
    if (!fs.existsSync(config.screenshots.path)) {
      fs.mkdirSync(config.screenshots.path, { recursive: true });
    }
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async navigateToSite(url) {
    console.log(`📍 Navigating to: ${url}`);
    try {
      await this.page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: config.timeout 
      });
      return true;
    } catch (error) {
      console.error(`❌ Failed to navigate to ${url}:`, error.message);
      return false;
    }
  }

  async takeScreenshot(name) {
    const filename = `${name}-${Date.now()}.png`;
    const filepath = path.join(config.screenshots.path, filename);
    
    await this.page.screenshot({
      path: filepath,
      fullPage: config.screenshots.fullPage
    });
    
    console.log(`📸 Screenshot saved: ${filename}`);
    return filepath;
  }

  async testPageTitle() {
    console.log('\n🧪 Testing page title...');
    const title = await this.page.title();
    const expected = config.content.title;
    
    if (title === expected) {
      console.log('✅ Page title correct');
      this.results.push({ test: 'Page Title', status: 'PASS', expected, actual: title });
      return true;
    } else {
      console.log(`❌ Page title mismatch. Expected: "${expected}", Got: "${title}"`);
      this.results.push({ test: 'Page Title', status: 'FAIL', expected, actual: title });
      return false;
    }
  }

  async testLogo() {
    console.log('\n🧪 Testing logo presence...');
    try {
      const logo = await this.page.$(config.selectors.logo);
      if (logo) {
        console.log('✅ Logo found');
        this.results.push({ test: 'Logo Presence', status: 'PASS' });
        return true;
      } else {
        console.log('❌ Logo not found');
        this.results.push({ test: 'Logo Presence', status: 'FAIL' });
        return false;
      }
    } catch (error) {
      console.log('❌ Error testing logo:', error.message);
      this.results.push({ test: 'Logo Presence', status: 'ERROR', error: error.message });
      return false;
    }
  }

  async testHeroSection() {
    console.log('\n🧪 Testing hero section...');
    
    try {
      // Test hero title
      const heroTitle = await this.page.$eval(config.selectors.heroTitle, el => el.textContent);
      const expectedTitle = config.content.heroHeading;
      
      if (heroTitle?.includes(expectedTitle)) {
        console.log('✅ Hero title correct');
        this.results.push({ test: 'Hero Title', status: 'PASS', expected: expectedTitle, actual: heroTitle });
      } else {
        console.log(`❌ Hero title mismatch. Expected: "${expectedTitle}", Got: "${heroTitle}"`);
        this.results.push({ test: 'Hero Title', status: 'FAIL', expected: expectedTitle, actual: heroTitle });
        return false;
      }

      // Test CTA button
      const ctaButton = await this.page.$(config.selectors.ctaButton);
      if (ctaButton) {
        console.log('✅ CTA button found');
        this.results.push({ test: 'CTA Button', status: 'PASS' });
      } else {
        console.log('❌ CTA button not found');
        this.results.push({ test: 'CTA Button', status: 'FAIL' });
        return false;
      }

      return true;
    } catch (error) {
      console.log('❌ Error testing hero section:', error.message);
      this.results.push({ test: 'Hero Section', status: 'ERROR', error: error.message });
      return false;
    }
  }

  async testNavigation() {
    console.log('\n🧪 Testing navigation...');
    
    try {
      const navLinks = await this.page.$$eval(config.selectors.navLinks, 
        links => links.map(link => link.textContent.trim())
      );
      
      const expectedNavItems = config.content.navItems;
      const foundAllItems = expectedNavItems.every(item => 
        navLinks.some(link => link.includes(item))
      );
      
      if (foundAllItems) {
        console.log('✅ All navigation items found');
        this.results.push({ test: 'Navigation Items', status: 'PASS', expected: expectedNavItems, actual: navLinks });
        return true;
      } else {
        console.log('❌ Some navigation items missing');
        this.results.push({ test: 'Navigation Items', status: 'FAIL', expected: expectedNavItems, actual: navLinks });
        return false;
      }
    } catch (error) {
      console.log('❌ Error testing navigation:', error.message);
      this.results.push({ test: 'Navigation', status: 'ERROR', error: error.message });
      return false;
    }
  }

  async testResponsiveness() {
    console.log('\n🧪 Testing responsiveness...');
    
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1200, height: 800, name: 'Desktop' }
    ];
    
    let allPassed = true;
    
    for (const viewport of viewports) {
      try {
        await this.page.setViewport(viewport);
        await this.page.waitForTimeout(1000); // Allow for responsive changes
        
        // Check if mobile menu button is visible on mobile
        if (viewport.name === 'Mobile') {
          const mobileMenu = await this.page.$(config.selectors.mobileMenu);
          if (mobileMenu) {
            const isVisible = await mobileMenu.isIntersectingViewport();
            if (isVisible) {
              console.log(`✅ ${viewport.name} layout correct`);
              this.results.push({ test: `${viewport.name} Layout`, status: 'PASS' });
            } else {
              console.log(`❌ ${viewport.name} mobile menu not visible`);
              this.results.push({ test: `${viewport.name} Layout`, status: 'FAIL' });
              allPassed = false;
            }
          }
        } else {
          // For tablet/desktop, just check if page renders without error
          const heroTitle = await this.page.$(config.selectors.heroTitle);
          if (heroTitle) {
            console.log(`✅ ${viewport.name} layout correct`);
            this.results.push({ test: `${viewport.name} Layout`, status: 'PASS' });
          } else {
            console.log(`❌ ${viewport.name} layout broken`);
            this.results.push({ test: `${viewport.name} Layout`, status: 'FAIL' });
            allPassed = false;
          }
        }
        
        // Take screenshot for each viewport
        await this.takeScreenshot(`baseline-${viewport.name.toLowerCase()}`);
        
      } catch (error) {
        console.log(`❌ Error testing ${viewport.name}:`, error.message);
        this.results.push({ test: `${viewport.name} Layout`, status: 'ERROR', error: error.message });
        allPassed = false;
      }
    }
    
    // Reset to default viewport
    await this.page.setViewport(config.viewport);
    return allPassed;
  }

  async runAllTests(url) {
    console.log(`\n🧪 Running baseline tests against: ${url}`);
    console.log('=' * 60);
    
    const navigationSuccess = await this.navigateToSite(url);
    if (!navigationSuccess) {
      console.log('❌ Cannot run tests - site not accessible');
      return false;
    }

    // Take initial screenshot
    await this.takeScreenshot('baseline-initial');

    // Run all tests
    const tests = [
      () => this.testPageTitle(),
      () => this.testLogo(), 
      () => this.testHeroSection(),
      () => this.testNavigation(),
      () => this.testResponsiveness()
    ];

    let allPassed = true;
    for (const test of tests) {
      const result = await test();
      if (!result) allPassed = false;
    }

    return allPassed;
  }

  printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log('=' * 60);
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const errors = this.results.filter(r => r.status === 'ERROR').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Errors: ${errors}`);
    console.log(`📊 Total: ${this.results.length}`);
    
    if (failed > 0 || errors > 0) {
      console.log('\n🔍 Failed/Error Details:');
      this.results.filter(r => r.status !== 'PASS').forEach(result => {
        console.log(`  ${result.test}: ${result.status}`);
        if (result.error) console.log(`    Error: ${result.error}`);
        if (result.expected && result.actual) {
          console.log(`    Expected: ${result.expected}`);
          console.log(`    Actual: ${result.actual}`);
        }
      });
    }
    
    // Save results to file
    const resultsPath = path.join(config.screenshots.path, `test-results-${Date.now()}.json`);
    fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Detailed results saved to: ${resultsPath}`);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tests = new BaselineTests();
  
  async function runTests() {
    try {
      await tests.setup();
      
      // Test current production site
      const productionUrl = config.servers.production;
      const success = await tests.runAllTests(productionUrl);
      
      tests.printResults();
      
      if (success) {
        console.log('\n🎉 All baseline tests passed!');
        process.exit(0);
      } else {
        console.log('\n💥 Some baseline tests failed!');
        process.exit(1);
      }
    } catch (error) {
      console.error('💥 Test suite error:', error);
      process.exit(1);
    } finally {
      await tests.teardown();
    }
  }
  
  runTests();
}

export { BaselineTests };