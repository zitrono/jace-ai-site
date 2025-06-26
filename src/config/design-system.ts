// Design System with TypeScript types
// This is the single source of truth for all design tokens

interface ColorPalette {
  yellow: string;
  yellowHover: string;
}

interface NeutralPalette {
  900: string;
  800: string;
  700: string;
  600: string;
  500: string;
  400: string;
  300: string;
  200: string;
  100: string;
  50: string;
}

interface TextColors {
  primary: string;
  secondary: string;
  muted: string;
  inverted: string;
}

interface Gradients {
  heroTitle: string;
  purpleYellow: string;
  videoContainer: string;
  ctaSection: string;
}

interface Colors {
  primary: ColorPalette;
  neutral: NeutralPalette;
  text: TextColors;
  gradients: Gradients;
}

interface SpacingScale {
  sm: string;
  base: string;
  lg: string;
}

interface ComponentSpacing {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
}

interface Spacing {
  section: SpacingScale;
  component: ComponentSpacing;
}

interface FontSizes {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  hero: string;
}

interface FontWeights {
  normal: string;
  medium: string;
  semibold: string;
  bold: string;
}

interface LineHeights {
  tight: string;
  base: string;
  relaxed: string;
}

interface Typography {
  fontFamily: {
    primary: string[];
  };
  fontSize: FontSizes;
  fontWeight: FontWeights;
  lineHeight: LineHeights;
}

interface BorderRadius {
  sm: string;
  base: string;
  lg: string;
  xl: string;
  full: string;
}

interface ComponentSizes {
  mobileHeaderHeight: string;
  buttonPadding: {
    sm: string;
    base: string;
    lg: string;
  };
}

export interface DesignSystem {
  colors: Colors;
  spacing: Spacing;
  typography: Typography;
  borderRadius: BorderRadius;
  components: ComponentSizes;
}

export const designSystem: DesignSystem = {
  colors: {
    // Brand colors - exact POM values
    primary: {
      yellow: 'rgb(255, 220, 97)', // Exact POM CTA yellow
      yellowHover: 'rgb(255, 229, 128)', // Lighter yellow for hover
    },

    // Neutral colors - exact POM values for compliance
    neutral: {
      900: 'rgb(10, 10, 10)', // Darkest
      800: 'rgb(26, 26, 26)',
      700: 'rgb(40, 40, 40)', // Main background - exact POM value
      600: 'rgb(65, 65, 65)', // Secondary areas - exact POM value
      500: 'rgb(82, 82, 82)',
      400: 'rgb(115, 115, 115)',
      300: 'rgb(163, 163, 163)',
      200: 'rgb(212, 212, 212)',
      100: 'rgb(245, 245, 245)',
      50: 'rgb(250, 250, 250)', // Lightest
    },

    // Semantic colors - exact POM values
    text: {
      primary: 'rgb(255, 255, 255)', // Main text - exact POM value
      secondary: 'rgba(255, 246, 238, 0.72)', // Subtitle - exact POM value
      muted: 'rgb(156, 163, 175)', // Muted text - exact POM value
      inverted: 'rgb(40, 40, 40)', // Text on yellow backgrounds
    },

    // Gradients
    gradients: {
      heroTitle: 'linear-gradient(353deg, rgb(153, 153, 153) 36%, rgb(255, 255, 255) 90%)',
      purpleYellow: 'linear-gradient(to right, rgb(168, 85, 247), rgb(251, 191, 36))',
      videoContainer: 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(20, 184, 166))',
      ctaSection: 'linear-gradient(to right, rgb(139, 92, 246), rgb(67, 56, 202))',
    },
  },

  spacing: {
    section: {
      sm: '3rem', // 48px
      base: '5rem', // 80px
      lg: '8rem', // 128px
    },
    component: {
      xs: '0.5rem', // 8px
      sm: '1rem', // 16px
      base: '1.5rem', // 24px
      lg: '2rem', // 32px
      xl: '3rem', // 48px
    },
  },

  typography: {
    fontFamily: {
      primary: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px - POM requirement for navigation
      lg: '1.25rem', // 20px
      xl: '1.5rem', // 24px
      '2xl': '2.25rem', // 36px
      '3xl': '3rem', // 48px
      hero: '3.75rem', // 60px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.1',
      base: '1.5',
      relaxed: '1.75',
    },
  },

  borderRadius: {
    sm: '0.375rem', // 6px
    base: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    full: '9999px',
  },

  components: {
    mobileHeaderHeight: '64px', // POM exact value - immutable
    buttonPadding: {
      sm: '8px 16px',
      base: '10px 24px', // POM exact value for mobile buttons
      lg: '12px 32px',
    },
  },
};

// Type helpers for extracting nested values
export type ColorToken =
  | keyof Colors['primary']
  | keyof Colors['neutral']
  | keyof Colors['text']
  | keyof Colors['gradients'];
export type SpacingToken = keyof Spacing['section'] | keyof Spacing['component'];
export type FontSizeToken = keyof Typography['fontSize'];
export type FontWeightToken = keyof Typography['fontWeight'];
export type LineHeightToken = keyof Typography['lineHeight'];
export type BorderRadiusToken = keyof BorderRadius;
