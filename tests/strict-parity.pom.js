// Strict Design Parity Page Object Model
// This POM enforces exact design parity between original and refactor
// NO conditional logic - refactor must match original exactly

export class StrictParityPOM {
  constructor(page) {
    this.page = page;
  }

  // Exact selectors from original site
  selectors = {
    // Navigation
    navigation: {
      logo: 'a[href*="index"]',
      navLinks: 'nav a',
      ctaButton: 'button.btn-primary'
    },

    // Hero Section
    hero: {
      title: 'h1',
      subtitle: 'h1 + p',
      ctaButton: 'main button'
    },

    // Trust Indicators
    trust: {
      casaBadge: '.bg-\\[\\#353535\\], .badge-certification',
      userCount: '.text-gray-400'
    },

    // Company Logos
    companies: {
      section: '.mt-16',
      logos: 'img[alt*="company"], img[alt*="logo"]'
    },

    // Features
    features: {
      cards: '.grid > div',
      headings: 'h3'
    },

    // Pricing
    pricing: {
      section: '#pricing',
      title: '#pricing h2',
      cards: '#pricing .card',
      prices: '.text-5xl',
      checkmarks: 'svg.lucide-check'
    },

    // FAQ
    faq: {
      section: 'section',
      buttons: 'button[aria-expanded]',
      answers: '[data-state="open"]'
    },

    // Start Saving 90% Block (refactor addition - should match site styling)
    savingBlock: {
      section: 'section',
      title: 'h2',
      subtitle: 'p',
      ctaButton: 'button.btn-primary'
    },

    // Footer
    footer: {
      links: 'footer a'
    },

    // Cookie Consent
    cookieConsent: {
      banner: '#cookie-banner',
      title: '#cookie-banner h2',
      description: '#cookie-banner p',
      settingsButton: '#cookie-settings',
      rejectButton: '#cookie-reject',
      acceptButton: '#cookie-accept'
    }
  };

  // Exact expected values from original site
  expectedValues = {
    // Background colors
    backgrounds: {
      body: 'rgb(40, 40, 40)',
      main: 'rgba(0, 0, 0, 0)', // transparent
      features: 'rgb(40, 40, 40)', // Same as body in original
      pricing: 'rgb(40, 40, 40)', // Same as body in original
      faq: 'rgb(40, 40, 40)', // Solid dark background
      testimonials: 'rgb(40, 40, 40)' // Same as body
    },
    // Button styles (from extraction) - NOTE: NO VERTICAL PADDING!
    button: {
      backgroundColor: 'rgb(255, 220, 97)',
      color: 'rgb(41, 48, 69)',
      borderRadius: '6px',
      padding: '0px 24px', // CRITICAL: Original has NO vertical padding
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '24px',
      paddingRight: '24px',
      fontSize: '14px',
      fontWeight: '500',
      height: '32px',
      lineHeight: '20px',
      border: '1px solid rgba(255, 255, 255, 0.02)'
    },

    // Larger buttons (hero CTA) - Also NO vertical padding!
    buttonLarge: {
      backgroundColor: 'rgb(255, 220, 97)',
      color: 'rgb(41, 48, 69)',
      borderRadius: '8px',
      padding: '0px 24px', // CRITICAL: Original has NO vertical padding
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '24px',
      paddingRight: '24px',
      fontSize: '16px',
      fontWeight: '500',
      height: '40px',
      lineHeight: '24px'
    },

    // Checkmark colors
    checkmark: {
      color: 'oklch(0.696 0.17 162.48)', // Exact emerald-500
      fill: 'none',
      stroke: 'oklch(0.696 0.17 162.48)',
      className: 'text-emerald-500'
    },

    // Typography
    typography: {
      h1: {
        fontSize: '60px',
        fontFamily: 'Geist, "Geist Fallback"',
        fontWeight: '600',
        lineHeight: '60px',
        letterSpacing: '-1.5px'
      },
      h2: {
        fontSize: '48px',
        fontFamily: 'Geist, "Geist Fallback"',
        fontWeight: '600'
      },
      heroSubtitle: {
        fontSize: '24px',
        fontFamily: 'Geist, "Geist Fallback"',
        fontWeight: '500',
        lineHeight: '32px',
        color: 'rgba(255, 246, 238, 0.72)'
      }
    },

    // Pricing values
    pricing: {
      free: '$0',
      plus: '$21.75',
      pro: '$36.75'
    },

    // FAQ section
    faq: {
      backgroundColor: 'rgb(40, 40, 40)', // Solid dark background
      backgroundImage: 'none'
    },

    // Navigation
    navigation: {
      linkColor: 'rgb(255, 255, 255)',
      linkFontSize: '16px',
      linkFontWeight: '600'
    },

    // Feature cards (should have proper styling)
    featureCard: {
      borderRadius: '8px',
      backgroundColor: 'rgb(53, 53, 53)',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },

    // Card backgrounds (newly fixed)
    cards: {
      pricingCard: {
        backgroundColor: 'rgb(53, 53, 53)',
        borderRadius: '24px'
      },
      testimonialCard: {
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: '16px'
      }
    },

    // Cookie consent banner
    cookieConsent: {
      backgroundColor: 'rgb(53, 52, 52)',
      borderRadius: '8px',
      position: 'fixed',
      zIndex: '50',
      maxWidth: '360px',
      padding: '16px',
      acceptButtonBackground: 'rgb(255, 220, 97)',
      acceptButtonColor: 'rgb(41, 48, 69)'
    },

    // CTA block styling (matches original gradient block)
    ctaBlock: {
      sectionBackground: 'rgb(40, 40, 40)',
      innerBackground: 'linear-gradient(135deg, rgb(196, 164, 221), rgb(248, 174, 207), rgb(255, 220, 97))',
      textColor: 'rgb(0, 0, 0)', // Black text like original
      borderRadius: '24px', // sm:rounded-3xl
      hasShadow: true,
      hasRadialGradient: true
    }
  };

  // Validation methods
  async validateButtonStyles() {
    const errors = [];
    
    // Check all CTA buttons
    const buttons = await this.page.$$eval('button', btns => 
      btns.filter(btn => btn.textContent.includes('Get Started for Free'))
        .map(btn => {
          const styles = window.getComputedStyle(btn);
          const rect = btn.getBoundingClientRect();
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            borderRadius: styles.borderRadius,
            padding: styles.padding,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            height: styles.height,
            computedHeight: rect.height,
            lineHeight: styles.lineHeight,
            display: styles.display,
            hasLgClass: btn.classList.contains('btn-lg'),
            isVisible: styles.display !== 'none'
          };
        })
    );
    
    for (let i = 0; i < buttons.length; i++) {
      const styles = buttons[i];
      
      // Skip hidden buttons
      if (!styles.isVisible) {
        continue;
      }

      // Determine expected values based on button size or class
      const isLarge = styles.hasLgClass || styles.height === '40px' || styles.fontSize === '16px';
      const expected = isLarge ? this.expectedValues.buttonLarge : this.expectedValues.button;
      
      if (styles.backgroundColor !== expected.backgroundColor) {
        errors.push(`Button ${i} background: ${styles.backgroundColor} (expected: ${expected.backgroundColor})`);
      }
      if (styles.color !== expected.color) {
        errors.push(`Button ${i} color: ${styles.color} (expected: ${expected.color})`);
      }
      if (styles.padding !== expected.padding) {
        errors.push(`Button ${i} padding: ${styles.padding} (expected: ${expected.padding})`);
      }
      if (styles.borderRadius !== expected.borderRadius) {
        errors.push(`Button ${i} border-radius: ${styles.borderRadius} (expected: ${expected.borderRadius})`);
      }
      
      // Check height
      if (styles.height !== expected.height) {
        errors.push(`Button ${i} height: ${styles.height} (expected: ${expected.height})`);
      }
      // Also check computed height to ensure it's actually rendering at the right size
      // But only for visible buttons (computed height will be 0 for hidden buttons)
      if (styles.computedHeight > 0) {
        const expectedComputedHeight = parseFloat(expected.height);
        const actualComputedHeight = styles.computedHeight;
        if (Math.abs(actualComputedHeight - expectedComputedHeight) > 1) {
          errors.push(`Button ${i} computed height: ${actualComputedHeight}px (expected: ${expectedComputedHeight}px)`);
        }
      }
    }

    return errors;
  }

  async validateCheckmarkColors() {
    const errors = [];
    
    const checkmarks = await this.page.$$('#pricing svg');
    
    for (let i = 0; i < checkmarks.length; i++) {
      const styles = await checkmarks[i].evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          fill: computed.fill,
          stroke: computed.stroke
        };
      });

      if (styles.color !== this.expectedValues.checkmark.color && 
          !styles.color.includes('rgb(16, 185, 129)')) { // Also accept RGB equivalent
        errors.push(`Checkmark ${i} color: ${styles.color} (expected: emerald-500)`);
      }
    }

    return errors;
  }

  async validateTypography() {
    const errors = [];
    
    // H1
    const h1 = await this.page.$('h1');
    if (h1) {
      const styles = await h1.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          fontSize: computed.fontSize,
          fontFamily: computed.fontFamily,
          fontWeight: computed.fontWeight,
          lineHeight: computed.lineHeight
        };
      });

      if (styles.fontSize !== this.expectedValues.typography.h1.fontSize) {
        errors.push(`H1 font-size: ${styles.fontSize} (expected: ${this.expectedValues.typography.h1.fontSize})`);
      }
      if (!styles.fontFamily.includes('Geist')) {
        errors.push(`H1 font-family: ${styles.fontFamily} (expected: Geist)`);
      }
    }

    // Hero subtitle
    const subtitle = await this.page.$('h1 + p');
    if (subtitle) {
      const styles = await subtitle.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          fontSize: computed.fontSize,
          color: computed.color
        };
      });

      if (styles.fontSize !== this.expectedValues.typography.heroSubtitle.fontSize) {
        errors.push(`Subtitle font-size: ${styles.fontSize} (expected: ${this.expectedValues.typography.heroSubtitle.fontSize})`);
      }
      if (styles.color !== this.expectedValues.typography.heroSubtitle.color) {
        errors.push(`Subtitle color: ${styles.color} (expected: ${this.expectedValues.typography.heroSubtitle.color})`);
      }
    }

    return errors;
  }

  async validatePricingValues() {
    const errors = [];
    
    const prices = await this.page.$$eval('#pricing .text-5xl', elements =>
      elements.map(el => el.textContent.trim())
    );

    const expectedPrices = ['$16.67', '$54.17']; // Yearly prices shown by default
    prices.forEach((price, i) => {
      if (price !== expectedPrices[i]) {
        errors.push(`Price ${i}: ${price} (expected: ${expectedPrices[i]})`);
      }
    });

    return errors;
  }

  async validateFAQImplementation() {
    const errors = [];
    
    // Check for aria-expanded buttons
    const faqButtons = await this.page.$$('button[aria-expanded]');
    if (faqButtons.length === 0) {
      errors.push('FAQ buttons must use aria-expanded attribute');
    }

    // Check FAQ section background
    const faqSection = await this.page.evaluateHandle(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      return sections.find(s => s.textContent.includes('Frequently asked questions'));
    });
    if (faqSection && await faqSection.evaluate(el => el !== null)) {
      const styles = await faqSection.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          backgroundImage: computed.backgroundImage
        };
      });

      if (styles.backgroundImage !== 'none') {
        errors.push(`FAQ section has gradient background (expected: solid ${this.expectedValues.faq.backgroundColor})`);
      }
    }

    return errors;
  }

  async validateFeatureCards() {
    const errors = [];
    
    // Find the features section grid specifically
    const featureCards = await this.page.$$eval('.grid', grids => {
      // Find the grid that contains feature cards (has h3 elements with feature titles)
      const featureGrid = grids.find(grid => {
        const firstChild = grid.querySelector('div');
        return firstChild && firstChild.querySelector('h3')?.textContent?.includes('Auto-drafts');
      });
      
      if (!featureGrid) return [];
      
      return Array.from(featureGrid.children).slice(0, 3).map(card => {
        const styles = window.getComputedStyle(card);
        return {
          borderRadius: styles.borderRadius,
          backgroundColor: styles.backgroundColor,
          hasProperStyling: styles.borderRadius !== '0px'
        };
      });
    });
    
    featureCards.forEach((card, i) => {
      if (!card.hasProperStyling) {
        errors.push(`Feature card ${i} missing border-radius`);
      }
    });

    return errors;
  }

  async validateBackgrounds() {
    const errors = [];
    
    // Check body background
    const bodyBg = await this.page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    if (bodyBg !== this.expectedValues.backgrounds.body) {
      errors.push(`Body background: ${bodyBg} (expected: ${this.expectedValues.backgrounds.body})`);
    }
    
    // Check section backgrounds
    const sections = await this.page.$$eval('section', sections => {
      return sections.map(section => {
        const styles = window.getComputedStyle(section);
        const heading = section.querySelector('h2')?.textContent?.trim();
        return {
          heading,
          backgroundColor: styles.backgroundColor,
          hasFeatures: section.textContent.includes('Auto-drafts'),
          hasPricing: !!section.querySelector('#pricing') || section.id === 'pricing',
          hasFAQ: section.textContent.includes('Frequently asked questions'),
          hasTestimonials: section.textContent.includes('Less Email, More Productivity')
        };
      });
    });
    
    sections.forEach(section => {
      if (section.hasFeatures && section.backgroundColor !== this.expectedValues.backgrounds.features) {
        errors.push(`Features section background: ${section.backgroundColor} (expected: ${this.expectedValues.backgrounds.features})`);
      }
      if (section.hasPricing && section.backgroundColor !== this.expectedValues.backgrounds.pricing) {
        errors.push(`Pricing section background: ${section.backgroundColor} (expected: ${this.expectedValues.backgrounds.pricing})`);
      }
      if (section.hasFAQ && section.backgroundColor !== this.expectedValues.backgrounds.faq) {
        errors.push(`FAQ section background: ${section.backgroundColor} (expected: ${this.expectedValues.backgrounds.faq})`);
      }
      if (section.hasTestimonials && section.backgroundColor !== this.expectedValues.backgrounds.testimonials) {
        errors.push(`Testimonials section background: ${section.backgroundColor} (expected: ${this.expectedValues.backgrounds.testimonials})`);
      }
    });
    
    return errors;
  }

  async validateButtonPadding() {
    const errors = [];
    
    const buttons = await this.page.$$eval('button', btns => 
      btns.filter(btn => btn.textContent.includes('Get Started for Free'))
        .map(btn => {
          const styles = window.getComputedStyle(btn);
          return {
            text: btn.textContent.trim(),
            padding: styles.padding,
            paddingTop: styles.paddingTop,
            paddingBottom: styles.paddingBottom,
            paddingLeft: styles.paddingLeft,
            paddingRight: styles.paddingRight,
            height: styles.height,
            hasLgClass: btn.classList.contains('btn-lg')
          };
        })
    );
    
    buttons.forEach((button, i) => {
      // Check padding
      if (button.paddingTop !== '0px') {
        errors.push(`Button ${i} padding-top: ${button.paddingTop} (expected: 0px)`);
      }
      if (button.paddingBottom !== '0px') {
        errors.push(`Button ${i} padding-bottom: ${button.paddingBottom} (expected: 0px)`);
      }
      if (button.paddingLeft !== '24px') {
        errors.push(`Button ${i} padding-left: ${button.paddingLeft} (expected: 24px)`);
      }
      if (button.paddingRight !== '24px') {
        errors.push(`Button ${i} padding-right: ${button.paddingRight} (expected: 24px)`);
      }
    });
    
    return errors;
  }

  async validateHeaderButtonPosition() {
    const errors = [];
    
    // Find the visible header button
    const buttonInfo = await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const ctaButton = buttons.find(btn => {
        const styles = window.getComputedStyle(btn);
        return btn.textContent.includes('Get Started') && styles.display !== 'none';
      });
      
      if (!ctaButton) return null;
      
      const rect = ctaButton.getBoundingClientRect();
      const headerRect = document.querySelector('header').getBoundingClientRect();
      const parentRect = ctaButton.parentElement.getBoundingClientRect();
      
      return {
        offsetFromHeaderTop: rect.top - headerRect.top,
        height: rect.height,
        parentOffsetFromHeader: parentRect.top - headerRect.top
      };
    });
    
    if (buttonInfo) {
      // Expected values from original site
      const expectedOffset = 24;
      const expectedHeight = 40;
      
      if (Math.abs(buttonInfo.offsetFromHeaderTop - expectedOffset) > 1) {
        errors.push(`Header button vertical offset: ${buttonInfo.offsetFromHeaderTop}px (expected: ${expectedOffset}px)`);
      }
      if (Math.abs(buttonInfo.height - expectedHeight) > 1) {
        errors.push(`Header button height: ${buttonInfo.height}px (expected: ${expectedHeight}px)`);
      }
    } else {
      errors.push('Header CTA button not found');
    }
    
    return errors;
  }

  async validateCardBackgrounds() {
    const errors = [];
    
    // Validate pricing cards
    const pricingCards = await this.page.$$eval('#pricing .card', cards => 
      cards.map(card => {
        const styles = window.getComputedStyle(card);
        const heading = card.querySelector('h3')?.textContent?.trim();
        return {
          heading,
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius
        };
      })
    );
    
    pricingCards.forEach((card, i) => {
      if (card.backgroundColor !== this.expectedValues.cards.pricingCard.backgroundColor) {
        errors.push(`Pricing card ${i} (${card.heading}) background: ${card.backgroundColor} (expected: ${this.expectedValues.cards.pricingCard.backgroundColor})`);
      }
    });
    
    // Validate testimonial cards
    const testimonialCards = await this.page.$$eval('.card-white', cards => 
      cards.map(card => {
        const styles = window.getComputedStyle(card);
        const person = card.querySelector('h4')?.textContent?.trim();
        return {
          person,
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius
        };
      })
    );
    
    testimonialCards.forEach((card, i) => {
      if (card.backgroundColor !== this.expectedValues.cards.testimonialCard.backgroundColor) {
        errors.push(`Testimonial card ${i} (${card.person}) background: ${card.backgroundColor} (expected: ${this.expectedValues.cards.testimonialCard.backgroundColor})`);
      }
    });
    
    return errors;
  }

  async validateCookieConsent() {
    const errors = [];
    
    // Check if cookie banner exists
    const bannerExists = await this.page.$(this.selectors.cookieConsent.banner);
    if (!bannerExists) {
      errors.push('Cookie banner not found');
      return errors;
    }
    
    // Validate banner styling
    const bannerStyles = await this.page.evaluate((selector) => {
      const banner = document.querySelector(selector);
      if (!banner) return null;
      
      const container = banner.querySelector('div[class*="max-w"]');
      if (!container) return null;
      
      const styles = window.getComputedStyle(container);
      return {
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        position: window.getComputedStyle(banner).position,
        zIndex: window.getComputedStyle(banner).zIndex,
        maxWidth: styles.maxWidth,
        padding: styles.padding
      };
    }, this.selectors.cookieConsent.banner);
    
    if (bannerStyles) {
      if (bannerStyles.backgroundColor !== this.expectedValues.cookieConsent.backgroundColor) {
        errors.push(`Cookie banner background: ${bannerStyles.backgroundColor} (expected: ${this.expectedValues.cookieConsent.backgroundColor})`);
      }
      if (bannerStyles.borderRadius !== this.expectedValues.cookieConsent.borderRadius) {
        errors.push(`Cookie banner border-radius: ${bannerStyles.borderRadius} (expected: ${this.expectedValues.cookieConsent.borderRadius})`);
      }
      if (bannerStyles.position !== this.expectedValues.cookieConsent.position) {
        errors.push(`Cookie banner position: ${bannerStyles.position} (expected: ${this.expectedValues.cookieConsent.position})`);
      }
    }
    
    // Validate accept button styling
    const acceptButton = await this.page.$(this.selectors.cookieConsent.acceptButton);
    if (acceptButton) {
      const buttonStyles = await acceptButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color
        };
      });
      
      if (buttonStyles.backgroundColor !== this.expectedValues.cookieConsent.acceptButtonBackground) {
        errors.push(`Cookie accept button background: ${buttonStyles.backgroundColor} (expected: ${this.expectedValues.cookieConsent.acceptButtonBackground})`);
      }
      if (buttonStyles.color !== this.expectedValues.cookieConsent.acceptButtonColor) {
        errors.push(`Cookie accept button color: ${buttonStyles.color} (expected: ${this.expectedValues.cookieConsent.acceptButtonColor})`);
      }
    } else {
      errors.push('Cookie accept button not found');
    }
    
    // Check for required elements
    const requiredElements = [
      { selector: this.selectors.cookieConsent.title, name: 'title' },
      { selector: this.selectors.cookieConsent.description, name: 'description' },
      { selector: this.selectors.cookieConsent.settingsButton, name: 'settings button' },
      { selector: this.selectors.cookieConsent.rejectButton, name: 'reject button' }
    ];
    
    for (const element of requiredElements) {
      const exists = await this.page.$(element.selector);
      if (!exists) {
        errors.push(`Cookie banner ${element.name} not found`);
      }
    }
    
    return errors;
  }

  async validatePricingCardUniformity() {
    const errors = [];
    
    // Get both pricing cards
    const pricingCards = await this.page.$$eval('#pricing .card', cards => 
      cards.map(card => {
        const styles = window.getComputedStyle(card);
        const heading = card.querySelector('h3')?.textContent?.trim();
        const button = card.querySelector('button');
        const buttonStyles = button ? window.getComputedStyle(button) : null;
        const hasBadge = !!card.querySelector('.absolute');
        
        return {
          heading,
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius,
          hasMostPopularBadge: hasBadge,
          buttonClass: button?.className || '',
          buttonBackground: buttonStyles?.backgroundColor || ''
        };
      })
    );
    
    if (pricingCards.length >= 2) {
      const [plusCard, proCard] = pricingCards;
      
      // Both cards should have same background
      if (plusCard.backgroundColor !== proCard.backgroundColor) {
        errors.push(`Pricing card backgrounds don't match: Plus(${plusCard.backgroundColor}) vs Pro(${proCard.backgroundColor})`);
      }
      
      // Both cards should have same border radius
      if (plusCard.borderRadius !== proCard.borderRadius) {
        errors.push(`Pricing card border radius don't match: Plus(${plusCard.borderRadius}) vs Pro(${proCard.borderRadius})`);
      }
      
      // Pro card should NOT have "Most Popular" badge
      if (proCard.hasMostPopularBadge) {
        errors.push('Pro card should not have "Most Popular" badge');
      }
      
      // Both cards should have same button styling (both secondary)
      if (!proCard.buttonClass.includes('btn-secondary')) {
        errors.push('Pro card should use btn-secondary button class like Plus card');
      }
      
      // Both buttons should have same background color
      if (plusCard.buttonBackground !== proCard.buttonBackground) {
        errors.push(`Pricing card button backgrounds don't match: Plus(${plusCard.buttonBackground}) vs Pro(${proCard.buttonBackground})`);
      }
    } else {
      errors.push('Expected 2 pricing cards but found ' + pricingCards.length);
    }
    
    return errors;
  }

  async validateCTABlock() {
    const errors = [];
    
    // Find CTA section with "Start saving 90%" text
    const ctaInfo = await this.page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      const ctaSection = sections.find(section => 
        section.textContent.includes('Start saving 90%') && 
        section.textContent.includes('of your email time')
      );
      
      if (!ctaSection) return null;
      
      // Find the inner gradient container
      const gradientContainer = ctaSection.querySelector('[style*="linear-gradient"]');
      if (!gradientContainer) return { found: false, noGradient: true };
      
      const sectionStyles = window.getComputedStyle(ctaSection);
      const containerStyles = window.getComputedStyle(gradientContainer);
      const h2 = gradientContainer.querySelector('h2');
      const textStyles = h2 ? window.getComputedStyle(h2) : null;
      const svg = gradientContainer.querySelector('svg');
      
      return {
        found: true,
        sectionBackground: sectionStyles.backgroundColor,
        innerBackground: containerStyles.backgroundImage,
        textColor: textStyles ? textStyles.color : null,
        borderRadius: containerStyles.borderRadius,
        boxShadow: containerStyles.boxShadow,
        hasRadialGradient: !!svg
      };
    });
    
    if (!ctaInfo) {
      errors.push('CTA section with "Start saving 90%" not found');
      return errors;
    }
    
    if (ctaInfo.noGradient) {
      errors.push('CTA gradient container not found');
      return errors;
    }
    
    // Validate section background
    if (ctaInfo.sectionBackground !== this.expectedValues.ctaBlock.sectionBackground) {
      errors.push(`CTA section background: ${ctaInfo.sectionBackground} (expected: ${this.expectedValues.ctaBlock.sectionBackground})`);
    }
    
    // Validate text color (should be black)
    if (ctaInfo.textColor !== this.expectedValues.ctaBlock.textColor) {
      errors.push(`CTA text color: ${ctaInfo.textColor} (expected: ${this.expectedValues.ctaBlock.textColor})`);
    }
    
    // Validate border radius
    if (ctaInfo.borderRadius !== this.expectedValues.ctaBlock.borderRadius) {
      errors.push(`CTA border radius: ${ctaInfo.borderRadius} (expected: ${this.expectedValues.ctaBlock.borderRadius})`);
    }
    
    // Validate shadow
    if (!ctaInfo.boxShadow || ctaInfo.boxShadow === 'none') {
      errors.push('CTA block should have shadow');
    }
    
    // Validate radial gradient SVG
    if (!ctaInfo.hasRadialGradient) {
      errors.push('CTA block should have radial gradient SVG background');
    }
    
    return errors;
  }

  async runAllValidations() {
    console.log('🔍 Running strict design parity validations...\n');
    
    const results = {
      backgrounds: await this.validateBackgrounds(),
      buttonPadding: await this.validateButtonPadding(),
      buttonStyles: await this.validateButtonStyles(),
      headerButtonPosition: await this.validateHeaderButtonPosition(),
      checkmarkColors: await this.validateCheckmarkColors(),
      typography: await this.validateTypography(),
      pricingValues: await this.validatePricingValues(),
      faqImplementation: await this.validateFAQImplementation(),
      featureCards: await this.validateFeatureCards(),
      cardBackgrounds: await this.validateCardBackgrounds(),
      cookieConsent: await this.validateCookieConsent(),
      pricingCardUniformity: await this.validatePricingCardUniformity(),
      ctaBlock: await this.validateCTABlock()
    };

    // Summary
    const totalErrors = Object.values(results).flat().length;
    
    console.log('\n📊 Validation Summary:');
    Object.entries(results).forEach(([test, errors]) => {
      console.log(`${errors.length === 0 ? '✅' : '❌'} ${test}: ${errors.length} issues`);
      if (errors.length > 0) {
        errors.forEach(err => console.log(`   - ${err}`));
      }
    });

    console.log(`\n${totalErrors === 0 ? '✅' : '❌'} Total issues: ${totalErrors}`);
    
    return totalErrors === 0;
  }
}