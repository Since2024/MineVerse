import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { lerp } from '@/lib/easing'
import { useMousePosition } from '@/hooks/useMousePosition'

gsap.registerPlugin(ScrollTrigger)

// Camera Z positions per section
const CAM_Z_HERO = 8
const CAM_Z_PROJECTS = 5
const CAM_Z_PHILOSOPHY = 11
const CAM_Z_CONTACT = 1.2

interface CameraState {
  targetZ: number
  targetX: number
  targetY: number
  targetLookY: number
}

const state: CameraState = {
  targetZ: CAM_Z_HERO,
  targetX: 0,
  targetY: 0,
  targetLookY: 0,
}

export function CameraRig() {
  const { camera } = useThree()
  const mouse = useMousePosition()
  const progress = useRef(0)

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        progress.current = p

        if (p < 0.2) {
          // Hero: stationary, slight parallax
          state.targetZ = lerp(CAM_Z_HERO, CAM_Z_PROJECTS, p / 0.2)
          state.targetY = 0
        } else if (p < 0.6) {
          // Projects: dolly through node field
          const t = (p - 0.2) / 0.4
          state.targetZ = lerp(CAM_Z_PROJECTS, CAM_Z_PHILOSOPHY, t)
          state.targetY = lerp(0, -0.5, t)
        } else if (p < 0.85) {
          // Philosophy: pull back, full network revealed
          const t = (p - 0.6) / 0.25
          state.targetZ = lerp(CAM_Z_PHILOSOPHY, CAM_Z_PHILOSOPHY, t)
          state.targetY = lerp(-0.5, 0, t)
        } else {
          // Contact: zoom into node
          const t = (p - 0.85) / 0.15
          state.targetZ = lerp(CAM_Z_PHILOSOPHY, CAM_Z_CONTACT, t)
          state.targetY = lerp(0, 0.4, t)
        }
      },
    })

    return () => st.kill()
  }, [])

  useFrame((_, delta) => {
    const mx = mouse.current.nx
    const my = mouse.current.ny

    camera.position.z += (state.targetZ - camera.position.z) * Math.min(delta * 3, 0.1)
    camera.position.x += (state.targetX + mx * 0.3 - camera.position.x) * Math.min(delta * 2.5, 0.08)
    camera.position.y += (state.targetY + my * 0.2 - camera.position.y) * Math.min(delta * 2.5, 0.08)

    // Subtle mouse-driven rotation — scene parallax
    camera.rotation.y += (-mx * 0.0005 - camera.rotation.y) * 0.05
    camera.rotation.x += (my * 0.0004 - camera.rotation.x) * 0.05
  })

  return null
}
