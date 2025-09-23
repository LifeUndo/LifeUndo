const fs = require('fs');
const path = require('path');

function checkHTML(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Проверяем DOCTYPE
    if (!content.includes('<!doctype html>') && !content.includes('<!DOCTYPE html>')) {
      issues.push('Missing DOCTYPE');
    }
    
    // Проверяем основные теги
    if (!content.includes('<html')) {
      issues.push('Missing <html> tag');
    }
    
    if (!content.includes('</html>')) {
      issues.push('Missing </html> tag');
    }
    
    // Проверяем старые классы
    if (content.includes('class="links"')) {
      issues.push('Uses old "links" class instead of "footer-menu"');
    }
    
    // Проверяем наличие footer-socials
    if (!content.includes('footer-socials')) {
      issues.push('Missing footer-socials class');
    }
    
    // Проверяем наличие footer-badges
    if (!content.includes('footer-badges')) {
      issues.push('Missing footer-badges class');
    }
    
    return issues;
  } catch (err) {
    return ['Error reading file: ' + err.message];
  }
}

// Проверяем основные HTML файлы
const htmlFiles = [
  'docs/index.html',
  'docs/privacy/index.html', 
  'docs/faq/index.html',
  'docs/changelog/index.html',
  'docs/support/index.html',
  'docs/pricing/index.html',
  'docs/fund/index.html',
  'docs/en/index.html',
  'docs/en/privacy/index.html',
  'docs/en/faq/index.html'
];

console.log('🔍 Checking HTML files for issues...\n');

let totalIssues = 0;
htmlFiles.forEach(file => {
  const issues = checkHTML(file);
  if (issues.length === 0) {
    console.log('✅', file, '- OK');
  } else {
    console.log('❌', file, '- Issues:', issues.join(', '));
    totalIssues += issues.length;
  }
});

console.log(`\n📊 Summary: ${totalIssues} issues found across ${htmlFiles.length} files`);

if (totalIssues === 0) {
  console.log('🎉 All HTML files are clean!');
} else {
  console.log('⚠️  Some files need attention');
}
