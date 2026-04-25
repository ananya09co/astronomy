import Link from 'next/link'
import { ArrowRight, Calendar, Star, Newspaper, Map, Layers, Image, Users, Bot, Zap, Satellite, Activity, Maximize2 } from 'lucide-react'
import api from '@/lib/api'
import CountdownTimer from '@/components/home/CountdownTimer'
import ApodHero from '@/components/home/ApodHero'
import IssWidget from '@/components/home/IssWidget'

const sectionCards = [
  { href: '/mars', icon: Activity, label: 'Mars Command', desc: 'Live telemetry & raw photos from Perseverance', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { href: '/planetarium', icon: Maximize2, label: 'Orbits', desc: 'Interactive 3D solar system visualizer', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { href: '/events', icon: Calendar, label: 'Celestial Events', desc: 'Meteor showers, eclipses & live asteroid tracker', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { href: '/star-of-day', icon: Star, label: 'Star of the Day', desc: 'Daily featured star with real Hubble imagery', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  { href: '/news', icon: Newspaper, label: 'Space News', desc: 'Live feed from NASA, SpaceX, ESA & more', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { href: '/sky-tonight', icon: Map, label: 'Sky Tonight', desc: 'Real-time star positions for your location', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { href: '/constellations', icon: Layers, label: 'Constellations', desc: '20 constellations with mythology & diagrams', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  { href: '/gallery', icon: Image, label: 'NASA Gallery', desc: 'Real photos from Hubble, Webb & more', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { href: '/chat', icon: Bot, label: 'AI Assistant', desc: 'Ask anything about the cosmos', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { href: '/iss', icon: Satellite, label: 'ISS Tracker', desc: 'Live ISS position & world map tracking', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
]

import { serverData } from '@/lib/serverData'

async function getData() {
  const [eventRes, apodRes] = await Promise.allSettled([
    serverData.getUpcomingEvents(),
    serverData.getTodayApod(),
  ])
  return {
    nextEvent: eventRes.status === 'fulfilled' ? eventRes.value.data?.[0] : null,
    apod: apodRes.status === 'fulfilled' ? apodRes.value.data : null,
  }
}

export default async function HomePage() {
  const { nextEvent, apod } = await getData()

  return (
    <div>
      {/* ── APOD Hero Section ─────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '70px', position: 'relative', overflow: 'hidden' }}>

        {/* Real APOD background image — server-safe, no event handlers */}
        {apod?.url && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: `url(${apod.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.25) saturate(1.2)',
          }} />
        )}

        {/* Nebula gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(135deg, rgba(2,6,23,0.7) 0%, rgba(99,102,241,0.15) 50%, rgba(2,6,23,0.8) 100%)' }} />

        <div className="container-cosmic" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>

          {/* APOD Credit */}
          {apod && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px',
              background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: '100px',
              color: 'var(--accent-cyan)',
              fontSize: '0.78rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}>
              📸 Today's Background: <span style={{ color: 'white' }}>{apod.title}</span> — NASA APOD
            </div>
          )}

          {/* Badge */}
          <div className="section-tag animate-scale-in" style={{ marginBottom: '1.5rem', display: 'block' }}>
            ✦ Live Space Data · NASA APIs · Real-Time
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
            <span className="gradient-text">Explore the Cosmos</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>Like Never Before</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Real-time data from NASA, live ISS tracking, Hubble &amp; Webb imagery, live asteroid monitoring, and space news updated every minute.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/gallery" className="btn-primary">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Image size={18} /> NASA Gallery <ArrowRight size={16} />
              </span>
            </Link>
            <Link href="/iss" className="btn-ghost">
              <Satellite size={16} style={{ marginRight: 6 }} /> Track ISS Live
            </Link>
          </div>

          {/* Countdown */}
          {nextEvent && (
            <div style={{ marginBottom: '3rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Next Celestial Event
              </p>
              <CountdownTimer event={nextEvent} />
            </div>
          )}

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', maxWidth: 700, margin: '0 auto' }}>
            {[
              { value: 'LIVE', label: 'ISS Tracking' },
              { value: 'NASA', label: 'Real Images' },
              { value: 'NeoWs', label: 'Asteroid Watch' },
              { value: '∞', label: 'Stars Visible' },
            ].map(stat => (
              <div key={stat.label} className="glass" style={{ padding: '1.25rem', textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {stat.value}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 2 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll to explore</div>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg, var(--accent-cyan), transparent)' }} />
        </div>
      </section>

      {/* ── ISS Live Widget ───────────────────────────────────────── */}
      <section style={{ padding: '3rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(6,182,212,0.03)', position: 'relative', zIndex: 1 }}>
        <div className="container-cosmic">
          <IssWidget />
        </div>
      </section>

      {/* ── Today's APOD Card ─────────────────────────────────────── */}
      {apod && (
        <section className="page-section" style={{ paddingTop: '4rem' }}>
          <div className="container-cosmic">
            <div className="section-header">
              <div className="section-tag">NASA APOD · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              <h2 className="section-title">Astronomy Picture <span className="gradient-text">of the Day</span></h2>
            </div>
            <ApodHero apod={apod} />
          </div>
        </section>
      )}

      {/* ── Section Cards ─────────────────────────────────────────── */}
      <section className="page-section">
        <div className="container-cosmic">
          <div className="section-header">
            <div className="section-tag">Everything in One Place</div>
            <h2 className="section-title">Your <span className="gradient-text">Cosmic</span> Dashboard</h2>
            <p className="section-subtitle">9 live-data sections powered by NASA APIs, real telescope imagery, and real-time tracking.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {sectionCards.map((card, i) => (
              <Link key={card.href} href={card.href} style={{ textDecoration: 'none', animationDelay: `${i * 0.07}s` }} className="animate-fade-in-up">
                <div className="glass glass-hover" style={{ padding: '1.75rem', height: '100%' }}>
                  <div style={{ width: 48, height: 48, background: card.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: `1px solid ${card.color}30` }}>
                    <card.icon size={22} color={card.color} />
                  </div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{card.label}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>{card.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1.25rem', color: card.color, fontSize: '0.875rem', fontWeight: 600 }}>
                    Explore <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
