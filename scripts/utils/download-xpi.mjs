#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import https from 'https';

const url = process.argv[2] || 'https://addons.mozilla.org/firefox/downloads/file/4593510/lifeundo-0.3.7.32.xpi';
const outPath = process.argv[3] || path.resolve('public', 'app', 'latest', 'lifeundo-latest.xpi');

fs.mkdirSync(path.dirname(outPath), { recursive: true });

https.get(url, (res) => {
  if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    https.get(res.headers.location, (res2) => pipe(res2));
  } else {
    pipe(res);
  }
}).on('error', (err) => {
  console.error('Download error:', err.message);
  process.exit(1);
});

function pipe(res) {
  if (res.statusCode !== 200) {
    console.error('HTTP error:', res.statusCode);
    process.exit(1);
  }
  const file = fs.createWriteStream(outPath);
  res.pipe(file);
  file.on('finish', () => {
    file.close(() => {
      const size = fs.statSync(outPath).size;
      console.log(`Saved ${outPath} (${size} bytes)`);
    });
  });
  file.on('error', (err) => {
    console.error('Write error:', err.message);
    process.exit(1);
  });
}
