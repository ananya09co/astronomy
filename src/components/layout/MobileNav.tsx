'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Satellite, Newspaper, Bot, MoreHorizontal } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/iss', icon: Satellite, label: 'ISS' },
  { href: '/news', icon: Newspaper, label: 'News' },
  { href: '/chat', icon: Bot, label: 'AI Chat' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="mobile-nav-container show-mobile-only">
      <div className="mobile-nav-content glass">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className={`mobile-nav-item ${isActive ? 'active' : ''}`}>
              <item.icon size={20} />
              <span>{item.label}</span>
              {isActive && <div className="active-dot" />}
            </Link>
          )
        })}
        <button className="mobile-nav-item" onClick={() => {
           // This will be handled by the top navbar menu or a global state
           const event = new CustomEvent('toggleMobileMenu');
           window.dispatchEvent(event);
        }}>
          <MoreHorizontal size={20} />
          <span>More</span>
        </button>
      </div>

      <style jsx>{`
        .mobile-nav-container {
          position: fixed;
          bottom: calc(20px + env(safe-area-inset-bottom));
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0 20px;
          pointer-events: none;
        }
        .mobile-nav-content {
          pointer-events: auto;
          max-width: 500px;
          margin: 0 auto;
          height: 64px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 10px;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
          background: rgba(2, 6, 23, 0.8) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.65rem;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
          background: none;
          border: none;
          padding: 8px;
          flex: 1;
        }
        .mobile-nav-item.active {
          color: var(--accent-indigo);
        }
        .active-dot {
          position: absolute;
          top: 0;
          width: 4px;
          height: 4px;
          background: var(--accent-indigo);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--accent-indigo);
        }
        
        .show-mobile-only {
          display: none;
        }

        @media (max-width: 768px) {
          .show-mobile-only {
            display: block;
          }
        }
      `}</style>
    </div>
  )
}
