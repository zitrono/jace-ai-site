/**
 * Design Token Contract System - Immutable design constraints
 * Prevents misalignment by enforcing design system rules at compile time
 */

// Button size mapping to Tailwind classes
export const BUTTON_SIZE_CLASSES = {
  xs: 'h-8',   // 32px
  sm: 'h-9',   // 36px  
  md: 'h-10',  // 40px - matches POM reference
  lg: 'h-12',  // 48px
  xl: 'h-14',  // 56px
} as const;

// Global button configuration for consistency
export const BUTTON_STANDARDS = {
  // Primary CTA buttons (Book a Demo, etc.) - matches POM reference
  cta: {
    size: 'md' as const,        // 40px height (h-10) - matches POM reference
    mobileSize: 'sm' as const,  // 36px height (h-9) on mobile for better spacing
    className: 'btn-primary btn-md',
  },
  // Secondary buttons (Log In, etc.) - matches POM reference
  secondary: {
    size: 'md' as const,        // 40px height (h-10) - matches POM reference
    mobileSize: 'sm' as const,  // 36px height (h-9) on mobile for better spacing
    className: 'btn-secondary',
  },
  // Navigation links
  nav: {
    size: 'md' as const,        // 44px height
    mobileSize: 'md' as const,
    className: '',
  },
} as const;

// Header-specific design tokens (immutable)
export const HEADER_METRICS = {
  HEIGHT: '64px',           // Total header height
  ELEMENT_HEIGHT: '44px',   // Standard touch target
  ELEMENT_FONT: '16px',     // Default element font size
  ELEMENT_WEIGHT: '500',    // Medium font weight
  ELEMENT_SPACING: '32px',  // Wider padding to match reference
} as const;

// Valid header element configurations (compile-time enforced)
export type ValidHeaderVariant = 'nav' | 'primary' | 'secondary';
export type ValidHeaderSize = 'md'; // Only md allowed in header for consistency

// Header button configuration constraints
export const HEADER_BUTTON_CONFIG = {
  nav: {
    height: BUTTON_SIZE_CLASSES.md,   // 44px - consistent nav size
    padding: 'px-6',                  // 24px horizontal - matches reference
    font: 'text-base',                // 16px - matches reference nav
    weight: 'font-normal',            // 400 weight - matches reference
    leading: 'leading-none',          // Precise text alignment
  },
  primary: {
    height: 'h-9 md:h-10',    // Responsive: 36px mobile, 40px desktop
    padding: 'px-sm md:px-6', // Responsive: smaller padding on mobile
    font: 'text-sm md:text-base', // Responsive: 14px mobile, 16px desktop
    weight: 'font-medium',
    leading: 'leading-none',
  },
  secondary: {
    height: 'h-9 md:h-10',    // Responsive: 36px mobile, 40px desktop
    padding: 'px-sm md:px-6', // Responsive: smaller padding on mobile
    font: 'text-sm md:text-base', // Responsive: 14px mobile, 16px desktop
    weight: 'font-medium',
    leading: 'leading-none',
  },
} as const;

// Type-safe button configuration
export type HeaderButtonConfig = typeof HEADER_BUTTON_CONFIG;
export type HeaderButtonVariant = keyof HeaderButtonConfig;

// CSS custom properties for runtime enforcement
export const HEADER_CSS_VARS = {
  '--header-height': HEADER_METRICS.HEIGHT,
  '--header-element-height': HEADER_METRICS.ELEMENT_HEIGHT,
  '--header-element-font': HEADER_METRICS.ELEMENT_FONT,
  '--header-element-weight': HEADER_METRICS.ELEMENT_WEIGHT,
  '--header-element-spacing': HEADER_METRICS.ELEMENT_SPACING,
} as const;

// Validation utilities
export function isValidHeaderVariant(variant: string): variant is ValidHeaderVariant {
  return ['nav', 'primary', 'secondary'].includes(variant);
}

export function getHeaderButtonClasses(variant: HeaderButtonVariant): string {
  const config = HEADER_BUTTON_CONFIG[variant];
  return `${config.height} ${config.padding} ${config.font} ${config.weight} ${config.leading}`;
}

// Get standardized button size
export function getButtonStandardSize(variant: 'primary' | 'secondary' | 'nav'): string {
  if (variant === 'primary') return BUTTON_STANDARDS.cta.size;
  if (variant === 'secondary') return BUTTON_STANDARDS.secondary.size;
  return BUTTON_STANDARDS.nav.size;
}