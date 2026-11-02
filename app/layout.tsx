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

const title = 'Catholic Calendar'
const description =
  'Proof-of-concept reusable Catholic calendar engine for selected Roman Catholic observances, movable dates, periods and transfers.'

export const metadata: Metadata = {
  metadataBase: new URL('https://catholic.bgonzalezbustamante.com'),
  title,
  description,
  openGraph: {
    type: 'website',
    url: '/',
    siteName: title,
    title,
    description,
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-GB">
      <body className={`${roboto.variable} ${notoSerif.variable}`}>
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
