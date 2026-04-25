'use client'
import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  size: number
  opacity: number
  twinkle: number
  twinkleSpeed: number
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = window.innerWidth
    let height = window.innerHeight
    let mouseX = width / 2
    let mouseY = height / 2

    canvas.width = width
    canvas.height = height

    // Generate stars
    const STAR_COUNT = 300
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }))

    // Shooting star state
    let shootingStar: { x: number; y: number; vx: number; vy: number; tail: number; alpha: number } | null = null
    let shootingTimer = 0

    function spawnShootingStar() {
      shootingStar = {
        x: Math.random() * width * 0.6,
        y: Math.random() * height * 0.4,
        vx: 4 + Math.random() * 3,
        vy: 2 + Math.random() * 2,
        tail: 80 + Math.random() * 60,
        alpha: 1,
      }
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height)

      // Parallax offset from mouse
      const ox = (mouseX - width / 2) * 0.0008
      const oy = (mouseY - height / 2) * 0.0008

      for (const s of stars) {
        s.twinkle += s.twinkleSpeed
        const twinkleFactor = 0.6 + 0.4 * Math.sin(s.twinkle)
        const alpha = s.opacity * twinkleFactor

        const px = s.x + ox * s.z * 80
        const py = s.y + oy * s.z * 80

        ctx!.beginPath()
        ctx!.arc(px, py, s.size * twinkleFactor, 0, Math.PI * 2)

        // Color stars slightly
        const hue = s.z > 0.7 ? 220 : s.z > 0.4 ? 200 : 180
        ctx!.fillStyle = `hsla(${hue}, 80%, 95%, ${alpha})`
        ctx!.fill()

        // Glow for bright stars
        if (s.size > 1.5) {
          const grad = ctx!.createRadialGradient(px, py, 0, px, py, s.size * 4)
          grad.addColorStop(0, `hsla(${hue}, 80%, 95%, ${alpha * 0.4})`)
          grad.addColorStop(1, 'transparent')
          ctx!.beginPath()
          ctx!.arc(px, py, s.size * 4, 0, Math.PI * 2)
          ctx!.fillStyle = grad
          ctx!.fill()
        }

        s.x += s.vx
        s.y += s.vy
        if (s.x < 0) s.x = width
        if (s.x > width) s.x = 0
        if (s.y < 0) s.y = height
        if (s.y > height) s.y = 0
      }

      // Shooting star
      shootingTimer++
      if (shootingTimer > 300 && !shootingStar) {
        shootingTimer = 0
        if (Math.random() > 0.3) spawnShootingStar()
      }

      if (shootingStar) {
        const ss = shootingStar
        const grad = ctx!.createLinearGradient(
          ss.x - ss.vx * (ss.tail / 3), ss.y - ss.vy * (ss.tail / 3),
          ss.x, ss.y
        )
        grad.addColorStop(0, `rgba(6, 182, 212, 0)`)
        grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`)
        ctx!.beginPath()
        ctx!.moveTo(ss.x - ss.vx * (ss.tail / 3), ss.y - ss.vy * (ss.tail / 3))
        ctx!.lineTo(ss.x, ss.y)
        ctx!.strokeStyle = grad
        ctx!.lineWidth = 2
        ctx!.stroke()

        ss.x += ss.vx
        ss.y += ss.vy
        ss.alpha -= 0.015
        if (ss.alpha <= 0 || ss.x > width + 100 || ss.y > height + 100) {
          shootingStar = null
          shootingTimer = 0
        }
      }

      animId = requestAnimationFrame(draw)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = width
      canvas!.height = height
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield-canvas" aria-hidden="true" />
}
