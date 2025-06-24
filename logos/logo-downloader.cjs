#!/usr/bin/env node

/**
 * Company Logo Downloader Utility
 * Downloads SVG logos from multiple sources with smart fallbacks
 * Bypasses common blocks and provides reliable logo acquisition
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class LogoDownloader {
  constructor() {
    this.outputDir = path.join(__dirname);
    this.userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    this.sources = {
      worldvectorlogo: 'https://cdn.worldvectorlogo.com/logos',
      seeklogo: 'https://seeklogo.com/images',
      svgrepo: 'https://www.svgrepo.com/show',
      vectorlogo: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons',
    };

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Clean company name for URL usage
   */
  cleanCompanyName(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Generate potential logo URLs for a company
   */
  generateUrls(companyName) {
    const clean = this.cleanCompanyName(companyName);
    const variations = [
      clean,
      clean + '-logo',
      clean + '-icon',
      clean.replace('-', ''),
      companyName.toLowerCase().replace(/\s+/g, ''),
      companyName.toLowerCase().replace(/\s+/g, '-'),
    ];

    const urls = [];

    // WorldVectorLogo patterns
    variations.forEach((variant) => {
      urls.push(`${this.sources.worldvectorlogo}/${variant}.svg`);
      urls.push(`${this.sources.worldvectorlogo}/${variant}-2.svg`);
      urls.push(`${this.sources.worldvectorlogo}/${variant}-1.svg`);
    });

    // Simple Icons (via CDN)
    urls.push(`${this.sources.vectorlogo}/${clean}.svg`);

    return [...new Set(urls)]; // Remove duplicates
  }

  /**
   * Download logo with wget using anti-blocking techniques
   */
  async downloadLogo(companyName, customUrls = []) {
    const filename = `${this.cleanCompanyName(companyName)}-logo.svg`;
    const outputPath = path.join(this.outputDir, filename);

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${companyName}: Already exists`);
      return { success: true, path: outputPath, source: 'cached' };
    }

    const urls = customUrls.length > 0 ? customUrls : this.generateUrls(companyName);

    for (const url of urls) {
      try {
        console.log(`🔄 Trying: ${url}`);

        // wget command with anti-blocking measures
        const wgetCmd = [
          'wget',
          '--quiet',
          '--user-agent',
          `"${this.userAgent}"`,
          '--referer',
          '"https://www.google.com/"',
          '--header',
          '"Accept: image/svg+xml,image/*,*/*"',
          '--header',
          '"Accept-Language: en-US,en;q=0.9"',
          '--header',
          '"Cache-Control: no-cache"',
          '--timeout=10',
          '--tries=2',
          '--wait=1',
          '--random-wait',
          '--no-check-certificate',
          '-O',
          `"${outputPath}"`,
          `"${url}"`,
        ].join(' ');

        execSync(wgetCmd, { stdio: 'pipe' });

        // Verify download
        if (fs.existsSync(outputPath)) {
          const content = fs.readFileSync(outputPath, 'utf8');

          // Check if it's a valid SVG
          if (content.includes('<svg') && content.includes('</svg>')) {
            console.log(`✅ ${companyName}: Downloaded from ${url}`);
            return { success: true, path: outputPath, source: url };
          } else if (
            content.includes('404') ||
            content.includes('error') ||
            content.includes('<html')
          ) {
            // Remove invalid file
            fs.unlinkSync(outputPath);
            continue;
          }
        }
      } catch (error) {
        // Clean up failed download
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
        continue;
      }
    }

    // If all sources fail, create a text-based logo
    console.log(`⚠️  ${companyName}: Creating fallback text logo`);
    return this.createTextLogo(companyName);
  }

  /**
   * Create a fallback text-based SVG logo
   */
  createTextLogo(companyName) {
    const filename = `${this.cleanCompanyName(companyName)}-logo.svg`;
    const outputPath = path.join(this.outputDir, filename);

    // Determine text size based on company name length
    const textLength = companyName.length;
    const fontSize = textLength > 15 ? 14 : textLength > 10 ? 16 : 18;
    const width = Math.max(textLength * (fontSize * 0.6), 120);

    const svgContent = `<svg width="${width}" height="40" viewBox="0 0 ${width} 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- ${companyName} Logo - White text for dark backgrounds -->
  <text x="0" y="25" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" fill="#FFFFFF">${companyName.toUpperCase()}</text>
</svg>`;

    fs.writeFileSync(outputPath, svgContent);
    console.log(`✅ ${companyName}: Created text fallback`);
    return { success: true, path: outputPath, source: 'fallback' };
  }

  /**
   * Download multiple logos
   */
  async downloadMultiple(companies) {
    const results = [];

    for (const company of companies) {
      try {
        const result = await this.downloadLogo(company);
        results.push({ company, ...result });
      } catch (error) {
        console.error(`❌ ${company}: ${error.message}`);
        results.push({ company, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Search and download from specific known patterns
   */
  async downloadSpecific(companyName, specificUrls) {
    return this.downloadLogo(companyName, specificUrls);
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const downloader = new LogoDownloader();

  if (args.length === 0) {
    console.log(`
📦 Company Logo Downloader

Usage:
  node logo-downloader.js <company1> [company2] [company3]...
  node logo-downloader.js "Apple Inc" "Microsoft Corporation" "Google"

Examples:
  node logo-downloader.js Apple Microsoft Google
  node logo-downloader.js "Goldman Sachs" "JP Morgan" "Morgan Stanley"

Features:
  ✅ Multiple source fallbacks
  ✅ Anti-blocking measures  
  ✅ SVG validation
  ✅ Text fallback generation
  ✅ Duplicate detection
    `);
    process.exit(0);
  }

  // Download requested logos
  (async () => {
    console.log(`🚀 Starting download for ${args.length} companies...\n`);

    const results = await downloader.downloadMultiple(args);

    // Summary
    console.log('\n📊 Download Summary:');
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log(`✅ Successful: ${successful.length}`);
    if (failed.length > 0) {
      console.log(`❌ Failed: ${failed.length}`);
      failed.forEach((f) => console.log(`   - ${f.company}: ${f.error}`));
    }

    successful.forEach((s) => {
      console.log(`   - ${s.company}: ${s.source === 'fallback' ? 'Text fallback' : 'Downloaded'}`);
    });
  })();
}

module.exports = LogoDownloader;
