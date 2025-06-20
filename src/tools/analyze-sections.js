#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function analyzeSections(htmlContent) {
  const lines = htmlContent.split('\n');
  const sections = [];
  let currentSection = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;
    
    // Detect major sections
    if (line.includes('<header')) {
      sections.push({ type: 'header', start: lineNum, content: 'Navigation Header' });
    } else if (line.includes('<main>')) {
      sections.push({ type: 'main', start: lineNum, content: 'Main Content Start' });
    } else if (line.includes('<h1')) {
      const title = line.match(/>([^<]+)</)?.[1] || 'Unknown Title';
      sections.push({ type: 'hero', start: lineNum, content: `Hero Section: ${title}` });
    } else if (line.includes('<h2')) {
      const title = line.match(/>([^<]+)</)?.[1] || 'Unknown Section';
      sections.push({ type: 'section', start: lineNum, content: `Section: ${title}` });
    } else if (line.includes('class="') && line.includes('testimonial')) {
      sections.push({ type: 'testimonials', start: lineNum, content: 'Testimonials Section' });
    } else if (line.includes('pricing') && line.includes('class=')) {
      sections.push({ type: 'pricing', start: lineNum, content: 'Pricing Section' });
    } else if (line.includes('<footer')) {
      sections.push({ type: 'footer', start: lineNum, content: 'Footer Section' });
    }
  }
  
  return sections;
}

// Read the unminified HTML file
const inputFile = path.join(__dirname, '../pages/index-unminified.html');

try {
  const htmlContent = fs.readFileSync(inputFile, 'utf8');
  const sections = analyzeSections(htmlContent);
  
  console.log('🔍 Page Structure Analysis:');
  console.log('=' * 50);
  
  sections.forEach((section, index) => {
    console.log(`${index + 1}. Line ${section.start}: [${section.type.toUpperCase()}] ${section.content}`);
  });
  
  console.log('\n📊 Summary:');
  console.log(`Total sections identified: ${sections.length}`);
  console.log(`File length: ${htmlContent.split('\n').length} lines`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}