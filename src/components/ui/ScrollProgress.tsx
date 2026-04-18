import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        if (barRef.current) {
          barRef.current.style.transform = `scaleY(${self.progress})`
        }
      },
    })
    return () => st.kill()
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        right: '24px',
        top: 0,
        bottom: 0,
        width: '1px',
        background: 'rgba(255,255,255,0.06)',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={barRef}
        style={{
          width: '100%',
          height: '100%',
          background: '#6C5CE7',
          transformOrigin: 'top center',
          transform: 'scaleY(0)',
        }}
      />
    </div>
  )
}
