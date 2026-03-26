import { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 80 }, () => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      r:    Math.random() * 2 + 0.5,
      vx:   (Math.random() - 0.5) * 0.4,
      vy:   -(Math.random() * 0.6 + 0.2),
      alpha: Math.random() * 0.5 + 0.1,
      hue:  Math.random() * 20 + 190,   // skyblue
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha})`
        ctx.fill()

        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.001

        if (p.y < 0 || p.alpha <= 0) {
          p.x = Math.random() * canvas.width
          p.y = canvas.height + 5
          p.alpha = Math.random() * 0.5 + 0.1
        }
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      className="fixed inset-0 pointer-events-none opacity-30"
      style={{ zIndex: 0 }}
    />
  )
}
