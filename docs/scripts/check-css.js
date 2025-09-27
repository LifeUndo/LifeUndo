const fs = require('fs');

function checkCSS(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Проверяем наличие важных CSS классов
    if (!content.includes('.footer-socials')) {
      issues.push('Missing .footer-socials class');
    }
    
    if (!content.includes('.footer-badges')) {
      issues.push('Missing .footer-badges class');
    }
    
    if (!content.includes('.footer-menu')) {
      issues.push('Missing .footer-menu class');
    }
    
    // Проверяем CSS переменные
    if (!content.includes(':root')) {
      issues.push('Missing CSS variables (:root)');
    }
    
    // Проверяем медиа-запросы
    if (!content.includes('@media')) {
      issues.push('Missing responsive design (@media queries)');
    }
    
    return issues;
  } catch (err) {
    return ['Error reading file: ' + err.message];
  }
}

// Проверяем CSS файлы
const cssFiles = [
  'docs/assets/site.css'
];

console.log('🎨 Checking CSS files for issues...\n');

let totalIssues = 0;
cssFiles.forEach(file => {
  const issues = checkCSS(file);
  if (issues.length === 0) {
    console.log('✅', file, '- OK');
  } else {
    console.log('❌', file, '- Issues:', issues.join(', '));
    totalIssues += issues.length;
  }
});

console.log(`\n📊 Summary: ${totalIssues} issues found across ${cssFiles.length} files`);

if (totalIssues === 0) {
  console.log('🎉 All CSS files are clean!');
} else {
  console.log('⚠️  Some files need attention');
}
