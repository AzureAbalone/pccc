import { useMemo } from 'react'

interface Bubble {
  id: number
  size: number
  left: number
  duration: number
  delay: number
  opacity: number
}

export function FireBackground() {
  // Generate random bubbles with memoization for performance
  const bubbles: Bubble[] = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: Math.random() * 120 + 60, // 60-180px
      left: Math.random() * 100, // 0-100%
      duration: Math.random() * 14 + 10, // 10-24s
      delay: Math.random() * 10, // 0-10s stagger
      opacity: Math.random() * 0.2 + 0.25, // 0.25-0.45 (subtle but visible)
    }))
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Base warm gradient at bottom */}
      <div 
        className="absolute inset-0 fire-glow"
        style={{
          background: `
            radial-gradient(ellipse 150% 80% at 50% 100%, rgba(251, 146, 60, 0.2) 0%, transparent 60%),
            radial-gradient(ellipse 100% 50% at 20% 95%, rgba(239, 68, 68, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 100% 50% at 80% 95%, rgba(245, 158, 11, 0.2) 0%, transparent 50%)
          `
        }}
      />

      {/* Floating fire bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full fire-bubble"
          style={{
            '--duration': `${bubble.duration}s`,
            '--delay': `${bubble.delay}s`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            bottom: '-100px',
            background: `radial-gradient(circle at 30% 30%, 
              rgba(251, 191, 36, ${bubble.opacity}) 0%, 
              rgba(251, 146, 60, ${bubble.opacity * 0.8}) 40%, 
              rgba(239, 68, 68, ${bubble.opacity * 0.6}) 70%,
              transparent 100%)`,
            filter: `blur(${bubble.size / 4}px)`, // Large Blur
            boxShadow: `0 0 ${bubble.size / 2}px rgba(251, 146, 60, ${bubble.opacity * 0.5})`,
          } as React.CSSProperties}
        />
      ))}

      {/* Soft top gradient to fade bubbles */}
      <div 
        className="absolute inset-x-0 top-0 h-48"
        style={{
          background: 'linear-gradient(to bottom, rgba(250,251,252,0.95) 0%, transparent 100%)'
        }}
      />
    </div>
  )
}

