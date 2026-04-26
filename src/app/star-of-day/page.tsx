'use client'
import { useState, useEffect } from 'react'
import { Thermometer, Ruler, MapPin, Star, Zap, ExternalLink, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import DailyRefreshTimer from '@/components/ui/DailyRefreshTimer'

export default function StarOfDayPage() {
  const [star, setStar] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const json = await api.getStarOfDay()
        if (json.success) setStar(json.data)
      } catch (err) {
        console.error('Failed to fetch star of day:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="page-section" style={{ paddingTop: '150px', textAlign: 'center' }}>
        <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--accent-cyan)' }} />
        <p style={{ color: 'var(--text-muted)' }}>Consulting the star charts...</p>
      </div>
    )
  }

  if (!star) {
    return (
      <div className="page-section" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Could not load star data. Please ensure the backend is running.</p>
      </div>
    )
  }

  const stats = [
    { icon: Thermometer, label: 'Surface Temperature', value: star.temperature, color: '#f59e0b' },
    { icon: Ruler, label: 'Radius vs Sun', value: star.radius, color: '#06b6d4' },
    { icon: MapPin, label: 'Distance from Earth', value: star.distance, color: '#8b5cf6' },
    { icon: Star, label: 'Apparent Magnitude', value: String(star.magnitude), color: '#ec4899' },
    { icon: Zap, label: 'Spectral Type', value: star.type, color: '#10b981' },
    { icon: MapPin, label: 'Constellation', value: star.constellation, color: '#f59e0b' },
  ]

  const mainImage = star.real_image || (star.nasa_images?.[0]?.url) || null

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '60dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Real star image background */}
        {mainImage ? (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${mainImage})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.22) saturate(1.5)' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.15), transparent 70%)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, #020617)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '5rem 1rem 3rem' }}>
          {/* Animated star glow */}
          <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, #fff7ed, #f59e0b, #dc2626)', margin: '0 auto 2rem', boxShadow: '0 0 80px rgba(245,158,11,0.7), 0 0 160px rgba(245,158,11,0.35)', animation: 'pulse-glow 3s ease-in-out infinite' }} />
          <div className="section-tag" style={{ display: 'inline-block', marginBottom: '1rem' }}>⭐ Star of the Day</div>
          <div style={{ marginBottom: '1.5rem' }}><DailyRefreshTimer /></div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
            <span className="gradient-text-warm">{star.name}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{star.type} · {star.constellation}</p>
        </div>
      </section>

      <div className="container-cosmic" style={{ paddingBottom: '5rem' }}>

        {/* Real Image (Hubble/ESO) */}
        {mainImage && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', padding: '2px 10px', borderRadius: 100, color: 'var(--accent-cyan)', fontSize: '0.72rem' }}>REAL IMAGE</span>
              Hubble / ESO Imagery
            </h2>
            <div className="star-images-grid">
              <div className="glass" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
                <img src={mainImage} alt={`${star.name} — actual telescope image`}
                  style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
                  onError={() => {}} />
                <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Real telescope image of {star.name}</p>
                </div>
              </div>
              {star.nasa_images?.slice(1, 3).map((img: any) => (
                <div key={img.url} className="glass" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
                  <img src={img.url} alt={img.title || star.name} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }} />
                  <div style={{ padding: '0.6rem 0.75rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', lineHeight: 1.4 }}>{img.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="glass" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '3px solid var(--accent-cyan)' }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-subtle)' }}>{star.description}</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {stats.map(s => (
            <div key={s.label} className="glass" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Fun Fact */}
        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '2rem' }}>💡</div>
            <div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--accent-cyan)' }}>Fascinating Fact</h3>
              <p style={{ color: 'var(--text-subtle)', lineHeight: 1.8, fontSize: '1rem' }}>{star.fun_fact}</p>
            </div>
          </div>
        </div>

        {/* NASA Search Link */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <a
            href={`https://images.nasa.gov/search-results?q=${encodeURIComponent(star.name)}&keywords=star,space`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}
          >
            <ExternalLink size={14} /> Search {star.name} on NASA Image Library
          </a>
        </div>
      </div>
      <style jsx>{`
        .star-images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }
        @media (min-width: 1024px) {
          .star-images-grid {
             grid-template-columns: ${star.nasa_images?.length > 1 ? '2fr 1fr 1fr' : '1fr'};
          }
        }
      `}</style>
    </div>
  )
}
