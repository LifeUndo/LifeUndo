export default {
  nav: {
    features: "Features",
    usecases: "Use cases", 
    pricing: "Pricing",
    downloads: "Downloads",
    fund: "Fund",
    api: "API",
    whitelabel: "White-Label",
    buyVip: "Buy VIP",
  },
  banner: {
    rel: "Release 0.3.7.15 — new payment flow, RU/EN localization, mobile optimization",
    download: "Download",
  },
  errors: {
    unknownPlan: "Unknown plan",
    fkUnavailable: "Payments are temporarily unavailable",
    signature: "Signature error",
    network: "Network error",
    tariffUnavailable: "Plan unavailable. Please refresh the page.",
  },
  legal: { 
    privacy: "Privacy", 
    terms: "Terms", 
    offer: "Public Offer", 
    sla: "SLA" 
  },
  footer: {
    product: "Product",
    company: "Company",
    legal: "Legal",
    features: "Features",
    cases: "Use Cases",
    pricing: "Pricing",
    downloads: "Downloads",
    fund: "Fund",
    support: "Support",
    contacts: "Contacts",
    privacy: "Privacy",
    offer: "Public Offer",
    sla: "SLA",
    contract: "Contract",
    dpa: "DPA",
    policy: "Policy",
    downloadsTxt: "Download contracts (.TXT)"
  },
  common: { 
    learnMore: "Learn more", 
    install: "Install", 
    contactUs: "Contact us",
    comingSoon: "coming soon",
    creatingPayment: "Creating payment...",
    payWithFreeKassa: "Pay with FreeKassa",
    securePayment: "Secure payment",
  },
  hero: {
    title: "Ctrl+Z for your online life",
    subtitle: "Forms, tabs, clipboard — 100% local and private.",
    cta_primary: "Download extension",
    cta_secondary: "Learn more"
  },
  features: {
    restoreForms: "Restore form text after reloads",
    clipboardHistory: "Local clipboard history", 
    recentTabs: "Recently closed tabs",
    privacy: "Privacy by design: 100% local"
  },
  pricing: {
    pro: "Pro — 599 ₽ / month",
    vip: "VIP — 9 990 ₽ lifetime", 
    team: "Team — 2 990 ₽ / month",
    buy: "Buy",
    trial: "7-day trial",
    included: "What's included"
  },
  usecases: {
    students: "Students: bring back lost answers",
    editors: "Editors: undo unexpected rewrite", 
    office: "Office: restore closed tab & clipboard",
    smm: "SMM: clipboard history for posts",
    managers: "Managers: nothing gets lost",
    gov: "Gov/Banking: keep your forms"
  },
  howItWorks: {
    title: "How it works",
    step1: {
      title: "Install",
      description: "Download extension for Chrome, Firefox or Edge. One click — protection is active."
    },
    step2: {
      title: "Keep working", 
      description: "Fill forms, copy text, open tabs. Everything saves locally in your browser."
    },
    step3: {
      title: "Restore when needed",
      description: "Accidentally closed a tab? Lost text? Press \"Undo\" — everything is back in place."
    }
  },
  cta: {
    ready: "Ready to try?",
    download: "Download extension",
    learnMore: "Learn more"
  },
  downloads: {
    title: "Download GetLifeUndo",
    subtitle: "Choose your platform and get data loss protection in one click",
    currentVersion: "Current version:",
    publishedAt: "Published:",
    latestVersion: "Latest version",
    whatsNew: "What's new in",
    chrome: "For Chrome browser",
    firefox: "For Firefox browser",
    edge: "For Edge browser", 
    windows: "Desktop application",
    macos: "Desktop application",
    android: "Mobile application",
    licensePlaceholder: "Enter license key...",
    comingSoon: "Coming Soon",
    download: "Download",
    licenseTitle: "Do you have a license key?",
    licenseDescription: "Enter license key to activate Pro or VIP features",
    activate: "Activate",
    featuresTitle: "What you'll get after installation",
    feature1Title: "Form Recovery",
    feature1Description: "Automatic saving of entered text",
    feature2Title: "Tab History",
    feature2Description: "Recovery of accidentally closed pages",
    feature3Title: "Clipboard",
    feature3Description: "History of copied text",
    mobileComingSoon: "Mobile apps coming soon",
    mobileDescription: "GetLifeUndo will be available on iOS, Android and RuStore in Q1 2025"
  },
  apiPage: {
    h1: "GetLifeUndo API",
    overviewTitle: "Overview",
    overviewText: "Integrate payments and status checks into your website or back office. The API is minimal and stable.",
    baseUrl: "Base URL",
    auth: "Authentication",
    authText: "Use an API key in the Authorization header.",
    headerExample: "Example header",
    rateLimits: "Rate limits",
    rateLimitsText: "Default: up to 60 requests per minute per IP. Contact us if you need more.",
    endpoints: "Endpoints",
    healthzTitle: "Health check",
    createTitle: "Create FreeKassa payment link",
    requestBody: "Request body",
    responses: "Responses",
    webhooks: "Webhooks",
    webhooksText: "We will publish webhook schemas (payment.success, payment.fail) in the next update. Meanwhile you can poll the provider or contact support.",
    errors: "Errors",
    examples: "Examples",
    curl: "curl example",
    powershell: "PowerShell example",
    openapi: "Download OpenAPI spec",
  },
  wlPage: {
    h1: "White-Label & Resellers",
    introTitle: "What you get",
    introList: [
      "Custom brand, icon and name",
      "Private builds for Firefox/Windows/macOS",
      "Priority support & SLA",
      "Optional enterprise features",
    ],
    modelsTitle: "Commercial models",
    models: [
      "Revenue share — percentage of your sales",
      "One-time license — perpetual build + annual maintenance",
      "Fixed monthly fee — predictable cost for teams",
    ],
    howTitle: "How to start",
    howSteps: [
      "Tell us about your use case and monthly active users",
      "Choose a model and sign a short agreement",
      "We ship a private build and onboarding docs",
    ],
    cta: "Apply via Support and choose the topic \"White-Label\". Please include company name, website and rough MAU.",
  }
};
