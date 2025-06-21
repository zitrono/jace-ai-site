// Compare header button vertical positioning between original and refactor
import puppeteer from 'puppeteer';

async function compareHeaderButtons() {
  const browser = await puppeteer.launch({ headless: false });
  
  console.log('📸 Taking header screenshots for comparison...\n');
  
  // Test both sites
  for (const site of [
    { url: 'http://localhost:8000', name: 'original' },
    { url: 'http://localhost:4321', name: 'refactor' }
  ]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    await page.goto(site.url, { waitUntil: 'networkidle0' });
    
    // Wait a bit for any animations
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Take full header screenshot
    const header = await page.$('header');
    if (header) {
      await header.screenshot({ 
        path: `header-${site.name}-full.png`,
        type: 'png'
      });
      console.log(`✅ Saved header-${site.name}-full.png`);
    }
    
    // Get button details and positions
    const buttonInfo = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      // Find the visible desktop button
      const ctaButton = buttons.find(btn => {
        const styles = window.getComputedStyle(btn);
        return btn.textContent.includes('Get Started') && styles.display !== 'none';
      });
      
      if (!ctaButton) return null;
      
      const rect = ctaButton.getBoundingClientRect();
      const styles = window.getComputedStyle(ctaButton);
      const headerRect = document.querySelector('header').getBoundingClientRect();
      
      // Get parent container info
      const parent = ctaButton.parentElement;
      const parentRect = parent.getBoundingClientRect();
      const parentStyles = window.getComputedStyle(parent);
      
      return {
        button: {
          text: ctaButton.textContent.trim(),
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          offsetFromHeaderTop: rect.top - headerRect.top,
          centerY: rect.top + (rect.height / 2),
          styles: {
            padding: styles.padding,
            margin: styles.margin,
            lineHeight: styles.lineHeight,
            fontSize: styles.fontSize,
            height: styles.height,
            display: styles.display,
            alignItems: styles.alignItems,
            verticalAlign: styles.verticalAlign
          }
        },
        parent: {
          tag: parent.tagName,
          className: parent.className,
          top: parentRect.top,
          height: parentRect.height,
          offsetFromHeaderTop: parentRect.top - headerRect.top,
          styles: {
            display: parentStyles.display,
            alignItems: parentStyles.alignItems,
            justifyContent: parentStyles.justifyContent,
            padding: parentStyles.padding,
            margin: parentStyles.margin,
            gap: parentStyles.gap
          }
        },
        header: {
          height: headerRect.height,
          top: headerRect.top
        }
      };
    });
    
    console.log(`\n${site.name.toUpperCase()} SITE:`);
    if (buttonInfo) {
      console.log('Header height:', buttonInfo.header.height);
      console.log('Button offset from header top:', buttonInfo.button.offsetFromHeaderTop);
      console.log('Button center Y:', buttonInfo.button.centerY);
      console.log('Button height:', buttonInfo.button.height);
      console.log('Button styles:', buttonInfo.button.styles);
      console.log('Parent container:', buttonInfo.parent.tag, buttonInfo.parent.className);
      console.log('Parent offset from header:', buttonInfo.parent.offsetFromHeaderTop);
      console.log('Parent styles:', buttonInfo.parent.styles);
    } else {
      console.log('❌ Could not find Get Started button in header');
    }
    
    // Take zoomed screenshot of just the button area
    if (buttonInfo) {
      await page.screenshot({
        path: `header-${site.name}-button-area.png`,
        clip: {
          x: buttonInfo.button.left - 50,
          y: buttonInfo.button.top - 30,
          width: buttonInfo.button.width + 100,
          height: buttonInfo.button.height + 60
        }
      });
      console.log(`✅ Saved header-${site.name}-button-area.png`);
    }
    
    await page.close();
  }
  
  // Now create a side-by-side comparison
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          margin: 0; 
          background: #1a1a1a; 
          color: white;
          font-family: system-ui;
        }
        .container { 
          display: flex; 
          gap: 20px; 
          padding: 20px;
          flex-direction: column;
        }
        .row {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .site {
          flex: 1;
        }
        h2 { 
          margin: 0 0 10px 0; 
          font-size: 18px;
        }
        img { 
          max-width: 100%; 
          border: 2px solid #333;
          display: block;
        }
        .guides {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          pointer-events: none;
        }
        .guide-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255, 0, 0, 0.5);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Header Button Vertical Position Comparison</h1>
        
        <div class="row">
          <div class="site">
            <h2>Original Site</h2>
            <div style="position: relative;">
              <img src="file://${process.cwd()}/header-original-full.png" />
            </div>
          </div>
          <div class="site">
            <h2>Refactor Site</h2>
            <div style="position: relative;">
              <img src="file://${process.cwd()}/header-refactor-full.png" />
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="site">
            <h2>Original Button Area (Zoomed)</h2>
            <img src="file://${process.cwd()}/header-original-button-area.png" />
          </div>
          <div class="site">
            <h2>Refactor Button Area (Zoomed)</h2>
            <img src="file://${process.cwd()}/header-refactor-button-area.png" />
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  
  await page.screenshot({ 
    path: 'header-comparison.png', 
    fullPage: true 
  });
  console.log('\n✅ Saved header-comparison.png - Full comparison image');
  
  await browser.close();
}

compareHeaderButtons().catch(console.error);