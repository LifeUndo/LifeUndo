const fs = require('fs');
const path = require('path');

console.log('🚀 LifeUndo Project Health Check\n');
console.log('================================\n');

// 1. Проверка Git статуса
console.log('📋 Git Status:');
try {
  const { execSync } = require('child_process');
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim() === '') {
    console.log('✅ Working directory is clean\n');
  } else {
    console.log('⚠️  Uncommitted changes detected\n');
  }
} catch (err) {
  console.log('❌ Git check failed:', err.message, '\n');
}

// 2. Проверка HTML файлов
console.log('🌐 HTML Files Check:');
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

let htmlIssues = 0;
htmlFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const issues = [];
    
    if (!content.includes('<!doctype html>') && !content.includes('<!DOCTYPE html>')) {
      issues.push('Missing DOCTYPE');
    }
    
    if (content.includes('class="links"')) {
      issues.push('Uses old "links" class');
    }
    
    if (!content.includes('footer-socials')) {
      issues.push('Missing footer-socials');
    }
    
    if (!content.includes('footer-badges')) {
      issues.push('Missing footer-badges');
    }
    
    if (issues.length === 0) {
      console.log('✅', file);
    } else {
      console.log('❌', file, '-', issues.join(', '));
      htmlIssues += issues.length;
    }
  } catch (err) {
    console.log('❌', file, '- Error reading file');
    htmlIssues++;
  }
});

// 3. Проверка CSS файлов
console.log('\n🎨 CSS Files Check:');
const cssFiles = ['docs/assets/site.css'];
let cssIssues = 0;

cssFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const issues = [];
    
    if (!content.includes('.footer-socials')) {
      issues.push('Missing .footer-socials');
    }
    
    if (!content.includes('.footer-badges')) {
      issues.push('Missing .footer-badges');
    }
    
    if (!content.includes('.footer-menu')) {
      issues.push('Missing .footer-menu');
    }
    
    if (issues.length === 0) {
      console.log('✅', file);
    } else {
      console.log('❌', file, '-', issues.join(', '));
      cssIssues += issues.length;
    }
  } catch (err) {
    console.log('❌', file, '- Error reading file');
    cssIssues++;
  }
});

// 4. Проверка SVG файлов
console.log('\n🖼️  SVG Assets Check:');
const svgFiles = [
  'docs/assets/fund/we_give_10.svg',
  'docs/assets/freekassa/fk_badge_ru_v3.svg',
  'docs/assets/freekassa/fk_badge_en_v3.svg'
];

let svgIssues = 0;
svgFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('<svg') && content.includes('</svg>')) {
      console.log('✅', file);
    } else {
      console.log('❌', file, '- Invalid SVG format');
      svgIssues++;
    }
  } catch (err) {
    console.log('❌', file, '- File not found');
    svgIssues++;
  }
});

// 5. Проверка социальных иконок
console.log('\n📱 Social Icons Check:');
const socialIcons = [
  'docs/assets/social/vc.svg',
  'docs/assets/social/habr.svg',
  'docs/assets/social/telegram.png',
  'docs/assets/social/youtube.png',
  'docs/assets/social/reddit.svg',
  'docs/assets/social/x.svg',
  'docs/assets/social/dzen.png',
  'docs/assets/social/vk.png'
];

let socialIssues = 0;
socialIcons.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      console.log('✅', file);
    } else {
      console.log('❌', file, '- File not found');
      socialIssues++;
    }
  } catch (err) {
    console.log('❌', file, '- Error checking file');
    socialIssues++;
  }
});

// Итоговый отчет
console.log('\n📊 Final Report:');
console.log('================');
console.log(`HTML Issues: ${htmlIssues}`);
console.log(`CSS Issues: ${cssIssues}`);
console.log(`SVG Issues: ${svgIssues}`);
console.log(`Social Icons Issues: ${socialIssues}`);

const totalIssues = htmlIssues + cssIssues + svgIssues + socialIssues;

if (totalIssues === 0) {
  console.log('\n🎉 All checks passed! Project is healthy!');
} else {
  console.log(`\n⚠️  Total issues found: ${totalIssues}`);
  console.log('Please review and fix the issues above.');
}
