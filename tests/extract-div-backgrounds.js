// Extract backgrounds from divs and other containers
import puppeteer from 'puppeteer';

async function extractDivBackgrounds() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  
  console.log('🔍 Extracting div/container backgrounds...\n');
  
  const backgrounds = await page.evaluate(() => {
    const results = [];
    
    // Get all major containers
    const containers = document.querySelectorAll('main > div, .bg-page-bg, [class*="bg-"], [style*="background"]');
    
    containers.forEach(container => {
      const styles = window.getComputedStyle(container);
      const heading = container.querySelector('h2');
      const hasFeatures = container.textContent.includes('Auto-drafts');
      const hasPricing = container.querySelector('#pricing');
      const hasFAQ = container.textContent.includes('Frequently asked questions');
      
      if (styles.backgroundColor !== 'rgba(0, 0, 0, 0)' || styles.backgroundImage !== 'none') {
        results.push({
          tag: container.tagName,
          className: container.className,
          id: container.id,
          backgroundColor: styles.backgroundColor,
          backgroundImage: styles.backgroundImage,
          heading: heading ? heading.textContent.trim() : null,
          isFeatures: hasFeatures,
          isPricing: hasPricing,
          isFAQ: hasFAQ,
          textPreview: container.textContent.substring(0, 100).trim()
        });
      }
    });
    
    return results;
  });
  
  console.log('Containers with backgrounds:');
  backgrounds.forEach((bg, i) => {
    console.log(`\n${i}. ${bg.tag}${bg.id ? '#' + bg.id : ''} ${bg.className ? '.' + bg.className.split(' ').join('.') : ''}`);
    console.log(`   Background: ${bg.backgroundColor}`);
    if (bg.backgroundImage !== 'none') {
      console.log(`   Background Image: ${bg.backgroundImage.substring(0, 50)}...`);
    }
    if (bg.heading) console.log(`   Heading: "${bg.heading}"`);
    if (bg.isFeatures) console.log(`   ✓ Features section`);
    if (bg.isPricing) console.log(`   ✓ Pricing section`);
    if (bg.isFAQ) console.log(`   ✓ FAQ section`);
  });
  
  // Now check the refactor site for comparison
  console.log('\n\n🔄 Checking refactor site for comparison...');
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
  
  const refactorSections = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    return sections.map(section => {
      const styles = window.getComputedStyle(section);
      const heading = section.querySelector('h2');
      
      return {
        className: section.className,
        id: section.id,
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        heading: heading ? heading.textContent.trim() : null,
        hasFeatures: section.textContent.includes('Auto-drafts'),
        hasPricing: !!section.querySelector('#pricing') || section.id === 'pricing',
        hasFAQ: section.textContent.includes('Frequently asked questions')
      };
    });
  });
  
  console.log('\nRefactor sections:');
  refactorSections.forEach((section, i) => {
    console.log(`\n${i}. section${section.id ? '#' + section.id : ''} ${section.className ? '.' + section.className : ''}`);
    console.log(`   Background: ${section.backgroundColor}`);
    if (section.backgroundImage !== 'none') {
      console.log(`   Background Image: ${section.backgroundImage.substring(0, 50)}...`);
    }
    if (section.heading) console.log(`   Heading: "${section.heading}"`);
    if (section.hasFeatures) console.log(`   ✓ Features section`);
    if (section.hasPricing) console.log(`   ✓ Pricing section`);
    if (section.hasFAQ) console.log(`   ✓ FAQ section`);
  });
  
  await browser.close();
}

extractDivBackgrounds().catch(console.error);