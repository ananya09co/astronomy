'use client'
import { useState, useEffect } from 'react'
import { Layers, X, Globe, Star, Calendar, ChevronRight, Heart } from 'lucide-react'
import api from '@/lib/api'
import { useUserSession } from '@/hooks/useUserSession'

const HEMISPHERES = ['all', 'northern', 'southern']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const CONSTELLATION_ICONS: Record<string, string> = {
  Orion: '🏹', 'Ursa Major': '🐻', Scorpius: '🦂', Cassiopeia: '👑',
  Leo: '🦁', Gemini: '♊', Cygnus: '🦢', Virgo: '🌾', Perseus: '⚔️',
  Aquila: '🦅', Lyra: '🎵', Andromeda: '⛓️', Taurus: '🐂', Sagittarius: '🏹',
  'Canis Major': '🐕', Pegasus: '🐴', Hercules: '💪', Aquarius: '💧',
  Centaurus: '🐎', Draco: '🐉',
}

export default function ConstellationsPage() {
  const userId = useUserSession()
  const currentMonth = MONTHS[new Date().getMonth()]
  const [constellations, setConstellations] = useState<any[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [hemisphere, setHemisphere] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selected, setSelected] = useState<any | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const params: Record<string, string> = {}
        if (hemisphere !== 'all') params.hemisphere = hemisphere
        if (selectedMonth) params.month = selectedMonth
        const res = await api.getConstellations(params)
        setConstellations(res.data || [])

        // Load favorites if user session is active
        if (userId) {
          const favRes = await api.getFavorites(userId)
          if (favRes.success) setFavorites(favRes.data || [])
        }
      } catch { setConstellations([]) }
      setLoading(false)
    }
    load()
  }, [hemisphere, selectedMonth, userId])

  const handleToggleFavorite = async (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation()
    if (!userId) return

    const isFav = favorites.includes(itemId)
    try {
      // Optimistic UI update
      setFavorites(prev => isFav ? prev.filter(id => id !== itemId) : [...prev, itemId])
      await api.toggleFavorite(userId, itemId, !isFav)
    } catch (err) {
      // Revert on error
      setFavorites(prev => isFav ? [...prev, itemId] : prev.filter(id => id !== itemId))
      console.error('Failed to toggle favorite:', err)
    }
  }

  const filtered = constellations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mythology.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-section" style={{ paddingTop: '100px' }}>
      <div className="container-cosmic">
        <div className="section-header">
          <div className="section-tag">
            <Layers size={12} style={{ display: 'inline', marginRight: 6 }} />
            Star Patterns
          </div>
          <h1 className="section-title">Constellation <span className="gradient-text">Explorer</span></h1>
          <p className="section-subtitle">Discover 20 iconic constellations — their mythology, major stars, and best viewing times.</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <input
            className="cosmic-input"
            style={{ maxWidth: 280 }}
            placeholder="🔍 Search constellations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {HEMISPHERES.map(h => (
            <button key={h} className={`filter-tab ${hemisphere === h ? 'active' : ''}`} onClick={() => setHemisphere(h)}>
              {h === 'all' ? 'Both Hemispheres' : h === 'northern' ? '🌐 Northern' : '🌏 Southern'}
            </button>
          ))}
          <select className="cosmic-input" style={{ width: 'auto' }} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            <option value="">Full Year View</option>
            {MONTHS.map(m => <option key={m} value={m}>{m}{m === currentMonth ? ' (Current)' : ''}</option>)}
          </select>
          {selectedMonth !== currentMonth && (
             <button className="btn-ghost" style={{ padding: '8px 16px' }} onClick={() => setSelectedMonth(currentMonth)}>
               ✨ Visible Tonight
             </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {[...Array(12)].map((_, i) => <div key={i} className="glass shimmer" style={{ height: 200, borderRadius: 16 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <Layers size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No constellations found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {filtered.map((c, i) => (
              <div
                key={c.id}
                className="glass glass-hover animate-fade-in-up"
                style={{ padding: '1.5rem', cursor: 'pointer', animationDelay: `${i * 0.05}s` }}
                onClick={() => setSelected(c)}
              >
                {/* SVG Preview */}
                <div style={{ width: '100%', height: 100, marginBottom: '1rem', position: 'relative' }}>
                  <svg viewBox="0 0 120 120" width="100%" height="100%" className="constellation-svg">
                    <path d={c.svg_path} />
                    {c.svg_path.match(/[LM](\d+),(\d+)/g)?.map((pt: string, i: number) => {
                      const [x, y] = pt.slice(1).split(',').map(Number)
                      return <circle key={i} cx={x} cy={y} r="3" />
                    })}
                  </svg>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleToggleFavorite(e, c.id)}
                    style={{
                      position: 'absolute', top: 0, right: 0,
                      background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: 8,
                      width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.2s', zIndex: 5,
                      color: favorites.includes(c.id) ? '#ef4444' : 'rgba(255,255,255,0.4)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
                  >
                    <Heart size={16} fill={favorites.includes(c.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{CONSTELLATION_ICONS[c.name] || '✨'}</span>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '1rem' }}>{c.name}</h3>
                  {c.best_month?.includes(currentMonth) && (
                    <span className="badge-meteor" style={{ padding: '1px 6px', fontSize: '0.6rem', borderRadius: 4 }}>VISIBLE NOW</span>
                  )}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  Brightest: {c.brightest_star} · Best: {c.best_month}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-indigo)', fontSize: '0.8rem', fontWeight: 600 }}>
                  View Details <ChevronRight size={12} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal-content" style={{ padding: '2rem', maxWidth: 760 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '2rem' }}>{CONSTELLATION_ICONS[selected.name] || '✨'}</span>
                  <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.75rem', fontWeight: 700 }}>{selected.name}</h2>
                  <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>({selected.abbreviation})</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-planet">{selected.hemisphere}</span>
                  <span className="badge badge-meteor">Best: {selected.best_month}</span>
                  <span className="badge badge-eclipse">{selected.stars_count} main stars</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                <X size={22} />
              </button>
            </div>

            <div className="modal-grid">
              {/* SVG */}
              <div style={{ background: 'rgba(99,102,241,0.05)', borderRadius: 12, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 120 120" width="200" height="200" className="constellation-svg">
                  <path d={selected.svg_path} />
                  {selected.svg_path.match(/[LM](\d+),(\d+)/g)?.map((pt: string, i: number) => {
                    const [x, y] = pt.slice(1).split(',').map(Number)
                    return <circle key={i} cx={x} cy={y} r="4" />
                  })}
                </svg>
              </div>

              {/* Info */}
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>
                    <Globe size={14} /> <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>About</span>
                  </div>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem', lineHeight: 1.7 }}>{selected.description}</p>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem', color: 'var(--accent-violet)' }}>
                    <Star size={14} /> <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Mythology</span>
                  </div>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem', lineHeight: 1.7 }}>{selected.mythology}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { label: 'Area', value: `${selected.area_sq_deg} sq°` },
                    { label: 'Brightest Star', value: selected.brightest_star },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '0.75rem' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fun Fact */}
            <div style={{ marginTop: '1.5rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '1rem' }}>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                💡 <strong style={{ color: 'var(--accent-cyan)' }}>Did you know?</strong> {selected.fun_fact}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
