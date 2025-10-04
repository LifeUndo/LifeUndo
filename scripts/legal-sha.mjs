import { createHash } from 'crypto';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const root = 'public/legal/contracts';
const files = [];

function walk(dir) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (p.endsWith('.txt')) files.push(p);
  }
}
walk(root);

const lines = files.map(p => {
  const buf = readFileSync(p);
  const sha = createHash('sha256').update(buf).digest('hex');
  const rel = p.replace(`${root}/`, '');
  return `${sha} *${rel}`;
}).join('\n');

writeFileSync(join(root, 'checksums.txt'), lines);
console.log(`Wrote ${files.length} entries to checksums.txt`);
