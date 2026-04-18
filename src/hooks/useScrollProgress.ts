import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useScrollProgress(
  callback: (progress: number) => void,
  deps: unknown[] = []
): void {
  const cbRef = useRef(callback)
  cbRef.current = callback

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => cbRef.current(self.progress),
    })
    return () => st.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
