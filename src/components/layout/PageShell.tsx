import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function PageShell({ children, hideFooter = false }: { children: ReactNode; hideFooter?: boolean }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:font-bold"
      >
        Lompat ke konten
      </a>
      <Navbar />
      <main id="konten" className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}
