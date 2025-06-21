import puppeteer from 'puppeteer';

async function testCheckmarks() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
  
  // Check pricing checkmarks
  const checkmarks = await page.$$('#pricing svg.text-emerald-500');
  console.log(`Found ${checkmarks.length} emerald checkmarks in pricing section`);
  
  // Check all SVGs in pricing
  const allSvgs = await page.$$eval('#pricing svg', svgs => 
    svgs.map(svg => ({
      className: svg.className.baseVal || svg.className,
      color: window.getComputedStyle(svg).color,
      parent: svg.parentElement.tagName
    }))
  );
  
  console.log('All SVGs in pricing:', allSvgs);
  
  await browser.close();
}

testCheckmarks().catch(console.error);