export function Lights() {
  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight
        position={[4, 4, 4]}
        intensity={12}
        color="#6C5CE7"
        distance={18}
        decay={2}
      />
      <pointLight
        position={[-4, -2, 2]}
        intensity={8}
        color="#00D4FF"
        distance={14}
        decay={2}
      />
      <spotLight
        position={[0, 8, 4]}
        angle={0.35}
        penumbra={0.8}
        intensity={20}
        color="#ffffff"
        castShadow={false}
      />
    </>
  )
}
