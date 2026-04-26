'use client'
import { useState, useEffect } from 'react'
import { ImageIcon, Heart, Loader2, RefreshCw, ExternalLink, ZoomIn } from 'lucide-react'
import api from '@/lib/api'

const CATEGORIES = ['all', 'nebula', 'galaxy', 'solar_system', 'telescope']
const CAT_LABELS: Record<string, string> = {
  all: 'All Images', nebula: '🌌 Nebulae', galaxy: '🌀 Galaxies', solar_system: '🪐 Solar System', telescope: '🔭 Telescope'
}

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [lightbox, setLightbox] = useState<any | null>(null)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  async function load(cat: string, pg: number, append = false) {
    if (pg === 1) setLoading(true)
    else setLoadingMore(true)
    try {
      const params: Record<string, string> = { page: String(pg) }
      if (cat !== 'all') params.category = cat
      const res = await api.getGallery(params)
      const newItems = res.data || []
      setItems(prev => append ? [...prev, ...newItems] : newItems)
    } catch {}
    setLoading(false)
    setLoadingMore(false)
  }

  useEffect(() => { setPage(1); load(category, 1) }, [category])

  function loadMore() {
    const next = page + 1
    setPage(next)
    load(category, next, true)
  }

  async function handleLike(id: string) {
    if (liked.has(id)) return
    const newLiked = new Set(liked).add(id)
    setLiked(newLiked)
    setItems(prev => prev.map(item => item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item))
  }

  const heights = [300, 410, 350, 440, 310, 380, 330, 460, 290, 370, 340, 420]

  return (
    <div className="page-section" style={{ paddingTop: '100px' }}>
      <div className="container-cosmic">
        <div className="section-header">
          <div className="section-tag">
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NASA Image Library</span>
          </div>
          <h1 className="section-title">Cosmic <span className="gradient-text">Gallery</span></h1>
          <p className="section-subtitle">Real photographs from NASA's image library — Hubble, James Webb, Chandra, and more. Every image sourced directly from NASA.</p>
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
          {CATEGORIES.map(c => (
            <button key={c} className={`filter-tab ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
              {CAT_LABELS[c]}
            </button>
          ))}
        </div>

        {/* Attribution Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 12, marginBottom: '2rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🛸</span>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>
            All images sourced from the <strong style={{ color: 'var(--text-subtle)' }}>NASA Image and Video Library</strong> (images-api.nasa.gov). Real photographs from space telescopes and missions.
          </p>
        </div>

        {/* Masonry Grid */}
        {loading ? (
          <div className="masonry-grid">
            {[...Array(8)].map((_, i) => <div key={i} className="masonry-item glass shimmer" style={{ height: heights[i % heights.length], borderRadius: 16 }} />)}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <ImageIcon size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No images found. NASA API may be temporarily unavailable.</p>
          </div>
        ) : (
          <>
            <div className="masonry-grid">
              {items.map((item, i) => (
                <div key={`${item.id}-${i}`} className="masonry-item" style={{ position: 'relative' }}>
                  <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', height: heights[i % heights.length] }}>
                    <img
                      src={item.image_url}
                      alt={item.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                      onError={e => { (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Hubble_ultra_deep_field.jpg/800px-Hubble_ultra_deep_field.jpg' }}
                    />
                    {/* Overlay on hover */}
                    <div className="gallery-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.97) 0%, rgba(2,6,23,0.2) 60%, transparent 100%)', opacity: 0, transition: 'opacity 0.3s ease', cursor: 'pointer' }}
                      onClick={() => setLightbox(item)}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget.previousElementSibling as HTMLElement).style.transform = 'scale(1.05)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0'; (e.currentTarget.previousElementSibling as HTMLElement).style.transform = 'scale(1)' }}
                    >
                      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                        <ZoomIn size={20} color="white" />
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem' }}>
                        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem', lineHeight: 1.3 }}>{item.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>{item.source}</p>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <button onClick={e => { e.stopPropagation(); handleLike(item.id) }} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: liked.has(item.id) ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.1)', border: `1px solid ${liked.has(item.id) ? 'rgba(236,72,153,0.4)' : 'rgba(255,255,255,0.2)'}`, borderRadius: 100, color: liked.has(item.id) ? '#ec4899' : 'white', padding: '4px 10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                            <Heart size={12} fill={liked.has(item.id) ? '#ec4899' : 'none'} /> {(item.likes || 0).toLocaleString()}
                          </button>
                          {item.nasa_id && (
                            <a href={`https://images.nasa.gov/details/${item.nasa_id}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-cyan)', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>
                              NASA <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* NASA badge */}
                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', padding: '2px 8px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }}>
                      🛸 {item.source || 'NASA'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button onClick={loadMore} disabled={loadingMore} className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {loadingMore ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={16} />}
                {loadingMore ? 'Loading...' : 'Load More NASA Images'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="modal-overlay" onClick={() => setLightbox(null)}>
          <div className="modal-content" style={{ maxWidth: 1000 }} onClick={e => e.stopPropagation()}>
            <img src={lightbox.hd_url || lightbox.image_url} alt={lightbox.title}
              style={{ width: '100%', maxHeight: '60dvh', objectFit: 'contain', display: 'block', background: '#000', borderTopLeftRadius: 24, borderTopRightRadius: 24 }} />
            <div style={{ padding: '1.5rem' }}>
              <div className="modal-grid">
                <div>
                  <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{lightbox.title}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.7, maxWidth: 700 }}>{lightbox.description || 'Real NASA image from the NASA Image Library.'}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{lightbox.source} · {lightbox.date}</span>
                  {lightbox.nasa_id && (
                    <a href={`https://images.nasa.gov/details/${lightbox.nasa_id}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-cyan)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
                      View on NASA <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
