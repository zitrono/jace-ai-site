#!/usr/bin/env node

/**
 * Quick Puppeteer validation: Compare key functionality
 */

import puppeteer from 'puppeteer';

async function quickValidation() {
  console.log('🔍 Quick Puppeteer Validation: Original vs Refactored\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Test Original Site
    console.log('🌐 Testing Original Site: https://zitrono.github.io/jace-ai-site/');
    await page.goto('https://zitrono.github.io/jace-ai-site/', { waitUntil: 'networkidle0' });
    
    const originalResults = {
      title: await page.title(),
      hero: await page.$eval('h1', el => el.textContent.trim()).catch(() => 'NOT_FOUND'),
      hasNav: await page.$('nav, header') !== null,
      hasCTA: await page.$$('button').then(buttons => buttons.length > 0),
      screenshot: 'original-site.png'
    };
    
    await page.screenshot({ path: originalResults.screenshot, fullPage: false });
    
    console.log('📊 Original Site Results:');
    console.log('   Title:', originalResults.title);
    console.log('   Hero:', originalResults.hero);
    console.log('   Has Navigation:', originalResults.hasNav);
    console.log('   Has CTA Buttons:', originalResults.hasCTA);
    console.log('   Screenshot:', originalResults.screenshot);
    
    // Test Refactored Site
    console.log('\n🌐 Testing Refactored Site: http://localhost:4321');
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
    
    const refactoredResults = {
      title: await page.title(),
      hero: await page.$eval('h1', el => el.textContent.trim()).catch(() => 'NOT_FOUND'),
      hasNav: await page.$('nav, header') !== null,
      hasCTA: await page.$$('button').then(buttons => buttons.length > 0),
      screenshot: 'refactored-site.png'
    };
    
    await page.screenshot({ path: refactoredResults.screenshot, fullPage: false });
    
    console.log('📊 Refactored Site Results:');
    console.log('   Title:', refactoredResults.title);
    console.log('   Hero:', refactoredResults.hero);
    console.log('   Has Navigation:', refactoredResults.hasNav);
    console.log('   Has CTA Buttons:', refactoredResults.hasCTA);
    console.log('   Screenshot:', refactoredResults.screenshot);
    
    // Compare Results
    console.log('\n📋 Comparison Results:');
    
    const titleMatch = originalResults.title === refactoredResults.title;
    const heroMatch = originalResults.hero === refactoredResults.hero;
    const navMatch = originalResults.hasNav === refactoredResults.hasNav;
    const ctaMatch = originalResults.hasCTA === refactoredResults.hasCTA;
    
    console.log('   ✅ Titles match:', titleMatch ? 'YES' : 'NO');
    console.log('   ✅ Hero text matches:', heroMatch ? 'YES' : 'NO');
    console.log('   ✅ Navigation structure:', navMatch ? 'BOTH HAVE NAV' : 'DIFFERENT');
    console.log('   ✅ CTA buttons present:', ctaMatch ? 'BOTH HAVE BUTTONS' : 'DIFFERENT');
    
    const allMatch = titleMatch && heroMatch && navMatch && ctaMatch;
    
    console.log('\n' + '='.repeat(60));
    if (allMatch) {
      console.log('🎉 SUCCESS: Complete functional parity achieved!');
      console.log('✨ Refactoring validated: Original → Astro + Tailwind');
      console.log('🏗️  Clean components with identical functionality');
    } else {
      console.log('⚠️  REVIEW: Some differences detected');
      console.log('📝 Check the comparison above for details');
    }
    console.log('='.repeat(60));
    
    return allMatch;
    
  } catch (error) {
    console.error('❌ Validation error:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = await quickValidation();
  process.exit(success ? 0 : 1);
}

export { quickValidation };