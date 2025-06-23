// Design token generator utilities
import { designSystem, type DesignSystem } from './design-system';

// Helper to convert hex to rgb
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex; // Return original if not a valid hex
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgb(${r}, ${g}, ${b})`;
}

// Generate CSS variables from design system
export function generateCSSVariables(system: DesignSystem = designSystem): string {
  const lines: string[] = [':root {'];
  
  // Colors
  lines.push('  /* Brand Colors */');
  Object.entries(system.colors.primary).forEach(([key, value]) => {
    lines.push(`  --color-primary-${key.toLowerCase()}: ${value};`);
    lines.push(`  --color-primary-${key.toLowerCase()}-rgb: ${hexToRgb(value)};`);
  });
  
  lines.push('\n  /* Neutral Colors */');
  Object.entries(system.colors.neutral).forEach(([key, value]) => {
    lines.push(`  --color-neutral-${key}: ${value};`);
    lines.push(`  --color-neutral-${key}-rgb: ${hexToRgb(value)};`);
  });
  
  lines.push('\n  /* Text Colors */');
  Object.entries(system.colors.text).forEach(([key, value]) => {
    lines.push(`  --color-text-${key}: ${value};`);
  });
  
  lines.push('\n  /* Gradients */');
  Object.entries(system.colors.gradients).forEach(([key, value]) => {
    lines.push(`  --gradient-${kebabCase(key)}: ${value};`);
  });
  
  // Spacing
  lines.push('\n  /* Section Spacing */');
  Object.entries(system.spacing.section).forEach(([key, value]) => {
    lines.push(`  --spacing-section-${key}: ${value};`);
  });
  
  lines.push('\n  /* Component Spacing */');
  Object.entries(system.spacing.component).forEach(([key, value]) => {
    lines.push(`  --spacing-${key}: ${value};`);
  });
  
  // Typography
  lines.push('\n  /* Font Family */');
  lines.push(`  --font-primary: ${system.typography.fontFamily.primary.map(f => `"${f}"`).join(', ')};`);
  
  lines.push('\n  /* Font Sizes */');
  Object.entries(system.typography.fontSize).forEach(([key, value]) => {
    lines.push(`  --font-size-${key}: ${value};`);
  });
  
  lines.push('\n  /* Font Weights */');
  Object.entries(system.typography.fontWeight).forEach(([key, value]) => {
    lines.push(`  --font-weight-${key}: ${value};`);
  });
  
  lines.push('\n  /* Line Heights */');
  Object.entries(system.typography.lineHeight).forEach(([key, value]) => {
    lines.push(`  --line-height-${key}: ${value};`);
  });
  
  // Border Radius
  lines.push('\n  /* Border Radius */');
  Object.entries(system.borderRadius).forEach(([key, value]) => {
    lines.push(`  --radius-${key}: ${value};`);
  });
  
  // POM-specific mappings for backwards compatibility
  lines.push('\n  /* POM Compatibility Variables */');
  lines.push('  --pom-bg-body: var(--color-neutral-700-rgb);');
  lines.push('  --pom-bg-secondary: var(--color-neutral-600-rgb);');
  lines.push('  --pom-bg-card: rgb(53, 53, 53);');
  lines.push('  --pom-text-primary: var(--color-text-primary);');
  lines.push('  --pom-text-secondary: var(--color-text-secondary);');
  lines.push('  --pom-text-muted: var(--color-text-muted);');
  lines.push('  --pom-accent: var(--color-primary-yellow-rgb);');
  lines.push('  --pom-accent-text: rgb(41, 48, 69);');
  lines.push('  --pom-btn-padding: 0px 24px;');
  lines.push('  --pom-btn-height: 40px;');
  lines.push('  --pom-btn-radius: 6px;');
  lines.push('  --pom-font-hero-size: 48px;');
  lines.push('  --pom-font-hero-weight: 600;');
  lines.push('  --pom-font-subtitle-size: 18px;');
  
  lines.push('}');
  
  return lines.join('\n');
}

// Generate Tailwind config theme extension
export function generateTailwindTheme(system: DesignSystem = designSystem): Record<string, any> {
  return {
    colors: {
      primary: {
        yellow: system.colors.primary.yellow,
        'yellow-hover': system.colors.primary.yellowHover,
      },
      neutral: system.colors.neutral,
      text: system.colors.text,
    },
    fontFamily: {
      sans: system.typography.fontFamily.primary,
    },
    fontSize: Object.entries(system.typography.fontSize).reduce((acc, [key, value]) => {
      acc[key] = [value, { lineHeight: system.typography.lineHeight.base }];
      return acc;
    }, {} as Record<string, any>),
    fontWeight: system.typography.fontWeight,
    lineHeight: system.typography.lineHeight,
    borderRadius: system.borderRadius,
    spacing: {
      ...system.spacing.component,
      'section-sm': system.spacing.section.sm,
      'section-base': system.spacing.section.base,
      'section-lg': system.spacing.section.lg,
    },
    extend: {
      backgroundImage: system.colors.gradients,
    },
  };
}

// Utility to convert camelCase to kebab-case
function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Export utility to get a token value by path
export function getToken(path: string): string | undefined {
  const parts = path.split('.');
  let current: any = designSystem;
  
  for (const part of parts) {
    if (current[part] === undefined) return undefined;
    current = current[part];
  }
  
  return current;
}

// Export function to generate all tokens as a flat object (useful for debugging)
export function getAllTokens(): Record<string, string> {
  const tokens: Record<string, string> = {};
  
  function traverse(obj: any, prefix: string = '') {
    Object.entries(obj).forEach(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && !Array.isArray(value)) {
        traverse(value, path);
      } else {
        tokens[path] = String(value);
      }
    });
  }
  
  traverse(designSystem);
  return tokens;
}