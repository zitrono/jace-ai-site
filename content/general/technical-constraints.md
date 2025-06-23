# Ralph Website Technical Constraints

**Version**: 1.0  
**Last Updated**: 2025-01-23  
**Purpose**: Immutable technical requirements that all content must respect

## Platform Architecture

### Build System
- **Framework**: Astro.js with Tailwind CSS
- **Output**: Static site to `/docs` folder  
- **Deployment**: GitHub Pages at `/ralph-web/`
- **Base URL**: https://zitrono.github.io/ralph-web/
- **Development Server**: http://localhost:4321/ralph-web/

### File Structure
```
/src/
├── components/
├── layouts/
├── pages/
└── styles/

/docs/ (build output)
/tests/ (POM validation)
```

## Template Constraints (Absolute Limits)

### Navigation Constraints
- **Maximum items**: 4 navigation items + 1 CTA button
- **Character limits**:
  - Navigation item: 8 characters maximum
  - CTA button: 4 words maximum
- **Structure**: Item1 | Item2 | Item3 | Item4 | [CTA Button]

### Typography Constraints
- **Hero headline**: 8-12 words maximum
- **Section headings**: 2-4 words maximum  
- **Feature descriptions**: 20-30 words maximum
- **Body text**: 16px/24px line-height
- **Font family**: Geist with Inter fallback

### Layout Constraints
- **Mobile behavior**: All content stacks vertically
- **Responsive breakpoints**: Template defined, cannot be modified
- **Grid systems**: Must use existing template grid structure

## POM Testing Requirements (Cannot Break)

### Critical Selectors
- **Hero CTA**: `main button.btn-primary.btn-lg`
- **Header CTA**: `header button.btn-primary`  
- **FAQ buttons**: Must contain `onclick*="toggleFAQ"`
- **Login functionality**: Must reject with "Invalid email or password"

### Mobile Requirements (Exact Specifications)
- **Header height**: Exactly 64px inner container height
- **Touch targets**: Minimum 44px height for all interactive elements
- **Viewport meta**: `width=device-width, initial-scale=1.0, maximum-scale=1.0`
- **Scrolled state**: Header maintains 64px height when scrolled

### CSS Variables (From POM expectedStyles)
```css
:root {
  /* Background colors - from POM */
  --pom-bg-body: rgb(40, 40, 40);
  --pom-bg-secondary: rgb(65, 65, 65);
  --pom-bg-card: rgb(53, 53, 53);
  
  /* Text colors - from POM */
  --pom-text-primary: rgb(255, 255, 255);
  --pom-text-secondary: rgba(255, 246, 238, 0.72);
  --pom-text-muted: rgb(156, 163, 175);
  
  /* Accent colors - from POM */
  --pom-accent: rgb(255, 220, 97);
  --pom-accent-text: rgb(41, 48, 69);
  
  /* Button specs - from POM */
  --pom-btn-padding: 0px 24px;
  --pom-btn-height: 40px;
  --pom-btn-radius: 6px;
  
  /* Typography - from POM */
  --pom-font-hero-size: 48px;
  --pom-font-hero-weight: 600;
  --pom-font-subtitle-size: 18px;
}
```

## Content Character Limits

### Homepage Specific
- **Hero headline**: ~61 characters maximum (current: "Turn Unstructured Portfolio Data Into Predictive Intelligence")
- **Hero subtitle**: ~150 characters for mobile readability
- **Feature names**: 2-4 words each
- **Feature descriptions**: 20-30 words each
- **CTA buttons**: 4 words maximum

### Page Titles
- **Format**: "[Page Title] | Ralph - AI-Native Private Equity Platform"
- **SEO consideration**: Total title length under 60 characters

### Navigation Labels
Current approved lengths:
- "Product" (7 chars)
- "Pricing" (7 chars)  
- "Learn" (5 chars)
- "Log In" (6 chars)

## Component Requirements

### FAQ Component
- **Format**: Accordion-style collapsed questions
- **JavaScript**: Must use `toggleFAQ(this)` function
- **Accessibility**: ARIA labels required
- **Mobile**: Touch-friendly expand/collapse

### Button Components
- **Primary buttons**: Yellow background (`--pom-accent`)
- **Text color**: Dark text (`--pom-accent-text`)
- **Minimum size**: 44px height for touch targets
- **Hover states**: Required for desktop

### Header Component
- **Logo**: Text-based, not image
- **Navigation**: Horizontal layout on desktop, hamburger on mobile
- **CTA button**: Must be visually distinct from nav items
- **Background**: Uses `--pom-bg-body`

## Browser Support

### Minimum Requirements
- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **JavaScript**: ES2020 features supported
- **CSS**: Grid and Flexbox required

## Performance Constraints

### Build Requirements
- **Static generation**: All pages must be statically generated
- **Asset optimization**: Images compressed, CSS/JS minified
- **Bundle size**: Keep JavaScript bundles under 100KB
- **Loading speed**: First Contentful Paint under 2 seconds

## SEO Technical Requirements

### Meta Tags (Required)
- **Title**: Unique per page, includes "Ralph" and descriptor
- **Description**: 150-160 characters, includes key terms
- **Canonical**: Proper canonical URLs for GitHub Pages
- **Open Graph**: Required for social sharing

### Structured Data
- **Organization schema**: For About page
- **Article schema**: For Learn content
- **FAQ schema**: For FAQ section

## Security Constraints

### Data Handling
- **No user data collection**: Beyond email for newsletter (not implemented)
- **No cookies**: Except essential functionality
- **External scripts**: Minimize third-party dependencies
- **Content Security Policy**: Implement when applicable

## Testing Requirements

### POM Validation
- **Test command**: `cd tests && node unified-test.js ralph`
- **Success criteria**: 189+ elements pass validation
- **CSS properties**: 3,500+ property tests must pass
- **Mobile tests**: Must pass mobile-specific POM requirements

### Visual Verification
```javascript
// Required after style changes
await puppeteer_screenshot({ name: 'current-state', width: 1200, height: 800 });

// Element-specific verification
await puppeteer_evaluate({
  script: `getComputedStyle(document.querySelector('.btn-primary')).backgroundColor`
});
```

## Development Workflow Constraints

### Change Requirements
1. **POM test baseline**: Run before any changes
2. **Atomic changes**: One component/style change at a time
3. **Immediate verification**: Test after each change
4. **Rollback plan**: Ready if tests fail

### File Modification Rules
- **Layout.astro**: Global styles and CSS variables only
- **Component files**: Use POM-specified classes
- **No inline styles**: Except dynamic content
- **CSS specificity**: Avoid `!important` declarations

## Deployment Constraints

### GitHub Pages Requirements
- **Output directory**: Must be `/docs`
- **Base path**: All links must include `/ralph-web/`
- **Asset paths**: Relative links for cross-page navigation
- **Build process**: Automated via Astro build

### URL Structure
```
https://zitrono.github.io/ralph-web/
├── /product
├── /pricing
├── /learn
│   ├── /monday-morning-ai-routine
│   ├── /10-queries-every-pe-firm-should-ask
│   └── /finding-hidden-risks-30-minutes
└── /about
```

## Forbidden Modifications

### Cannot Change
- **POM selector structure**: Breaks testing
- **Navigation item count**: Template limitation
- **Mobile header height**: POM requirement
- **Color values**: Must use exact RGB values from POM
- **Button sizing**: Minimum touch target requirements
- **Font family hierarchy**: Geist → Inter fallback order

### Requires Special Approval
- **New navigation items**: Would need major restructure
- **Color scheme changes**: Affects entire POM validation
- **Layout grid modifications**: Could break responsive behavior
- **JavaScript functionality**: Might affect POM testing

## Emergency Protocols

### If POM Tests Fail
1. **Immediate rollback**: Revert last change
2. **Isolate issue**: Test individual components
3. **Verify selectors**: Check for structural changes
4. **Mobile check**: Ensure 64px header height maintained

### If Build Fails
1. **Check syntax**: Astro component syntax
2. **Verify imports**: Component and style imports
3. **Asset paths**: Ensure correct relative paths
4. **Clean build**: Delete `/docs` and rebuild

This document serves as the immutable foundation for all Ralph website development. Content changes must work within these constraints - the constraints cannot be modified to accommodate content preferences.