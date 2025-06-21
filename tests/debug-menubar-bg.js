import puppeteer from 'puppeteer';

async function debugMenubarBackground() {
  const browser = await puppeteer.launch({
    headless: true
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('Navigating to http://localhost:4321...');
    await page.goto('http://localhost:4321', {
      waitUntil: 'networkidle2'
    });
    
    // Get computed styles and additional info for each element
    const debugInfo = await page.evaluate(() => {
      const header = document.querySelector('header');
      const nav = document.querySelector('header > nav');
      const innerDiv = document.querySelector('header nav > div');
      
      const results = {};
      
      if (header) {
        const headerStyle = window.getComputedStyle(header);
        results.header = {
          backgroundColor: headerStyle.backgroundColor,
          background: headerStyle.background
        };
      } else {
        results.header = 'Element not found';
      }
      
      if (nav) {
        const navStyle = window.getComputedStyle(nav);
        results.nav = {
          backgroundColor: navStyle.backgroundColor,
          background: navStyle.background
        };
      } else {
        results.nav = 'Element not found';
      }
      
      if (innerDiv) {
        const divStyle = window.getComputedStyle(innerDiv);
        results.innerDiv = {
          backgroundColor: divStyle.backgroundColor,
          background: divStyle.background,
          outerHTML: innerDiv.outerHTML,
          inlineStyle: innerDiv.getAttribute('style') || 'No inline styles',
          classList: Array.from(innerDiv.classList).join(', ') || 'No classes'
        };
      } else {
        results.innerDiv = 'Element not found';
      }
      
      return results;
    });
    
    // Print results
    console.log('\n=== Menubar Background Colors ===\n');
    
    console.log('1. Header element:');
    if (typeof debugInfo.header === 'object') {
      console.log(`   background-color: ${debugInfo.header.backgroundColor}`);
      console.log(`   background: ${debugInfo.header.background}`);
    } else {
      console.log(`   ${debugInfo.header}`);
    }
    
    console.log('\n2. Header > nav element:');
    if (typeof debugInfo.nav === 'object') {
      console.log(`   background-color: ${debugInfo.nav.backgroundColor}`);
      console.log(`   background: ${debugInfo.nav.background}`);
    } else {
      console.log(`   ${debugInfo.nav}`);
    }
    
    console.log('\n3. Header nav > div element:');
    if (typeof debugInfo.innerDiv === 'object') {
      console.log(`   background-color: ${debugInfo.innerDiv.backgroundColor}`);
      console.log(`   background: ${debugInfo.innerDiv.background}`);
      console.log(`   inline style: ${debugInfo.innerDiv.inlineStyle}`);
      console.log(`   classList: ${debugInfo.innerDiv.classList}`);
      console.log(`   outerHTML:\n${debugInfo.innerDiv.outerHTML}`);
    } else {
      console.log(`   ${debugInfo.innerDiv}`);
    }
    
    console.log('\n================================\n');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

// Run the debug script
debugMenubarBackground().catch(console.error);