import { designSystem } from './src/config/design-system.ts';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Design System Colors
        primary: {
          yellow: designSystem.colors.primary.yellow,
          'yellow-hover': designSystem.colors.primary.yellowHover,
        },
        neutral: {
          700: 'rgb(40, 40, 40)', // POM exact value
          600: 'rgb(65, 65, 65)', // POM exact value
          500: 'rgb(82, 82, 82)',
          400: 'rgb(115, 115, 115)',
          300: 'rgb(163, 163, 163)',
          200: 'rgb(212, 212, 212)',
          100: 'rgb(245, 245, 245)',
          50: 'rgb(250, 250, 250)',
          800: 'rgb(26, 26, 26)',
          900: 'rgb(10, 10, 10)',
        },
        text: designSystem.colors.text,

        // POM Background Colors (backwards compatibility)
        'pom-bg-body': 'rgb(40, 40, 40)',
        'pom-bg-secondary': 'rgb(65, 65, 65)',
        'pom-bg-card': 'rgb(53, 53, 53)',

        // POM Text Colors (backwards compatibility)
        'pom-text-primary': 'rgb(255, 255, 255)',
        'pom-text-secondary': 'rgba(255, 246, 238, 0.72)',
        'pom-text-muted': 'rgb(156, 163, 175)',
        'pom-text-gray': 'rgb(107, 114, 128)',

        // POM Accent Colors (backwards compatibility)
        'pom-accent': 'rgb(255, 220, 97)',
        'pom-accent-text': 'rgb(41, 48, 69)',

        // Additional POM Colors (backwards compatibility)
        'pom-emerald': 'oklch(0.696 0.17 162.48)',
        'pom-quote': 'oklch(0.21 0.034 264.665)',

        // Override Tailwind's yellow to use our brand yellow
        yellow: {
          400: designSystem.colors.primary.yellow,
          300: designSystem.colors.primary.yellowHover,
        },

        // Map to semantic names
        surface: {
          DEFAULT: designSystem.colors.neutral[700],
          secondary: designSystem.colors.neutral[600],
          card: 'rgb(53, 53, 53)',
          highlight: designSystem.colors.primary.yellow,
        },
      },

      fontFamily: {
        sans: designSystem.typography.fontFamily.primary,
      },

      fontSize: {
        // Design System Font Sizes
        xs: [designSystem.typography.fontSize.xs, { lineHeight: designSystem.typography.lineHeight.base }],
        sm: [designSystem.typography.fontSize.sm, { lineHeight: designSystem.typography.lineHeight.base }],
        base: [designSystem.typography.fontSize.base, { lineHeight: designSystem.typography.lineHeight.base }],
        lg: [designSystem.typography.fontSize.lg, { lineHeight: designSystem.typography.lineHeight.base }],
        xl: [designSystem.typography.fontSize.xl, { lineHeight: designSystem.typography.lineHeight.base }],
        '2xl': [designSystem.typography.fontSize['2xl'], { lineHeight: designSystem.typography.lineHeight.tight }],
        '3xl': [designSystem.typography.fontSize['3xl'], { lineHeight: designSystem.typography.lineHeight.tight }],
        hero: [designSystem.typography.fontSize.hero, { lineHeight: designSystem.typography.lineHeight.tight }],

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
