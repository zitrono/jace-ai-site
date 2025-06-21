# POM Extension Elements

## Background Colors and Sections
```javascript
// Main Background Colors
'body'
'.bg-[#282828]'  // Original dark gray
'.bg-[#0a0a0f]'  // Refactored deep blue/black
'main'
'.main-content'

// Section Backgrounds
'.hero-background'
'.features-background'
'.pricing-background'
'.bg-gradient-to-b'
'.from-[#0a0a0f]'
'.to-[#1a1a2e]'
```

## Hero Section Backgrounds
```javascript
'.hero'
'.hero-section'
'.hero-bg'
'.hero-gradient-bg'
'[style*="background-color: rgb(40, 40, 40)"]'  // Original
'[style*="background-color: #0a0a0f"]'  // Refactored
'.hero-gradient-overlay'
```

## Gradient Headers/Titles
```javascript
// Text Gradients
'.text-gradient'
'.gradient-text'
'.hero-title-gradient'
'.title-gradient'
'[class*="bg-clip-text"]'
'[class*="text-transparent"]'
'[class*="bg-gradient-to-r"]'
'h1[class*="gradient"]'
'h2[class*="gradient"]'
'.from-white'
'.to-gray-400'
'.from-blue-400'
'.to-purple-600'
```

## Feature Section Backgrounds
```javascript
// Features Background
'.features-bg'
'.features-section-bg'
'.bg-[#1a1a2e]'  // Refactored blue
'.bg-[#282828]'  // Original gray
'section:has(.features)'
'[style*="background: linear-gradient"]'

// Feature Card Backgrounds
'.feature-card-bg'
'.bg-[#2a2a3e]'  // Refactored card bg
'.bg-gradient-to-br'
'.from-purple-500/10'
'.to-blue-500/10'
```

## Pricing Section Backgrounds
```javascript
'.pricing-bg'
'.pricing-section-bg'
'.bg-gradient-radial'
'[class*="from-[#1a1a2e]"]'
'[class*="to-[#0a0a0f]"]'
```

## Video Section Gradients (Refactored)
```javascript
'.video-gradient'
'.video-bg-gradient'
'.bg-gradient-to-br'
'.from-blue-500'
'.to-green-500'
'[style*="background: linear-gradient(135deg"]'
'.video-overlay-gradient'
```

## Additional Background Elements
```javascript
// Gradient Overlays
'.gradient-overlay'
'.radial-gradient-overlay'
'[style*="radial-gradient"]'
'[style*="linear-gradient"]'
'.before\\:bg-gradient-to-r'
'.after\\:bg-gradient-to-b'

// Dark Theme Variations
'.dark-bg'
'.dark\\:bg-gray-900'
'.dark\\:bg-slate-900'
'[data-theme="dark"]'

// Blur and Effects
'.backdrop-blur'
'.bg-opacity-90'
'.bg-black/50'
'.bg-white/5'
```

## Badge and Button Gradients
```javascript
// Badge Gradients
'.badge-gradient'
'.save-hours-badge'
'.bg-gradient-to-r'
'.from-yellow-400'
'.to-orange-500'

// Button Gradients
'.button-gradient'
'.cta-gradient'
'.hover\\:bg-gradient-to-r'
'.active\\:bg-gradient-to-br'
```

## Section Dividers and Transitions
```javascript
'.section-divider'
'.gradient-divider'
'.border-gradient'
'.border-t'
'.border-gray-800'
'.border-slate-700'
'[class*="divide-"]'
```

## 1. Mobile Menu System
```javascript
// Mobile Menu Elements
'#mobile-menu'
'.mobile-menu-overlay'
'.mobile-menu-backdrop'
'.mobile-menu-close'
'button[aria-label="Close menu"]'
'.mobile-nav-drawer'
'.mobile-nav-links'
'.mobile-nav-item'
'nav.mobile-navigation'
'.md\\:hidden'
'.lg\\:hidden'
'button[aria-label="Open menu"]'
'.hamburger-menu'
'.menu-icon'
```

## 2. Interactive Elements
```javascript
// FAQ Accordions
'.faq-item'
'.faq-question'
'.faq-answer'
'.faq-toggle'
'button[aria-expanded]'
'.accordion-arrow'
'.rotate-180'
'[data-state="open"]'
'[data-state="closed"]'

// Pricing Toggle
'.pricing-toggle'
'.toggle-switch'
'input[type="checkbox"]'
'.toggle-yearly'
'.toggle-monthly'
'[aria-pressed="true"]'
'[aria-pressed="false"]'

// Hover States
':hover'
'.hover\\:scale-105'
'.hover\\:bg-opacity-80'
'.hover\\:text-white'
'.hover\\:shadow-lg'
'.group:hover'

// Transitions
'.transition-all'
'.transition-transform'
'.duration-200'
'.duration-300'
'.ease-in-out'
'.transform'
```

## 3. New/Different Content Elements
```javascript
// Features Section
'.feature-auto-drafts'
'.feature-rules-automation'
'.feature-smart-search'
'.save-hours-daily'
'[data-feature="auto-drafts"]'
'[data-feature="rules"]'
'[data-feature="search"]'

// Testimonials
'.testimonial-role'
'.user-subtitle'
'.testimonial-author[data-name="Swyx"]'
'.product-manager-stripe'

// Footer Links
'a[href="/affiliate"]'
'a[href="/feature-requests"]'
'a[href="/extension-policy"]'
'.footer-link'
```

## 4. Visual Elements
```javascript
// Hero Background Pattern
'.hero-pattern'
'svg.dots-pattern'
'.pattern-dots'
'[style*="background-image: url"]'

// Badge Elements
'.most-popular-badge'
'.badge'
'.pill'
'.tag'

// Icons
'svg'
'.icon'
'.checkmark-icon'
'.feature-icon svg'
'.social-icon'
'path[fill]'
'[aria-hidden="true"]'

// Support Feature Icons
'.support-icon'
'.colored-icon'
'.icon-check'
'.icon-email'
'.icon-chat'
```

## 5. Structural Elements
```javascript
// Section IDs
'#pricing'
'#features'
'#testimonials'
'#faq'
'#hero'

// Container Wrappers
'.container'
'.wrapper'
'.flex-container'
'.grid-container'
'.max-w-screen-xl'
'.mx-auto'

// Borders
'.border'
'.border-2'
'.border-gray-700'
'.border-opacity-20'
'.divide-y'

// Background Gradients
'.bg-gradient-to-r'
'.bg-gradient-to-br'
'.bg-gradient-radial'
'[style*="background-image: linear-gradient"]'
```

## 6. Form/Input Elements
```javascript
// Form Elements (if added)
'form'
'input[type="email"]'
'input[type="text"]'
'textarea'
'select'
'button[type="submit"]'
'.form-control'
'.input-group'
'label'
'.error-message'
'.success-message'
```

## 7. Meta/SEO Elements
```javascript
// Meta Tags
'meta[name="description"]'
'meta[property="og:title"]'
'meta[property="og:description"]'
'meta[property="og:image"]'
'meta[name="twitter:card"]'
'meta[name="twitter:title"]'
'link[rel="canonical"]'
'[data-seo]'
```

## 8. Accessibility Features
```javascript
// ARIA Attributes
'[aria-label]'
'[aria-hidden]'
'[aria-expanded]'
'[aria-controls]'
'[aria-describedby]'
'[role="navigation"]'
'[role="main"]'
'[role="button"]'

// Screen Reader Only
'.sr-only'
'.visually-hidden'
'.screen-reader-text'

// Focus States
':focus'
':focus-visible'
'.focus\\:outline-none'
'.focus\\:ring-2'
'.focus\\:ring-offset-2'
```

## 9. JavaScript Functionality
```javascript
// FAQ Toggle
'[onclick*="toggleFAQ"]'
'[data-faq-trigger]'
'[data-faq-content]'

// Mobile Menu Handlers
'[onclick*="openMobileMenu"]'
'[onclick*="closeMobileMenu"]'
'[data-menu-toggle]'

// Other Interactive JS
'[data-interactive]'
'[data-toggle]'
'[data-action]'
```

## 10. Responsive Variations
```javascript
// Mobile Classes
'.md\\:hidden'
'.lg\\:flex'
'.sm\\:grid-cols-1'
'.md\\:grid-cols-2'
'.lg\\:grid-cols-3'

// Breakpoint Styling
'.sm\\:text-2xl'
'.md\\:text-4xl'
'.lg\\:text-6xl'
'.sm\\:px-4'
'.md\\:px-8'
'.lg\\:px-16'

// Container Widths
'.max-w-sm'
'.md\\:max-w-md'
'.lg\\:max-w-lg'
'.xl\\:max-w-xl'
```