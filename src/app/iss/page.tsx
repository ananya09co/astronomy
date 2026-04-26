'use client'
import { useState, useEffect } from 'react'
import { Satellite, MapPin, Zap, ArrowUp, Users, RefreshCw, Globe } from 'lucide-react'
import api from '@/lib/api'
import Link from 'next/link'
import WorldMap from '@/components/ui/WorldMap'

export default function IssTrackerPage() {
  const [iss, setIss] = useState<any>(null)
  const [crew, setCrew] = useState<any[]>([])
  const [trail, setTrail] = useState<{ lat: number; lng: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    api.getIssCrew().then(d => setCrew(d.data?.people || [])).catch(() => {})
  }, [])

  useEffect(() => {
    async function fetchIss() {
      try {
        const d = await api.getIssLocation()
        if (d.success) {
          setIss(d.data)
          setLastUpdate(new Date())
          // Re-map lon to lng for our WorldMap component
          setTrail(prev => [...prev.slice(-100), { lat: d.data.latitude, lng: d.data.longitude }])
          setLoading(false)
        }
      } catch {}
    }
    fetchIss()
    const id = setInterval(fetchIss, 5000)
    return () => clearInterval(id)
  }, [])

  const stats = iss ? [
    { icon: MapPin, label: 'Latitude', value: `${parseFloat(iss.latitude).toFixed(4)}°`, color: '#06b6d4' },
    { icon: Globe, label: 'Longitude', value: `${parseFloat(iss.longitude).toFixed(4)}°`, color: '#8b5cf6' },
    { icon: ArrowUp, label: 'Altitude', value: `${iss.altitude_km} km`, color: '#f59e0b' },
    { icon: Zap, label: 'Speed', value: `${Number(iss.velocity_kmh).toLocaleString()} km/h`, color: '#10b981' },
    { icon: Globe, label: 'Footprint', value: iss.footprint_km ? `${iss.footprint_km} km` : '—', color: '#ec4899' },
    { icon: Satellite, label: 'Visibility', value: iss.visibility || '—', color: '#6366f1' },
  ] : []

  return (
    <div className="page-section" style={{ paddingTop: '100px' }}>
      <div className="container-cosmic">
        <div className="section-header">
          <div className="section-tag">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', marginRight: 8, boxShadow: '0 0 8px #10b981', animation: 'pulse-glow 1.5s infinite' }} />
            Real-Time · Updates Every 5 Seconds
          </div>
          <h1 className="section-title">ISS Live <span className="gradient-text">Tracker</span></h1>
          <p className="section-subtitle">Track the International Space Station in real time — position, altitude, velocity, and crew.</p>
        </div>

        {/* World Map Component */}
        <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: 24, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', padding: '0 0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse-glow 1s infinite' }} />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.9rem' }}>Global Telemetry Map</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <RefreshCw size={14} />
              {lastUpdate ? `RE-LINK: ${lastUpdate.toLocaleTimeString()}` : 'ESTABLISHING...'}
            </div>
          </div>
          
          <div style={{ height: '400px', width: '100%' }}>
            {iss ? (
              <WorldMap lat={iss.latitude} lng={iss.longitude} pathTrace={trail} />
            ) : (
              <div className="shimmer" style={{ height: '100%', borderRadius: 16 }} />
            )}
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', padding: '1rem 0.5rem 0', flexWrap: 'wrap' }}>
            {[
              { color: 'var(--accent-cyan)', label: 'ISS POSITION' },
              { color: 'var(--accent-indigo)', label: 'GROUND TRACK' },
              { color: 'rgba(255,255,255,0.05)', label: 'TERRESTRIAL BOUNDARIES' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '2px', background: l.color }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Main Content Grid (Stats + Crew) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
              {loading ? (
                [...Array(6)].map((_, i) => <div key={i} className="glass shimmer" style={{ height: 90, borderRadius: 12 }} />)
              ) : (
                stats.map(s => (
                  <div key={s.label} className="glass" style={{ padding: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}15`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <s.icon size={16} color={s.color} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: 2 }}>{s.label}</div>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

          {/* Crew Card */}
          <div className="glass" style={{ padding: '1.5rem', minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Users size={16} color="var(--accent-cyan)" />
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.95rem' }}>Current ISS Crew</h3>
            </div>
            {crew.length === 0 ? (
              <div className="shimmer" style={{ height: 120, borderRadius: 8 }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {crew.map((person, i) => (
                  <Link key={person.name} href={`/astronauts/${person.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: '10px', transition: 'background 0.2s' }} className="glass-hover">
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, hsl(${i * 60}, 70%, 50%), hsl(${i * 60 + 30}, 80%, 60%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>
                        {person.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{person.name}</div>
                        <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>👨‍🚀 ISS · View Profile</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 10 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.6 }}>
                The ISS orbits Earth every <strong style={{ color: 'white' }}>~92 minutes</strong> at <strong style={{ color: 'white' }}>~28,000 km/h</strong> — completing 16 sunrises per day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}

// Simplified continent rendering using pre-computed bezier points
function drawContinents(ctx: CanvasRenderingContext2D, W: number, H: number) {
  function p(lon: number, lat: number) { return [(lon + 180) / 360 * W, (90 - lat) / 180 * H] as [number, number] }

  ctx.fillStyle = 'rgba(30, 58, 95, 0.6)'
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)'
  ctx.lineWidth = 0.8

  // North America
  const na = [[p(-168,72),p(-136,60),p(-128,54),p(-122,48),p(-117,32),p(-97,26),p(-90,21),p(-85,16),p(-77,7),p(-78,9),p(-85,10),p(-83,22),p(-90,16),p(-92,20),p(-97,26),p(-105,20),p(-110,24),p(-112,29),p(-117,32),p(-120,39),p(-124,48),p(-130,54),p(-134,58),p(-162,60),p(-168,66),p(-168,72)]]
  drawShape(ctx, na[0])

  // South America
  const sa = [p(-73,-55),p(-70,-18),p(-68,-10),p(-60,-5),p(-50,-1),p(-35,-5),p(-35,-10),p(-39,-16),p(-41,-22),p(-43,-23),p(-50,-30),p(-53,-34),p(-55,-34),p(-57,-38),p(-63,-42),p(-65,-46),p(-67,-55),p(-68,-55),p(-73,-55)]
  drawShape(ctx, sa)

  // Europe
  const eu = [p(-10,36),p(0,36),p(10,38),p(16,42),p(18,40),p(26,38),p(36,38),p(28,46),p(26,50),p(20,54),p(12,56),p(8,58),p(0,60),p(-8,56),p(-8,44),p(-10,36)]
  drawShape(ctx, eu)

  // Africa
  const af = [p(-18,16),p(-16,10),p(-14,5),p(-5,5),p(0,5),p(10,5),p(16,0),p(20,-10),p(25,-20),p(26,-30),p(18,-34),p(14,-30),p(12,-20),p(10,-8),p(6,4),p(10,8),p(16,12),p(20,16),p(24,22),p(30,22),p(36,18),p(42,12),p(44,8),p(32,4),p(28,0),p(20,-5),p(14,-5),p(10,-5),p(14,-10),p(16,-16),p(14,-22),p(18,-26),p(20,-30),p(18,-34),p(12,-30),p(10,-24),p(8,-16),p(4,-8),p(0,-4),p(-4,0),p(-8,4),p(-14,10),p(-18,16)]
  drawShape(ctx, af)

  // Asia
  const as = [p(36,38),p(48,38),p(58,22),p(66,22),p(72,22),p(80,10),p(100,5),p(110,5),p(122,4),p(124,8),p(120,22),p(122,30),p(120,40),p(126,40),p(130,44),p(138,36),p(140,38),p(144,44),p(136,54),p(130,58),p(110,54),p(100,54),p(90,54),p(80,54),p(70,58),p(60,66),p(50,70),p(40,72),p(30,70),p(20,68),p(20,62),p(24,60),p(28,60),p(36,58),p(40,54),p(50,50),p(58,44),p(60,40),p(56,36),p(50,36),p(44,38),p(36,38)]
  drawShape(ctx, as)

  // Australia
  const au = [p(114,-22),p(118,-20),p(124,-16),p(130,-12),p(136,-12),p(140,-16),p(146,-18),p(150,-22),p(154,-26),p(154,-30),p(150,-34),p(144,-38),p(138,-36),p(134,-32),p(130,-32),p(124,-34),p(120,-34),p(116,-34),p(114,-28),p(114,-22)]
  drawShape(ctx, au)

  // Greenland
  const gr = [p(-46,84),p(-30,82),p(-20,76),p(-22,72),p(-32,68),p(-42,68),p(-52,70),p(-54,78),p(-46,84)]
  drawShape(ctx, gr)
}

function drawShape(ctx: CanvasRenderingContext2D, points: [number, number][]) {
  if (points.length < 2) return
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1])
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}
