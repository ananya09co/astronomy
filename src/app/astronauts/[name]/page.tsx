'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Rocket, Globe, Award, Calendar, ExternalLink, Loader2 } from 'lucide-react'

export default function AstronautProfilePage() {
  const { name } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const decodedName = decodeURIComponent(String(name))

  useEffect(() => {
    async function fetchBio() {
      try {
        const queryName = decodedName.replace(/ /g, '_')
        const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${queryName}`)
        if (!r.ok) throw new Error('Wiki failed')
        const d = await r.json()
        setData(d)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchBio()
  }, [decodedName])

  if (loading) {
    return (
      <div className="page-section" style={{ paddingTop: '150px', textAlign: 'center' }}>
        <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--accent-cyan)' }} />
        <p style={{ color: 'var(--text-muted)' }}>Retrieving personnel file from mission control...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="page-section" style={{ paddingTop: '150px', textAlign: 'center' }}>
        <div className="container-cosmic">
          <h1 className="section-title">Astronaut Not Found</h1>
          <p className="section-subtitle">We couldn't retrieve the biography for {decodedName}. They might be on a clandestine mission.</p>
          <Link href="/iss" className="btn-primary" style={{ marginTop: '2rem' }}>Back to ISS Tracking</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-section" style={{ paddingTop: '100px' }}>
      <div className="container-cosmic">
        <Link href="/iss" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem' }} className="hover-link">
          <ArrowLeft size={16} /> Back to ISS Tracker
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Profile Image & Quick Stats */}
          <div>
            <div className="glass" style={{ padding: '1rem', borderRadius: 24, marginBottom: '2rem' }}>
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '3/4', background: 'rgba(0,0,0,0.3)' }}>
                {data.thumbnail?.source ? (
                  <img src={data.thumbnail.source} alt={data.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <Users size={64} opacity={0.2} />
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem', background: 'linear-gradient(to top, rgba(2,6,23,0.9), transparent)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} /> ACTIVE NASA
                  </div>
                </div>
              </div>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: 24 }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Rocket size={18} color="var(--accent-cyan)" /> Personal Missions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: Globe, label: 'Nationality', value: 'United States' },
                  { icon: Award, label: 'Role', value: data.description || 'Astronaut' },
                  { icon: Calendar, label: 'Expedition', value: 'Current ISS Crew' },
                ].map(stat => (
                  <div key={stat.label} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <stat.icon size={14} color="var(--text-muted)" />
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>{stat.label}</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="animate-fade-in-up">
            <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>{data.title}</h1>
            <p className="gradient-text" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '2rem' }}>Space Explorer · International Space Station</p>
            
            <div className="glass" style={{ padding: '2.5rem', borderRadius: 24, position: 'relative', overflow: 'hidden' }}>
              {/* Decorative background element */}
              <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
              
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Biography</h2>
              <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-muted)', fontWeight: 400 }}>
                {data.extract_html ? (
                  <div dangerouslySetInnerHTML={{ __html: data.extract_html }} />
                ) : (
                  <p>{data.extract}</p>
                )}
              </div>

              <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Data provided by Wikipedia Mission Records
                </p>
                <a href={data.content_urls?.desktop?.page} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Full Mission File <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="glass" style={{ padding: '1.5rem', borderRadius: 20 }}>
                <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Location</h4>
                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>International Space Station</p>
              </div>
              <div className="glass" style={{ padding: '1.5rem', borderRadius: 20 }}>
                <h4 style={{ color: 'var(--accent-indigo)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Distance from Earth</h4>
                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>~408 Kilometers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
