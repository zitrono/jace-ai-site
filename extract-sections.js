#!/usr/bin/env node

import fs from 'fs';

const html = fs.readFileSync('../index.html', 'utf8');

// Find major sections by looking for distinctive headings and content
const sections = [];

// Look for Features section
const featuresMatch = html.match(/<h2[^>]*>.*?Features.*?<\/h2>[\s\S]*?(?=<section|<footer|$)/i);
if (featuresMatch) {
  sections.push({ name: 'Features', content: featuresMatch[0].substring(0, 500) + '...' });
}

// Look for Pricing section
const pricingMatch = html.match(/<h2[^>]*>.*?Pricing.*?<\/h2>[\s\S]*?(?=<section|<footer|$)/i);
if (pricingMatch) {
  sections.push({ name: 'Pricing', content: pricingMatch[0].substring(0, 500) + '...' });
}

// Look for Testimonials
const testimonialsMatch = html.match(
  /<h2[^>]*>.*?Testimonial.*?<\/h2>[\s\S]*?(?=<section|<footer|$)/i
);
if (testimonialsMatch) {
  sections.push({ name: 'Testimonials', content: testimonialsMatch[0].substring(0, 500) + '...' });
}

// Look for FAQ
const faqMatch = html.match(/<h2[^>]*>.*?FAQ.*?<\/h2>[\s\S]*?(?=<section|<footer|$)/i);
if (faqMatch) {
  sections.push({ name: 'FAQ', content: faqMatch[0].substring(0, 500) + '...' });
}

// Look for Footer
const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
if (footerMatch) {
  sections.push({ name: 'Footer', content: footerMatch[0].substring(0, 500) + '...' });
}

console.log('Found sections:');
sections.forEach((section) => {
  console.log(`\n${section.name}:`);
  console.log(section.content);
});
