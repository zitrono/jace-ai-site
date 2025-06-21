import puppeteer from 'puppeteer';

async function debugPricingCheckmarks() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
  
  // Try different selectors
  const selectors = [
    '#pricing svg.text-emerald-500',
    '#pricing svg.lucide-check',
    '#pricing svg.lucide',
    '#pricing svg[class*="emerald"]',
    '#pricing svg',
    'section#pricing svg'
  ];
  
  for (const selector of selectors) {
    const count = await page.$$eval(selector, els => els.length);
    console.log(`${selector}: ${count} elements`);
  }
  
  // Get details of all SVGs in pricing
  const svgDetails = await page.$$eval('#pricing svg', svgs => 
    svgs.slice(0, 5).map(svg => ({
      className: svg.className.baseVal || svg.className || 'no-class',
      classList: Array.from(svg.classList || []),
      color: window.getComputedStyle(svg).color,
      stroke: window.getComputedStyle(svg).stroke,
      parentText: svg.parentElement?.textContent?.trim().substring(0, 50)
    }))
  );
  
  console.log('\nFirst 5 SVGs in pricing:');
  svgDetails.forEach((svg, i) => {
    console.log(`${i}: ${svg.className}`);
    console.log(`   Classes: [${svg.classList.join(', ')}]`);
    console.log(`   Color: ${svg.color}`);
    console.log(`   Parent: ${svg.parentText}`);
  });
  
  await browser.close();
}

debugPricingCheckmarks().catch(console.error);