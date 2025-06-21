import puppeteer from 'puppeteer';
import { EnhancedOriginalJaceAISite } from './enhanced-original-site.pom.js';

async function checkLoginButtonAlignment() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('🔍 CHECKING LOGIN BUTTON VERTICAL ALIGNMENT...\n');
  
  try {
    const pom = new EnhancedOriginalJaceAISite(page);
    
    // Test both original and refactored sites
    const sites = [
      { name: 'ORIGINAL', url: 'https://zitrono.github.io/jace-ai-site/' },
      { name: 'REFACTORED', url: 'http://localhost:4322' }
    ];
    
    for (const site of sites) {
      console.log(`\n═══════════════════════════════════════════════════════`);
      console.log(`              ${site.name} SITE LOGIN BUTTON ALIGNMENT`);
      console.log(`═══════════════════════════════════════════════════════\n`);
      
      if (site.name === 'ORIGINAL') {
        await pom.navigate();
      } else {
        await page.goto(site.url, { waitUntil: 'networkidle0' });
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get login button alignment properties
      const loginButton = await page.$(pom.selectors.loginButton);
      if (loginButton) {
        const alignmentStyles = await page.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            // Vertical alignment properties
            verticalAlign: styles.verticalAlign,
            alignItems: styles.alignItems,
            alignSelf: styles.alignSelf,
            justifyContent: styles.justifyContent,
            
            // Display and positioning
            display: styles.display,
            position: styles.position,
            top: styles.top,
            bottom: styles.bottom,
            
            // Box model that affects alignment
            marginTop: styles.marginTop,
            marginBottom: styles.marginBottom,
            paddingTop: styles.paddingTop,
            paddingBottom: styles.paddingBottom,
            height: styles.height,
            lineHeight: styles.lineHeight,
            
            // Text alignment
            textAlign: styles.textAlign,
            
            // Flexbox alignment
            flexDirection: styles.flexDirection,
            
            // Container context
            parentDisplay: styles.display
          };
        }, loginButton);
        
        // Also get parent container styles for context
        const parentStyles = await page.evaluate((el) => {
          const parent = el.parentElement;
          if (!parent) return null;
          const styles = window.getComputedStyle(parent);
          return {
            display: styles.display,
            alignItems: styles.alignItems,
            justifyContent: styles.justifyContent,
            flexDirection: styles.flexDirection,
            gap: styles.gap
          };
        }, loginButton);
        
        console.log(`Login Button Alignment Properties:`);
        Object.entries(alignmentStyles).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
        
        console.log(`\nParent Container Properties:`);
        if (parentStyles) {
          Object.entries(parentStyles).forEach(([key, value]) => {
            console.log(`  parent.${key}: ${value}`);
          });
        }
        
        // Get bounding box for position analysis
        const boundingBox = await loginButton.boundingBox();
        console.log(`\nPosition Information:`);
        console.log(`  boundingBox: x=${boundingBox.x}, y=${boundingBox.y}, width=${boundingBox.width}, height=${boundingBox.height}`);
        
      } else {
        console.log('❌ Login button not found');
      }
    }
    
  } catch (error) {
    console.error('Error during login button alignment check:', error);
  } finally {
    await browser.close();
  }
}

checkLoginButtonAlignment();