#!/usr/bin/env node

/**
 * Performance Monitoring and Budget Validation Script
 * 
 * This script monitors build performance, validates bundle sizes,
 * and provides performance metrics for the Ralph Web project.
 * 
 * Usage:
 *   node scripts/performance-monitor.js [--build] [--analyze] [--budget]
 * 
 * Features:
 * - Bundle size analysis
 * - Performance budget validation
 * - Lighthouse CI integration ready
 * - Web Vitals monitoring setup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');

// Performance budgets (in bytes)
const PERFORMANCE_BUDGETS = {
  // Total bundle size limits
  totalJavaScript: 500 * 1024, // 500KB
  totalCSS: 200 * 1024, // 200KB
  totalImages: 2 * 1024 * 1024, // 2MB
  totalFonts: 300 * 1024, // 300KB
  
  // Individual file limits
  maxJavaScriptFile: 200 * 1024, // 200KB
  maxCSSFile: 100 * 1024, // 100KB
  maxImageFile: 500 * 1024, // 500KB
  
  // Performance metrics targets
  firstContentfulPaint: 1500, // 1.5s
  largestContentfulPaint: 2500, // 2.5s
  firstInputDelay: 100, // 100ms
  cumulativeLayoutShift: 0.1, // 0.1
  totalBlockingTime: 200, // 200ms
};

class PerformanceMonitor {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalSize: 0,
      assetCounts: {},
      largestFiles: [],
    };
  }

  /**
   * Analyze the built assets for performance
   */
  async analyzeAssets() {
    console.log('🔍 Analyzing build assets...\n');

    if (!fs.existsSync(docsDir)) {
      this.errors.push('Build directory not found. Run npm run build first.');
      return;
    }

    const assetStats = this.getAssetStatistics(docsDir);
    this.validateBudgets(assetStats);
    this.generateReport(assetStats);
  }

  /**
   * Recursively analyze all files in the build directory
   */
  getAssetStatistics(dir, stats = { files: [], totalSize: 0, types: {} }) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const fileStat = fs.statSync(filePath);

      if (fileStat.isDirectory()) {
        this.getAssetStatistics(filePath, stats);
      } else {
        const ext = path.extname(file).toLowerCase();
        const size = fileStat.size;
        const relativePath = path.relative(docsDir, filePath);

        stats.files.push({
          path: relativePath,
          size,
          ext,
          gzipSize: this.estimateGzipSize(size),
        });

        stats.totalSize += size;
        stats.types[ext] = (stats.types[ext] || 0) + size;
      }
    }

    return stats;
  }

  /**
   * Estimate gzipped size (rough approximation)
   */
  estimateGzipSize(size) {
    return Math.round(size * 0.3); // Rough estimate: 30% of original size
  }

  /**
   * Validate against performance budgets
   */
  validateBudgets(assetStats) {
    console.log('📊 Validating performance budgets...\n');

    // Categorize assets
    const jsSize = this.getSizeByExtensions(assetStats, ['.js', '.mjs']);
    const cssSize = this.getSizeByExtensions(assetStats, ['.css']);
    const imageSize = this.getSizeByExtensions(assetStats, ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']);
    const fontSize = this.getSizeByExtensions(assetStats, ['.woff', '.woff2', '.ttf', '.eot']);

    // Check total budgets
    this.checkBudget('Total JavaScript', jsSize, PERFORMANCE_BUDGETS.totalJavaScript);
    this.checkBudget('Total CSS', cssSize, PERFORMANCE_BUDGETS.totalCSS);
    this.checkBudget('Total Images', imageSize, PERFORMANCE_BUDGETS.totalImages);
    this.checkBudget('Total Fonts', fontSize, PERFORMANCE_BUDGETS.totalFonts);

    // Check individual file budgets
    const largestJS = this.getLargestFileByType(assetStats, ['.js', '.mjs']);
    const largestCSS = this.getLargestFileByType(assetStats, ['.css']);
    const largestImage = this.getLargestFileByType(assetStats, ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);

    if (largestJS) {
      this.checkBudget('Largest JavaScript file', largestJS.size, PERFORMANCE_BUDGETS.maxJavaScriptFile, largestJS.path);
    }
    if (largestCSS) {
      this.checkBudget('Largest CSS file', largestCSS.size, PERFORMANCE_BUDGETS.maxCSSFile, largestCSS.path);
    }
    if (largestImage) {
      this.checkBudget('Largest Image file', largestImage.size, PERFORMANCE_BUDGETS.maxImageFile, largestImage.path);
    }

    console.log('');
  }

  /**
   * Get total size for specific file extensions
   */
  getSizeByExtensions(assetStats, extensions) {
    return assetStats.files
      .filter(file => extensions.includes(file.ext))
      .reduce((total, file) => total + file.size, 0);
  }

  /**
   * Get the largest file of specific types
   */
  getLargestFileByType(assetStats, extensions) {
    return assetStats.files
      .filter(file => extensions.includes(file.ext))
      .sort((a, b) => b.size - a.size)[0];
  }

  /**
   * Check if a metric is within budget
   */
  checkBudget(name, actual, budget, filename = '') {
    const percentage = (actual / budget) * 100;
    const actualKB = Math.round(actual / 1024);
    const budgetKB = Math.round(budget / 1024);
    const status = actual <= budget ? '✅' : '❌';
    const fileInfo = filename ? ` (${filename})` : '';

    console.log(`${status} ${name}: ${actualKB}KB / ${budgetKB}KB (${percentage.toFixed(1)}%)${fileInfo}`);

    if (actual > budget) {
      this.errors.push(`${name} exceeds budget: ${actualKB}KB > ${budgetKB}KB${fileInfo}`);
    } else if (percentage > 80) {
      this.warnings.push(`${name} approaching budget limit: ${actualKB}KB / ${budgetKB}KB${fileInfo}`);
    }
  }

  /**
   * Generate detailed performance report
   */
  generateReport(assetStats) {
    console.log('\n📈 Performance Report\n');

    // Overall statistics
    console.log('Overall Statistics:');
    console.log(`- Total files: ${assetStats.files.length}`);
    console.log(`- Total size: ${Math.round(assetStats.totalSize / 1024)}KB`);
    console.log(`- Estimated gzipped: ${Math.round(assetStats.files.reduce((total, file) => total + file.gzipSize, 0) / 1024)}KB`);
    console.log('');

    // Largest files
    console.log('Largest Files:');
    assetStats.files
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .forEach((file, index) => {
        console.log(`${index + 1}. ${file.path} - ${Math.round(file.size / 1024)}KB`);
      });
    console.log('');

    // File type breakdown
    console.log('File Type Breakdown:');
    Object.entries(assetStats.types)
      .sort(([,a], [,b]) => b - a)
      .forEach(([ext, size]) => {
        const percentage = (size / assetStats.totalSize) * 100;
        console.log(`- ${ext || 'no extension'}: ${Math.round(size / 1024)}KB (${percentage.toFixed(1)}%)`);
      });
    console.log('');

    // Optimization recommendations
    this.generateOptimizationRecommendations(assetStats);
  }

  /**
   * Generate optimization recommendations
   */
  generateOptimizationRecommendations(assetStats) {
    console.log('💡 Optimization Recommendations:\n');

    const jsFiles = assetStats.files.filter(f => ['.js', '.mjs'].includes(f.ext));
    const cssFiles = assetStats.files.filter(f => f.ext === '.css');
    const imageFiles = assetStats.files.filter(f => ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'].includes(f.ext));

    // JavaScript recommendations
    if (jsFiles.length > 0) {
      const totalJS = jsFiles.reduce((total, file) => total + file.size, 0);
      if (totalJS > PERFORMANCE_BUDGETS.totalJavaScript * 0.8) {
        console.log('🔧 JavaScript Optimizations:');
        console.log('  - Consider code splitting for large components');
        console.log('  - Use dynamic imports for non-critical features');
        console.log('  - Review and remove unused dependencies');
        console.log('  - Implement tree shaking for better bundle optimization');
        console.log('');
      }
    }

    // CSS recommendations
    if (cssFiles.length > 0) {
      const totalCSS = cssFiles.reduce((total, file) => total + file.size, 0);
      if (totalCSS > PERFORMANCE_BUDGETS.totalCSS * 0.8) {
        console.log('🎨 CSS Optimizations:');
        console.log('  - Remove unused CSS classes');
        console.log('  - Consider CSS-in-JS for component-scoped styles');
        console.log('  - Use CSS custom properties for better compression');
        console.log('  - Inline critical CSS for above-the-fold content');
        console.log('');
      }
    }

    // Image recommendations
    if (imageFiles.length > 0) {
      const largeImages = imageFiles.filter(f => f.size > 100 * 1024); // > 100KB
      if (largeImages.length > 0) {
        console.log('🖼️  Image Optimizations:');
        console.log('  - Convert large images to WebP or AVIF format');
        console.log('  - Implement responsive images with srcset');
        console.log('  - Use lazy loading for below-the-fold images');
        console.log('  - Consider using a CDN for image delivery');
        console.log('');
      }
    }

    // General recommendations
    console.log('⚡ General Performance Tips:');
    console.log('  - Implement service worker for caching');
    console.log('  - Use resource hints (preload, prefetch, preconnect)');
    console.log('  - Enable gzip/brotli compression on server');
    console.log('  - Monitor Core Web Vitals in production');
    console.log('');
  }

  /**
   * Generate Lighthouse CI configuration
   */
  generateLighthouseConfig() {
    const config = {
      ci: {
        collect: {
          url: ['https://zitrono.github.io/ralph-web/'],
          startServerCommand: 'npm run preview',
          startServerReadyPattern: 'Local:',
        },
        assert: {
          preset: 'lighthouse:recommended',
          assertions: {
            'first-contentful-paint': ['error', { maxNumericValue: PERFORMANCE_BUDGETS.firstContentfulPaint }],
            'largest-contentful-paint': ['error', { maxNumericValue: PERFORMANCE_BUDGETS.largestContentfulPaint }],
            'first-input-delay': ['error', { maxNumericValue: PERFORMANCE_BUDGETS.firstInputDelay }],
            'cumulative-layout-shift': ['error', { maxNumericValue: PERFORMANCE_BUDGETS.cumulativeLayoutShift }],
            'total-blocking-time': ['error', { maxNumericValue: PERFORMANCE_BUDGETS.totalBlockingTime }],
            'speed-index': ['warn', { maxNumericValue: 3000 }],
            'interactive': ['warn', { maxNumericValue: 3000 }],
          },
        },
        upload: {
          target: 'temporary-public-storage',
        },
      },
    };

    const configPath = path.join(rootDir, 'lighthouserc.js');
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};`);
    console.log(`📋 Generated Lighthouse CI config: ${configPath}`);
  }

  /**
   * Run the performance monitoring
   */
  async run() {
    console.log('🚀 Ralph Web Performance Monitor\n');

    await this.analyzeAssets();
    this.generateLighthouseConfig();

    // Final summary
    console.log('\n📋 Summary\n');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All performance budgets are within limits!');
    } else {
      if (this.errors.length > 0) {
        console.log('❌ Performance Budget Violations:');
        this.errors.forEach(error => console.log(`  - ${error}`));
        console.log('');
      }

      if (this.warnings.length > 0) {
        console.log('⚠️  Performance Budget Warnings:');
        this.warnings.forEach(warning => console.log(`  - ${warning}`));
        console.log('');
      }
    }

    console.log('Next Steps:');
    console.log('  - Run `npx lighthouse-ci autorun` for detailed performance testing');
    console.log('  - Monitor Core Web Vitals in production');
    console.log('  - Set up automated performance monitoring in CI/CD');
    console.log('');

    // Exit with error code if there are budget violations
    if (this.errors.length > 0) {
      process.exit(1);
    }
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const shouldBuild = args.includes('--build');
const shouldAnalyze = args.includes('--analyze') || args.length === 0;

async function main() {
  try {
    if (shouldBuild) {
      console.log('🔨 Building project...\n');
      execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
      console.log('');
    }

    if (shouldAnalyze) {
      const monitor = new PerformanceMonitor();
      await monitor.run();
    }
  } catch (error) {
    console.error('❌ Performance monitoring failed:', error.message);
    process.exit(1);
  }
}

main();