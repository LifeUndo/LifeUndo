import { app, BrowserWindow, ipcMain, shell, Tray, Menu, nativeImage, screen, clipboard, nativeTheme, dialog } from 'electron'
import os from 'os'
import crypto from 'crypto'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import fs from 'node:fs'

let win: BrowserWindow | null = null
let tray: Tray | null = null
let quitFlag = false
const execDir = (process as any).env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath)
// ensureDir + userDir helpers (раньше, чтобы использовать в логах)
function ensureDir(p:string){ try{ fs.mkdirSync(p, { recursive:true }) }catch(_){} }

function ensureDeviceId(settings?: Settings): string {
  try {
    const cur = settings || loadSettings()
    if (cur.deviceId && typeof cur.deviceId === 'string') return cur.deviceId
    const gen = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`
    const id = gen()
    const next: Settings = { ...cur, deviceId: id }
    saveSettingsDebounced(next, 50)
    return id
  } catch {
    const fallback = crypto.randomBytes(16).toString('hex')
    return fallback
  }
}
const userDir = () => app.getPath('userData')
const logsDir = () => { const p = path.join(userDir(), 'logs'); ensureDir(p); return p }
function auditShots(settings:Settings){
  try{
    const dir = shotsArchiveDir(); if(!fs.existsSync(dir)) return
    const files = fs.readdirSync(dir).filter(f=>/\.(png|jpg|jpeg)$/i.test(f))
    // keep only size/limit enforcement; existence tracked in journal entries further (future: SQLite)
    enforceShotLimits(settings)
  }catch{ }
}
const logFile = path.join(logsDir(), 'lifeundo-desktop.log')
function log(msg:string){
  try{ fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`) }catch(_){ }
}

// ---- Optional SQLite (better-sqlite3) ----
let db: any = null
let dbInitFailed = false
const dbPath = () => path.join(userDir(), 'lifeundo.db')
function initDb(){
	// SQLite временно отключён в десктоп‑сборке: используем файловый таймлайн как в расширении
	if (dbInitFailed) return
	dbInitFailed = true
	try{ log('db:init:disabled') }catch{}
}
function dbInsertShot(row:{t:number, original_path?:string, copy_path?:string, size?:number, hash?:string}){
  try{ initDb(); if(!db) return; const st = db.prepare('insert into shots(t,original_path,copy_path,size,hash) values(?,?,?,?,?)'); st.run(row.t, row.original_path||null, row.copy_path||null, row.size||null, row.hash||null) }catch(e){ try{ log('db:shots:ins:'+String(e)) }catch{} }
}
function dbListShots(limit:number){
  try{ initDb(); if(!db) return null; const st = db.prepare('select copy_path as path from shots where copy_path is not null order by t desc limit ?'); return st.all(Math.max(1, Math.min(50, limit))) }catch{ return null }
}
function dbInsertText(t:number, text:string){ try{ initDb(); if(!db) return; db.prepare('insert into text_log(t,text) values(?,?)').run(t, text) }catch{} }
function dbInsertTextEvent(t:number, p:string, ex:boolean){ try{ initDb(); if(!db) return; db.prepare('insert into text_events(t,path,exists) values(?,?,?)').run(t, p, ex?1:0) }catch{} }
function dbInsertError(scope:string, e:any){ try{ initDb(); if(!db) return; db.prepare('insert into errors(t,scope,msg,stack) values(?,?,?,?)').run(Date.now(), scope, String(e?.message||e), String(e?.stack||'')) }catch{} }

function getIconPath() {
  // packaged: resourcesPath
  const packaged = path.join(process.resourcesPath || '', 'tray.png')
  if (packaged && fs.existsSync(packaged)) return packaged
  // dev fallbacks
  const candidates = [
    path.join(process.cwd(), 'Icons', 'getlifeundo-round.png'),
    path.join(process.cwd(), 'public', 'icon-512.png')
  ]
  for (const p of candidates) { if (fs.existsSync(p)) return p }
  return ''
}

function positionBottomRight(win: BrowserWindow) {
  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize
  const [w, h] = win.getSize()
  const x = Math.max(0, width - w - 16)
  const y = Math.max(0, height - h - 16)
  win.setPosition(x, y)
}

let currentLocale: 'ru' | 'en' = 'ru'
function t(key:string){
  const dict:any = {
    ru: { open: 'Открыть', exit: 'Выход', tooltip: 'GetLifeUndo' },
    en: { open: 'Open',    exit: 'Exit',  tooltip: 'GetLifeUndo' },
  }
  return (dict[currentLocale] && dict[currentLocale][key]) || key
}
function buildTrayMenu(){
  if (!tray) return
  const menu = Menu.buildFromTemplate([
    { label: t('open'), click: () => { if (win) { positionBottomRight(win); win.show(); win.focus() } } },
    { type: 'separator' },
    { label: t('exit'), click: () => { quitFlag = true; app.quit() } }
  ])
  tray.setContextMenu(menu)
  tray.setToolTip(t('tooltip'))
}

// ---- Settings/config ----
type Settings = {
  locale: 'ru'|'en'
  autostartEnabled: boolean
  limits: { shotsMaxCount: number, shotsMaxSizeMB: number, textMaxBytes: number }
  watchPaths: { shots: string[], textDirs: string[] }
  subStatus?: 'Free'|'Pro'|'VIP'|'TEAM'
  onboarded?: boolean
  dataDir?: string
  deviceId?: string
  // Email аккаунта для централизованного trial/лицензии (если задан)
  accountEmail?: string
  // feature flags (мягкое применение)
  showListHere?: boolean
  shotsEnabled?: boolean
  videoEnabled?: boolean
  eventMode?: boolean
  // локальный триал для desktop (fallback, если backend ещё не даёт данные)
  trialStart?: number
  trialEnd?: number
}
const configPath = () => path.join(userDir(), 'config.json')
function loadSettings(): Settings {
  const def: Settings = {
    locale: 'ru', autostartEnabled: true,
    limits: { shotsMaxCount: 200, shotsMaxSizeMB: 500, textMaxBytes: 10*1024*1024 },
    watchPaths: { shots: [], textDirs: [] }, subStatus: 'Free', onboarded: false, dataDir: '',
    showListHere: true, shotsEnabled: true, videoEnabled: false, eventMode: false
  }
  try{
    const raw = fs.existsSync(configPath()) ? fs.readFileSync(configPath(),'utf-8') : ''
    if (!raw) return def
    const j = JSON.parse(raw)
    return { ...def, ...j, limits: { ...def.limits, ...(j?.limits||{}) }, watchPaths: { ...def.watchPaths, ...(j?.watchPaths||{}) } }
  }catch{ return def }
}
// атомарная запись + дебаунс
let _pendingSettings: Settings | null = null
let _saveTimer: NodeJS.Timeout | null = null
function writeAtomic(p:string, data:string){
  try{ ensureDir(path.dirname(p)); const tmp=p+'.tmp'; fs.writeFileSync(tmp, data); fs.renameSync(tmp, p) }catch(_){ }
}
function saveSettingsNow(s:Settings){ try{ writeAtomic(configPath(), JSON.stringify(s, null, 2)) }catch(_){} }
function saveSettingsDebounced(s:Settings, delay=600){
  _pendingSettings = s
  if (_saveTimer) clearTimeout(_saveTimer)
  _saveTimer = setTimeout(()=>{ if(_pendingSettings) saveSettingsNow(_pendingSettings); _pendingSettings=null; _saveTimer=null }, delay)
}
function applyAutostart(enabled:boolean){
  try{ if (process.platform==='win32' || process.platform==='darwin'){ app.setLoginItemSettings({ openAtLogin: enabled }) } }catch(_){}
}

// ---- Screenshots/archive ----
const picturesDir = () => app.getPath('pictures')
const shotsArchiveDir = () => path.join(picturesDir(), 'LifeUndo', 'Screenshots')
// shots journal
const shotsHistoryPath = () => path.join(userDir(), 'shots-history.jsonl')
function fileHash(buf:Buffer){ return crypto.createHash('sha1').update(buf).digest('hex') }
function enforceShotLimits(settings:Settings){
  try{
    const dir = shotsArchiveDir(); ensureDir(dir)
    const files = fs.readdirSync(dir).filter(f=>/\.(png|jpg|jpeg)$/i.test(f)).map(f=>({ f, p: path.join(dir,f), s: fs.statSync(path.join(dir,f)).size, t: fs.statSync(path.join(dir,f)).mtimeMs }))
    files.sort((a,b)=>a.t-b.t)
    const maxC = settings.limits.shotsMaxCount, maxB = settings.limits.shotsMaxSizeMB*1024*1024
    let total = files.reduce((n,x)=>n+x.s,0)
    while (files.length>maxC || total>maxB){ const rm=files.shift(); if(!rm) break; try{ fs.unlinkSync(rm.p) }catch(_){ }; total = files.reduce((n,x)=>n+x.s,0) }
  }catch(_){ }
}
const recentShotHashes = new Set<string>()
const recentShotPaths = new Set<string>()
let lastFileShotAt = 0
function copyShot(srcPath:string, settings:Settings){
  try{
    const dir = shotsArchiveDir(); ensureDir(dir)
    const base = path.basename(srcPath)
    const ts = new Date(); const stamp = ts.toISOString().replace(/[:.]/g,'-')
    const out = path.join(dir, `${stamp}-${base}`)
    // dedupe by path and content hash
    if (recentShotPaths.has(srcPath)) return
    // дождаться стабилизации файла (до 1 сек, 3 попытки)
    let buf: Buffer | null = null
    for (let i=0;i<3;i++){
      try{ buf = fs.readFileSync(srcPath); break }catch{ }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300)
    }
    if (!buf) { try{ log('copyShot:read-failed '+srcPath) }catch{}; return }
    const h = fileHash(buf)
    if (recentShotHashes.has(h)) return
    recentShotPaths.add(srcPath); recentShotHashes.add(h)
    setTimeout(()=>{ recentShotPaths.delete(srcPath); recentShotHashes.delete(h) }, 10_000)
    fs.writeFileSync(out, buf)
    appendJSONL(shotsHistoryPath(), { t: ts.toISOString(), originalPath: srcPath, copyPath: out, size: buf.length })
    try{ dbInsertShot({ t: Date.now(), original_path: srcPath, copy_path: out, size: buf.length, hash: h }) }catch(e){ dbInsertError('dbInsertShot', e) }
    enforceShotLimits(settings)
    lastFileShotAt = Date.now()
  }catch(_){ }
}
let shotWatchers: fs.FSWatcher[] = []
function startShotWatchers(settings:Settings){
  // stop previous
  shotWatchers.forEach(w=>{try{w.close()}catch(_){}}); shotWatchers = []
  if (!settings.shotsEnabled){ return }
  const paths = new Set<string>()
  const pics = picturesDir(); if (pics) paths.add(path.join(pics,'Screenshots'))
  const od = process.env.ONEDRIVE || process.env.OneDrive; if (od) paths.add(path.join(od,'Pictures','Screenshots'))
  const dbx = process.env.Dropbox; if (dbx) paths.add(path.join(dbx,'Screenshots'))
  settings.watchPaths.shots.forEach(p=>paths.add(p))
  for (const p of paths){ if (!p) continue; try{ ensureDir(p); const w = fs.watch(p,{recursive:true},(e,fn)=>{ if(!fn) return; const full=path.join(p,fn); if(/\.(png|jpg|jpeg)$/i.test(full) && fs.existsSync(full)){ setTimeout(()=>copyShot(full, settings), 1000) } }); shotWatchers.push(w) }catch(_){ } }
}
let lastImageHash = ''
let clipImgTimer: NodeJS.Timer | null = null
function startClipboardImageWatcher(settings:Settings){
  if (clipImgTimer) { clearInterval(clipImgTimer as any); clipImgTimer = null }
  if (!settings.shotsEnabled){ return }
  clipImgTimer = setInterval(()=>{
    try{ const img = clipboard.readImage(); if (img && !img.isEmpty()){
      // если только что пришёл файловый скрин, пропускаем дубль из буфера
      if (Date.now()-lastFileShotAt < 2000) return
      const buf = img.toPNG(); const h = fileHash(buf); if (h!==lastImageHash){ lastImageHash=h; const tmp = path.join(os.tmpdir(), `lu_clip_${Date.now()}.png`); fs.writeFileSync(tmp, buf); copyShot(tmp, settings); try{ fs.unlinkSync(tmp) }catch(_){ } }
    } }catch(_){ }
  }, 1200)
}

// ---- Text capture JSONL ----
const textLogPath = () => path.join(userDir(), 'text-history.jsonl')
const textEvtPath = () => path.join(userDir(), 'text-events.jsonl')
let lastTextHash = ''
let clipTextTimer: NodeJS.Timer | null = null
function appendJSONL(p:string, obj:any){ try{ ensureDir(path.dirname(p)); fs.appendFileSync(p, JSON.stringify(obj)+"\n") }catch(_){ } }
function truncateIfExceeds(p:string, maxBytes:number){ try{ const st = fs.existsSync(p)?fs.statSync(p):null; if(st && st.size>maxBytes){ const raw = fs.readFileSync(p,'utf-8'); const lines = raw.split(/\r?\n/).filter(Boolean); const half = Math.floor(lines.length/2); fs.writeFileSync(p, lines.slice(half).join('\n')+'\n') } }catch(_){ } }
function startClipboardTextWatcher(settings:Settings){
  if (clipTextTimer){ clearInterval(clipTextTimer as any); clipTextTimer=null }
  clipTextTimer = setInterval(()=>{
    try{ const txt = clipboard.readText(); if (txt){ const h = fileHash(Buffer.from(txt)); if (h!==lastTextHash){ lastTextHash=h; appendJSONL(textLogPath(), { t:Date.now(), text: txt.slice(0,20000) }); truncateIfExceeds(textLogPath(), settings.limits.textMaxBytes) } } }catch(_){ }
  }, 800)
}
let docWatchers: fs.FSWatcher[] = []
function startDocWatchers(settings:Settings){
  docWatchers.forEach(w=>{try{w.close()}catch(_){}}); docWatchers=[]
  const set = new Set<string>([app.getPath('documents'), app.getPath('downloads')])
  settings.watchPaths.textDirs.forEach(p=>set.add(p))
  const re = /\.(txt|md|doc|docx|pdf|csv|xlsx)$/i
  for(const p of set){ if(!p) continue; try{ ensureDir(p); const w = fs.watch(p,{recursive:true},(_e,fn)=>{ if(!fn) return; const full=path.join(p,fn); if(re.test(full)){ const exists = fs.existsSync(full); appendJSONL(textEvtPath(), { t:Date.now(), path: full, exists }); try{ dbInsertTextEvent(Date.now(), full, exists) }catch(e){ dbInsertError('dbInsertTextEvent', e) } } }); docWatchers.push(w) }catch(_){ } }
}

function applyWatchers(settings:Settings){
  try{ startShotWatchers(settings) }catch(_){ }
  try{ startClipboardImageWatcher(settings) }catch(_){ }
  try{ startClipboardTextWatcher(settings) }catch(_){ }
  try{ startDocWatchers(settings) }catch(_){ }
}

async function createWindow() {
  log('createWindow:start')
  win = new BrowserWindow({
    width: 420,
    height: 600,
    frame: false,
    transparent: false,
    resizable: false,
    alwaysOnTop: false,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true
    }
  })
  win.webContents.on('did-start-loading', ()=>log('renderer:did-start-loading'))
  win.webContents.on('dom-ready', ()=>log('renderer:dom-ready'))
  win.webContents.on('did-finish-load', ()=>log('renderer:did-finish-load'))
  win.webContents.on('did-fail-load', (_e, code, desc, url)=>log(`renderer:did-fail-load code=${code} desc=${desc} url=${url}`))
  win.webContents.on('console-message', (_e, level, message)=>log(`renderer:console[${level}] ${message}`))
  // Открывать все внешние ссылки в системном браузере
  win.webContents.setWindowOpenHandler(({ url })=>{ try{ shell.openExternal(url) }catch{}; return { action: 'deny' } })
  win.webContents.on('will-navigate', (e, url)=>{ try{ const isLocal = url.startsWith('file:'); if(!isLocal){ e.preventDefault(); shell.openExternal(url) } }catch{} })

  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.show()
  } else {
    const htmlPath = path.join(__dirname, '../renderer/index.html')
    log(`renderer:path ${htmlPath} exists=${fs.existsSync(htmlPath)}`)
    await win.loadURL(pathToFileURL(htmlPath).toString())
    setTimeout(async ()=>{
      try{ const inner = await win!.webContents.executeJavaScript('document.body ? (document.body.innerText || document.body.innerHTML).slice(0,200) : "<no-body>"'); log(`renderer:body-snippet ${inner}`) }catch(_){ }
    }, 400)
    setTimeout(()=>{ try{ win?.show(); positionBottomRight(win!) }catch(_){} }, 300)
  }
  positionBottomRight(win)

  // keep window visible via tray: при закрытии вместо выхода просто прячем в трей
  win.on('close', (e) => { if (!quitFlag) { e.preventDefault(); win?.hide() } })
  // автоскрытие по потере фокуса: как только пользователь визуально «ушёл» с окна, прячем его в трей
  win.on('blur', () => { try { win?.hide() } catch (_) {} })
  log('createWindow:ready')
}

ipcMain.handle('FK_CREATE', async (_evt, payload:{plan:string, locale:string}) => {
  const base = 'https://getlifeundo.com'
  const body = JSON.stringify({ plan: payload.plan, locale: payload.locale || 'ru' })
  const resp = await fetch(base + '/api/payments/freekassa/create', {
    method:'POST', headers:{'Content-Type':'application/json'}, body
  })
  const j = await resp.json()
  if (!resp.ok || !j?.pay_url) throw new Error('no pay_url')
  await shell.openExternal(String(j.pay_url))
  return { ok:true, orderId: j.orderId || null }
})

ipcMain.handle('GET_VERSION', async () => app.getVersion())
ipcMain.handle('GET_LOCALE', async () => currentLocale)
ipcMain.handle('SET_LOCALE', async (_evt, locale:'ru'|'en') => { currentLocale = (locale==='en'?'en':'ru'); buildTrayMenu(); return { ok:true } })
ipcMain.handle('GET_SETTINGS', async ()=> loadSettings())
ipcMain.handle('SET_SETTINGS', async (_evt, patch:Partial<Settings>)=>{
  const cur=loadSettings();
  const next:Settings = { ...cur, ...patch, limits:{...cur.limits, ...(patch as any)?.limits}, watchPaths:{...cur.watchPaths, ...(patch as any)?.watchPaths} };
  const pathsChanged = JSON.stringify(cur.watchPaths||{}) !== JSON.stringify(next.watchPaths||{})
  const limitsChanged = JSON.stringify(cur.limits||{}) !== JSON.stringify(next.limits||{})
  const shotsFlagChanged = cur.shotsEnabled !== next.shotsEnabled
  saveSettingsDebounced(next)
  /*applyAutostart(next.autostartEnabled)*/
  if (pathsChanged || limitsChanged || shotsFlagChanged){ setTimeout(()=>applyWatchers(next), 800) }
  return next
})

ipcMain.handle('GET_DEVICE_META', async () => {
  const settings = loadSettings()
  const deviceId = ensureDeviceId(settings)
  return {
    deviceId,
    platform: 'desktop',
    appVersion: app.getVersion(),
    locale: currentLocale,
  }
})

ipcMain.handle('GET_ORG_STATUS', async () => {
  try {
    const settings = loadSettings()
    const deviceId = ensureDeviceId(settings)
    const accountEmail = (settings as any).accountEmail || ''
    const payload = {
      deviceId,
      platform: 'desktop',
      appVersion: app.getVersion(),
      email: accountEmail,
    }
    let data: any = null
    try {
      const res = await fetch('https://getlifeundo.com/api/org/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      data = await res.json().catch(() => null)
      if (!res.ok || !data) {
        const err = String((data && data.error) || 'ORG_STATUS_FAILED')
        return { ok: false, error: err }
      }
    } catch (e:any) {
      try { dbInsertError('GET_ORG_STATUS', e) } catch {}
      return { ok: false, error: String(e?.message || e) }
    }
    return { ok: true, org: data.org || null, keys: data.keys || [] }
  } catch (e:any) {
    try { dbInsertError('GET_ORG_STATUS', e) } catch {}
    return { ok: false, error: String(e?.message || e) }
  }
})

ipcMain.handle('EXPORT_ORG_KEYS_CSV', async () => {
  try {
    const settings = loadSettings()
    const deviceId = ensureDeviceId(settings)
    const accountEmail = (settings as any).accountEmail || ''
    const payload = {
      deviceId,
      platform: 'desktop',
      appVersion: app.getVersion(),
      email: accountEmail,
    }
    let csv = ''
    try {
      const res = await fetch('https://getlifeundo.com/api/org/keys/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      csv = await res.text()
      if (!res.ok || !csv) {
        return { ok: false, error: 'EXPORT_FAILED' }
      }
    } catch (e:any) {
      try { dbInsertError('EXPORT_ORG_KEYS_CSV', e) } catch {}
      return { ok: false, error: String(e?.message || e) }
    }
    try {
      const dst = path.join(app.getPath('desktop'), `lifeundo-team-keys-${Date.now()}.csv`)
      ensureDir(path.dirname(dst))
      writeAtomic(dst, csv)
      return { ok: true, path: dst }
    } catch (e:any) {
      try { dbInsertError('EXPORT_ORG_KEYS_CSV_SAVE', e) } catch {}
      return { ok: false, error: String(e?.message || e) }
    }
  } catch (e:any) {
    try { dbInsertError('EXPORT_ORG_KEYS_CSV', e) } catch {}
    return { ok: false, error: String(e?.message || e) }
  }
})

ipcMain.handle('DEVICE_REGISTER_ONCE', async () => {
  try {
    const settings = loadSettings()
    const deviceId = ensureDeviceId(settings)
    const payload = {
      deviceId,
      platform: 'desktop',
      appVersion: app.getVersion(),
      locale: currentLocale,
    }
    await fetch('https://getlifeundo.com/api/device/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {})
    return { ok: true, deviceId }
  } catch (e:any) {
    try { dbInsertError('DEVICE_REGISTER_ONCE', e) } catch {}
    return { ok: false, error: String(e?.message || e) }
  }
})

ipcMain.handle('PAIR_CREATE', async () => {
  try {
    const settings = loadSettings()
    const deviceId = ensureDeviceId(settings)
    const payload = {
      deviceId,
      platform: 'desktop',
      version: app.getVersion(),
    }
    log('PAIR_CREATE: start ' + JSON.stringify({ deviceId }))
    const res = await fetch('https://getlifeundo.com/api/pair/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => null)
    log('PAIR_CREATE: resp status=' + res.status + ' body=' + JSON.stringify(data || {}))
    const rawCode = (data && (data.shortCode || data.code)) || ''
    if (!res.ok || !data || !rawCode) {
      const err = String((data && data.error) || 'PAIR_CREATE_FAILED')
      return { ok: false, error: err }
    }
    return { ok: true, code: String(rawCode) }
  } catch (e:any) {
    try { dbInsertError('PAIR_CREATE', e) } catch {}
    log('PAIR_CREATE: error ' + String(e?.message || e))
    return { ok: false, error: String(e?.message || e) }
  }
})

ipcMain.handle('PAIR_CONSUME', async (_evt, code:string) => {
  try {
    const settings = loadSettings()
    const deviceId = ensureDeviceId(settings)
    const payload = {
      code,
      deviceId,
      platform: 'desktop',
      version: app.getVersion(),
    }
    log('PAIR_CONSUME: start ' + JSON.stringify({ deviceId, code }))
    const res = await fetch('https://getlifeundo.com/api/pair/consume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => null)
    log('PAIR_CONSUME: resp status=' + res.status + ' body=' + JSON.stringify(data || {}))
    if (!res.ok || !data || !data.ok) {
      const err = String((data && data.error) || 'PAIR_CONSUME_FAILED')
      return { ok: false, error: err }
    }
    return { ok: true }
  } catch (e:any) {
    try { dbInsertError('PAIR_CONSUME', e) } catch {}
    log('PAIR_CONSUME: error ' + String(e?.message || e))
    return { ok: false, error: String(e?.message || e) }
  }
})

ipcMain.handle('LICENSE_VALIDATE', async () => {
  try {
    const settings = loadSettings()
    const deviceId = ensureDeviceId(settings)
    const accountEmail = (settings as any).accountEmail || ''
    // локальный 7-дневный триал как в расширении
    const now = Date.now()
    let trialStart = (settings as any).trialStart as number | undefined
    let trialEnd = (settings as any).trialEnd as number | undefined
    if (!trialStart) trialStart = now
    if (!trialEnd) trialEnd = trialStart + 7*24*60*60*1000
    if (trialStart !== (settings as any).trialStart || trialEnd !== (settings as any).trialEnd){
      const next = { ...settings, trialStart, trialEnd }
      saveSettingsDebounced(next as Settings)
    }
    const payload = {
      deviceId,
      platform: 'desktop',
      version: app.getVersion(),
      email: accountEmail,
    }
    let merged:any = {
      tier: 'free',
      status: 'trial',
      trialStart,
      trialEnd,
      deviceStatus: 'active',
      devicesUsed: 0,
      deviceLimit: 5,
    }
    try{
      const res = await fetch('https://getlifeundo.com/api/license/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => null)
      if (data){
        merged = {
          tier: data.tier || merged.tier,
          status: data.status || merged.status,
          trialStart: data.trialStart || merged.trialStart,
          trialEnd: data.trialEnd || merged.trialEnd,
          deviceStatus: data.deviceStatus || merged.deviceStatus,
          devicesUsed: typeof data.devicesUsed === 'number' ? data.devicesUsed : merged.devicesUsed,
          deviceLimit: typeof data.deviceLimit === 'number' ? data.deviceLimit : merged.deviceLimit,
        }
      }
    }catch(e:any){
      try { dbInsertError('LICENSE_VALIDATE', e) } catch {}
    }
    return { ok: true, raw: merged, deviceId }
  } catch (e:any) {
    try { dbInsertError('LICENSE_VALIDATE', e) } catch {}
    return { ok: false, error: String(e?.message || e) }
  }
})

ipcMain.handle('LIST_SHOTS', async (_evt, limit:number=5)=>{
  try{
    const rows = dbListShots(limit)
    if (rows && Array.isArray(rows)){
      const dir=shotsArchiveDir(); ensureDir(dir)
      // total оценим по файловой системе как приближение, пока не добавили count(*)
      let total = 0; try{ total = fs.readdirSync(dir).filter(f=>/\.(png|jpg|jpeg)$/i.test(f)).length }catch{}
      return { items: rows, total }
    }
  }catch(_){ }
  try{ const dir=shotsArchiveDir(); ensureDir(dir); const list = fs.readdirSync(dir).filter(f=>/\.(png|jpg|jpeg)$/i.test(f)).map(f=>({ f, p: path.join(dir,f), t: fs.statSync(path.join(dir,f)).mtimeMs })).sort((a,b)=>b.t-a.t)
    const items = list.slice(0,Math.max(1,Math.min(50,limit))).map(x=>({ path: x.p }))
    return { items, total: list.length }
  }catch{ return { items: [], total: 0 } }
})
ipcMain.handle('OPEN_SHOTS_DIR', async ()=> shell.openPath(shotsArchiveDir()))
ipcMain.handle('LIST_TEXT_HISTORY', async (_evt, limit:number=200)=>{
  try{ if(!fs.existsSync(textLogPath())) return []; const raw=fs.readFileSync(textLogPath(),'utf-8').trim().split(/\r?\n/).filter(Boolean); const rows = raw.slice(-Math.min(2000, Math.max(1,limit))).map(l=>{ try{return JSON.parse(l)}catch{return null} }).filter(Boolean); return rows }catch{ return [] }
})
ipcMain.handle('OPEN_PATH', async (_e, p:string)=> shell.openPath(p))
ipcMain.handle('REVEAL_FILE', async (_e, p:string)=> { try{ shell.showItemInFolder(p); return {ok:true} }catch{return {ok:false}} })
ipcMain.handle('PICK_DIR', async ()=>{
  try{ const r = await dialog.showOpenDialog({ properties:['openDirectory']}); if(r.canceled || !r.filePaths?.[0]) return { ok:false };
    return { ok:true, path: r.filePaths[0] } }catch(e){ return { ok:false, error: String(e) } }
})
ipcMain.handle('OPEN_LOGS_DIR', async ()=>{ try{ await shell.openPath(logsDir()); return {ok:true} }catch(e){ return {ok:false, error:String(e)} } })
ipcMain.handle('GET_USERDATA_DIR', async ()=> userDir())
ipcMain.handle('OPEN_USERDATA_DIR', async ()=>{ try{ await shell.openPath(userDir()); return {ok:true} }catch(e){ return {ok:false, error:String(e)} } })
ipcMain.handle('EXPORT_LOGS_COPY', async ()=>{
  try{
    const dstRoot = path.join(app.getPath('desktop'), `lifeundo-logs-${Date.now()}`)
    ensureDir(dstRoot)
    for (const f of (fs.existsSync(logsDir())?fs.readdirSync(logsDir()):[])){
      const src = path.join(logsDir(), f); const dst = path.join(dstRoot, f)
      try{ fs.copyFileSync(src, dst) }catch{}
    }
    return { ok:true, path: dstRoot }
  }catch(e){ return { ok:false, error: String(e) } }
})

app.whenReady().then(async () => {
  const gotLock = app.requestSingleInstanceLock()
  if (!gotLock) { app.quit(); return }
  app.setAppUserModelId('com.getlifeundo.desktop')
  const settings = loadSettings(); currentLocale = settings.locale; applyAutostart(settings.autostartEnabled); initDb()
  await createWindow()
  const iconPath = getIconPath()
  const img = iconPath && fs.existsSync(iconPath) ? nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 }) : nativeImage.createFromPath('')
  tray = new Tray(img)
  buildTrayMenu()
  tray.on('click', () => {
    if (!win) return
    positionBottomRight(win)
    win.show(); win.focus()
    // не отправляем RESET_UI, чтобы не сбрасывать открытые под-вкладки
  })
  log('app:ready')
  // start background watchers
  ensureDir(shotsArchiveDir()); applyWatchers(settings)
  // periodic audit
  setInterval(()=>{ try{ const s = loadSettings(); auditShots(s) }catch{} }, 10_000)
})
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
