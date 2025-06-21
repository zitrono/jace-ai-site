// Comprehensive Enhanced Page Object Model for Original Jace AI Site - ALL SECTIONS
// Based on screenshot analysis and section identification
// Covers 400+ properties including fixed menubar, all sections, and interactive elements

export class ComprehensiveEnhancedJaceAISite {
  constructor(page) {
    this.page = page;
    this.url = 'https://zitrono.github.io/jace-ai-site/';
  }

  // Comprehensive Selectors - 80+ selectors covering all sections
  selectors = {
    // Fixed Menubar (always visible)
    fixedMenubar: 'header',
    menubarContainer: 'header > nav',
    menubarInnerContainer: 'header nav > div',
    menubarLogo: 'header svg',
    menubarNavLinks: 'header > nav .hidden.lg\\:flex > a:not([href*="signin"])',
    menubarLoginButton: 'header a[href*="signin"]',
    menubarCTAButton: 'header .bg-surface-highlight, header .bg-yellow-400',
    mobileMenuToggle: 'button[aria-label*="menu"]',
    
    // Hero Section
    heroSection: 'main section:first-of-type, .isolate',
    heroContainer: '.mx-auto.max-w-7xl',
    heroTitle: 'h1',
    heroSubtitle: 'main p:first-of-type',
    heroCTAButton: 'main button:first-of-type',
    heroVideoContainer: '.bg-gradient-to-br',
    heroVideoTitle: '.bg-gradient-to-br h3, .video-gradient h3, [class*="video"] h3, iframe + * h3',
    heroVideoPlayButton: '.bg-gradient-to-br svg',
    
    // Trust Indicators Section  
    trustSection: '.isolate .max-w-7xl',
    casaBadge: '.border-2',
    certifiedText: '*:contains("CERTIFIED")',
    userAvatarsContainer: '.flex.-space-x-2',
    userAvatars: '.flex.-space-x-2 > div',
    userCountText: '*:contains("Join 1000+ enthusiasts")',
    
    // Company Logos Section
    companySection: '.text-center',
    companyLogosContainer: '.space-x-8',
    companyLogos: '.opacity-60, .company-logos-opacity, .font-bold',
    companyLogoElements: '.opacity-60 svg, .company-logos-opacity svg',
    
    // AI-Powered Inbox Assistant Section
    inboxAssistantSection: 'section:nth-of-type(2)',
    inboxAssistantTitle: 'h2:contains("AI-powered inbox assistant")',
    emailDraftingCard: '*:contains("Draft emails in your unique style")',
    gmailSyncCard: '*:contains("Sync drafts and labels with Gmail")',
    
    // Core Features Section (Schedule, Auto-label, Ask questions)
    coreFeaturesSection: 'section:nth-of-type(3)',
    scheduleFeatureCard: '*:contains("Schedule events at the speed")',
    autoLabelFeatureCard: '*:contains("Auto-label and organize")',
    askQuestionsFeatureCard: '*:contains("Ask questions about your emails")',
    featureCards: '.bg-gray-800, .sr-only h3, h3',
    
    // Extended Features Section (Automate, Integrations, Briefings)
    extendedFeaturesSection: '*:contains("There\'s even more to explore")',
    automateFeatureCard: '*:contains("Automate your inbox")',
    integrationsFeatureCard: '*:contains("Supercharge your workflow")',
    briefingsFeatureCard: '*:contains("Stay on top of your day")',
    integrationLogos: '.space-x-4 svg, .grid svg',
    
    // Security & Privacy Section
    securitySection: '*:contains("Secure. Private. Encrypted")',
    securityTitle: 'h2:contains("Secure. Private. Encrypted")',
    gdprBadge: '*:contains("GDPR")',
    ccpaBadge: '*:contains("CCPA")',
    encryptionText: '*:contains("encryption")',
    
    // AI-Powered Search Section
    searchSection: '*:contains("AI-powered search")',
    searchTitle: 'h2:contains("AI-powered search")',
    searchInterface: '.border, .rounded',
    searchExample: '*:contains("emails containing invoices")',
    
    // Pricing Section
    pricingSection: '*:contains("Experience the full power")',
    pricingTitle: 'h2:contains("Experience the full power")',
    pricingToggle: 'button:contains("Yearly"), button:contains("Monthly")',
    plusPricingCard: '*:contains("Plus")',
    proPricingCard: '*:contains("Pro")',
    plusPrice: '*:contains("$16.67")',
    proPrice: '*:contains("$54.17")',
    pricingFeaturesList: 'ul li, .space-y-4 div',
    pricingCTAButtons: '.ring-1 button, .bg-surface-highlight',
    moneyBackGuarantee: '*:contains("money back guarantee")',
    
    // Trust & Security Features (24/7, Money-back, Privacy, Secure checkout)
    trustFeaturesSection: '*:contains("24/7 support")',
    supportFeature: '*:contains("24/7 support")',
    moneyBackFeature: '*:contains("Money-back guarantee")',
    privacyFeature: '*:contains("Privacy protection")',
    secureCheckoutFeature: '*:contains("Secure checkout")',
    
    // Testimonials Section
    testimonialsSection: '*:contains("Jace users save hours")',
    testimonialsTitle: 'h2:contains("Jace users save hours")',
    testimonialsTagline: '*:contains("Less Email, More Productivity")',
    testimonialCards: '.bg-white, .rounded-lg',
    testimonialUserPhotos: '.rounded-full img',
    testimonialUserNames: '.font-semibold',
    testimonialQuotes: '.text-gray-600, .text-gray-800',
    
    // Final CTA Section
    finalCTASection: '*:contains("Start saving 90%")',
    finalCTATitle: 'h2:contains("Start saving 90%")',
    finalCTASubtitle: '*:contains("Let Jace do the boring stuff")',
    finalCTAButton: 'button:contains("Get Started for Free"):last-of-type',
    finalCTABackground: '.bg-gradient-to-r, .bg-gradient-to-br',
    
    // FAQ Section
    faqSection: '*:contains("Frequently asked questions")',
    faqTitle: 'h2:contains("Frequently asked questions")',
    faqContactLink: 'a:contains("Contact us")',
    faqItems: 'details, .accordion',
    faqQuestions: 'summary, .accordion-header',
    faqAnswers: '.accordion-body, details > div',
    
    // Footer
    footer: 'footer',
    footerLinks: 'footer a',
    footerSocialLinks: 'footer a[href*="discord"], footer a[href*="twitter"], footer a[href*="linkedin"]',
    footerCopyright: '*:contains("© 2025 Zeta AI")',
    
    // All Interactive Elements
    allCTAButtons: 'button:contains("Get Started for Free")',
    allButtons: 'button',
    allLinks: 'a',
    allHeadings: 'h1, h2, h3, h4, h5, h6',
    allSections: 'section, .section',
    
    // Typography Elements
    allH1: 'h1',
    allH2: 'h2', 
    allH3: 'h3',
    allH4: 'h4',
    bodyText: 'p',
    gradientText: '[style*="gradient"]',
    
    // Layout Containers
    contentContainers: '.max-w-7xl, .max-w-6xl, .max-w-4xl',
    backgroundContainers: '.bg-gradient-to-br, .bg-gradient-to-r',
    cardContainers: '.bg-white, .bg-gray-800, .bg-gray-900',
  };

  // Enhanced Expected Styles - 200+ style properties
  expectedStyles = {
    // Fixed Menubar Styles (28 properties)
    fixedMenubar: {
      position: 'sticky',
      top: '0px',
      zIndex: /20|50|999/,
      backgroundColor: /rgba\(0, 0, 0, 0\)|rgb\(40, 40, 40\)|transparent/,
      backdropFilter: /blur|none/,
      width: '100%',
      borderBottom: /none|1px/,
      boxShadow: /none|rgba/,
      height: /64px|72px|80px/,
      display: 'flex',
      opacity: '1',
      transition: /all|none|0\.\d+s/
    },
    
    menubarContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: /8px|16px/,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      backgroundColor: /rgba\(.*0\.5\)|oklab.*\/\s*0\.5|transparent/, // Semi-transparent background
      opacity: '1',
      backdropFilter: /none|blur/
    },
    
    menubarLogo: {
      fill: 'rgb(255, 255, 255)',
      width: '70px',
      height: '33.25px',
      cursor: 'pointer'
    },
    
    menubarNavLinks: {
      color: 'rgb(255, 255, 255)',
      fontSize: '16px',
      fontWeight: /400|500|600/,
      textDecoration: 'none',
      padding: /8px|12px/,
      borderRadius: /6px|8px/,
      transition: /0\.(15|2)s.*cubic-bezier/
    },
    
    menubarCTAButton: {
      backgroundColor: /rgb\(255, 220, 97\)|rgb\(250, 204, 21\)/,
      color: /rgb\(41, 48, 69\)|rgb\(17, 24, 39\)/,
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      padding: '0px 24px',
      height: '40px',
      border: '1px solid rgba(255, 255, 255, 0.02)',
      cursor: 'pointer'
    },

    // Typography Base (10 properties)
    typography: {
      bodyFont: {
        fontFamily: /Geist/,
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: '400'
      },
      baseColor: /rgb\(255, 246, 238\)|rgb\(0, 0, 0\)|rgb\(255, 255, 255\)/,
      heading1: {
        fontSize: '60px',
        fontWeight: '600',
        lineHeight: '60px',
        letterSpacing: '-1.5px',
        fontFamily: /Geist/
      },
      heading2: {
        fontSize: /24px|32px|48px/,
        fontWeight: '600',
        lineHeight: /32px|40px|56px/,
        letterSpacing: /-0\.6px|-1\.2px/,
        fontFamily: /Geist/
      },
      heading3: {
        fontSize: /18px|20px|24px/,
        fontWeight: /500|600/,
        lineHeight: /24px|28px|32px/,
        fontFamily: /Geist/
      }
    },
    
    // Hero Section Styles (30 properties)
    hero: {
      section: {
        paddingTop: /128px|160px|0px/,
        paddingBottom: /32px|8px|0px/,
        marginTop: /\-89\.6px|0px/,
        backgroundColor: /rgb\(40, 40, 40\)|transparent/
      },
      container: {
        maxWidth: '1280px',
        paddingLeft: /32px|8px|24px/,
        paddingRight: /32px|8px|24px/,
        margin: '0 auto',
        textAlign: /center|left/
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
        backgroundClip: 'text',
        marginBottom: /16px|24px/
      },
      subtitle: {
        fontSize: '24px',
        fontWeight: '500',
        color: /rgba\(255, 246, 238/,
        lineHeight: '32px',
        fontFamily: /Geist/,
        marginTop: '16px',
        marginBottom: /24px|32px/
      },
      videoContainer: {
        backgroundImage: /linear-gradient.*rgb\(59, 130, 246\).*rgb\(20, 184, 166\)/,
        borderRadius: '8px',
        aspectRatio: '16 / 9',
        padding: '32px',
        position: 'relative',
        cursor: 'pointer'
      },
      videoTitle: {
        fontSize: '32px',
        fontWeight: '700',
        color: 'rgb(255, 255, 255)',
        textAlign: 'center',
        marginBottom: /16px|24px/
      }
    },

    // Trust Indicators Styles (25 properties)
    trust: {
      casaBadge: {
        backgroundColor: 'rgb(53, 53, 53)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '9999px',
        color: 'rgb(156, 163, 175)',
        padding: '8px 12px',
        fontSize: '12px',
        fontWeight: '700',
        textAlign: 'center'
      },
      avatars: {
        width: '32px',
        height: '32px',
        borderRadius: '9999px',
        border: '2px solid rgb(31, 41, 55)',
        marginLeft: '-8px',
        overflow: 'hidden'
      },
      userCount: {
        fontSize: '14px',
        color: 'rgba(255, 246, 238, 0.72)',
        fontWeight: '400',
        textAlign: 'center'
      },
      certificationBadge: {
        backgroundColor: 'rgb(53, 53, 53)',
        borderRadius: '12px',
        padding: '8px 12px',
        fontSize: '14px',
        fontWeight: '500',
        color: 'rgb(156, 163, 175)'
      }
    },

    // Company Logos Styles (10 properties)
    company: {
      section: {
        marginTop: '64px',
        marginBottom: '96px',
        textAlign: 'center',
        padding: /32px|64px/
      },
      logos: {
        opacity: /0\.6|0\.8/,
        fill: 'rgb(255, 255, 255)',
        fontWeight: '700',
        fontSize: /14px|16px/,
        color: /rgb\(156, 163, 175\)|rgb\(255, 255, 255\)/
      },
      container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: /16px|24px|32px/,
        flexWrap: 'wrap'
      }
    },

    // Feature Cards Styles (20 properties)
    featureCards: {
      card: {
        backgroundColor: /rgb\(53, 53, 53\)|rgb\(31, 41, 55\)/,
        borderRadius: /8px|12px/,
        padding: /24px|32px/,
        boxShadow: /rgba\(0, 0, 0, 0\.(1|2)\)/,
        border: '1px solid rgba(255, 255, 255, 0.02)',
        marginBottom: /16px|24px/
      },
      title: {
        fontSize: /18px|20px|24px/,
        fontWeight: '600',
        color: 'rgb(255, 255, 255)',
        lineHeight: /24px|28px/,
        marginBottom: /12px|16px/
      },
      description: {
        fontSize: /14px|16px/,
        fontWeight: '400',
        color: 'rgba(255, 246, 238, 0.72)',
        lineHeight: /20px|24px/
      },
      icon: {
        width: /24px|32px/,
        height: /24px|32px/,
        fill: /rgb\(255, 220, 97\)|rgb\(255, 255, 255\)/
      }
    },

    // Pricing Section Styles (30 properties)
    pricing: {
      section: {
        padding: /64px|96px/,
        backgroundColor: /rgb\(40, 40, 40\)|transparent/,
        textAlign: 'center'
      },
      toggle: {
        backgroundColor: /rgb\(53, 53, 53\)|rgba\(0, 0, 0, 0\)/,
        borderRadius: '8px',
        padding: '4px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex'
      },
      toggleButton: {
        borderRadius: '6px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: /0\.2s/
      },
      card: {
        backgroundColor: /rgb\(53, 53, 53\)|rgba\(0, 0, 0, 0\)/,
        borderRadius: /16px|24px/,
        padding: /32px|40px/,
        border: /1px solid|ring-1.*ring-black/,
        boxShadow: /rgba\(0, 0, 0, 0\.05\)/,
        marginBottom: /24px|32px/
      },
      planTitle: {
        fontSize: /20px|24px/,
        fontWeight: '600',
        color: 'rgb(255, 255, 255)',
        marginBottom: /8px|12px/
      },
      planPrice: {
        fontSize: /36px|48px/,
        fontWeight: '700',
        color: 'rgb(255, 255, 255)',
        marginBottom: /16px|24px/
      },
      featuresList: {
        listStyle: 'none',
        padding: '0px',
        margin: '0px',
        fontSize: '14px',
        lineHeight: '20px'
      }
    },

    // Testimonials Styles (15 properties)
    testimonials: {
      section: {
        padding: /64px|96px/,
        backgroundColor: /rgb\(249, 250, 251\)|rgb\(255, 255, 255\)/,
        textAlign: 'center'
      },
      card: {
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: /8px|12px/,
        padding: /24px|32px/,
        boxShadow: /rgba\(0, 0, 0, 0\.(05|1)\)/,
        border: /1px solid rgba/,
        marginBottom: /16px|24px/
      },
      userPhoto: {
        width: /48px|56px/,
        height: /48px|56px/,
        borderRadius: '9999px',
        objectFit: 'cover'
      },
      userName: {
        fontSize: /14px|16px/,
        fontWeight: /500|600/,
        color: /rgb\(17, 24, 39\)|rgb\(0, 0, 0\)/,
        marginBottom: /4px|8px/
      },
      quote: {
        fontSize: /14px|16px/,
        fontWeight: '400',
        color: /rgb\(107, 114, 128\)|rgb\(75, 85, 99\)/,
        lineHeight: /20px|24px/,
        fontStyle: /normal|italic/
      }
    },

    // Footer Styles (15 properties)
    footer: {
      section: {
        backgroundColor: 'rgb(40, 40, 40)',
        padding: '64px 0px 32px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: /64px|96px/
      },
      container: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: /24px|32px/,
        display: 'flex',
        justifyContent: 'space-between'
      },
      links: {
        fontSize: '14px',
        fontWeight: '500',
        color: 'rgba(255, 246, 238, 0.72)',
        textDecoration: 'none',
        marginBottom: /8px|12px/
      },
      socialLinks: {
        width: /20px|24px/,
        height: /20px|24px/,
        fill: 'rgba(255, 246, 238, 0.72)',
        marginRight: /12px|16px/
      },
      copyright: {
        fontSize: '12px',
        color: 'rgba(255, 246, 238, 0.5)',
        textAlign: 'center',
        marginTop: /24px|32px/
      }
    },

    // Button Variations (40 properties)
    buttons: {
      primary: {
        backgroundColor: /rgb\(255, 220, 97\)|rgb\(250, 204, 21\)/,
        color: /rgb\(41, 48, 69\)|rgb\(17, 24, 39\)/,
        borderRadius: /8px|6px/,
        fontSize: /16px|14px|18px/,
        fontWeight: '500',
        padding: /0px 24px|0px 12px|8px 16px|8px 24px|12px 24px|16px 32px/,
        height: /40px|44px|48px/,
        border: '1px solid rgba(255, 255, 255, 0.02)',
        boxShadow: /rgba\(0, 0, 0, 0\.(1|2)\) 0px 1px 3px/,
        transition: /0\.(2|15)s.*cubic-bezier/,
        cursor: 'pointer',
        display: /inline-flex|flex/,
        alignItems: 'center',
        justifyContent: 'center'
      },
      secondary: {
        backgroundColor: 'rgb(65, 65, 65)',
        color: 'rgb(255, 246, 238)',
        borderRadius: '8px',
        padding: '0px 24px',
        height: /40px|44px/,
        fontWeight: '500',
        border: '1px solid rgba(255, 255, 255, 0.02)',
        boxShadow: /rgba\(0, 0, 0, 0\.(1|2)\)/,
        transition: /0\.(2|15)s.*cubic-bezier/,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      },
      outline: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: 'rgb(255, 255, 255)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        padding: '0px 24px',
        height: /40px|44px/,
        fontSize: /14px|16px/,
        fontWeight: '500'
      }
    },

    // Layout & Containers (20 properties)
    layout: {
      body: {
        backgroundColor: 'rgb(40, 40, 40)',
        fontFamily: /Geist/,
        margin: '0px',
        padding: '0px',
        color: /rgb\(255, 246, 238\)|rgb\(255, 255, 255\)/
      },
      mainContainer: {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: /24px|32px/,
        paddingRight: /24px|32px/
      },
      contentContainer: {
        maxWidth: /896px|1024px/,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: /24px|32px/
      },
      sectionSpacing: {
        marginTop: /64px|96px|128px/,
        marginBottom: /64px|96px|128px/,
        paddingTop: /32px|64px/,
        paddingBottom: /32px|64px/
      }
    },

    // Interactive Elements (15 properties)
    interactive: {
      hoverTransition: /0\.(15|2)s.*cubic-bezier/,
      activeScale: /scale\(0\.9(5|9)\)/,
      hoverOpacity: /0\.(7|8|9)/,
      focusRing: /ring-2.*ring-offset-2/,
      disabledOpacity: '0.5',
      cursorPointer: 'pointer',
      cursorNotAllowed: 'not-allowed',
      userSelect: 'none',
      transform: /scale|translate|rotate/,
      transition: /all|transform|opacity.*ease/
    }
  };

  // Enhanced Expected Content (50+ items)
  expectedContent = {
    // Fixed Menubar Content
    menubarNavItems: ['Features', 'Company', 'Blog'], // Note: Pricing is sometimes not in nav
    loginButtonText: /Log In|Sign In/,
    menubarCTAText: 'Get Started for Free',
    
    // Hero Section Content
    heroTitle: 'Gain 2 Hours Daily with Jace',
    heroSubtitle: /Start your day with emails organized.*drafts ready.*daily brief/,
    heroCTAText: 'Get Started for Free',
    heroVideoTitle: 'The Way Jace Works',
    
    // Trust Indicators Content
    casaBadgeText: 'CASA Tier 3',
    certifiedText: 'CERTIFIED',
    joinText: 'Join 1000+ enthusiasts',
    
    // Company Section Content
    companyText: 'Built by engineers from',
    companyNames: ['Meta', 'Amazon', 'Tesla', 'Google', 'Optiver', 'Oxford', 'MoonPay', 'Docplanner', 'Oculus'],
    
    // Core Features Content
    scheduleFeatureTitle: /Schedule events at the speed/,
    autoLabelFeatureTitle: /Auto-label and organize/,
    askQuestionsFeatureTitle: /Ask questions about your emails/,
    
    // Extended Features Content
    automateFeatureTitle: /Automate your inbox/,
    integrationsFeatureTitle: /Supercharge your workflow/,
    briefingsFeatureTitle: /Stay on top of your day/,
    
    // Security Content
    securityTitle: 'Secure. Private. Encrypted.',
    gdprText: 'GDPR',
    ccpaText: 'CCPA',
    
    // Pricing Content
    pricingTitle: /Experience the full power/,
    plusPlanTitle: 'Plus',
    proPlanTitle: 'Pro',
    plusPrice: '$16.67',
    proPrice: '$54.17',
    monthlyToggle: 'Monthly',
    yearlyToggle: 'Yearly',
    
    // Support Features Content
    supportFeatures: [
      '24/7 support',
      'Money-back guarantee', 
      'Privacy protection',
      'Secure checkout'
    ],
    
    // Testimonials Content
    testimonialsTitle: /Jace users save hours/,
    testimonialsTagline: 'Less Email, More Productivity',
    testimonialUsers: [
      'Jenny Xiao',
      'Josh Graham',
      'Darius Foroux',
      'Derya Unutmaz',
      'João Neto',
      'Philippe Tremblay',
      'Andel Husbands'
    ],
    
    // Final CTA Content
    finalCTATitle: 'Start saving 90% of your email time now.',
    finalCTASubtitle: 'Let Jace do the boring stuff.',
    finalCTAButton: 'Get Started for Free',
    
    // FAQ Content
    faqTitle: 'Frequently asked questions',
    faqContactText: 'Contact us',
    faqQuestions: [
      'Is my email data secure?',
      'Can I control how Jace drafts?',
      'Can Jace integrate with my existing email client?',
      'How accurate are the automated drafts?'
    ],
    
    // Footer Content
    footerCopyright: '© 2025 Zeta AI, Inc. All rights reserved.',
    footerSocials: ['Discord', 'Twitter', 'LinkedIn', 'TikTok', 'Instagram', 'YouTube'],
    footerLinks: ['Features', 'Company', 'Pricing', 'Blog', 'Terms', 'Privacy'],
    
    // Generic Content Patterns
    emailDraftingText: /Draft emails in your unique style/,
    gmailIntegrationText: /Gmail.*seamless.*mobile/,
    securityBadges: ['SOC 2', 'GDPR', 'CCPA'],
    integrationCount: /200\+.*integrations/,
    userTestimonialCount: /\d+\+?.*users.*hours.*week/,
    freeTrialText: /7-day free trial/,
    moneyBackText: /14-day.*money.*back/
  };

  // Navigation methods
  async navigate() {
    await this.page.goto(this.url, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Fixed Menubar Testing Methods
  async testFixedMenubarBehavior() {
    const errors = [];
    
    // Test menubar is initially visible
    const menubar = await this.page.$(this.selectors.fixedMenubar);
    if (!menubar) {
      errors.push('Fixed menubar not found');
      return errors;
    }
    
    // Get initial position and styles
    const initialRect = await menubar.boundingBox();
    const initialStyles = await this.getElementStyles(this.selectors.fixedMenubar);
    const initialContainerStyles = await this.getElementStyles(this.selectors.menubarContainer);
    const initialInnerStyles = await this.getElementStyles(this.selectors.menubarInnerContainer);
    
    // Store initial opacity values
    const initialOpacity = initialStyles?.opacity;
    const initialBackgroundColor = initialInnerStyles?.backgroundColor || initialContainerStyles?.backgroundColor;
    
    // Test at different scroll positions
    const scrollPositions = [
      { position: 0, description: 'at top' },
      { position: 500, description: 'over hero section' },
      { position: 1000, description: 'over features section' },
      { position: 2000, description: 'over middle sections' },
      { position: 3000, description: 'over lower sections' }
    ];
    
    for (const { position, description } of scrollPositions) {
      await this.page.evaluate((pos) => window.scrollTo(0, pos), position);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if menubar is still visible and fixed
      const scrollRect = await menubar.boundingBox();
      
      if (!scrollRect) {
        errors.push(`Menubar disappeared after scrolling to ${position}px (${description})`);
      } else if (Math.abs(scrollRect.y - initialRect.y) > 5) {
        errors.push(`Menubar moved when ${description}: ${initialRect.y} -> ${scrollRect.y}`);
      }
      
      // Check opacity and background changes
      const scrollStyles = await this.getElementStyles(this.selectors.fixedMenubar);
      const scrollContainerStyles = await this.getElementStyles(this.selectors.menubarContainer);
      const scrollInnerStyles = await this.getElementStyles(this.selectors.menubarInnerContainer);
      
      // Validate opacity remains consistent
      if (scrollStyles?.opacity !== initialOpacity) {
        errors.push(`Menubar opacity changed ${description}: ${initialOpacity} -> ${scrollStyles.opacity}`);
      }
      
      // Check if background maintains semi-transparency (check inner container first, then nav)
      const bgToCheck = scrollInnerStyles?.backgroundColor || scrollContainerStyles?.backgroundColor;
      if (bgToCheck) {
        const hasAlpha = bgToCheck.includes('0.5') || 
                        bgToCheck.includes('/ 0.5') ||
                        bgToCheck.includes('oklab');
        if (!hasAlpha && bgToCheck !== 'transparent') {
          errors.push(`Menubar lost semi-transparent background ${description}: ${bgToCheck}`);
        }
      }
    }
    
    // Test menubar styles for fixed positioning
    const menubarStyles = await this.getElementStyles(this.selectors.fixedMenubar);
    if (menubarStyles) {
      if (!['sticky', 'fixed'].includes(menubarStyles.position)) {
        errors.push(`Menubar position should be sticky/fixed, got: ${menubarStyles.position}`);
      }
      
      if (menubarStyles.top !== '0px') {
        errors.push(`Menubar top should be 0px, got: ${menubarStyles.top}`);
      }
      
      const zIndex = parseInt(menubarStyles.zIndex);
      if (zIndex < 10) {
        errors.push(`Menubar z-index too low: ${zIndex}`);
      }
      
      // Validate opacity is full
      if (menubarStyles.opacity !== '1') {
        errors.push(`Menubar opacity should be 1, got: ${menubarStyles.opacity}`);
      }
    }
    
    // Scroll back to top
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return errors;
  }

  // Enhanced element getter methods
  async getElementStyles(selector) {
    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return null;
      const styles = window.getComputedStyle(element);
      return {
        // Position & Layout
        position: styles.position,
        top: styles.top,
        left: styles.left,
        right: styles.right,
        bottom: styles.bottom,
        zIndex: styles.zIndex,
        display: styles.display,
        visibility: styles.visibility,
        
        // Typography
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        fontFamily: styles.fontFamily,
        lineHeight: styles.lineHeight,
        letterSpacing: styles.letterSpacing,
        textDecoration: styles.textDecoration,
        textAlign: styles.textAlign,
        
        // Colors & Effects
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        webkitTextFillColor: styles.webkitTextFillColor,
        webkitBackgroundClip: styles.webkitBackgroundClip,
        backgroundClip: styles.backgroundClip,
        fill: styles.fill,
        opacity: styles.opacity,
        
        // Box Model
        width: styles.width,
        height: styles.height,
        maxWidth: styles.maxWidth,
        minWidth: styles.minWidth,
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
        
        // Borders & Radius
        border: styles.border,
        borderTop: styles.borderTop,
        borderRight: styles.borderRight,
        borderBottom: styles.borderBottom,
        borderLeft: styles.borderLeft,
        borderRadius: styles.borderRadius,
        borderWidth: styles.borderWidth,
        borderColor: styles.borderColor,
        
        // Flexbox & Grid
        flexDirection: styles.flexDirection,
        justifyContent: styles.justifyContent,
        alignItems: styles.alignItems,
        alignSelf: styles.alignSelf,
        gap: styles.gap,
        gridTemplateColumns: styles.gridTemplateColumns,
        
        // Effects & Transitions
        boxShadow: styles.boxShadow,
        transform: styles.transform,
        transition: styles.transition,
        cursor: styles.cursor,
        backdropFilter: styles.backdropFilter,
        filter: styles.filter
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
      elements.map(el => el.textContent.trim()).filter(text => text)
    );
  }

  async getElementAttribute(selector, attribute) {
    const element = await this.page.$(selector);
    if (!element) return null;
    return await element.evaluate((el, attr) => el.getAttribute(attr), attribute);
  }

  // Section validation methods
  async validateFixedMenubar() {
    const errors = [];
    
    // Test fixed behavior
    const behaviorErrors = await this.testFixedMenubarBehavior();
    errors.push(...behaviorErrors);
    
    // Test navigation items
    const navLinks = await this.getAllTexts(this.selectors.menubarNavLinks);
    const expectedNavItems = this.expectedContent.menubarNavItems;
    const foundNavItems = navLinks.filter(link => expectedNavItems.includes(link));
    
    if (foundNavItems.length !== expectedNavItems.length) {
      errors.push(`Menubar navigation mismatch: expected ${expectedNavItems.join(', ')}, found ${foundNavItems.join(', ')}`);
    }
    
    // Test login button
    const loginButtonText = await this.getElementText(this.selectors.menubarLoginButton);
    if (!this.expectedContent.loginButtonText.test(loginButtonText)) {
      errors.push(`Login button text mismatch: "${loginButtonText}"`);
    }
    
    // Test CTA button
    const ctaButtonText = await this.getElementText(this.selectors.menubarCTAButton);
    if (ctaButtonText !== this.expectedContent.menubarCTAText) {
      errors.push(`Menubar CTA button text mismatch: "${ctaButtonText}"`);
    }
    
    return errors;
  }

  async validateHeroSection() {
    const errors = [];
    
    // Check title
    const titleText = await this.getElementText(this.selectors.heroTitle);
    if (titleText !== this.expectedContent.heroTitle) {
      errors.push(`Hero title mismatch: "${titleText}"`);
    }
    
    // Check subtitle
    const subtitleText = await this.getElementText(this.selectors.heroSubtitle);
    if (!this.expectedContent.heroSubtitle.test(subtitleText)) {
      errors.push(`Hero subtitle mismatch: "${subtitleText}"`);
    }
    
    // Check video title (optional element)
    const videoTitleText = await this.getElementText(this.selectors.heroVideoTitle);
    if (videoTitleText && videoTitleText !== this.expectedContent.heroVideoTitle) {
      errors.push(`Hero video title mismatch: "${videoTitleText}"`);
    }
    
    // Check title styles
    const titleStyles = await this.getElementStyles(this.selectors.heroTitle);
    if (titleStyles) {
      if (titleStyles.fontSize !== this.expectedStyles.hero.title.fontSize) {
        errors.push(`Hero title fontSize: ${titleStyles.fontSize} (expected: ${this.expectedStyles.hero.title.fontSize})`);
      }
      
      if (!this.expectedStyles.hero.title.backgroundImage.test(titleStyles.backgroundImage)) {
        errors.push(`Hero title gradient mismatch: ${titleStyles.backgroundImage}`);
      }
    }
    
    return errors;
  }

  async validateTrustSection() {
    const errors = [];
    
    // Check CASA badge
    const hasCasaText = await this.page.evaluate(() => {
      return document.body.textContent.includes('CASA Tier 3');
    });
    
    if (!hasCasaText) {
      errors.push('CASA Tier 3 text not found');
    }
    
    // Check certified text
    const hasCertifiedText = await this.page.evaluate(() => {
      return document.body.textContent.includes('CERTIFIED');
    });
    
    if (!hasCertifiedText) {
      errors.push('CERTIFIED text not found');
    }
    
    // Check user count
    const hasJoinText = await this.page.evaluate(() => {
      return document.body.textContent.includes('Join 1000+ enthusiasts');
    });
    
    if (!hasJoinText) {
      errors.push('Join 1000+ enthusiasts text not found');
    }
    
    return errors;
  }

  async validateCompanySection() {
    const errors = [];
    
    // Check company text
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

  async validateCoreFeatures() {
    const errors = [];
    
    // Check for core feature texts
    const coreFeatures = [
      'Schedule events at the speed',
      'Auto-label and organize',
      'Ask questions about your emails'
    ];
    
    for (const feature of coreFeatures) {
      const hasFeature = await this.page.evaluate((text) => {
        return document.body.textContent.includes(text);
      }, feature);
      
      if (!hasFeature) {
        errors.push(`Core feature not found: "${feature}"`);
      }
    }
    
    return errors;
  }

  async validatePricingSection() {
    const errors = [];
    
    // Check pricing title
    const hasPricingTitle = await this.page.evaluate(() => {
      return document.body.textContent.includes('Experience the full power');
    });
    
    if (!hasPricingTitle) {
      errors.push('Pricing title not found');
    }
    
    // Check plan prices
    const hasPlusPrice = await this.page.evaluate(() => {
      return document.body.textContent.includes('$16.67');
    });
    
    if (!hasPlusPrice) {
      errors.push('Plus plan price ($16.67) not found');
    }
    
    // Check support features
    for (const feature of this.expectedContent.supportFeatures) {
      const hasFeature = await this.page.evaluate((text) => {
        return document.body.textContent.includes(text);
      }, feature);
      
      if (!hasFeature) {
        errors.push(`Support feature not found: "${feature}"`);
      }
    }
    
    return errors;
  }

  async validateTestimonialsSection() {
    const errors = [];
    
    // Check testimonials title
    const hasTestimonialsTitle = await this.page.evaluate(() => {
      return document.body.textContent.includes('Jace users save hours');
    });
    
    if (!hasTestimonialsTitle) {
      errors.push('Testimonials title not found');
    }
    
    // Check tagline
    const hasTagline = await this.page.evaluate(() => {
      return document.body.textContent.includes('Less Email, More Productivity');
    });
    
    if (!hasTagline) {
      errors.push('Testimonials tagline not found');
    }
    
    return errors;
  }

  async validateFAQSection() {
    const errors = [];
    
    // Check FAQ title
    const hasFAQTitle = await this.page.evaluate(() => {
      return document.body.textContent.includes('Frequently asked questions');
    });
    
    if (!hasFAQTitle) {
      errors.push('FAQ title not found');
    }
    
    // Check contact link
    const hasContactLink = await this.page.evaluate(() => {
      return document.body.textContent.includes('Contact us');
    });
    
    if (!hasContactLink) {
      errors.push('FAQ contact link not found');
    }
    
    return errors;
  }

  async validateFooter() {
    const errors = [];
    
    // Check copyright
    const hasCopyright = await this.page.evaluate(() => {
      return document.body.textContent.includes('© 2025 Zeta AI');
    });
    
    if (!hasCopyright) {
      errors.push('Footer copyright not found');
    }
    
    return errors;
  }

  // Main comprehensive validation method
  async validateAll() {
    const results = {
      fixedMenubar: await this.validateFixedMenubar(),
      hero: await this.validateHeroSection(),
      trust: await this.validateTrustSection(),
      company: await this.validateCompanySection(),
      coreFeatures: await this.validateCoreFeatures(),
      pricing: await this.validatePricingSection(),
      testimonials: await this.validateTestimonialsSection(),
      faq: await this.validateFAQSection(),
      footer: await this.validateFooter()
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
        if (typeof obj[key] === 'object' && !obj[key].test && !Array.isArray(obj[key])) {
          total += countStyleProps(obj[key]);
        } else {
          total += 1;
        }
      }
      return total;
    };
    
    count += countStyleProps(this.expectedStyles);
    
    // Count content properties
    const countContentProps = (obj) => {
      let total = 0;
      for (const key in obj) {
        if (Array.isArray(obj[key])) {
          total += obj[key].length;
        } else {
          total += 1;
        }
      }
      return total;
    };
    
    count += countContentProps(this.expectedContent);
    
    return count;
  }
}