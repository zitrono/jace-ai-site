#!/usr/bin/env node

/**
 * Enhanced Company Logo Downloader Utility
 * Advanced version with bypass techniques, multiple sources, and testing integration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class EnhancedLogoDownloader {
  constructor() {
    this.outputDir = path.join(__dirname);
    this.proxyList = []; // Add proxy rotation if needed
    this.userAgents = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ];
    
    this.sources = {
      worldvectorlogo: {
        base: 'https://cdn.worldvectorlogo.com/logos',
        patterns: ['{name}.svg', '{name}-2.svg', '{name}-1.svg', '{name}-logo.svg']
      },
      simpleicons: {
        base: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons',
        patterns: ['{name}.svg']
      },
      svgrepo: {
        base: 'https://www.svgrepo.com/download',
        patterns: ['{id}/{name}.svg'] // Requires ID lookup
      },
      logowik: {
        base: 'https://logowik.com/content/uploads',
        patterns: ['{name}-logo-vector.svg', '{name}-vector-logo.svg']
      },
      iconscout: {
        base: 'https://cdn.iconscout.com/icon/free/svg',
        patterns: ['{name}.svg', '{name}-logo.svg']
      }
    };
    
    // Company-specific known URLs for high-priority logos
    this.knownUrls = {
      'apple': ['https://cdn.worldvectorlogo.com/logos/apple-2.svg'],
      'google': ['https://cdn.worldvectorlogo.com/logos/google.svg'],
      'microsoft': ['https://cdn.worldvectorlogo.com/logos/microsoft-2.svg'],
      'facebook': ['https://cdn.worldvectorlogo.com/logos/facebook-2.svg'],
      'amazon': ['https://cdn.worldvectorlogo.com/logos/amazon-2.svg'],
      'goldman-sachs': ['https://cdn.worldvectorlogo.com/logos/goldman-sachs.svg'],
      'jp-morgan': ['https://cdn.worldvectorlogo.com/logos/jp-morgan.svg'],
      'bank-of-america': ['https://cdn.worldvectorlogo.com/logos/bank-of-america.svg']
    };
    
    this.ensureOutputDirectory();
  }

  ensureOutputDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Advanced company name cleaning with multiple variations
   */
  generateNameVariations(companyName) {
    const clean = companyName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim();

    const variations = new Set([
      // Basic cleaning
      clean.replace(/\s+/g, '-'),
      clean.replace(/\s+/g, ''),
      clean.replace(/\s+/g, '_'),
      
      // Remove common business suffixes
      clean.replace(/\s+(inc|corp|corporation|ltd|limited|llc|company|group)\s*$/g, '').replace(/\s+/g, '-'),
      clean.replace(/\s+(inc|corp|corporation|ltd|limited|llc|company|group)\s*$/g, '').replace(/\s+/g, ''),
      
      // Handle specific cases
      clean.replace('&', 'and').replace(/\s+/g, '-'),
      clean.replace(/\s+/g, '-').replace(/-+/g, '-'),
      
      // Acronym handling
      companyName.match(/\b[A-Z]{2,}\b/g)?.join('').toLowerCase(),
      
      // First word only
      clean.split(/\s+/)[0],
      
      // Remove 'the' prefix
      clean.replace(/^the\s+/, '').replace(/\s+/g, '-')
    ]);

    return Array.from(variations).filter(v => v && v.length > 1);
  }

  /**
   * Generate comprehensive URL list from all sources
   */
  generateUrls(companyName) {
    const variations = this.generateNameVariations(companyName);
    const urls = [];

    // Check known URLs first
    const cleanName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (this.knownUrls[cleanName]) {
      urls.push(...this.knownUrls[cleanName]);
    }

    // Generate URLs from all sources
    Object.values(this.sources).forEach(source => {
      variations.forEach(variant => {
        source.patterns.forEach(pattern => {
          const url = `${source.base}/${pattern.replace('{name}', variant)}`;
          urls.push(url);
        });
      });
    });

    return [...new Set(urls)]; // Remove duplicates
  }

  /**
   * Get random user agent for rotation
   */
  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  /**
   * Advanced wget with bypass techniques
   */
  async downloadWithWget(url, outputPath, attempt = 1) {
    const userAgent = this.getRandomUserAgent();
    const maxAttempts = 3;
    
    const wgetCmd = [
      'wget',
      '--quiet',
      '--user-agent', `"${userAgent}"`,
      '--referer', '"https://www.google.com/"',
      '--header', '"Accept: image/svg+xml,image/*,*/*;q=0.9"',
      '--header', '"Accept-Language: en-US,en;q=0.9"',
      '--header', '"Accept-Encoding: gzip, deflate, br"',
      '--header', '"DNT: 1"',
      '--header', '"Connection: keep-alive"',
      '--header', '"Upgrade-Insecure-Requests: 1"',
      `--timeout=${10 + attempt * 5}`, // Increase timeout on retries
      '--tries=1', // We handle retries manually
      '--wait=1',
      '--random-wait',
      '--no-check-certificate',
      '--follow-ftp',
      '-O', `"${outputPath}"`,
      `"${url}"`
    ].join(' ');

    try {
      execSync(wgetCmd, { stdio: 'pipe' });
      
      if (fs.existsSync(outputPath)) {
        const content = fs.readFileSync(outputPath, 'utf8');
        
        // Enhanced validation
        if (this.isValidSvg(content)) {
          return { success: true, content };
        } else if (this.isErrorPage(content)) {
          fs.unlinkSync(outputPath);
          return { success: false, error: 'Error page received' };
        }
      }
      
      return { success: false, error: 'No content received' };
    } catch (error) {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      
      if (attempt < maxAttempts) {
        console.log(`🔄 Retry ${attempt + 1}/${maxAttempts}: ${url}`);
        await this.sleep(1000 * attempt); // Progressive delay
        return this.downloadWithWget(url, outputPath, attempt + 1);
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Enhanced SVG validation
   */
  isValidSvg(content) {
    return content && 
           content.includes('<svg') && 
           content.includes('</svg>') &&
           content.length > 100 && // Minimum reasonable size
           !this.isErrorPage(content);
  }

  /**
   * Enhanced error page detection
   */
  isErrorPage(content) {
    const errorIndicators = [
      '404', 'not found', 'error', '<html', '<!doctype html',
      'page not found', 'file not found', 'access denied',
      'forbidden', '403', '500', 'internal server error'
    ];
    
    const lowerContent = content.toLowerCase();
    return errorIndicators.some(indicator => lowerContent.includes(indicator));
  }

  /**
   * Sleep utility for delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create enhanced fallback logo with better styling
   */
  createEnhancedTextLogo(companyName) {
    const filename = `${this.generateNameVariations(companyName)[0]}-logo.svg`;
    const outputPath = path.join(this.outputDir, filename);
    
    // Smart sizing based on text length
    const text = companyName.toUpperCase();
    const textLength = text.length;
    let fontSize, width;
    
    if (textLength <= 5) {
      fontSize = 20;
      width = Math.max(textLength * 16, 80);
    } else if (textLength <= 10) {
      fontSize = 18;
      width = Math.max(textLength * 14, 120);
    } else if (textLength <= 15) {
      fontSize = 16;
      width = Math.max(textLength * 12, 160);
    } else {
      fontSize = 14;
      width = Math.max(textLength * 10, 200);
    }
    
    const svgContent = `<svg width="${width}" height="40" viewBox="0 0 ${width} 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- ${companyName} Logo - Enhanced text version -->
  <defs>
    <style>
      .logo-text {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
    </style>
  </defs>
  <text x="0" y="26" class="logo-text" font-size="${fontSize}" fill="#FFFFFF">${text}</text>
</svg>`;

    fs.writeFileSync(outputPath, svgContent);
    console.log(`✅ ${companyName}: Enhanced text fallback created`);
    return { success: true, path: outputPath, source: 'enhanced-fallback' };
  }

  /**
   * Main download method with comprehensive error handling
   */
  async downloadLogo(companyName, options = {}) {
    const { forceUpdate = false, preferredUrls = [] } = options;
    const filename = `${this.generateNameVariations(companyName)[0]}-logo.svg`;
    const outputPath = path.join(this.outputDir, filename);

    // Skip if exists and not forcing update
    if (fs.existsSync(outputPath) && !forceUpdate) {
      console.log(`✅ ${companyName}: Already exists (use forceUpdate to refresh)`);
      return { success: true, path: outputPath, source: 'cached' };
    }

    const urls = preferredUrls.length > 0 ? preferredUrls : this.generateUrls(companyName);
    console.log(`🎯 ${companyName}: Trying ${urls.length} potential sources...`);
    
    let lastError = '';
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`🔄 [${i+1}/${urls.length}] ${url}`);
      
      const result = await this.downloadWithWget(url, outputPath);
      
      if (result.success) {
        console.log(`✅ ${companyName}: Downloaded from ${url}`);
        return { success: true, path: outputPath, source: url };
      }
      
      lastError = result.error;
      
      // Small delay between attempts to be respectful
      if (i < urls.length - 1) {
        await this.sleep(500 + Math.random() * 500);
      }
    }

    console.log(`⚠️  ${companyName}: All sources failed, creating enhanced fallback`);
    console.log(`   Last error: ${lastError}`);
    return this.createEnhancedTextLogo(companyName);
  }

  /**
   * Batch download with progress reporting
   */
  async downloadBatch(companies, options = {}) {
    const results = [];
    const total = companies.length;
    
    console.log(`🚀 Starting batch download for ${total} companies...\n`);
    
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      console.log(`\n[${i+1}/${total}] Processing: ${company}`);
      
      try {
        const result = await this.downloadLogo(company, options);
        results.push({ company, ...result });
      } catch (error) {
        console.error(`❌ ${company}: ${error.message}`);
        results.push({ company, success: false, error: error.message });
      }
      
      // Progress indicator
      const progress = Math.round(((i + 1) / total) * 100);
      console.log(`📊 Progress: ${progress}% (${i + 1}/${total})`);
    }
    
    return this.generateReport(results);
  }

  /**
   * Generate comprehensive download report
   */
  generateReport(results) {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const downloaded = successful.filter(r => r.source && !r.source.includes('fallback') && r.source !== 'cached');
    const fallbacks = successful.filter(r => r.source && r.source.includes('fallback'));
    const cached = successful.filter(r => r.source === 'cached');

    console.log('\n' + '='.repeat(60));
    console.log('📊 DOWNLOAD REPORT');
    console.log('='.repeat(60));
    console.log(`📈 Total Companies: ${results.length}`);
    console.log(`✅ Successful: ${successful.length} (${Math.round(successful.length/results.length*100)}%)`);
    console.log(`📥 Real Logos Downloaded: ${downloaded.length}`);
    console.log(`📝 Text Fallbacks Created: ${fallbacks.length}`);
    console.log(`💾 Cached (Skipped): ${cached.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    
    if (downloaded.length > 0) {
      console.log('\n✅ Successfully Downloaded:');
      downloaded.forEach(r => {
        const domain = new URL(r.source).hostname;
        console.log(`   • ${r.company} (${domain})`);
      });
    }
    
    if (fallbacks.length > 0) {
      console.log('\n📝 Text Fallbacks Generated:');
      fallbacks.forEach(r => console.log(`   • ${r.company}`));
    }
    
    if (failed.length > 0) {
      console.log('\n❌ Failed Downloads:');
      failed.forEach(r => console.log(`   • ${r.company}: ${r.error}`));
    }

    console.log('\n' + '='.repeat(60));
    
    return results;
  }

  /**
   * Test downloaded logos (prepare for Puppeteer verification)
   */
  generateTestPage(results) {
    const testPagePath = path.join(this.outputDir, 'test-results.html');
    
    const logoCards = results
      .filter(r => r.success)
      .map(r => {
        const logoSrc = path.basename(r.path);
        const statusClass = r.source.includes('fallback') ? 'fallback' : 'success';
        const statusText = r.source.includes('fallback') ? 'Text Fallback' : 'Downloaded Logo';
        
        return `
        <div class="logo-card">
          <img src="${logoSrc}" alt="${r.company} Logo" class="logo-image" onerror="this.style.display='none'">
          <div class="logo-name">${r.company}</div>
          <div class="logo-status ${statusClass}">${statusText}</div>
        </div>`;
      }).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Logo Download Results</title>
    <style>
        body { font-family: Arial, sans-serif; background: #1a1a1a; color: white; padding: 20px; margin: 0; }
        .logo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px; }
        .logo-card { background: #2a2a2a; border: 1px solid #444; border-radius: 8px; padding: 20px; text-align: center; transition: transform 0.2s; }
        .logo-card:hover { transform: scale(1.05); }
        .logo-image { max-width: 100%; max-height: 60px; width: auto; height: auto; filter: brightness(0) invert(1); margin-bottom: 10px; }
        .logo-name { font-weight: bold; margin-bottom: 5px; }
        .logo-status { font-size: 12px; color: #888; }
        .success { color: #4ade80; }
        .fallback { color: #fbbf24; }
        .error { color: #ef4444; }
        h1 { text-align: center; color: #fbbf24; }
    </style>
</head>
<body>
    <h1>📦 Enhanced Logo Download Results</h1>
    <div class="logo-grid">${logoCards}</div>
    
    <script>
        document.querySelectorAll('.logo-image').forEach(img => {
            img.addEventListener('load', () => console.log('Loaded:', img.src));
            img.addEventListener('error', function() {
                console.error('Failed:', this.src);
                this.parentElement.querySelector('.logo-status').textContent = 'Failed to Load';
                this.parentElement.querySelector('.logo-status').className = 'logo-status error';
            });
        });
    </script>
</body>
</html>`;

    fs.writeFileSync(testPagePath, html);
    console.log(`🧪 Test page created: ${testPagePath}`);
    return testPagePath;
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const downloader = new EnhancedLogoDownloader();

  if (args.length === 0) {
    console.log(`
📦 Enhanced Company Logo Downloader

Usage:
  node logo-downloader-enhanced.cjs <company1> [company2] [company3]...
  
Examples:
  node logo-downloader-enhanced.cjs "Apple" "Google" "Microsoft"
  node logo-downloader-enhanced.cjs "Goldman Sachs" "JP Morgan" "Bank of America"

Features:
  ✅ Multi-source aggregation (WorldVectorLogo, Simple Icons, etc.)
  ✅ Advanced anti-blocking techniques
  ✅ Smart fallback generation  
  ✅ Comprehensive error handling
  ✅ Progress reporting
  ✅ Puppeteer test page generation
  ✅ User agent rotation
  ✅ Enhanced SVG validation
    `);
    process.exit(0);
  }

  // Run enhanced download
  (async () => {
    const results = await downloader.downloadBatch(args);
    const testPage = downloader.generateTestPage(results);
    
    console.log(`\n🧪 Puppeteer Test Command:`);
    console.log(`   mcp__puppeteer__navigate({ url: 'file://${testPage}' })`);
    console.log(`   mcp__puppeteer__screenshot({ name: 'logo-test-results', width: 1200, height: 800 })`);
  })();
}

module.exports = EnhancedLogoDownloader;