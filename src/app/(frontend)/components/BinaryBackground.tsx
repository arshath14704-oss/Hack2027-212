'use client'

import { useEffect, useRef } from 'react'

interface BinaryColumn {
  x: number
  y: number
  speed: number
  chars: string[]
  fontSize: number
  brightness: number
  theme: 'gold' | 'green' | 'white'
  mutationTimer: number
}

export function BinaryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const COL_SPACING = 28
    const columnCount = Math.ceil(width / COL_SPACING)
    const columns: BinaryColumn[] = []

    for (let i = 0; i < columnCount; i++) {
      const length = 14 + Math.floor(Math.random() * 18)
      const chars: string[] = []
      for (let j = 0; j < length; j++) {
        chars.push(Math.random() > 0.5 ? '1' : '0')
      }

      // ~20% brighter highlight streams, ~80% subtle ambient streams
      const isBright = Math.random() < 0.22
      const brightness = isBright
        ? 0.32 + Math.random() * 0.18
        : 0.08 + Math.random() * 0.12

      // Color themes: subtle green, muted gold, crisp tech white
      const themeRand = Math.random()
      const theme: 'gold' | 'green' | 'white' =
        themeRand < 0.22 ? 'gold' : themeRand < 0.44 ? 'green' : 'white'

      columns.push({
        x: i * COL_SPACING + (Math.random() * 6 - 3),
        y: Math.random() * (height + 300) - 200,
        speed: 0.8 + Math.random() * 1.6,
        chars,
        fontSize: Math.random() > 0.4 ? 12 : 11,
        brightness,
        theme,
        mutationTimer: Math.random() * 30,
      })
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    let lastTime = performance.now()

    const draw = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1)
      lastTime = currentTime

      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i]

        // Animate vertically from TOP TO BOTTOM
        col.y += col.speed * 60 * delta

        // Seamless wrap when stream leaves bottom of screen
        const streamHeight = col.chars.length * (col.fontSize + 4)
        if (col.y > height + 40) {
          col.y = -streamHeight - Math.random() * 80

          // Randomize speed and brightness on wrap for variety
          col.speed = 0.8 + Math.random() * 1.6
          const isBright = Math.random() < 0.22
          col.brightness = isBright
            ? 0.32 + Math.random() * 0.18
            : 0.08 + Math.random() * 0.12
        }

        // Periodic character mutation
        col.mutationTimer += delta * 60
        if (col.mutationTimer > 25) {
          col.mutationTimer = 0
          const mutateIdx = Math.floor(Math.random() * col.chars.length)
          col.chars[mutateIdx] = Math.random() > 0.5 ? '1' : '0'
        }

        ctx.font = `${col.fontSize}px 'Space Grotesk', monospace`

        for (let j = 0; j < col.chars.length; j++) {
          const charY = col.y + j * (col.fontSize + 4)
          if (charY < -20 || charY > height + 20) continue

          const isHead = j === col.chars.length - 1 // The leading falling head digit
          const trailRatio = (j + 1) / col.chars.length // Fades from tail to head

          let alpha = col.brightness * trailRatio

          if (isHead) {
            alpha = Math.min(1, col.brightness * 2.4)
            if (col.theme === 'gold') {
              ctx.fillStyle = `rgba(255, 214, 0, ${alpha})`
            } else if (col.theme === 'green') {
              ctx.fillStyle = `rgba(0, 230, 118, ${alpha})`
            } else {
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
            }
          } else {
            if (col.theme === 'gold' && j % 3 === 0) {
              ctx.fillStyle = `rgba(255, 214, 0, ${alpha * 1.3})`
            } else if (col.theme === 'green' && j % 3 === 0) {
              ctx.fillStyle = `rgba(0, 230, 118, ${alpha * 1.25})`
            } else {
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
            }
          }

          ctx.fillText(col.chars[j], col.x, charY)
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    animationId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div
      className="binary-matrix-wrap"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        backgroundColor: '#030303',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
