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
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
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
                { Icon: MessageCircle, href: 'https://twitter.com', label: 'X / Twitter' },
                { Icon: Rss, href: 'https://youtube.com', label: 'YouTube' },
                { Icon: Send, href: 'https://github.com', label: 'GitHub' },
                { Icon: Mail, href: 'mailto:contact@cosmicatlas.io', label: 'Email' },
              ].map(({ Icon, href, label }) => (
                <a 
                  key={label} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={label} 
                  className="social-icon-footer"
                  style={{
                    width: 38, height: 38,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text-muted)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textDecoration: 'none',
                  }}
                >
                  <Icon size={18} />
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
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '2rem',
          paddingBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              © 2026 Cosmic Atlas. Built for humanity's curiosity.
            </p>
            <p style={{ 
              color: 'var(--accent-cyan)', 
              fontSize: '0.85rem', 
              fontWeight: 600,
              fontFamily: 'Space Grotesk, sans-serif' 
            }}>
              Designed & Developed by Ananya
            </p>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Data: NASA · ESA · ISRO · IAU
          </p>
        </div>
      </div>
    </footer>
  )
}
