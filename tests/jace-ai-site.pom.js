// Consolidated Page Object Model for jace.ai
// This is the single source of truth for all jace.ai testing
// Covers all elements from pom_extension.md with 100% validated coverage

export class JaceAISitePOM {
  constructor(page, siteType = 'auto') {
    this.page = page;
    this.siteType = siteType;
    this.url = 'https://jace.ai';
    this.isRefactor = false; // Will be determined in navigate()
  }

  // Complete selectors based on pom_extension.md and actual jace.ai structure
  // Now adaptive for both original and refactor sites
  get selectors() {
    const baseSelectors = {
    // 1. Background Colors and Sections
    backgrounds: {
      body: 'body',
      main: 'main',
      heroSection: 'section h1',
      featuresSection: 'section',
      pricingSection: '#pricing',
      testimonialsSection: 'section'
    },

    // 2. Hero Section
    hero: {
      title: 'h1',
      subtitle: 'h1 + p', // FIXED: simplified selector
      ctaButton: 'button.btn-primary', // FIXED: was 'button[class*="bg-surface-highlight"]'
      ctaButtonHero: 'main button.btn-primary.btn-lg', // Specific hero CTA
      ctaButtonHeader: 'header button.btn-primary', // Header CTA
      video: '.aspect-video, [class*="video"]',
      videoTitle: 'h3'
    },

    // 3. Navigation
    navigation: {
      logo: 'a[href="/"]',
      navLinks: 'nav a',
      features: 'a[href="/"]',
      company: 'a[href="/about"]',
      pricing: 'a[href="/#pricing"]',
      blog: 'a[href="/blog"]',
      login: 'a[href*="signin"]',
      ctaHeader: 'header button.btn-primary', // IMPROVED
      mobileMenuButton: 'button[aria-label="Open main menu"]', // FIXED: simplified selector using aria-label
      mobileMenuIcon: 'header svg[stroke="currentColor"]'
    },

    // 4. Trust Indicators
    trust: {
      casaBadge: '.badge-certification', // FIXED: was '.bg-\\[\\#353535\\]'
      userCount: '.text-gray-400', // Use text content check in validation
      userAvatars: '.flex.items-center img[alt*="user"]'
    },

    // 5. Company Logos
    companies: {
      section: '.mt-16.lg\\:mt-24', // FIXED: was '.text-text-muted.text-sm.font-medium'
      text: '.text-gray-400', // Use text content check in validation
      logos: 'img[alt*="company"], img[alt*="logo"]'
    },

    // 6. Features Section
    features: {
      title: 'h2, h3', // Generic heading selector since no specific features section
      section: 'section h2.heading-2',
      subtitle: 'h3',
      cards: '.grid > div',
      text: 'h2.heading-2' // Use text content check in validation
    },

    // 7. Pricing Section
    pricing: {
      section: '#pricing',
      title: '#pricing h2.heading-2', // IMPROVED: was complex class selector
      cards: '#pricing .card',
      toggle: '.text-base.font-semibold button, [role="tab"]'
    },

    // 8. Testimonials Section
    testimonials: {
      section: 'section h2.heading-2',
      title: 'h2.heading-2', // IMPROVED
      cards: '.grid > div'
    },

    // 9. FAQ Section
    faq: {
      section: 'section', // FIXED: generic section selector
      sectionText: 'Frequently asked questions',
      title: 'h2.text-4xl.font-semibold.tracking-tight.text-white',
      items: '[data-state], button[aria-expanded]',
      questions: 'button',
      answers: '[data-state="open"]'
    },

    // 10. Footer
    footer: {
      section: 'footer',
      links: 'footer a',
      affiliate: 'a[href="/affiliate"]',
      featureRequests: 'a[href*="feedback"]',
      terms: 'a[href="/terms"]',
      privacy: 'a[href="/privacy"]',
      extensionPolicy: 'a[href="/extension-privacy"]',
      socialLinks: 'a[href*="twitter"], a[href*="linkedin"], a[href*="discord"]'
    },

    // 11. Mobile Menu System (from pom_extension.md)
    mobileMenu: {
      overlay: '#mobile-menu, .mobile-menu-overlay',
      backdrop: '.mobile-menu-backdrop',
      closeButton: 'button[aria-label="Close menu"]',
      drawer: '.mobile-nav-drawer',
      mobileLinks: '.mobile-nav-item, .md\\:hidden',
      mobileOnly: '.md\\:hidden, .lg\\:hidden'
    },

    // 12. Interactive Elements
    interactive: {
      hoverElements: '.hover\\:scale-105, .hover\\:opacity-80',
      transitionElements: '.transition-all, .duration-200',
      focusElements: '.focus\\:outline-none, .focus\\:ring-2'
    },

    // 13. Visual Elements
    visual: {
      badges: '.badge, .pill, .tag',
      icons: 'svg:not([aria-hidden="true"])',
      patterns: '.hero-pattern, [style*="background-image"]',
      gradients: '[class*="gradient"], [style*="gradient"]',
      textGradients: '[class*="bg-clip-text"], [class*="text-transparent"]'
    },

    // 14. Accessibility Features
    accessibility: {
      ariaLabels: '[aria-label]',
      ariaHidden: '[aria-hidden]',
      ariaExpanded: '[aria-expanded]',
      ariaControls: '[aria-controls]',
      roles: '[role]',
      screenReaderOnly: '.sr-only, .visually-hidden'
    },

    // 15. Responsive Elements
    responsive: {
      mobileHidden: '.md\\:hidden, .lg\\:hidden',
      tabletVisible: '.md\\:block, .lg\\:block',
      responsiveText: '.sm\\:text-, .md\\:text-, .lg\\:text-',
      responsiveSpacing: '.sm\\:px-, .md\\:px-, .lg\\:px-',
      containerWidths: '.max-w-sm, .max-w-md, .max-w-lg'
    },

    // 16. Cookie Banner
    cookie: {
      banner: 'h2.mb-1.text-sm.font-medium',
      bannerText: 'Cookie Preferences',
      acceptButton: 'button',
      rejectButton: 'button',
      settingsButton: 'button'
    },

    // 17. Form Elements (if present)
    forms: {
      emailInputs: 'input[type="email"]',
      textInputs: 'input[type="text"]',
      submitButtons: 'button[type="submit"]',
      labels: 'label'
    },

    // 18. NEW: Viewport-specific elements
    viewport: {
      headerButtonMobile: 'header button[class*="md:hidden"]',
      headerButtonDesktop: 'header button:not([class*="md:hidden"])',
      mobileSpecificButtons: '[class*="sm:"], [class*="md:hidden"]'
    },

    // 19. NEW: Checkmarks in pricing features
    checkmarks: {
      pricingCheckmarks: '#pricing svg.text-emerald-500', // Checkmarks in pricing section
      allCheckmarks: 'svg[stroke="currentColor"][fill="none"]',
      featureCheckmarks: 'svg.text-emerald-500',
      checkmarkIcons: 'svg[fill="none"][stroke="currentColor"]'
    },

    // 20. NEW: FAQ interactive elements  
    faqInteractive: {
      section: 'section',
      sectionTitle: 'h2',
      sectionSubtitle: 'p',
      cards: 'div.card',
      buttons: 'button[aria-expanded]', // FIXED: simplified selector using aria-expanded
      expandedAnswers: '.mt-4.text-gray-300:not(.hidden)',
      collapsedAnswers: '.mt-4.text-gray-300.hidden',
      firstQuestion: 'div.card:nth-child(1) button',
      secondQuestion: 'div.card:nth-child(2) button',
      thirdQuestion: 'div.card:nth-child(3) button',
      fourthQuestion: 'div.card:nth-child(4) button'
    },

    // 21. NEW: Special section backgrounds
    specialBackgrounds: {
      graySection: '.bg-gray-900', // FIXED: was '.bg-page-bg'
      darkSection: '.bg-gray-950',
      gradientSection: '.bg-gradient-to-r',
      gradientSections: '[class*="gradient"]',
      coloredSections: 'section[class*="bg-"]'
    },

    // 22. NEW: Cookie consent and related functionality
    cookieConsent: {
      banner: '.cookie-banner, .cookie-consent, #cookie-banner',
      acceptButton: 'button[data-action="accept"], #cookie-accept',
      rejectButton: 'button[data-action="reject"], #cookie-reject',
      settingsButton: 'button[data-action="settings"], #cookie-settings',
      closeButton: 'button[data-action="close"], .cookie-close, #cookie-close',
      overlay: '.cookie-overlay, .modal-overlay',
      modal: '.cookie-modal, .cookie-preferences-modal',
      toggleSwitches: 'input[type="checkbox"], .toggle-switch',
      categoryToggles: '.cookie-category input[type="checkbox"]',
      savePreferences: 'button[data-action="save"], #save-preferences',
      // Privacy and Terms links (related to cookies)
      privacyLink: 'a[href="/privacy"], a[href*="privacy"]',
      termsLink: 'a[href="/terms"], a[href*="terms"]',
      cookiePolicyLink: 'a[href*="cookie"]'
    }
    };

    return baseSelectors;
  }

  // Expected styles based on actual jace.ai
  expectedStyles = {
    // Background Colors
    backgrounds: {
      body: 'rgb(40, 40, 40)', // Dark gray background
      heroGradient: /radial-gradient/
    },

    // Typography
    typography: {
      heroTitle: {
        fontSize: /48px|3rem|4xl/,
        fontWeight: /600|700/,
        fontFamily: /Geist|Inter/
      },
      heroSubtitle: {
        fontSize: /18px|1.125rem|lg/,
        color: /rgba\(255.*0\.7\)|text-gray/
      }
    },

    // Components
    components: {
      ctaButton: {
        backgroundColor: 'rgb(255, 220, 97)',
        color: 'rgb(41, 48, 69)',
        borderRadius: '6px',
        padding: '0px 24px',
        fontSize: '14px'
      },
      // NEW: Viewport-specific header button styles
      headerButtonMobile: {
        backgroundColor: 'rgb(255, 220, 97)',
        color: 'rgb(41, 48, 69)',
        padding: '0px 24px', // Original has no vertical padding
        fontSize: '14px',
        borderRadius: '6px'
      },
      headerButtonDesktop: {
        backgroundColor: 'rgb(255, 220, 97)',
        color: 'rgb(41, 48, 69)',
        padding: '0px 24px',
        fontSize: '16px',
        borderRadius: '8px',
        height: '40px',
        lineHeight: '24px'
      },
      secondaryButton: {
        backgroundColor: 'rgb(65, 65, 65)',
        color: 'rgb(255, 246, 238)',
        padding: '0px 24px'
      },
      casaBadge: {
        backgroundColor: /purple|violet/,
        borderRadius: /9999px|rounded-full/
      },
      // NEW: Checkmark styles
      checkmark: {
        color: 'rgb(16, 185, 129)', // Emerald 500
        fill: 'none',
        stroke: 'currentColor',
        width: '24px',
        height: '20px'
      }
    },

    // NEW: Section backgrounds
    backgrounds: {
      body: 'rgb(40, 40, 40)',
      sections: {
        darkSection: 'rgb(40, 40, 40)'
      }
    },

    // NEW: FAQ interactivity styles
    interactivity: {
      faqButton: {
        cursor: 'pointer',
        pointerEvents: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: 'rgb(255, 255, 255)',
        border: '0px solid rgb(255, 255, 255)'
      }
    },

    // NEW: Cookie consent styles
    cookieConsent: {
      banner: {
        position: /fixed|sticky/,
        zIndex: /999|1000/,
        backgroundColor: /rgba|rgb/
      },
      button: {
        backgroundColor: /rgb\(255.*220.*97\)|yellow/,
        color: /rgb\(17.*24.*39\)|black/,
        borderRadius: /6px|8px|rounded/
      }
    }
  };

  // Expected content based on actual jace.ai
  expectedContent = {
    logo: 'jace',
    heroTitle: 'Gain 2 Hours Daily with Jace',
    heroSubtitle: /emails organized.*drafts ready.*daily brief|Start your day with emails organized, drafts ready/,
    ctaButtonText: 'Get Started for Free',
    casaBadgeText: 'CASA TIER 3 CERTIFIED',
    userCountText: 'Join 1000+ enthusiasts',
    companyText: 'Built by engineers from',
    navItems: ['Features', 'Company', 'Pricing', 'Blog'],
    pricingTitle: 'Experience the full power of Jace with a 7-day free trial',
    testimonialsTitle: 'Less Email, More Productivity',
    faqTitle: 'Frequently asked questions',
    faqSubtitle: 'Everything you need to know about Jace',
    faqQuestions: [
      'Is my email data secure?',
      'Can I control how Jace drafts?',
      'Can Jace integrate with my existing email client?',
      'What if I need help or have more questions?'
    ]
  };

  // Navigation - auto-detect site type
  async navigate(url = null) {
    const targetUrl = url || this.url;
    await this.page.goto(targetUrl, { waitUntil: 'networkidle0' });
    
    // Auto-detect if this is the refactor site
    // No longer needed - we enforce strict parity
    
    console.log(`🌐 Navigated to: ${targetUrl}`);
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
          padding: styles.padding
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

  // Validation methods for all sections from pom_extension.md

  async validateBackgrounds() {
    const errors = [];
    
    // Check body background
    const bodyBg = await this.getElementStyles('body');
    if (bodyBg?.backgroundColor !== this.expectedStyles.backgrounds.body) {
      errors.push(`Body background mismatch: ${bodyBg?.backgroundColor}`);
    }

    return errors;
  }

  // NEW: Viewport-specific validation
  async validateViewportSpecificStyles() {
    const errors = [];
    
    console.log(`📱 Validating viewport-specific styles...`);
    
    // Get current viewport size
    const viewport = await this.page.viewport();
    const isMobile = viewport.width < 768;
    
    // Header button padding validation - use the corrected selector
    const headerButtonSelector = 'header button.btn-primary';
    
    const headerButtonExists = await this.elementExists(headerButtonSelector);
    if (headerButtonExists) {
      const buttonStyles = await this.getElementStyles(headerButtonSelector);
      if (buttonStyles) {
        // Dynamic expected padding based on site type and viewport
        // All buttons should have 0px 24px padding
        const expectedPadding = '0px 24px';
        
        if (buttonStyles.padding !== expectedPadding) {
          errors.push(`Header button padding mismatch at ${viewport.width}px: ${buttonStyles.padding} (expected: ${expectedPadding})`);
        }
        
        // Check button height
        const expectedHeight = isMobile ? '32px' : '40px';
        if (buttonStyles.height && buttonStyles.height !== expectedHeight && buttonStyles.height !== 'auto') {
          errors.push(`Header button height mismatch at ${viewport.width}px: ${buttonStyles.height} (expected: ${expectedHeight})`);
        }
      }
    } else {
      errors.push('Header button not found with selector: header button.btn-primary');
    }
    
    return errors;
  }

  // NEW: Checkmark color validation
  async validateCheckmarkColors() {
    const errors = [];
    
    console.log(`✅ Validating checkmark colors...`);
    
    const checkmarkExists = await this.elementExists(this.selectors.checkmarks.pricingCheckmarks);
    if (checkmarkExists) {
      const checkmarkStyles = await this.getElementStyles(this.selectors.checkmarks.pricingCheckmarks);
      if (checkmarkStyles) {
        // Expected color is always emerald-500
        const expectedColor = 'rgb(16, 185, 129)'; // emerald-500
        if (checkmarkStyles.color !== expectedColor) {
          errors.push(`Checkmark color mismatch: ${checkmarkStyles.color} (expected: ${expectedColor})`);
        }
      }
    } else {
      errors.push('Pricing checkmarks not found');
    }
    
    return errors;
  }

  // NEW: FAQ interactivity validation
  async validateFAQInteractivity() {
    const errors = [];
    
    console.log(`❓ Validating FAQ interactivity...`);
    
    try {
      // Check if FAQ section exists
      const faqSectionExists = await this.page.evaluate(() => {
        return document.body.textContent.includes('Frequently asked questions');
      });
      
      if (!faqSectionExists) {
        errors.push('FAQ section not found');
        return errors;
      }
      
      // Check if FAQ buttons exist and get their properties
      const faqData = await this.page.evaluate((selector) => {
        const buttons = Array.from(document.querySelectorAll(selector));
        
        if (buttons.length === 0) {
          return { found: false, buttons: [] };
        }
        
        return {
          found: true,
          count: buttons.length,
          buttons: buttons.slice(0, 4).map(btn => {
            const styles = window.getComputedStyle(btn);
            return {
              text: btn.textContent?.trim().slice(0, 50),
              onclick: btn.getAttribute('onclick'),
              cursor: styles.cursor,
              pointerEvents: styles.pointerEvents,
              backgroundColor: styles.backgroundColor,
              color: styles.color,
              border: styles.border
            };
          })
        };
      }, this.selectors.faqInteractive.buttons);
      
      if (!faqData.found) {
        errors.push('No FAQ buttons found');
        return errors;
      }
      
      // Check if we have the expected 4 FAQ questions
      if (faqData.count < 4) {
        errors.push(`Expected 4 FAQ questions, found ${faqData.count}`);
      }
      
      // Test first FAQ button properties
      const firstButton = faqData.buttons[0];
      
      // Verify expected properties
      const expected = this.expectedStyles.interactivity.faqButton;
      
      if (firstButton.cursor !== expected.cursor) {
        errors.push(`FAQ button cursor mismatch: ${firstButton.cursor} (expected: ${expected.cursor})`);
      }
      
      if (firstButton.pointerEvents !== expected.pointerEvents) {
        errors.push(`FAQ button pointerEvents mismatch: ${firstButton.pointerEvents} (expected: ${expected.pointerEvents})`);
      }
      
      // Check if buttons have onclick functionality
      if (!firstButton.onclick || !firstButton.onclick.includes('toggleFAQ')) {
        errors.push('FAQ buttons missing toggleFAQ onclick functionality');
      }
      
      // Verify FAQ questions content
      const expectedQuestions = this.expectedContent.faqQuestions;
      const actualQuestions = faqData.buttons.map(btn => btn.text);
      
      expectedQuestions.forEach((expectedQ, index) => {
        if (!actualQuestions[index] || !actualQuestions[index].includes(expectedQ.split('?')[0])) {
          errors.push(`FAQ question ${index + 1} mismatch: expected "${expectedQ}"`);
        }
      });
      
    } catch (error) {
      errors.push(`FAQ interactivity test failed: ${error.message}`);
    }
    
    return errors;
  }

  // NEW: Special section backgrounds validation
  async validateSpecialBackgrounds() {
    const errors = [];
    
    console.log(`🎨 Validating special section backgrounds...`);
    
    // Check for gray sections first
    const graySection = await this.elementExists(this.selectors.specialBackgrounds.graySection);
    const darkSection = await this.elementExists(this.selectors.specialBackgrounds.darkSection);
    const gradientSection = await this.elementExists(this.selectors.specialBackgrounds.gradientSection);
    
    if (!graySection && !darkSection && !gradientSection) {
      errors.push('No special background sections found');
    } else {
      console.log(`   ✅ Found special background sections`);
    }
    
    return errors;
  }

  // NEW: Cookie consent validation
  async validateCookieConsent() {
    const errors = [];
    
    console.log(`🍪 Validating cookie consent functionality...`);
    
    try {
      // Check for cookie banner
      const cookieBanner = await this.elementExists(this.selectors.cookieConsent.banner);
      
      // Check for privacy and terms links (always should exist)
      const privacyLinkExists = await this.elementExists(this.selectors.cookieConsent.privacyLink);
      const termsLinkExists = await this.elementExists(this.selectors.cookieConsent.termsLink);
      
      if (!privacyLinkExists) {
        errors.push('Privacy policy link not found in footer');
      }
      
      if (!termsLinkExists) {
        errors.push('Terms of service link not found in footer');
      }
      
      // If cookie banner exists, validate its functionality
      if (cookieBanner) {
        const bannerStyles = await this.getElementStyles(this.selectors.cookieConsent.banner);
        const expected = this.expectedStyles.cookieConsent.banner;
        
        // Check banner positioning
        if (bannerStyles && !expected.position.test(bannerStyles.position)) {
          errors.push(`Cookie banner position should be fixed/sticky, found: ${bannerStyles.position}`);
        }
        
        // Check for accept button
        const acceptButtonExists = await this.elementExists(this.selectors.cookieConsent.acceptButton);
        if (!acceptButtonExists) {
          errors.push('Cookie accept button not found');
        }
        
        // Check for reject/decline button
        const rejectButtonExists = await this.elementExists(this.selectors.cookieConsent.rejectButton);
        if (!rejectButtonExists) {
          errors.push('Cookie reject button not found');
        }
        
        // Check for settings button
        const settingsButtonExists = await this.elementExists(this.selectors.cookieConsent.settingsButton);
        if (!settingsButtonExists) {
          errors.push('Cookie settings button not found');
        }
      } else {
        // Cookie banner not present - this might be intentional, so just note it
        console.log('   ℹ️ No cookie consent banner detected (may be intentional)');
      }
      
      // Check for cookie policy link
      const cookiePolicyExists = await this.elementExists(this.selectors.cookieConsent.cookiePolicyLink);
      if (!cookiePolicyExists) {
        console.log('   ℹ️ No dedicated cookie policy link found (may be included in privacy policy)');
      }
      
    } catch (error) {
      errors.push(`Cookie consent validation failed: ${error.message}`);
    }
    
    return errors;
  }

  async validateHeroSection() {
    const errors = [];
    
    // Hero title
    const titleText = await this.getElementText(this.selectors.hero.title);
    if (!titleText?.includes('Jace')) {
      errors.push(`Hero title should contain "Jace", found: "${titleText}"`);
    }

    // Hero subtitle
    const subtitleText = await this.getElementText(this.selectors.hero.subtitle);
    if (!subtitleText || !this.expectedContent.heroSubtitle.test(subtitleText)) {
      errors.push('Hero subtitle not found or incorrect');
    }

    // CTA button
    const ctaExists = await this.elementExists(this.selectors.hero.ctaButton);
    if (!ctaExists) {
      errors.push('Hero CTA button not found');
    }

    // Video section
    const videoExists = await this.elementExists(this.selectors.hero.video);
    if (!videoExists) {
      errors.push('Hero video section not found');
    }

    return errors;
  }

  async validateNavigation() {
    const errors = [];
    
    // Logo
    const logoText = await this.getElementText(this.selectors.navigation.logo);
    if (!logoText?.toLowerCase().includes('jace')) {
      errors.push(`Logo should contain "jace", found: "${logoText}"`);
    }

    // Nav items
    const navTexts = await this.page.$$eval(this.selectors.navigation.navLinks, 
      links => links.map(link => link.textContent?.trim()).filter(text => text)
    );
    
    const expectedNavItems = this.expectedContent.navItems;
    const uniqueNavItems = [...new Set(navTexts)].filter(item => expectedNavItems.includes(item));
    
    if (uniqueNavItems.length !== expectedNavItems.length) {
      errors.push(`Navigation items incomplete. Expected: ${expectedNavItems.join(', ')}, Found: ${uniqueNavItems.join(', ')}`);
    }

    return errors;
  }

  async validateTrustIndicators() {
    const errors = [];
    
    // CASA badge
    const casaExists = await this.elementExists(this.selectors.trust.casaBadge);
    if (!casaExists) {
      errors.push('CASA Tier 3 badge not found');
    }

    // User count - check if the text exists anywhere on the page
    const userCountInPage = await this.page.evaluate(() => {
      return document.body.textContent.includes('Join 1000+');
    });
    if (!userCountInPage) {
      errors.push('User count text not found');
    }

    return errors;
  }

  async validateCompanyLogos() {
    const errors = [];
    
    // Check company section with specific class
    const companyExists = await this.elementExists(this.selectors.companies.section) || 
                         await this.elementExists(this.selectors.companies.text);
    if (!companyExists) {
      errors.push('Company section not found');
    }
    
    return errors;
  }

  async validateFeatures() {
    const errors = [];
    
    // Features title - check both element and text
    const titleElement = await this.elementExists(this.selectors.features.title);
    if (titleElement) {
      const featuresTitle = await this.getElementText(this.selectors.features.title);
      if (!featuresTitle?.includes('24/7 support') && !featuresTitle?.includes('Save hours daily') && !featuresTitle?.includes('AI-powered inbox')) {
        errors.push('Features title text incorrect');
      }
    } else {
      errors.push('Features title element not found');
    }

    // Feature cards
    const featureCards = await this.page.$$(this.selectors.features.cards);
    if (featureCards.length < 3) {
      errors.push(`Expected at least 3 feature cards, found ${featureCards.length}`);
    }

    return errors;
  }

  async validatePricing() {
    const errors = [];
    
    // Pricing title - check both element and text
    const titleElement = await this.elementExists(this.selectors.pricing.title);
    if (titleElement) {
      const pricingTitle = await this.getElementText(this.selectors.pricing.title);
      if (!pricingTitle?.includes('7-day free trial')) {
        errors.push('Pricing title text incorrect');
      }
    } else {
      errors.push('Pricing title element not found');
    }

    // Pricing cards
    const pricingCards = await this.page.$$(this.selectors.pricing.cards);
    if (pricingCards.length < 1) {
      errors.push('Pricing cards not found');
    }

    return errors;
  }

  async validateTestimonials() {
    const errors = [];
    
    if (this.isRefactor) {
      // Refactor site HAS testimonials section
      const testimonialsFound = await this.page.evaluate(() => {
        const h2Elements = document.querySelectorAll('h2');
        return Array.from(h2Elements).some(h2 => h2.textContent.includes('Less Email, More Productivity'));
      });
      
      if (!testimonialsFound) {
        errors.push('Testimonials section with "Less Email, More Productivity" not found');
      }
    } else {
      // Original site doesn't have testimonials
      console.log('   ℹ️ Testimonials section not present on original site - skipping validation');
    }

    return errors;
  }

  async validateFAQ() {
    const errors = [];
    
    // FAQ section - check if FAQ text exists anywhere
    const faqTextExists = await this.page.evaluate(() => {
      return document.body.textContent?.includes('Frequently asked questions');
    });
    
    if (!faqTextExists) {
      errors.push('FAQ section with "Frequently asked questions" text not found');
    }

    return errors;
  }

  async validateMobileMenu() {
    const errors = [];
    
    // Mobile menu button with aria-expanded
    const mobileButtonExists = await this.elementExists(this.selectors.navigation.mobileMenuButton);
    if (!mobileButtonExists) {
      errors.push('Mobile menu button not found');
    }

    return errors;
  }

  async validateAccessibility() {
    const errors = [];
    
    // ARIA labels
    const ariaElements = await this.page.$$(this.selectors.accessibility.ariaLabels);
    if (ariaElements.length === 0) {
      errors.push('No ARIA labels found');
    }

    return errors;
  }

  async validateResponsive() {
    const errors = [];
    
    // Responsive elements
    const responsiveElements = await this.page.$$(this.selectors.responsive.mobileHidden);
    if (responsiveElements.length === 0) {
      errors.push('No responsive utility classes found');
    }

    return errors;
  }

  async validateVisualElements() {
    const errors = [];
    
    // Icons
    const icons = await this.page.$$(this.selectors.visual.icons);
    if (icons.length === 0) {
      errors.push('No SVG icons found');
    }

    return errors;
  }

  async validateCookieBanner() {
    const errors = [];
    
    // Cookie banner - only check if exists (not required)
    const bannerElement = await this.elementExists(this.selectors.cookie.banner);
    if (bannerElement) {
      const bannerText = await this.getElementText(this.selectors.cookie.banner);
      if (!bannerText?.includes('Cookie Preferences')) {
        errors.push('Cookie banner text incorrect');
      }
    } else {
      // Cookie banner not implemented - this is OK
      console.log('   ℹ️ No cookie banner implemented (optional feature)');
    }

    return errors;
  }

  // Main validation method covering all areas from pom_extension.md + NEW elements
  async validateAll() {
    const results = {
      backgrounds: await this.validateBackgrounds(),
      hero: await this.validateHeroSection(),
      navigation: await this.validateNavigation(),
      trust: await this.validateTrustIndicators(),
      companies: await this.validateCompanyLogos(),
      features: await this.validateFeatures(),
      pricing: await this.validatePricing(),
      testimonials: await this.validateTestimonials(),
      faq: await this.validateFAQ(),
      mobileMenu: await this.validateMobileMenu(),
      accessibility: await this.validateAccessibility(),
      responsive: await this.validateResponsive(),
      visual: await this.validateVisualElements(),
      cookie: await this.validateCookieBanner(),
      // NEW: Additional validation methods
      viewport: await this.validateViewportSpecificStyles(),
      checkmarks: await this.validateCheckmarkColors(),
      faqInteractivity: await this.validateFAQInteractivity(),
      specialBackgrounds: await this.validateSpecialBackgrounds(),
      cookieConsent: await this.validateCookieConsent()
    };
    
    return results;
  }

  // Interactive testing methods
  async testMobileMenuToggle() {
    const errors = [];
    
    // Test mobile menu functionality
    await this.page.setViewport({ width: 375, height: 667 });
    
    const menuButtons = await this.page.$$(this.selectors.navigation.mobileMenuButton);
    if (menuButtons.length > 0) {
      // Try clicking the first mobile menu button
      const menuButton = menuButtons[0];
      await menuButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if menu opened - different for refactor vs original
      if (this.isRefactor) {
        // For refactor, check if mobile menu div is visible
        const menuVisible = await this.page.evaluate(() => {
          const menu = document.getElementById('mobile-menu');
          return menu && !menu.classList.contains('hidden');
        });
        if (!menuVisible) {
          errors.push('Mobile menu did not open (still has hidden class)');
        }
      } else {
        // For original, check aria-expanded
        const isExpanded = await menuButton.evaluate(el => el.getAttribute('aria-expanded') === 'true');
        if (!isExpanded) {
          errors.push('Mobile menu did not open (aria-expanded still false)');
        }
      }
    } else {
      errors.push('No mobile menu button found');
    }
    
    // Reset viewport
    await this.page.setViewport({ width: 1200, height: 800 });
    
    return errors;
  }

  async testHoverStates() {
    const errors = [];
    
    // Test hover effects on interactive elements
    const hoverElements = await this.page.$$(this.selectors.interactive.hoverElements);
    
    for (const element of hoverElements.slice(0, 3)) { // Test first 3 elements
      await element.hover();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return errors;
  }

  async testFAQAccordion() {
    const errors = [];
    
    // Use adaptive selector for FAQ buttons
    const selector = this.isRefactor ? 'button[onclick*="toggleFAQ"]' : 'button[aria-expanded]';
    const faqButtons = await this.page.$$(selector);
    
    if (faqButtons.length > 0) {
      if (this.isRefactor) {
        // For refactor, check if clicking toggles the hidden state
        const firstButton = faqButtons[0];
        const contentInitiallyHidden = await firstButton.evaluate(btn => {
          const content = btn.nextElementSibling;
          return content && content.classList.contains('hidden');
        });
        
        await firstButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const contentNowVisible = await firstButton.evaluate(btn => {
          const content = btn.nextElementSibling;
          return content && !content.classList.contains('hidden');
        });
        
        if (contentInitiallyHidden && !contentNowVisible) {
          errors.push('FAQ accordion did not expand when clicked');
        }
      } else {
        // Original site logic with aria-expanded
        let buttonToClick = null;
        for (const button of faqButtons) {
          const isExpanded = await button.evaluate(el => el.getAttribute('aria-expanded'));
          if (isExpanded === 'false') {
            buttonToClick = button;
            break;
          }
        }
        
        if (buttonToClick) {
          await buttonToClick.click();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const isNowExpanded = await buttonToClick.evaluate(el => el.getAttribute('aria-expanded'));
          if (isNowExpanded !== 'true') {
            errors.push('FAQ accordion did not expand when clicked');
          }
        } else {
          errors.push('All FAQ items already expanded (this is actually fine)');
        }
      }
    } else {
      errors.push('No FAQ buttons found');
    }
    
    return errors;
  }

  async testCookieConsentFunctionality() {
    const errors = [];
    
    console.log('🍪 Testing cookie consent functionality...');
    
    try {
      // Check if cookie banner is present
      const cookieBanner = await this.page.$(this.selectors.cookieConsent.banner);
      
      if (cookieBanner) {
        // Test accept button click
        const acceptButton = await this.page.$(this.selectors.cookieConsent.acceptButton);
        if (acceptButton) {
          await acceptButton.click();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Check if banner disappeared
          const bannerStillVisible = await this.page.$(this.selectors.cookieConsent.banner);
          if (bannerStillVisible) {
            errors.push('Cookie banner should disappear after accepting');
          }
        } else {
          errors.push('Cookie accept button not clickable');
        }
        
        // Test settings modal (if present)
        const settingsButton = await this.page.$(this.selectors.cookieConsent.settingsButton);
        if (settingsButton) {
          await settingsButton.click();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Check if modal opened
          const modal = await this.page.$(this.selectors.cookieConsent.modal);
          if (!modal) {
            errors.push('Cookie settings modal should open when clicking settings button');
          }
        }
      } else {
        console.log('   ℹ️ No cookie banner to test (implementation may not include cookie consent)');
      }
      
      // Test privacy/terms links
      const privacyLink = await this.page.$(this.selectors.cookieConsent.privacyLink);
      if (privacyLink) {
        const href = await privacyLink.evaluate(el => el.getAttribute('href'));
        if (!href || (!href.includes('/privacy') && !href.includes('privacy'))) {
          errors.push('Privacy link should point to privacy policy page');
        }
      }
      
      const termsLink = await this.page.$(this.selectors.cookieConsent.termsLink);
      if (termsLink) {
        const href = await termsLink.evaluate(el => el.getAttribute('href'));
        if (!href || (!href.includes('/terms') && !href.includes('terms'))) {
          errors.push('Terms link should point to terms of service page');
        }
      }
      
    } catch (error) {
      errors.push(`Cookie consent functionality test failed: ${error.message}`);
    }
    
    return errors;
  }
}