#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function unminifyHTML(htmlContent) {
  let formatted = htmlContent;
  
  // Add newlines after major HTML tags
  formatted = formatted
    .replace(/></g, '>\n<')
    .replace(/<!DOCTYPE html>/g, '<!DOCTYPE html>\n')
    .replace(/<html/g, '\n<html')
    .replace(/<head>/g, '\n<head>\n')
    .replace(/<\/head>/g, '\n</head>\n')
    .replace(/<body/g, '\n<body')
    .replace(/<\/body>/g, '\n</body>\n')
    .replace(/<\/html>/g, '\n</html>')
    .replace(/<main>/g, '\n<main>\n')
    .replace(/<\/main>/g, '\n</main>\n')
    .replace(/<header/g, '\n<header')
    .replace(/<\/header>/g, '\n</header>\n')
    .replace(/<nav/g, '\n<nav')
    .replace(/<\/nav>/g, '\n</nav>\n')
    .replace(/<footer/g, '\n<footer')
    .replace(/<\/footer>/g, '\n</footer>\n')
    .replace(/<section/g, '\n<section')
    .replace(/<\/section>/g, '\n</section>\n')
    .replace(/<div class="/g, '\n<div class="')
    .replace(/<h1/g, '\n<h1')
    .replace(/<h2/g, '\n<h2')
    .replace(/<h3/g, '\n<h3')
    .replace(/<p /g, '\n<p ')
    .replace(/<script/g, '\n<script')
    .replace(/<\/script>/g, '</script>\n')
    .replace(/<link/g, '\n<link')
    .replace(/<meta/g, '\n<meta');
  
  // Clean up extra newlines
  formatted = formatted
    .replace(/\n\n+/g, '\n')
    .replace(/^\n+/, '')
    .replace(/\n+$/, '\n');
  
  return formatted;
}

// Read the minified HTML file
const inputFile = path.join(__dirname, '../../index.html');
const outputFile = path.join(__dirname, '../pages/index-unminified.html');

try {
  const htmlContent = fs.readFileSync(inputFile, 'utf8');
  const unminified = unminifyHTML(htmlContent);
  
  fs.writeFileSync(outputFile, unminified);
  console.log(`✅ Unminified HTML saved to: ${outputFile}`);
  console.log(`📊 Original size: ${htmlContent.length} characters`);
  console.log(`📊 Formatted size: ${unminified.length} characters`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}