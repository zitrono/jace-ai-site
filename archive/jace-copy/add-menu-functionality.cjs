const fs = require('fs');
const path = require('path');

// JavaScript code to inject for hamburger menu functionality
const menuScript = `
<script>
(function() {
  // Wait for DOM to be ready
  function initMobileMenu() {
    // Find the hamburger button
    const hamburgerButton = document.querySelector('button[type="button"] svg')?.parentElement;
    
    if (!hamburgerButton) {
      setTimeout(initMobileMenu, 100);
      return;
    }
    
    // Create mobile menu overlay
    const mobileMenuHTML = \`
      <div id="mobile-menu-overlay" style="display: none; position: fixed; inset: 0; z-index: 50;">
        <div style="position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5);" onclick="closeMobileMenu()"></div>
        <div style="position: fixed; right: 0; top: 0; bottom: 0; width: 100%; max-width: 320px; background-color: rgb(40, 40, 40); padding: 24px; overflow-y: auto;">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 24px;">
            <button onclick="closeMobileMenu()" style="color: white; padding: 8px; background: none; border: none; cursor: pointer;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <nav style="display: flex; flex-direction: column; gap: 24px;">
            <a href="#" style="color: white; text-decoration: none; font-size: 18px;">Features</a>
            <a href="about.html" style="color: white; text-decoration: none; font-size: 18px;">Company</a>
            <a href="#pricing" style="color: white; text-decoration: none; font-size: 18px;">Pricing</a>
            <a href="blog.html" style="color: white; text-decoration: none; font-size: 18px;">Blog</a>
            <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;">
              <a href="#" style="display: inline-flex; align-items: center; justify-content: center; padding: 10px 24px; background-color: rgb(64, 64, 64); color: white; text-decoration: none; border-radius: 8px;">Log In</a>
              <button style="display: inline-flex; align-items: center; justify-content: center; padding: 10px 24px; background-color: rgb(255, 220, 97); color: rgb(26, 26, 26); border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">Get Started for Free</button>
            </div>
          </nav>
        </div>
      </div>
    \`;
    
    // Add the mobile menu to the page if it doesn't exist
    if (!document.getElementById('mobile-menu-overlay')) {
      document.body.insertAdjacentHTML('beforeend', mobileMenuHTML);
    }
    
    // Add click handler to hamburger button
    hamburgerButton.onclick = function(e) {
      e.preventDefault();
      const overlay = document.getElementById('mobile-menu-overlay');
      if (overlay) {
        overlay.style.display = 'block';
      }
    };
    
    // Global function to close menu
    window.closeMobileMenu = function() {
      const overlay = document.getElementById('mobile-menu-overlay');
      if (overlay) {
        overlay.style.display = 'none';
      }
    };
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
</script>
`;

// Function to add script to HTML file
function addMenuFunctionality(filePath) {
  try {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Check if script already added
    if (html.includes('mobile-menu-overlay')) {
      console.log(`✓ Already has menu functionality: ${filePath}`);
      return;
    }
    
    // Add script before closing body tag
    html = html.replace('</body>', menuScript + '</body>');
    
    fs.writeFileSync(filePath, html);
    console.log(`✓ Added menu functionality to: ${filePath}`);
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

// Process all HTML files
const htmlFiles = [
  'index.html',
  'about.html',
  'blog.html',
  'affiliate.html',
  'terms.html',
  'privacy.html',
  'extension-privacy.html'
];

console.log('Adding hamburger menu functionality to HTML files...\n');

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    addMenuFunctionality(filePath);
  } else {
    console.log(`✗ File not found: ${file}`);
  }
});

console.log('\nDone! The hamburger menu should now work in all HTML files.');