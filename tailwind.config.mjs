import { designSystem } from './src/config/design-system.ts';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Design System Colors - Single Source of Truth
        primary: {
          yellow: designSystem.colors.primary.yellow,
          'yellow-hover': designSystem.colors.primary.yellowHover,
        },
        neutral: designSystem.colors.neutral,
        text: designSystem.colors.text,

        // Override Tailwind's yellow to use our brand yellow
        yellow: {
          400: designSystem.colors.primary.yellow,
          300: designSystem.colors.primary.yellowHover,
        },

        // Semantic color mapping
        background: designSystem.colors.neutral[700],
        accent: designSystem.colors.primary.yellow,
        'accent-text': designSystem.colors.text.inverted,

        // Backward compatibility with existing POM references
        'primary-yellow': designSystem.colors.primary.yellow,
      },

      textColor: {
        // Text colors need to be in textColor to generate text-* utilities
        primary: designSystem.colors.text.primary,
        secondary: designSystem.colors.text.secondary,
        muted: designSystem.colors.text.muted,
        // Also keep the prefixed versions for clarity
        'text-primary': designSystem.colors.text.primary,
        'text-secondary': designSystem.colors.text.secondary,
        'text-muted': designSystem.colors.text.muted,
      },

      backgroundColor: {
        // Background colors for bg-* utilities
        primary: designSystem.colors.neutral[700],
        secondary: designSystem.colors.neutral[600],
        card: designSystem.colors.neutral[500],
      },

      fontFamily: {
        sans: designSystem.typography.fontFamily.primary,
      },

      fontSize: {
        // Design System Font Sizes
        xs: [
          designSystem.typography.fontSize.xs,
          { lineHeight: designSystem.typography.lineHeight.base },
        ],
        sm: [
          designSystem.typography.fontSize.sm,
          { lineHeight: designSystem.typography.lineHeight.base },
        ],
        base: [
          designSystem.typography.fontSize.base,
          { lineHeight: designSystem.typography.lineHeight.base },
        ],
        lg: [
          designSystem.typography.fontSize.lg,
          { lineHeight: designSystem.typography.lineHeight.base },
        ],
        xl: [
          designSystem.typography.fontSize.xl,
          { lineHeight: designSystem.typography.lineHeight.base },
        ],
        '2xl': [
          designSystem.typography.fontSize['2xl'],
          { lineHeight: designSystem.typography.lineHeight.tight },
        ],
        '3xl': [
          designSystem.typography.fontSize['3xl'],
          { lineHeight: designSystem.typography.lineHeight.tight },
        ],
        hero: [
          designSystem.typography.fontSize.hero,
          { lineHeight: designSystem.typography.lineHeight.tight },
        ],

        // POM Typography Scale (backwards compatibility)
        'hero-title': ['48px', { lineHeight: '1.2', fontWeight: '600' }],
        'hero-subtitle': ['18px', { lineHeight: '1.6' }],
        'section-title': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
        'section-subtitle': ['48px', { lineHeight: '1.2', fontWeight: '600' }],
        'section-tagline': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'card-text': ['14px', { lineHeight: '24px' }],
        button: ['14px', { lineHeight: '1.5' }],
        'button-lg': ['16px', { lineHeight: '24px' }],

        // Mobile Typography
        'hero-title-mobile': ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        'subtitle-mobile': ['1.125rem', { lineHeight: '1.6' }],

        // Heading styles from global CSS
        'heading-2': ['1rem', { lineHeight: '1.75', fontWeight: '600' }],
        'heading-3': ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        'heading-3-lg': ['1.5rem', { lineHeight: '1.5', fontWeight: '600' }],
      },

      spacing: {
        // Design System Spacing
        ...designSystem.spacing.component,
        'section-sm': designSystem.spacing.section.sm,
        'section-base': designSystem.spacing.section.base,
        'section-lg': designSystem.spacing.section.lg,

        // POM Spacing Scale (backwards compatibility)
        'section-y': '96px',
        'section-y-lg': '128px',
        'card-gap': '32px',
        'card-padding': '24px',
        'button-x': '24px',
        'mobile-header': '64px',
        'desktop-header': '92px',
      },

      borderRadius: {
        // Design System Border Radius
        ...designSystem.borderRadius,

        // POM Border Radius (backwards compatibility)
        button: '6px',
        'button-lg': '8px',
        card: '16px',
        badge: '9999px',
      },

      height: {
        button: '40px',
        'mobile-header-inner': '64px',
      },

      backgroundImage: {
        // Design System Gradients
        'gradient-hero-title': designSystem.colors.gradients.heroTitle,
        'gradient-purple-yellow': designSystem.colors.gradients.purpleYellow,
        'gradient-video-container': designSystem.colors.gradients.videoContainer,
        'gradient-cta-section': designSystem.colors.gradients.ctaSection,

        // Legacy gradients (backwards compatibility)
        'gradient-video': 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(20, 184, 166))',
        'gradient-features': 'linear-gradient(to right, rgb(192, 132, 252), rgb(250, 204, 21))',
        'gradient-hero':
          'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
      },

      boxShadow: {
        card: 'oklab(0.21 -0.00316127 -0.0338527 / 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      zIndex: {
        ...Object.fromEntries(
          Object.entries(designSystem.zIndex).map(([key, value]) => [key, value.toString()])
        ),
      },

      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },

  safelist: [
    // Ensure POM classes are never purged
    'bg-pom-bg-body',
    'bg-pom-bg-secondary',
    'bg-pom-bg-card',
    'text-pom-text-primary',
    'text-pom-text-secondary',
    'text-pom-text-muted',
    'bg-pom-accent',
    'text-pom-accent-text',
  ],

  plugins: [],
};
