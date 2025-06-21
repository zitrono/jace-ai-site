#!/usr/bin/env node

/**
 * Simple Astro Component to HTML Converter
 * Since we can't run full Astro due to Node version, this simulates the output
 */

import fs from 'fs';
import path from 'path';

// Simple template processor
function processAstroComponent(content, isLayout = false) {
  // Remove frontmatter (between ---)
  content = content.replace(/^---[\s\S]*?---\n/m, '');
  
  // Don't process JavaScript content inside script tags
  let scripts = [];
  content = content.replace(/<script>([\s\S]*?)<\/script>/g, (match, scriptContent) => {
    scripts.push(match);
    return `__SCRIPT_${scripts.length - 1}__`;
  });
  
  // Convert Astro syntax to HTML
  content = content
    .replace(/{([^}]+)}/g, (match, expr) => {
      // Simple expression evaluation for props
      if (expr.includes('title')) return 'Jace AI | Email Assistant That Understands Your Voice';
      if (expr.includes('description')) return 'Your intelligent email assistant that understands your voice.';
      return '';
    })
    .trim();
  
  // Don't remove slots from layout files
  if (!isLayout) {
    content = content.replace(/<slot\s*\/>/g, ''); // Remove empty slots
  }
  
  // Restore scripts
  scripts.forEach((script, index) => {
    content = content.replace(`__SCRIPT_${index}__`, script);
  });
    
  return content;
}

// Build the page
function buildPage() {
  console.log('🔨 Building Astro components to static HTML...');
  
  // Read components
  const layoutContent = fs.readFileSync('./src/layouts/Layout.astro', 'utf8');
  const headerContent = fs.readFileSync('./src/components/Header.astro', 'utf8');
  const heroContent = fs.readFileSync('./src/components/Hero.astro', 'utf8');
  
  // Process components
  const layout = processAstroComponent(layoutContent, true); // isLayout = true
  const header = processAstroComponent(headerContent);
  const hero = processAstroComponent(heroContent);
  
  console.log('Layout length:', layout.length);
  console.log('Header length:', header.length);
  console.log('Hero length:', hero.length);
  console.log('Looking for slot in layout:', layout.includes('<slot'));
  console.log('Layout snippet around slot:', layout.slice(layout.indexOf('<slot') - 20, layout.indexOf('<slot') + 40));
  
  // Build complete page content
  const pageContent = `
      <div class="bg-gray-900 min-h-screen">
        ${header}
        <main>
          ${hero}
        </main>
      </div>
    `;
  
  // Build complete page
  let completePage = layout.replace(/<slot\s*\/>/g, pageContent);
  
  console.log('Page content inserted? ', completePage.includes('<header'));
  
  // Replace title and description placeholders
  completePage = completePage
    .replace(/content=\{title\}/g, 'content="Jace AI | Email Assistant That Understands Your Voice"')
    .replace(/content=\{description\}/g, 'content="Your intelligent email assistant that understands your voice. Write emails faster, schedule meetings seamlessly, and communicate more effectively."')
    .replace(/\{title\}/g, 'Jace AI | Email Assistant That Understands Your Voice')
    .replace(/\{description\}/g, 'Your intelligent email assistant that understands your voice. Write emails faster, schedule meetings seamlessly, and communicate more effectively.');
  
  // Add Tailwind CSS CDN for quick testing
  const finalPage = completePage.replace(
    '</head>',
    '  <script src="https://cdn.tailwindcss.com"></script>\n  <script>tailwind.config = { darkMode: "class" }</script>\n</head>'
  );
  
  // Ensure dist directory exists
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
  }
  
  // Write output
  fs.writeFileSync('./dist/index.html', finalPage);
  
  console.log('✅ Built ./dist/index.html');
  console.log('🚀 You can now test with: python3 -m http.server 4321 --directory dist');
}

buildPage();