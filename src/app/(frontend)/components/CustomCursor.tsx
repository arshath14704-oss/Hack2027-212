'use client'

import { useEffect, useRef } from 'react'

interface SparkParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  life: number
  decay: number
  color: string
}

const GOLD_SPARK_COLORS = [
  '#FFD600', // Signal Gold
  '#FFE14D', // Bright Gold
  '#FFAA00', // Deep Warm Ember Gold
  '#FFF275', // Pale Gold Spark
  '#FFC400', // Radiant Gold
]

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let animationId: number
    let isRunning = false

    let mouseX = -100
    let mouseY = -100
    let isHovered = false
    const particles: SparkParticle[] = []
    const MAX_PARTICLES = 50

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const spawnSpark = (x: number, y: number, count = 2) => {
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) {
          particles.shift()
        }

        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 0.8 + 0.2

        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          // Subtle horizontal jitter + upward fire spark drift
          vx: Math.cos(angle) * speed * 0.7,
          vy: -Math.abs(Math.sin(angle) * speed) - (Math.random() * 0.8 + 0.3), // Float gently upward like embers
          size: Math.random() * 2.2 + 1.2,
          alpha: 1,
          life: 1,
          decay: Math.random() * 0.03 + 0.022,
          color: GOLD_SPARK_COLORS[Math.floor(Math.random() * GOLD_SPARK_COLORS.length)],
        })
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw active cursor glowing head
      if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
        ctx.save()
        ctx.shadowBlur = isHovered ? 14 : 9
        ctx.shadowColor = '#FFD600'

        // Core spark point
        ctx.beginPath()
        ctx.arc(mouseX, mouseY, isHovered ? 3.8 : 2.6, 0, Math.PI * 2)
        ctx.fillStyle = '#FFFFFF'
        ctx.fill()

        // Soft outer golden halo
        ctx.beginPath()
        ctx.arc(mouseX, mouseY, isHovered ? 8 : 5.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 214, 0, 0.45)'
        ctx.fill()

        ctx.restore()
      }

      // Render & update ember sparks
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy *= 0.98
        p.vx *= 0.98
        p.life -= p.decay

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        const currentSize = Math.max(0.6, p.size * p.life)

        ctx.save()
        ctx.shadowBlur = 6
        ctx.shadowColor = p.color
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      if (particles.length > 0 || (mouseX > 0 && mouseY > 0)) {
        animationId = requestAnimationFrame(render)
      } else {
        isRunning = false
      }
    }

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true
        animationId = requestAnimationFrame(render)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      spawnSpark(mouseX, mouseY, isHovered ? 3 : 2)
      startLoop()
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest(
        'a, button, .button, input, select, textarea, [role="button"], .profile-card, .feature-card, .domain-card, .profile-avatar'
      )
      isHovered = !!interactive
      if (isHovered && mouseX > 0 && mouseY > 0) {
        spawnSpark(mouseX, mouseY, 4)
        startLoop()
      }
    }

    const handleMouseLeave = () => {
      mouseX = -100
      mouseY = -100
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="custom-spark-cursor-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99998,
        width: '100%',
        height: '100%',
      }}
      aria-hidden="true"
    />
  )
}
