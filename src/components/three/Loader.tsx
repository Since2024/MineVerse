import { useProgress } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function Loader() {
  const { progress, active } = useProgress()
  const barRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const counterVal = useRef({ v: 0 })

  useEffect(() => {
    if (!barRef.current || !counterRef.current) return
    gsap.to(barRef.current, { scaleX: progress / 100, ease: 'power2.out', duration: 0.4 })
    gsap.to(counterVal.current, {
      v: Math.round(progress),
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: () => {
        if (counterRef.current)
          counterRef.current.textContent = String(Math.round(counterVal.current.v)).padStart(3, '0')
      },
    })
  }, [progress])

  useEffect(() => {
    if (!active && wrapRef.current) {
      gsap.to(wrapRef.current, {
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.inOut',
        onComplete: () => { if (wrapRef.current) wrapRef.current.style.display = 'none' },
      })
    }
  }, [active])

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050507',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      <span
        ref={counterRef}
        className="mono"
        style={{ fontSize: '11px', color: '#7A7A85' }}
      >
        000
      </span>
      <div
        style={{
          width: '200px',
          height: '1px',
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          ref={barRef}
          style={{
            width: '100%',
            height: '100%',
            background: '#6C5CE7',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />
      </div>
    </div>
  )
}
