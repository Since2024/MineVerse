import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagnetic } from '@/hooks/useMagnetic'

gsap.registerPlugin(ScrollTrigger)

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Twitter', href: 'https://twitter.com' },
]

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const magneticRef = useMagnetic(80, 0.35)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.set([headingRef.current, subRef.current, ctaRef.current], { opacity: 0, y: 30 })

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 65%',
      onEnter: () => {
        gsap.to([headingRef.current, subRef.current, ctaRef.current], {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.15,
        })
      },
    })

    return () => st.kill()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: '20vh 48px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div className="mono" style={{ marginBottom: '48px', color: '#7A7A85' }}>
        04 / CONTACT
      </div>

      <div ref={headingRef} style={{ opacity: 0 }}>
        <h2
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 7vw, 7rem)',
            letterSpacing: '-0.04em',
            lineHeight: 0.92,
            color: '#EAEAF0',
            maxWidth: '800px',
            marginBottom: '48px',
          }}
        >
          Let&apos;s break something
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #6C5CE7, #00D4FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            together
          </span>{' '}
          →
        </h2>
      </div>

      <div ref={ctaRef} style={{ opacity: 0 }}>
        <a
          ref={magneticRef as React.RefObject<HTMLAnchorElement>}
          href="mailto:mhyeson@gmail.com"
          data-interactive
          style={{
            display: 'inline-block',
            padding: '18px 40px',
            border: '1px solid rgba(108, 92, 231, 0.6)',
            color: '#EAEAF0',
            textDecoration: 'none',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            transition: 'border-color 0.3s ease, background 0.3s ease',
            background: 'rgba(108, 92, 231, 0.08)',
            willChange: 'transform',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.borderColor = '#6C5CE7'
            el.style.background = 'rgba(108, 92, 231, 0.16)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.borderColor = 'rgba(108, 92, 231, 0.6)'
            el.style.background = 'rgba(108, 92, 231, 0.08)'
          }}
        >
          Get in Touch
        </a>
      </div>

      <div ref={subRef} style={{ marginTop: '64px', opacity: 0 }}>
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '32px',
            display: 'flex',
            gap: '40px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <a
            href="mailto:mhyeson@gmail.com"
            className="mono"
            data-interactive
            style={{ color: '#7A7A85', textDecoration: 'none', fontSize: '11px' }}
          >
            mhyeson@gmail.com
          </a>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mono"
              data-interactive
              style={{ color: '#7A7A85', textDecoration: 'none', fontSize: '11px' }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
