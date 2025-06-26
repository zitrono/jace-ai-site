/**
 * Site Configuration
 * Central configuration for site-wide settings and links
 */

export const siteConfig = {
  // Site metadata
  name: 'Ralph',
  tagline: 'AI-Native Private Equity Platform',
  description: 'AI agents transform your unstructured portfolio data into predictive intelligence, revealing opportunities weeks ahead.',
  
  // URLs
  baseUrl: 'https://zitrono.github.io',
  basePath: '/ralph-web',
  
  // Navigation links
  links: {
    // Primary CTA
    bookDemo: '/ralph-web/book-demo',
    
    // Navigation
    home: '/ralph-web',
    product: '/ralph-web/product', 
    pricing: '/ralph-web/pricing',
    learn: '/ralph-web/learn',
    about: '/ralph-web/about',
    
    // External
    github: 'https://github.com/zitrono/ralph-web',
  },
  
  // Contact
  contact: {
    email: 'Konstantin@beneficious.com',
    emailSubject: 'Ralph Demo Request',
    emailBody: 'Hello, I would like to schedule a demo of Ralph for my PE firm.',
  },
  
  // Demo booking
  demo: {
    url: '/ralph-web/book-demo',
    text: 'Book a Demo',
    duration: '30 minutes',
    calendarUrl: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ06HT0qrMIwj3pjMxbe1pOfWf5Vd-L0vnogrpNejuh35QzvZP1Ndas6oENqjlbfQIL822endVG7?gv=true',
  },
  
  // Private beta
  privateBeta: {
    launchDate: 'Q3 2025',
    isActive: false,
  },
  
  // Centralized button actions
  buttonActions: {
    bookDemo: {
      type: 'link' as const,
      href: '/ralph-web/book-demo',
    },
    login: {
      type: 'modal' as const,
      handler: 'openLoginModal()',
    },
    mobileLogin: {
      type: 'modal' as const,
      handler: 'openLoginModal(); closeMobileMenu();',
    },
  },
} as const;

// Type-safe link getter
export function getSiteLink(key: keyof typeof siteConfig.links): string {
  return siteConfig.links[key];
}

// Demo booking link helper
export function getDemoLink(): string {
  return siteConfig.demo.url;
}

// Contact mailto link helper
export function getContactMailto(): string {
  const { email, emailSubject, emailBody } = siteConfig.contact;
  return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
}

// Button action helper - returns props for Button/HeaderButton components
export function getButtonAction(action: keyof typeof siteConfig.buttonActions) {
  const config = siteConfig.buttonActions[action];
  
  if (config.type === 'link') {
    return { href: config.href };
  } else if (config.type === 'modal') {
    return { onclick: config.handler };
  }
  
  return {};
}