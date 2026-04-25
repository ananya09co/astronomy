'use client'
import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface Event {
  title: string
  date: string
  type: string
}

export default function CountdownTimer({ event }: { event: Event }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const target = new Date(event.date + 'T00:00:00').getTime()
      const now = Date.now()
      const diff = target - now
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [event.date])

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ]

  return (
    <div style={{ display: 'inline-block' }}>
      <div className="glass" style={{ padding: '1.5rem 2rem', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
          <Clock size={16} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{event.title}</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {units.map(u => (
            <div key={u.label} style={{ textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64,
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
                fontFamily: 'Space Grotesk, sans-serif',
                color: 'white',
                boxShadow: '0 0 15px rgba(99,102,241,0.2)',
              }}>
                {String(u.value).padStart(2, '0')}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {u.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
