# How to use Footer component (Next.js 14 "app" dir)

1) Put the component at: `src/components/Footer.tsx` (already provided).
2) Import and render it in `src/app/layout.tsx`:

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'GetLifeUndo',
  description: 'Ctrl+Z for your online life',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

3) If you use the `pages` directory instead of `app`, add `<Footer />` to your `_app.tsx` layout.
