import puppeteer from 'puppeteer';

async function checkPricing() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  
  // Scroll to pricing section
  await page.evaluate(() => {
    document.querySelector('#pricing')?.scrollIntoView();
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Extract all pricing information
  const pricingData = await page.evaluate(() => {
    const section = document.querySelector('#pricing');
    if (!section) return { found: false };
    
    // Find all price elements
    const priceElements = section.querySelectorAll('.text-5xl, .text-4xl, [class*="text-"][class*="xl"]');
    const prices = Array.from(priceElements).map(el => ({
      text: el.textContent.trim(),
      className: el.className,
      fontSize: window.getComputedStyle(el).fontSize
    }));
    
    // Find all plan names
    const planNames = section.querySelectorAll('h3');
    const plans = Array.from(planNames).map(el => el.textContent.trim());
    
    return {
      found: true,
      prices,
      plans,
      sectionHTML: section.innerHTML.substring(0, 500)
    };
  });
  
  console.log('Pricing data:', JSON.stringify(pricingData, null, 2));
  
  await browser.close();
}

checkPricing().catch(console.error);