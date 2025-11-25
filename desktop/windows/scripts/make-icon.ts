import fs from 'node:fs'
import path from 'node:path'
import pngToIco from 'png-to-ico'

async function main(){
  const src = path.resolve(process.cwd(), 'public', 'icon-512.png')
  const outDir = path.resolve(process.cwd(), 'build')
  const out = path.join(outDir, 'icon.ico')
  if (!fs.existsSync(src)){
    console.error('Source PNG not found:', src)
    process.exit(1)
  }
  fs.mkdirSync(outDir, { recursive: true })
  const buf = await pngToIco([src])
  fs.writeFileSync(out, buf)
  console.log('Wrote', out)
}

main().catch(e=>{ console.error(e); process.exit(1) })
