'use client'
import { useState, useEffect } from 'react'
import { Users, Upload, Heart, MapPin, Trophy, X, Camera } from 'lucide-react'
import api from '@/lib/api'

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [form, setForm] = useState({ username: '', title: '', description: '', image_url: '', location: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getCommunity()
        setPosts(res.data || [])
      } catch { setPosts([]) }
      setLoading(false)
    }
    load()
  }, [])

  async function handleLike(id: number, e: React.MouseEvent) {
    e.stopPropagation()
    if (liked.has(id)) return
    setLiked(prev => new Set(prev).add(id))
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.submitPhoto(form)
      setSubmitted(true)
      setTimeout(() => {
        setUploadOpen(false)
        setSubmitted(false)
        setForm({ username: '', title: '', description: '', image_url: '', location: '' })
      }, 2500)
    } catch {}
    setSubmitting(false)
  }

  const photoOfWeek = posts.find(p => p.is_photo_of_week === 1)
  const others = posts.filter(p => !p.is_photo_of_week)

  return (
    <div className="page-section" style={{ paddingTop: '100px' }}>
      <div className="container-cosmic">
        <div className="section-header">
          <div className="section-tag">
            <Users size={12} style={{ display: 'inline', marginRight: 6 }} />
            Astrophotography Community
          </div>
          <h1 className="section-title">Community <span className="gradient-text">Showcase</span></h1>
          <p className="section-subtitle">Share your astrophotography with the world. Every clear night is a story waiting to be told.</p>
        </div>

        {/* Upload Button */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <button onClick={() => setUploadOpen(true)} className="btn-primary">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={18} /> Share Your Photo
            </span>
          </button>
        </div>

        {/* Photo of the Week */}
        {photoOfWeek && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Trophy size={20} color="#f59e0b" />
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>
                Photo of the Week
              </h2>
              <span className="badge badge-solar">⭐ Featured</span>
            </div>
            <div className="glass" style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: '1.2fr 1fr' }}>
              <div style={{ position: 'relative', minHeight: 380, overflow: 'hidden' }}>
                <img
                  src={photoOfWeek.image_url}
                  alt={photoOfWeek.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, #0a0f1e)' }} />
              </div>
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                    {photoOfWeek.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{photoOfWeek.username}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{photoOfWeek.uploaded_at}</div>
                  </div>
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.4rem', lineHeight: 1.3, marginBottom: '1rem' }}>
                  {photoOfWeek.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  {photoOfWeek.description}
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ec4899' }}>
                    <Heart size={16} fill="#ec4899" /> {photoOfWeek.likes} likes
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <MapPin size={14} /> {photoOfWeek.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Community Grid */}
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem' }}>
          Recent Submissions
        </h2>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[...Array(4)].map((_, i) => <div key={i} className="glass shimmer" style={{ height: 340, borderRadius: 16 }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {others.map((post, i) => (
              <div key={post.id} className="glass glass-hover" style={{ overflow: 'hidden', animationDelay: `${i * 0.08}s` }} >
                <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={post.image_url}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800' }}
                  />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                      {post.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{post.username}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={10} /> {post.location}
                      </div>
                    </div>
                  </div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{post.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.description}</p>
                  <button onClick={e => handleLike(post.id, e)} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: liked.has(post.id) ? '#ec4899' : 'var(--text-muted)',
                    fontSize: '0.875rem', fontWeight: 600, padding: 0,
                  }}>
                    <Heart size={14} fill={liked.has(post.id) ? '#ec4899' : 'none'} /> {post.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setUploadOpen(false)}>
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>Share Your Photo</h2>
              <button onClick={() => setUploadOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color: 'var(--accent-cyan)' }}>Photo Submitted!</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Thank you for sharing with the community.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'username', label: 'Your Username *', placeholder: 'StargazerKiran', required: true },
                  { key: 'title', label: 'Photo Title *', placeholder: 'The Milky Way over the Himalayas', required: true },
                  { key: 'image_url', label: 'Image URL', placeholder: 'https://...' },
                  { key: 'location', label: 'Location', placeholder: 'Ladakh, India' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{field.label}</label>
                    <input
                      type="text"
                      className="cosmic-input"
                      placeholder={field.placeholder}
                      value={(form as any)[field.key]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      required={field.required}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Description</label>
                  <textarea
                    className="cosmic-input"
                    placeholder="Describe your shot, gear used, settings..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: 'flex-start' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Upload size={16} /> {submitting ? 'Submitting...' : 'Submit Photo'}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
