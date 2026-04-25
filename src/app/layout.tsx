import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StarField from '@/components/ui/StarField'
import MeteorRain from '@/components/ui/MeteorRain'

export const metadata: Metadata = {
  title: 'Cosmic Atlas — Explore the Universe',
  description: 'Your premium gateway to the cosmos. Real-time space news, astronomical events, interactive sky maps, constellation explorer, and an AI astronomy assistant.',
  keywords: 'astronomy, space, stars, constellations, NASA, telescope, cosmos, galaxy, nebula',
  openGraph: {
    title: 'Cosmic Atlas — Explore the Universe',
    description: 'Your premium gateway to the cosmos.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StarField />
        <MeteorRain />
        <Navbar />
        <main className="page-wrapper">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
