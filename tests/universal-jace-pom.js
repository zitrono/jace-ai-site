// Universal Page Object Model for jace.ai
// Works with both original site and Astro refactor
// Single source of truth with site-specific adaptations

export class UniversalJaceAISitePOM {
  constructor(page, siteType = 'original') {
    this.page = page;
    this.siteType = siteType;
    this.isRefactor = siteType === 'refactor';
  }

  // URL configuration
  getUrl() {
    return this.isRefactor ? 'http://localhost:4321' : 'https://jace.ai';
  }

  // Site-specific selectors
  get selectors() {
    const base = {
      // Background and layout
      body: 'body',
      main: 'main',
      
      // Hero section - adaptable selectors
      heroTitle: this.isRefactor ? 'h1.heading-hero, h1.gradient-hero-title' : 'h1',
      heroSubtitle: this.isRefactor ? 'h1 + p, p[style*="color: rgba(255, 246, 238"]' : 'h1 + p, .text-lg',
      heroCTAButton: this.isRefactor ? 
        'button.btn-primary, [data-test="cta-button"]' : 
        'button[class*="bg-surface-highlight"]',
      
      // Navigation
      logo: 'a[href="/"], a[href="#"]',
      navLinks: 'nav a',
      loginButton: this.isRefactor ? 
        'a.btn-secondary, a[href*="signin"]' : 
        'a[href*="signin"]',
      
      // Trust indicators
      casaBadge: this.isRefactor ? 
        '.badge-certification, [data-test="casa-badge"]' : 
        '.bg-\\[\\#353535\\]',
      userCount: this.isRefactor ?
        '[data-test="user-count"]' :
        '.text-text-muted.text-sm.font-medium:has-text("Join 1000+")',
      
      // Video section
      videoContainer: this.isRefactor ?
        '.bg-gradient-to-br, [data-test="video-container"]' :
        '.aspect-video, [class*="video"]',
      videoTitle: this.isRefactor ?
        'h2:has-text("See Jace"), h3:has-text("Way")' :
        'h3:has-text("Way")',
      
      // Company section
      companySection: this.isRefactor ?
        '[data-test="companies"]' :
        '.text-text-muted.text-sm.font-medium',
      companyLogos: this.isRefactor ?
        '[data-test="company-logo"]' :
        'img[alt*="company"], img[alt*="logo"]',
      
      // Features
      featuresTitle: this.isRefactor ?
        'section h2.heading-2' :
        'h2.text-base\\/7.font-semibold.text-highlight-yellow',
      featureCards: this.isRefactor ?
        'section .card' :
        '[class*="grid"] > div',
      
      // Pricing
      pricingTitle: this.isRefactor ?
        'section#pricing h2' :
        'h2.text-center.text-base\\/7.font-semibold.text-highlight-yellow',
      pricingCards: this.isRefactor ?
        'section#pricing .card' :
        'h2.text-2xl.font-semibold.text-white',
      
      // Secondary buttons
      secondaryButton: this.isRefactor ?
        '.btn-secondary, [data-test="secondary-button"]' :
        'button[class*="bg-gray"]',
      
      // Pricing checkmarks  
      pricingCheckmarks: this.isRefactor ?
        '[data-test="checkmark"], svg[class*="check"], .text-green-400' :
        '.lucide-check',
      
      // FAQ buttons
      faqButtons: this.isRefactor ?
        '[data-test="faq-button"], button[aria-expanded]' :
        'button[aria-expanded], .faq button',
      
      // Section backgrounds
      sectionBackgrounds: this.isRefactor ?
        'section[data-test="dark-section"], .bg-page-bg' :
        '.bg-page-bg, section'
    };

    return base;
  }

  // Expected styles (exact baseline from original jace.ai)
  expectedStyles = {
    backgrounds: {
      body: 'rgb(40, 40, 40)',
      sections: {
        // Section with dark background
        darkSection: 'rgb(40, 40, 40)'
      }
    },
    
    typography: {
      heroTitle: {
        fontSize: '60px',
        fontWeight: '600',
        fontFamily: /Geist/,
        color: 'rgba(0, 0, 0, 0)',
        backgroundImage: 'linear-gradient(353deg, rgb(153, 153, 153) 36%, rgb(255, 255, 255) 90%)'
      },
      heroSubtitle: {
        fontSize: '24px',
        color: 'rgba(255, 246, 238, 0.72)'
      }
    },
    
    components: {
      ctaButton: {
        backgroundColor: 'rgb(255, 220, 97)',
        color: 'rgb(41, 48, 69)',
        borderRadius: '6px',
        padding: '0px 24px',
        fontSize: '14px'
      },
      // Viewport-specific header button padding
      headerButtonMobile: {
        backgroundColor: 'rgb(255, 220, 97)',
        color: 'rgb(41, 48, 69)',
        padding: '0px 8px',
        fontSize: '14px',
        borderRadius: '6px'
      },
      headerButtonDesktop: {
        backgroundColor: 'rgb(255, 220, 97)',
        color: 'rgb(41, 48, 69)',
        padding: '0px 24px',
        fontSize: '16px',
        borderRadius: '8px'
      },
      secondaryButton: {
        backgroundColor: 'rgb(65, 65, 65)',
        color: 'rgb(255, 246, 238)',
        padding: '0px 24px'
      },
      casaBadge: {
        // Will update based on actual extraction
        backgroundColor: /.*/,  // Accept any for now
        color: /.*/,
        border: /.*/
      },
      // Checkmark colors in pricing features
      checkmark: {
        color: 'oklch(0.696 0.17 162.48)',
        fill: 'none',
        stroke: 'currentColor',
        width: '24px',
        height: '20px'
      }
    },
    
    // FAQ interactivity
    interactivity: {
      faqButton: {
        cursor: 'pointer',
        ariaExpanded: 'false',
        pointerEvents: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: 'rgb(255, 255, 255)',
        border: '0px solid rgb(255, 255, 255)'
      }
    }
  };

  // Expected content (same for both sites)
  expectedContent = {
    heroTitle: 'Gain 2 Hours Daily with Jace',
    ctaButtonText: 'Get Started for Free',
    navItems: ['Features', 'Company', 'Blog'],
    userCountPattern: /Join 1000\+/
  };

  // Navigation
  async navigate() {
    const url = this.getUrl();
    console.log(`🌐 Navigating to ${this.siteType} site: ${url}`);
    await this.page.goto(url, { waitUntil: 'networkidle0' });
  }

  // Helper methods
  async getElementText(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      return await this.page.$eval(selector, el => el.textContent?.trim());
    } catch {
      return null;
    }
  }

  async getElementStyles(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      return await this.page.evaluate((sel) => {
        const element = document.querySelector(sel);
        if (!element) return null;
        const styles = window.getComputedStyle(element);
        return {
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          fontFamily: styles.fontFamily,
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          backgroundImage: styles.backgroundImage,
          borderRadius: styles.borderRadius,
          border: styles.border,
          padding: styles.padding,
          aspectRatio: styles.aspectRatio,
          opacity: styles.opacity
        };
      }, selector);
    } catch {
      return null;
    }
  }

  async elementExists(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  // Validation methods
  async validateHeroSection() {
    const errors = [];
    
    console.log(`🦸 Validating hero section for ${this.siteType}...`);
    
    // Hero title
    const titleText = await this.getElementText(this.selectors.heroTitle);
    if (!titleText?.includes('Jace')) {
      errors.push(`Hero title should contain "Jace", found: "${titleText}"`);
    }
    
    // Hero title styles
    const titleStyles = await this.getElementStyles(this.selectors.heroTitle);
    if (titleStyles) {
      if (titleStyles.fontSize !== this.expectedStyles.typography.heroTitle.fontSize) {
        errors.push(`Hero title fontSize mismatch: ${titleStyles.fontSize} (expected: ${this.expectedStyles.typography.heroTitle.fontSize})`);
      }
      if (titleStyles.fontWeight !== this.expectedStyles.typography.heroTitle.fontWeight) {
        errors.push(`Hero title fontWeight mismatch: ${titleStyles.fontWeight} (expected: ${this.expectedStyles.typography.heroTitle.fontWeight})`);
      }
      if (titleStyles.color !== this.expectedStyles.typography.heroTitle.color) {
        errors.push(`Hero title color mismatch: ${titleStyles.color} (expected: ${this.expectedStyles.typography.heroTitle.color})`);
      }
      if (titleStyles.backgroundImage !== this.expectedStyles.typography.heroTitle.backgroundImage) {
        errors.push(`Hero title backgroundImage mismatch: ${titleStyles.backgroundImage}`);
      }
    }

    // Hero subtitle
    const subtitleStyles = await this.getElementStyles(this.selectors.heroSubtitle);
    if (subtitleStyles) {
      if (subtitleStyles.color !== this.expectedStyles.typography.heroSubtitle.color) {
        errors.push(`Hero subtitle color mismatch: ${subtitleStyles.color} (expected: ${this.expectedStyles.typography.heroSubtitle.color})`);
      }
      if (subtitleStyles.fontSize !== this.expectedStyles.typography.heroSubtitle.fontSize) {
        errors.push(`Hero subtitle fontSize mismatch: ${subtitleStyles.fontSize} (expected: ${this.expectedStyles.typography.heroSubtitle.fontSize})`);
      }
    }

    // CTA button
    const ctaExists = await this.elementExists(this.selectors.heroCTAButton);
    if (!ctaExists) {
      errors.push('Hero CTA button not found');
    } else {
      const ctaStyles = await this.getElementStyles(this.selectors.heroCTAButton);
      if (ctaStyles) {
        if (ctaStyles.backgroundColor !== this.expectedStyles.components.ctaButton.backgroundColor) {
          errors.push(`CTA button backgroundColor mismatch: ${ctaStyles.backgroundColor} (expected: ${this.expectedStyles.components.ctaButton.backgroundColor})`);
        }
        if (ctaStyles.color !== this.expectedStyles.components.ctaButton.color) {
          errors.push(`CTA button color mismatch: ${ctaStyles.color} (expected: ${this.expectedStyles.components.ctaButton.color})`);
        }
        if (ctaStyles.borderRadius !== this.expectedStyles.components.ctaButton.borderRadius) {
          errors.push(`CTA button borderRadius mismatch: ${ctaStyles.borderRadius} (expected: ${this.expectedStyles.components.ctaButton.borderRadius})`);
        }
        if (ctaStyles.padding !== this.expectedStyles.components.ctaButton.padding) {
          errors.push(`CTA button padding mismatch: ${ctaStyles.padding} (expected: ${this.expectedStyles.components.ctaButton.padding})`);
        }
        if (ctaStyles.fontSize !== this.expectedStyles.components.ctaButton.fontSize) {
          errors.push(`CTA button fontSize mismatch: ${ctaStyles.fontSize} (expected: ${this.expectedStyles.components.ctaButton.fontSize})`);
        }
      }
    }

    return errors;
  }

  async validateNavigation() {
    const errors = [];
    
    console.log(`🧭 Validating navigation for ${this.siteType}...`);
    
    // Logo
    const logoExists = await this.elementExists(this.selectors.logo);
    if (!logoExists) {
      errors.push('Logo not found');
    }

    // Login button
    const loginExists = await this.elementExists(this.selectors.loginButton);
    if (!loginExists) {
      errors.push('Login button not found');
    }

    // Secondary button styles
    const secondaryStyles = await this.getElementStyles(this.selectors.secondaryButton);
    if (secondaryStyles) {
      if (secondaryStyles.backgroundColor !== this.expectedStyles.components.secondaryButton.backgroundColor) {
        errors.push(`Secondary button backgroundColor mismatch: ${secondaryStyles.backgroundColor} (expected: ${this.expectedStyles.components.secondaryButton.backgroundColor})`);
      }
      if (secondaryStyles.color !== this.expectedStyles.components.secondaryButton.color) {
        errors.push(`Secondary button color mismatch: ${secondaryStyles.color} (expected: ${this.expectedStyles.components.secondaryButton.color})`);
      }
      if (secondaryStyles.padding !== this.expectedStyles.components.secondaryButton.padding) {
        errors.push(`Secondary button padding mismatch: ${secondaryStyles.padding} (expected: ${this.expectedStyles.components.secondaryButton.padding})`);
      }
    }

    return errors;
  }

  async validateTrustIndicators() {
    const errors = [];
    
    console.log(`🛡️ Validating trust indicators for ${this.siteType}...`);
    
    // For original site, be more lenient since we don't know exact structure
    if (!this.isRefactor) {
      // Just check if user count text exists somewhere on page
      const userCountText = await this.page.evaluate(() => {
        return document.body.textContent?.includes('1000+') || false;
      });
      
      if (!userCountText) {
        errors.push('User count text not found anywhere on page');
      }
      
      // Check for CASA-related text
      const casaText = await this.page.evaluate(() => {
        return document.body.textContent?.includes('CASA') || false;
      });
      
      if (!casaText) {
        errors.push('CASA text not found anywhere on page');
      }
      
    } else {
      // For refactor, use exact selectors
      // CASA badge
      const casaExists = await this.elementExists(this.selectors.casaBadge);
      if (!casaExists) {
        errors.push('CASA badge not found');
      }

      // User count
      const userCountExists = await this.elementExists(this.selectors.userCount);
      if (!userCountExists) {
        errors.push('User count not found');
      }
    }

    return errors;
  }

  async validateSections() {
    const errors = [];
    
    console.log(`📱 Validating sections for ${this.siteType}...`);
    
    // Video section
    const videoExists = await this.elementExists(this.selectors.videoContainer);
    if (!videoExists) {
      errors.push('Video container not found');
    }

    // Company section
    const companyExists = await this.elementExists(this.selectors.companySection);
    if (!companyExists) {
      errors.push('Company section not found');
    }

    // Company logos opacity
    if (this.isRefactor) {
      const logoStyles = await this.getElementStyles(this.selectors.companyLogos);
      if (logoStyles && logoStyles.opacity !== '0.8') {
        errors.push(`Company logos opacity mismatch: ${logoStyles.opacity} (expected: 0.8)`);
      }
    }

    // Features
    const featuresExists = await this.elementExists(this.selectors.featuresTitle);
    if (!featuresExists) {
      errors.push('Features section not found');
    }

    // Pricing
    const pricingExists = await this.elementExists(this.selectors.pricingTitle);
    if (!pricingExists) {
      errors.push('Pricing section not found');
    }

    return errors;
  }

  async validateViewportSpecificStyles() {
    const errors = [];
    
    console.log(`📱 Validating viewport-specific styles for ${this.siteType}...`);
    
    // Get current viewport size
    const viewport = await this.page.viewport();
    const isMobile = viewport.width < 768;
    
    // Header button padding validation
    const headerButtonExists = await this.elementExists(this.selectors.heroCTAButton);
    if (headerButtonExists) {
      const buttonStyles = await this.getElementStyles(this.selectors.heroCTAButton);
      if (buttonStyles) {
        const expectedPadding = isMobile ? 
          this.expectedStyles.components.headerButtonMobile.padding :
          this.expectedStyles.components.headerButtonDesktop.padding;
        
        if (buttonStyles.padding !== expectedPadding) {
          errors.push(`Header button padding mismatch at ${viewport.width}px: ${buttonStyles.padding} (expected: ${expectedPadding})`);
        }
      }
    }
    
    return errors;
  }

  async validateCheckmarkColors() {
    const errors = [];
    
    console.log(`✅ Validating checkmark colors for ${this.siteType}...`);
    
    const checkmarkExists = await this.elementExists(this.selectors.pricingCheckmarks);
    if (checkmarkExists) {
      const checkmarkStyles = await this.getElementStyles(this.selectors.pricingCheckmarks);
      if (checkmarkStyles) {
        if (checkmarkStyles.color !== this.expectedStyles.components.checkmark.color) {
          errors.push(`Checkmark color mismatch: ${checkmarkStyles.color} (expected: ${this.expectedStyles.components.checkmark.color})`);
        }
      }
    } else {
      errors.push('Pricing checkmarks not found');
    }
    
    return errors;
  }

  async validateFAQInteractivity() {
    const errors = [];
    
    console.log(`❓ Validating FAQ interactivity for ${this.siteType}...`);
    
    try {
      // Check if FAQ buttons exist and get their properties
      const faqData = await this.page.evaluate((selector) => {
        const buttons = Array.from(document.querySelectorAll(selector));
        
        if (buttons.length === 0) {
          return { found: false, buttons: [] };
        }
        
        return {
          found: true,
          buttons: buttons.slice(0, 3).map(btn => {
            const styles = window.getComputedStyle(btn);
            return {
              ariaExpanded: btn.getAttribute('aria-expanded'),
              cursor: styles.cursor,
              pointerEvents: styles.pointerEvents,
              backgroundColor: styles.backgroundColor,
              color: styles.color,
              border: styles.border
            };
          })
        };
      }, this.selectors.faqButtons);
      
      if (!faqData.found) {
        errors.push('No FAQ buttons found');
        return errors;
      }
      
      // Test first FAQ button properties
      const firstButton = faqData.buttons[0];
      
      // Verify expected properties
      const expected = this.expectedStyles.interactivity.faqButton;
      
      if (firstButton.ariaExpanded !== expected.ariaExpanded) {
        errors.push(`FAQ button aria-expanded mismatch: ${firstButton.ariaExpanded} (expected: ${expected.ariaExpanded})`);
      }
      
      if (firstButton.cursor !== expected.cursor) {
        errors.push(`FAQ button cursor mismatch: ${firstButton.cursor} (expected: ${expected.cursor})`);
      }
      
      if (firstButton.pointerEvents !== expected.pointerEvents) {
        errors.push(`FAQ button pointerEvents mismatch: ${firstButton.pointerEvents} (expected: ${expected.pointerEvents})`);
      }
      
      if (firstButton.backgroundColor !== expected.backgroundColor) {
        errors.push(`FAQ button backgroundColor mismatch: ${firstButton.backgroundColor} (expected: ${expected.backgroundColor})`);
      }
      
      if (firstButton.color !== expected.color) {
        errors.push(`FAQ button color mismatch: ${firstButton.color} (expected: ${expected.color})`);
      }
      
      if (firstButton.border !== expected.border) {
        errors.push(`FAQ button border mismatch: ${firstButton.border} (expected: ${expected.border})`);
      }
      
    } catch (error) {
      errors.push(`FAQ interactivity test failed: ${error.message}`);
    }
    
    return errors;
  }

  async validateSectionBackgrounds() {
    const errors = [];
    
    console.log(`🎨 Validating section backgrounds for ${this.siteType}...`);
    
    const sectionExists = await this.elementExists(this.selectors.sectionBackgrounds);
    if (sectionExists) {
      const sectionStyles = await this.getElementStyles(this.selectors.sectionBackgrounds);
      if (sectionStyles) {
        if (sectionStyles.backgroundColor !== this.expectedStyles.backgrounds.sections.darkSection) {
          errors.push(`Section background mismatch: ${sectionStyles.backgroundColor} (expected: ${this.expectedStyles.backgrounds.sections.darkSection})`);
        }
      }
    } else {
      errors.push('Section with special background not found');
    }
    
    return errors;
  }

  // Main validation method
  async validateAll() {
    const results = {
      hero: await this.validateHeroSection(),
      navigation: await this.validateNavigation(),
      trust: await this.validateTrustIndicators(),
      sections: await this.validateSections(),
      viewport: await this.validateViewportSpecificStyles(),
      checkmarks: await this.validateCheckmarkColors(),
      faq: await this.validateFAQInteractivity(),
      backgrounds: await this.validateSectionBackgrounds()
    };

    return results;
  }
}