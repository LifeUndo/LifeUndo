// scripts/lint-i18n.js
const fs = require('fs');
const path = require('path');

const cyrillicRegex = /[А-Яа-яЁё]/;

function scanDirectory(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      scanDirectory(fullPath, results);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (cyrillicRegex.test(line)) {
          results.push({
            file: fullPath,
            line: index + 1,
            content: line.trim()
          });
        }
      });
    }
  }
  
  return results;
}

const results = scanDirectory('src');
console.log('Hardcoded Cyrillic text found:');
results.forEach(r => {
  console.log(`${r.file}:${r.line} - ${r.content}`);
});