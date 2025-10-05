#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Building Firefox extension 0.3.7.16...');

// Ensure we're in the project root
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

// Backup original manifest.json if it exists
const originalManifest = path.join(projectRoot, 'extension', 'manifest.json');
const firefoxManifest = path.join(projectRoot, 'extension', 'manifest.firefox.json');

if (fs.existsSync(originalManifest)) {
  console.log('📦 Backing up original manifest.json...');
  fs.copyFileSync(originalManifest, path.join(projectRoot, 'extension', 'manifest.mv3.json'));
}

// Copy Firefox manifest to manifest.json
console.log('🦊 Using Firefox manifest (MV2)...');
fs.copyFileSync(firefoxManifest, originalManifest);

try {
  // Build XPI using web-ext
  console.log('🔨 Building XPI with web-ext...');
  execSync('npx web-ext build --overwrite-dest --artifacts-dir release/amo', { 
    stdio: 'inherit',
    cwd: path.join(projectRoot, 'extension')
  });
  
  console.log('✅ Firefox XPI built successfully!');
  
  // Generate checksums
  console.log('🔐 Generating checksums...');
  const checksumFile = path.join(projectRoot, 'release', 'amo', 'SHA256SUMS.txt');
  const xpiFile = path.join(projectRoot, 'release', 'amo', 'lifeundo-0.3.7.16.xpi');
  const changelogFile = path.join(projectRoot, 'release', 'amo', 'CHANGELOG-0.3.7.16.txt');
  
  if (fs.existsSync(xpiFile)) {
    const crypto = require('crypto');
    const xpiContent = fs.readFileSync(xpiFile);
    const xpiHash = crypto.createHash('sha256').update(xpiContent).digest('hex');
    
    let checksumContent = '';
    checksumContent += `${xpiHash} *lifeundo-0.3.7.16.xpi\n`;
    
    if (fs.existsSync(changelogFile)) {
      const changelogContent = fs.readFileSync(changelogFile);
      const changelogHash = crypto.createHash('sha256').update(changelogContent).digest('hex');
      checksumContent += `${changelogHash} *CHANGELOG-0.3.7.16.txt\n`;
    }
    
    fs.writeFileSync(checksumFile, checksumContent);
    console.log('✅ Checksums generated!');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Restore original manifest.json
  const mv3Manifest = path.join(projectRoot, 'extension', 'manifest.mv3.json');
  if (fs.existsSync(mv3Manifest)) {
    console.log('🔄 Restoring original manifest.json...');
    fs.copyFileSync(mv3Manifest, originalManifest);
    fs.unlinkSync(mv3Manifest);
  } else {
    // Remove the Firefox manifest copy
    fs.unlinkSync(originalManifest);
  }
}

console.log('🎉 Firefox build complete!');
console.log('📁 XPI location: release/amo/lifeundo-0.3.7.16.xpi');
console.log('📋 Next: Upload to AMO and update latest.json');
