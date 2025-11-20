const $ = (s)=>document.querySelector(s)
const offerEl = $('#offer')
const answerEl = $('#answer')
const btnLoad = $('#btn-load')
const btnClear = $('#btn-clear')
const inputEmail = document.getElementById('input-email')
const btnEmailOk = document.getElementById('btn-email-ok')
// timeline
const tlList = document.getElementById('tl-list')
const tlEmpty = document.getElementById('tl-empty')
const tlBtnTab = document.getElementById('tl-tab')
const tlBtnShot = document.getElementById('tl-shot')
const tlBtnText = document.getElementById('tl-text')
// timeline section heads/controls
const tlHelpTabs = document.getElementById('tl-help-tabs')
const tlShotsHead = document.getElementById('tl-shots-head')
const tlShotsCount = document.getElementById('tl-shots-count')
const tlShotsChips = document.getElementById('tl-shots-chips')
const tlTextHead = document.getElementById('tl-text-head')
const tlTextChips = document.getElementById('tl-text-chips')
const tlOpenFolder = document.getElementById('tl-open-folder')
const tlOpenArchive = document.getElementById('tl-open-archive')
const tlImportShots = document.getElementById('tl-import-shots')
const tlFileShots = document.getElementById('tl-file-shots')
const tlImportText = document.getElementById('tl-import-text')
const tlFileText = document.getElementById('tl-file-text')
const tlShotsNote = document.getElementById('tl-shots-note')
const tlTextNote = document.getElementById('tl-text-note')
const chipsShots = Array.from(document.querySelectorAll('[data-shots-limit]'))
const chipsText = Array.from(document.querySelectorAll('[data-text-hrs]'))
const btnAddScreens = document.getElementById('btn-add-screens')
const btnAddTexts = document.getElementById('btn-add-texts')
const btnOpenLogs = document.getElementById('btn-open-logs')
const btnExportLogs = document.getElementById('btn-export-logs')
let TL_FILTER = 'tab'
let TL_DATA = { tab: [], shot: [], text: [] }
let FORM_STATES = []

function updateDevicesMeta(deviceId, license){
  try{
    if (devDeviceIdEl && deviceId){
      devDeviceIdEl.textContent = String(deviceId)
    }
    if (devLicStatusEl){
      const lic = license||CURRENT_LICENSE||{}
      const tier = String(lic.tier||'free').toUpperCase()
      const st = String(lic.status||'trial').toLowerCase()
      devLicStatusEl.textContent = tier + ' / ' + st
    }
  }catch{}
}
let TL_PREFS = { shotsLimit: 10, textHrs: 24 }
let CURRENT_LICENSE = null
const hdrBack = document.getElementById('hdr-back')
const hdrClose = document.getElementById('hdr-close')
// toggles (pill)
const pillShowHere = $('#pill-show-here')
const pillScreens = $('#pill-screens')
const pillVideo = $('#pill-video')
const pillEvent = $('#pill-event')
const selectLang = document.getElementById('select-lang')
// subscription status elements
const lblStatus = document.getElementById('lbl-status')
const trialLeftEl = document.getElementById('trial-left')
// devices meta
const devDeviceIdEl = document.getElementById('dev-device-id')
const devLicStatusEl = document.getElementById('dev-license-status')
// дополнительные пути наблюдения
let WATCH_PATHS = { shots: [], text: [] }

function setPill(el, on){
  if (!el) return
  el.classList.toggle('on', !!on)
  el.classList.toggle('off', !on)
  const span = el.querySelector('span')
  if (span) span.textContent = on ? 'ON' : 'OFF'
}

// Платежи FreeKassa через сайт
const btnPayPro = document.getElementById('pay-pro')
const btnPayVip = document.getElementById('pay-vip')
const btnPayTeam = document.getElementById('pay-team')
const btnShare = document.getElementById('btn-share')
const btnRate = document.getElementById('btn-rate')
const hintEmail = document.getElementById('hint-email')
const hintEvent = document.getElementById('hint-event')
const hintTimeline = document.getElementById('hint-timeline')
const hintDevices = document.getElementById('hint-devices')
const hintShowHere = document.getElementById('hint-show-here')
const hintScreens = document.getElementById('hint-screens')
const hintVideo = document.getElementById('hint-video')
const hintPaths = document.getElementById('hint-paths')
const hintExportLogs = document.getElementById('hint-export-logs')

async function createPayment(productId){
  try{
    const rloc = await chrome.storage.local.get('locale').catch(()=>({}))
    const locale = (rloc && rloc.locale)==='en' ? 'en' : 'ru'
    const res = await fetch('https://getlifeundo.com/api/payments/freekassa/create',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ productId, locale })
    })
    const data = await res.json().catch(()=>({}))
    if (data && data.ok && data.pay_url){
      try{ open(data.pay_url,'_blank') }catch{ location.href = data.pay_url }
    }
  }catch{}
}

function licenseAllowsTimeline(){
  const st = (CURRENT_LICENSE && CURRENT_LICENSE.status) || 'trial'
  const devSt = (CURRENT_LICENSE && CURRENT_LICENSE.deviceStatus) || 'active'
  if (devSt === 'disabled') return false
  if (st === 'revoked') return false
  return st==='trial' || st==='active'
}

// -------- Лицензия / Триал (локальная модель) ---------

function fmtTrialRemain(ms){
  if (!ms || ms<=0) return ''
  let rest = ms
  const d = Math.floor(rest/86400000); rest%=86400000
  const h = Math.floor(rest/3600000)
  let s = ''
  if (d>0) s += d+'д '
  if (h>0) s += h+'ч'
  return s.trim()
}

function genDeviceId(){
  const rnd = ()=> Math.floor((1+Math.random())*0x10000).toString(16).slice(1)
  return [rnd(),rnd(),rnd(),rnd(),rnd(),rnd()].join('-')
}

async function ensureDeviceId(){
  try{
    const r = await chrome.storage.local.get('deviceId').catch(()=>({}))
    if (r && r.deviceId) return String(r.deviceId)
    const id = genDeviceId()
    try{ await chrome.storage.local.set({ deviceId:id }) }catch{}
    return id
  }catch{
    return genDeviceId()
  }
}

// Однократная регистрация устройства в админ-бэкенде
async function registerDeviceOnce(){
  try{
    const r = await chrome.storage.local.get(['__deviceRegistered','locale']).catch(()=>({}))
    if (r && r.__deviceRegistered) return
    const deviceId = await ensureDeviceId()
    const mf = (chrome?.runtime?.getManifest && chrome.runtime.getManifest()) || {}
    const appVersion = mf.version || '0.0.0'
    const platform = 'extension'
    const locale = (r && r.locale)==='en' ? 'en' : 'ru'
    const payload = { deviceId, platform, appVersion, locale }
    try{
      await fetch('https://getlifeundo.com/api/device/register',{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
      })
    }catch{}
    try{ await chrome.storage.local.set({ __deviceRegistered: true }) }catch{}
  }catch{}
}

async function getOrInitLicense(){
  let lic = { tier:'free', status:'trial', trialStart:0, trialEnd:0 }
  try{
    const r = await chrome.storage.local.get('license').catch(()=>({}))
    if (r && r.license && typeof r.license==='object') lic = Object.assign(lic, r.license)
  }catch{}
  const now = Date.now()
  if (!lic.trialStart) lic.trialStart = now
  if (!lic.trialEnd) lic.trialEnd = lic.trialStart + 7*24*60*60*1000
  if (!lic.status) lic.status = 'trial'
  try{ await chrome.storage.local.set({ license: lic }) }catch{}
  return lic
}

function updateSubsUI(license){
  try{
    const lic = license||{}
    CURRENT_LICENSE = lic
    if (lblStatus){
      const tier = String(lic.tier||'free').toUpperCase()
      const st = String(lic.status||'trial').toLowerCase()
      const base = (window.__loc==='en' ? 'Status: ' : 'Статус: ')
      lblStatus.textContent = base + tier + ' / ' + st
    }
    if (trialLeftEl){
      const now = Date.now()
      const end = Number(lic.trialEnd||0)
      const remain = end - now
      const devSt = lic.deviceStatus || 'active'
      const st = lic.status || 'trial'
      trialLeftEl.style.display = 'block'
      if (devSt === 'disabled'){
        trialLeftEl.textContent = window.__loc==='en'
          ? 'This device was disabled by administrator.'
          : 'Это устройство отключено администратором.'
      }else if (st === 'revoked'){
        trialLeftEl.textContent = window.__loc==='en'
          ? 'License was revoked by administrator.'
          : 'Лицензия отозвана администратором.'
      }else if (st==='trial' && remain>0){
        const prefix = window.__loc==='en' ? 'Trial: ' : 'Триал: осталось '
        trialLeftEl.textContent = prefix + fmtTrialRemain(remain)
      }else{
        const msgRu = 'Триал истёк. Для стабильного восстановления Ленты оформите подписку.'
        const msgEn = 'Trial ended. To keep your timeline safe, please subscribe.'
        trialLeftEl.textContent = window.__loc==='en' ? msgEn : msgRu
      }
    }
  }catch{}
}

async function initLicenseAndTrial(){
  const lic = await getOrInitLicense()
  updateSubsUI(lic)
  // черновая проверка статуса через backend (если доступен)
  try{
    const deviceId = await ensureDeviceId()
    // регистрация устройства в админ-системе (однократно)
    try{ registerDeviceOnce() }catch{}
    const mf = (chrome?.runtime?.getManifest && chrome.runtime.getManifest()) || {}
    const version = mf.version || '0.0.0'
    const payload = { deviceId, platform:'extension', version }
    const res = await fetch('https://getlifeundo.com/api/license/validate',{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
    })
    const data = await res.json().catch(()=>null)
    if (data && data.ok){
      const next = Object.assign({}, lic, {
        status: data.status||lic.status,
        tier: data.tier||lic.tier,
        trialStart: data.trialStart||lic.trialStart,
        trialEnd: data.trialEnd||lic.trialEnd,
        deviceStatus: data.deviceStatus||lic.deviceStatus||'active'
      })
      try{ await chrome.storage.local.set({ license: next }) }catch{}
      updateSubsUI(next)
      updateDevicesMeta(deviceId, next)
      return
    }
    updateDevicesMeta(deviceId, lic)
  }catch{}
}

// -------- Импорт JSONL ---------
function parseJSONL(text){
  const lines = String(text||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean)
  const arr = []
  for (const ln of lines){ try{ const o = JSON.parse(ln); if (o && typeof o==='object') arr.push(o) }catch{} }
  return arr
}

function importShotsFromFile(file){
  const reader = new FileReader()
  reader.onload = async ()=>{
    try{
      const txt = String(reader.result||'')
      let items = []
      try{ const j = JSON.parse(txt); if (Array.isArray(j)) items = j; }catch{ items = parseJSONL(txt) }
      const mapped = items.map(x=>({ t: x.t||x.ts||Date.now(), dataUrl: x.dataUrl||x.url||'' })).filter(x=>x.dataUrl)
      if (!mapped.length) return
      const r = await chrome.storage.local.get('shots').catch(()=>({}))
      const cur = Array.isArray(r.shots) ? r.shots : []
      const next = mapped.concat(cur).slice(0,200)
      await chrome.storage.local.set({ shots: next })
      TL_DATA.shot = next; TL_FILTER='shot'; renderTimeline()
    }catch{}
  }
  reader.readAsText(file)
}

function importTextFromFile(file){
  const reader = new FileReader()
  reader.onload = async ()=>{
    try{
      const txt = String(reader.result||'')
      let items = []
      try{ const j = JSON.parse(txt); if (Array.isArray(j)) items = j; }catch{ items = parseJSONL(txt) }
      const mapped = items.map(x=>({ t: x.t||x.ts||Date.now(), text: String(x.text||'').slice(0,2000) })).filter(x=>x.text)
      if (!mapped.length) return
      const r = await chrome.storage.local.get('textLog').catch(()=>({}))
      const cur = Array.isArray(r.textLog) ? r.textLog : []
      const next = mapped.concat(cur).slice(0,500)
      await chrome.storage.local.set({ textLog: next })
      TL_DATA.text = next; TL_FILTER='text'; renderTimeline()
    }catch{}
  }
  reader.readAsText(file)
}

tlImportShots && tlImportShots.addEventListener('click', ()=>{ tlFileShots && tlFileShots.click() })
tlFileShots && tlFileShots.addEventListener('change', (e)=>{ const f=e.target.files&&e.target.files[0]; if(f) importShotsFromFile(f); e.target.value='' })
tlImportText && tlImportText.addEventListener('click', ()=>{ tlFileText && tlFileText.click() })
tlFileText && tlFileText.addEventListener('change', (e)=>{ const f=e.target.files&&e.target.files[0]; if(f) importTextFromFile(f); e.target.value='' })

// i18n словарь для основных элементов
const I18N = {
  ru: {
    tabs: { general:'Общие', apps:'Приложения', subs:'Подписка', about:'О нас', faq:'FAQ', timeline:'Лента', devices:'Ваши устройства' },
    labels: {
      lang:'Язык', showHere:'Показывать список здесь', screens:'Скриншоты', video:'Запись видео', event:'Режим мероприятия', email:'Подписаться на обновления (email):',
      status:'Статус: ',
      pathsTitle:'Пути наблюдения',
      pathsHint:'Подсказка: добавьте свои папки, если системные пути отличаются. Эти пути будет использовать настольная версия LifeUndo для поиска скриншотов и текстовых файлов.',
      liScreens:'Скриншоты: Pictures/Screenshots, OneDrive, Dropbox + пользовательские пути',
      liDocs:'Документы: Documents + пользовательские пути',
      liDownloads:'Загрузки: Downloads + пользовательские пути',
      btnAddScreens:'Добавить путь для скринов',
      btnAddTexts:'Добавить путь для текстов',
      btnOpenLogs:'Открыть логи',
      btnExportLogs:'Экспорт логов',
      hintShowHere:'Если выключить, список страниц и устройств будет отображаться только в отдельном окне настроек, а не в этом окошке.',
      hintScreens:'Включает слежение за системными папками скриншотов (в Windows‑версии) и подготовку Ленты скринов.',
      hintVideo:'Запись экрана для сложных сценариев. Будет доступна позже и может требовать больше ресурсов.',
      limitsTitle:'Лимиты',
      limitsValue:'Скрины: ≤200 / 500MB, Текст: ≤10MB',
      hintEmail:'Мы пришлём только важные новости о версии для вашего устройства и подписке. Без спама.',
      hintEvent:'Режим для мероприятий: вы показываете QR-код, гости быстро подключаются к вашей сети устройств.',
      hintTimeline:'Лента показывает историю вкладок, скринов и текста с этого устройства. Часть функций требует подписки.',
      hintDevices:'Здесь вы связываете этот браузер с другими устройствами (ПК, телефон) через код offer/answer, чтобы пересылать вкладки.',
      hintPaths:'Добавьте свои папки для наблюдения. Максимальное количество путей: 10.',
      hintExportLogs:'Экспортируйте логи в SQL-формате.',
      licHint:'Введите активационный ключ, полученный после оплаты или от поддержки. Ключ связывает ваши устройства в системе GetLifeUndo и разблокирует платный тариф. Не передавайте его третьим лицам.',
      tlTabs:'Вкладки', tlShots:'Скрины', tlText:'Текст', tlEmpty:'Нет событий',
      tlShotsCountPrefix:'Последние',
      tlShotsLimit:'Лимит скринов:',
      tlShotsNote:'По умолчанию показываем последние N скринов.',
      tlTextStore:'Срок хранения текста:',
      tlTextNote:'По умолчанию показываем последние записи для выбранного окна (макс. 20).',
      tlOpenFolder:'Открыть папку',
      tlOpenArchive:'Открыть архив',
      appsRustoreSub:'Скачать',
      appsGithubSub:'Скачать',
      appsNashSub:'скоро',
      appsFdroidSub:'скоро',
      appsHuaweiSub:'скоро',
      appsSamsungSub:'скоро',
      appsDesktopTitle:'Desktop',
      appsDesktopWin:'Windows — в разработке',
      appsDesktopMac:'macOS — в разработке',
      devIntro1:'Свяжите этот браузер с ПК и телефоном через короткий код или QR — как в мессенджерах.',
      devIntro2:'1) На этом устройстве нажмите «Показать код». 2) На втором устройстве (веб-клиент на getlifeundo.com/device или другое расширение) введите короткий код в поле «Подтвердить код». 3) После подтверждения вкладки и другие события смогут ходить между устройствами.',
      devIntro3:'Код действует ограниченное время, одноразовый и привязан к вашей подписке. После успешной связки он становится недействительным. Например: на ПК нажмите «Показать код» / «Создать код», а на телефоне в расширении откройте «Ваши устройства» и введите этот код в поле «Подтвердить код».',
      devIntro4:'Схема: ПК ⇄ QR/код ⇄ Телефон',
      devThisDeviceLabel:'Это устройство:',
      devStatusLabel:'Статус:',
      devOfferLabel:'Исходящий код (offer, base64)',
      devAnswerLabel:'Ответный код (answer, base64)',
      btnOffer:'Создать код связи',
      btnAcceptOffer:'Вставить код связи',
      devTabsTitle:'Вкладки',
      devConnLabel:'Соединение:',
      devPairingTitle:'Связать с другим устройством',
      devPairingSub:'На втором устройстве откройте раздел «Ваши устройства» (или веб-клиент getlifeundo.com/device) и введите этот код один раз в поле «Подтвердить код».',
      devPairingCodeLabel:'Код для этого устройства (введите на втором устройстве один раз):',
      devPairingAcceptLabel:'У меня уже есть код другого устройства:',
      devPairingStatusReady:'Код сгенерирован. Введите его на втором устройстве в течение 15 минут. После успешной связки код больше не работает.',
      devPairingStatusLinked:'Устройства связаны. Этот код уже использован и больше не действителен.',
      devAdvancedTitle:'Режим разработчика (offer/answer)',
      devAdvancedNote:'Низкоуровневый режим для отладки WebRTC‑соединения между устройствами. В обычной жизни используйте код/QR выше.',
      aboutSocialsTitle:'Соцсети',
      btnShare:'Поделиться',
      btnRate:'Оценить',
      appsOpenBtn:'Открыть',
      subsProTitle:'PRO (месяц)',
      subsProSub:'ежемесячно',
      subsVipTitle:'VIP (пожизненно)',
      subsVipSub:'единовременно',
      subsTeamTitle:'TEAM 5',
      subsTeamSub:'для команды',
      btnPay:'Оплатить',
      btnActivate:'Активировать код',
      faqQ1:'Что такое GetLifeUndo?',
      faqA1:'Это локальный таймлайн вашей деятельности: скриншоты и текст из буфера. Помогает вернуться к тому, что вы делали 5 минут/час/день назад.',
      faqQ2:'Как это работает?',
      faqA2:'Приложение отслеживает системные папки скриншотов и сохраняет текст из буфера обмена. Всё остаётся на вашем диске.',
      faqQ3:'Где хранятся данные?',
      faqA3:'Локально, в %AppData%/GetLifeUndo. Папку можно открыть через настройки.',
      faqQ4:'Нужно ли что‑то настраивать?',
      faqA4:'По умолчанию всё работает сразу. Дополнительно вы можете добавить свои папки для наблюдения и выбрать место хранения.',
      faqQ5:'Почему антивирус ругается?',
      faqA5:'Из-за отсутствия подписи кода у новых билдов возможны ложные срабатывания. Мы подключаем европейский сертификат.',
      faqQ6:'Что если отменить подписку?',
      faqA6:'Локальный доступ к вашим данным сохранится. Премиум‑функции и облачные возможности (когда появятся) станут недоступны.',
      faqQ7:'Как поменять папку хранения?',
      faqA7:'Настройки → Общие → «Выбрать папку хранения» (в онбординге) или вручную перенесите папку и укажите путь в конфиге.',
      faqQ8:'Как экспортировать данные?',
      faqA8:'Откройте папку данных через настройки и скопируйте нужные файлы. Логи можно экспортировать отдельной кнопкой.'
      , faqQ9:'Запуск из ZIP не работает',
      faqA9:'Распакуйте архив целиком: EXE должен видеть системные файлы Chromium/ffmpeg рядом.'
      , faqQ10:'Как всё работает вместе (ПК + расширение + Android)?',
      faqA10_1:'1) ПК/ноутбук: установите основное приложение LifeUndo для Windows (0.4.x) и включите наблюдение за скринами/текстом.',
      faqA10_2:'2) Расширение: поставьте это расширение в Firefox, войдите в тот же аккаунт (когда появится) или свяжите устройство через код в разделе «Ваши устройства».',
      faqA10_3:'3) Телефон (Android): установите мобильное приложение из RuStore и включите отправку скринов/текста. Позже всё будет видно в общей Ленте и на ПК, и в браузере, и на телефоне.',
      faqA10_4:'Сейчас эта схема в стадии перехода: часть функций уже работает локально, а единую подписку и облачную синхронизацию мы включим постепенно.'
    },
    footer: { site:'Сайт', gh:'GitHub', privacy:'Приватность', copy:'© GetLifeUndo™' }
    , headerTitle:'Настройки'
  },
  en: {
    tabs: { general:'General', apps:'Apps', subs:'Subscription', about:'About', faq:'FAQ', timeline:'Timeline', devices:'Your devices' },
    labels: {
      lang:'Language', showHere:'Show list here', screens:'Screenshots', video:'Video recording', event:'Event mode', email:'Subscribe for updates (email):',
      status:'Status: ',
      pathsTitle:'Watch paths',
      pathsHint:'Hint: add your own folders if system paths differ. These paths are used by the desktop app to watch for screenshots and text files.',
      liScreens:'Screenshots: Pictures/Screenshots, OneDrive, Dropbox + user folders',
      liDocs:'Documents: Documents + user folders',
      liDownloads:'Downloads: Downloads + user folders',
      btnAddScreens:'Add path for screenshots',
      btnAddTexts:'Add path for texts',
      btnOpenLogs:'Open logs',
      btnExportLogs:'Export logs',
      hintShowHere:'If off, the list of pages/devices is shown only in the full settings window, not in this popup.',
      hintScreens:'Enables watching system screenshot folders (in the desktop app) and prepares the screenshots Timeline.',
      hintVideo:'Screen recording for advanced sessions. Coming later and may use more resources.',
      limitsTitle:'Limits',
      limitsValue:'Screens: ≤200 / 500MB, Text: ≤10MB',
      licHint:'Enter the activation key you received after payment or from support. The key links your devices in the GetLifeUndo system and unlocks the paid tier. Do not share it with third parties.',
      licHint:'Enter the activation key you received after payment or from support. The key links your devices in the GetLifeUndo system and unlocks the paid tier. Do not share it with third parties.',
      hintEmail:'We only send important updates about your device and subscription. No spam.',
      hintEvent:'Event mode: show a QR code so guests can quickly join your LifeUndo setup.',
      hintTimeline:'Timeline shows recent tabs, screenshots and text from this browser. Some features require a subscription.',
      hintDevices:'Link this browser with your other devices (PC, phone) using offer/answer codes to send tabs.',
      tlTabs:'Tabs', tlShots:'Shots', tlText:'Text', tlEmpty:'No events',
      tlShotsCountPrefix:'Last',
      tlShotsLimit:'Screens limit:',
      tlShotsNote:'By default we show the last N screenshots.',
      tlTextStore:'Text retention period:',
      tlTextNote:'By default we show recent entries for the selected window (max. 20).',
      tlOpenFolder:'Open folder',
      tlOpenArchive:'Open archive',
      appsRustoreSub:'Download',
      appsGithubSub:'Download',
      appsNashSub:'coming soon',
      appsFdroidSub:'coming soon',
      appsHuaweiSub:'coming soon',
      appsSamsungSub:'coming soon',
      appsDesktopTitle:'Desktop',
      appsDesktopWin:'Windows — in development',
      appsDesktopMac:'macOS — in development',
      devIntro1:'Link this browser with your other devices (PC, laptop, phone) using a short code or QR, similar to messengers.',
      devIntro2:'1) On this device click “Show code”. 2) On the second device (web client at getlifeundo.com/device or another extension) type the short code into “Confirm code”. 3) After confirmation tabs and other events can flow between devices.',
      devIntro3:'The code is time-limited, one-time and tied to your subscription. After a successful link it becomes invalid. For example: on your PC click “Show code” / “Create code”, and on your phone in the extension open “Your devices” and type this code into “Confirm code”.',
      devIntro4:'Scheme: PC ⇄ QR/code ⇄ Phone',
      devThisDeviceLabel:'This device:',
      devStatusLabel:'Status:',
      devOfferLabel:'Outgoing code (offer, base64)',
      devAnswerLabel:'Answer code (answer, base64)',
      btnOffer:'Create link code',
      btnAcceptOffer:'Paste link code',
      devTabsTitle:'Tabs',
      devConnLabel:'Connection:',
      devPairingTitle:'Link with another device',
      devPairingSub:'On the second device open “Your devices” (or the web client at getlifeundo.com/device) and enter this code once into “Confirm code”.',
      devPairingCodeLabel:'Code for this device (enter it on the second device once):',
      devPairingAcceptLabel:'I already have a code from another device:',
      devPairingStatusReady:'Code generated. Enter it on the second device within 15 minutes. After a successful link the code no longer works.',
      devPairingStatusLinked:'Devices are linked. This code is already used and no longer valid.',
      devAdvancedTitle:'Developer mode (offer/answer)',
      devAdvancedNote:'Low-level mode for debugging WebRTC between devices. In normal life, use the code/QR above.',
      aboutSocialsTitle:'Socials',
      btnShare:'Share',
      btnRate:'Rate',
      appsOpenBtn:'Open',
      subsProTitle:'PRO (monthly)',
      subsProSub:'per month',
      subsVipTitle:'VIP (lifetime)',
      subsVipSub:'one-time',
      subsTeamTitle:'TEAM 5',
      subsTeamSub:'for a team',
      btnPay:'Pay',
      btnActivate:'Activate code',
      faqQ1:'What is GetLifeUndo?',
      faqA1:'It is a local timeline of your activity: screenshots and clipboard text that help you return to what you did 5 minutes, an hour or a day ago.',
      faqQ2:'How does it work?',
      faqA2:'The app watches system screenshot folders and saves text from the clipboard. Everything stays on your disk.',
      faqQ3:'Where is my data stored?',
      faqA3:'Locally, in %AppData%/GetLifeUndo. You can open this folder from settings.',
      faqQ4:'Do I need to configure anything?',
      faqA4:'By default it just works. You can additionally add your own folders to watch and choose a storage location.',
      faqQ5:'Why does my antivirus complain?',
      faqA5:'New unsigned builds may trigger false positives. We are connecting a European code signing certificate.',
      faqQ6:'What happens if I cancel my subscription?',
      faqA6:'Local access to your data remains. Premium features and future cloud options may be disabled.',
      faqQ7:'How can I change the storage folder?',
      faqA7:'Settings → General → “Choose storage folder” (in onboarding) or move the folder manually and point the config to it.',
      faqQ8:'How can I export my data?',
      faqA8:'Open the data folder from settings and copy the files you need. Logs can be exported via a dedicated button.',
      faqQ9:'App does not start from ZIP',
      faqA9:'Unpack the archive completely: EXE must see Chromium/ffmpeg files next to it.',
      faqQ10:'How does it work together (PC + extension + Android)?',
      faqA10_1:'1) PC/laptop: install the main LifeUndo app for Windows (0.4.x) and enable watching screenshots/text.',
      faqA10_2:'2) Extension: install this extension in Firefox and link the device via the code in “Your devices”.',
      faqA10_3:'3) Phone (Android): install the mobile app from RuStore and enable sending screenshots/text. Later you will see everything in the shared Timeline on PC, in the browser and on the phone.',
      faqA10_4:'Right now this scheme is in transition: some features already work locally, and unified subscription/cloud sync will be enabled gradually.'
    },
    footer: { site:'Site', gh:'GitHub', privacy:'Privacy', copy:'© GetLifeUndo™' }
    , headerTitle:'Settings'
  }
}

btnLoad && btnLoad.addEventListener('click', async ()=>{
  try{
    const r = await chrome.storage.local.get(['lastOffer','lastAnswer'])
    if (offerEl) offerEl.value = r.lastOffer || ''
    if (answerEl) answerEl.value = r.lastAnswer || ''
  }catch{}
})

// chips: shots limit
chipsShots.forEach(btn=>{
  btn.addEventListener('click', async ()=>{
    const v = Number(btn.getAttribute('data-shots-limit'))
    TL_PREFS.shotsLimit = v
    try{ await chrome.storage.local.set({ tlPrefs: TL_PREFS }) }catch{}
    renderTimeline()
  })
})

// Переключение языка из настроек (select-lang)
if (selectLang && typeof selectLang.addEventListener==='function'){
  selectLang.addEventListener('change', async ()=>{
    try{
      const v = selectLang.value === 'en' ? 'en' : 'ru'
      await chrome.storage.local.set({ locale: v })
      applyLocale(v)
    }catch{}
  })
}
// chips: text retention
chipsText.forEach(btn=>{
  btn.addEventListener('click', async ()=>{
    const v = Number(btn.getAttribute('data-text-hrs'))
    TL_PREFS.textHrs = v
    try{ await chrome.storage.local.set({ tlPrefs: TL_PREFS }) }catch{}
    renderTimeline()
  })
})

// open helpers
tlOpenFolder && tlOpenFolder.addEventListener('click', async ()=>{
  try{
    const r = await chrome.storage.local.get('shots')
    const arr = Array.isArray(r.shots)? r.shots: []
    const html = `<html><head><meta charset='utf-8'><title>Shots</title></head><body style='background:#0e1621;color:#e9f1f7;font-family:system-ui'>${arr.map(it=>`<div style='margin:8px 0'><img src='${it.dataUrl}' style='max-width:420px;border-radius:8px'/><div style='font:12px monospace;color:#a3b3c7'>${new Date(it.t).toLocaleString()}</div></div>`).join('')}</body></html>`
    const url = 'data:text/html;charset=utf-8,'+encodeURIComponent(html)
    chrome.tabs.create({ url })
  }catch{}
})

tlOpenArchive && tlOpenArchive.addEventListener('click', async ()=>{
  try{
    const r = await chrome.storage.local.get('textLog')
    const arr = Array.isArray(r.textLog)? r.textLog: []
    const jsonl = arr.map(x=>JSON.stringify(x)).join('\n')
    const url = 'data:text/plain;charset=utf-8,'+encodeURIComponent(jsonl)
    chrome.tabs.create({ url })
  }catch{}
})

// Tabs switching
function activateTab(key){
  const ids = ['general','apps','subs','about','faq','timeline','devices']
  const valid = ids.includes(key) ? key : 'general'
  const titles = (window.__loc && I18N[window.__loc] ? I18N[window.__loc].tabs : I18N.ru.tabs)
  document.querySelectorAll('.tab').forEach(b=>{
    const k = b.getAttribute('data-tab')
    if (k===valid) b.classList.add('active'); else b.classList.remove('active')
  })
  ids.forEach(id=>{
    const el = document.getElementById('panel-'+id)
    if (!el) return
    if (id===valid) el.classList.remove('hidden')
    else el.classList.add('hidden')
  })
  try{
    const h = document.getElementById('page-title'); if (h) h.textContent = titles[valid] || titles.general
  }catch(_){ }
}

document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=> activateTab(btn.getAttribute('data-tab')||'general'))
})

// Автовыбор вкладки по сохранённому ключу
function applyLocale(loc){
  const L = I18N[loc] || I18N.ru
  window.__loc = loc
  // синхронизация селектора языка
  if (selectLang){
    selectLang.value = loc === 'en' ? 'en' : 'ru'
  }
  // заголовки вкладок
  const map = [ ['tab-btn-general','general'], ['tab-btn-apps','apps'], ['tab-btn-subs','subs'], ['tab-btn-about','about'], ['tab-btn-faq','faq'], ['tab-btn-timeline','timeline'], ['tab-btn-devices','devices'] ]
  map.forEach(([id,key])=>{ const el=$("#"+id); if(el) el.textContent=L.tabs[key] })
  // заголовки секций и подписи
  const ids = {
    'sec-general-title': L.tabs.general,
    'sec-apps-title': L.tabs.apps,
    'sec-subs-title': L.tabs.subs,
    'sec-about-title': L.tabs.about,
    'sec-faq-title': L.tabs.faq,
    'sec-timeline-title': L.tabs.timeline,
    'sec-devices-title': L.tabs.devices,
    'lbl-lang': L.labels.lang,
    'lbl-show-here': L.labels.showHere,
    'lbl-screens': L.labels.screens,
    'lbl-video': L.labels.video,
    'lbl-event': L.labels.event,
    'lbl-email': L.labels.email,
    'lbl-status': L.labels.status + 'Free',
    'sec-paths-title': L.labels.pathsTitle,
    'lbl-paths-hint': L.labels.pathsHint,
    'li-screens': L.labels.liScreens,
    'li-docs': L.labels.liDocs,
    'li-downloads': L.labels.liDownloads,
    'sec-limits-title': L.labels.limitsTitle,
    'lbl-limits': L.labels.limitsValue
  }
  Object.entries(ids).forEach(([id,txt])=>{ const el=$("#"+id); if(el) el.textContent=txt })
  // Timeline: shots/text controls
  const tlShotsLimitLbl = $('#tl-shots-limit-label'); if (tlShotsLimitLbl) tlShotsLimitLbl.textContent = L.labels.tlShotsLimit
  const tlShotsNoteEl = $('#tl-shots-note'); if (tlShotsNoteEl) tlShotsNoteEl.textContent = L.labels.tlShotsNote
  const tlTextStoreEl = $('#tl-text-store'); if (tlTextStoreEl) tlTextStoreEl.textContent = L.labels.tlTextStore
  const tlTextNoteEl = $('#tl-text-note'); if (tlTextNoteEl) tlTextNoteEl.textContent = L.labels.tlTextNote
  const tlShotsCountEl = $('#tl-shots-count'); if (tlShotsCountEl){
    if (loc==='en') tlShotsCountEl.textContent = 'Last 0 of 0'
    else tlShotsCountEl.textContent = 'Последние 0 из 0'
  }
  const tlOpenFolderBtn = $('#tl-open-folder'); if (tlOpenFolderBtn) tlOpenFolderBtn.textContent = L.labels.tlOpenFolder
  const tlOpenArchiveBtn = $('#tl-open-archive'); if (tlOpenArchiveBtn) tlOpenArchiveBtn.textContent = L.labels.tlOpenArchive
  // Apps
  const r1 = $('#apps-rustore-sub'); if(r1) r1.textContent = L.labels.appsRustoreSub
  const g1 = $('#apps-github-sub'); if(g1) g1.textContent = L.labels.appsGithubSub
  const n1 = $('#apps-nash-sub'); if(n1) n1.textContent = L.labels.appsNashSub
  const f1 = $('#apps-fdroid-sub'); if(f1) f1.textContent = L.labels.appsFdroidSub
  const h1 = $('#apps-huawei-sub'); if(h1) h1.textContent = L.labels.appsHuaweiSub
  const s1 = $('#apps-samsung-sub'); if(s1) s1.textContent = L.labels.appsSamsungSub
  const adt = $('#apps-desktop-title'); if(adt) adt.textContent = L.labels.appsDesktopTitle
  const adw = $('#apps-desktop-win'); if(adw) adw.textContent = L.labels.appsDesktopWin
  const adm = $('#apps-desktop-mac'); if(adm) adm.textContent = L.labels.appsDesktopMac
  // Subscription cards
  const spT = $('#subs-pro-title'); if(spT) spT.textContent = L.labels.subsProTitle
  const spS = $('#subs-pro-sub'); if(spS) spS.textContent = L.labels.subsProSub
  const svT = $('#subs-vip-title'); if(svT) svT.textContent = L.labels.subsVipTitle
  const svS = $('#subs-vip-sub'); if(svS) svS.textContent = L.labels.subsVipSub
  const stT = $('#subs-team-title'); if(stT) stT.textContent = L.labels.subsTeamTitle
  const stS = $('#subs-team-sub'); if(stS) stS.textContent = L.labels.subsTeamSub
  const bp1 = $('#pay-pro'); if(bp1) bp1.textContent = L.labels.btnPay
  const bp2 = $('#pay-vip'); if(bp2) bp2.textContent = L.labels.btnPay
  const bp3 = $('#pay-team'); if(bp3) bp3.textContent = L.labels.btnPay
  const ba = $('#btn-activate'); if(ba) ba.textContent = L.labels.btnActivate
  const lh = $('#lic-hint'); if(lh) lh.textContent = L.labels.licHint
  // FAQ
  const fq = [1,2,3,4,5,6,7,8]
  fq.forEach((i)=>{
    const q = $('#faq-q'+i)
    const a = $('#faq-a'+i)
    if (q) q.textContent = L.labels['faqQ'+i]
    if (a) a.textContent = L.labels['faqA'+i]
  })
  const fq9 = $('#faq-q9'); if (fq9) fq9.textContent = L.labels.faqQ9
  const fa9 = $('#faq-a9'); if (fa9) fa9.textContent = L.labels.faqA9
  const fq10 = $('#faq-q10'); if (fq10) fq10.textContent = L.labels.faqQ10
  const fa10_1 = $('#faq-a10-1'); if (fa10_1) fa10_1.textContent = L.labels.faqA10_1
  const fa10_2 = $('#faq-a10-2'); if (fa10_2) fa10_2.textContent = L.labels.faqA10_2
  const fa10_3 = $('#faq-a10-3'); if (fa10_3) fa10_3.textContent = L.labels.faqA10_3
  const fa10_4 = $('#faq-a10-4'); if (fa10_4) fa10_4.textContent = L.labels.faqA10_4
  // подсказки
  if (hintEmail) hintEmail.title = L.labels.hintEmail||''
  if (hintEvent) hintEvent.title = L.labels.hintEvent||''
  if (hintTimeline) hintTimeline.title = L.labels.hintTimeline||''
  if (hintDevices) hintDevices.title = L.labels.hintDevices||''
  const dev1 = $('#dev-intro-1'); if (dev1) dev1.textContent = L.labels.devIntro1||dev1.textContent
  const dev2 = $('#dev-intro-2'); if (dev2) dev2.textContent = L.labels.devIntro2||dev2.textContent
  const dev3 = $('#dev-intro-3'); if (dev3) dev3.textContent = L.labels.devIntro3||dev3.textContent
  const dev4 = $('#dev-intro-4'); if (dev4) dev4.textContent = L.labels.devIntro4||dev4.textContent
  const devThisLbl = $('#dev-this-device-label'); if (devThisLbl) devThisLbl.textContent = L.labels.devThisDeviceLabel||devThisLbl.textContent
  const devStatusLbl = $('#dev-status-label'); if (devStatusLbl) devStatusLbl.textContent = L.labels.devStatusLabel||devStatusLbl.textContent
  const devOfferLbl = $('#dev-offer-label'); if (devOfferLbl) devOfferLbl.textContent = L.labels.devOfferLabel||devOfferLbl.textContent
  const devAnswerLbl = $('#dev-answer-label'); if (devAnswerLbl) devAnswerLbl.textContent = L.labels.devAnswerLabel||devAnswerLbl.textContent
  const devTabsTitle = $('#dev-tabs-title'); if (devTabsTitle) devTabsTitle.textContent = L.labels.devTabsTitle||devTabsTitle.textContent
  const devConnLbl = $('#dev-conn-label'); if (devConnLbl) devConnLbl.textContent = L.labels.devConnLabel||devConnLbl.textContent
  const btnOfferEl = $('#btn-offer'); if (btnOfferEl) btnOfferEl.textContent = L.labels.btnOffer||btnOfferEl.textContent
  const btnAcceptOfferEl = $('#btn-accept-offer'); if (btnAcceptOfferEl) btnAcceptOfferEl.textContent = L.labels.btnAcceptOffer||btnAcceptOfferEl.textContent
  const devPairingTitle = $('#dev-pairing-title'); if (devPairingTitle) devPairingTitle.textContent = L.labels.devPairingTitle||devPairingTitle.textContent
  const devPairingSub = $('#dev-pairing-sub'); if (devPairingSub) devPairingSub.textContent = L.labels.devPairingSub||devPairingSub.textContent
  const devPairingCodeLabel = $('#dev-pairing-code-label'); if (devPairingCodeLabel) devPairingCodeLabel.textContent = L.labels.devPairingCodeLabel||devPairingCodeLabel.textContent
  const devPairingAcceptLabel = $('#dev-pairing-accept-label'); if (devPairingAcceptLabel) devPairingAcceptLabel.textContent = L.labels.devPairingAcceptLabel||devPairingAcceptLabel.textContent
  const devAdvTitle = $('#dev-advanced-title'); if (devAdvTitle) devAdvTitle.textContent = L.labels.devAdvancedTitle||devAdvTitle.textContent
  const devAdvNote = $('#dev-advanced-note'); if (devAdvNote) devAdvNote.textContent = L.labels.devAdvancedNote||devAdvNote.textContent
  const aboutSoc = $('#about-socials-title'); if (aboutSoc) aboutSoc.textContent = L.labels.aboutSocialsTitle||aboutSoc.textContent
  const btnShare = $('#btn-share'); if (btnShare) btnShare.textContent = L.labels.btnShare||btnShare.textContent
  const btnRate = $('#btn-rate'); if (btnRate) btnRate.textContent = L.labels.btnRate||btnRate.textContent
  const appRuBtn = $('#apps-rustore-btn'); if (appRuBtn) appRuBtn.textContent = L.labels.appsOpenBtn||appRuBtn.textContent
  const appGhBtn = $('#apps-github-btn'); if (appGhBtn) appGhBtn.textContent = L.labels.appsOpenBtn||appGhBtn.textContent
  if (hintShowHere) hintShowHere.title = L.labels.hintShowHere||''
  if (hintScreens) hintScreens.title = L.labels.hintScreens||''
  if (hintVideo) hintVideo.title = L.labels.hintVideo||''
  if (hintPaths) hintPaths.title = L.labels.hintPaths||''
  if (hintExportLogs) hintExportLogs.title = L.labels.hintExportLogs||''
  // timeline buttons
  if (tlBtnTab) tlBtnTab.textContent = L.labels.tlTabs
  if (tlBtnShot) tlBtnShot.textContent = L.labels.tlShots
  if (tlBtnText) tlBtnText.textContent = L.labels.tlText
  // текст подсказки в Ленте (вкладки) без аккаунтов и "позже"
  const helpTabs = document.getElementById('tl-help-tabs')
  if (helpTabs){
    if (loc==='en'){
      helpTabs.innerHTML = '<div style="font-weight:600;margin-bottom:4px">Tabs</div>'+
        '<div>Timeline shows recently closed tabs from this browser.</div>'+
        '<div>To send tabs between devices, open the Your devices tab and link them using offer/answer codes.</div>'+
        '<div>Everything stays local; nothing is sent to a server unless you explicitly choose otherwise.</div>'
    } else {
      helpTabs.innerHTML = '<div style="font-weight:600;margin-bottom:4px">Вкладки</div>'+
        '<div>Лента показывает недавние вкладки из этого браузера.</div>'+
        '<div>Чтобы пересылать вкладки между устройствами, откройте вкладку Ваши устройства и свяжите их через offer/answer.</div>'+
        '<div>Все данные остаются локально; ничего не отправляется на сервер без вашего явного решения.</div>'
    }
  }
  // buttons in paths block
  const b1 = $('#btn-add-screens'); if(b1) b1.textContent = L.labels.btnAddScreens
  const b2 = $('#btn-add-texts'); if(b2) b2.textContent = L.labels.btnAddTexts
  const b3 = $('#btn-open-logs'); if(b3) b3.textContent = L.labels.btnOpenLogs
  const b4 = $('#btn-export-logs'); if(b4) b4.textContent = L.labels.btnExportLogs
  // footer texts
  const fs = $('#f-site'); if(fs) fs.textContent=L.footer.site
  const fg = $('#f-github'); if(fg) fg.textContent=L.footer.gh
  const fp = $('#f-privacy'); if(fp) fp.textContent=L.footer.privacy
  const fc = $('#f-copy'); if(fc) fc.textContent=L.footer.copy
  // header title
  const ht = document.getElementById('hdr-title'); if (ht) ht.textContent = (L.headerTitle || 'Settings')
  // select удалён (переключение языка глобально из Главной)
  // пересчитать заголовок страницы
  const active = document.querySelector('.tab.active')?.getAttribute('data-tab') || 'general'
  activateTab(active)
  // (hdr-locale удалён из шапки)
}

;(async()=>{
  try{
    const r = await chrome.storage.local.get('__options_active_tab')
    const key = r.__options_active_tab
    if (key) {
      activateTab(key)
      await chrome.storage.local.remove('__options_active_tab')
    } else {
      activateTab('general')
    }
  }catch{}
  // Инициализация языка
  try{
    const r = await chrome.storage.local.get('locale')
    const loc = (r && r.locale) === 'en' ? 'en' : 'ru'
    applyLocale(loc)
  }catch{}
  // Лицензия / триал
  try{
    await initLicenseAndTrial()
  }catch{}
  // Инициализация состояний (пилюли)
  try{
    const r = await chrome.storage.local.get('settings')
    const s = r.settings || {}
    setPill(pillShowHere, s.showHere !== false)
    setPill(pillScreens, s.captureScreens !== false)
    setPill(pillVideo, !!s.captureVideo)
    setPill(pillEvent, !!s.eventMode)
  }catch{}
})()

btnClear && btnClear.addEventListener('click', async ()=>{
  try{
    await chrome.storage.local.remove(['lastOffer','lastAnswer','recv'])
    if (offerEl) offerEl.value = ''
    if (answerEl) answerEl.value = ''
  }catch{}
})

// Глобальное применение локали при изменении из Главной
try{
  chrome.storage.onChanged.addListener((changes, area)=>{
    try{
      if (area==='local' && changes){
        if (changes.locale){
          const nv = changes.locale.newValue === 'en' ? 'en' : 'ru'
          applyLocale(nv)
        }
        if (changes.recv){
          // данные Ленты обновились
          try{ TL_DATA.tab = Array.isArray(changes.recv.newValue) ? changes.recv.newValue : [] }catch{ TL_DATA.tab = [] }
          renderTimeline()
        }
        if (changes.textLog){ try{ TL_DATA.text = Array.isArray(changes.textLog.newValue) ? changes.textLog.newValue : [] }catch{ TL_DATA.text = [] }; renderTimeline() }
        if (changes.shots){ try{ TL_DATA.shot = Array.isArray(changes.shots.newValue) ? changes.shots.newValue : [] }catch{ TL_DATA.shot = [] }; renderTimeline() }
        if (changes.formStates){ try{ FORM_STATES = Array.isArray(changes.formStates.newValue) ? changes.formStates.newValue : [] }catch{ FORM_STATES = [] }; renderTimeline() }
        if (changes.tlPrefs){ try{ TL_PREFS = Object.assign(TL_PREFS, changes.tlPrefs.newValue||{}) }catch{}; renderTimeline() }
      }
    }catch{}
  })
}catch{}

hdrBack && hdrBack.addEventListener('click', ()=>{
  try{
    const url = (chrome?.runtime?.getURL && chrome.runtime.getURL('popup.html')) || 'popup.html'
    location.assign(url)
  }catch{
    try{ location.href = 'popup.html' }catch{}
  }
})
if (hdrClose && typeof hdrClose.addEventListener==='function'){
  hdrClose.addEventListener('click', ()=>{
    try{ window.close() }catch{}
    try{ location.href = 'about:blank' }catch{}
  })
}

// Обработчики кликов по пилюлям
[
  ['showHere', pillShowHere],
  ['captureScreens', pillScreens],
  ['captureVideo', pillVideo],
  ['eventMode', pillEvent]
].forEach(([key, el])=>{
  if (!el) return
  el.addEventListener('click', async ()=>{
    try{
      const r = await chrome.storage.local.get('settings')
      const s = Object.assign({}, r.settings||{})
      const now = !(el.classList.contains('on'))
      s[key] = now
      setPill(el, now)
      await chrome.storage.local.set({ settings: s })
    }catch{}
  })
})

// Обработчики оплаты
btnPayPro && btnPayPro.addEventListener('click', ()=> createPayment('PROM'))
btnPayVip && btnPayVip.addEventListener('click', ()=> createPayment('VIPL'))
btnPayTeam && btnPayTeam.addEventListener('click', ()=> createPayment('TEAM5'))

// Подписка на обновления — отправка на legal@getlifeundo.com через API
function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||'').trim()) }
async function submitEmail(){
  const email = String(inputEmail?.value||'').trim()
  if (!validEmail(email)) { try{ inputEmail?.setCustomValidity('Invalid'); inputEmail?.reportValidity() }catch{}; return }
  try{
    const rloc = await chrome.storage.local.get(['locale','license']).catch(()=>({}))
    const locale = (rloc && rloc.locale)==='en' ? 'en' : 'ru'
    const lic = rloc && rloc.license || {}
    const deviceId = await ensureDeviceId()
    const mf = (chrome?.runtime?.getManifest && chrome.runtime.getManifest()) || {}
    const version = mf.version || '0.0.0'
    const payload = {
      email,
      platform:'extension',
      locale,
      deviceId,
      appVersion: version,
      licenseTier: lic.tier||'free',
      licenseStatus: lic.status||'trial',
      trialStart: lic.trialStart||null,
      trialEnd: lic.trialEnd||null
    }
    let ok = false
    try{
      const res = await fetch('https://getlifeundo.com/api/subscribe', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      ok = !!(res && res.ok)
    }catch{}
    if (!ok){
      const subj = locale==='en' ? 'Subscription' : 'Подписка'
      const lines = [
        `email: ${email}`,
        `locale: ${locale}`,
        `platform: extension`,
        `deviceId: ${deviceId}`,
        `version: ${version}`,
        `licenseTier: ${payload.licenseTier}`,
        `licenseStatus: ${payload.licenseStatus}`,
        `trialStart: ${payload.trialStart||''}`,
        `trialEnd: ${payload.trialEnd||''}`
      ]
      const body = encodeURIComponent(lines.join("\n"))
      try{ location.href = `mailto:legal@getlifeundo.com?subject=${encodeURIComponent(subj)}&body=${body}` }catch{}
    }
    try{ await chrome.storage.local.set({ lastSubscribeEmail: email, lastSubscribeAt: Date.now() }) }catch{}
    try{ btnEmailOk?.setAttribute('disabled','true') }catch{}
  }catch{}
}
btnEmailOk && btnEmailOk.addEventListener('click', submitEmail)

// Кнопки Поделиться / Оценить
btnRate && btnRate.addEventListener('click', ()=>{
  try{ open('https://www.rustore.ru/catalog/app/com.getlifeundo.lifeundo_app','_blank') }catch{
    try{ location.href = 'https://www.rustore.ru/catalog/app/com.getlifeundo.lifeundo_app' }catch{}
  }
})

btnShare && btnShare.addEventListener('click', async ()=>{
  try{
    const deviceId = await ensureDeviceId()
    const rloc = await chrome.storage.local.get('locale').catch(()=>({}))
    const locale = (rloc && rloc.locale)==='en' ? 'en' : 'ru'
    const url = `https://getlifeundo.com/share?platform=extension&deviceId=${encodeURIComponent(deviceId)}&locale=${encodeURIComponent(locale)}`
    try{ open(url,'_blank') }catch{ location.href = url }
  }catch{}
})

// Дополнительные пути наблюдения (заглушка-конфиг)
async function loadWatchPaths(){
  try{
    const r = await chrome.storage.local.get('watchPaths')
    if (r && r.watchPaths) WATCH_PATHS = Object.assign({ shots:[], text:[] }, r.watchPaths)
  }catch{}
}

async function saveWatchPaths(){
  try{ await chrome.storage.local.set({ watchPaths: WATCH_PATHS }) }catch{}
}

function addWatchPath(kind){
  const max = 10
  const cur = Array.isArray(WATCH_PATHS[kind]) ? WATCH_PATHS[kind] : []
  if (cur.length>=max) return
  const isEn = window.__loc === 'en'
  const msg = kind==='shots'
    ? (isEn ? 'Add path for screenshots' : 'Добавить путь для скриншотов')
    : (isEn ? 'Add path for texts' : 'Добавить путь для текстов')
  const v = prompt(msg)
  if (!v) return
  const path = String(v).trim()
  if (!path) return
  if (cur.includes(path)) return
  WATCH_PATHS[kind] = cur.concat(path)
  saveWatchPaths()
}

btnAddScreens && btnAddScreens.addEventListener('click', ()=> addWatchPath('shots'))
btnAddTexts && btnAddTexts.addEventListener('click', ()=> addWatchPath('text'))

// Экспорт логов в SQL-подобном формате
btnExportLogs && btnExportLogs.addEventListener('click', async ()=>{
  try{
    const r = await chrome.storage.local.get(['recv','shots','textLog','formStates'])
    const tabs = Array.isArray(r.recv)? r.recv: []
    const shots = Array.isArray(r.shots)? r.shots: []
    const texts = Array.isArray(r.textLog)? r.textLog: []
    const forms = Array.isArray(r.formStates)? r.formStates: []
    const lines = []
    lines.push('CREATE TABLE IF NOT EXISTS timeline_events (ts INTEGER, kind TEXT, payload TEXT);')
    const pushRow = (ts, kind, payload)=>{
      const esc = String(payload||'').replace(/'/g,"''")
      lines.push(`INSERT INTO timeline_events(ts,kind,payload) VALUES(${Number(ts)||0},'${kind}','${esc}');`)
    }
    tabs.forEach(x=> pushRow(x.t||0,'tab', x.url||''))
    shots.forEach(x=> pushRow(x.t||0,'shot', x.path||x.copy_path||'screenshot'))
    texts.forEach(x=> pushRow(x.t||0,'text', x.text||''))
    forms.forEach(x=> pushRow(x.t||0,'formState', JSON.stringify({ url:x.url||'', title:x.title||'', fields:x.fields||[] })))
    const sql = lines.join('\n')
    const url = 'data:text/plain;charset=utf-8,'+encodeURIComponent(sql||'')
    try{ chrome.tabs.create({ url }) }catch{ window.open(url,'_blank') }
  }catch{}
})

// Быстрый просмотр логов (JSONL из recv/shots/textLog)
btnOpenLogs && btnOpenLogs.addEventListener('click', async ()=>{
  try{
    const r = await chrome.storage.local.get(['recv','shots','textLog','formStates'])
    const tabs = Array.isArray(r.recv)? r.recv: []
    const shots = Array.isArray(r.shots)? r.shots: []
    const texts = Array.isArray(r.textLog)? r.textLog: []
    const forms = Array.isArray(r.formStates)? r.formStates: []
    const parts = []
    if (tabs.length) parts.push('# tabs', ...tabs.map(x=>JSON.stringify(x)))
    if (shots.length) parts.push('\n# shots', ...shots.map(x=>JSON.stringify(x)))
    if (texts.length) parts.push('\n# text', ...texts.map(x=>JSON.stringify(x)))
    if (forms.length) parts.push('\n# formStates', ...forms.map(x=>JSON.stringify(x)))
    const content = parts.join('\n') || '# empty'
    const url = 'data:text/plain;charset=utf-8,'+encodeURIComponent(content)
    try{ chrome.tabs.create({ url }) }catch{ window.open(url,'_blank') }
  }catch{}
})

// Загрузка конфигурации путей при старте
loadWatchPaths()

// ---------- Лента ----------
function renderTimeline(){
  try{
    const list = tlList; const empty = tlEmpty
    if (!list || !empty) return
    list.innerHTML = ''
    // toggle active state on filter buttons
    ;[tlBtnTab, tlBtnShot, tlBtnText].forEach(btn=>{ if (btn) btn.classList.remove('active') })
    if (TL_FILTER==='tab' && tlBtnTab) tlBtnTab.classList.add('active')
    if (TL_FILTER==='shot' && tlBtnShot) tlBtnShot.classList.add('active')
    if (TL_FILTER==='text' && tlBtnText) tlBtnText.classList.add('active')
    // если подписка не активна — Лента недоступна
    if (!licenseAllowsTimeline()){
      if (tlHelpTabs) tlHelpTabs.style.display = 'none'
      if (tlShotsHead) tlShotsHead.style.display = 'none'
      if (tlShotsChips) tlShotsChips.style.display = 'none'
      if (tlShotsNote) tlShotsNote.style.display = 'none'
      if (tlTextHead) tlTextHead.style.display = 'none'
      if (tlTextChips) tlTextChips.style.display = 'none'
      if (tlTextNote) tlTextNote.style.display = 'none'
      empty.style.display = 'block'
      empty.textContent = window.__loc==='en'
        ? 'Timeline is available with an active subscription. Trial has ended.'
        : 'Лента доступна при активной подписке. Триал завершён.'
      return
    }
    // toggle heads
    if (tlHelpTabs) {
      tlHelpTabs.style.display = (TL_FILTER==='tab' ? 'block':'none')
    }
    // Показ по активному фильтру
    const showShot = TL_FILTER==='shot';
    const showText = TL_FILTER==='text';
    if (tlShotsHead) tlShotsHead.style.display = showShot ? 'flex' : 'none'
    if (tlShotsChips) tlShotsChips.style.display = showShot ? 'flex' : 'none'
    if (tlShotsNote) tlShotsNote.style.display = showShot ? 'block' : 'none'
    if (tlTextHead) tlTextHead.style.display = showText ? 'flex' : 'none'
    if (tlTextChips) tlTextChips.style.display = showText ? 'flex' : 'none'
    if (tlTextNote) tlTextNote.style.display = showText ? 'block' : 'none'
    let rows = []
    if (TL_FILTER==='tab'){
      rows = (TL_DATA.tab||[]).map(it=>{
        const url = it && it.url ? String(it.url) : ''
        const d = it && it.t ? new Date(it.t) : null
        const time = d ? d.toLocaleTimeString() : ''
        const hasForm = !!FORM_STATES.find(f=> f && f.url===url)
        const btn = hasForm ? `<button class="tag" data-restore-form="${encodeURIComponent(url)}">Восстановить форму</button>` : ''
        return `<div class="item" style="display:flex;align-items:center;gap:8px"><a href="${url}" target="_blank" rel="noopener" style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${url}</a>${btn}<span class="muted">${time}</span></div>`
      })
    }
    if (TL_FILTER==='shot'){
      const limit = Number(TL_PREFS.shotsLimit||10)
      const total = (TL_DATA.shot||[]).length
      const subset = (TL_DATA.shot||[]).slice(0, Math.max(1,limit))
      if (tlShotsCount){
        const loc = (window.__loc === 'en') ? 'en' : 'ru'
        if (loc==='en') tlShotsCount.textContent = `Last ${subset.length} of ${total}`
        else tlShotsCount.textContent = `Последние ${subset.length} из ${total}`
      }
      // highlight selected shots limit chip
      chipsShots.forEach(ch=>{ ch.classList.toggle('selected', Number(ch.getAttribute('data-shots-limit'))===limit) })
      rows = subset.map((it,i)=>{
        const url = it && it.dataUrl ? it.dataUrl : ''
        const path = it && (it.path||it.copy_path||'')
        const text = path ? path : `Скриншот #${i+1}`
        const time = it && it.t ? new Date(it.t).toLocaleTimeString() : ''
        const idx = i+1;
        return `<div class=\"item\" style=\"display:flex;align-items:center;gap:8px\"><div style=\"flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis\" title=\"${text}\">${text}</div><button class=\"tag\" data-show-shot=\"${idx-1}\">Показать</button><span class=\"muted\" style=\"margin-left:6px\">${time}</span></div>`
      })
    }
    if (TL_FILTER==='text'){
      const hrs = Number(TL_PREFS.textHrs||24)
      const threshold = Date.now() - hrs*3600*1000
      chipsText.forEach(ch=>{ ch.classList.toggle('selected', Number(ch.getAttribute('data-text-hrs'))===hrs) })
      rows = (TL_DATA.text||[]).filter(it=> (it.t||0) >= threshold)
        .slice(0,200)
        .map((it)=>`<div class=\"item\">${(it.text||'').replace(/</g,'&lt;').slice(0,200)}<span class=\"muted\">${it.t? new Date(it.t).toLocaleTimeString(): ''}</span></div>`) 
    }
    if (!rows.length){
      list.innerHTML = ''
      empty.style.display = 'block'
      const L = (window.__loc && I18N[window.__loc]) || I18N.ru
      empty.textContent = (L && L.labels && L.labels.tlEmpty) || 'Нет событий'
    }else{
      empty.style.display = 'none'
      list.innerHTML = rows.join('')
    }
  }catch{}
}

async function initTimeline(){
  try{
    const r = await chrome.storage.local.get(['recv','textLog','shots','tlPrefs','formStates'])
    TL_DATA.tab = Array.isArray(r.recv) ? r.recv : []
    TL_DATA.text = Array.isArray(r.textLog) ? r.textLog : []
    TL_DATA.shot = Array.isArray(r.shots) ? r.shots : []
    FORM_STATES = Array.isArray(r.formStates) ? r.formStates : []
    // реальных данных может не быть до импорта/интеграции — ничего не подставляем автоматически
    if (r.tlPrefs) TL_PREFS = Object.assign(TL_PREFS, r.tlPrefs)
  }catch{ TL_DATA.tab = [] }
  try{
    if (chrome.sessions && chrome.sessions.getRecentlyClosed){
      const closed = await chrome.sessions.getRecentlyClosed({ maxResults: 50 })
      const items = []
      closed.forEach(s=>{
        const t = s.tab || (s.window && s.window.tabs && s.window.tabs[0])
        if (t && t.url){
          items.push({ url: t.url, title: t.title||t.url, t: t.lastModified||Date.now() })
        }
      })
      if (items.length) TL_DATA.tab = items
    }
  }catch{}
  renderTimeline()
}

tlBtnTab && tlBtnTab.addEventListener('click', async ()=>{
  TL_FILTER='tab'
  try{
    if (chrome.sessions && chrome.sessions.getRecentlyClosed){
      const closed = await chrome.sessions.getRecentlyClosed({ maxResults: 50 })
      const items = []
      closed.forEach(s=>{
        const t = s.tab || (s.window && s.window.tabs && s.window.tabs[0])
        if (t && t.url){
          items.push({ url: t.url, title: t.title||t.url, t: t.lastModified||Date.now() })
        }
      })
      if (items.length) TL_DATA.tab = items
    }
  }catch{}
  renderTimeline()
})
tlBtnShot && tlBtnShot.addEventListener('click', ()=>{ TL_FILTER='shot'; renderTimeline() })
tlBtnText && tlBtnText.addEventListener('click', ()=>{ TL_FILTER='text'; renderTimeline() })

// инициализация Ленты при загрузке options
initTimeline()

// делегирование кликов «Показать» для скринов
document.addEventListener('click',(e)=>{
  const btn = e.target && e.target.closest && e.target.closest('[data-show-shot]');
  if (!btn) return;
  const idx = Number(btn.getAttribute('data-show-shot'))||0;
  const it = (TL_DATA.shot||[])[idx];
  if (!it || !it.dataUrl) return;
  const html = `<html><head><meta charset='utf-8'><title>Preview</title></head><body style='margin:0;background:#0b1220;display:flex;justify-content:center;align-items:center;min-height:100vh'><img src='${it.dataUrl}' style='max-width:96vw;max-height:96vh;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.5)'/></body></html>`;
  const url = 'data:text/html;charset=utf-8,'+encodeURIComponent(html);
  try{ chrome.tabs.create({ url }) }catch(_){ window.open(url,'_blank') }
})

// Единое делегирование для элементов Ленты (кроме самих кнопок-фильтров)
document.addEventListener('click', async (e)=>{
  const q = (sel)=> e.target && e.target.closest && e.target.closest(sel)
  // чипы лимитов скринов
  const chipShot = q('[data-shots-limit]')
  if (chipShot){
    const v = Number(chipShot.getAttribute('data-shots-limit'))||10
    TL_PREFS.shotsLimit = v
    try{ await chrome.storage.local.set({ tlPrefs: TL_PREFS }) }catch{}
    renderTimeline(); return
  }
  // чипы сроков текста
  const chipText = q('[data-text-hrs]')
  if (chipText){
    const v = Number(chipText.getAttribute('data-text-hrs'))||24
    TL_PREFS.textHrs = v
    try{ await chrome.storage.local.set({ tlPrefs: TL_PREFS }) }catch{}
    renderTimeline(); return
  }
  // восстановить форму (formState) для URL
  const restoreBtn = q('[data-restore-form]')
  if (restoreBtn){
    const url = decodeURIComponent(restoreBtn.getAttribute('data-restore-form')||'')
    if (url){
      try{
        chrome.tabs.create({ url }, (tab)=>{
          if (!tab || !tab.id) return
          const tabId = tab.id
          setTimeout(()=>{
            try{ chrome.tabs.sendMessage(tabId,{ type:'restore-form', url }) }catch{}
          }, 2000)
        })
      }catch{}
    }
    return
  }
  // открыть папку (просмотрщик миниатюр)
  if (q('#tl-open-folder')){
    const arr = Array.isArray(TL_DATA.shot)? TL_DATA.shot: []
    const html = `<html><head><meta charset='utf-8'><title>Shots</title></head><body style='background:#0e1621;color:#e9f1f7;font-family:system-ui'>${arr.map(it=>`<div style='margin:8px 0'><img src='${it.dataUrl||''}' style='max-width:420px;border-radius:8px'/><div style='font:12px monospace;color:#a3b3c7'>${it.t? new Date(it.t).toLocaleString():''}</div></div>`).join('')||'<div style=\"padding:12px\">Пусто</div>'}</body></html>`
    const url = 'data:text/html;charset=utf-8,'+encodeURIComponent(html)
    try{ chrome.tabs.create({ url }) }catch{ window.open(url,'_blank') }
    return
  }
  // открыть архив (JSONL)
  if (q('#tl-open-archive')){
    const arr = Array.isArray(TL_DATA.text)? TL_DATA.text: []
    const jsonl = arr.map(x=>JSON.stringify(x)).join('\n')
    const url = 'data:text/plain;charset=utf-8,'+encodeURIComponent(jsonl||'')
    try{ chrome.tabs.create({ url }) }catch{ window.open(url,'_blank') }
    return
  }
})

// --- Связка устройств через короткий код (backend API) ---
const btnPairStart = document.getElementById('btn-pair-start')
const btnPairAccept = document.getElementById('btn-pair-accept')
const pairingCodeBlock = document.getElementById('dev-pairing-code-block')
const pairingCodeEl = document.getElementById('dev-pairing-code')
const pairingStatusEl = document.getElementById('dev-pairing-status')
const pairingInputEl = document.getElementById('dev-pairing-input')

function setPairingStatus(kind){
  if (!pairingStatusEl) return
  const L = (window.__loc && I18N[window.__loc]) || I18N.ru
  if (kind==='ready') pairingStatusEl.textContent = L.labels.devPairingStatusReady||''
  else if (kind==='linked') pairingStatusEl.textContent = L.labels.devPairingStatusLinked||''
}

btnPairStart && btnPairStart.addEventListener('click', async ()=>{
  try{
    if (!pairingCodeEl || !pairingCodeBlock) return
    const deviceId = await ensureDeviceId()
    const payload = { deviceId, platform:'extension' }
    const res = await fetch('https://getlifeundo.com/api/pair/create',{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
    })
    const data = await res.json().catch(()=>null)
    if (!data || !data.ok || !data.shortCode){
      pairingCodeBlock.style.display = 'block'
      pairingCodeEl.textContent = '— — — —'
      pairingStatusEl && (pairingStatusEl.textContent = (data && data.error) ? String(data.error) : 'Ошибка создания кода')
      return
    }
    const code = String(data.shortCode||'')
    pairingCodeEl.textContent = code
    pairingCodeBlock.style.display = 'block'
    setPairingStatus('ready')
    try{ await chrome.storage.local.set({ lastPairCode: code, lastPairAt: Date.now() }) }catch{}
    updateDevicesMeta(deviceId, CURRENT_LICENSE)
  }catch{}
})

btnPairAccept && btnPairAccept.addEventListener('click', async ()=>{
  try{
    const raw = pairingInputEl && pairingInputEl.value || ''
    const code = String(raw).trim()
    if (!code) return
    if (pairingCodeBlock){
      pairingCodeBlock.style.display = 'block'
    }
    if (pairingStatusEl){
      const L = (window.__loc && I18N[window.__loc]) || I18N.ru
      const checkingRu = 'Проверяем код...'
      const checkingEn = 'Checking the code...'
      pairingStatusEl.textContent = (window.__loc==='en' ? checkingEn : checkingRu)
    }
    const deviceId = await ensureDeviceId()
    const payload = { deviceId, platform:'extension', shortCode: code }
    const res = await fetch('https://getlifeundo.com/api/pair/consume',{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
    })
    const data = await res.json().catch(()=>null)
    if (!data || !data.ok){
      if (pairingStatusEl){
        const L = (window.__loc && I18N[window.__loc]) || I18N.ru
        const fallbackRu = 'Не удалось подтвердить код. Проверьте, что он введён без ошибок и не истёк (код живёт около 15 минут и одноразовый).'
        const fallbackEn = 'Failed to confirm the code. Make sure it is typed correctly and has not expired (code is one-time and lives about 15 minutes).'
        const base = (data && data.error) ? String(data.error) : (window.__loc==='en' ? fallbackEn : fallbackRu)
        pairingStatusEl.textContent = base
      }
      return
    }
    try{ await chrome.storage.local.set({ lastAcceptedPairCode: code, lastAcceptedAt: Date.now() }) }catch{}
    setPairingStatus('linked')
    updateDevicesMeta(deviceId, CURRENT_LICENSE)
  }catch{}
})

// Восстановить последний сгенерированный код пейринга при открытии настроек (если он ещё актуален)
;(async ()=>{
  try{
    if (!pairingCodeEl || !pairingCodeBlock) return
    const r = await chrome.storage.local.get(['lastPairCode','lastPairAt']).catch(()=>({}))
    const code = r && r.lastPairCode ? String(r.lastPairCode) : ''
    const ts = typeof r.lastPairAt === 'number' ? r.lastPairAt : 0
    const ageMs = Date.now() - ts
    const ttlMs = 15*60*1000 // 15 минут отображения в UI
    if (code && ageMs>=0 && ageMs <= ttlMs){
      pairingCodeEl.textContent = code
      pairingCodeBlock.style.display = 'block'
      setPairingStatus('ready')
    }
  }catch{}
})()
