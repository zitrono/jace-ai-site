# Jace AI Website

A modern, component-based static website for Jace AI - your intelligent email assistant that understands your voice.

## 🏗️ Architecture

This site has been refactored from a minified Next.js static export into a maintainable, component-based architecture:

```
src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── header.html   # Site navigation
│   │   └── footer.html   # Site footer
│   ├── sections/         # Page sections
│   │   ├── hero.html     # Hero section
│   │   ├── save-hours-daily.html
│   │   ├── fair-pricing-no-surprises.html
│   │   └── ...           # Other content sections
│   └── blog/             # Blog-specific components
├── assets/
│   ├── css/              # Stylesheets
│   │   ├── main.css      # Core styles
│   │   └── components.css # Component styles
│   ├── js/               # JavaScript files
│   └── images/           # Organized image assets
├── pages/                # Source page templates
├── tools/                # Build and development tools
│   ├── build.js          # Main build system
│   ├── analyze-sections.js # Structure analysis
│   ├── extract-components.js # Component extraction
│   └── unminify.js       # HTML formatting
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- Python 3 (for local dev server)

### Development

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   This builds the site and serves it at `http://localhost:8000`

3. **Clean build artifacts:**
   ```bash
   npm run clean
   ```

### Available Scripts

- `npm run build` - Build the complete site to `dist/`
- `npm run dev` - Build and serve locally on port 8000
- `npm run clean` - Remove build artifacts
- `npm run analyze` - Analyze HTML structure
- `npm run extract` - Extract components from source HTML
- `npm run unminify` - Format minified HTML for readability

## 📁 Project Structure

### Components
- **Header (`src/components/common/header.html`)**: Navigation with logo, menu, and CTA buttons
- **Hero (`src/components/sections/hero.html`)**: Main value proposition
- **Feature Sections**: Modular content sections for different features
- **Footer (`src/components/common/footer.html`)**: Site footer with links

### Assets
- **CSS**: Clean, organized stylesheets extracted from original build
- **Images**: Categorized into logical folders (companies, features, reviews, etc.)
- **Static Files**: Favicon, robots.txt, .nojekyll for GitHub Pages

### Build System
The custom build system (`src/tools/build.js`) provides:
- Component assembly into complete HTML pages
- Asset copying and organization  
- SEO meta tag generation
- Analytics integration
- Clean, maintainable output

## 🎯 Benefits of Refactoring

### Before (Minified Static Export)
- ❌ Single-line HTML files (112,589 characters)
- ❌ Impossible to maintain or modify
- ❌ No component reusability
- ❌ Difficult collaboration
- ❌ Poor SEO control

### After (Component Architecture)
- ✅ Modular, readable components
- ✅ Easy content updates
- ✅ Reusable header/footer
- ✅ Version control friendly
- ✅ Multiple developer workflow
- ✅ SEO-optimized output
- ✅ Clean build process

## 🌐 Deployment

### GitHub Pages
The site is configured for GitHub Pages deployment:
1. Build artifacts go to `dist/`
2. `.nojekyll` file ensures proper asset serving
3. No `@` characters in filenames (GitHub Pages compatible)

### Manual Deployment
1. Run `npm run build`
2. Deploy the `dist/` folder to your hosting provider
3. Ensure proper MIME types for CSS/JS files

## 🔧 Development Workflow

### Adding New Sections
1. Create component in `src/components/sections/`
2. Add to page configuration in `src/tools/build.js`
3. Run `npm run build` to regenerate

### Modifying Existing Components
1. Edit the component file directly
2. Rebuild with `npm run build`
3. Test locally with `npm run dev`

### Updating Styles
1. Modify CSS files in `src/assets/css/`
2. Rebuild to copy to `dist/assets/css/`

## 📊 Performance

- **Clean HTML**: Semantic, accessible markup
- **Optimized Assets**: Organized CSS and images
- **Fast Loading**: Minimal JavaScript, efficient styles
- **SEO Ready**: Proper meta tags, structured data

## 🤝 Contributing

1. Make changes to components in `src/`
2. Test with `npm run dev`
3. Build with `npm run build`
4. Commit changes including built files

## 📝 License

MIT License - see LICENSE file for details.