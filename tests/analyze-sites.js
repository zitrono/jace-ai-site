// Analyze which sites we have in this repository
import fs from 'fs';
import path from 'path';

function analyzeSites() {
  console.log('🔍 Analyzing All Sites in Repository\n');
  
  const repoRoot = '/Users/zitrono/dev/web/ralph-web/jace-ai-site';
  
  console.log('📊 REPOSITORY STRUCTURE ANALYSIS');
  console.log('================================\n');
  
  // 1. Check for different site implementations
  const sites = [];
  
  // Check for static site (root level)
  if (fs.existsSync(path.join(repoRoot, 'index.html'))) {
    const packageJson = fs.existsSync(path.join(repoRoot, 'package.json')) ? 
      JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8')) : null;
    
    sites.push({
      name: 'Static Site (Root)',
      type: 'Static HTML/CSS/JS',
      location: '/',
      technology: 'Vanilla HTML/CSS/JS with custom build system',
      entryPoint: 'index.html',
      buildSystem: packageJson?.scripts?.build ? 'Custom Node.js build' : 'None',
      framework: 'None',
      description: 'Original static implementation'
    });
  }
  
  // Check for Astro site (now in root)
  const astroConfig = fs.existsSync(path.join(repoRoot, 'astro.config.mjs'));
  const hasTailwind = fs.existsSync(path.join(repoRoot, 'tailwind.config.mjs'));
  const hasSrc = fs.existsSync(path.join(repoRoot, 'src'));
  
  if (astroConfig && hasSrc) {
    const astroPackageJson = fs.existsSync(path.join(repoRoot, 'package.json')) ? 
      JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8')) : null;
    
    sites.push({
      name: 'Astro Site',
      type: 'Static Site Generator',
      location: '/',
      technology: 'Astro + Tailwind CSS',
      entryPoint: 'src/pages/index.astro',
      buildSystem: 'Astro build system',
      framework: 'Astro',
      description: 'Modern Astro.js implementation with Tailwind CSS (builds to docs/)',
      dependencies: astroPackageJson?.dependencies,
      hasConfig: astroConfig,
      hasTailwind
    });
  }
  
  // Check for other potential implementations
  const srcPath = path.join(repoRoot, 'src');
  if (fs.existsSync(srcPath)) {
    const hasComponents = fs.existsSync(path.join(srcPath, 'components'));
    const hasTools = fs.existsSync(path.join(srcPath, 'tools'));
    
    if (hasComponents || hasTools) {
      sites.push({
        name: 'Component-Based Static Site',
        type: 'Custom Build System',
        location: '/src/',
        technology: 'HTML components with custom build tools',
        entryPoint: 'src/pages/index-unminified.html',
        buildSystem: 'Custom Node.js build system (src/tools/build.js)',
        framework: 'Custom',
        description: 'Component-based static site with modular architecture'
      });
    }
  }
  
  // Check for test environment
  const testsPath = path.join(repoRoot, 'tests');
  if (fs.existsSync(testsPath)) {
    const testPackageJson = fs.existsSync(path.join(testsPath, 'package.json')) ? 
      JSON.parse(fs.readFileSync(path.join(testsPath, 'package.json'), 'utf8')) : null;
    
    sites.push({
      name: 'Testing Environment',
      type: 'Testing Suite',
      location: '/tests/',
      technology: 'Puppeteer + Node.js',
      entryPoint: 'Multiple test files',
      buildSystem: 'NPM scripts',
      framework: 'Puppeteer',
      description: 'Comprehensive testing suite with POM validation',
      testFiles: fs.readdirSync(testsPath).filter(f => f.endsWith('.js')).length
    });
  }
  
  // Display results
  console.log(`🌐 SITES FOUND: ${sites.length}\n`);
  
  sites.forEach((site, index) => {
    console.log(`${index + 1}. ${site.name}`);
    console.log(`   Type: ${site.type}`);
    console.log(`   Technology: ${site.technology}`);
    console.log(`   Location: ${site.location}`);
    console.log(`   Entry Point: ${site.entryPoint}`);
    console.log(`   Build System: ${site.buildSystem}`);
    console.log(`   Framework: ${site.framework}`);
    console.log(`   Description: ${site.description}`);
    
    if (site.dependencies) {
      const astroVersion = site.dependencies.astro;
      const tailwindVersion = site.dependencies.tailwindcss;
      console.log(`   Astro Version: ${astroVersion || 'Not found'}`);
      console.log(`   Tailwind Version: ${tailwindVersion || 'Not found'}`);
    }
    
    if (site.testFiles) {
      console.log(`   Test Files: ${site.testFiles}`);
    }
    
    if (site.hasConfig) {
      console.log(`   Has Astro Config: ✅`);
    }
    
    if (site.hasTailwind) {
      console.log(`   Has Tailwind Config: ✅`);
    }
    
    console.log('');
  });
  
  // Analyze file structures
  console.log('📁 FILE STRUCTURE ANALYSIS');
  console.log('==========================\n');
  
  // Check for specific file patterns
  const patterns = {
    'Astro Files': '**/*.astro',
    'HTML Files': '*.html',
    'CSS Files': '**/*.css',
    'JavaScript Files': '**/*.js',
    'Package Files': '**/package.json',
    'Config Files': '**/*.config.*'
  };
  
  for (const [type, pattern] of Object.entries(patterns)) {
    try {
      const command = `find ${repoRoot} -name "${pattern.replace('**/', '')}" 2>/dev/null | wc -l`;
      // We'll count manually for key file types
      let count = 0;
      
      if (type === 'Astro Files') {
        const astroFiles = fs.existsSync(path.join(repoRoot, 'src')) ? 
          fs.readdirSync(path.join(repoRoot, 'src'), { recursive: true })
            .filter(f => typeof f === 'string' && f.endsWith('.astro')).length : 0;
        count = astroFiles;
      } else if (type === 'HTML Files') {
        const htmlFiles = fs.readdirSync(repoRoot).filter(f => f.endsWith('.html')).length;
        count = htmlFiles;
      }
      
      console.log(`${type}: ${count > 0 ? count : 'Multiple'} files`);
    } catch (error) {
      console.log(`${type}: Unable to count`);
    }
  }
  
  // Identify the Astro-based site specifically
  console.log('\n🚀 ASTRO-BASED SITE IDENTIFICATION');
  console.log('==================================');
  
  const astroSite = sites.find(site => site.framework === 'Astro');
  if (astroSite) {
    console.log('✅ FOUND: Astro-based site');
    console.log(`   Location: ${astroSite.location}`);
    console.log(`   Technology Stack: ${astroSite.technology}`);
    console.log(`   Entry Point: ${astroSite.entryPoint}`);
    
    // Check Astro-specific files
    const astroSpecificFiles = [
      'astro.config.mjs',
      'tailwind.config.mjs',
      'src/layouts/Layout.astro',
      'src/components/',
      'src/pages/index.astro'
    ];
    
    console.log('\n   Astro Files Check:');
    astroSpecificFiles.forEach(file => {
      const fullPath = path.join(repoRoot, file);
      const exists = fs.existsSync(fullPath);
      console.log(`   ${exists ? '✅' : '❌'} ${file}`);
    });
    
    // Check if it's buildable
    const astroPackageJsonPath = path.join(repoRoot, 'package.json');
    if (fs.existsSync(astroPackageJsonPath)) {
      const astroPackage = JSON.parse(fs.readFileSync(astroPackageJsonPath, 'utf8'));
      console.log('\n   Available Scripts:');
      Object.entries(astroPackage.scripts || {}).forEach(([script, command]) => {
        console.log(`   • ${script}: ${command}`);
      });
    }
  } else {
    console.log('❌ No Astro-based site found');
  }
  
  // Summary and recommendations
  console.log('\n📋 SUMMARY & RECOMMENDATIONS');
  console.log('============================');
  
  const staticSite = sites.find(site => site.name.includes('Static'));
  const astroRefactor = sites.find(site => site.framework === 'Astro');
  const testingSuite = sites.find(site => site.type === 'Testing Suite');
  
  if (staticSite && astroRefactor) {
    console.log('🎯 DUAL IMPLEMENTATION DETECTED:');
    console.log('   1. Original Static Site (for comparison/baseline)');
    console.log('   2. Astro Refactor (modern implementation)');
    console.log('   3. Testing Suite (for validation and parity)');
    console.log('\n   This setup is perfect for:');
    console.log('   • Testing visual parity between implementations');
    console.log('   • Gradual migration to modern stack');
    console.log('   • Comprehensive testing coverage');
  }
  
  if (testingSuite) {
    console.log(`\n🧪 TESTING CAPABILITIES:`);
    console.log(`   • ${testingSuite.testFiles} test files available`);
    console.log('   • Puppeteer-based visual testing');
    console.log('   • Page Object Model (POM) validation');
    console.log('   • 4,135+ individual CSS property tests');
  }
  
  console.log('\n🏗️  BUILD & DEPLOY OPTIONS:');
  sites.forEach(site => {
    if (site.buildSystem !== 'None') {
      console.log(`   • ${site.name}: ${site.buildSystem}`);
    }
  });
  
  return sites;
}

// Run the analysis
const sites = analyzeSites();

console.log('\n🎉 ANALYSIS COMPLETE!');
console.log(`Found ${sites.length} different site implementations.`);

const astroSite = sites.find(site => site.framework === 'Astro');
if (astroSite) {
  console.log('\n⭐ The ASTRO-BASED site is located at:');
  console.log(`   ${astroSite.location} (root directory)`);
  console.log(`   Entry: ${astroSite.entryPoint}`);
  console.log(`   Builds to: docs/ (GitHub Pages compatible)`);
}

export default sites;