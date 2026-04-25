'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Telescope } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/star-of-day', label: 'Star of Day' },
  { href: '/news', label: 'News' },
  { href: '/sky-tonight', label: 'Sky Tonight' },
  { href: '/constellations', label: 'Constellations' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/iss', label: '🛸 ISS Live' },
  { href: '/community', label: 'Community' },
  { href: '/chat', label: 'AI Chat' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(2, 6, 23, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div className="container-cosmic" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,102,241,0.5)',
          }}>
            <Telescope size={20} color="white" />
          </div>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '1.2rem',
            background: 'linear-gradient(135deg, #f1f5f9, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Cosmic Atlas
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="hidden-mobile">
          {navLinks.slice(1).map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                fontFamily: 'Space Grotesk, sans-serif',
                color: pathname === link.href ? 'white' : 'var(--text-muted)',
                background: pathname === link.href ? 'rgba(99,102,241,0.2)' : 'transparent',
                border: pathname === link.href ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (pathname !== link.href) {
                  (e.target as HTMLElement).style.color = 'white'
                  ;(e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={e => {
                if (pathname !== link.href) {
                  (e.target as HTMLElement).style.color = 'var(--text-muted)'
                  ;(e.target as HTMLElement).style.background = 'transparent'
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'white',
            padding: '8px',
            cursor: 'pointer',
            display: 'none',
          }}
          className="show-mobile"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          background: 'rgba(10, 15, 30, 0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border-color)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: pathname === link.href ? 'white' : 'var(--text-subtle)',
                background: pathname === link.href ? 'rgba(99,102,241,0.2)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 901px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
