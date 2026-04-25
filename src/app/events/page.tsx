'use client'
import { useState, useEffect, useCallback } from 'react'
import { Calendar, Filter, Bell, X, AlertTriangle, Rocket } from 'lucide-react'
import api from '@/lib/api'

const EVENT_TYPES = ['all', 'meteor_shower', 'eclipse', 'planet']
const TYPE_LABELS: Record<string, string> = { all: 'All Events', meteor_shower: 'Meteor Showers', eclipse: 'Eclipses', planet: 'Planetary Events' }
const TYPE_BADGE_CLASS: Record<string, string> = { meteor_shower: 'badge badge-meteor', eclipse: 'badge badge-eclipse', planet: 'badge badge-planet' }
const MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

type Tab = 'events' | 'asteroids'

export default function EventsPage() {
  const [tab, setTab] = useState<Tab>('events')
  const [events, setEvents] = useState<any[]>([])
  const [asteroids, setAsteroids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [asteroidsLoading, setAsteroidsLoading] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('')
  const [reminderModal, setReminderModal] = useState<any | null>(null)
  const [email, setEmail] = useState('')
  const [reminderSent, setReminderSent] = useState(false)

  const loadEvents = useCallback(async () => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (typeFilter !== 'all') params.type = typeFilter
    if (monthFilter) params.month = monthFilter
    try {
      const r = await api.getEvents(params)
      setEvents(r.data || [])
    } catch { setEvents([]) }
    setLoading(false)
  }, [typeFilter, monthFilter])

  useEffect(() => { loadEvents() }, [loadEvents])

  async function loadAsteroids() {
    if (asteroids.length > 0) return
    setAsteroidsLoading(true)
    try {
      const r = await api.getAsteroids()
      setAsteroids(r.data || [])
    } catch { setAsteroids([]) }
    setAsteroidsLoading(false)
  }

  useEffect(() => { if (tab === 'asteroids') loadAsteroids() }, [tab])

  async function handleReminder(e: React.FormEvent) {
    e.preventDefault()
    if (!reminderModal || !email) return
    await api.setReminder(reminderModal.id, email)
    setReminderSent(true)
    setTimeout(() => { setReminderModal(null); setReminderSent(false); setEmail('') }, 2200)
  }

  return (
    <div className="page-section" style={{ paddingTop: '100px' }}>
      <div className="container-cosmic">
        <div className="section-header">
          <div className="section-tag"><Calendar size={12} style={{ display: 'inline', marginRight: 6 }} />Celestial Calendar</div>
          <h1 className="section-title">Astronomical <span className="gradient-text">Events</span></h1>
          <p className="section-subtitle">Upcoming celestial events calendar + live near-Earth asteroid feed from NASA NeoWs.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <button className={`filter-tab ${tab === 'events' ? 'active' : ''}`} onClick={() => setTab('events')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} /> Event Calendar
          </button>
          <button className={`filter-tab ${tab === 'asteroids' ? 'active' : ''}`} onClick={() => setTab('asteroids')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Rocket size={14} /> 🛸 Live Asteroid Watch
            <span style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', padding: '1px 6px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 700 }}>LIVE</span>
          </button>
        </div>

        {/* ── Event Calendar Tab ─────────────────────────────────────── */}
        {tab === 'events' && (
          <>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
              {EVENT_TYPES.map(t => (
                <button key={t} className={`filter-tab ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>{TYPE_LABELS[t]}</button>
              ))}
              <select className="cosmic-input" style={{ width: 'auto' }} value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
                <option value="">All Months</option>
                {MONTHS.slice(1).map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
              </select>
            </div>
            {loading ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[...Array(4)].map((_, i) => <div key={i} className="glass shimmer" style={{ height: 120, borderRadius: 16 }} />)}
              </div>
            ) : events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <Calendar size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} /><p>No events found.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem', position: 'relative', paddingLeft: '3rem' }}>
                <div className="timeline-line" />
                {events.map((event, i) => (
                  <div key={event.id} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="timeline-dot" style={{ marginTop: '1.5rem', marginLeft: '-1.75rem', flexShrink: 0 }} />
                    <div className="glass glass-hover" style={{ flex: 1, padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '1.05rem' }}>{event.title}</h3>
                            <span className={TYPE_BADGE_CLASS[event.type] || 'badge badge-planet'}>{event.type?.replace('_', ' ')}</span>
                          </div>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>{event.description}</p>
                          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            {[
                              { label: '📅 Date', value: new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                              { label: '🌍 Visibility', value: event.visibility },
                              { label: '⏱ Duration', value: event.duration },
                              { label: '🕐 Peak', value: event.peak_time },
                            ].map(item => (
                              <div key={item.label}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{item.label}</div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => setReminderModal(event)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', color: 'var(--accent-indigo)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, flexShrink: 0 }}>
                          <Bell size={14} /> Remind Me
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Asteroids Tab ──────────────────────────────────────────── */}
        {tab === 'asteroids' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, marginBottom: '2rem' }}>
              <AlertTriangle size={18} color="#ef4444" />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                <strong style={{ color: '#ef4444' }}>NASA NeoWs — Live Data</strong> · Near-Earth Objects passing within 7 days. Data sourced directly from{' '}
                <a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>NASA's NeoWs API</a>.
              </p>
            </div>

            {asteroidsLoading ? (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {[...Array(5)].map((_, i) => <div key={i} className="glass shimmer" style={{ height: 80, borderRadius: 12 }} />)}
              </div>
            ) : asteroids.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <Rocket size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p>NASA NeoWs API currently unavailable. Try again later.</p>
              </div>
            ) : (
              <>
                {/* Summary counts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { label: 'Total NEOs This Week', value: asteroids.length, color: '#06b6d4' },
                    { label: 'Potentially Hazardous', value: asteroids.filter(a => a.is_hazardous).length, color: '#ef4444' },
                    { label: 'Closest Approach', value: asteroids[0] ? `${(parseInt(asteroids[0].distance_km) / 1000).toFixed(0)}K km` : '—', color: '#f59e0b' },
                  ].map(stat => (
                    <div key={stat.label} className="glass" style={{ padding: '1.25rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: stat.color, fontVariantNumeric: 'tabular-nums' }}>{stat.value}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Asteroid list */}
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {/* Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 140px 120px 120px 80px', gap: '1rem', padding: '0.5rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span>Name</span><span>Date</span><span>Distance</span><span>Speed</span><span>Est. Size</span><span>Hazardous</span>
                  </div>
                  {asteroids.map((a, i) => (
                    <div key={a.id} className="glass" style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr 100px 140px 120px 120px 80px', gap: '1rem', alignItems: 'center', borderLeft: a.is_hazardous ? '3px solid #ef4444' : '3px solid transparent' }}>
                      <div>
                        <a href={a.nasa_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-cyan)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}>
                          {a.name}
                        </a>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.date}</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{parseInt(a.distance_km).toLocaleString()} km</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.distance_lunar} lunar dist.</div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums' }}>{parseInt(a.speed_kmh).toLocaleString()} km/h</span>
                      <span style={{ fontSize: '0.82rem' }}>{a.diameter_min}–{a.diameter_max} m</span>
                      <div>
                        <span style={{ padding: '3px 8px', borderRadius: 100, background: a.is_hazardous ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.1)', border: `1px solid ${a.is_hazardous ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.2)'}`, color: a.is_hazardous ? '#ef4444' : '#10b981', fontSize: '0.72rem', fontWeight: 600, display: 'inline-block' }}>
                          {a.is_hazardous ? '⚠ Yes' : '✓ No'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Reminder Modal */}
      {reminderModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setReminderModal(null)}>
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.25rem', marginBottom: '0.25rem' }}>Set a Reminder</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{reminderModal.title}</p>
              </div>
              <button onClick={() => setReminderModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}><X size={22} /></button>
            </div>
            {reminderSent ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
                <p style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Reminder set successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleReminder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Your Email</label>
                  <input type="email" className="cosmic-input" placeholder="astronaut@cosmos.io" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={16} /> Set Reminder</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
