'use client'
import { useState, useEffect } from 'react'
import { Satellite, MapPin, Zap, ArrowUp, Users } from 'lucide-react'
import Link from 'next/link'
import WorldMap from '@/components/ui/WorldMap'

const API_BASE = ''

export default function IssWidget() {
  const [iss, setIss] = useState<any>(null)
  const [crew, setCrew] = useState<any[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchCrew() {
      try {
        const r = await fetch(`${API_BASE}/api/iss/crew`, { cache: 'no-store' })
        const d = await r.json()
        setCrew(d.data?.people || [])
      } catch {}
    }
    fetchCrew()
  }, [])

  useEffect(() => {
    async function fetchIss() {
      try {
        const r = await fetch(`${API_BASE}/api/iss/location`, { cache: 'no-store' })
        const d = await r.json()
        if (d.success) { setIss(d.data); setError(false) }
        else setError(true)
      } catch { setError(true) }
    }
    fetchIss()
    const interval = setInterval(fetchIss, 5000) 
    return () => clearInterval(interval)
  }, [])

  if (error) return null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }} className="iss-widget-responsive">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%', background: '#10b981',
            boxShadow: '0 0 8px #10b981',
            animation: 'pulse-glow 1.5s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--accent-cyan)' }}>
            ISS — Live Tracking
          </span>
          <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '2px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700 }}>
            LIVE
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
          {[
            {
              icon: MapPin, label: 'Position', color: '#06b6d4',
              value: iss ? `${parseFloat(iss.latitude).toFixed(2)}°, ${parseFloat(iss.longitude).toFixed(2)}°` : '—',
              sub: iss ? (parseFloat(iss.latitude) > 0 ? 'N' : 'S') + ' Hemisphere' : 'Fetching...',
            },
            {
              icon: ArrowUp, label: 'Altitude', color: '#8b5cf6',
              value: iss ? `${iss.altitude_km} km` : '—',
              sub: 'Above Earth',
            },
            {
              icon: Zap, label: 'Velocity', color: '#f59e0b',
              value: iss ? `${Number(iss.velocity_kmh).toLocaleString()} km/h` : '—',
              sub: '~7.66 km/s',
            },
            {
              icon: Users, label: 'Crew Aboard', color: '#10b981',
              value: crew.length > 0 ? `${crew.length} people` : '—',
              sub: crew[0]?.name || 'Loading...',
            },
          ].map(item => (
            <div key={item.label} className="glass" style={{ padding: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${item.color}15`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <item.icon size={14} color={item.color} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.1rem' }}>{item.label}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {crew.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Current:</span>
            {crew.slice(0, 3).map(p => (
              <Link key={p.name} href={`/astronauts/${p.name}`} style={{ textDecoration: 'none' }}>
                <span className="cosmic-badge-link" style={{ padding: '2px 8px', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 100, fontSize: '0.7rem', color: 'var(--accent-cyan)', cursor: 'pointer' }}>
                  {p.name}
                </span>
              </Link>
            ))}
            {crew.length > 3 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{crew.length-3} more</span>}
          </div>
        )}
      </div>

      <div style={{ height: '180px', width: '100%', position: 'relative' }}>
         {iss && <WorldMap lat={iss.latitude} lng={iss.longitude} />}
         <Link href="/iss" style={{ position: 'absolute', bottom: 10, right: 10, fontSize: '0.65rem', color: 'var(--accent-cyan)', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: 100, border: '1px solid var(--accent-cyan)', opacity: 0.8 }}>
            Enlarge Map
         </Link>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .iss-widget-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
