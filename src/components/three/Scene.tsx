import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { Lights } from './Lights'
import { CameraRig } from './CameraRig'
import { FloatingNodes } from './FloatingNodes'
import { NeuralNetwork } from './NeuralNetwork'

const isMobile = () => window.innerWidth < 768
const mobile = isMobile()

function Icosahedron() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.18
      meshRef.current.rotation.x += delta * 0.06
    }
  })

  return (
    <mesh ref={meshRef} castShadow={false}>
      <icosahedronGeometry args={[1, 1]} />
      {mobile ? (
        <meshStandardMaterial
          color="#6C5CE7"
          metalness={0.8}
          roughness={0.1}
          envMapIntensity={2}
        />
      ) : (
        <MeshTransmissionMaterial
          thickness={1.5}
          ior={1.4}
          chromaticAberration={0.05}
          backside
          backsideThickness={0.5}
          samples={6}
          resolution={512}
          color="#8875f8"
          attenuationColor="#6C5CE7"
          attenuationDistance={0.8}
          roughness={0.05}
          metalness={0.0}
          transmission={1}
        />
      )}
    </mesh>
  )
}

function PostFX() {
  if (mobile) return null
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.3}
        radius={0.8}
      />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0008, 0.0008)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise
        opacity={0.06}
        blendFunction={BlendFunction.SCREEN}
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}

export function Scene() {
  return (
    <Canvas
      id="r3f-canvas"
      camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{
        antialias: !mobile,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      style={{ background: '#050507' }}
    >
      <Suspense fallback={null}>
        <CameraRig />
        <Lights />
        <Environment preset="night" />
        <Icosahedron />
        <FloatingNodes isMobile={mobile} />
        <NeuralNetwork />
        <PostFX />
      </Suspense>
    </Canvas>
  )
}
