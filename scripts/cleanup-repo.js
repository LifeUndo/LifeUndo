#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up repository structure...');

const projectRoot = path.resolve(__dirname, '..');

// Directories to remove (they contain historical releases)
const dirsToRemove = [
  'releases',
  'public/app/0.3.7.12',
  'public/app/0.3.7.11'
];

let removedCount = 0;

dirsToRemove.forEach(dir => {
  const fullPath = path.join(projectRoot, dir);
  if (fs.existsSync(fullPath)) {
    try {
      console.log(`🗑️  Removing: ${dir}`);
      fs.rmSync(fullPath, { recursive: true, force: true });
      removedCount++;
    } catch (e) {
      console.error(`❌ Failed to remove ${dir}: ${e.message}`);
    }
  }
});

// Keep release/amo (current build artifacts)
console.log(`✅ Cleaned up ${removedCount} directories`);
console.log('📁 Kept: release/amo/ (current build artifacts)');
console.log('📁 Kept: public/app/latest/ (current metadata)');

console.log('\n🎉 Repository cleanup complete!');
console.log('Run "npm run audit" to verify structure.');
