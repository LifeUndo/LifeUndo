const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const SRC = 'extension_firefox';
const OUT = 'releases/0.2.6/LifeUndo-0.2.6-firefox.xpi';

console.log('Building XPI with POSIX paths...');

// Create output directory
fs.mkdirSync(path.dirname(OUT), { recursive: true });

// Remove existing XPI
if (fs.existsSync(OUT)) {
    fs.unlinkSync(OUT);
}

const output = fs.createWriteStream(OUT);
const zip = archiver('zip', { zlib: { level: 9 } });

zip.pipe(output);

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const absPath = path.join(dir, file);
        const stat = fs.statSync(absPath);
        
        if (stat.isDirectory()) {
            walk(absPath);
        } else {
            // Convert to POSIX path (use / instead of \)
            const relPath = path.relative(SRC, absPath).split(path.sep).join('/');
            console.log(`Adding: ${relPath}`);
            zip.file(absPath, { name: relPath });
        }
    }
}

walk(SRC);

zip.finalize();

output.on('close', () => {
    console.log(`XPI created successfully: ${OUT}`);
    console.log(`Archive size: ${zip.pointer()} bytes`);
    
    // Verify contents
    console.log('\nVerifying XPI contents:');
    const zipFile = require('yauzl');
    zipFile.open(OUT, { lazyEntries: true }, (err, zipfile) => {
        if (err) {
            console.error('Error opening XPI for verification:', err.message);
            return;
        }
        zipfile.readEntry();
        zipfile.on('entry', (entry) => {
            console.log(`  ${entry.fileName}`);
            zipfile.readEntry();
        });
    });
});
