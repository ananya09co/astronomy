'use client'
import { useState, useEffect } from 'react'
import { Clock, RefreshCw } from 'lucide-react'

export default function DailyRefreshTimer({ label = 'Next Rotation' }: { label?: string }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    function updateTimer() {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setHours(24, 0, 0, 0) // Next midnight

      const diff = tomorrow.getTime() - now.getTime()
      
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)

      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }

    updateTimer()
    const id = setInterval(updateTimer, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '8px', 
      padding: '4px 12px', 
      background: 'rgba(255,255,255,0.05)', 
      border: '1px solid rgba(255,255,255,0.1)', 
      borderRadius: '100px',
      fontSize: '0.75rem',
      fontWeight: 500,
      color: 'var(--text-muted)'
    }}>
      <Clock size={12} className="animate-pulse-glow" style={{ color: 'var(--accent-cyan)' }} />
      <span style={{ letterSpacing: '0.02em' }}>{label}: <span style={{ fontFamily: 'monospace', color: 'white', fontWeight: 600 }}>{timeLeft}</span></span>
    </div>
  )
}
