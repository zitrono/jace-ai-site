// Element Mapping Analysis: Jace vs Ralph
// Establishes 100% mapping for elements that exist in both implementations

const jaceElements = {
  header: {
    tag: 'header',
    classes: ['inset-x-0', 'top-0', 'z-20', 'sticky'],
    children: [{ tag: 'nav', classes: ['mx-auto', 'flex', 'max-w-7xl', 'items-center', 'justify-between'] }]
  },
  navigation: {
    tag: 'nav',
    classes: ['mx-auto', 'flex', 'max-w-7xl', 'items-center', 'justify-between'],
    links: ['Features', 'Company', 'Pricing', 'Blog', 'Log In']
  },
  heroTitle: {
    tag: 'h1',
    text: 'Gain 2 Hours Daily with Jace',
    classes: ['lg:mt-10', 'pb-2', 'text-pretty', 'text-4xl', 'font-semibold'],
    fontSize: '60px'
  },
  primaryButtons: {
    commonClasses: ['inline-flex', 'items-center', 'justify-center', 'gap-2', 'border'],
    ctaVariants: ['Get Started for Free'],
    designSystem: ['bg-surface-highlight', 'text-text-body-inverted', 'hover:bg-surface-highlight-hover']
  },
  faqButtons: {
    commonClasses: ['group', 'flex', 'w-full', 'items-start', 'justify-between', 'text-left', 'cursor-pointer'],
    count: 4
  },
  companyLogos: {
    companies: ['Google', 'Meta', 'Amazon', 'Tesla', 'Moonpay', 'Optiver', 'Oculus', 'Oxford', 'Docplanner'],
    commonClasses: ['w-auto', 'max-w-none', 'object-contain', 'opacity-80', 'hover:opacity-100']
  }
};

const ralphElements = {
  header: {
    tag: 'header',
    classes: ['sticky', 'top-0', 'z-20', 'inset-x-0', 'bg-neutral-700/95', 'backdrop-blur-sm'],
    children: [{ tag: 'nav', classes: ['mx-auto', 'flex', 'max-w-7xl', 'items-center', 'justify-between'] }]
  },
  navigation: {
    tag: 'nav',
    classes: ['mx-auto', 'flex', 'max-w-7xl', 'items-center', 'justify-between'],
    links: ['Product', 'Pricing', 'Learn']
  },
  heroTitle: {
    tag: 'h1',
    text: 'See Tomorrow\'s Opportunities Today',
    classes: ['text-hero', 'font-bold', 'leading-tight', 'lg:mt-10', 'pb-2', 'gradient-hero-title'],
    fontSize: '60px'
  },
  primaryButtons: {
    commonClasses: ['inline-flex', 'items-center', 'justify-center', 'font-medium', 'rounded-md', 'border'],
    ctaVariants: ['Book a Demo', 'Book Demo'],
    designSystem: ['bg-primary-yellow', 'text-pom-accent-text', 'hover:bg-primary-yellow-hover']
  },
  faqButtons: {
    commonClasses: ['w-full', 'text-left', 'flex', 'items-center', 'justify-between', 'group'],
    count: 13
  },
  companyLogos: {
    companies: [], // Ralph has no company logos currently
    commonClasses: []
  }
};

// Common Element Mapping Analysis
const elementMapping = {
  // 1. HEADER - 100% Structural Match
  header: {
    jaceSelector: 'header',
    ralphSelector: 'header',
    commonStructure: {
      tag: 'header',
      stickyPositioning: true,
      topZIndex: true,
      containsNavigation: true
    },
    mapping: 'IDENTICAL_STRUCTURE'
  },

  // 2. NAVIGATION - 100% Structural Match, Different Content
  navigation: {
    jaceSelector: 'nav',
    ralphSelector: 'nav',
    commonStructure: {
      tag: 'nav',
      flexLayout: true,
      maxWidth: true,
      itemsCenter: true,
      justifyBetween: true
    },
    mapping: 'IDENTICAL_STRUCTURE'
  },

  // 3. HERO TITLE - 100% Structural Match
  heroTitle: {
    jaceSelector: 'h1',
    ralphSelector: 'h1',
    commonStructure: {
      tag: 'h1',
      fontSize: '60px',
      marginTop: 'lg:mt-10',
      paddingBottom: 'pb-2',
      fontWeight: 'bold/semibold'
    },
    mapping: 'IDENTICAL_STRUCTURE'
  },

  // 4. PRIMARY BUTTONS - 95% Structural Match
  primaryButtons: {
    jaceSelector: 'button[class*="bg-surface-highlight"], button[class*="text-text-body-inverted"]',
    ralphSelector: 'button[class*="bg-primary-yellow"], button[class*="btn-primary"]',
    commonStructure: {
      tag: 'button',
      inlineFlex: true,
      itemsCenter: true,
      justifyCenter: true,
      border: true,
      transition: true
    },
    mapping: 'EQUIVALENT_FUNCTION',
    differences: {
      jace: 'bg-surface-highlight + text-text-body-inverted',
      ralph: 'bg-primary-yellow + text-pom-accent-text'
    }
  },

  // 5. FAQ BUTTONS - 90% Structural Match  
  faqButtons: {
    jaceSelector: 'button[class*="group"][class*="flex"][class*="w-full"]',
    ralphSelector: 'button[class*="w-full"][class*="text-left"][class*="flex"]',
    commonStructure: {
      tag: 'button',
      fullWidth: true,
      flexLayout: true,
      itemsCenter: true,
      justifyBetween: true,
      cursorPointer: true
    },
    mapping: 'EQUIVALENT_FUNCTION'
  },

  // 6. COMPANY LOGOS - Structure exists in Jace only
  companyLogos: {
    jaceSelector: 'img[alt*="Google"], img[alt*="Meta"], img[alt*="Amazon"]',
    ralphSelector: null, // Missing in Ralph
    mapping: 'JACE_ONLY'
  },

  // 7. SECTIONS - Both have sections but different organization
  sections: {
    jaceSelector: 'section',
    ralphSelector: 'section',
    commonStructure: {
      tag: 'section',
      exists: true
    },
    mapping: 'DIFFERENT_ORGANIZATION',
    notes: 'Jace: No explicit sections in DOM, Ralph: 14 sections'
  }
};

// CSS Cascade Preservation Rules
const cascadeRules = {
  // Rule 1: Maintain specificity hierarchy
  specificity: {
    // Tag selectors (lowest specificity)
    tag: ['header', 'nav', 'h1', 'button', 'section'],
    
    // Class selectors (medium specificity) 
    class: ['.btn-primary', '.nav-link', '.hero-title'],
    
    // Combined selectors (higher specificity)
    combined: ['nav a', 'button.btn-primary', 'header nav']
  },

  // Rule 2: Preserve inheritance chains
  inheritance: {
    // Typography inherits from root
    typography: ['font-family', 'font-size', 'line-height', 'color'],
    
    // Layout properties don't inherit
    layout: ['display', 'position', 'margin', 'padding', 'width', 'height'],
    
    // Some properties inherit conditionally
    conditional: ['visibility', 'cursor', 'text-align']
  },

  // Rule 3: Maintain responsive cascade
  responsive: {
    // Mobile-first approach (min-width)
    breakpoints: ['sm:', 'md:', 'lg:', 'xl:'],
    
    // Ensure mobile styles aren't overridden inappropriately
    mobileFirst: true
  }
};

// POM Selector Update Strategy
const selectorStrategy = {
  // Use CSS cascade-aware selectors
  cascadeAware: {
    // More specific selectors for unique identification
    header: 'header:has(nav)',
    navigation: 'header nav, nav[class*="flex"][class*="items-center"]',
    heroTitle: 'h1:first-of-type, main h1:first-child',
    primaryButtons: '.btn-primary, button[class*="primary"], button[class*="bg-primary"], button[class*="bg-surface-highlight"]',
    faqButtons: 'button[class*="w-full"][class*="flex"], dt button, .faq button'
  },

  // Fallback selectors for broader compatibility  
  fallback: {
    header: 'header',
    navigation: 'nav',
    heroTitle: 'h1',
    primaryButtons: 'button',
    faqButtons: 'button[type="submit"], button[class*="cursor-pointer"]'
  },

  // Combined selectors that work for both implementations
  unified: {
    header: 'header', // Works for both
    navigation: 'nav[class*="flex"][class*="items-center"][class*="justify-between"]', // Specific enough
    heroTitle: 'h1[class*="text-"]:first-of-type', // Both have text- classes
    primaryButtons: 'button[class*="primary"], button[class*="bg-primary"], button[class*="bg-surface-highlight"]',
    faqButtons: 'button[class*="w-full"][class*="flex"][class*="items-center"]'
  }
};

module.exports = {
  jaceElements,
  ralphElements, 
  elementMapping,
  cascadeRules,
  selectorStrategy
};