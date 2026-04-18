import { useEffect, useRef } from 'react'

export interface MousePosition {
  x: number
  y: number
  nx: number // normalized -1 → 1
  ny: number
}

export function useMousePosition(): React.MutableRefObject<MousePosition> {
  const pos = useRef<MousePosition>({ x: 0, y: 0, nx: 0, ny: 0 })

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      pos.current = {
        x: e.clientX,
        y: e.clientY,
        nx: (e.clientX / window.innerWidth) * 2 - 1,
        ny: -((e.clientY / window.innerHeight) * 2 - 1),
      }
    }
    window.addEventListener('mousemove', handle, { passive: true })
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  return pos
}
