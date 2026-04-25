'use client'
import { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, Loader2, Star } from 'lucide-react'

// 88 stars for a basic sky map
const SKY_STARS = [
  { name: 'Sirius', ra: 6.75, dec: -16.7, mag: -1.46 },
  { name: 'Canopus', ra: 6.40, dec: -52.7, mag: -0.72 },
  { name: 'Arcturus', ra: 14.26, dec: 19.2, mag: -0.05 },
  { name: 'Vega', ra: 18.62, dec: 38.8, mag: 0.03 },
  { name: 'Capella', ra: 5.28, dec: 46.0, mag: 0.08 },
  { name: 'Rigel', ra: 5.24, dec: -8.2, mag: 0.13 },
  { name: 'Procyon', ra: 7.65, dec: 5.2, mag: 0.34 },
  { name: 'Achernar', ra: 1.63, dec: -57.2, mag: 0.46 },
  { name: 'Betelgeuse', ra: 5.92, dec: 7.4, mag: 0.42 },
  { name: 'Hadar', ra: 14.06, dec: -60.4, mag: 0.61 },
  { name: 'Altair', ra: 19.85, dec: 8.9, mag: 0.76 },
  { name: 'Aldebaran', ra: 4.60, dec: 16.5, mag: 0.85 },
  { name: 'Antares', ra: 16.49, dec: -26.4, mag: 1.06 },
  { name: 'Spica', ra: 13.42, dec: -11.2, mag: 0.97 },
  { name: 'Pollux', ra: 7.76, dec: 28.0, mag: 1.14 },
  { name: 'Fomalhaut', ra: 22.96, dec: -29.6, mag: 1.16 },
  { name: 'Deneb', ra: 20.69, dec: 45.3, mag: 1.25 },
  { name: 'Mimosa', ra: 12.80, dec: -59.7, mag: 1.25 },
  { name: 'Regulus', ra: 10.14, dec: 11.97, mag: 1.35 },
  { name: 'Adhara', ra: 6.98, dec: -28.97, mag: 1.50 },
  { name: 'Castor', ra: 7.58, dec: 31.89, mag: 1.58 },
  { name: 'Gacrux', ra: 12.52, dec: -57.1, mag: 1.59 },
  { name: 'Shaula', ra: 17.56, dec: -37.1, mag: 1.62 },
  { name: 'Bellatrix', ra: 5.42, dec: 6.35, mag: 1.64 },
  { name: 'Elnath', ra: 5.44, dec: 28.61, mag: 1.65 },
  { name: 'Miaplacidus', ra: 9.22, dec: -69.7, mag: 1.67 },
  { name: 'Alnilam', ra: 5.60, dec: -1.2, mag: 1.69 },
  { name: 'Alnitak', ra: 5.68, dec: -1.94, mag: 1.72 },
  { name: 'Mintaka', ra: 5.53, dec: -0.3, mag: 2.23 },
  { name: 'Gamma Vel', ra: 8.16, dec: -47.3, mag: 1.75 },
  { name: 'Alioth', ra: 12.90, dec: 55.96, mag: 1.76 },
  { name: 'Kaus Aust.', ra: 18.40, dec: -34.4, mag: 1.79 },
  { name: 'Mirfak', ra: 3.41, dec: 49.86, mag: 1.79 },
  { name: 'Dubhe', ra: 11.06, dec: 61.75, mag: 1.79 },
  { name: 'Wezen', ra: 7.14, dec: -26.39, mag: 1.82 },
  { name: 'Alkaid', ra: 13.79, dec: 49.31, mag: 1.85 },
  { name: 'Avior', ra: 8.37, dec: -59.51, mag: 1.86 },
  { name: 'Sargas', ra: 17.62, dec: -43.0, mag: 1.86 },
  { name: 'Polaris', ra: 2.53, dec: 89.26, mag: 1.98 },
  { name: 'Menkent', ra: 14.11, dec: -36.37, mag: 2.06 },
]

const PLANETS = [
  { name: 'Jupiter', ra: 11, dec: 5, color: '#f59e0b', size: 6 },
  { name: 'Venus', ra: 4, dec: -10, color: '#fde68a', size: 5 },
  { name: 'Mars', ra: 19, dec: -25, color: '#ef4444', size: 4 },
  { name: 'Saturn', ra: 21, dec: -19, color: '#d97706', size: 5 },
]

function raDecToXY(ra: number, dec: number, lst: number, lat: number, size: number) {
  // Hour angle
  const ha = (lst - ra) * 15 * (Math.PI / 180)
  const decRad = dec * (Math.PI / 180)
  const latRad = lat * (Math.PI / 180)
  // Alt/Az calculation
  const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(ha)
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)))
  const cosAz = (Math.sin(decRad) - Math.sin(alt) * Math.sin(latRad)) / (Math.cos(alt) * Math.cos(latRad) + 0.0001)
  const az = Math.acos(Math.max(-1, Math.min(1, cosAz)))
  const azFinal = Math.sin(ha) > 0 ? 2 * Math.PI - az : az
  const r = Math.cos(alt)
  const cx = size / 2
  const cy = size / 2
  const radius = (size / 2) * 0.88
  return {
    x: cx + radius * r * Math.sin(azFinal),
    y: cy - radius * r * Math.cos(azFinal),
    alt: alt * (180 / Math.PI),
    visible: alt > 0,
  }
}

function getLST(lon: number) {
  const now = new Date()
  const J2000 = 2451545.0
  const JD = 2440587.5 + now.getTime() / 86400000
  const T = (JD - J2000) / 36525
  const GMST = 280.46061837 + 360.98564736629 * (JD - J2000) + 0.000387933 * T * T
  return ((GMST % 360) + lon) / 15
}

const CANVAS_SIZE = 520

export default function SkyTonightPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [lat, setLat] = useState(28.6)    // Delhi default
  const [lon, setLon] = useState(77.2)
  const [locName, setLocName] = useState('New Delhi, India')
  const [geoLoading, setGeoLoading] = useState(false)
  const [hoveredStar, setHoveredStar] = useState<{ name: string; x: number; y: number } | null>(null)

  function detectLocation() {
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLat(pos.coords.latitude)
        setLon(pos.coords.longitude)
        setLocName(`${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°`)
        setGeoLoading(false)
      },
      () => setGeoLoading(false)
    )
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const size = CANVAS_SIZE

    ctx.clearRect(0, 0, size, size)

    // Sky dome background
    const bgGrad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    bgGrad.addColorStop(0, '#0a1628')
    bgGrad.addColorStop(0.7, '#050d1a')
    bgGrad.addColorStop(1, '#020810')
    ctx.fillStyle = bgGrad
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()

    // Altitude rings
    for (let alt = 30; alt <= 90; alt += 30) {
      const r = (size / 2) * 0.88 * Math.cos(alt * Math.PI / 180)
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(99,102,241,0.15)'
      ctx.lineWidth = 0.5
      ctx.stroke()
      ctx.fillStyle = 'rgba(99,102,241,0.5)'
      ctx.font = '9px Outfit, sans-serif'
      ctx.fillText(`${90 - alt}°`, size / 2 + 6, size / 2 - r + 12)
    }

    // Crosshairs (N/S/E/W)
    ctx.strokeStyle = 'rgba(99,102,241,0.2)'
    ctx.lineWidth = 0.5
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(size / 2, 10); ctx.lineTo(size / 2, size - 10); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(10, size / 2); ctx.lineTo(size - 10, size / 2); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = 'rgba(99,102,241,0.7)'
    ctx.font = '11px Space Grotesk, sans-serif'
    ctx.fillText('N', size / 2 - 4, 22)
    ctx.fillText('S', size / 2 - 4, size - 8)
    ctx.fillText('E', size - 18, size / 2 + 4)
    ctx.fillText('W', 8, size / 2 + 4)

    const lst = getLST(lon)

    // Draw stars
    for (const star of SKY_STARS) {
      const pos = raDecToXY(star.ra, star.dec, lst, lat, size)
      if (!pos.visible) continue
      const radius = Math.max(0.8, 2.5 - star.mag * 0.5)
      const alpha = Math.min(1, 0.4 + (3 - star.mag) * 0.2)
      const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 3)
      grad.addColorStop(0, `rgba(255,255,255,${alpha})`)
      grad.addColorStop(0.4, `rgba(200,220,255,${alpha * 0.5})`)
      grad.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius * 3, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${alpha})`
      ctx.fill()
    }

    // Draw planets
    for (const planet of PLANETS) {
      const pos = raDecToXY(planet.ra, planet.dec, lst, lat, size)
      if (!pos.visible) continue
      const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, planet.size * 3)
      glow.addColorStop(0, planet.color)
      glow.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, planet.size * 3, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, planet.size, 0, Math.PI * 2)
      ctx.fillStyle = planet.color
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.font = '10px Outfit, sans-serif'
      ctx.fillText(planet.name, pos.x + 8, pos.y + 4)
    }

    // Dome border
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(99,102,241,0.4)'
    ctx.lineWidth = 2
    ctx.stroke()
  }, [lat, lon])

  function canvasMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = (e.clientX - rect.left) * (CANVAS_SIZE / rect.width)
    const my = (e.clientY - rect.top) * (CANVAS_SIZE / rect.height)
    const lst = getLST(lon)
    for (const star of SKY_STARS) {
      const pos = raDecToXY(star.ra, star.dec, lst, lat, CANVAS_SIZE)
      if (!pos.visible) continue
      if (Math.hypot(mx - pos.x, my - pos.y) < 8) {
        setHoveredStar({ name: star.name, x: e.clientX - rect.left, y: e.clientY - rect.top })
        return
      }
    }
    setHoveredStar(null)
  }

  return (
    <div className="page-section" style={{ paddingTop: '100px' }}>
      <div className="container-cosmic">
        <div className="section-header">
          <div className="section-tag">
            <Star size={12} style={{ display: 'inline', marginRight: 6 }} />
            Interactive Sky Map
          </div>
          <h1 className="section-title">Sky <span className="gradient-text">Tonight</span></h1>
          <p className="section-subtitle">See what's visible from your location right now — calculated in real time.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'start' }}>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Location */}
            <div className="glass" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--accent-cyan)" /> Your Location
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 4, textTransform: 'uppercase' }}>Latitude</label>
                  <input type="number" className="cosmic-input" value={lat} onChange={e => setLat(Number(e.target.value))} min={-90} max={90} step={0.1} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 4, textTransform: 'uppercase' }}>Longitude</label>
                  <input type="number" className="cosmic-input" value={lon} onChange={e => setLon(Number(e.target.value))} min={-180} max={180} step={0.1} />
                </div>
              </div>
              <button
                onClick={detectLocation}
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={geoLoading}
              >
                {geoLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Navigation size={16} />}
                {geoLoading ? 'Detecting...' : 'Use My Location'}
              </button>
              {locName && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.75rem', textAlign: 'center' }}>📍 {locName}</p>}
            </div>

            {/* Legend */}
            <div className="glass" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, marginBottom: '1rem' }}>Legend</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { color: 'rgba(255,255,255,0.9)', label: 'Stars', shape: 'circle' },
                  { color: '#f59e0b', label: 'Jupiter', shape: 'circle' },
                  { color: '#fde68a', label: 'Venus', shape: 'circle' },
                  { color: '#ef4444', label: 'Mars', shape: 'circle' },
                  { color: '#d97706', label: 'Saturn', shape: 'circle' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color, boxShadow: `0 0 8px ${item.color}`, flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.label}</span>
                  </div>
                ))}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1rem', lineHeight: 1.5 }}>
                Stars sized by magnitude. Hover for names. Planets shown at approximate positions.
              </p>
            </div>

            {/* Visible bright stars */}
            <div className="glass" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, marginBottom: '1rem' }}>Brightest Tonight</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {SKY_STARS.slice(0, 8).map(s => {
                  const pos = raDecToXY(s.ra, s.dec, getLST(lon), lat, CANVAS_SIZE)
                  return (
                    <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: pos.visible ? 'var(--text-subtle)' : 'var(--text-muted)', opacity: pos.visible ? 1 : 0.5 }}>
                        ★ {s.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: pos.visible ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 600 }}>
                        {pos.visible ? `${Math.round(pos.alt)}° alt` : 'Below horizon'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sky Map Canvas */}
          <div style={{ position: 'relative' }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="sky-dome"
              style={{ width: Math.min(CANVAS_SIZE, 480), height: Math.min(CANVAS_SIZE, 480), cursor: 'crosshair', display: 'block' }}
              onMouseMove={canvasMouseMove}
              onMouseLeave={() => setHoveredStar(null)}
            />
            {hoveredStar && (
              <div style={{
                position: 'absolute',
                left: hoveredStar.x + 14,
                top: hoveredStar.y - 10,
                background: 'rgba(10,15,30,0.95)',
                border: '1px solid rgba(99,102,241,0.5)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--accent-cyan)',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}>
                ⭐ {hoveredStar.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
