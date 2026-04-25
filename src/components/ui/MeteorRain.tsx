'use client'
import { useEffect, useRef } from 'react'

export default function MeteorRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const meteors: Meteor[] = []
    const meteorCount = 2 // Keeping it rare and special

    class Meteor {
      x: number = 0
      y: number = 0
      length: number = 0
      speed: number = 0
      opacity: number = 0

      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * width * 1.5
        this.y = -20
        this.length = Math.random() * 80 + 50
        this.speed = Math.random() * 10 + 10
        this.opacity = 1
      }

      update() {
        this.x -= this.speed
        this.y += this.speed
        if (this.x < -this.length || this.y > height + this.length) {
          // Stay dead for a bit to make it feel "rare"
          if (Math.random() > 0.99) this.reset()
        }
      }

      draw() {
        if (!ctx) return
        const gradient = ctx.createLinearGradient(
          this.x, this.y, 
          this.x + this.length, this.y - this.length
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`)
        gradient.addColorStop(0.5, `rgba(99, 102, 241, ${this.opacity * 0.5})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x + this.length, this.y - this.length)
        ctx.stroke()
      }
    }

    // Initialize only a few
    for (let i = 0; i < meteorCount; i++) {
      meteors.push(new Meteor())
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      meteors.forEach(m => {
        m.update()
        m.draw()
      })
      requestAnimationFrame(animate)
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener('resize', handleResize)
    animate()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
        opacity: 0.8
      }}
    />
  )
}
