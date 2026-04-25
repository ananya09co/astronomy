'use client'
import { useState, useEffect, useCallback } from 'react'
import { Newspaper, ExternalLink, RefreshCw } from 'lucide-react'
import api from '@/lib/api'

const CATEGORIES = ['all', 'Deep Space', 'Missions', 'Exoplanets', 'Solar System', 'Phenomena', 'Space']

const CATEGORY_COLORS: Record<string, string> = {
  'Deep Space': '#6366f1', 'Missions': '#06b6d4', 'Exoplanets': '#10b981',
  'Phenomena': '#8b5cf6', 'Solar System': '#f59e0b', 'Space': '#94a3b8',
}

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([])
  const [apodItems, setApodItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const loadNews = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const params: Record<string, string> = { limit: '24' }
      if (category !== 'all') params.category = category
      if (search) params.search = search

      const [newsRes, apodRes] = await Promise.allSettled([
        api.getNews(params),
        api.getApod(),
      ])

      if (newsRes.status === 'fulfilled' && newsRes.value.success) {
        setNews(newsRes.value.data || [])
      }
      if (apodRes.status === 'fulfilled' && apodRes.value.success) {
        setApodItems(apodRes.value.data?.filter((a: any) => a.url && !a.url.includes('youtube')) || [])
      }
    } catch {}
    setLoading(false)
    setRefreshing(false)
  }, [category, search])

  useEffect(() => { loadNews() }, [loadNews])

  return (
    <div className="page-section" style={{ paddingTop: '100px' }}>
      <div className="container-cosmic">
        <div className="section-header">
          <div className="section-tag"><Newspaper size={12} style={{ display: 'inline', marginRight: 6 }} />Live Space News</div>
          <h1 className="section-title">Space <span className="gradient-text">News</span></h1>
          <p className="section-subtitle">Real-time articles from NASA, SpaceX, ESA, ISRO, and the world's top space agencies — updated continuously.</p>
        </div>

        {/* Filters + Search */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
          <input
            className="cosmic-input"
            style={{ maxWidth: 300 }}
            placeholder="🔍 Search space news..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadNews()}
          />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-tab ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
          <button
            onClick={() => loadNews(true)}
            disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 100, color: 'var(--accent-indigo)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
          >
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        {/* NASA APOD Gallery Strip */}
        {apodItems.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', padding: '2px 10px', borderRadius: 100, color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>NASA APOD</span>
              Astronomy Pictures of the Day
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {apodItems.map(apod => (
                <div key={apod.id || apod.date} style={{ flex: '0 0 220px', borderRadius: 14, overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
                  <img src={apod.url} alt={apod.title} style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }}
                    onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.95), transparent 50%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.75rem' }}>
                    <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.3 }}>{apod.title}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{apod.date}</p>
                  </div>
                  <a href={apod.hdurl || apod.url} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', inset: 0 }} aria-label={apod.title} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Article */}
        {!loading && news.length > 0 && (
          <div className="glass" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem', borderRadius: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr' }}>
              <div style={{ position: 'relative', overflow: 'hidden', minHeight: 300 }}>
                <img src={news[0].image_url} alt={news[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
                  onError={e => { (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Hubble_ultra_deep_field.jpg/1024px-Hubble_ultra_deep_field.jpg' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, #0a0f1e)' }} />
                <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                  <span style={{ background: 'rgba(6,182,212,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(6,182,212,0.4)', padding: '3px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, color: 'white' }}>
                    🔴 LIVE · {news[0].source}
                  </span>
                </div>
              </div>
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ padding: '3px 12px', borderRadius: 8, background: `${CATEGORY_COLORS[news[0].category] || '#6366f1'}18`, border: `1px solid ${CATEGORY_COLORS[news[0].category] || '#6366f1'}30`, color: CATEGORY_COLORS[news[0].category] || '#818cf8', fontSize: '0.78rem', fontWeight: 600 }}>
                    {news[0].category}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {new Date(news[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.3rem', lineHeight: 1.3, marginBottom: '1rem' }}>{news[0].title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{news[0].summary}</p>
                <a href={news[0].url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                  Read Full Story <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {[...Array(8)].map((_, i) => <div key={i} className="glass shimmer" style={{ height: 320, borderRadius: 16 }} />)}
          </div>
        ) : news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <Newspaper size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No articles found. Try refreshing or changing filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {news.slice(1).map((article: any, i: number) => {
              const color = CATEGORY_COLORS[article.category] || '#6366f1'
              return (
                <div key={article.id || i} className="glass glass-hover" style={{ overflow: 'hidden', borderRadius: 16 }}>
                  <div style={{ position: 'relative', height: 195, overflow: 'hidden' }}>
                    <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      onError={e => { (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Hubble_ultra_deep_field.jpg/800px-Hubble_ultra_deep_field.jpg' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.7), transparent)' }} />
                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 100, background: `${color}30`, border: `1px solid ${color}50`, color, fontSize: '0.72rem', fontWeight: 600, backdropFilter: 'blur(4px)' }}>{article.category}</span>
                    </div>
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>{article.source}</span>
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.5rem' }}>
                      {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.4, marginBottom: '0.75rem' }}>{article.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.summary}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
                      Read More <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Source attribution */}
        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          📡 News sourced live from <a href="https://api.spaceflightnewsapi.net" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Spaceflight News API</a> · APOD from <a href="https://apod.nasa.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>NASA APOD</a>
        </div>
      </div>
    </div>
  )
}
