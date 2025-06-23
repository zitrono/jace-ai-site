const fs = require('fs');
const path = require('path');

// JavaScript code to inject for FAQ accordion functionality
const faqScript = `
<script>
(function() {
  // FAQ Accordion functionality
  function initFAQAccordion() {
    // Find all FAQ items
    const faqSection = Array.from(document.querySelectorAll('section')).find(section => 
      section.textContent.includes('Frequently asked questions')
    );
    
    if (!faqSection) {
      setTimeout(initFAQAccordion, 100);
      return;
    }
    
    // Find all FAQ question/answer pairs
    // First check if FAQ uses dl/dt/dd structure (original jace.ai)
    const dlElement = faqSection.querySelector('dl');
    if (dlElement) {
      // Original jace.ai structure - buttons already exist
      console.log('FAQ already has interactive buttons');
      return;
    }
    
    // Otherwise look for li structure (static copy)
    const faqItems = faqSection.querySelectorAll('li');
    
    faqItems.forEach((item, index) => {
      // Find the question (usually in h3 or strong tag)
      const questionElement = item.querySelector('h3, strong');
      if (!questionElement) return;
      
      // Find the answer (usually in p tag after the question)
      const answerElement = item.querySelector('p');
      if (!answerElement) return;
      
      // Create button wrapper for question
      const button = document.createElement('button');
      button.className = 'faq-button';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('data-state', 'closed');
      button.style.cssText = 'width: 100%; text-align: left; padding: 16px 0; border: none; background: none; color: inherit; font-size: inherit; font-weight: inherit; cursor: pointer; display: flex; justify-content: space-between; align-items: center;';
      
      // Move question text into button
      button.innerHTML = questionElement.innerHTML + '<span style="transition: transform 0.2s;">▼</span>';
      
      // Create answer wrapper
      const answerWrapper = document.createElement('div');
      answerWrapper.className = 'faq-answer';
      answerWrapper.setAttribute('data-state', 'closed');
      answerWrapper.style.cssText = 'max-height: 0; overflow: hidden; transition: max-height 0.3s ease;';
      answerWrapper.innerHTML = '<div style="padding: 0 0 16px 0;">' + answerElement.innerHTML + '</div>';
      
      // Replace original elements
      questionElement.replaceWith(button);
      answerElement.replaceWith(answerWrapper);
      
      // Add click handler
      button.addEventListener('click', function() {
        const isOpen = button.getAttribute('aria-expanded') === 'true';
        
        // Toggle states
        button.setAttribute('aria-expanded', !isOpen);
        button.setAttribute('data-state', isOpen ? 'closed' : 'open');
        answerWrapper.setAttribute('data-state', isOpen ? 'closed' : 'open');
        
        // Toggle arrow
        const arrow = button.querySelector('span');
        arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        
        // Toggle answer visibility
        if (isOpen) {
          answerWrapper.style.maxHeight = '0';
        } else {
          answerWrapper.style.maxHeight = answerWrapper.scrollHeight + 'px';
        }
      });
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQAccordion);
  } else {
    initFAQAccordion();
  }
})();
</script>
`;

// Function to add script to HTML file
function addFAQFunctionality(filePath) {
  try {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Check if script already added
    if (html.includes('initFAQAccordion')) {
      console.log(`✓ Already has FAQ functionality: ${filePath}`);
      return;
    }
    
    // Check if file has FAQ section
    if (!html.includes('Frequently asked questions')) {
      console.log(`ℹ No FAQ section found in: ${filePath}`);
      return;
    }
    
    // Add script before closing body tag
    html = html.replace('</body>', faqScript + '</body>');
    
    fs.writeFileSync(filePath, html);
    console.log(`✓ Added FAQ functionality to: ${filePath}`);
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

console.log('Adding FAQ accordion functionality to HTML files...\n');

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    addFAQFunctionality(filePath);
  } else {
    console.log(`✗ File not found: ${file}`);
  }
});

// Also process blog files
const blogDir = path.join(__dirname, 'blog');
if (fs.existsSync(blogDir)) {
  const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  blogFiles.forEach(file => {
    addFAQFunctionality(path.join(blogDir, file));
  });
}

console.log('\nDone! The FAQ accordion should now work in all HTML files.');