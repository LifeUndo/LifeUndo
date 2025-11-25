import React, { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import SimplePeer from 'simple-peer'

function createT(locale:'ru'|'en'){
  const d:any = {
    ru: {
      tabs: 'Вкладки', shots: 'Скрины', text: 'Текст',
      subscription: 'Подписка',
      tabs_hint1: 'Чтобы фиксировать вкладки, установите браузерное расширение GetLifeUndo и войдите в аккаунт. После этого вкладки появятся здесь.',
      tabs_hint2: 'Синхронизация работает между устройствами. Управляйте списком устройств в разделе Подписка → Устройства (позже).',
      local_note: 'Всё локально, никакой передачи на сервер без вашего явного решения.',
      shots_latest_of_total: (n:number, t:number)=>`Последние ${n} из ${t}`,
      shots_open_folder: 'Открыть папку',
      shots_empty: 'Пока нет скриншотов',
      text_empty: 'Пока нет записей',
      text_open_archive: 'Открыть архив',
      pro_title: 'PRO (месяц, для одного пользователя)', pro_price: 'ежемесячно', pro_btn: 'Оплатить — ₽599',
      vip_title: 'VIP (пожизненно, для одного пользователя)', vip_price: 'единовременно', vip_btn: 'Оплатить — ₽9990',
      team_title: 'TEAM 5 (для команд и организаций)', team_price: '5 мест / месяц', team_btn: 'Оплатить — ₽2990',
      site: 'Сайт', github: 'GitHub', privacy: 'Приватность',
      team: 'TEAM',
    },
    en: {
      tabs: 'Tabs', shots: 'Shots', text: 'Text',
      subscription: 'Subscription',
      tabs_hint1: 'To capture tabs, install the GetLifeUndo browser extension and sign in. Your tabs will appear here afterwards.',
      tabs_hint2: 'Sync works across devices. Manage devices under Subscription → Devices (later).',
      local_note: 'All local, nothing leaves your device unless you explicitly choose to sync.',
      shots_latest_of_total: (n:number, t:number)=>`Latest ${n} of ${t}`,
      shots_open_folder: 'Open folder',
      shots_empty: 'No screenshots yet',
      text_empty: 'No entries yet',
      text_open_archive: 'Open archive',
      pro_title: 'PRO (monthly, single user)', pro_price: 'per month', pro_btn: 'Pay — ₽599',
      vip_title: 'VIP (lifetime, single user)', vip_price: 'one-time', vip_btn: 'Pay — ₽9990',
      team_title: 'TEAM 5 (teams & orgs)', team_price: '5 seats / month', team_btn: 'Pay — ₽2990',
      site: 'Website', github: 'GitHub', privacy: 'Privacy',
      team: 'TEAM',
    }
  }
  return (key:string)=> (d[locale] && d[locale][key]) || key
}

function DevicesSection({ locale }:{ locale:'ru'|'en' }){
  const [me, setMe] = useState<{deviceId?:string, publicKey?:string}>({})
  const [pair, setPair] = useState<{pin?:string}>({})
  const [peers, setPeers] = useState<any[]>([])
  const [qr, setQr] = useState<string>('')
  const [acceptPin, setAcceptPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [found, setFound] = useState<any[]>([])
  const L = (k:string)=>({
    ru:{start:'Показать код', device:'Устройство', mykey:'Публичный ключ', uri:'URI для подключения', peers:'Подключённые устройства', accept:'Связать с другим устройством', confirm:'Подтвердить код', discovered:'Найденные устройства', thisDevice:'Ваши устройства', platform:'Платформа', version:'Версия', license:'Лицензия'},
    en:{start:'Show code', device:'Device', mykey:'Public key', uri:'Pair URI', peers:'Paired devices', accept:'Link another device', confirm:'Confirm code', discovered:'Discovered devices', thisDevice:'Your devices', platform:'Platform', version:'Version', license:'License'}
  } as any)[locale][k]||k
  const short = (s?:string)=> s? (s.length>48? (s.slice(0,24)+'…'+s.slice(-12)) : s) : ''
  useEffect(()=>{ 
    // восстановить последний сгенерированный PIN, если он есть в глобале
    try{ const last = (window as any).__lu_lastPairPin; if (last){ setPair({ pin: String(last) }) } }catch{}
    try{ window.api.meshGetPubkey && window.api.meshGetPubkey().then(r=>{ if(r?.ok) setMe({ deviceId:r.deviceId, publicKey:r.publicKey }) }) }catch{}
    try{ window.api.meshListPeers && window.api.meshListPeers().then(r=>{ if(r?.ok) setPeers(r.peers||[]) }) }catch{}
    // резервный источник deviceId — ответ licenseValidate
    try{
      window.api.licenseValidate && window.api.licenseValidate().then(r=>{ if(r?.deviceId){ setMe((prev)=>({ ...prev, deviceId:r.deviceId })) } }).catch(()=>{})
    }catch{}
    let timer: any = null
    ;(async()=>{ try{ await (window.api.meshDiscoveryStart && window.api.meshDiscoveryStart()) }catch{}; try{ const r = await (window.api.meshListDiscovered && window.api.meshListDiscovered()); if(r && (r as any).ok) setFound((r as any).items||[]) }catch{}; timer = setInterval(async()=>{ try{ const r = await (window.api.meshListDiscovered && window.api.meshListDiscovered()); if(r && (r as any).ok) setFound((r as any).items||[]) }catch{} }, 3000) })()
    return ()=>{ try{ timer && clearInterval(timer) }catch{}; try{ window.api.meshDiscoveryStop && window.api.meshDiscoveryStop() }catch{} }
  },[])
  useEffect(()=>{ (async()=>{ setQr('') })() },[pair.pin])
  const start = async ()=>{
    if (!window.api.pairCreate){
      alert(locale==='ru'
        ? 'В этой сборке нет поддержки активационных кодов (pairCreate отсутствует).'
        : 'This build does not expose pairCreate for activation codes.')
      return
    }
    if (busy) return
    setBusy(true)
    try{
      const r = await window.api.pairCreate()
      if (r && (r as any).ok && (r as any).code){
        const code = String((r as any).code)
        setPair({ pin: code })
        try{ (window as any).__lu_lastPairPin = code }catch{}
      } else {
        const err = (r && (r as any).error) || 'PAIR_CREATE_FAILED'
        alert(locale==='ru'
          ? `Не удалось создать код. ${String(err)}`
          : `Failed to create code. ${String(err)}`)
      }
    }catch(e:any){
      alert(locale==='ru'
        ? `Ошибка при создании кода: ${String(e?.message||e)}`
        : `Error creating code: ${String(e?.message||e)}`)
    }finally{
      setBusy(false)
    }
  }
  const accept = async ()=>{
    if (!window.api.pairConsume){
      alert(locale==='ru'
        ? 'В этой сборке нет поддержки подтверждения кодов (pairConsume отсутствует).'
        : 'This build does not expose pairConsume for activation codes.')
      return
    }
    const code = (acceptPin||'').trim()
    if (!code){
      alert(locale==='ru' ? 'Введите код из другого устройства.' : 'Please enter a code from another device.')
      return
    }
    if (busy) return
    setBusy(true)
    try{
      const r = await window.api.pairConsume(code)
      if (r && (r as any).ok){
        setAcceptPin('')
        alert(locale==='ru'
          ? 'Устройства успешно связаны.'
          : 'Devices are now linked.')
      } else {
        const err = (r && (r as any).error) || 'PAIR_CONSUME_FAILED'
        alert(locale==='ru'
          ? `Не удалось подтвердить код. ${String(err)}`
          : `Failed to confirm code. ${String(err)}`)
      }
    }catch(e:any){
      alert(locale==='ru'
        ? `Ошибка при подтверждении кода: ${String(e?.message||e)}`
        : `Error confirming code: ${String(e?.message||e)}`)
    }finally{
      setBusy(false)
    }
  }
  return (
    <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-4 space-y-3'>
      <div className='rounded-xl bg-slate-900/40 ring-1 ring-slate-800 p-3 space-y-2'>
        <div className='text-slate-200 text-sm font-medium'>{L('thisDevice')}</div>
        <div className='text-slate-300 text-sm'>
          <div className='mb-1'>{L('device')}: <span className='font-mono break-all'>{me.deviceId||'—'}</span></div>
          <div className='mb-1'>{L('platform')}: desktop</div>
          <div className='mb-1'>{L('version')}: 0.6.1.1</div>
          <div className='text-slate-400 text-xs mt-1'>{L('mykey')}: <span className='font-mono break-all'>{short(me.publicKey)}</span></div>
        </div>
      </div>
      <div className='rounded-xl bg-slate-900/40 ring-1 ring-slate-800 p-3 space-y-3'>
        <div className='text-slate-200 text-sm font-medium'>{locale==='ru' ? 'Связать с другим устройством' : L('accept')}</div>
        <div className='text-slate-400 text-xs'>{locale==='ru' ? 'Связать это устройство с другим по коду.' : 'Link this device with another using a code.'}</div>
        <div className='flex items-center justify-between gap-2'>
          <div className='text-slate-50 text-base font-semibold tracking-wide font-mono'>{pair.pin?`PIN: ${pair.pin}`:''}</div>
          <GButton accent='teal' onClick={start}>{L('start')}</GButton>
        </div>
        {pair.pin && (
          <div className='text-slate-400 text-[11px] leading-snug'>
            {locale==='ru'
              ? 'Код сгенерирован. Введите его на втором устройстве в течение 15 минут. После успешной связки код станет недействительным.'
              : 'Code generated. Enter it on the second device within 15 minutes. After a successful link the code becomes invalid.'}
          </div>
        )}
        <div className='space-y-2'>
          <div className='text-slate-400 text-xs'>{locale==='ru' ? 'У меня уже есть код другого устройства:' : L('accept')}</div>
          <input value={acceptPin} onChange={e=>setAcceptPin(e.target.value)} placeholder='XXXX-XXXX' className='w-full h-8 rounded-md bg-slate-900/60 text-slate-200 text-xs px-2 ring-1 ring-slate-700'/>
          <div className='flex justify-end'>
            <GButton accent='cyan' disabled={busy} onClick={accept}>{busy?'...':L('confirm')}</GButton>
          </div>
        </div>
      </div>
      <div className='rounded-xl bg-slate-900/30 ring-1 ring-slate-800 p-3'>
        <div className='text-slate-400 text-xs'>
          {locale==='ru'
            ? 'Для расширенной отладки можно продолжать использовать схему offer/answer в браузерном расширении и веб‑клиенте /device.'
            : 'For advanced debugging you can still use the offer/answer flow in the browser extension and the /device web client.'}
        </div>
      </div>
      <div>
        <div className='text-slate-400 text-xs mb-1'>{L('peers')}</div>
        <div className='rounded-md bg-slate-900/40 ring-1 ring-slate-700 max-h-40 overflow-y-auto divide-y divide-slate-800'>
          {peers.length===0 && <div className='p-2 text-slate-500 text-xs'>—</div>}
          {peers.map((p,i)=> (
            <div key={i} className='p-2 text-sm text-slate-200 flex items-center justify-between'>
              <div className='font-mono truncate max-w-[70%]' title={p.device}>{p.device||'unknown'}</div>
              <div className='text-slate-500 text-xs'>{short(p.pub)}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className='text-slate-400 text-xs mb-1'>{L('discovered')}</div>
        <div className='rounded-md bg-slate-900/40 ring-1 ring-slate-700 max-h-40 overflow-y-auto divide-y divide-slate-800'>
          {found.length===0 && <div className='p-2 text-slate-500 text-xs'>—</div>}
          {found.map((d:any, i:number)=> (
            <div key={i} className='p-2 text-sm text-slate-200 flex items-center justify-between'>
              <div className='font-mono truncate max-w-[70%]' title={d.device}>{d.device}</div>
              <div className='text-slate-500 text-xs'>{new Date(d.lastSeen).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GButton({ children, onClick, accent='cyan', disabled=false }:{children:React.ReactNode, onClick:()=>void, accent?:'cyan'|'indigo'|'emerald'|'teal', disabled?:boolean}){
  const cls = useMemo(()=>({
    cyan: 'from-cyan-600/80 to-cyan-800/80 hover:from-cyan-500/80',
    indigo:'from-indigo-600/80 to-indigo-800/80 hover:from-indigo-500/80',
    emerald:'from-emerald-600/80 to-emerald-800/80 hover:from-emerald-500/80',
    teal:  'from-teal-600/80 to-teal-800/80 hover:from-teal-500/80'
  } as const)[accent],[accent])
  return (
    <button onClick={onClick} disabled={disabled} className={[
      'px-3 h-8 rounded-xl text-xs font-medium text-white transition shadow-sm bg-gradient-to-b ring-1',
      'backdrop-blur border border-white/5 ring-white/10', cls,
      disabled?'opacity-60 cursor-not-allowed':''
    ].join(' ')}>{children}</button>
  )
}

function FooterGlass({ siteLabel, githubLabel, privacyLabel }:{ siteLabel:string, githubLabel:string, privacyLabel:string }){
  return (
    <div className='fixed bottom-0 inset-x-0 px-4 pb-3 pointer-events-none'>
      <div className='pointer-events-auto max-w-3xl mx-auto flex items-center justify-between text-sm rounded-xl px-3 py-2 bg-slate-900/70 backdrop-blur ring-1 ring-slate-800'>
        <div className='flex gap-3 text-slate-300'>
          <a className='hover:text-slate-100' href='https://getlifeundo.com' target='_blank'>{siteLabel}</a>
          <a className='hover:text-slate-100' href='https://github.com/LifeUndo' target='_blank'>{githubLabel}</a>
          <a className='hover:text-slate-100' href='https://getlifeundo.com/privacy/privacy' target='_blank'>{privacyLabel}</a>
          <a className='hover:text-slate-100' href='https://getlifeundo.com/privacy/legal/offer' target='_blank'>Оферта</a>
        </div>
        <div className='text-slate-500'>GetLifeUndo™</div>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    api: {
      fkCreate: (plan:string, locale:string)=>Promise<any>
      getVersion: ()=>Promise<string>
      getLocale: ()=>Promise<'ru'|'en'>
      setLocale: (locale:'ru'|'en')=>Promise<any>
      getSettings: ()=>Promise<any>
      setSettings:(patch:any)=>Promise<any>
      listShots:(limit?:number)=>Promise<any>
      listTextHistory:(limit?:number)=>Promise<any[]>
      openPath:(p:string)=>Promise<any>
      revealFile:(p:string)=>Promise<any>
      openLogsDir: ()=>Promise<any>
      exportLogsCopy: ()=>Promise<{ok:boolean, path?:string}>
      pickDir: ()=>Promise<{ok:boolean, path?:string}>
      openShotsDir: ()=>Promise<any>
      getUserDataDir: ()=>Promise<string>
      openUserDataDir: ()=>Promise<any>
      onResetUI?: (cb:()=>void)=>void
      licenseValidate?: ()=>Promise<{ok:boolean, raw:any, deviceId?:string}>
      pairCreate?: ()=>Promise<any>
      pairConsume?: (code:string)=>Promise<any>
      meshGetPubkey?: ()=>Promise<{ok:boolean, deviceId?:string, publicKey?:string}>
      meshListPeers?: ()=>Promise<{ok:boolean, peers:any[]}>
      meshStartPair?: ()=>Promise<{ok:boolean, pin:string, uri:string, payload:any}>
      meshAcceptPair?: (payload:any)=>Promise<{ok:boolean, peers:any[]}>
      meshDiscoveryStart?: ()=>Promise<{ok:boolean}>
      meshDiscoveryStop?: ()=>Promise<{ok:boolean}>
      meshListDiscovered?: ()=>Promise<{ok:boolean, items:any[]}>
      getOrgStatus?: ()=>Promise<{ok:boolean, org?:any, keys?:any[], error?:string}>
      exportOrgKeysCsv?: ()=>Promise<{ok:boolean, path?:string, error?:string}>
    }
  }
}

function SegButton({ active, children, onClick }:{active:boolean, children:React.ReactNode, onClick:()=>void}){
  return (
    <button
      onClick={(e)=>{ try{ e.preventDefault(); e.stopPropagation() }catch{}; onClick() }}
      className={[
        'px-2.5 h-8 rounded-full text-[11px] leading-tight transition ring-2 whitespace-nowrap',
        active
          ? 'bg-slate-900/60 text-cyan-50 ring-cyan-300 shadow-md shadow-cyan-900/40'
          : 'bg-slate-900/40 text-slate-100 ring-slate-600 hover:bg-slate-800/70'
      ].join(' ')}
    >{children}</button>
  )
}

function PayCard({ title, price, btn, plan, accent, locale }:{title:string, price:string, btn:string, plan:'pro_month'|'vip_lifetime'|'team_5', accent:'indigo'|'emerald'|'teal', locale:'ru'|'en'}){
  const [busy, setBusy] = useState(false)
  const cls = useMemo(()=>({
    indigo: 'from-indigo-500 to-indigo-700 hover:from-indigo-400',
    emerald:'from-emerald-500 to-emerald-700 hover:from-emerald-400',
    teal:   'from-teal-500 to-teal-700 hover:from-teal-400'
  } as const)[accent],[accent])
  const go = async ()=>{
    if (busy) return; setBusy(true)
    try{ await window.api.fkCreate(plan, locale) }finally{ setBusy(false) }
  }
  return (
    <div className='p-4 rounded-2xl bg-slate-800/70 ring-1 ring-slate-700 w-full'>
      <div className='text-slate-200 text-sm font-medium'>{title}</div>
      <div className='text-slate-400 text-xs mb-3'>{price}</div>
      <button onClick={go} className={[
        'w-full h-9 rounded-xl text-white text-sm font-medium shadow-sm transition bg-gradient-to-b', cls
      ].join(' ')} disabled={busy}>{busy?'...':btn}</button>
    </div>
  )
}

export default function App(){
  const dbg = (m:string)=>{ try{ (window as any).api?.debugLog && (window as any).api.debugLog(m) }catch{} }
  const [tab, setTab] = useState<'tabs'|'shots'|'text'>('tabs')
  const [ver, setVer] = useState('')
  const [locale, setLocale] = useState<'ru'|'en'>('ru')
  const [settingsOpen, setSettingsOpen] = useState<false|'menu'|'general'|'subs'|'about'|'apps'|'faq'|'timeline'|'timeline2'|'devices'>(false)
  const [settings, setSettings] = useState<any>(null)
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | undefined>(undefined)
  const [trialEndTs, setTrialEndTs] = useState<number | null>(null)
  const [trialRemain, setTrialRemain] = useState<{days:number; hours:number} | null>(null)
  const [licenseStatus, setLicenseStatus] = useState<'trial'|'active'|'unknown'>('unknown')
  const [licenseTier, setLicenseTier] = useState<string>('free')
  const [deviceStatus, setDeviceStatus] = useState<'active'|'limit_exceeded'|'unknown'>('unknown')
  const [devicesUsed, setDevicesUsed] = useState<number | undefined>(undefined)
  const [deviceLimit, setDeviceLimit] = useState<number | undefined>(undefined)
  // subStatus теперь не имеет значения по умолчанию "Free", чтобы не показывать FREE в UI
  const subStatus = (settings?.subStatus as string) || ''
  const [shots, setShots] = useState<Array<{path:string}>>([])
  const [shotsTotal, setShotsTotal] = useState<number>(0)
  const [texts, setTexts] = useState<any[]>([])
  useEffect(()=>{
    window.api.getVersion().then(setVer).catch(()=>{})
    window.api.getLocale().then((l:'ru'|'en')=>{ if(l==='en') setLocale('en') }).catch(()=>{})
    window.api.getSettings().then(async(s)=>{
      setSettings(s)
      try{
        const now = Date.now()
        const tStartRaw = (s as any)?.trialStart as number | undefined
        const tEndRaw = (s as any)?.trialEnd as number | undefined
        const hasFuture = typeof tEndRaw==='number' && tEndRaw>now
        if (hasFuture){
          setTrialEndTs(tEndRaw as number)
          return
        }
        const newStart = now
        const newEnd = now + 7*24*60*60*1000
        try{
          const next = await window.api.setSettings({ trialStart: newStart, trialEnd: newEnd })
          setSettings(next)
        }catch{}
        setTrialEndTs(newEnd)
      }catch{}
    }).catch(()=>{})
    // Централизованный 7‑дневный триал через LICENSE_VALIDATE (используем только статус/уровень, не трогаем локальный trialEndTs)
    try{
      window.api.licenseValidate && window.api.licenseValidate().then((r:any)=>{
        const raw = r && r.raw
        if (raw){
          const st = (raw.status as string)||''
          setLicenseStatus(st==='trial' || st==='active' ? st : 'unknown')
          if (raw.tier) setLicenseTier(String(raw.tier))
          if (typeof raw.devicesUsed==='number') setDevicesUsed(raw.devicesUsed)
          if (typeof raw.deviceLimit==='number') setDeviceLimit(raw.deviceLimit)
          const ds = (raw.deviceStatus as string)||''
          setDeviceStatus(ds==='active' || ds==='limit_exceeded' ? ds : 'unknown')
        }
      }).catch(()=>{})
    }catch{}
    // Не сбрасываем UI по RESET_UI, чтобы не закрывалась панель
    try{ window.api.onResetUI && window.api.onResetUI(()=>{}) }catch{}
  },[])
  // fallback: если в settings уже есть trialDaysLeft (локальный счётчик), используем его
  useEffect(()=>{
    if (typeof settings?.trialDaysLeft === 'number' && !trialEndTs){
      const d = settings.trialDaysLeft
      setTrialDaysLeft(d)
      setTrialRemain({ days: d, hours: 0 })
    }
  },[settings, trialEndTs])

  // пересчёт оставшегося триала из trialEndTs (общий для всех устройств)
  useEffect(()=>{
    if (!trialEndTs) return
    const calc = ()=>{
      const msLeft = trialEndTs - Date.now()
      if (msLeft <= 0){
        setTrialRemain(null)
        setTrialDaysLeft(0)
        return
      }
      const totalHours = Math.floor(msLeft / (60*60*1000))
      const days = Math.floor(totalHours / 24)
      const hours = totalHours - days*24
      setTrialDaysLeft(days)
      setTrialRemain({ days, hours })
    }
    calc()
    const id = setInterval(calc, 60*60*1000) // обновляем раз в час, как и раньше
    return ()=>{ clearInterval(id) }
  },[trialEndTs])
  useEffect(()=>{
    try{
      if (settingsOpen){ document.documentElement.style.overflow='hidden'; document.body.style.overflow='hidden' }
      else { document.documentElement.style.overflow=''; document.body.style.overflow='' }
    }catch{}
  },[settingsOpen])
  useEffect(()=>{ dbg(`settingsOpen:${String(settingsOpen)}`) },[settingsOpen])
  // закрытие по Esc — стандартное поведение (не переопределяем)
  const toggleLocale = async ()=>{
    const next = locale==='ru'?'en':'ru'
    setLocale(next)
    try{ await window.api.setLocale(next) }catch{}
  }
  const t = useMemo(()=>createT(locale), [locale])

  useEffect(()=>{
    dbg(`topTab:${tab}`)
    if (tab==='shots'){ window.api.listShots(5).then((res:any)=>{ setShots(res?.items||[]); setShotsTotal(res?.total||0); dbg(`shots:items=${res?.items?.length||0},total=${res?.total||0}`) }).catch(()=>{ setShots([]); setShotsTotal(0); dbg('shots:error') }) }
    if (tab==='text'){ window.api.listTextHistory(200).then((rows)=>{ setTexts(rows); dbg(`text:rows=${rows?.length||0}`) }).catch(()=>{ setTexts([]); dbg('text:error') }) }
  },[tab])
  useEffect(()=>{
    if (settingsOpen==='timeline'){
      window.api.listShots(5).then((res:any)=>{ setShots(res?.items||[]); setShotsTotal(res?.total||0) }).catch(()=>{ setShots([]); setShotsTotal(0) })
      window.api.listTextHistory(200).then(setTexts).catch(()=>setTexts([]))
    }
  },[settingsOpen])

  // сохраняем последнюю вкладку Ленты между рендерами
  let lastTlTabRef:any = (window as any).__lu_lastTlTab || 'tabs'
  const SettingsDrawer = ({ initialTab }: { initialTab?: 'menu'|'general'|'subs'|'about'|'app'|'faq'|'apps'|'timeline'|'timeline2'|'devices'|'team' })=>{
    const [s, setS] = useState<any>({ ...(settings||{}), textRetentionHours: (settings?.textRetentionHours||24), shotsRetentionCount: (settings?.shotsRetentionCount||5) })
    const initInner:any = (typeof document!=='undefined' && (document as any)._lastInnerTab) || initialTab || 'menu'
    const [innerTab, setInnerTab] = useState<'menu'|'general'|'subs'|'about'|'app'|'faq'|'apps'|'timeline'|'timeline2'|'devices'|'team'>(initInner)
    const [tlTab, setTlTab] = useState<'tabs'|'shots'|'text'>(lastTlTabRef)
    const [tlErr, setTlErr] = useState<string>('')
    // Лента‑2 изолированные состояния
    const initTl2:any = (typeof window!=='undefined' && (window as any).__lu_lastTl2Tab) || 'tabs'
    const [tl2Tab, setTl2Tab] = useState<'tabs'|'shots'|'text'>(initTl2)
    const [shots2, setShots2] = useState<Array<{path:string}>>([])
    const [shots2Total, setShots2Total] = useState<number>(0)
    const [texts2, setTexts2] = useState<any[]>([])
    const [accountEmail, setAccountEmail] = useState<string>(settings?.accountEmail || '')
    const [orgLoading, setOrgLoading] = useState(false)
    const [orgError, setOrgError] = useState('')
    const [org, setOrg] = useState<any>(null)
    const [orgKeys, setOrgKeys] = useState<any[]>([])
    useEffect(()=>{ try{ (document as any)._lastInnerTab = innerTab }catch{}; dbg(`innerTab:${innerTab}`) },[innerTab])
    useEffect(()=>{ setS({ ...(settings||{}), textRetentionHours: (settings?.textRetentionHours||24), shotsRetentionCount: (settings?.shotsRetentionCount||5) }); setAccountEmail(settings?.accountEmail || '') },[settings])
    useEffect(()=>{ try{ (window as any).__lu_lastTlTab = tlTab }catch{}; dbg(`tlTab:${tlTab}`) },[tlTab])
    useEffect(()=>{ try{ (window as any).__lu_lastTl2Tab = tl2Tab }catch{}; dbg(`tl2Tab:${tl2Tab}`) },[tl2Tab])
    useEffect(()=>{
      if (innerTab!=='team') return
      if (!window.api.getOrgStatus){
        setOrgError(locale==='ru' ? 'В этой сборке нет getOrgStatus (TEAM недоступен).' : 'getOrgStatus is not exposed in this build (TEAM unavailable).')
        return
      }
      setOrgLoading(true)
      setOrgError('')
      window.api.getOrgStatus().then((r:any)=>{
        if (r && r.ok){
          setOrg(r.org||null)
          setOrgKeys((r.keys||[]).slice(0,50))
        } else {
          setOrgError((r && r.error) || (locale==='ru'?'Ошибка загрузки организации':'Failed to load organization'))
        }
      }).catch(()=>{
        setOrgError(locale==='ru'?'Ошибка запроса getOrgStatus':'getOrgStatus request failed')
      }).finally(()=>{
        setOrgLoading(false)
      })
    },[innerTab, locale])
    // защита: если Лента открыта, не позволяем innerTab уехать в 'menu' самопроизвольно
    useEffect(()=>{
      if (settingsOpen==='timeline' && innerTab!=='timeline'){
        dbg(`guard:force-timeline from ${innerTab}`)
        setInnerTab('timeline')
      }
    },[settingsOpen, innerTab])
    useEffect(()=>{
      if (innerTab!=='timeline') return
      // не трогаем settingsOpen тут, чтобы избежать мерцаний
      if (tlTab==='shots'){
        window.api.listShots(5).then((res:any)=>{ setShots(res?.items||[]); setShotsTotal(res?.total||0); setTlErr(''); dbg(`timeline:shots:items=${res?.items?.length||0},total=${res?.total||0}`) }).catch((e)=>{ setShots([]); setShotsTotal(0); setTlErr('Ошибка загрузки скринов'); dbg('timeline:shots:error') })
      }
      if (tlTab==='text'){
        window.api.listTextHistory(200).then((r)=>{ setTexts(r); setTlErr(''); dbg(`timeline:text:rows=${r?.length||0}`) }).catch(()=>{ setTexts([]); setTlErr('Ошибка загрузки текста'); dbg('timeline:text:error') })
      }
    },[innerTab, tlTab])
    // Загрузки для Лента (изолированная)
    useEffect(()=>{
      if (innerTab!=='timeline2') return
      if (tl2Tab==='shots'){
        const n = s.shotsRetentionCount||5
        window.api.listShots(n).then((res:any)=>{ setShots2(res?.items||[]); setShots2Total(res?.total||0) }).catch(()=>{ setShots2([]); setShots2Total(0) })
      }
      if (tl2Tab==='text'){
        window.api.listTextHistory(200).then((rows)=>setTexts2((rows||[]).slice(-200))).catch(()=>setTexts2([]))
      }
    },[innerTab, tl2Tab])
    
    const save = async (patch:any)=>{ const next = await window.api.setSettings(patch); setSettings(next); setS({ ...next, textRetentionHours: (next?.textRetentionHours||24), shotsRetentionCount: (next?.shotsRetentionCount||5) }) }
    const doShare = async ()=>{
      const url = 'https://getlifeundo.com'
      try{ if ((navigator as any)?.share){ await (navigator as any).share({ title:'GetLifeUndo', url }); return } }catch{}
      try{ window.open(url, '_blank'); return }catch{}
      try{ await navigator.clipboard.writeText(url) }catch{}
    }
    const doRate = ()=>{ try{ window.open('https://www.rustore.ru/catalog/app/com.getlifeundo.lifeundo_app','_blank') }catch{} }
    const warnAutostartOff = ()=> alert(locale==='ru' ? 'Отключение автозапуска может привести к потере несохранённых данных. Продолжайте только если понимаете риски.' : 'Disabling autostart may lead to data loss if apps close unexpectedly. Proceed only if you understand the risks.')
    const toggleAutostart = async ()=>{ const v = !s.autostartEnabled; if (!v) warnAutostartOff(); await save({ autostartEnabled: v }) }
    const L = (k:string)=>({
      ru:{settings:'Настройки',general:'Общие',subs:'Подписка',about:'О нас',app:'Приложения',faq:'FAQ',timeline:'Лента',timeline2:'Лента',team:'TEAM',lang:'Язык',autostart:'Автозапуск',limits:'Лимиты',shotsLimit:'Скрины',textLimit:'Текст',save:'Сохранить',status:'Статус',version:'Версия',site:'Сайт',github:'GitHub',privacy:'Приватность',share:'Поделиться',rate:'Оценить',downloads:'Где скачать',openLogs:'Открыть логи',exportLogs:'Экспорт логов',paths:'Пути наблюдения',screens:'Скриншоты',documents:'Документы',downloadsDir:'Загрузки',social:'Соцсети',addShotsPath:'Добавить путь для скринов',addTextPath:'Добавить путь для текстов',
          text_retention:'Срок хранения текста', shots_retention:'Лимит скринов', hours12:'12 ч', hours24:'24 ч', hours48:'48 ч', shots5:'5', shots10:'10', shots25:'25', shots50:'50',
          retention_note_text:'По умолчанию показываем последние записи за выбранный период (макс. 20).',
          retention_note_shots:'По умолчанию показываем N последних скринов.',
          apps_browser:'Браузерные расширения', soon:'скоро', apps_android:'Android', apps_desktop:'Desktop', devices:'Ваши устройства', in_dev:'в разработке',
          show_here:'Показывать список здесь', video:'Запись видео', event_mode:'Режим мероприятия', subscribe_email:'Подписаться на обновления (email):',
          team_admin:'TEAM / админ панель', org:'Организация', keys:'Ключи TEAM'},
      en:{settings:'Settings',general:'General',subs:'Subscription',about:'About',app:'Apps',faq:'FAQ',timeline:'Timeline',timeline2:'Timeline',team:'TEAM',lang:'Language',autostart:'Autostart',limits:'Limits',shotsLimit:'Screens',textLimit:'Text',save:'Save',status:'Status',version:'Version',site:'Website',github:'GitHub',privacy:'Privacy',share:'Share',rate:'Rate',downloads:'Downloads',openLogs:'Open logs',paths:'Watch paths',screens:'Screenshots',documents:'Documents',downloadsDir:'Downloads',social:'Social',addShotsPath:'Add screenshots path',addTextPath:'Add text path',
          text_retention:'Text retention', shots_retention:'Screens limit', hours12:'12 h', hours24:'24 h', hours48:'48 h', shots5:'5', shots10:'10', shots25:'25', shots50:'50',
          retention_note_text:'By default we show the latest entries for the selected time window (max 20).',
          retention_note_shots:'By default we show N latest screenshots.',
          apps_browser:'Browser extensions', soon:'soon', apps_android:'Android', apps_desktop:'Desktop', devices:'Your devices', in_dev:'in development',
          show_here:'Show list here', video:'Video capture', event_mode:'Event mode', subscribe_email:'Subscribe for updates (email):',
          team_admin:'TEAM / admin panel', org:'Organization', keys:'TEAM keys'}
    } as any)[locale][k]||k
    return (
      <div className='fixed inset-0 z-50'>
        <div className='absolute inset-0 bg-black/60' onClick={()=>{ try{ (window as any).api?.hideToTray?.() }catch{} }} />
        <div className='absolute inset-0 bg-slate-900 ring-1 ring-slate-800 flex flex-col'>
          <div className='px-4 pt-4 pb-2 shrink-0 bg-slate-900'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <button className='px-3 h-8 rounded-full bg-slate-800 text-slate-100 ring-1 ring-slate-700' onClick={()=>setSettingsOpen(false)}>←</button>
                <div className='text-lg font-semibold'>{innerTab==='menu'?L('settings'):innerTab==='timeline'?L('timeline'):innerTab==='general'?L('settings'):innerTab==='subs'?L('subs'):innerTab==='about'?L('about'):innerTab==='devices'?L('devices'):innerTab==='app'||innerTab==='apps'?L('app'):innerTab==='faq'?L('faq'):L('settings')}</div>
              </div>
              <button className='px-3 h-8 rounded-full bg-slate-800 text-slate-100 ring-1 ring-slate-700' onClick={()=>setSettingsOpen(false)}>✕</button>
            </div>
            {innerTab!=='menu' && (
              <div className='mt-3'>
                <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-4'>
                  <div className='grid grid-cols-[0.8fr,1.4fr,1.4fr,0.8fr] gap-2'>
                    <SegButton active={innerTab==='general'} onClick={()=>setInnerTab('general')}>{L('general')}</SegButton>
                    <SegButton active={innerTab==='apps'} onClick={()=>setInnerTab('apps')}>{L('app')}</SegButton>
                    <SegButton active={innerTab==='subs'} onClick={()=>setInnerTab('subs')}>{L('subs')}</SegButton>
                    <SegButton active={innerTab==='about'} onClick={()=>setInnerTab('about')}>{L('about')}</SegButton>
                  </div>
                  <div className='mt-3 grid grid-cols-[0.8fr,1.4fr,1.4fr,0.8fr] gap-2'>
                    <SegButton active={innerTab==='faq'} onClick={()=>setInnerTab('faq')}>{L('faq')}</SegButton>
                    <SegButton active={innerTab==='timeline2'} onClick={()=>setInnerTab('timeline2')}>{L('timeline2')}</SegButton>
                    <SegButton active={innerTab==='devices'} onClick={()=>setInnerTab('devices')}>{L('devices')}</SegButton>
                    <SegButton active={innerTab==='team'} onClick={()=>setInnerTab('team')}>{L('team')}</SegButton>
                  </div>
                </div>
              </div>
            )}
            {innerTab==='menu' && (
              <div className='mt-3'>
                <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-4'>
                  <div className='grid grid-cols-[0.8fr,1.4fr,1.4fr,0.8fr] gap-2'>
                    <SegButton active={false} onClick={()=> setInnerTab('general') }>{L('general')}</SegButton>
                    <SegButton active={false} onClick={()=> setInnerTab('apps') }>{L('app')}</SegButton>
                    <SegButton active={false} onClick={()=> setInnerTab('subs') }>{L('subs')}</SegButton>
                    <SegButton active={false} onClick={()=> setInnerTab('about') }>{L('about')}</SegButton>
                  </div>
                  <div className='mt-3 grid grid-cols-[0.8fr,1.4fr,1.4fr,0.8fr] gap-2'>
                    <SegButton active={false} onClick={()=> setInnerTab('faq') }>{L('faq')}</SegButton>
                    <SegButton active={false} onClick={()=> setInnerTab('timeline2') }>{L('timeline2')}</SegButton>
                    <SegButton active={false} onClick={()=> setInnerTab('devices') }>{L('devices')}</SegButton>
                    <SegButton active={false} onClick={()=> setInnerTab('team') }>{L('team')}</SegButton>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className='flex-1 overflow-y-auto p-6 space-y-6 pb-20'>
          {innerTab==='menu' && (
            <div className='space-y-6'>
              <div className='text-slate-400 text-sm'>{locale==='ru'?'Дополнительные разделы появятся позже.':'More sections will appear later.'}</div>
            </div>
          )}
          {innerTab==='devices' && (
            <div className='space-y-3'>
              <DevicesSection locale={locale} />
            </div>
          )}
          {innerTab==='timeline2' && (
            <div className='space-y-3'>
              <div className='flex flex-wrap gap-2'>
                <SegButton active={tl2Tab==='tabs'} onClick={()=> setTl2Tab('tabs') }>{t('tabs')}</SegButton>
                <SegButton active={tl2Tab==='shots'} onClick={()=> setTl2Tab('shots') }>{t('shots')}</SegButton>
                <SegButton active={tl2Tab==='text'} onClick={()=> setTl2Tab('text') }>{t('text')}</SegButton>
              </div>
              {tl2Tab==='tabs' && (
                <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-3 text-slate-300 text-sm'>
                  <div className='text-slate-200 font-medium mb-3'>{t('tabs')}</div>
                  <div className='space-y-2'>
                    <div>{t('tabs_hint1')}</div>
                    <div>{t('tabs_hint2')}</div>
                    <div className='text-slate-400'>{t('local_note')}</div>
                  </div>
                </div>
              )}
              {tl2Tab==='shots' && (
                <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-2 space-y-2'>
                  <div className='flex items-center justify-between text-slate-400 text-xs'>
                    <div>{(createT(locale)('shots_latest_of_total') as any)(shots2.length, shots2Total)}</div>
                    <GButton accent='cyan' onClick={()=>window.api.openShotsDir()}>{t('shots_open_folder')}</GButton>
                  </div>
                  {shots2.length===0 && <div className='text-slate-400 text-sm'>{t('shots_empty')}</div>}
                  <div className='max-h-48 overflow-y-auto rounded-lg ring-1 ring-slate-700/50 divide-y divide-slate-700/50 bg-slate-900/40'>
                    {shots2.map(s=> (
                      <div key={s.path} className='flex items-center justify-between text-sm text-slate-300 px-2 py-1'>
                        <div className='truncate max-w-[70%]' title={s.path}>{s.path}</div>
                        <GButton accent='indigo' onClick={()=> window.api.revealFile(s.path) }>{locale==='ru'?'Показать':'Reveal'}</GButton>
                      </div>
                    ))}
                  </div>
                  <div className='text-slate-400 text-xs pt-2'>
                    {L('shots_retention')}: 
                    <span className='inline-flex gap-1 ml-2'>
                      <GButton accent={ (s.shotsRetentionCount||5)===5?'indigo':undefined } onClick={()=> save({ shotsRetentionCount:5 }) }>{L('shots5')}</GButton>
                      <GButton accent={ (s.shotsRetentionCount||5)===10?'indigo':undefined } onClick={()=> save({ shotsRetentionCount:10 }) }>{L('shots10')}</GButton>
                      <GButton accent={ (s.shotsRetentionCount||5)===25?'indigo':undefined } onClick={()=> save({ shotsRetentionCount:25 }) }>{L('shots25')}</GButton>
                      <GButton accent={ (s.shotsRetentionCount||5)===50?'indigo':undefined } onClick={()=> save({ shotsRetentionCount:50 }) }>{L('shots50')}</GButton>
                    </span>
                  </div>
                  <div className='text-slate-500 text-xs'>{L('retention_note_shots')}</div>
                </div>
              )}
              {tl2Tab==='text' && (
                <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-2 space-y-3'>
                  <div className='flex items-center justify-between text-slate-400 text-xs'>
                    <div></div>
                    <GButton accent='emerald' onClick={()=>window.api.openUserDataDir()}>{t('text_open_archive')}</GButton>
                  </div>
                  {texts2.length===0 && <div className='text-slate-400 text-sm'>{t('text_empty')}</div>}
                  <div className='max-h-48 overflow-y-auto rounded-lg ring-1 ring-slate-700/50 divide-y divide-slate-700/50 bg-slate-900/40 p-2'>
                    {(()=>{ const now=Date.now(); const ms=(s.textRetentionHours||24)*60*60*1000; const arr=[...texts2].filter(r=> (r?.t?Number(r.t):0) >= (now-ms)).sort((a,b)=> (Number(b?.t||0)-Number(a?.t||0))).slice(0,100); return arr })().map((r,i)=> (
                      <div key={i} className='text-slate-200 text-sm whitespace-pre-wrap break-words py-1'>{r.text}</div>
                    ))}
                  </div>
                  <div className='text-slate-400 text-xs'>
                    {L('text_retention')}: 
                    <span className='inline-flex gap-1 ml-2'>
                      <GButton accent={ (s.textRetentionHours||24)===12?'indigo':undefined } onClick={()=> save({ textRetentionHours:12 }) }>{L('hours12')}</GButton>
                      <GButton accent={ (s.textRetentionHours||24)===24?'indigo':undefined } onClick={()=> save({ textRetentionHours:24 }) }>{L('hours24')}</GButton>
                      <GButton accent={ (s.textRetentionHours||24)===48?'indigo':undefined } onClick={()=> save({ textRetentionHours:48 }) }>{L('hours48')}</GButton>
                    </span>
                  </div>
                  <div className='text-slate-500 text-xs'>{L('retention_note_text')}</div>
                  {/* нижнюю кнопку архива убрали, оставили только верхнюю */}
                </div>
              )}
            </div>
          )}
          {innerTab==='general' && (
            <div className='space-y-3'>
              <div className='rounded-xl ring-1 ring-slate-700 p-3 space-y-3'>
                <div className='text-slate-200 text-sm'>{L('lang')}</div>
                <select value={locale} onChange={async(e)=>{ const n=(e.target.value==='en'?'en':'ru') as ('ru'|'en'); setLocale(n); try{ await window.api.setLocale(n) }catch{} }} className='bg-slate-800 text-slate-100 rounded px-3 h-9 ring-1 ring-slate-700 w-full max-w-[220px]'>
                  <option value='ru'>Русский</option>
                  <option value='en'>English</option>
                </select>
                {ver && (
                  <div className='text-slate-400 text-xs mt-2'>{L('version')}: v{ver}</div>
                )}
              </div>
              <div className='rounded-xl ring-1 ring-slate-700 p-3 space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='text-slate-200 text-sm'>{L('show_here')} <span title={locale==='ru' ? 'Показывать список внутри окна приложения' : 'Show the list inside the app window'} className='inline-flex items-center justify-center align-middle w-5 h-5 ml-1 rounded-full bg-slate-700 text-slate-100 text-xs ring-1 ring-slate-500'>!</span></div>
                  <button onClick={async()=>{ await save({ showListHere: !s?.showListHere }); }} className={'px-3 h-8 rounded-xl ring-1 text-xs font-semibold '+(s?.showListHere?'bg-emerald-700 ring-emerald-500':'bg-slate-700 ring-slate-500')}>{s?.showListHere?'ON':'OFF'}</button>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='text-slate-200 text-sm'>{L('screens')} <span title={locale==='ru' ? 'Автоматически сохранять скриншоты' : 'Automatically capture screenshots'} className='inline-flex items-center justify-center align-middle w-5 h-5 ml-1 rounded-full bg-slate-700 text-slate-100 text-xs ring-1 ring-slate-500'>!</span></div>
                  <button onClick={async()=>{ await save({ shotsEnabled: !s?.shotsEnabled }); }} className={'px-3 h-8 rounded-xl ring-1 text-xs font-semibold '+(s?.shotsEnabled?'bg-emerald-700 ring-emerald-500':'bg-slate-700 ring-slate-500')}>{s?.shotsEnabled?'ON':'OFF'}</button>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='text-slate-200 text-sm'>{L('video')} <span title={locale==='ru' ? 'Запись короткого видео (позже)' : 'Capture short videos (later)'} className='inline-flex items-center justify-center align-middle w-5 h-5 ml-1 rounded-full bg-slate-700 text-slate-100 text-xs ring-1 ring-slate-500'>!</span></div>
                  <button onClick={async()=>{ await save({ videoEnabled: !s?.videoEnabled }); }} className={'px-3 h-8 rounded-xl ring-1 text-xs font-semibold '+(s?.videoEnabled?'bg-emerald-700 ring-emerald-500':'bg-slate-700 ring-slate-500')}>{s?.videoEnabled?'ON':'OFF'}</button>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='text-slate-200 text-sm'>{L('event_mode')} <span title={locale==='ru' ? 'Скрывать чувствительные данные на показах' : 'Hide sensitive data during demos'} className='inline-flex items-center justify-center align-middle w-5 h-5 ml-1 rounded-full bg-slate-700 text-slate-100 text-xs ring-1 ring-slate-500'>!</span></div>
                  <button onClick={async()=>{ await save({ eventMode: !s?.eventMode }); }} className={'px-3 h-8 rounded-xl ring-1 text-xs font-semibold '+(s?.eventMode?'bg-emerald-700 ring-emerald-500':'bg-slate-700 ring-slate-500')}>{s?.eventMode?'ON':'OFF'}</button>
                </div>
              </div>
              <div className='rounded-xl ring-1 ring-slate-700 p-3 space-y-2'>
                <div className='text-slate-200 text-sm'>Email для аккаунта</div>
                <input
                  placeholder='info@getlifeundo.com'
                  value={accountEmail}
                  onChange={e=>setAccountEmail(e.target.value)}
                  className='w-full h-9 rounded bg-slate-800 text-slate-100 px-3 ring-1 ring-slate-700'
                />
                <div className='text-slate-400 text-xs space-y-1'>
                  <div>Используется для триала, подписки и привязки устройств. Укажите рабочий адрес.</div>
                  <div>Используется этот же адрес. Будем присылать только важные новости о релизах и изменениях условий, а также сможем вручную активировать лицензию при необходимости.</div>
                </div>
                <div className='flex justify-end'>
                  <GButton
                    accent='emerald'
                    onClick={async()=>{
                      const v = (accountEmail||'').trim()
                      if (!v || !v.includes('@') || !v.includes('.')){
                        alert(locale==='ru' ? 'Введите корректный email для аккаунта' : 'Enter a valid account email')
                        return
                      }
                      const next = await window.api.setSettings({ accountEmail: v })
                      setSettings(next)
                      setS({ ...(next||{}), textRetentionHours: (next?.textRetentionHours||24), shotsRetentionCount: (next?.shotsRetentionCount||5) })
                      setAccountEmail(next?.accountEmail || v)
                      // расширенное письмо: важные обновления + данные устройства и команды (RU/EN)
                      try{
                        let deviceId = ''
                        let platform = 'desktop'
                        let appVersion = '0.6.1.1'
                        try{
                          const meta = await (window.api as any).getDeviceMeta?.()
                          if (meta){
                            deviceId = String(meta.deviceId||'')
                            platform = String(meta.platform||platform)
                            appVersion = String(meta.appVersion||appVersion)
                          }
                        }catch{}
                        const orgId = org ? String((org as any).id||'') : ''
                        const isRu = locale==='ru'
                        const subject = encodeURIComponent(isRu
                          ? 'GetLifeUndo Desktop 0.6.1.1 — email для важных обновлений'
                          : 'GetLifeUndo Desktop 0.6.1.1 — email for important updates')
                        const bodyLines = isRu ? [
                          'Прошу добавить этот адрес в список важных обновлений десктоп-версии и использовать его для активации устройства/подписки.',
                          '',
                          'GetLifeUndo.',
                          `Email: ${v}`,
                          `DeviceId: ${deviceId||'-'}`,
                          `Платформа: ${platform}`,
                          `Версия: ${appVersion}`,
                          orgId ? `TEAM / Org ID: ${orgId}` : '',
                        ] : [
                          'Please add this address to the important desktop updates list and use it to activate the device/subscription.',
                          '',
                          'GetLifeUndo.',
                          `Email: ${v}`,
                          `DeviceId: ${deviceId||'-'}`,
                          `Platform: ${platform}`,
                          `Version: ${appVersion}`,
                          orgId ? `TEAM / Org ID: ${orgId}` : '',
                        ]
                        const body = encodeURIComponent(bodyLines.filter(Boolean).join('\n'))
                        window.open(`mailto:legal@getlifeundo.com?subject=${subject}&body=${body}`)
                      }catch{}
                    }}
                  >{locale==='ru'?'Отправить':'Save'}</GButton>
                </div>
              </div>
              <div className='rounded-xl ring-1 ring-slate-700 p-3 space-y-2'>
                <div className='text-slate-200 text-sm'>{L('paths')}</div>
                <ul className='text-slate-400 text-sm list-disc pl-5'>
                  <li>{locale==='ru' ? 'Скриншоты: Изображения/Скриншоты, OneDrive, Dropbox + пользовательские пути' : `${L('screens')}: Pictures/Screenshots, OneDrive, Dropbox + custom`}</li>
                  {Array.isArray(s?.watchPaths?.shots) && s.watchPaths.shots.map((p:string)=> <li key={p} className='ml-4'>• {p}</li>)}
                  <li>{locale==='ru' ? 'Документы: Документы + пользовательские пути' : `${L('documents')}: Documents + custom`}</li>
                  <li>{locale==='ru' ? 'Загрузки: Загрузки + пользовательские пути' : `${L('downloadsDir')}: Downloads + custom`}</li>
                  {Array.isArray(s?.watchPaths?.textDirs) && s.watchPaths.textDirs.map((p:string)=> <li key={p} className='ml-4'>• {p}</li>)}
                </ul>
                <div className='text-slate-500 text-xs'>
                  {locale==='ru' ? 'Подсказка: добавьте свои папки, если системные пути отличаются.' : 'Tip: add your own folders if system paths differ.'}
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <button onClick={async()=>{ const r = await window.api.pickDir(); if(r?.ok && r.path){ await save({ watchPaths: { shots: [...(s?.watchPaths?.shots||[]), r.path] } }) } }} className='px-3 py-2 min-h-9 rounded bg-slate-700 w-full text-left whitespace-normal break-words leading-snug'>{L('addShotsPath')}</button>
                  <button onClick={async()=>{ const r = await window.api.pickDir(); if(r?.ok && r.path){ await save({ watchPaths: { textDirs: [...(s?.watchPaths?.textDirs||[]), r.path] } }) } }} className='px-3 py-2 min-h-9 rounded bg-slate-700 w-full text-left whitespace-normal break-words leading-snug'>{L('addTextPath')}</button>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <button onClick={()=>window.api.openLogsDir()} className='px-3 py-2 min-h-9 rounded bg-slate-700 w-full text-left whitespace-normal break-words leading-snug'>{L('openLogs')}</button>
                  <button onClick={async()=>{const r=await window.api.exportLogsCopy(); if(r?.path){ alert((locale==='ru'?'Скопировано в: ':'Copied to: ')+r.path) } }} className='px-3 py-2 min-h-9 rounded bg-slate-700 w-full text-left whitespace-normal break-words leading-snug'>{L('exportLogs')}</button>
                </div>
              </div>
              <div className='rounded-xl ring-1 ring-slate-700 p-3 space-y-2'>
                <div className='text-slate-200 text-sm'>{L('limits')}</div>
                <div className='text-slate-400 text-sm'>{L('shotsLimit')}: ≤{s?.limits?.shotsMaxCount||200} / {s?.limits?.shotsMaxSizeMB||500}MB, {L('textLimit')}: ≤{Math.round((s?.limits?.textMaxBytes||10485760)/1024/1024)}MB</div>
              </div>
            </div>
          )}
          {innerTab==='timeline' && (
            <div className='space-y-4'>
              <div className='flex flex-wrap gap-2'>
                <SegButton active={tlTab==='tabs'} onClick={()=>setTlTab('tabs')}>{t('tabs')}</SegButton>
                <SegButton active={tlTab==='shots'} onClick={()=>setTlTab('shots')}>{t('shots')}</SegButton>
                <SegButton active={tlTab==='text'} onClick={()=>setTlTab('text')}>{t('text')}</SegButton>
              </div>
              {tlErr && (<div className='rounded-xl ring-1 ring-red-700 bg-red-900/40 text-red-200 text-sm p-2'>{tlErr}</div>)}
              {tlTab==='tabs' && (
                <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-4 text-slate-300 text-sm'>
                  <div className='text-slate-200 font-medium mb-3'>{t('tabs')}</div>
                  <div className='space-y-2'>
                    <div>{t('tabs_hint1')}</div>
                    <div>{t('tabs_hint2')}</div>
                    <div className='text-slate-400'>{t('local_note')}</div>
                  </div>
                </div>
              )}
              {tlTab==='shots' && (
                <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-3 space-y-2'>
                  <div className='flex items-center justify-between text-slate-400 text-xs'>
                    <div>{(createT(locale)('shots_latest_of_total') as any)(shots.length, shotsTotal)}</div>
                    <GButton accent='cyan' onClick={()=>window.api.openShotsDir()}>{t('shots_open_folder')}</GButton>
                  </div>
                  {shots.length===0 && <div className='text-slate-400 text-sm'>{t('shots_empty')}</div>}
                  {shots.map(s=> (
                    <div key={s.path} className='flex items-center justify-between text-sm text-slate-300'>
                      <div className='truncate max-w-[70%]' title={s.path}>{s.path}</div>
                      <GButton accent='indigo' onClick={()=>window.api.revealFile(s.path)}>{locale==='ru'?'Показать':'Reveal'}</GButton>
                    </div>
                  ))}
                </div>
              )}
              {tlTab==='text' && (
                <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-3 space-y-3'>
                  {texts.length===0 && <div className='text-slate-400 text-sm'>{t('text_empty')}</div>}
                  {texts.slice(0,7).map((r,i)=> (
                    <div key={i} className='text-slate-200 text-sm whitespace-pre-wrap break-words'>{r.text}</div>
                  ))}
                  {texts.length>7 && (
                    <div className='pt-1'>
                      <GButton accent='emerald' onClick={()=>window.api.openUserDataDir()}>{t('text_open_archive')}</GButton>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {innerTab==='subs' && (
            <div className='space-y-3'>
              <div className='text-slate-200'>
                {L('status')}: {locale==='ru'
                  ? (typeof trialDaysLeft==='number' && trialDaysLeft>0
                      ? `Триал 7 дней, осталось ${trialDaysLeft}`
                      : (subStatus || 'Лицензия не активирована'))
                  : (typeof trialDaysLeft==='number' && trialDaysLeft>0
                      ? `7-day trial, ${trialDaysLeft} days left`
                      : (subStatus || 'License not activated'))}
              </div>
              <div className='grid grid-cols-1 gap-3'>
                <PayCard title={t('pro_title')}  price={t('pro_price')}  btn={t('pro_btn')}  plan='pro_month'    accent='indigo' locale={locale} />
                <PayCard title={t('vip_title')}  price={t('vip_price')}  btn={t('vip_btn')}  plan='vip_lifetime' accent='emerald' locale={locale} />
                <PayCard title={t('team_title')} price={t('team_price')} btn={t('team_btn')} plan='team_5'      accent='teal'    locale={locale} />
              </div>
              <div className='rounded-xl ring-1 ring-slate-700 p-3 space-y-2'>
                <div className='text-slate-200 text-sm'>{locale==='ru'?'Активация':'Activation'}</div>
                <div className='flex gap-2'>
                  <input value={s?.licenseCode||''} onChange={e=>setS({...s, licenseCode:e.target.value})} placeholder='LU-XXXX-XXXX' className='flex-1 h-9 rounded bg-slate-800 text-slate-100 px-3 ring-1 ring-slate-700'/>
                  <GButton accent='indigo' onClick={async()=>{
                    const code=(s?.licenseCode||'').trim()
                    if(!code) return
                    // спец-код для включения dev TEAM-режима
                    if (code==='LU-TEAM-DEV'){
                      const next = await window.api.setSettings({ licenseCode: code, subStatus: 'TEAM DEV', teamDev: true })
                      setSettings(next)
                      setS(next)
                      setInnerTab('team')
                      return
                    }
                    const next=await window.api.setSettings({ licenseCode: code, subStatus: 'Activated' })
                    setSettings(next)
                    setS(next)
                  }}>{locale==='ru'?'Активировать код':'Activate code'}</GButton>
                </div>
                <div className='text-slate-400 text-xs'>
                  {locale==='ru'?'Временно локальная активация для теста. Позже будет файл лицензии .lifelic и админ-учёт устройств.':'Temporary local activation for testing. Later: .lifelic file and admin device tracking.'}
                </div>
              </div>
            </div>
          )}
          {innerTab==='team' && (
            <div className='space-y-3 text-sm'>
              <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-3 space-y-2'>
                <div className='text-slate-200 text-sm'>TEAM / TEAM 5</div>
                <div className='text-slate-300 text-xs'>
                  {locale==='ru'
                    ? 'TEAM — это доступ к GetLifeUndo для команды или небольшой организации. Тариф TEAM 5 рассчитан на 5 устройств (людей или рабочих станций) и даёт бонус +5% к каждому пополнению счета команды.'
                    : 'TEAM is access to GetLifeUndo for a team or small organisation. The TEAM 5 plan is designed for 5 devices (people or workstations) and gives a +5% bonus on every team top‑up.'}
                </div>
                <div className='text-slate-400 text-xs'>
                  {locale==='ru'
                    ? 'Как подключиться: напишите на support@getlifeundo.com с темой TEAM, укажите название команды/организации, ориентировочное количество людей и нужный период. Мы создадим TEAM‑аккаунт, пришлём договор и активационные ключи.'
                    : 'How to join: email support@getlifeundo.com with subject TEAM, include your team/organisation name, approximate number of people and desired period. We will create a TEAM account, send you an agreement and activation keys.'}
                </div>
                <div className='text-slate-500 text-[11px]'>
                  {locale==='ru'
                    ? 'Для пилотных команд действует индивидуальное предложение и дополнительные бонусы за обратную связь.'
                    : 'Pilot teams can get individual terms and extra bonuses for feedback.'}
                </div>
              </div>
              <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-3 space-y-1'>
                <div className='text-slate-200 text-sm'>{L('team_admin')}</div>
                {org && (
                  <div className='text-slate-300 text-xs'>
                    {L('org')}: {String((org as any).name||'—')} / {(org as any).id||''}
                  </div>
                )}
                {orgLoading && <div className='text-slate-400 text-xs'>{locale==='ru'?'Загрузка…':'Loading…'}</div>}
                {orgError && <div className='text-red-300 text-xs'>{orgError}</div>}
              </div>
              <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-3 space-y-2'>
                <div className='flex items-center justify-between'>
                  <div className='text-slate-200 text-sm'>{L('keys')}</div>
                  <GButton accent='indigo' onClick={async()=>{
                    if (!window.api.exportOrgKeysCsv){
                      alert(locale==='ru'?'В этой сборке нет exportOrgKeysCsv.':'exportOrgKeysCsv is not available in this build.')
                      return
                    }
                    try{
                      const r = await window.api.exportOrgKeysCsv()
                      if (r && r.ok && r.path){
                        alert((locale==='ru'?'Экспортировано в: ':'Exported to: ')+r.path)
                      } else {
                        alert((locale==='ru'?'Не удалось экспортировать CSV: ':'Failed to export CSV: ') + String(r && r.error || 'UNKNOWN'))
                      }
                    }catch(e:any){
                      alert((locale==='ru'?'Ошибка экспорта: ':'Export error: ')+String(e?.message||e))
                    }
                  }}>{locale==='ru'?'Экспорт CSV':'Export CSV'}</GButton>
                </div>
                <div className='rounded-md bg-slate-900/60 ring-1 ring-slate-700 max-h-64 overflow-y-auto text-xs text-slate-200 divide-y divide-slate-800'>
                  {(!orgKeys || orgKeys.length===0) && (
                    <div className='p-2 text-slate-500'>{locale==='ru'?'Ключи не найдены.':'No keys found.'}</div>
                  )}
                  {orgKeys && orgKeys.map((k:any, idx:number)=> (
                    <div key={idx} className='p-2 flex flex-col gap-1'>
                      <div className='flex items-center justify-between gap-2'>
                        <div className='font-mono text-[11px] truncate max-w-[60%]' title={k.key||k.token}>{k.key||k.token||'—'}</div>
                        <div className='text-slate-400 text-[11px]'>#{idx+1}</div>
                      </div>
                      <div className='flex flex-wrap gap-2 text-[11px] text-slate-300'>
                        <span>{(k.email||k.label||'').toString()}</span>
                        {k.status && <span className='px-2 py-[1px] rounded-full bg-slate-800 text-slate-100'>{String(k.status)}</span>}
                        {typeof k.deviceCount==='number' && <span>{locale==='ru'?'Устройств: ':'Devices: '}{k.deviceCount}</span>}
                        {k.lastUsedAt && <span>{new Date(k.lastUsedAt).toLocaleString()}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className='text-slate-500 text-[11px]'>
                  {locale==='ru'
                    ? 'Показаны первые 50 ключей. Полный список можно выгрузить в CSV.'
                    : 'Showing first 50 keys. Use CSV export for full list.'}
                </div>
              </div>
            </div>
          )}
          {innerTab==='about' && (
            <div className='space-y-3 text-slate-300 text-sm'>
              <div className='text-slate-200'>{L('social')}</div>
              <div className='grid grid-cols-2 gap-2'>
                <a className='p-2 rounded-xl bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700/60 transition flex items-center gap-2' href='https://t.me/getlifeundo' target='_blank'><img src='https://icons.duckduckgo.com/ip3/t.me.ico' style={{width:18,height:18}}/><div>Telegram</div></a>
                <a className='p-2 rounded-xl bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700/60 transition flex items-center gap-2' href='https://vk.ru/GetLifeUndo' target='_blank'><img src='https://icons.duckduckgo.com/ip3/vk.com.ico' style={{width:18,height:18}}/><div>VK</div></a>
                <a className='p-2 rounded-xl bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700/60 transition flex items-center gap-2' href='https://x.com/getlifeundo' target='_blank'><img src='https://icons.duckduckgo.com/ip3/x.com.ico' style={{width:18,height:18}}/><div>X</div></a>
                <a className='p-2 rounded-xl bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700/60 transition flex items-center gap-2' href='https://youtube.com/@getlifeundo' target='_blank'><img src='https://icons.duckduckgo.com/ip3/youtube.com.ico' style={{width:18,height:18}}/><div>YouTube</div></a>
                <a className='p-2 rounded-xl bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700/60 transition flex items-center gap-2' href='https://addons.mozilla.org' target='_blank'><img src='https://icons.duckduckgo.com/ip3/addons.mozilla.org.ico' style={{width:18,height:18}}/><div>Firefox</div></a>
                <a className='p-2 rounded-xl bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700/60 transition flex items-center gap-2' href='https://github.com/LifeUndo' target='_blank'><img src='https://icons.duckduckgo.com/ip3/github.com.ico' style={{width:18,height:18, filter:'invert(1) brightness(1.5)'}}/><div>GitHub</div></a>
                <a className='p-2 rounded-xl bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700/60 transition flex items-center gap-2' href='https://reddit.com/r/getlifeundo' target='_blank'><img src='https://icons.duckduckgo.com/ip3/reddit.com.ico' style={{width:18,height:18}}/><div>Reddit</div></a>
                <a className='p-2 rounded-xl bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700/60 transition flex items-center gap-2' href='https://rustore.ru' target='_blank'><img src='https://icons.duckduckgo.com/ip3/rustore.ru.ico' style={{width:18,height:18}}/><div>RuStore</div></a>
              </div>
              <div className='row flex gap-2'>
                <GButton accent='teal' onClick={doShare}>{L('share')}</GButton>
                <GButton accent='emerald' onClick={doRate}>{L('rate')}</GButton>
              </div>
            </div>
          )}
          {innerTab==='apps' && (
            <div className='space-y-3 text-slate-300 text-sm'>
              <div className='rounded-xl ring-1 ring-slate-700 p-3'>
                <div className='text-slate-200 mb-2'>Desktop</div>
                <ul className='text-slate-400 list-disc pl-4 space-y-1'>
                  <li>{locale==='ru' ? 'Windows — Mesh 0.6.1.1 (эта сборка)' : 'Windows — Mesh 0.6.1.1 (this build)'}</li>
                  <li>{locale==='ru' ? 'macOS — в разработке' : 'macOS — in development'}</li>
                </ul>
                <div className='mt-3 flex flex-col sm:flex-row gap-3 items-center'>
                  <div className='shrink-0 rounded-xl bg-slate-900/70 ring-1 ring-slate-700 p-2'>
                    <img
                      src='https://api.qrserver.com/v1/create-qr-code/?size=256x256&margin=2&data=https%3A%2F%2Fgetlifeundo.com%2Fru%2Fdownloads'
                      alt={locale==='ru' ? 'QR-код загрузок GetLifeUndo' : 'GetLifeUndo downloads QR code'}
                      className='w-28 h-28'
                    />
                  </div>
                  <div className='flex-1 space-y-2'>
                    <div className='text-slate-200 text-sm'>
                      {locale==='ru'
                        ? 'Сканируйте QR, чтобы открыть страницу загрузок GetLifeUndo.'
                        : 'Scan the QR to open the GetLifeUndo downloads page.'}
                    </div>
                    <div className='text-slate-400 text-xs break-all'>https://getlifeundo.com/ru/downloads</div>
                    <div>
                      <GButton
                        accent='cyan'
                        onClick={async()=>{
                          const url = 'https://getlifeundo.com/ru/downloads'
                          try{
                            const n:any = navigator
                            if (n?.share){
                              await n.share({ title:'GetLifeUndo downloads', url })
                              return
                            }
                          }catch{}
                          try{
                            await navigator.clipboard.writeText(url)
                            alert(locale==='ru'
                              ? 'Ссылка на загрузки скопирована в буфер обмена.'
                              : 'Downloads link copied to clipboard.')
                          }catch{
                            try{ window.open(url, '_blank') }catch{}
                          }
                        }}
                      >{locale==='ru' ? 'Поделиться ссылкой' : 'Share link'}</GButton>
                    </div>
                  </div>
                </div>
              </div>
              <div className='rounded-xl ring-1 ring-slate-700 p-3'>
                <div className='text-slate-200 mb-2'>Android</div>
                <div className='grid grid-cols-2 gap-2'>
                  <a className='p-2 rounded bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700/60 transition' href='https://www.rustore.ru/catalog/app/com.getlifeundo.lifeundo_app' target='_blank'>
                    <div className='flex items-center gap-2'><img src='https://icons.duckduckgo.com/ip3/rustore.ru.ico' style={{width:18,height:18}}/> <div>RuStore</div></div>
                    <div className='text-slate-400 text-xs mt-1'>{locale==='ru'?'Доступно':'Available'}</div>
                  </a>
                  <a className='p-2 rounded bg-slate-800/60 ring-1 ring-slate-700 hover:bg-slate-700/60 transition' href='https://github.com/LifeUndo' target='_blank'>
                    <div className='flex items-center gap-2'><img src='https://icons.duckduckgo.com/ip3/github.com.ico' style={{width:18,height:18, filter:'invert(1) brightness(1.5)'}}/> <div>GitHub</div></div>
                    <div className='text-slate-400 text-xs mt-1'>{locale==='ru'?'APK (ручная установка)':'APK (manual install)'}</div>
                  </a>
                  <div className='p-2 rounded bg-slate-800/40 ring-1 ring-slate-700/60 opacity-80'>
                    <div className='flex items-center gap-2'><img src='https://icons.duckduckgo.com/ip3/nashstore.ru.ico' style={{width:18,height:18}}/> <div>NashStore</div></div>
                    <div className='text-slate-500 text-xs mt-1'>{L('soon')}</div>
                  </div>
                  <div className='p-2 rounded bg-slate-800/40 ring-1 ring-slate-700/60 opacity-80'>
                    <div className='flex items-center gap-2'><img src='https://icons.duckduckgo.com/ip3/f-droid.org.ico' style={{width:18,height:18}}/> <div>F‑Droid</div></div>
                    <div className='text-slate-500 text-xs mt-1'>{L('soon')}</div>
                  </div>
                  <div className='p-2 rounded bg-slate-800/40 ring-1 ring-slate-700/60 opacity-80'>
                    <div className='flex items-center gap-2'><img src='https://icons.duckduckgo.com/ip3/developer.huawei.com.ico' style={{width:18,height:18}}/> <div>Huawei AppGallery</div></div>
                    <div className='text-slate-500 text-xs mt-1'>{L('soon')}</div>
                  </div>
                  <div className='p-2 rounded bg-slate-800/40 ring-1 ring-slate-700/60 opacity-80'>
                    <div className='flex items-center gap-2'><img src='https://icons.duckduckgo.com/ip3/galaxystore.samsung.com.ico' style={{width:18,height:18}}/> <div>Samsung Store</div></div>
                    <div className='text-slate-500 text-xs mt-1'>{L('soon')}</div>
                  </div>
                </div>
              </div>
              <div className='rounded-xl ring-1 ring-slate-700 p-3'>
                <div className='text-slate-200 mb-2'>Apple</div>
                <ul className='text-slate-400 list-disc pl-4 space-y-1'>
                  <li>{locale==='ru' ? 'iOS — в разработке' : 'iOS — in development'}</li>
                  <li>{locale==='ru' ? 'macOS-клиент — в разработке' : 'macOS client — in development'}</li>
                </ul>
              </div>
              <div className='rounded-xl ring-1 ring-slate-700 p-3'>
                <div className='text-slate-200 mb-2'>{locale==='ru' ? 'Браузерные расширения' : 'Browser extensions'}</div>
                <ul className='text-slate-400 list-disc pl-4 space-y-1'>
                  <li>{locale==='ru' ? 'Chrome — в разработке' : 'Chrome — in development'}</li>
                  <li>{locale==='ru' ? 'Safari — в разработке' : 'Safari — in development'}</li>
                  <li>{locale==='ru' ? 'Edge — в разработке' : 'Edge — in development'}</li>
                </ul>
              </div>
              <div className='rounded-xl ring-1 ring-slate-700 p-3'>
                <div className='text-slate-200 mb-2'>Tablet / iPad</div>
                <div className='text-slate-400'>{locale==='ru' ? 'Планшетные клиенты — в разработке' : 'Tablet clients — in development'}</div>
              </div>
              <div className='rounded-xl ring-1 ring-slate-700 p-3'>
                <div className='text-slate-200 mb-1'>{locale==='ru' ? 'Ваши устройства' : 'Your devices'}</div>
                <div className='text-slate-400 text-xs'>
                  {locale==='ru'
                    ? 'Этот desktop-клиент уже готов. Раздел «Ваши устройства» в настройках показывает текущий ПК и позволит позже привязывать другие устройства.'
                    : 'This desktop client is ready. The "Your devices" section in Settings shows this PC and will later let you link other devices.'}
                </div>
              </div>
            </div>
          )}
          {innerTab==='faq' && (
            <div className='space-y-3 text-slate-300 text-sm'>
              <div className='rounded-2xl ring-1 ring-slate-700 p-3 space-y-3'>
                <div className='text-slate-200'>FAQ</div>
                <div>
                  <div className='font-medium text-slate-100'>{locale==='ru'?'Что такое GetLifeUndo?':'What is GetLifeUndo?'}</div>
                  <div className='text-slate-400'>{locale==='ru'?'Это локальный таймлайн вашей деятельности: скриншоты и текст из буфера. Помогает вернуться к тому, что вы делали 5 минут/час/день назад.':'It’s your local activity timeline: screenshots and clipboard text. Helps you jump back to what you did minutes/hours/days ago.'}</div>
                </div>
                <div>
                  <div className='font-medium text-slate-100'>{locale==='ru'?'Как это работает?':'How does it work?'}</div>
                  <div className='text-slate-400'>{locale==='ru'?'Приложение отслеживает системные папки скриншотов и сохраняет текст из буфера обмена. Всё остаётся на вашем диске.':'The app watches system screenshot folders and stores clipboard text. Everything stays on your disk.'}</div>
                </div>
                <div>
                  <div className='font-medium text-slate-100'>{locale==='ru'?'Где хранятся данные?':'Where is data stored?'}</div>
                  <div className='text-slate-400'>{locale==='ru'?'Локально, в %AppData%/GetLifeUndo. Папку можно открыть через настройки.':'Locally, in %AppData%/GetLifeUndo. You can open the folder from Settings.'}</div>
                </div>
                <div>
                  <div className='font-medium text-slate-100'>{locale==='ru'?'Нужно ли что‑то настраивать?':'Do I need to configure anything?'}</div>
                  <div className='text-slate-400'>{locale==='ru'?'По умолчанию всё работает сразу. Дополнительно вы можете добавить свои папки для наблюдения и выбрать место хранения.':'Defaults work out of the box. You may add custom watch folders and choose a storage location.'}</div>
                </div>
                <div>
                  <div className='font-medium text-slate-100'>{locale==='ru'?'Почему антивирус ругается?':'Why does antivirus warn?'}</div>
                  <div className='text-slate-400'>{locale==='ru'?'Из-за отсутствия подписи кода у новых билдов возможны ложные срабатывания. Мы подключаем европейский сертификат.':'New builds without code signing may trigger false positives. We are connecting an EU code-signing certificate.'}</div>
                </div>
                <div>
                  <div className='font-medium text-slate-100'>{locale==='ru'?'Что если отменить подписку?':'What if I cancel the subscription?'}</div>
                  <div className='text-slate-400'>{locale==='ru'?'Локальный доступ к вашим данным сохранится. Премиум‑функции и облачные возможности (когда появятся) станут недоступны.':'Local access to your data remains. Premium and cloud features (when available) will be disabled.'}</div>
                </div>
                <div>
                  <div className='font-medium text-slate-100'>{locale==='ru'?'Как поменять папку хранения?':'How to change the storage folder?'}</div>
                  <div className='text-slate-400'>{locale==='ru'?'Настройки → Общие → «Выбрать папку хранения» (в онбординге) или вручную перенесите папку и укажите путь в конфиге.':'Settings → General → “Choose storage folder” (onboarding) or move the folder and update path in the config.'}</div>
                </div>
                <div>
                  <div className='font-medium text-slate-100'>{locale==='ru'?'Как экспортировать данные?':'How to export data?'}</div>
                  <div className='text-slate-400'>{locale==='ru'?'Откройте папку данных через настройки и скопируйте нужные файлы. Логи можно экспортировать отдельной кнопкой.':'Open the data folder from Settings and copy files you need. Logs can be exported with a dedicated button.'}</div>
                </div>
                <div>
                  <div className='font-medium text-slate-100'>{locale==='ru'?'Запуск из ZIP не работает':'App won’t run from ZIP'}</div>
                  <div className='text-slate-400'>{locale==='ru'?'Распакуйте архив целиком: EXE должен видеть системные файлы Chromium/ffmpeg рядом.':'Extract the archive entirely: the EXE must see Chromium/ffmpeg files next to it.'}</div>
                </div>
              </div>
            </div>
          )}

          </div>
          {/* Футер внутри панели настроек (стеклянный как на главной) */}
          <FooterGlass siteLabel={L('site')} githubLabel={L('github')} privacyLabel={L('privacy')} />
        </div>
      </div>
    )
  }

  const Onboarding = ()=>{
    const [step, setStep] = useState(0)
    const L = (k:string)=>({
      ru:{welcome:'Добро пожаловать в GetLifeUndo',next:'Далее',choose:'Выбрать папку хранения',done:'Готово',sub:'Подписка и устройства в Настройках',learn:'Вы можете повторить обучение позже в Настройках'},
      en:{welcome:'Welcome to GetLifeUndo',next:'Next',choose:'Choose storage folder',done:'Finish',sub:'Subscription and devices are in Settings',learn:'You can rerun onboarding later in Settings'}
    } as any)[locale][k]||k
    const chooseDir = async ()=>{ const r = await window.api.pickDir(); if (r?.ok && r.path){ const next = await window.api.setSettings({ dataDir: r.path }); setSettings(next) } }
    const finish = async ()=>{ const next = await window.api.setSettings({ onboarded: true }); setSettings(next) }
    if (settings?.onboarded) return null
    return (
      <div className='fixed inset-0 z-40 bg-slate-950/95 text-slate-100 flex items-center justify-center p-6'>
        <div className='w-[600px] max-w-full rounded-2xl bg-slate-900 ring-1 ring-slate-800 p-6 space-y-4'>
          <div className='text-xl font-semibold'>{L('welcome')}</div>
          {step===0 && <div className='text-slate-300 text-sm'>Скриншоты фиксируются автоматически, текст сохраняется из буфера обмена. Всё локально.</div>}
          {step===1 && (
            <div className='space-y-3'>
              <div className='text-slate-300 text-sm'>Выберите папку для локального хранения (можно поменять позже).</div>
              <button onClick={chooseDir} className='px-3 h-9 rounded bg-slate-700'>{L('choose')}</button>
            </div>
          )}
          {step===2 && <div className='text-slate-300 text-sm'>{L('sub')}. {L('learn')}.</div>}
          <div className='flex justify-end gap-2'>
            {step<2 && <button onClick={()=>setStep(step+1)} className='px-3 h-9 rounded bg-cyan-800'>{L('next')}</button>}
            {step===2 && <button onClick={finish} className='px-3 h-9 rounded bg-emerald-700'>{L('done')}</button>}
          </div>
        </div>
      </div>
    )
  }

  const trialForHeader = trialRemain || ((typeof trialDaysLeft==='number' && trialDaysLeft>0) ? { days: trialDaysLeft, hours: 0 } : null)
  const trialExpired = licenseStatus==='trial' && trialEndTs!==null && trialEndTs <= Date.now()
  const planLabel = (()=>{
    const cleanSub = (subStatus || '').trim()
    if (cleanSub && !/^free$/i.test(cleanSub)) return cleanSub
    if (licenseStatus!=='active') return ''
    const t = (licenseTier||'').toLowerCase()
    if (!t) return ''
    if (t==='free') return ''
    if (t.includes('vip')) return 'VIP'
    if (t.includes('team')) return 'TEAM'
    if (t.includes('pro')) return 'PRO'
    return licenseTier.toString().toUpperCase()
  })()

  return (
    <div className='text-slate-100 min-h-full w-full'>
      {/* Новая главная (лендинг) */}
      <div className='px-4 pt-6 pb-4 bg-gradient-to-b from-slate-900/95 to-slate-900/60 backdrop-blur border-b border-slate-800'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='text-xl font-semibold'>GetLifeUndo</div>
            <div className='px-3 h-7 rounded-full text-[11px] bg-cyan-900/60 text-cyan-200 ring-1 ring-cyan-700 flex items-center'>v0.6.1.1</div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='px-3 h-7 rounded-full bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400 flex flex-col justify-center min-w-[80px]'>
              <div className='text-[10px] font-semibold tracking-wide uppercase leading-tight'>
                {locale==='ru' ? 'Триал' : 'Trial'}
              </div>
              <div className='text-[10px] leading-tight'>
                {trialForHeader && trialForHeader.days>=0
                  ? (locale==='ru'
                      ? `${trialForHeader.days}д ${trialForHeader.hours}ч`
                      : `${trialForHeader.days}d ${trialForHeader.hours}h`)
                  : ''}
              </div>
            </div>
            {planLabel && (
              <button className='px-3 h-7 rounded-full text-[11px] bg-slate-800/80 text-slate-100 ring-1 ring-slate-600 tracking-wide uppercase' title={locale==='ru'?'Текущий план':'Current plan'}>{planLabel}</button>
            )}
            <button onClick={toggleLocale} className='px-3 h-7 rounded-full text-[11px] bg-slate-800/70 text-slate-100 ring-1 ring-slate-600'>{locale.toUpperCase()}</button>
            <button
              onClick={()=>setSettingsOpen('menu')}
              title='Settings'
              className='px-3 h-7 rounded-full flex items-center justify-center bg-sky-900/80 text-sky-100 ring-1 ring-sky-500 shadow-md text-base'
            >⚙</button>
          </div>
        </div>
      </div>

      <div className='p-6 space-y-6 pb-20 landing'>
        {locale==='ru' ? (
          <div className='max-w-3xl space-y-4 text-slate-200'>
            <div className='text-xl font-semibold'>Потеряли текст? Закрыли вкладку? Ctrl+Z вернёт всё обратно.</div>
            <div className='text-slate-300'>Восстанавливайте формы, вкладки и буфер обмена. 100% локально, без облака и слежки.</div>
            <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-4 space-y-2'>
              <div className='font-medium'>Что умеет: </div>
              <ul className='list-disc pl-5 text-sm text-slate-300 space-y-1'>
                <li>История ввода в формах. Если страница перезагрузилась или вкладка закрылась, вы возвращаете последний введённый текст и продолжаете с того же места.</li>
                <li>История буфера обмена. Хронология скопированных фрагментов позволяет вставить любой предыдущий элемент без повторного поиска.</li>
                <li>Недавние вкладки. Быстрый доступ к недавно закрытым страницам и переход обратно в один тап.</li>
                <li>Быстрые скриншоты с превью. Делайте снимки экрана и мгновенно возвращайтесь к работе; изображения сохраняются локально.</li>
                <li>Локальное хранение. Все данные находятся только на вашем устройстве и удаляются вместе с приложением.</li>
                <li>Без аккаунтов и регистрации. Установили — и пользуетесь.</li>
                <li>Без интернета. Основные функции работают офлайн; приложение не отправляет информацию на внешние серверы.</li>
                <li>Без рекламы и трекинга. Нет рекламных SDK, аналитики и скрытых сборов данных.</li>
              </ul>
            </div>
            <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-4 space-y-2'>
              <div className='font-medium'>Зачем это нужно:</div>
              <ul className='list-disc pl-5 text-sm text-slate-300 space-y-1'>
                <li>Подстраховка при длинных формах, комментариях, сообщениях и заявках — если страница “упала” или “выкинула”, текст не пропадёт.</li>
                <li>Ускорение повседневной работы: удобная история буфера обмена и быстрые скриншоты экономят время.</li>
                <li>Приватность по умолчанию: информация не покидает ваше устройство.</li>
              </ul>
            </div>
            <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-4 space-y-2'>
              <div className='font-medium'>Принципы приватности:</div>
              <ul className='list-disc pl-5 text-sm text-slate-300 space-y-1'>
                <li>Приложение не запрашивает лишних разрешений и не использует сторонние трекеры.</li>
                <li>Данные не передаются на сервера разработчика или третьих лиц.</li>
                <li>При удалении приложения вся локальная история полностью очищается.</li>
              </ul>
            </div>
            <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-4 space-y-2'>
              <div className='font-medium'>Примечания:</div>
              <ul className='list-disc pl-5 text-sm text-slate-300 space-y-1'>
                <li>Приложение не требует учётной записи и работает локально.</li>
                <li>Список возможностей будет расширяться; акцент — на надёжность, приватность и удобство.</li>
              </ul>
            </div>
            <div className='text-sm text-slate-300'>В приложении есть подписка.</div>
          </div>
        ) : (
          <div className='max-w-3xl space-y-4 text-slate-200'>
            <div className='text-xl font-semibold'>Lost text? Closed a tab? Ctrl+Z brings it back.</div>
            <div className='text-slate-300'>Restore forms, tabs, and clipboard. 100% local — no cloud, no tracking.</div>
            <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-4 space-y-2'>
              <div className='font-medium'>What it does:</div>
              <ul className='list-disc pl-5 text-sm text-slate-300 space-y-1'>
                <li>Form input history. If a page reloads or a tab is closed, you restore the last entered text and continue from the same place.</li>
                <li>Clipboard history. A timeline of copied fragments lets you paste any previous item without re‑searching.</li>
                <li>Recent tabs. Quick access to recently closed pages and one‑tap return.</li>
                <li>Quick screenshots with preview. Take captures and jump back instantly; images are stored locally.</li>
                <li>Local storage. All data stays on your device and is removed together with the app.</li>
                <li>No accounts or registration. Install — and use.</li>
                <li>No internet required. Core features work offline; the app does not send information to external servers.</li>
                <li>No ads or tracking. No ad SDKs, analytics, or hidden data collection.</li>
              </ul>
            </div>
            <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-4 space-y-2'>
              <div className='font-medium'>Why it matters:</div>
              <ul className='list-disc pl-5 text-sm text-slate-300 space-y-1'>
                <li>Safety net for long forms, comments, messages, and applications — if a page “crashes” or “kicks you out”, your text won’t be lost.</li>
                <li>Faster everyday work: convenient clipboard history and quick screenshots save time.</li>
                <li>Privacy by default: your information never leaves the device.</li>
              </ul>
            </div>
            <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-4 space-y-2'>
              <div className='font-medium'>Privacy principles:</div>
              <ul className='list-disc pl-5 text-sm text-slate-300 space-y-1'>
                <li>The app requests no unnecessary permissions and uses no third‑party trackers.</li>
                <li>Data is not transferred to the developer’s servers or to any third parties.</li>
                <li>When the app is removed, all local history is fully erased.</li>
              </ul>
            </div>
            <div className='rounded-2xl bg-slate-800/60 ring-1 ring-slate-700 p-4 space-y-2'>
              <div className='font-medium'>Notes:</div>
              <ul className='list-disc pl-5 text-sm text-slate-300 space-y-1'>
                <li>No account is required; it works locally.</li>
                <li>The feature set will grow; the focus is reliability, privacy, and convenience.</li>
              </ul>
            </div>
            <div className='text-sm text-slate-300'>The app includes a subscription.</div>
          </div>
        )}

        <FooterGlass siteLabel={t('site')} githubLabel={'GitHub'} privacyLabel={t('privacy')} />
      </div>
      {settingsOpen!==false && <SettingsDrawer initialTab={settingsOpen as any}/>} 
    </div>
  )
}
