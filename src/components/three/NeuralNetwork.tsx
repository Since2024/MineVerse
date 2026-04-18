import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const NODE_COUNT = 80
const CONNECTION_RADIUS = 1.8

export function NeuralNetwork() {
  const linesRef = useRef<THREE.LineSegments>(null)
  const pointsRef = useRef<THREE.Points>(null)

  const { nodePositions, linePositions, lineUvs } = useMemo(() => {
    const nodePositions = new Float32Array(NODE_COUNT * 3)
    const connections: number[] = []
    const uvs: number[] = []

    // Force-spread nodes in a rough sphere
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.5 + Math.random() * 1.5
      nodePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      nodePositions[i * 3 + 1] = r * Math.cos(phi)
      nodePositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }

    // Connect nearby nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = nodePositions[i * 3] - nodePositions[j * 3]
        const dy = nodePositions[i * 3 + 1] - nodePositions[j * 3 + 1]
        const dz = nodePositions[i * 3 + 2] - nodePositions[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < CONNECTION_RADIUS) {
          connections.push(
            nodePositions[i * 3], nodePositions[i * 3 + 1], nodePositions[i * 3 + 2],
            nodePositions[j * 3], nodePositions[j * 3 + 1], nodePositions[j * 3 + 2]
          )
          uvs.push(0, 0, 1, 0)
        }
      }
    }

    return {
      nodePositions,
      linePositions: new Float32Array(connections),
      lineUvs: new Float32Array(uvs),
    }
  }, [])

  const lineUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#6C5CE7') },
      uOpacity: { value: 0.35 },
    }),
    []
  )

  const nodeUniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((_, delta) => {
    lineUniforms.uTime.value += delta
    nodeUniforms.uTime.value += delta
    if (linesRef.current) linesRef.current.rotation.y += delta * 0.025
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.025
  })

  return (
    <group>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-uv" args={[lineUvs, 2]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={lineUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            uniform vec3 uColor;
            uniform float uOpacity;
            varying vec2 vUv;

            void main() {
              float pulse = fract(vUv.x - uTime * 0.35);
              float beam = smoothstep(0.0, 0.12, pulse) * smoothstep(0.3, 0.12, pulse);
              float fade = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
              float alpha = (beam * 0.85 + 0.08) * fade * uOpacity;
              gl_FragColor = vec4(uColor, alpha);
            }
          `}
        />
      </lineSegments>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={nodeUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`
            uniform float uTime;
            varying float vPulse;
            void main() {
              vPulse = sin(uTime * 1.1 + position.y * 3.0) * 0.5 + 0.5;
              vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * mvPos;
              gl_PointSize = (4.0 + vPulse * 3.0) * (300.0 / -mvPos.z);
            }
          `}
          fragmentShader={`
            varying float vPulse;
            void main() {
              vec2 uv = gl_PointCoord - 0.5;
              float d = length(uv);
              if (d > 0.5) discard;
              float alpha = smoothstep(0.5, 0.05, d) * (0.6 + vPulse * 0.4);
              vec3 color = mix(vec3(0.424, 0.361, 0.906), vec3(0.0, 0.831, 1.0), vPulse);
              gl_FragColor = vec4(color, alpha);
            }
          `}
        />
      </points>
    </group>
  )
}
