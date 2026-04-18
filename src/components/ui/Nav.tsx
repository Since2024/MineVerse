import { useRef } from 'react'
import { getLenis } from '@/lib/lenis'

const LINKS = [
  { label: '01 / Work', href: '#projects' },
  { label: '02 / Thinking', href: '#philosophy' },
  { label: '03 / Contact', href: '#contact' },
]

export function Nav() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '28px 48px',
        pointerEvents: 'auto',
      }}
    >
      <span className="mono" style={{ color: '#EAEAF0', fontSize: '11px' }}>
        SYSTEM_ARCHITECT
      </span>

      <div style={{ display: 'flex', gap: '40px' }}>
        {LINKS.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} />
        ))}
      </div>
    </nav>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  const lineRef = useRef<HTMLSpanElement>(null)

  const onEnter = () => {
    if (lineRef.current) lineRef.current.style.transform = 'scaleX(1)'
  }
  const onLeave = () => {
    if (lineRef.current) lineRef.current.style.transform = 'scaleX(0)'
  }

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const id = href.replace('#', '')
    const target = document.getElementById(id)
    if (target) {
      getLenis()?.scrollTo(target, { offset: -80, duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
    }
  }

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-interactive
      className="mono"
      style={{
        color: '#7A7A85',
        textDecoration: 'none',
        position: 'relative',
        paddingBottom: '4px',
        transition: 'color 0.3s ease',
        fontSize: '11px',
      }}
    >
      {label}
      <span
        ref={lineRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: '#6C5CE7',
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
          transition: 'transform 0.4s cubic-bezier(0.76,0,0.24,1)',
        }}
      />
    </a>
  )
}
