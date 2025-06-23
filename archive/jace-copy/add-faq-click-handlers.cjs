const fs = require('fs');
const path = require('path');

// JavaScript to add FAQ click handlers
const faqClickScript = `
<script>
(function() {
  // Add FAQ click handlers for static jace.ai copy
  function initFAQClickHandlers() {
    const faqButtons = document.querySelectorAll('dt button[aria-expanded]');
    
    if (faqButtons.length === 0) {
      // Try again after a short delay
      setTimeout(initFAQClickHandlers, 100);
      return;
    }
    
    faqButtons.forEach(button => {
      // Remove any existing click handlers
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Add click handler
      newButton.addEventListener('click', function() {
        const dt = this.parentElement;
        const dd = dt.nextElementSibling;
        
        if (!dd || dd.tagName !== 'DD') return;
        
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Toggle aria-expanded
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle data-state on button
        this.setAttribute('data-state', isExpanded ? '' : 'open');
        
        // Find the chevron icon and rotate it
        const chevron = this.querySelector('svg');
        if (chevron) {
          chevron.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
          chevron.style.transition = 'transform 0.2s';
        }
        
        // Toggle the answer visibility
        if (isExpanded) {
          // Collapse
          dd.style.maxHeight = '0';
          dd.style.opacity = '0';
          dd.style.overflow = 'hidden';
          dd.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        } else {
          // Expand
          dd.style.maxHeight = dd.scrollHeight + 'px';
          dd.style.opacity = '1';
          dd.style.overflow = 'hidden';
          dd.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
          
          // After transition, set to auto
          setTimeout(() => {
            dd.style.maxHeight = 'auto';
          }, 300);
        }
      });
      
      // Initialize collapsed state
      const dd = newButton.parentElement.nextElementSibling;
      if (dd && dd.tagName === 'DD') {
        const isExpanded = newButton.getAttribute('aria-expanded') === 'true';
        if (!isExpanded) {
          dd.style.maxHeight = '0';
          dd.style.opacity = '0';
          dd.style.overflow = 'hidden';
        }
      }
    });
    
    console.log('FAQ click handlers initialized for ' + faqButtons.length + ' buttons');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQClickHandlers);
  } else {
    initFAQClickHandlers();
  }
})();
</script>
`;

// Function to add FAQ click handlers
function addFAQClickHandlers(filePath) {
  try {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Check if script already added
    if (html.includes('initFAQClickHandlers')) {
      console.log(`✓ Already has FAQ click handlers: ${filePath}`);
      return;
    }
    
    // Check if file has FAQ buttons with aria-expanded
    if (!html.includes('aria-expanded')) {
      console.log(`ℹ No FAQ buttons with aria-expanded found in: ${filePath}`);
      return;
    }
    
    // Add script before closing body tag
    html = html.replace('</body>', faqClickScript + '</body>');
    
    fs.writeFileSync(filePath, html);
    console.log(`✓ Added FAQ click handlers to: ${filePath}`);
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

console.log('Adding FAQ click handlers to HTML files...\n');

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    addFAQClickHandlers(filePath);
  } else {
    console.log(`✗ File not found: ${file}`);
  }
});

// Also process blog files
const blogDir = path.join(__dirname, 'blog');
if (fs.existsSync(blogDir)) {
  const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  blogFiles.forEach(file => {
    addFAQClickHandlers(path.join(blogDir, file));
  });
}

console.log('\nDone! FAQ click handlers have been added.');