#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Checking for Cyrillic text in source files...\n');

const searchPaths = [
  './src/app',
  './src/components', 
  './src/pages',
  './src/content'
];

const cyrillicPattern = /[А-Яа-яЁё]/;
const excludePatterns = [
  /node_modules/,
  /\.git/,
  /\.next/,
  /\.vercel/,
  /dist/,
  /build/,
  /coverage/,
  /\.d\.ts$/,
  /\.json$/,
  /\.md$/,
  /\.txt$/,
  /\.sql$/,
  /\.env/,
  /\.env\./,
  /public\/legal/,
  /docs\//,
  /release\//,
  /extension_firefox\/_locales/,
  /extension\/_locales/
];

let foundCyrillic = false;
let totalFiles = 0;
let checkedFiles = 0;

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip excluded directories
      if (excludePatterns.some(pattern => pattern.test(filePath))) {
        continue;
      }
      walkDir(filePath);
    } else if (stat.isFile()) {
      totalFiles++;
      
      // Skip excluded files
      if (excludePatterns.some(pattern => pattern.test(filePath))) {
        continue;
      }
      
      // Only check JS/TS/TSX files
      if (!/\.(js|ts|tsx|jsx)$/.test(file)) {
        continue;
      }
      
      checkedFiles++;
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
          if (cyrillicPattern.test(lines[i])) {
            // Skip comments and strings that are intentionally in Russian
            const line = lines[i].trim();
            
            // Skip if it's a comment or string literal
            if (line.startsWith('//') || line.startsWith('*') || line.startsWith('/*')) {
              continue;
            }
            
            // Skip if it's inside a string literal
            if (line.includes('"') || line.includes("'") || line.includes('`')) {
              continue;
            }
            
            // Skip if it's a URL or path
            if (line.includes('http') || line.includes('www.') || line.includes('/')) {
              continue;
            }
            
            console.log(`❌ ${filePath}:${i + 1}`);
            console.log(`   ${lines[i]}`);
            console.log('');
            foundCyrillic = true;
          }
        }
      } catch (error) {
        console.log(`⚠️  Could not read ${filePath}: ${error.message}`);
      }
    }
  }
}

// Walk through all search paths
for (const searchPath of searchPaths) {
  walkDir(searchPath);
}

console.log(`📊 Checked ${checkedFiles} files out of ${totalFiles} total files`);

if (foundCyrillic) {
  console.log('\n❌ Found Cyrillic text in source files!');
  console.log('Please replace with i18n keys or move to translation files.');
  process.exit(1);
} else {
  console.log('\n✅ No Cyrillic text found in source files!');
  process.exit(0);
}
