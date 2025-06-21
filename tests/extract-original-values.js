// Extract all exact design values from the original jace.ai site
// This will be our source of truth for design parity

import puppeteer from 'puppeteer';

async function extractOriginalValues() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('🔍 Extracting all design values from original site...\n');
  
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  
  const values = {};
  
  // 1. Button styles (Get Started for Free)
  console.log('📱 Button Styles:');
  const ctaButtons = await page.$$eval('button', buttons => 
    buttons.filter(btn => btn.textContent.includes('Get Started')).map(btn => {
      const styles = window.getComputedStyle(btn);
      return {
        text: btn.textContent.trim(),
        padding: styles.padding,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderRadius: styles.borderRadius,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        height: styles.height,
        lineHeight: styles.lineHeight,
        border: styles.border,
        boxShadow: styles.boxShadow,
        className: btn.className
      };
    })
  );
  values.ctaButtons = ctaButtons;
  console.log('CTA Buttons:', ctaButtons);
  
  // 2. Checkmark colors in pricing
  console.log('\n✅ Checkmark Colors:');
  const checkmarkColors = await page.$$eval('#pricing svg', svgs => 
    svgs.map(svg => {
      const styles = window.getComputedStyle(svg);
      return {
        color: styles.color,
        fill: styles.fill,
        stroke: styles.stroke,
        className: svg.className.baseVal || svg.className
      };
    })
  );
  values.checkmarkColors = checkmarkColors;
  console.log('Checkmarks:', checkmarkColors);
  
  // 3. Feature card styles (Auto Drafts block)
  console.log('\n📦 Feature Cards:');
  const featureCards = await page.$$eval('.grid > div', cards => 
    cards.slice(0, 3).map(card => {
      const styles = window.getComputedStyle(card);
      const heading = card.querySelector('h3');
      return {
        borderRadius: styles.borderRadius,
        backgroundColor: styles.backgroundColor,
        padding: styles.padding,
        border: styles.border,
        heading: heading ? heading.textContent : null
      };
    })
  );
  values.featureCards = featureCards;
  console.log('Feature cards:', featureCards);
  
  // 4. Typography (fonts, sizes, line heights)
  console.log('\n📝 Typography:');
  const typography = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const h1Styles = window.getComputedStyle(h1);
    
    const h2 = document.querySelector('h2');
    const h2Styles = h2 ? window.getComputedStyle(h2) : null;
    
    const heroSubtitle = document.querySelector('h1 + p');
    const subtitleStyles = heroSubtitle ? window.getComputedStyle(heroSubtitle) : null;
    
    return {
      h1: {
        fontSize: h1Styles.fontSize,
        fontFamily: h1Styles.fontFamily,
        fontWeight: h1Styles.fontWeight,
        lineHeight: h1Styles.lineHeight,
        letterSpacing: h1Styles.letterSpacing,
        color: h1Styles.color
      },
      h2: h2Styles ? {
        fontSize: h2Styles.fontSize,
        fontFamily: h2Styles.fontFamily,
        fontWeight: h2Styles.fontWeight,
        lineHeight: h2Styles.lineHeight,
        color: h2Styles.color
      } : null,
      heroSubtitle: subtitleStyles ? {
        fontSize: subtitleStyles.fontSize,
        fontFamily: subtitleStyles.fontFamily,
        fontWeight: subtitleStyles.fontWeight,
        lineHeight: subtitleStyles.lineHeight,
        color: subtitleStyles.color,
        opacity: subtitleStyles.opacity
      } : null
    };
  });
  values.typography = typography;
  console.log('Typography:', typography);
  
  // 5. FAQ section styles
  console.log('\n❓ FAQ Section:');
  const faqSection = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('section'))
      .find(s => s.textContent.includes('Frequently asked questions'));
    
    if (!section) return null;
    
    const sectionStyles = window.getComputedStyle(section);
    const buttons = section.querySelectorAll('button[aria-expanded]');
    const firstButton = buttons[0];
    const buttonStyles = firstButton ? window.getComputedStyle(firstButton) : null;
    
    return {
      section: {
        backgroundColor: sectionStyles.backgroundColor,
        backgroundImage: sectionStyles.backgroundImage,
        padding: sectionStyles.padding
      },
      buttons: buttonStyles ? {
        padding: buttonStyles.padding,
        backgroundColor: buttonStyles.backgroundColor,
        borderRadius: buttonStyles.borderRadius,
        ariaExpanded: firstButton.getAttribute('aria-expanded')
      } : null,
      buttonCount: buttons.length
    };
  });
  values.faqSection = faqSection;
  console.log('FAQ Section:', faqSection);
  
  // 6. Pricing values
  console.log('\n💰 Pricing:');
  const pricing = await page.$$eval('#pricing .text-5xl', prices => 
    prices.map(el => ({
      price: el.textContent.trim(),
      fontSize: window.getComputedStyle(el).fontSize,
      fontWeight: window.getComputedStyle(el).fontWeight
    }))
  );
  values.pricing = pricing;
  console.log('Pricing:', pricing);
  
  // 7. Section padding/spacing
  console.log('\n📏 Section Spacing:');
  const sectionSpacing = await page.$$eval('section', sections => 
    sections.slice(0, 5).map(section => {
      const styles = window.getComputedStyle(section);
      const heading = section.querySelector('h2');
      return {
        padding: styles.padding,
        margin: styles.margin,
        sectionName: heading ? heading.textContent.trim() : 'Unknown'
      };
    })
  );
  values.sectionSpacing = sectionSpacing;
  console.log('Section spacing:', sectionSpacing);
  
  // 8. "Start saving 90%" block
  console.log('\n💡 Start Saving 90% Block:');
  const savingBlock = await page.evaluate(() => {
    const block = Array.from(document.querySelectorAll('section'))
      .find(s => s.textContent.includes('Start saving 90%'));
    
    if (!block) {
      // Try alternative selectors
      const altBlock = document.querySelector('[class*="gradient"]');
      if (altBlock && altBlock.textContent.includes('90%')) {
        return {
          found: true,
          selector: '[class*="gradient"]',
          text: altBlock.textContent.trim(),
          styles: {
            background: window.getComputedStyle(altBlock).background,
            backgroundColor: window.getComputedStyle(altBlock).backgroundColor,
            backgroundImage: window.getComputedStyle(altBlock).backgroundImage,
            padding: window.getComputedStyle(altBlock).padding,
            borderRadius: window.getComputedStyle(altBlock).borderRadius
          }
        };
      }
      return { found: false, searchedText: 'Start saving 90%' };
    }
    
    const styles = window.getComputedStyle(block);
    const heading = block.querySelector('h2');
    const button = block.querySelector('button');
    
    return {
      found: true,
      text: heading ? heading.textContent.trim() : block.textContent.trim(),
      styles: {
        background: styles.background,
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        padding: styles.padding,
        borderRadius: styles.borderRadius
      },
      button: button ? {
        text: button.textContent.trim(),
        backgroundColor: window.getComputedStyle(button).backgroundColor,
        color: window.getComputedStyle(button).color
      } : null
    };
  });
  values.savingBlock = savingBlock;
  console.log('Saving 90% block:', savingBlock);
  
  // 9. Header navigation styles
  console.log('\n🧭 Navigation:');
  const navigation = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const navLinks = nav ? nav.querySelectorAll('a') : [];
    const mobileMenuButton = document.querySelector('button[aria-label*="menu"]');
    
    return {
      links: Array.from(navLinks).map(link => ({
        text: link.textContent.trim(),
        href: link.getAttribute('href'),
        color: window.getComputedStyle(link).color,
        fontSize: window.getComputedStyle(link).fontSize,
        fontWeight: window.getComputedStyle(link).fontWeight
      })),
      mobileMenuButton: mobileMenuButton ? {
        ariaLabel: mobileMenuButton.getAttribute('aria-label'),
        ariaExpanded: mobileMenuButton.getAttribute('aria-expanded')
      } : null
    };
  });
  values.navigation = navigation;
  console.log('Navigation:', navigation);
  
  // Save to file
  const fs = await import('fs/promises');
  await fs.writeFile(
    'original-design-values.json', 
    JSON.stringify(values, null, 2)
  );
  
  console.log('\n✅ Design values extracted and saved to original-design-values.json');
  
  await browser.close();
}

extractOriginalValues().catch(console.error);