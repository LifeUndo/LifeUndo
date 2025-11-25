import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

try {
  console.log('renderer:mount-start')
  const rootEl = document.getElementById('root')
  if (!rootEl) {
    console.error('renderer:no-root')
  } else {
    createRoot(rootEl).render(<App />)
    console.log('renderer:mount-done')
  }
} catch (e:any) {
  console.error('renderer:mount-error', e?.message || String(e))
}
