import type { Metadata } from 'next'
import { Noto_Serif, Roboto } from 'next/font/google'
import type { ReactNode } from 'react'

import SiteFooter from '@/components/site-footer'
import './globals.css'

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  display: 'swap',
})

const notoSerif = Noto_Serif({
  variable: '--font-noto-serif',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Catholic Calendar',
  description:
    'Proof-of-concept reusable Catholic calendar engine for selected Roman Catholic observances, movable dates, periods and transfers.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${notoSerif.variable}`}>
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
