import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ferdinand - Your Running Coach',
  description: 'Meet Ferdinand, your personal running coach! Get personalized motivational texts to keep you going strong during your runs.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  openGraph: {
    title: 'Ferdinand - Your Running Coach',
    description: 'Get personalized motivational texts for your running sessions with Ferdinand, your running coach.',
    url: 'https://coachferdinand.vercel.app/',
    siteName: 'Ferdinand',
    images: [
      {
        url: 'https://coachferdinand.vercel.app/header.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ferdinand - Your Running Coach',
    description: 'Get personalized motivational texts for your running sessions with Ferdinand, your running coach.',
    images: ['https://coachferdinand.vercel.app/header.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
