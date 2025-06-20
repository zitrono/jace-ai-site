#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(__dirname, '../../dist');

// Template for complete HTML page
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en" data-color-mode="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- SEO Meta Tags -->
  <title>{{title}}</title>
  <meta name="description" content="{{description}}">
  <link rel="canonical" href="{{canonical}}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="{{title}}">
  <meta property="og:description" content="{{description}}">
  <meta property="og:url" content="{{canonical}}">
  <meta property="og:site_name" content="Jace AI">
  <meta property="og:image" content="og-image.jpg">
  <meta property="og:type" content="website">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{title}}">
  <meta name="twitter:description" content="{{description}}">
  <meta name="twitter:image" content="og-image.jpg">
  
  <!-- Favicon -->
  <link rel="icon" href="favicon.ico" sizes="32x32" type="image/x-icon">
  
  <!-- Styles -->
  <link rel="stylesheet" href="assets/css/main.css">
  <link rel="stylesheet" href="assets/css/components.css">
  
  <!-- Preload critical images -->
  {{preloads}}
</head>
<body class="geist_e531dabc-module__QGiZLq__variable antialiased font-[family-name:var(--font-geist-sans)] bg-page-bg">
  
  <div class="bg-page-bg">
    {{header}}
    
    <main>
      {{content}}
    </main>
    
    {{footer}}
  </div>
  
  <!-- Analytics -->
  {{analytics}}
</body>
</html>`;

function loadComponent(componentPath) {
  try {
    return fs.readFileSync(componentPath, 'utf8');
  } catch (error) {
    console.warn(`⚠️  Component not found: ${componentPath}`);
    return '';
  }
}

function generateImagePreloads(sections) {
  const preloads = [
    'reviews/josh-graham.jpg',
    'reviews/darius-foroux.jpeg', 
    'reviews/swyx.jpg',
    'companies/google.svg',
    'companies/meta.svg',
    'features/auto-drafts.png'
  ];
  
  return preloads
    .map(src => `<link rel="preload" as="image" href="${src}">`)
    .join('\n  ');
}

function generateAnalytics() {
  return `
  <!-- Google Tag Manager -->
  <script>
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
  </script>
  `;
}

function buildPage(config) {
  const header = loadComponent(path.join(BASE_DIR, 'components/common/header.html'));
  const footer = loadComponent(path.join(BASE_DIR, 'components/common/footer.html'));
  
  // Load content sections
  const content = config.sections
    .map(section => loadComponent(path.join(BASE_DIR, `components/sections/${section}.html`)))
    .filter(content => content.length > 0)
    .join('\n\n    ');
  
  // Replace template variables
  let html = HTML_TEMPLATE
    .replace('{{title}}', config.title)
    .replace('{{description}}', config.description)
    .replace('{{canonical}}', config.canonical)
    .replace('{{title}}', config.title) // og:title
    .replace('{{description}}', config.description) // og:description
    .replace('{{canonical}}', config.canonical) // og:url
    .replace('{{title}}', config.title) // twitter:title
    .replace('{{description}}', config.description) // twitter:description
    .replace('{{preloads}}', generateImagePreloads(config.sections))
    .replace('{{header}}', header)
    .replace('{{content}}', content)
    .replace('{{footer}}', footer)
    .replace('{{analytics}}', generateAnalytics());
  
  return html;
}

async function build() {
  console.log('🏗️  Starting build process...');
  
  // Ensure dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }
  
  // Copy assets
  console.log('📁 Copying assets...');
  const assetsSource = path.join(BASE_DIR, 'assets');
  const assetsDest = path.join(DIST_DIR, 'assets');
  
  if (fs.existsSync(assetsSource)) {
    fs.cpSync(assetsSource, assetsDest, { recursive: true });
    console.log('✅ Assets copied');
  }
  
  // Copy images and other static files from root
  const staticFiles = [
    'favicon.ico',
    'robots.txt',
    '.nojekyll'
  ];
  
  staticFiles.forEach(file => {
    const source = path.join(__dirname, '../../', file);
    const dest = path.join(DIST_DIR, file);
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
      console.log(`✅ Copied ${file}`);
    }
  });
  
  // Copy image directories
  const imageDirs = ['companies', 'features', 'reviews', 'team', 'investors'];
  imageDirs.forEach(dir => {
    const source = path.join(__dirname, '../../', dir);
    const dest = path.join(DIST_DIR, dir);
    if (fs.existsSync(source)) {
      fs.cpSync(source, dest, { recursive: true });
      console.log(`✅ Copied ${dir} directory`);
    }
  });
  
  // Build pages
  const pages = [
    {
      filename: 'index.html',
      title: 'Jace AI | Email Assistant That Understands Your Voice',
      description: 'Your intelligent email assistant that understands your voice. Write emails faster, schedule meetings seamlessly, and communicate more effectively.',
      canonical: 'https://jace.ai',
      sections: [
        'hero',
        'save-hours-daily',
        'fair-pricing-no-surprises',
        'plus', 
        'pro',
        'less-email-more-productivity',
        'frequently-asked-questions'
      ]
    }
  ];
  
  console.log('🔨 Building pages...');
  pages.forEach(pageConfig => {
    const html = buildPage(pageConfig);
    const outputPath = path.join(DIST_DIR, pageConfig.filename);
    fs.writeFileSync(outputPath, html);
    console.log(`✅ Built ${pageConfig.filename}`);
  });
  
  console.log(`\n🎉 Build completed! Output in: ${DIST_DIR}`);
  console.log('🚀 You can now serve the dist/ directory');
}

build().catch(console.error);