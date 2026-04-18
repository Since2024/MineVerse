import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

interface Props {
  position: [number, number, number]
  rotation: [number, number, number]
  targetRotation: [number, number, number]
  imageUrl: string
  scrollProgress: number
}

export function ProjectSlab({ position, rotation, targetRotation, imageUrl, scrollProgress }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const mouseUV = useRef(new THREE.Vector2(0.5, 0.5))

  const texture = useTexture(imageUrl)

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [texture]
  )

  useFrame((_state, delta) => {
    uniforms.uTime.value += delta

    if (meshRef.current) {
      const targetY = hovered ? targetRotation[1] * 0.5 : targetRotation[1] * scrollProgress
      meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.06

      gsap_lerp(uniforms.uHover, hovered ? 1 : 0, 0.08)
      uniforms.uMouse.value.lerp(mouseUV.current, 0.1)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={(e) => {
        if (meshRef.current && e.uv) {
          mouseUV.current.copy(e.uv)
        }
      }}
    >
      <planeGeometry args={[3.2, 2, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          uniform float uTime;
          uniform float uHover;
          uniform vec2 uMouse;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            vec2 delta = uv - uMouse;
            float dist = length(delta);
            float ripple = uHover * sin(dist * 22.0 - uTime * 4.5) * 0.014 * smoothstep(0.55, 0.0, dist);
            uv += ripple * normalize(delta + 0.001);

            float scanline = sin(uv.y * 600.0 + uTime * 0.5) * 0.025 + 1.0;
            vec4 tex = texture2D(uTexture, uv);
            tex.rgb *= scanline;

            vec2 vig = vUv * (1.0 - vUv);
            float vignette = pow(vig.x * vig.y * 15.0, 0.28);
            tex.rgb *= vignette;

            gl_FragColor = tex;
          }
        `}
      />
    </mesh>
  )
}

// inline lerp for uniform values
function gsap_lerp(obj: { value: number }, target: number, factor: number) {
  obj.value += (target - obj.value) * factor
}
