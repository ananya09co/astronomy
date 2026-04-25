import Link from 'next/link'
import { Telescope, MessageCircle, Send, Rss, Mail } from 'lucide-react'

const footerLinks = {
  Explore: [
    { href: '/events', label: 'Celestial Events' },
    { href: '/star-of-day', label: 'Star of the Day' },
    { href: '/sky-tonight', label: 'Sky Tonight' },
    { href: '/constellations', label: 'Constellation Explorer' },
  ],
  Discover: [
    { href: '/news', label: 'Space News' },
    { href: '/gallery', label: 'Astro Gallery' },
    { href: '/community', label: 'Community' },
    { href: '/chat', label: 'AI Assistant' },
  ],
}

export default function Footer() {
  return (
    <footer style={{
      position: 'relative',
      zIndex: 1,
      background: 'rgba(2, 6, 23, 0.9)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)',
      paddingTop: '3rem',
    }}>
      <div className="container-cosmic">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem', paddingBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Telescope size={18} color="white" />
              </div>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #f1f5f9, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Cosmic Atlas
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 280 }}>
              Your premium gateway to the cosmos. Explore the universe with real-time data, stunning imagery, and AI-powered insights.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {[
                { Icon: MessageCircle, href: '#', label: 'X / Twitter' },
                { Icon: Rss, href: '#', label: 'YouTube' },
                { Icon: Send, href: '#', label: 'GitHub' },
                { Icon: Mail, href: '#', label: 'Email' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} style={{
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                {section}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {links.map(link => (
                  <Link key={link.href} href={link.href} style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          paddingBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © 2026 Cosmic Atlas. Built for humanity's curiosity.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Data: NASA · ESA · ISRO · IAU
          </p>
        </div>
      </div>
    </footer>
  )
}
