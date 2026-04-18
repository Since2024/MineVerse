import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const NODE_COUNT_DESKTOP = 200
const NODE_COUNT_MOBILE = 60

interface Props {
  isMobile: boolean
}

export function FloatingNodes({ isMobile }: Props) {
  const meshRef = useRef<THREE.Points>(null)
  const count = isMobile ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const colorA = new THREE.Color('#6C5CE7')
    const colorB = new THREE.Color('#00D4FF')

    // Deformed sphere distribution — fibonacci lattice for even coverage
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i

      const r = 2.4 + (Math.random() - 0.5) * 0.6
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

      const t = i / count
      const c = colorA.clone().lerp(colorB, t)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    return { positions, colors }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.04
      meshRef.current.rotation.x += delta * 0.015
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uTime;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vPulse;

          void main() {
            vColor = color;
            vPulse = sin(uTime * 0.9 + position.y * 2.5) * 0.5 + 0.5;

            vec3 pos = position;
            pos += normal * sin(uTime * 0.6 + position.x * 1.8) * 0.04;

            vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPos;
            gl_PointSize = (3.0 + vPulse * 2.0) * (300.0 / -mvPos.z);
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vPulse;

          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            if (d > 0.5) discard;

            float alpha = smoothstep(0.5, 0.05, d) * (0.5 + vPulse * 0.5);
            gl_FragColor = vec4(vColor, alpha);
          }
        `}
      />
    </points>
  )
}
