'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Info, Play, Pause, FastForward, Rewind, Maximize2 } from 'lucide-react'

const PLANETS = [
  { name: 'Mercury', color: '#9ca3af', radius: 4, orbit: 60, speed: 0.04, desc: 'Smallest and closest planet to the Sun.' },
  { name: 'Venus', color: '#fbbf24', radius: 7, orbit: 90, speed: 0.015, desc: 'Hottest planet with a thick toxic atmosphere.' },
  { name: 'Earth', color: '#3b82f6', radius: 7.5, orbit: 130, speed: 0.01, desc: 'Our home, the only known planet with life.' },
  { name: 'Mars', color: '#ef4444', radius: 5, orbit: 170, speed: 0.008, desc: 'The Red Planet, home to Olympus Mons.' },
  { name: 'Jupiter', color: '#f97316', radius: 18, orbit: 230, speed: 0.004, desc: 'Largest planet, a gas giant with the Great Red Spot.' },
  { name: 'Saturn', color: '#eab308', radius: 15, orbit: 300, speed: 0.002, desc: 'Famous for its spectacular ring system.' },
  { name: 'Uranus', color: '#22d3ee', radius: 10, orbit: 360, speed: 0.001, desc: 'An ice giant that orbits on its side.' },
  { name: 'Neptune', color: '#6366f1', radius: 10, orbit: 420, speed: 0.0008, desc: 'Windiest planet in the solar system.' },
]

export default function PlanetariumPage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selected, setSelected] = useState<any>(null)
  const [timeScale, setTimeScale] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const angles = useRef(PLANETS.map(() => Math.random() * Math.PI * 2))

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    const width = 1000
    const height = 1000
    svg.selectAll('*').remove()

    const g = svg.append('g').attr('transform', `translate(${width/2}, ${height/2})`)

    // Sun
    const sunGradient = svg.append('defs')
      .append('radialGradient')
      .attr('id', 'sun-gradient')
    sunGradient.append('stop').attr('offset', '0%').attr('stop-color', '#fbbf24')
    sunGradient.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b')

    g.append('circle')
      .attr('r', 35)
      .attr('fill', 'url(#sun-gradient)')
      .style('filter', 'drop-shadow(0 0 20px #f59e0b)')

    // Orbits
    g.selectAll('.orbit')
      .data(PLANETS)
      .enter()
      .append('circle')
      .attr('class', 'orbit')
      .attr('r', d => d.orbit)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.08)')
      .attr('stroke-width', 1)

    // Planets
    const planets = g.selectAll('.planet-group')
      .data(PLANETS)
      .enter()
      .append('g')
      .attr('class', 'planet-group')
      .style('cursor', 'pointer')
      .on('mouseenter', (e, d) => setSelected(d))

    planets.append('circle')
      .attr('class', 'planet')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .style('filter', d => `drop-shadow(0 0 8px ${d.color}80)`)

    // Animation Loop
    let timer = d3.timer(() => {
      if (isPaused) return
      
      planets.attr('transform', (d, i) => {
        angles.current[i] += d.speed * timeScale
        const x = d.orbit * Math.cos(angles.current[i])
        const y = d.orbit * Math.sin(angles.current[i])
        return `translate(${x}, ${y})`
      })
    })

    return () => timer.stop()
  }, [timeScale, isPaused])

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#020617', overflow: 'hidden', position: 'relative' }}>
      
      {/* Side Info Panel */}
      <div className="planetarium-ui">
        <div className="section-tag">Interactive Planetarium</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Cosmic <span className="gradient-text">Orbits</span></h1>
        
        {selected ? (
          <div className="glass animate-scale-in" style={{ padding: '1.5rem', borderLeft: `4px solid ${selected.color}` }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: selected.color }}>{selected.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{selected.desc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <div className="glass" style={{ padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orbit Radius</div>
                  <div style={{ fontWeight: 700 }}>{selected.orbit} Relative</div>
               </div>
               <div className="glass" style={{ padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Velocity</div>
                  <div style={{ fontWeight: 700 }}>{selected.speed.toFixed(3)}</div>
               </div>
            </div>
          </div>
        ) : (
          <div className="glass" style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Hover over a planet to explore its characteristics...
          </div>
        )}

        {/* Controls */}
        <div className="glass" style={{ marginTop: '1.5rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <button onClick={() => setTimeScale(s => Math.max(0.1, s - 0.5))} className="btn-ghost" style={{ padding: '8px' }}><Rewind size={18} /></button>
          <button onClick={() => setIsPaused(!isPaused)} className="btn-primary" style={{ width: '48px', height: '48px', padding: 0, justifyContent: 'center' }}>
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          <button onClick={() => setTimeScale(s => Math.min(10, s + 0.5))} className="btn-ghost" style={{ padding: '8px' }}><FastForward size={18} /></button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          TIME COMPRESSION: {timeScale.toFixed(1)}x
        </div>
      </div>

      {/* Visualizer */}
      <div className="planetarium-container">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 1000"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Legends */}
      <div className="planetarium-legends" style={{ position: 'absolute', bottom: '30px', right: '30px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="glass" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>ORBIT PATTERNS</span>
        </div>
        <div className="glass" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(#fbbf24, #f59e0b)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>G2V SYSTEM STAR (SUN)</span>
        </div>
      </div>
    </div>
  )
}
