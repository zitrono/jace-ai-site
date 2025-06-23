/**
 * Base component interfaces for Ralph Web
 */

/**
 * Base props that all components should extend
 */
export interface BaseComponentProps {
  /** Optional CSS class names */
  class?: string;
  /** Optional inline styles */
  style?: string;
  /** Optional data attributes */
  data?: Record<string, string>;
}

/**
 * Props for interactive components (buttons, forms, etc.)
 */
export interface InteractiveComponentProps extends BaseComponentProps {
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** ARIA described by for accessibility */
  ariaDescribedBy?: string;
}

/**
 * Props for layout components (sections, containers, etc.)
 */
export interface LayoutComponentProps extends BaseComponentProps {
  /** Whether to constrain content width */
  constrained?: boolean;
  /** Padding size variant */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Background color variant */
  background?: 'primary' | 'secondary' | 'accent' | 'transparent';
  /** Whether the section is full width */
  fullWidth?: boolean;
}

/**
 * Common button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/**
 * Common size variants
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Button state types
 */
export type ButtonState = 'default' | 'loading' | 'disabled';

/**
 * Input validation states
 */
export type ValidationState = 'default' | 'error' | 'success' | 'warning';

/**
 * Input types supported
 */
export type InputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'url';

/**
 * Card variants
 */
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

/**
 * Padding size options
 */
export type PaddingSize = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Common text alignment
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * Common spacing scale
 */
export type SpacingScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;