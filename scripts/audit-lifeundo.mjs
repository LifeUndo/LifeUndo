#!/usr/bin/env node

// Простой audit скрипт для lifeundo.ru
console.log('🔍 Running LifeUndo audit...');

// Проверяем основные файлы
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/app/[locale]/layout.tsx',
  'src/app/[locale]/page.tsx',
  'src/components/ModernHeader.tsx',
  'src/components/ModernFooter.tsx',
  'next.config.mjs',
  'package.json'
];

let allGood = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allGood = false;
  }
});

// Проверяем сборку
console.log('\n🔨 Testing build...');
try {
  const { execSync } = require('child_process');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build successful');
} catch (error) {
  console.log('❌ Build failed');
  allGood = false;
}

if (allGood) {
  console.log('\n🎉 All checks passed!');
  process.exit(0);
} else {
  console.log('\n💥 Some checks failed!');
  process.exit(1);
}