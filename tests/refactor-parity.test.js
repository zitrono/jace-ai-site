// Test to achieve parity between refactored and original site
import puppeteer from 'puppeteer';
import { OriginalJaceAISite } from './original-site.pom.js';

async function compareStyles(browser) {
  const results = {
    original: {},
    refactored: {},
    differences: []
  };
  
  // Test original site
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 1920, height: 1080 });
  const originalSite = new OriginalJaceAISite(page1);
  await originalSite.navigate().catch(err => {
    console.error('Failed to navigate to original site:', err);
    throw err;
  });
  
  // Get original styles
  results.original = await page1.evaluate(() => {
    const h1 = document.querySelector('h1');
    const subtitle = document.querySelector('main p');
    const ctaButton = document.querySelector('main button');
    const header = document.querySelector('header');
    const navDiv = header?.querySelector('nav > div');
    
    return {
      hero: {
        title: h1 ? {
          text: h1.textContent.trim(),
          fontSize: window.getComputedStyle(h1).fontSize,
          fontFamily: window.getComputedStyle(h1).fontFamily,
          backgroundImage: window.getComputedStyle(h1).backgroundImage,
          color: window.getComputedStyle(h1).color,
          webkitTextFillColor: window.getComputedStyle(h1).webkitTextFillColor
        } : null,
        subtitle: subtitle ? {
          text: subtitle.textContent.trim(),
          color: window.getComputedStyle(subtitle).color,
          fontSize: window.getComputedStyle(subtitle).fontSize
        } : null,
        ctaButton: ctaButton ? {
          text: ctaButton.textContent.trim(),
          backgroundColor: window.getComputedStyle(ctaButton).backgroundColor,
          color: window.getComputedStyle(ctaButton).color,
          borderRadius: window.getComputedStyle(ctaButton).borderRadius
        } : null
      },
      header: {
        backgroundColor: header ? window.getComputedStyle(header).backgroundColor : null,
        navBackground: navDiv ? window.getComputedStyle(navDiv).backgroundColor : null
      },
      body: {
        backgroundColor: window.getComputedStyle(document.body).backgroundColor
      }
    };
  });
  
  // Test refactored site
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1920, height: 1080 });
  await page2.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
  
  // Get refactored styles
  results.refactored = await page2.evaluate(() => {
    const h1 = document.querySelector('h1');
    const subtitle = document.querySelector('main p');
    const ctaButton = document.querySelector('main button');
    const header = document.querySelector('header');
    const navDiv = header?.querySelector('nav > div');
    
    return {
      hero: {
        title: h1 ? {
          text: h1.textContent.trim(),
          fontSize: window.getComputedStyle(h1).fontSize,
          fontFamily: window.getComputedStyle(h1).fontFamily,
          backgroundImage: window.getComputedStyle(h1).backgroundImage,
          color: window.getComputedStyle(h1).color,
          webkitTextFillColor: window.getComputedStyle(h1).webkitTextFillColor
        } : null,
        subtitle: subtitle ? {
          text: subtitle.textContent.trim(),
          color: window.getComputedStyle(subtitle).color,
          fontSize: window.getComputedStyle(subtitle).fontSize
        } : null,
        ctaButton: ctaButton ? {
          text: ctaButton.textContent.trim(),
          backgroundColor: window.getComputedStyle(ctaButton).backgroundColor,
          color: window.getComputedStyle(ctaButton).color,
          borderRadius: window.getComputedStyle(ctaButton).borderRadius
        } : null
      },
      header: {
        backgroundColor: header ? window.getComputedStyle(header).backgroundColor : null,
        navBackground: navDiv ? window.getComputedStyle(navDiv).backgroundColor : null
      },
      body: {
        backgroundColor: window.getComputedStyle(document.body).backgroundColor
      }
    };
  });
  
  // Compare and identify differences
  if (results.original.hero?.title?.backgroundImage !== results.refactored.hero?.title?.backgroundImage) {
    results.differences.push({
      element: 'Hero Title Gradient',
      original: results.original.hero.title.backgroundImage,
      refactored: results.refactored.hero.title.backgroundImage
    });
  }
  
  if (results.original.hero?.subtitle?.color !== results.refactored.hero?.subtitle?.color) {
    results.differences.push({
      element: 'Hero Subtitle Color',
      original: results.original.hero.subtitle.color,
      refactored: results.refactored.hero.subtitle.color
    });
  }
  
  if (results.original.hero?.ctaButton?.color !== results.refactored.hero?.ctaButton?.color) {
    results.differences.push({
      element: 'CTA Button Text Color',
      original: results.original.hero.ctaButton.color,
      refactored: results.refactored.hero.ctaButton.color
    });
  }
  
  if (results.original.header?.navBackground !== results.refactored.header?.navBackground) {
    results.differences.push({
      element: 'Header Nav Background',
      original: results.original.header.navBackground,
      refactored: results.refactored.header.navBackground
    });
  }
  
  if (results.original.body?.backgroundColor !== results.refactored.body?.backgroundColor) {
    results.differences.push({
      element: 'Body Background Color',
      original: results.original.body.backgroundColor,
      refactored: results.refactored.body.backgroundColor
    });
  }
  
  await page1.close();
  await page2.close();
  
  return results;
}

(async () => {
  console.log('🔍 Comparing original vs refactored site styles...\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const results = await compareStyles(browser);
    
    if (results.differences.length === 0) {
      console.log('✅ Perfect parity achieved!');
    } else {
      console.log(`❌ Found ${results.differences.length} differences:\n`);
      
      results.differences.forEach((diff, index) => {
        console.log(`${index + 1}. ${diff.element}:`);
        console.log(`   Original:   ${diff.original}`);
        console.log(`   Refactored: ${diff.refactored}\n`);
      });
      
      // Generate fix recommendations
      console.log('\n📝 Recommended fixes for Layout.astro:\n');
      
      const hasTitleGradient = results.differences.find(d => d.element === 'Hero Title Gradient');
      if (hasTitleGradient) {
        console.log('1. Update hero title gradient:');
        console.log('   Change: bg-gradient-to-r from-white to-gray-300');
        console.log('   To:     Custom CSS with 353deg gradient from rgb(153,153,153) to white\n');
      }
      
      const hasSubtitleColor = results.differences.find(d => d.element === 'Hero Subtitle Color');
      if (hasSubtitleColor) {
        console.log('2. Update subtitle color:');
        console.log('   Change: text-gray-300');
        console.log('   To:     Custom color rgba(255, 246, 238, 0.72)\n');
      }
      
      const hasCtaColor = results.differences.find(d => d.element === 'CTA Button Text Color');
      if (hasCtaColor) {
        console.log('3. Update CTA button text color:');
        console.log('   Change: text-gray-900');
        console.log('   To:     Custom color rgb(41, 48, 69)\n');
      }
      
      const hasHeaderBg = results.differences.find(d => d.element === 'Header Nav Background');
      if (hasHeaderBg) {
        console.log('4. Update header nav background:');
        console.log('   Change: bg-gray-900/50');
        console.log('   To:     Transparent or matching original\n');
      }
      
      const hasBodyBg = results.differences.find(d => d.element === 'Body Background Color');
      if (hasBodyBg) {
        console.log('5. Update body background (global):');
        console.log('   In Layout.astro <body> tag:');
        console.log('   Change: bg-gray-900');
        console.log('   To:     Custom color rgb(40, 40, 40)\n');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();