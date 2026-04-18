import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { lerp } from '@/lib/easing'

export function useMagnetic(radius = 80, strength = 0.4) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let rafId: number
    let mx = 0, my = 0
    let ox = 0, oy = 0

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < radius) {
        mx = dx * strength
        my = dy * strength
      } else {
        mx = 0
        my = 0
      }
    }

    const tick = () => {
      ox = lerp(ox, mx, 0.12)
      oy = lerp(oy, my, 0.12)
      gsap.set(el, { x: ox, y: oy })
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [radius, strength])

  return ref
}
