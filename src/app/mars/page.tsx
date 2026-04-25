import { serverData } from '@/lib/serverData'
import { Camera, Calendar, Cpu, Map, RefreshCcw, Activity, ShieldCheck, Database } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Mars Mission Control — Cosmic Atlas',
  description: 'Live telemetry and mission data from NASA\'s Perseverance rover on the surface of Mars.',
}

export default async function MarsPage() {
  const { data: photos } = await serverData.getMarsRoverPhotos('perseverance')
  const mainPhoto = photos?.[0]

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#020617' }}>
      <div className="container-cosmic">
        
        {/* Dashboard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
          <div>
            <div className="section-tag" style={{ margin: 0, marginBottom: '0.5rem' }}>Mars Mission Command</div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>
              Rover <span className="gradient-text">Perseverance</span>
            </h1>
          </div>
          <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</div>
            <div style={{ color: '#10b981', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} /> ACTIVE ON SURFACE
            </div>
          </div>
        </div>

        {/* Technical Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: Calendar, label: 'Current Sol', value: mainPhoto?.sol || '—', color: '#f59e0b' },
            { icon: Camera, label: 'Active Camera', value: mainPhoto?.camera?.full_name || 'MAZ-Z', color: '#06b6d4' },
            { icon: Map, label: 'Landing Site', value: 'Jezero Crater', color: '#8b5cf6' },
            { icon: Database, label: 'Earth Date', value: mainPhoto?.earth_date || '—', color: '#ec4899' },
          ].map(stat => (
            <div key={stat.label} className="glass" style={{ padding: '1.25rem', borderLeft: `4px solid ${stat.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <stat.icon size={14} color={stat.color} /> {stat.label}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main Feed Visualization */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Main Monitor */}
          <div className="glass" style={{ padding: '4px', overflow: 'hidden', position: 'relative', minHeight: '500px' }}>
            {mainPhoto ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img 
                  src={mainPhoto.img_src} 
                  alt="Mars Surface" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', filter: 'sepia(0.2) contrast(1.1)' }} 
                />
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '12px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ color: '#06b6d4', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Satellite Relay: Mars Reconnaissance Orbiter</div>
                  <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>P-Cam Sequential ID: {mainPhoto.id}</div>
                </div>
                {/* HUD Overlay */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '40px', pointerEvents: 'none', background: 'radial-gradient(circle, transparent 70%, rgba(0,0,0,0.3) 100%)' }}>
                   <div style={{ borderLeft: '1px solid rgba(0,255,100,0.3)', borderTop: '1px solid rgba(0,255,100,0.3)', width: 40, height: 40, position: 'absolute', top: 30, left: 30 }} />
                   <div style={{ borderRight: '1px solid rgba(0,255,100,0.3)', borderTop: '1px solid rgba(0,255,100,0.3)', width: 40, height: 40, position: 'absolute', top: 30, right: 30 }} />
                   <div style={{ borderLeft: '1px solid rgba(0,255,100,0.3)', borderBottom: '1px solid rgba(0,255,100,0.3)', width: 40, height: 40, position: 'absolute', bottom: 30, left: 30 }} />
                   <div style={{ borderRight: '1px solid rgba(0,255,100,0.3)', borderBottom: '1px solid rgba(0,255,100,0.3)', width: 40, height: 40, position: 'absolute', bottom: 30, right: 30 }} />
                </div>
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Relaying data from Jezero Crater...
              </div>
            )}
          </div>

          {/* Side Telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1.25rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} /> SYSTEM DIAGNOSTICS
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Thermal Shield', status: 'Optimal', val: 98 },
                  { label: 'Power Level (MMRTG)', status: 'Steady', val: 92 },
                  { label: 'Network Signal', status: 'High', val: 84 },
                  { label: 'Oxygen Gen (MOXIE)', status: 'Standby', val: 100 },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                      <span style={{ color: 'white', fontWeight: 600 }}>{item.status}</span>
                    </div>
                    <div style={{ height: 4, width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${item.val}%`, background: 'var(--accent-cyan)', borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--accent-violet)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCcw size={16} /> RECENT TELEMETRY
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {photos?.slice(1, 5).map((p: any) => (
                  <div key={p.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <img src={p.img_src} style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {p.id}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{p.camera.name} Signal</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-ghost" style={{ width: '100%', marginTop: '1rem', fontSize: '0.8rem', padding: '8px' }}>
                Fetch Archives
              </button>
            </div>
          </div>
        </div>

        {/* Archive Grid */}
        <section style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <h2 className="section-title">Raw <span className="gradient-text">Mission Feed</span></h2>
            <p className="section-subtitle" style={{ margin: 0 }}>Synchronized telemetry from the surface of Jezero Crater.</p>
          </div>
          <div className="masonry-grid">
            {photos?.slice(5, 17).map((p: any) => (
              <div key={p.id} className="masonry-item glass glass-hover" style={{ padding: '4px' }}>
                <img src={p.img_src} style={{ width: '100%', borderRadius: '12px' }} />
                <div style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sol {p.sol}</span>
                    <span className="badge badge-nebula" style={{ fontSize: '0.6rem' }}>{p.camera.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
