'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { feature } from 'topojson-client'

interface WorldMapProps {
  lat: number
  lng: number
  pathTrace?: { lat: number, lng: number }[]
}

export default function WorldMap({ lat, lng, pathTrace = [] }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [topoData, setTopoData] = useState<any>(null)

  useEffect(() => {
    // Fetch world topology
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(res => res.json())
      .then(data => setTopoData(data))
  }, [])

  useEffect(() => {
    if (!topoData || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    const width = 800
    const height = 400
    
    svg.selectAll('*').remove()

    const projection = d3.geoEquirectangular()
      .scale(width / (2 * Math.PI))
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)

    // Draw Countries
    const countries = feature(topoData, topoData.objects.countries) as any
    svg.append('g')
      .selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', 'rgba(255, 255, 255, 0.05)')
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .attr('stroke-width', 0.5)

    // Draw Path Trace
    if (pathTrace.length > 1) {
      const lineData = pathTrace.map(p => projection([p.lng, p.lat]))
      const lineGenerator = d3.line() as any
      
      svg.append('path')
        .datum(lineData)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', 'var(--accent-indigo)')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4 4')
        .attr('opacity', 0.5)
    }

    // Draw ISS Point
    const [x, y] = projection([lng, lat]) || [0, 0]
    
    // Pulse Ring
    svg.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', 8)
      .attr('fill', 'var(--accent-cyan)')
      .attr('opacity', 0.4)
      .append('animate')
      .attr('attributeName', 'r')
      .attr('from', 4)
      .attr('to', 15)
      .attr('dur', '1.5s')
      .attr('begin', '0s')
      .attr('repeatCount', 'indefinite')

    svg.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', 4)
      .attr('fill', 'var(--accent-cyan)')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)

  }, [topoData, lat, lng, pathTrace])

  return (
    <div className="glass" style={{ padding: '1rem', overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2, 6, 23, 0.4)' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.2))' }}
      />
    </div>
  )
}
