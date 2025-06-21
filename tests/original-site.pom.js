// Page Object Model for Original Jace AI Site
export class OriginalJaceAISite {
  constructor(page) {
    this.page = page;
    this.url = 'https://zitrono.github.io/jace-ai-site/';
  }

  // Selectors
  selectors = {
    // Header
    header: 'header',
    logo: 'header svg',
    navLinks: 'header nav a',
    loginButton: 'a[href*="signin"]',
    
    // Hero Section
    heroTitle: 'h1',
    heroSubtitle: 'main p:first-of-type',
    heroCTAButton: 'main button:first-of-type',
    
    // Trust Indicators
    casaBadge: '.border-2',
    userCount: 'span',
    
    // Video Section
    videoContainer: '.bg-gradient-to-br',
    videoTitle: 'h3',
    
    // Company Logos
    companySection: 'div',
    
    // Features Section (if visible)
    featuresTitle: 'h2',
    featureCards: '.bg-gray-800.rounded-lg.p-8'
  };

  // Expected Styles - Comprehensive list
  expectedStyles = {
    // Typography Base
    typography: {
      bodyFont: {
        fontFamily: /Geist/,
        fontSize: '16px',
        lineHeight: '24px'
      }
    },
    
    // Hero Section
    hero: {
      title: {
        fontSize: '60px',
        fontWeight: '600',
        fontFamily: /Geist/,
        backgroundImage: /linear-gradient\(353deg/,
        letterSpacing: '-1.5px',
        lineHeight: '60px',
        // Gradient text effect
        color: 'rgba(0, 0, 0, 0)',
        webkitTextFillColor: 'rgba(0, 0, 0, 0)'
      },
      subtitle: {
        fontSize: '24px',
        fontWeight: '500',
        color: /rgba\(255, 246, 238/,
        lineHeight: '32px',
        fontFamily: /Geist/,
        marginTop: '16px'
      },
      ctaButton: {
        backgroundColor: /rgb\(255, 220, 97\)|rgb\(250, 204, 21\)/,
        color: /rgb\(41, 48, 69\)|rgb\(17, 24, 39\)/,
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '500',
        padding: '0px 24px',
        border: '1px solid rgba(255, 255, 255, 0.02)',
        boxShadow: /rgba\(0, 0, 0, 0\.1\) 0px 1px 3px/
      }
    },
    
    // Body and Layout
    body: {
      backgroundColor: 'rgb(40, 40, 40)',
      fontFamily: /Geist/
    },
    
    // Header
    header: {
      background: {
        backgroundColor: /transparent|rgba\(0, 0, 0, 0\)/
      },
      navLinks: {
        color: /rgb\(255, 255, 255\)|white|rgb\(0, 0, 0\)/,
        fontSize: '16px',
        fontWeight: '400',
        textDecoration: 'none'
      },
      logo: {
        fill: 'rgb(255, 255, 255)',
        width: '70px',
        height: '33.25px'
      }
    },
    
    // Buttons
    buttons: {
      secondary: {
        backgroundColor: 'rgb(65, 65, 65)',
        color: 'rgb(255, 246, 238)',
        borderRadius: '8px',
        padding: '0px 24px',
        fontWeight: '500',
        border: '1px solid rgba(255, 255, 255, 0.02)'
      }
    },
    
    // Badges/Pills
    badges: {
      casa: {
        backgroundColor: 'rgb(53, 53, 53)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '9999px',
        color: 'rgb(156, 163, 175)'
      }
    },
    
    // Video Section
    video: {
      container: {
        backgroundImage: /linear-gradient.*rgb\(59, 130, 246\).*rgb\(20, 184, 166\)/,
        borderRadius: '8px',
        aspectRatio: '16 / 9'
      }
    },
    
    // Trust Indicators
    trust: {
      avatarSize: '32px',
      avatarBorder: '2px solid rgb(31, 41, 55)',
      companyLogosOpacity: '0.8'
    },
    
    // Spacing
    spacing: {
      heroPaddingTop: '128px',
      sectionPadding: '24px 0px 8px 0px'
    },
    
    // Mobile Menu
    mobileMenu: {
      overlayBackground: 'rgb(17, 24, 39)',
      backdropBackground: 'rgba(0, 0, 0, 0.5)',
      maxWidth: '24rem'
    }
  };

  // Expected Content
  expectedContent = {
    heroTitle: 'Gain 2 Hours Daily with Jace',
    heroSubtitle: /Start your day with emails organized.*drafts ready.*daily brief/,
    ctaButtonText: 'Get Started for Free',
    casaBadgeText: 'CASA Tier 3',
    certifiedText: 'CERTIFIED',
    joinText: 'Join 1000+ enthusiasts',
    companyText: 'Built by engineers from',
    supportFeatures: ['24/7 support', 'Money-back guarantee', 'Privacy protection', 'Secure checkout'],
    navItems: ['Features', 'Company', 'Pricing', 'Blog']
  };

  // Navigation methods
  async navigate() {
    await this.page.goto(this.url, { waitUntil: 'networkidle0' });
  }

  // Get element methods
  async getHeroTitle() {
    return await this.page.$(this.selectors.heroTitle);
  }

  async getHeroSubtitle() {
    return await this.page.$(this.selectors.heroSubtitle);
  }

  async getCTAButton() {
    return await this.page.$(this.selectors.heroCTAButton);
  }

  // Style validation methods
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
        
        // Colors
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        webkitTextFillColor: styles.webkitTextFillColor,
        fill: styles.fill,
        
        // Box Model
        padding: styles.padding,
        margin: styles.margin,
        border: styles.border,
        borderRadius: styles.borderRadius,
        borderWidth: styles.borderWidth,
        borderColor: styles.borderColor,
        
        // Effects
        boxShadow: styles.boxShadow,
        opacity: styles.opacity,
        
        // Layout
        width: styles.width,
        height: styles.height,
        maxWidth: styles.maxWidth,
        aspectRatio: styles.aspectRatio,
        
        // Spacing
        marginTop: styles.marginTop,
        paddingTop: styles.paddingTop
      };
    }, selector);
  }

  // Content validation methods
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

  // Validation methods
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
      if (titleStyles.fontSize !== this.expectedStyles.hero.title.fontSize) {
        errors.push(`Title font size mismatch: ${titleStyles.fontSize}`);
      }
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
    const filteredLinks = navLinks.filter(link => 
      this.expectedContent.navItems.includes(link)
    );
    
    if (filteredLinks.length !== this.expectedContent.navItems.length) {
      errors.push(`Navigation items mismatch: found ${filteredLinks.join(', ')}`);
    }
    
    return errors;
  }

  // Main validation method
  async validateAll() {
    const results = {
      hero: await this.validateHeroSection(),
      support: await this.validateSupportSection(),
      company: await this.validateCompanySection(),
      trust: await this.validateTrustSection(),
      navigation: await this.validateNavigation()
    };
    
    return results;
  }
}