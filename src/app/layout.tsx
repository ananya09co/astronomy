import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import StarField from '@/components/ui/StarField'
import MeteorRain from '@/components/ui/MeteorRain'
import StructuredData from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  metadataBase: new URL('https://cosmic-atlas.vercel.app'),
  title: {
    default: 'Cosmic Atlas — Explore the Universe',
    template: '%s | Cosmic Atlas'
  },
  description: 'Your premium gateway to the cosmos. Real-time space news, astronomical events, interactive sky maps, and AI astronomy assistant.',
  keywords: ['astronomy', 'space', 'stars', 'constellations', 'NASA', 'telescope', 'cosmos', 'galaxy', 'nebula'],
  authors: [{ name: 'Cosmic Atlas Team' }],
  creator: 'Cosmic Atlas',
  publisher: 'Cosmic Atlas',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Cosmic Atlas — Explore the Universe',
    description: 'Your premium gateway to the cosmos. Real-time space news and astronomical events.',
    url: 'https://cosmic-atlas.vercel.app',
    siteName: 'Cosmic Atlas',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cosmic Atlas Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cosmic Atlas — Explore the Universe',
    description: 'Your premium gateway to the cosmos. Real-time space news and astronomical events.',
    images: ['/og-image.jpg'],
    creator: '@cosmic_atlas',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cosmic Atlas',
  },
  alternates: {
    canonical: 'https://cosmic-atlas.vercel.app',
  },
  verification: {
    google: 'google97221b336fca8b8d',
  },
}

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StructuredData />
        <StarField />
        <MeteorRain />
        <Navbar />
        <main className="page-wrapper">
          {children}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  )
}
