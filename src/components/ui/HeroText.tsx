import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function HeroText() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const typewriterRef = useRef<HTMLSpanElement>(null)
  const hasMounted = useRef(false)

  useEffect(() => {
    if (hasMounted.current) return
    hasMounted.current = true

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      gsap.set([eyebrowRef.current, line1Ref.current, line2Ref.current, subRef.current], { y: 0, opacity: 1 })
      return
    }

    const tl = gsap.timeline({ delay: 0.2 })

    tl.from(eyebrowRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.out',
    })
    .from(
      line1Ref.current,
      { y: '110%', duration: 1.2, ease: 'power4.inOut' },
      '-=0.4'
    )
    .from(
      line2Ref.current,
      { y: '110%', duration: 1.2, ease: 'power4.inOut' },
      '-=1.04'
    )
    .from(
      subRef.current,
      { opacity: 0, y: 16, duration: 0.8, ease: 'power4.out' },
      '-=0.6'
    )
    .call(() => {
      typewriter(typewriterRef.current, '— Building tools that break systems', 38)
    }, [], '-=0.2')
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'fixed',
        top: '50%',
        left: '48px',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        zIndex: 50,
        maxWidth: '65vw',
      }}
    >
      <div ref={eyebrowRef} className="mono" style={{ marginBottom: '24px', opacity: 0 }}>
        01 / HERO
      </div>

      <div style={{ overflow: 'hidden' }}>
        <div
          ref={line1Ref}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(3.5rem, 9vw, 10rem)',
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            color: '#EAEAF0',
            transform: 'translateY(110%)',
          }}
        >
          SYSTEM
        </div>
      </div>

      <div style={{ overflow: 'hidden' }}>
        <div
          ref={line2Ref}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(3.5rem, 9vw, 10rem)',
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            transform: 'translateY(110%)',
            background: 'linear-gradient(135deg, #6C5CE7 0%, #8875f8 40%, #00D4FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'relative',
          }}
        >
          ARCHITECT
          <span
            style={{
              position: 'absolute',
              inset: 0,
              filter: 'blur(40px)',
              background: 'linear-gradient(135deg, #6C5CE7, #00D4FF)',
              opacity: 0.25,
              zIndex: -1,
              WebkitBackgroundClip: 'unset',
              WebkitTextFillColor: 'unset',
              backgroundClip: 'unset',
            }}
          />
        </div>
      </div>

      <div
        ref={subRef}
        style={{ marginTop: '16px', opacity: 0 }}
      >
        <span className="mono" style={{ fontSize: '11px', color: '#7A7A85' }}>
          <span ref={typewriterRef} />
          <span className="cursor-blink" style={{ borderRight: '1px solid #6C5CE7' }}>&nbsp;</span>
        </span>
      </div>
    </div>
  )
}

function typewriter(el: HTMLSpanElement | null, text: string, charsPerSecond: number) {
  if (!el) return
  let i = 0
  const interval = 1000 / charsPerSecond
  const tick = () => {
    if (i <= text.length) {
      el.textContent = text.slice(0, i)
      i++
      setTimeout(tick, interval)
    }
  }
  tick()
}
