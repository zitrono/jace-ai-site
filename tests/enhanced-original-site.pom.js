// Enhanced Page Object Model for Original Jace AI Site - 140+ Elements
export class EnhancedOriginalJaceAISite {
  constructor(page) {
    this.page = page;
    this.url = 'https://zitrono.github.io/jace-ai-site/';
  }

  // Enhanced Selectors - 30+ selectors
  selectors = {
    // Header Elements
    header: 'header',
    headerContainer: 'header > nav',
    logo: 'header svg',
    navLinks: 'header nav a',
    loginButton: 'a[href*="signin"]',
    mobileMenuButton: 'button[aria-label*="menu"]',
    
    // Hero Section Elements
    heroSection: 'main section, .isolate',
    heroContainer: '.mx-auto.max-w-7xl',
    heroTitle: 'h1',
    heroSubtitle: 'main p:first-of-type',
    heroCTAButton: 'main button:first-of-type',
    heroSecondaryText: 'main p:nth-of-type(2)',
    
    // Typography Elements
    allH1: 'h1',
    allH2: 'h2', 
    allH3: 'h3',
    allH4: 'h4, .sr-only',
    bodyText: 'p',
    gradientText: '[style*="gradient"]',
    
    // Button Variations
    primaryCTAButtons: 'button.bg-yellow-400, .bg-surface-highlight',
    secondaryButtons: '.bg-button-bg-base, .secondary-button',
    mobileButtons: 'button',
    toggleButtons: '.border-white\\/10, [border*="white"]',
    accordionButtons: 'details summary',
    
    // Trust Indicators & Badges
    casaBadge: '.border-2',
    certificationBadge: '.rounded-full',
    userCount: 'span',
    userAvatars: '.flex.-space-x-2 > div',
    avatarImages: 'img[alt*="avatar"], .rounded-full',
    
    // Video & Media
    videoContainer: '.bg-gradient-to-br',
    videoTitle: 'h3',
    playButton: 'svg path[d*="M8 5v14l11-7z"]',
    
    // Company & Logos
    companySection: 'div',
    companyLogos: '.opacity-60, .company-logos-opacity, .space-x-8 div, .text-gray-400, .font-bold',
    logoElements: 'svg',
    
    // Cards & Containers
    featureCards: '.bg-gray-800, .sr-only h3, h3',
    pricingCards: '.ring-1.ring-black\\/5',
    contentContainers: '.max-w-7xl',
    backgroundContainers: '.bg-gradient-to-br',
    
    // Forms & Inputs  
    searchInputs: 'input[type="search"]',
    formElements: 'form',
    inputFields: 'input',
    
    // Interactive Elements
    dropdowns: '[role="menu"]',
    modals: '[role="dialog"]',
    tooltips: '[role="tooltip"]',
    
    // Footer Elements
    footer: 'footer',
    footerLinks: 'footer a',
    footerContainer: 'footer > div'
  };

  // Enhanced Expected Styles - 110+ style properties
  expectedStyles = {
    // Typography Base (5 properties)
    typography: {
      bodyFont: {
        fontFamily: /Geist/,
        fontSize: '16px',
        lineHeight: '24px'
      },
      baseColor: /rgb\(255, 246, 238\)|rgb\(0, 0, 0\)|rgb\(255, 255, 255\)/,
      baseFontWeight: '400'
    },
    
    // Hero Section Styles (25 properties)
    hero: {
      section: {
        paddingTop: /128px|160px|0px/,
        paddingBottom: /32px|8px|0px/,
        marginTop: /\-89\.6px|0px/
      },
      container: {
        maxWidth: '1280px',
        paddingLeft: /32px|8px|24px/,
        paddingRight: /32px|8px|24px/,
        margin: '0 auto'
      },
      title: {
        fontSize: '60px',
        fontWeight: '600',
        fontFamily: /Geist/,
        backgroundImage: /linear-gradient\(353deg/,
        letterSpacing: '-1.5px',
        lineHeight: '60px',
        color: 'rgba(0, 0, 0, 0)',
        webkitTextFillColor: 'rgba(0, 0, 0, 0)',
        webkitBackgroundClip: 'text',
        backgroundClip: 'text'
      },
      subtitle: {
        fontSize: '24px',
        fontWeight: '500',
        color: /rgba\(255, 246, 238/,
        lineHeight: '32px',
        fontFamily: /Geist/,
        marginTop: '16px'
      },
      secondaryText: {
        fontSize: '14px',
        fontWeight: '400',
        color: /rgba\(255, 246, 238, 0\.72\)/,
        marginTop: '8px'
      }
    },
    
    // Button Variations (35 properties)
    buttons: {
      primary: {
        backgroundColor: /rgb\(255, 220, 97\)|rgb\(250, 204, 21\)/,
        color: /rgb\(41, 48, 69\)|rgb\(17, 24, 39\)/,
        borderRadius: /8px|6px/,
        fontSize: /16px|14px|18px/,
        fontWeight: '500',
        padding: /0px 24px|0px 12px|8px 16px|8px 24px|12px 24px|16px 32px/,
        height: '40px',
        border: '1px solid rgba(255, 255, 255, 0.02)',
        boxShadow: /rgba\(0, 0, 0, 0\.1\) 0px 1px 3px/,
        transition: /0\.2s.*cubic-bezier/,
        cursor: 'pointer'
      },
      secondary: {
        backgroundColor: 'rgb(65, 65, 65)',
        color: 'rgb(255, 246, 238)',
        borderRadius: '8px',
        padding: '0px 24px',
        height: '40px',
        fontWeight: '500',
        border: '1px solid rgba(255, 255, 255, 0.02)',
        boxShadow: /rgba\(0, 0, 0, 0\.1\)/,
        transition: /0\.2s.*cubic-bezier/,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      mobile: {
        fontSize: '14px',
        padding: '0px 24px',
        height: '32px',
        borderRadius: '6px'
      },
      toggle: {
        borderRadius: '12px',
        padding: '8px 12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: /rgb\(53, 53, 53\)|rgba\(0, 0, 0, 0\)/
      },
      accordion: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: 'rgb(255, 255, 255)',
        border: 'none',
        width: '100%',
        textAlign: 'left'
      }
    },
    
    // Typography Variations (20 properties)
    headings: {
      h1: {
        fontSize: '60px',
        fontWeight: '600',
        lineHeight: '60px',
        letterSpacing: '-1.5px'
      },
      h2Section: {
        fontSize: '24px',
        fontWeight: '600',
        color: 'rgb(255, 220, 97)',
        letterSpacing: '-0.6px'
      },
      h2Pricing: {
        fontSize: '24px',
        fontWeight: '600',
        color: 'rgb(255, 255, 255)',
        lineHeight: '32px'
      },
      h3: {
        fontSize: '20px',
        fontWeight: '600',
        color: 'rgb(255, 255, 255)',
        lineHeight: '28px'
      },
      h4: {
        fontSize: '18px',
        fontWeight: '500',
        color: 'rgb(255, 255, 255)',
        lineHeight: '24px'
      }
    },
    
    bodyText: {
      large: {
        fontSize: '48px',
        fontWeight: '600',
        color: 'rgb(255, 255, 255)',
        lineHeight: '56px'
      },
      primary: {
        fontSize: '24px',
        fontWeight: '500',
        color: 'rgba(255, 246, 238, 0.72)',
        lineHeight: '32px'
      },
      secondary: {
        fontSize: '14px',
        fontWeight: '400',
        color: 'rgba(255, 246, 238, 0.72)',
        lineHeight: '20px'
      }
    },
    
    gradientText: {
      purpleYellow: {
        backgroundImage: /linear-gradient.*oklch.*305\.504.*oklch.*91\.936/,
        fontSize: '24px',
        fontWeight: '600',
        lineHeight: '32px',
        letterSpacing: '-0.6px',
        color: /rgba\(0, 0, 0, 0\)|rgb\(0, 0, 0\)/,
        webkitTextFillColor: /rgba\(0, 0, 0, 0\)|rgb\(0, 0, 0\)/
      }
    },
    
    // Layout & Containers (15 properties)
    layout: {
      body: {
        backgroundColor: 'rgb(40, 40, 40)',
        fontFamily: /Geist/,
        margin: '0px',
        padding: '0px'
      },
      mainContainer: {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '32px',
        paddingRight: '32px'
      },
      contentContainer: {
        maxWidth: '896px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    },
    
    cards: {
      feature: {
        backgroundColor: 'rgb(53, 53, 53)',
        borderRadius: '8px',
        padding: '32px',
        boxShadow: /rgba\(0, 0, 0, 0\.1\) 0px 1px 3px/,
        border: '1px solid rgba(255, 255, 255, 0.02)'
      },
      pricing: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: '32px 8px 8px 32px',
        padding: '40px',
        boxShadow: /rgba\(0, 0, 0, 0\.05\)/,
        ring: /ring-1.*ring-black/
      }
    },
    
    // Header Styles (10 properties)
    header: {
      container: {
        position: 'sticky',
        top: '0px',
        zIndex: '20',
        backgroundColor: 'rgba(0, 0, 0, 0)'
      },
      navigation: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '8px',
        display: 'flex'
      },
      navLinks: {
        color: 'rgb(255, 255, 255)',
        fontSize: '16px',
        fontWeight: '600',
        textDecoration: 'none',
        transition: /0\.15s.*cubic-bezier/
      },
      logo: {
        fill: 'rgb(255, 255, 255)',
        width: '70px',
        height: '33.25px'
      }
    },
    
    // Trust Indicators & Badges (15 properties)
    trust: {
      casaBadge: {
        backgroundColor: 'rgb(53, 53, 53)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '9999px',
        color: 'rgb(156, 163, 175)',
        padding: '8px 12px',
        fontSize: '12px',
        fontWeight: '700'
      },
      avatars: {
        width: '32px',
        height: '32px',
        borderRadius: '9999px',
        border: '2px solid rgb(31, 41, 55)',
        marginLeft: '-8px'
      },
      userCount: {
        fontSize: '14px',
        color: 'rgba(255, 246, 238, 0.72)',
        fontWeight: '400'
      },
      certificationBadge: {
        backgroundColor: 'rgb(53, 53, 53)',
        borderRadius: '12px',
        padding: '8px 12px',
        fontSize: '14px',
        fontWeight: '500'
      }
    },
    
    // Video & Media (8 properties)
    video: {
      container: {
        backgroundImage: /linear-gradient.*rgb\(59, 130, 246\).*rgb\(20, 184, 166\)/,
        borderRadius: '8px',
        aspectRatio: '16 / 9',
        padding: '32px',
        position: 'relative'
      },
      title: {
        fontSize: '32px',
        fontWeight: '700',
        color: 'rgb(255, 255, 255)',
        textAlign: 'center'
      },
      playButton: {
        fill: 'rgb(255, 255, 255)',
        width: '48px',
        height: '48px'
      }
    },
    
    // Company Logos (5 properties)
    company: {
      section: {
        marginTop: '64px',
        marginBottom: '96px',
        textAlign: 'center'
      },
      logos: {
        opacity: '0.8',
        fill: 'rgb(255, 255, 255)',
        fontWeight: '700'
      },
      title: {
        fontSize: '14px',
        color: 'rgba(255, 246, 238, 0.72)',
        marginBottom: '32px'
      }
    },
    
    // Spacing & Layout (10 properties)
    spacing: {
      sectionLarge: '128px 0px',
      sectionMedium: '64px 0px',
      sectionSmall: '32px 0px',
      elementMarginLarge: '64px',
      elementMarginMedium: '32px',
      elementMarginSmall: '16px',
      gridGapStandard: '16px',
      gridGapLarge: '20px',
      heroPaddingTop: /128px|0px/,
      sectionPadding: '24px 0px 8px 0px'
    },
    
    // Interactive Elements (8 properties)
    interactive: {
      hoverTransition: /0\.15s.*cubic-bezier/,
      activeScale: 'scale(0.99)',
      hoverOpacity: '0.8',
      focusRing: /ring-2.*ring-offset-2/,
      disabledOpacity: '0.5',
      cursorPointer: 'pointer',
      cursorNotAllowed: 'not-allowed',
      userSelect: 'none'
    },
    
    // Footer (5 properties)
    footer: {
      backgroundColor: 'rgb(40, 40, 40)',
      padding: '64px 0px 32px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      links: {
        fontSize: '14px',
        fontWeight: '500',
        color: 'rgba(255, 246, 238, 0.72)'
      }
    }
  };

  // Enhanced Expected Content (15 items)
  expectedContent = {
    heroTitle: 'Gain 2 Hours Daily with Jace',
    heroSubtitle: /Start your day with emails organized.*drafts ready.*daily brief/,
    ctaButtonText: 'Get Started for Free',
    casaBadgeText: 'CASA Tier 3',
    certifiedText: 'CERTIFIED',
    joinText: 'Join 1000+ enthusiasts',
    companyText: 'Built by engineers from',
    supportFeatures: ['24/7 support', 'Money-back guarantee', 'Privacy protection', 'Secure checkout'],
    navItems: ['Features', 'Company', 'Pricing', 'Blog'],
    videoTitle: 'The Way Jace Works',
    pricingPlans: ['Free', 'Pro', 'Plus'],
    footerSections: ['Product', 'Company', 'Resources', 'Legal'],
    testimonialCount: /\d+\+?\s+(users?|customers?|people)/i,
    featureCount: /\d+\+?\s+(features?|tools?|integrations?)/i,
    securityBadges: ['SOC 2', 'GDPR', 'CCPA']
  };

  // Navigation methods
  async navigate() {
    await this.page.goto(this.url, { waitUntil: 'networkidle0' });
  }

  // Enhanced element getter methods
  async getHeroTitle() {
    return await this.page.$(this.selectors.heroTitle);
  }

  async getHeroSubtitle() {
    return await this.page.$(this.selectors.heroSubtitle);
  }

  async getCTAButton() {
    return await this.page.$(this.selectors.heroCTAButton);
  }

  async getAllButtons() {
    return await this.page.$$(this.selectors.primaryCTAButtons + ', ' + this.selectors.secondaryButtons);
  }

  async getAllHeadings() {
    return await this.page.$$(this.selectors.allH1 + ', ' + this.selectors.allH2 + ', ' + this.selectors.allH3 + ', ' + this.selectors.allH4);
  }

  // Enhanced style validation methods
  async getElementStyles(selector) {
    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return null;
      const styles = window.getComputedStyle(element);
      return {
        // Typography
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        fontFamily: styles.fontFamily,
        lineHeight: styles.lineHeight,
        letterSpacing: styles.letterSpacing,
        textDecoration: styles.textDecoration,
        textAlign: styles.textAlign,
        
        // Colors
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        webkitTextFillColor: styles.webkitTextFillColor,
        webkitBackgroundClip: styles.webkitBackgroundClip,
        backgroundClip: styles.backgroundClip,
        fill: styles.fill,
        
        // Box Model
        padding: styles.padding,
        paddingTop: styles.paddingTop,
        paddingRight: styles.paddingRight,
        paddingBottom: styles.paddingBottom,
        paddingLeft: styles.paddingLeft,
        margin: styles.margin,
        marginTop: styles.marginTop,
        marginRight: styles.marginRight,
        marginBottom: styles.marginBottom,
        marginLeft: styles.marginLeft,
        border: styles.border,
        borderTop: styles.borderTop,
        borderRight: styles.borderRight,
        borderBottom: styles.borderBottom,
        borderLeft: styles.borderLeft,
        borderRadius: styles.borderRadius,
        borderWidth: styles.borderWidth,
        borderColor: styles.borderColor,
        
        // Layout
        width: styles.width,
        height: styles.height,
        maxWidth: styles.maxWidth,
        minWidth: styles.minWidth,
        maxHeight: styles.maxHeight,
        minHeight: styles.minHeight,
        aspectRatio: styles.aspectRatio,
        display: styles.display,
        position: styles.position,
        top: styles.top,
        right: styles.right,
        bottom: styles.bottom,
        left: styles.left,
        zIndex: styles.zIndex,
        
        // Effects
        boxShadow: styles.boxShadow,
        opacity: styles.opacity,
        transform: styles.transform,
        transition: styles.transition,
        cursor: styles.cursor,
        
        // Flexbox/Grid
        flexDirection: styles.flexDirection,
        justifyContent: styles.justifyContent,
        alignItems: styles.alignItems,
        alignSelf: styles.alignSelf,
        gap: styles.gap,
        gridTemplateColumns: styles.gridTemplateColumns,
        gridGap: styles.gridGap,
        
        // Vertical alignment
        verticalAlign: styles.verticalAlign
      };
    }, selector);
  }

  // Enhanced content validation methods
  async getElementText(selector) {
    const element = await this.page.$(selector);
    if (!element) return null;
    return await element.evaluate(el => el.textContent?.trim());
  }

  async getAllTexts(selector) {
    return await this.page.$$eval(selector, elements => 
      elements.map(el => el.textContent.trim())
    );
  }

  async getElementAttribute(selector, attribute) {
    const element = await this.page.$(selector);
    if (!element) return null;
    return await element.evaluate((el, attr) => el.getAttribute(attr), attribute);
  }

  // Enhanced validation methods
  async validateHeroSection() {
    const errors = [];
    
    // Check title
    const titleText = await this.getElementText(this.selectors.heroTitle);
    if (titleText !== this.expectedContent.heroTitle) {
      errors.push(`Hero title mismatch: "${titleText}" !== "${this.expectedContent.heroTitle}"`);
    }
    
    // Check title styles
    const titleStyles = await this.getElementStyles(this.selectors.heroTitle);
    if (titleStyles) {
      const titleStyleChecks = [
        { prop: 'fontSize', expected: this.expectedStyles.hero.title.fontSize },
        { prop: 'fontWeight', expected: this.expectedStyles.hero.title.fontWeight },
        { prop: 'letterSpacing', expected: this.expectedStyles.hero.title.letterSpacing },
        { prop: 'lineHeight', expected: this.expectedStyles.hero.title.lineHeight },
        { prop: 'color', expected: this.expectedStyles.hero.title.color },
        { prop: 'webkitTextFillColor', expected: this.expectedStyles.hero.title.webkitTextFillColor }
      ];
      
      titleStyleChecks.forEach(check => {
        if (check.expected instanceof RegExp) {
          if (!check.expected.test(titleStyles[check.prop])) {
            errors.push(`Title ${check.prop} mismatch: ${titleStyles[check.prop]}`);
          }
        } else {
          if (titleStyles[check.prop] !== check.expected) {
            errors.push(`Title ${check.prop} mismatch: ${titleStyles[check.prop]} (expected: ${check.expected})`);
          }
        }
      });
      
      if (!this.expectedStyles.hero.title.backgroundImage.test(titleStyles.backgroundImage)) {
        errors.push(`Title gradient mismatch: ${titleStyles.backgroundImage}`);
      }
    }
    
    // Check subtitle
    const subtitleText = await this.getElementText(this.selectors.heroSubtitle);
    if (!this.expectedContent.heroSubtitle.test(subtitleText)) {
      errors.push(`Hero subtitle mismatch: "${subtitleText}"`);
    }
    
    // Check CTA button
    const ctaText = await this.getElementText(this.selectors.heroCTAButton);
    if (ctaText !== this.expectedContent.ctaButtonText) {
      errors.push(`CTA button text mismatch: "${ctaText}"`);
    }
    
    return errors;
  }

  async validateButtonStyles() {
    const errors = [];
    
    // Validate primary buttons
    const primaryButtons = await this.page.$$(this.selectors.primaryCTAButtons);
    for (let i = 0; i < primaryButtons.length; i++) {
      const buttonStyles = await primaryButtons[i].evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderRadius: styles.borderRadius,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          padding: styles.padding,
          border: styles.border,
          boxShadow: styles.boxShadow
        };
      });
      
      const buttonStyleChecks = [
        { prop: 'backgroundColor', expected: this.expectedStyles.buttons.primary.backgroundColor },
        { prop: 'color', expected: this.expectedStyles.buttons.primary.color },
        { prop: 'borderRadius', expected: this.expectedStyles.buttons.primary.borderRadius },
        { prop: 'fontSize', expected: this.expectedStyles.buttons.primary.fontSize },
        { prop: 'fontWeight', expected: this.expectedStyles.buttons.primary.fontWeight },
        { prop: 'padding', expected: this.expectedStyles.buttons.primary.padding }
      ];
      
      buttonStyleChecks.forEach(check => {
        if (check.expected instanceof RegExp) {
          if (!check.expected.test(buttonStyles[check.prop])) {
            errors.push(`Primary button ${i} ${check.prop} mismatch: ${buttonStyles[check.prop]}`);
          }
        } else {
          if (buttonStyles[check.prop] !== check.expected) {
            errors.push(`Primary button ${i} ${check.prop} mismatch: ${buttonStyles[check.prop]} (expected: ${check.expected})`);
          }
        }
      });
    }
    
    return errors;
  }

  async validateTypographyVariations() {
    const errors = [];
    
    // Check all H1 elements
    const h1Elements = await this.page.$$(this.selectors.allH1);
    for (let i = 0; i < h1Elements.length; i++) {
      const h1Styles = await h1Elements[i].evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          lineHeight: styles.lineHeight,
          letterSpacing: styles.letterSpacing
        };
      });
      
      const h1StyleChecks = [
        { prop: 'fontSize', expected: this.expectedStyles.headings.h1.fontSize },
        { prop: 'fontWeight', expected: this.expectedStyles.headings.h1.fontWeight },
        { prop: 'lineHeight', expected: this.expectedStyles.headings.h1.lineHeight },
        { prop: 'letterSpacing', expected: this.expectedStyles.headings.h1.letterSpacing }
      ];
      
      h1StyleChecks.forEach(check => {
        if (h1Styles[check.prop] !== check.expected) {
          errors.push(`H1 element ${i} ${check.prop} mismatch: ${h1Styles[check.prop]} (expected: ${check.expected})`);
        }
      });
    }
    
    // Check gradient text elements
    const gradientElements = await this.page.$$(this.selectors.gradientText);
    for (let i = 0; i < gradientElements.length; i++) {
      const gradientStyles = await gradientElements[i].evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundImage: styles.backgroundImage,
          color: styles.color,
          webkitTextFillColor: styles.webkitTextFillColor
        };
      });
      
      if (!this.expectedStyles.gradientText.purpleYellow.color.test(gradientStyles.color)) {
        errors.push(`Gradient text ${i} color mismatch: ${gradientStyles.color}`);
      }
    }
    
    return errors;
  }

  async validateSupportSection() {
    const errors = [];
    
    // Check for support features (h3 elements)
    const h3Titles = await this.page.$$eval('h3', elements => 
      elements.map(el => el.textContent?.trim()).filter(text => text)
    );
    
    const missingFeatures = this.expectedContent.supportFeatures.filter(feature => 
      !h3Titles.some(title => title === feature)
    );
    
    if (missingFeatures.length > 0) {
      errors.push(`Missing support features: ${missingFeatures.join(', ')}`);
    }
    
    const videoContainer = await this.page.$(this.selectors.videoContainer);
    if (!videoContainer) {
      errors.push('Video container not found');
    }
    
    return errors;
  }

  async validateCompanySection() {
    const errors = [];
    
    // Check if company section exists by looking for the text
    const hasCompanyText = await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).some(el => 
        el.textContent?.includes('Built by engineers from')
      );
    });
    
    if (!hasCompanyText) {
      errors.push('Company section "Built by engineers from" not found');
    }
    
    return errors;
  }

  async validateTrustSection() {
    const errors = [];
    
    // Check for CASA badge text
    const hasCasaText = await this.page.evaluate(() => {
      return document.body.textContent.includes('CASA Tier 3');
    });
    
    if (!hasCasaText) {
      errors.push('CASA Tier 3 text not found');
    }
    
    // Check for certified text
    const hasCertifiedText = await this.page.evaluate(() => {
      return document.body.textContent.includes('CERTIFIED');
    });
    
    if (!hasCertifiedText) {
      errors.push('CERTIFIED text not found');
    }
    
    // Check for join text
    const hasJoinText = await this.page.evaluate(() => {
      return document.body.textContent.includes('Join 1000+ enthusiasts');
    });
    
    if (!hasJoinText) {
      errors.push('Join 1000+ enthusiasts text not found');
    }
    
    return errors;
  }

  async validateNavigation() {
    const errors = [];
    
    const navLinks = await this.getAllTexts(this.selectors.navLinks);
    const uniqueLinks = [...new Set(navLinks)]; // Remove duplicates
    const filteredLinks = uniqueLinks.filter(link => 
      this.expectedContent.navItems.includes(link)
    );
    
    if (filteredLinks.length !== this.expectedContent.navItems.length) {
      errors.push(`Navigation items mismatch: found ${filteredLinks.join(', ')}`);
    }
    
    return errors;
  }

  async validateLayoutAndSpacing() {
    const errors = [];
    
    // Check hero section spacing
    const heroSection = await this.getElementStyles(this.selectors.heroSection);
    if (heroSection) {
      if (!this.expectedStyles.spacing.heroPaddingTop.test(heroSection.paddingTop)) {
        errors.push(`Hero padding top mismatch: ${heroSection.paddingTop} doesn't match pattern`);
      }
    }
    
    // Check main container max width
    const mainContainer = await this.getElementStyles(this.selectors.heroContainer);
    if (mainContainer) {
      if (!this.expectedStyles.layout.mainContainer.maxWidth.includes(mainContainer.maxWidth)) {
        errors.push(`Main container max width mismatch: ${mainContainer.maxWidth}`);
      }
    }
    
    return errors;
  }

  // Main enhanced validation method
  async validateAll() {
    const results = {
      hero: await this.validateHeroSection(),
      buttons: await this.validateButtonStyles(),
      typography: await this.validateTypographyVariations(),
      support: await this.validateSupportSection(),
      company: await this.validateCompanySection(),
      trust: await this.validateTrustSection(),
      navigation: await this.validateNavigation(),
      layout: await this.validateLayoutAndSpacing()
    };
    
    return results;
  }

  // Count total measurable properties
  getTotalProperties() {
    let count = 0;
    
    // Count selectors
    count += Object.keys(this.selectors).length;
    
    // Count style properties recursively
    const countStyleProps = (obj) => {
      let total = 0;
      for (const key in obj) {
        if (typeof obj[key] === 'object' && !obj[key].test) {
          total += countStyleProps(obj[key]);
        } else {
          total += 1;
        }
      }
      return total;
    };
    
    count += countStyleProps(this.expectedStyles);
    
    // Count content properties
    count += Object.keys(this.expectedContent).length;
    
    return count;
  }
}