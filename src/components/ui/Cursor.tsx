import { useEffect, useRef } from 'react'
import { lerp } from '@/lib/easing'

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const isHovering = useRef(false)
  const rafId = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onEnter = () => { isHovering.current = true }
    const onLeave = () => { isHovering.current = false }

    window.addEventListener('mousemove', onMove, { passive: true })

    const interactives = document.querySelectorAll('a, button, [data-interactive]')
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    const tick = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.15)
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.15)

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`
      }

      if (ringRef.current) {
        const size = isHovering.current ? 48 : 12
        const offset = size / 2
        ringRef.current.style.transform = `translate(${ring.current.x - offset}px, ${ring.current.y - offset}px)`
        ringRef.current.style.width = `${size}px`
        ringRef.current.style.height = `${size}px`
        ringRef.current.style.mixBlendMode = isHovering.current ? 'difference' : 'normal'
        ringRef.current.style.borderColor = isHovering.current ? '#EAEAF0' : '#6C5CE7'
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: '1px solid #6C5CE7',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.25s cubic-bezier(0.76,0,0.24,1), height 0.25s cubic-bezier(0.76,0,0.24,1), border-color 0.25s ease',
          willChange: 'transform',
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#6C5CE7',
          pointerEvents: 'none',
          zIndex: 10000,
          willChange: 'transform',
        }}
      />
    </>
  )
}
