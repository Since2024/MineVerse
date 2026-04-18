import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    id: 'driveup',
    index: '01',
    title: 'DriveUp × Yatra',
    category: 'Full-Stack · Mobility',
    tagline: 'Real-time carpooling infrastructure that cut last-mile commute costs by 40%.',
    description:
      'Yatra needed to move 50,000+ employees without burning the transport budget. DriveUp turned their origin-destination data into a live matching engine — matching commuters by departure window, route overlap, and seating capacity. The result: fewer empty seats, fewer vehicles, a measurable carbon delta, and an employee perk that actually gets used.',
    year: '2024',
    color: '#6C5CE7',
    image: '/project-driveup.jpg',
  },
  {
    id: 'fomo',
    index: '02',
    title: 'FOMO',
    category: 'Product Design · Social',
    tagline: 'Event discovery that surfaces what your actual friends are attending.',
    description:
      'Most event apps are ads in disguise. FOMO flips the model: the signal is your social graph, not a promoted listing. Friend activity feeds, venue heat maps, and one-tap RSVPs create a feedback loop where going out feels less like research and more like a reflex. Built the data model, the realtime feed, and the map layer from scratch.',
    year: '2024',
    color: '#00D4FF',
    image: '/project-fomo.jpg',
  },
]

export function ProjectSection() {
  return (
    <section
      id="projects"
      style={{
        position: 'relative',
        padding: '15vh 48px',
        minHeight: '200vh',
      }}
    >
      <div className="mono" style={{ marginBottom: '80px', color: '#7A7A85' }}>
        02 / WORK
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '160px' }}>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<HTMLDivElement[]>([])
  const isEven = index % 2 === 0

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const lines = lineRefs.current.filter(Boolean)

    gsap.set(lines, { y: '110%' })

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(lines, {
          y: '0%',
          duration: 1.2,
          ease: 'power4.inOut',
          stagger: 0.08,
        })
      },
    })

    return () => st.kill()
  }, [])

  const addLine = (el: HTMLDivElement | null, i: number) => {
    if (el) lineRefs.current[i] = el
  }

  return (
    <div
      ref={cardRef}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        alignItems: 'center',
        flexDirection: isEven ? 'row' : 'row-reverse',
      }}
    >
      {/* Text column */}
      <div
        ref={textRef}
        style={{ order: isEven ? 0 : 1 }}
      >
        <div className="mono" style={{ marginBottom: '20px', color: project.color }}>
          {project.index} / {project.category}
        </div>

        <div style={{ overflow: 'hidden', marginBottom: '12px' }}>
          <div ref={(el) => addLine(el, 0)} style={TITLE_STYLE}>
            {project.title}
          </div>
        </div>

        <div style={{ overflow: 'hidden', marginBottom: '24px' }}>
          <div
            ref={(el) => addLine(el, 1)}
            style={{ fontWeight: 700, fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#EAEAF0', lineHeight: 1.3 }}
          >
            {project.tagline}
          </div>
        </div>

        <div style={{ overflow: 'hidden', marginBottom: '32px' }}>
          <div
            ref={(el) => addLine(el, 2)}
            style={{ color: '#7A7A85', lineHeight: 1.7, fontSize: '0.95rem', maxWidth: '480px' }}
          >
            {project.description}
          </div>
        </div>

        <div style={{ overflow: 'hidden' }}>
          <div ref={(el) => addLine(el, 3)}>
            <span className="mono" style={{ color: '#7A7A85' }}>{project.year}</span>
          </div>
        </div>
      </div>

      {/* Visual placeholder column (3D slab is in Scene.tsx) */}
      <div
        style={{
          order: isEven ? 1 : 0,
          aspectRatio: '16/10',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at center, ${project.color}18 0%, transparent 70%)`,
          }}
        />
        <div
          className="mono"
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            color: project.color,
            fontSize: '10px',
          }}
        >
          {project.title.toUpperCase()}
        </div>
        {/* Scanline overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 3px)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}

const TITLE_STYLE: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700,
  fontSize: 'clamp(2rem, 5vw, 4rem)',
  letterSpacing: '-0.03em',
  lineHeight: 0.95,
  color: '#EAEAF0',
}
