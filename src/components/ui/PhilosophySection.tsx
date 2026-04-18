import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const WORDS = ['CREATION', 'OVER', 'CONSUMPTION']

export function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<HTMLDivElement[]>([])
  const paraRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const words = wordRefs.current.filter(Boolean)
    gsap.set(words, { y: '105%' })
    gsap.set(paraRef.current, { opacity: 0, y: 24 })

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      onEnter: () => {
        gsap.to(words, {
          y: '0%',
          duration: 1.4,
          ease: 'power4.inOut',
          stagger: 0.12,
        })
        gsap.to(paraRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power4.out',
          delay: 0.5,
        })
      },
    })

    return () => st.kill()
  }, [])

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: '20vh 48px',
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        alignItems: 'center',
      }}
    >
      {/* Left: Glass card */}
      <div>
        <div className="mono" style={{ marginBottom: '40px', color: '#7A7A85' }}>
          03 / THINKING
        </div>

        <div
          ref={paraRef}
          className="glass-card"
          style={{
            padding: '40px',
            maxWidth: '480px',
          }}
        >
          <p style={{ color: '#EAEAF0', lineHeight: 1.75, fontSize: '1.05rem' }}>
            Most software optimizes for comfort. It reduces friction, smooths edges, and
            settles into predictability. That&apos;s the product playbook. It&apos;s also how you
            build things people forget they&apos;re using.
          </p>
          <p style={{ color: '#7A7A85', lineHeight: 1.75, fontSize: '0.95rem', marginTop: '20px' }}>
            The work I care about operates differently — it surfaces constraints you
            didn&apos;t know existed, then turns them into the architecture. Systems that make
            you think differently about the problem, not just the solution.
          </p>
          <div
            style={{
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span className="mono" style={{ color: '#6C5CE7' }}>
              SYSTEM ARCHITECT / IN TRAINING
            </span>
          </div>
        </div>
      </div>

      {/* Right: huge stacked words */}
      <div style={{ textAlign: 'right' }}>
        {WORDS.map((word, i) => (
          <div key={word} style={{ overflow: 'hidden' }}>
            <div
              ref={(el) => { if (el) wordRefs.current[i] = el }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(3rem, 7vw, 8rem)',
                letterSpacing: '-0.04em',
                lineHeight: 0.9,
                color: i === 1 ? '#7A7A85' : '#EAEAF0',
              }}
            >
              {word}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
