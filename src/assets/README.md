# Assets Directory

This directory contains all static assets used in the Ralph website, organized for optimal performance and maintainability.

## Directory Structure

```
assets/
├── fonts/     # Web fonts (currently in public/fonts/ for direct access)
├── images/    # Raster images (PNG, JPG, WebP)
├── icons/     # Icon files (SVG preferred)
└── logos/     # Company and brand logos (SVG)
```

## Image Optimization Guidelines

### Using Astro's Image Component

For optimal performance, use Astro's built-in `<Image />` component:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/images/hero-background.jpg';
---

<Image src={heroImage} alt="Description" width={1920} height={1080} loading="lazy" format="webp" />
```

### Image Formats

- **WebP**: Preferred format for photographs and complex images
- **SVG**: Use for logos, icons, and simple graphics
- **PNG**: For images requiring transparency
- **JPG**: Fallback for photographs when WebP isn't suitable

### Optimization Checklist

1. **Resize images** to their display size (don't serve 4K images for 800px displays)
2. **Use appropriate formats** (WebP for photos, SVG for graphics)
3. **Implement lazy loading** for below-fold images
4. **Add descriptive alt text** for accessibility
5. **Use responsive images** with srcset when needed

### SVG Optimization

For SVG files:

1. Remove unnecessary metadata and comments
2. Optimize paths using SVGO
3. Consider inlining small SVGs directly in components
4. Use `astro-icon` for icon management

### Font Loading Strategy

Fonts are currently in `public/fonts/` for direct access with:

- Preload links for critical fonts
- font-display: swap for better perceived performance
- WOFF2 format for optimal compression

## Future Enhancements

1. **Image Processing Pipeline**: Automated optimization on build
2. **Responsive Images**: Automatic srcset generation
3. **CDN Integration**: For global content delivery
4. **Progressive Enhancement**: WebP with JPG/PNG fallbacks
