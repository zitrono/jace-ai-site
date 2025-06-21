import puppeteer from 'puppeteer';

async function debugButtons() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
  
  const buttons = await page.$$eval('button', btns => 
    btns.filter(btn => btn.textContent.includes('Get Started for Free'))
      .map((btn, i) => {
        const styles = window.getComputedStyle(btn);
        const rect = btn.getBoundingClientRect();
        return {
          index: i,
          text: btn.textContent.trim(),
          className: btn.className,
          height: styles.height,
          computedHeight: rect.height,
          fontSize: styles.fontSize,
          borderRadius: styles.borderRadius,
          display: styles.display,
          visibility: styles.visibility,
          isVisible: styles.display !== 'none',
          hasLgClass: btn.classList.contains('btn-lg'),
          location: btn.closest('header') ? 'header' : 
                   btn.closest('main') ? 'main' : 
                   btn.closest('footer') ? 'footer' : 'unknown'
        };
      })
  );
  
  console.log('All "Get Started for Free" buttons:');
  buttons.forEach(btn => {
    console.log(`\nButton ${btn.index}:`);
    console.log(`  Location: ${btn.location}`);
    console.log(`  Class: ${btn.className}`);
    console.log(`  Height: ${btn.height} (computed: ${btn.computedHeight}px)`);
    console.log(`  Font size: ${btn.fontSize}`);
    console.log(`  Border radius: ${btn.borderRadius}`);
    console.log(`  Visible: ${btn.isVisible}`);
    console.log(`  Has lg class: ${btn.hasLgClass}`);
  });
  
  await browser.close();
}

debugButtons().catch(console.error);