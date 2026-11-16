'use client'

import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          if (docHeight > 0) {
            const current = window.scrollY / docHeight
            setProgress(Math.min(Math.max(current, 0), 1))
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="scroll-progress-bar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        backgroundColor: '#FFD600',
        transform: `scaleX(${progress})`,
        transformOrigin: 'left',
        zIndex: 99999,
        pointerEvents: 'none',
        boxShadow: '0 0 12px rgba(255, 214, 0, 0.8), 0 0 20px rgba(255, 214, 0, 0.4)',
        transition: 'transform 0.08s linear',
      }}
      aria-hidden="true"
    />
  )
}
