import puppeteer from 'puppeteer';

async function debugButtons() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
  
  // Get all buttons with their context
  const buttons = await page.$$eval('button', btns => 
    btns.filter(btn => btn.textContent.includes('Get Started for Free'))
      .map((btn, i) => {
        const styles = window.getComputedStyle(btn);
        const parent = btn.parentElement;
        const section = btn.closest('section');
        
        return {
          index: i,
          text: btn.textContent.trim(),
          borderRadius: styles.borderRadius,
          height: styles.height,
          className: btn.className,
          parentTag: parent?.tagName,
          parentClass: parent?.className,
          sectionClass: section?.className,
          sectionId: section?.id,
          inCTA: !!btn.closest('.bg-gradient-to-r'),
          inHero: !!btn.closest('main') && !btn.closest('section')
        };
      })
  );
  
  console.log('Buttons found:', JSON.stringify(buttons, null, 2));
  
  await browser.close();
}

debugButtons().catch(console.error);