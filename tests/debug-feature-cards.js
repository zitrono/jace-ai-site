import puppeteer from 'puppeteer';

async function debugFeatureCards() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
  
  // Check feature cards structure
  const cardsInfo = await page.evaluate(() => {
    // Find all grid containers
    const grids = Array.from(document.querySelectorAll('.grid'));
    
    return grids.map((grid, i) => {
      const children = Array.from(grid.children);
      return {
        gridIndex: i,
        childCount: children.length,
        firstThreeChildren: children.slice(0, 3).map(child => ({
          tagName: child.tagName,
          className: child.className,
          borderRadius: window.getComputedStyle(child).borderRadius,
          backgroundColor: window.getComputedStyle(child).backgroundColor,
          hasH3: !!child.querySelector('h3'),
          h3Text: child.querySelector('h3')?.textContent
        }))
      };
    });
  });
  
  console.log('Grid structures:', JSON.stringify(cardsInfo, null, 2));
  
  await browser.close();
}

debugFeatureCards().catch(console.error);