import { build } from 'esbuild'
import path from 'node:path'
const root = process.cwd()
const common = { bundle: true as const, platform: 'node' as const, format: 'cjs' as const, sourcemap: true, external: ['electron'] }
await build({ entryPoints: [path.join(root,'src/main/index.ts')], outfile: path.join(root,'dist/main/index.js'), ...common })
await build({ entryPoints: [path.join(root,'src/preload/index.ts')], outfile: path.join(root,'dist/preload/index.js'), ...common })
