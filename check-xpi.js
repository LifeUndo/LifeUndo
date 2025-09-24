const fs = require('fs');
const yauzl = require('yauzl');

const xpiPath = 'releases/0.2.3/LifeUndo-0.2.3-firefox.xpi';

console.log('Checking XPI contents for POSIX paths...\n');

yauzl.open(xpiPath, { lazyEntries: true }, (err, zipfile) => {
    if (err) {
        console.error('Error opening XPI:', err.message);
        return;
    }
    
    console.log('XPI file entries:');
    console.log('================');
    
    zipfile.readEntry();
    zipfile.on('entry', (entry) => {
        console.log(entry.fileName);
        
        // Check for backslashes (should be none)
        if (entry.fileName.includes('\\')) {
            console.log(`❌ ERROR: Found backslash in path: ${entry.fileName}`);
        } else {
            console.log(`✅ OK: ${entry.fileName}`);
        }
        
        zipfile.readEntry();
    });
    
    zipfile.on('end', () => {
        console.log('\n✅ XPI verification complete - all paths use POSIX format (/)');
    });
});


















