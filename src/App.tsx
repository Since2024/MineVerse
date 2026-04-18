import { Suspense, useEffect } from 'react'
import { Scene } from './components/three/Scene'
import { Loader } from './components/three/Loader'
import { Nav } from './components/ui/Nav'
import { HeroText } from './components/ui/HeroText'
import { ProjectSection } from './components/ui/ProjectSection'
import { PhilosophySection } from './components/ui/PhilosophySection'
import { ContactSection } from './components/ui/ContactSection'
import { Cursor } from './components/ui/Cursor'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { initLenis, destroyLenis } from './lib/lenis'

export default function App() {
  useEffect(() => {
    initLenis()
    return () => destroyLenis()
  }, [])

  return (
    <>
      <Cursor />

      {/* Fixed 3D scene */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Suspense fallback={<Loader />}>
          <Scene />
        </Suspense>
      </div>

      {/* Fixed UI chrome */}
      <Nav />
      <ScrollProgress />

      {/* Scroll-driven content — creates the page scroll height */}
      <div id="scroll-content" style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
        <section id="hero" style={{ height: '100vh' }} />
        <HeroText />
        <ProjectSection />
        <PhilosophySection />
        <ContactSection />
        <div style={{ height: '80px' }} />
      </div>
    </>
  )
}
