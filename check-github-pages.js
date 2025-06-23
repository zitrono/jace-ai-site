// Check if GitHub Pages site is running
import puppeteer from 'puppeteer';

const GH_PAGES_URL = 'https://zitrono.github.io/ralph-web/';

async function checkGitHubPages() {
  console.log('🔍 Checking GitHub Pages Deployment\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      const type = msg.type();
      if (type === 'error') {
        console.log('🔴 Browser Error:', msg.text());
      }
    });
    
    page.on('response', response => {
      const status = response.status();
      const url = response.url();
      if (status >= 400) {
        console.log(`🔴 HTTP ${status}: ${url}`);
      } else if (status >= 200 && status < 300) {
        console.log(`✅ HTTP ${status}: ${url}`);
      }
    });
    
    console.log(`🌐 Testing: ${GH_PAGES_URL}`);
    
    try {
      const response = await page.goto(GH_PAGES_URL, { 
        waitUntil: 'networkidle0',
        timeout: 15000 
      });
      
      const status = response.status();
      console.log(`\n📊 Response Status: ${status}`);
      
      if (status === 200) {
        console.log('✅ GitHub Pages is LIVE!\n');
        
        // Get page info
        const pageTitle = await page.title();
        const pageUrl = page.url();
        
        console.log('📋 SITE INFORMATION:');
        console.log('===================');
        console.log(`Title: ${pageTitle}`);
        console.log(`URL: ${pageUrl}`);
        
        // Check critical elements
        const criticalElements = [
          { name: 'Hero Title', selector: 'h1' },
          { name: 'Header', selector: 'header' },
          { name: 'Navigation', selector: 'nav' },
          { name: 'CTA Button', selector: 'button, .cta-button, [class*="cta"]' },
          { name: 'Footer', selector: 'footer' }
        ];
        
        console.log('\n🔍 ELEMENT CHECK:');
        console.log('================');
        
        let elementsFound = 0;
        for (const element of criticalElements) {
          try {
            const el = await page.$(element.selector);
            if (el) {
              console.log(`✅ ${element.name}: Found`);
              elementsFound++;
              
              if (element.name === 'Hero Title') {
                const text = await el.evaluate(el => el.textContent?.trim());
                console.log(`   Text: "${text}"`);
              }
            } else {
              console.log(`❌ ${element.name}: Not found`);
            }
          } catch (error) {
            console.log(`❌ ${element.name}: Error - ${error.message}`);
          }
        }
        
        // Take screenshot
        console.log('\n📸 SCREENSHOT:');
        console.log('==============');
        try {
          await page.screenshot({ 
            path: 'github-pages-site.png', 
            fullPage: true 
          });
          console.log('✅ Screenshot saved: github-pages-site.png');
        } catch (screenshotError) {
          console.log(`❌ Screenshot failed: ${screenshotError.message}`);
        }
        
        console.log(`\n🎯 GITHUB PAGES STATUS: ✅ DEPLOYED AND WORKING`);
        console.log(`📍 Live URL: ${GH_PAGES_URL}`);
        console.log(`🏗️  Elements Found: ${elementsFound}/${criticalElements.length}`);
        
        return true;
        
      } else if (status === 404) {
        console.log('❌ GitHub Pages not found (404)');
        console.log('\n🔧 POSSIBLE ISSUES:');
        console.log('- GitHub Pages not enabled for this repository');
        console.log('- Docs folder not configured as source');
        console.log('- Site still building/deploying');
        console.log('- Repository might be private');
        return false;
        
      } else {
        console.log(`❌ Unexpected status: ${status}`);
        return false;
      }
      
    } catch (navigationError) {
      console.log(`❌ Navigation failed: ${navigationError.message}`);
      
      if (navigationError.message.includes('ERR_NAME_NOT_RESOLVED')) {
        console.log('\n🔧 DNS ISSUE: Repository might not exist or be private');
      } else if (navigationError.message.includes('timeout')) {
        console.log('\n🔧 TIMEOUT: Site might be slow to load or not deployed yet');
      }
      
      return false;
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

// Run the check
(async () => {
  const isLive = await checkGitHubPages();
  
  if (!isLive) {
    console.log('\n💡 DEPLOYMENT CHECKLIST:');
    console.log('========================');
    console.log('1. Repository Settings → Pages');
    console.log('2. Source: Deploy from a branch');
    console.log('3. Branch: main');
    console.log('4. Folder: /docs');
    console.log('5. Save settings and wait for deployment');
    console.log('\n⏱️  GitHub Pages deployment can take 5-10 minutes');
  }
  
  process.exit(isLive ? 0 : 1);
})();