import puppeteer from 'puppeteer';

(async () => {
  console.log('Checking button colors on original site...\n');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to the original site
    await page.goto('https://zitrono.github.io/jace-ai-site/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait a bit for any dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Find all elements with text "Get Started for Free"
    const buttonsWithText = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements
        .filter(el => el.textContent && el.textContent.trim() === 'Get Started for Free')
        .map(el => {
          const styles = window.getComputedStyle(el);
          return {
            tagName: el.tagName,
            className: el.className,
            backgroundColor: styles.backgroundColor,
            background: styles.background,
            color: styles.color,
            display: styles.display,
            position: styles.position,
            padding: styles.padding,
            border: styles.border,
            borderRadius: styles.borderRadius,
            outerHTML: el.outerHTML.substring(0, 200) + '...'
          };
        });
    });
    
    console.log('=== Elements with text "Get Started for Free" ===');
    if (buttonsWithText.length === 0) {
      console.log('No elements found with exact text "Get Started for Free"');
    } else {
      buttonsWithText.forEach((button, index) => {
        console.log(`\nButton ${index + 1}:`);
        console.log(`  Tag: ${button.tagName}`);
        console.log(`  Class: ${button.className || '(no class)'}`);
        console.log(`  Background Color: ${button.backgroundColor}`);
        console.log(`  Background: ${button.background}`);
        console.log(`  Text Color: ${button.color}`);
        console.log(`  Display: ${button.display}`);
        console.log(`  Position: ${button.position}`);
        console.log(`  Padding: ${button.padding}`);
        console.log(`  Border: ${button.border}`);
        console.log(`  Border Radius: ${button.borderRadius}`);
        console.log(`  HTML: ${button.outerHTML}`);
      });
    }
    
    // Find elements with class containing "yellow" or "cta"
    const yellowOrCtaButtons = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('[class*="yellow"], [class*="cta"], .yellow, .cta'));
      return elements.map(el => {
        const styles = window.getComputedStyle(el);
        return {
          tagName: el.tagName,
          className: el.className,
          textContent: el.textContent.trim().substring(0, 50),
          backgroundColor: styles.backgroundColor,
          background: styles.background,
          color: styles.color,
          display: styles.display,
          padding: styles.padding,
          border: styles.border,
          borderRadius: styles.borderRadius
        };
      });
    });
    
    console.log('\n\n=== Elements with class containing "yellow" or "cta" ===');
    if (yellowOrCtaButtons.length === 0) {
      console.log('No elements found with class containing "yellow" or "cta"');
    } else {
      yellowOrCtaButtons.forEach((button, index) => {
        console.log(`\nElement ${index + 1}:`);
        console.log(`  Tag: ${button.tagName}`);
        console.log(`  Class: ${button.className}`);
        console.log(`  Text: ${button.textContent || '(no text)'}`);
        console.log(`  Background Color: ${button.backgroundColor}`);
        console.log(`  Background: ${button.background}`);
        console.log(`  Text Color: ${button.color}`);
        console.log(`  Display: ${button.display}`);
        console.log(`  Padding: ${button.padding}`);
        console.log(`  Border: ${button.border}`);
        console.log(`  Border Radius: ${button.borderRadius}`);
      });
    }
    
    // Also check for any <button> or <a> elements that might be styled as buttons
    const allButtons = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a[href]'));
      return elements
        .filter(el => {
          const styles = window.getComputedStyle(el);
          // Filter for elements that look like buttons (have padding, background color, etc.)
          return styles.padding !== '0px' && 
                 styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                 styles.backgroundColor !== 'transparent';
        })
        .map(el => {
          const styles = window.getComputedStyle(el);
          return {
            tagName: el.tagName,
            className: el.className,
            textContent: el.textContent.trim().substring(0, 50),
            backgroundColor: styles.backgroundColor,
            background: styles.background,
            color: styles.color,
            href: el.href || 'N/A'
          };
        });
    });
    
    console.log('\n\n=== All styled button-like elements ===');
    const uniqueColors = new Set();
    allButtons.forEach((button, index) => {
      if (button.backgroundColor && button.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        uniqueColors.add(button.backgroundColor);
      }
      console.log(`\nButton ${index + 1}:`);
      console.log(`  Tag: ${button.tagName}`);
      console.log(`  Class: ${button.className || '(no class)'}`);
      console.log(`  Text: ${button.textContent}`);
      console.log(`  Background Color: ${button.backgroundColor}`);
      console.log(`  Text Color: ${button.color}`);
      console.log(`  Href: ${button.href}`);
    });
    
    console.log('\n\n=== Unique Background Colors Found ===');
    Array.from(uniqueColors).forEach(color => {
      console.log(`  ${color}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();