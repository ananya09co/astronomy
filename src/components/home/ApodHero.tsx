'use client'
import { ExternalLink } from 'lucide-react'

interface ApodData {
  title: string
  url: string
  hdurl?: string
  explanation: string
  date: string
  copyright?: string
  media_type?: string
}

export default function ApodHero({ apod }: { apod: ApodData }) {
  if (!apod) return null
  const isImage = !apod.media_type || apod.media_type === 'image'

  return (
    <div className="glass" style={{ overflow: 'hidden', borderRadius: 20 }}>
      {/* Container with responsive grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', minHeight: 400 }}>
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 340 }}>
          {isImage ? (
            <img
              src={apod.hdurl || apod.url}
              alt={apod.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <iframe src={apod.url} style={{ width: '100%', height: '100%', border: 'none' }} title="APOD Video" allow="autoplay" />
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, #0a0f1e)' }} />
          {/* NASA label */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)' }}>
            🛸 NASA · APOD
          </div>
        </div>

        {/* Text */}
        <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            {new Date(apod.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.3, marginBottom: '1rem' }}>
            {apod.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {apod.explanation}
          </p>
          {apod.copyright && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1rem' }}>
              © {apod.copyright}
            </p>
          )}
          <a href={apod.hdurl || apod.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
            View Full Resolution <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
