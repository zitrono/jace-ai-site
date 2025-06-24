/**
 * SVG Optimization Utilities
 *
 * These utilities help optimize SVG files for web performance.
 * For production use, consider using SVGO during build process.
 */

/**
 * Options for SVG optimization
 */
interface SVGOptimizationOptions {
  /** CSS classes to apply to the SVG */
  className?: string;
  /** Accessibility label for screen readers */
  ariaLabel?: string;
  /** Whether to add role="img" for accessibility */
  addRole?: boolean;
}

/**
 * Inline small SVGs directly in HTML for better performance
 * @param svgContent - The SVG content as a string
 * @param options - Configuration options for the SVG
 * @returns Optimized inline SVG string
 */
export function inlineSVG(svgContent: string, options: SVGOptimizationOptions = {}): string {
  const { className = '', ariaLabel = '', addRole = true } = options;

  // Remove XML declaration and comments
  let optimized = svgContent
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Build attributes string
  const attributes: string[] = [];

  if (className) {
    attributes.push(`class="${className}"`);
  }

  if (ariaLabel) {
    attributes.push(`aria-label="${ariaLabel}"`);
    if (addRole) {
      attributes.push('role="img"');
    }
  }

  // Add attributes if provided
  if (attributes.length > 0) {
    optimized = optimized.replace('<svg', `<svg ${attributes.join(' ')}`);
  }

  return optimized;
}

/**
 * Convert SVG to data URI for CSS backgrounds
 * @param svgContent - The SVG content as a string
 * @returns Data URI string suitable for CSS background-image
 */
export function svgToDataURI(svgContent: string): string {
  const optimized = svgContent
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Encode for URI, handling quotes and other special characters
  const encoded = encodeURIComponent(optimized).replace(/'/g, '%27').replace(/"/g, '%22');

  return `data:image/svg+xml,${encoded}`;
}

/**
 * Options for SVG sprite generation
 */
interface SpriteOptions {
  /** ID for the sprite symbol */
  id: string;
  /** ViewBox attribute for the symbol */
  viewBox?: string;
  /** Whether to preserve aspect ratio */
  preserveAspectRatio?: string;
}

/**
 * Convert SVG to sprite symbol for SVG sprite usage
 * @param svgContent - The SVG content as a string
 * @param options - Sprite configuration options
 * @returns SVG symbol element string
 */
export function svgToSprite(svgContent: string, options: SpriteOptions): string {
  const { id, viewBox, preserveAspectRatio = 'xMidYMid meet' } = options;

  // Extract content between <svg> tags
  const contentMatch = svgContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const content = contentMatch ? contentMatch[1] : '';

  // Extract viewBox from original SVG if not provided
  const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/i);
  const finalViewBox = viewBox || (viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24');

  return `<symbol id="${id}" viewBox="${finalViewBox}" preserveAspectRatio="${preserveAspectRatio}">${content}</symbol>`;
}

/**
 * Utility function to create SVG use element for sprites
 * @param spriteId - The ID of the sprite symbol
 * @param options - Additional options for the use element
 * @returns SVG use element string
 */
export function createSVGUse(spriteId: string, options: SVGOptimizationOptions = {}): string {
  const { className = '', ariaLabel = '' } = options;

  const attributes: string[] = [];

  if (className) {
    attributes.push(`class="${className}"`);
  }

  if (ariaLabel) {
    attributes.push(`aria-label="${ariaLabel}"`);
    attributes.push('role="img"');
  }

  const attributeString = attributes.length > 0 ? ` ${attributes.join(' ')}` : '';

  return `<svg${attributeString}><use href="#${spriteId}"></use></svg>`;
}

/**
 * Type definition for SVG optimization result
 */
export interface SVGOptimizationResult {
  /** Optimized SVG content */
  content: string;
  /** Original size in bytes */
  originalSize: number;
  /** Optimized size in bytes */
  optimizedSize: number;
  /** Compression ratio (0-1) */
  compressionRatio: number;
}

/**
 * Comprehensive SVG optimization with metrics
 * @param svgContent - The SVG content to optimize
 * @param options - Optimization options
 * @returns Optimization result with metrics
 */
export function optimizeSVG(
  svgContent: string,
  options: SVGOptimizationOptions = {}
): SVGOptimizationResult {
  const originalSize = new Blob([svgContent]).size;
  const optimizedContent = inlineSVG(svgContent, options);
  const optimizedSize = new Blob([optimizedContent]).size;

  return {
    content: optimizedContent,
    originalSize,
    optimizedSize,
    compressionRatio: (originalSize - optimizedSize) / originalSize,
  };
}

/**
 * SVG optimization checklist and recommendations:
 *
 * 1. Remove unnecessary metadata and comments ✓
 * 2. Minimize decimal precision
 * 3. Remove default attributes
 * 4. Convert styles to attributes where possible
 * 5. Remove empty groups
 * 6. Collapse unnecessary transforms
 *
 * For automated optimization, use SVGO:
 * npm install -D svgo
 *
 * Example SVGO config:
 * {
 *   plugins: [
 *     {
 *       name: 'preset-default',
 *       params: {
 *         overrides: {
 *           removeViewBox: false,
 *           cleanupIds: {
 *             minify: false
 *           }
 *         }
 *       }
 *     }
 *   ]
 * }
 */
