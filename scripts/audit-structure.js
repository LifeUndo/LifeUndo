#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Auditing repository structure...');

const projectRoot = path.resolve(__dirname, '..');
const issues = [];

// Check for problematic directories
const problematicDirs = [
  'releases', 
  'public/app/0.3.7.12',
  'public/app/0.3.7.11'
];

problematicDirs.forEach(dir => {
  const fullPath = path.join(projectRoot, dir);
  if (fs.existsSync(fullPath)) {
    issues.push(`❌ Found problematic directory: ${dir}`);
  }
});

// Check for required files
const requiredFiles = [
  'public/app/latest/latest.json',
  'public/app/latest/whats-new.json',
  'extension/manifest.firefox.json',
  'scripts/build-firefox.js'
];

requiredFiles.forEach(file => {
  const fullPath = path.join(projectRoot, file);
  if (!fs.existsSync(fullPath)) {
    issues.push(`❌ Missing required file: ${file}`);
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

// Check latest.json structure
try {
  const latestJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'public/app/latest/latest.json'), 'utf8'));
  if (latestJson.version !== '0.3.7.14') {
    issues.push(`❌ latest.json version mismatch: expected 0.3.7.14, got ${latestJson.version}`);
  }
  if (!latestJson.files.firefox.includes('addons.mozilla.org')) {
    issues.push(`❌ Firefox link should point to AMO`);
  }
  console.log(`✅ latest.json structure OK`);
} catch (e) {
  issues.push(`❌ latest.json parse error: ${e.message}`);
}

// Check XPI exists
const xpiPath = path.join(projectRoot, 'release/amo/lifeundo-0.3.7.14.xpi');
if (fs.existsSync(xpiPath)) {
  console.log(`✅ XPI built: release/amo/lifeundo-0.3.7.14.xpi`);
} else {
  issues.push(`❌ XPI not found: release/amo/lifeundo-0.3.7.14.xpi`);
}

// Summary
console.log('\n📊 Audit Summary:');
if (issues.length === 0) {
  console.log('✅ All checks passed! Repository structure is clean.');
  process.exit(0);
} else {
  console.log(`❌ Found ${issues.length} issues:`);
  issues.forEach(issue => console.log(`  ${issue}`));
  process.exit(1);
}
