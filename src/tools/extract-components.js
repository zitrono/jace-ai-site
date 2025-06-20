#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractComponent(htmlContent, startPattern, endPattern, componentName) {
  const lines = htmlContent.split('\n');
  let startLine = -1;
  let endLine = -1;
  let nestingLevel = 0;
  let started = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Find start
    if (!started && line.includes(startPattern)) {
      startLine = i;
      started = true;
      // Count opening tags
      const openTags = (line.match(/<[^\/][^>]*>/g) || []).length;
      const closeTags = (line.match(/<\/[^>]*>/g) || []).length;
      nestingLevel = openTags - closeTags;
      continue;
    }
    
    if (started) {
      // Count tags to track nesting
      const openTags = (line.match(/<[^\/][^>]*>/g) || []).length;
      const closeTags = (line.match(/<\/[^>]*>/g) || []).length;
      nestingLevel += openTags - closeTags;
      
      // If we're back to level 0 or hit the end pattern, we're done
      if (nestingLevel <= 0 || line.includes(endPattern)) {
        endLine = i;
        break;
      }
    }
  }
  
  if (startLine >= 0 && endLine >= 0) {
    const componentLines = lines.slice(startLine, endLine + 1);
    return componentLines.join('\n');
  }
  
  return null;
}

function cleanComponent(content) {
  // Clean up and format the component
  return content
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .trim();
}

async function extractComponents() {
  const inputFile = path.join(__dirname, '../pages/index-unminified.html');
  const componentsDir = path.join(__dirname, '../components');
  
  try {
    const htmlContent = fs.readFileSync(inputFile, 'utf8');
    
    // Extract Header/Navigation
    const header = extractComponent(htmlContent, '<header', '</header>', 'header');
    if (header) {
      const cleanHeader = cleanComponent(header);
      fs.writeFileSync(path.join(componentsDir, 'common/header.html'), cleanHeader);
      console.log('✅ Extracted: Header component');
    }
    
    // Extract Hero Section (first h1 and surrounding content)
    const heroStart = htmlContent.indexOf('<h1');
    const heroSection = htmlContent.substring(heroStart, heroStart + 2000); // Get substantial content
    const heroEnd = heroSection.indexOf('</div>', heroSection.indexOf('</h1>'));
    const hero = heroSection.substring(0, heroEnd + 6);
    
    if (hero) {
      const cleanHero = cleanComponent(hero);
      fs.writeFileSync(path.join(componentsDir, 'sections/hero.html'), cleanHero);
      console.log('✅ Extracted: Hero section');
    }
    
    // Extract main sections based on h2 headings
    const h2Matches = [...htmlContent.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)];
    
    h2Matches.forEach((match, index) => {
      const sectionTitle = match[1].trim();
      const sectionStart = match.index;
      
      // Find the section content (next 1000-2000 chars or until next h2)
      let sectionEnd = htmlContent.indexOf('<h2', sectionStart + 1);
      if (sectionEnd === -1) sectionEnd = sectionStart + 2000;
      
      const sectionContent = htmlContent.substring(sectionStart, sectionEnd);
      const cleanSection = cleanComponent(sectionContent);
      
      // Create filename from title
      const filename = sectionTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30) + '.html';
      
      fs.writeFileSync(path.join(componentsDir, 'sections', filename), cleanSection);
      console.log(`✅ Extracted: ${sectionTitle} section -> ${filename}`);
    });
    
    // Extract Footer
    const footer = extractComponent(htmlContent, '<footer', '</footer>', 'footer');
    if (footer) {
      const cleanFooter = cleanComponent(footer);
      fs.writeFileSync(path.join(componentsDir, 'common/footer.html'), cleanFooter);
      console.log('✅ Extracted: Footer component');
    }
    
    console.log('\n🎉 Component extraction completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

extractComponents();