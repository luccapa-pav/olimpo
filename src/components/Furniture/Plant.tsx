// Planta decorativa — vaso + folhas
interface PlantProps {
  position: [number, number, number];
  scale?: number;
}

export function Plant({ position, scale = 1 }: PlantProps) {
  return (
    <group position={position} scale={scale}>
      {/* Vaso */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.22, 8]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.8} />
      </mesh>

      {/* Terra */}
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 8]} />
        <meshStandardMaterial color="#1A1A1A" roughness={1} />
      </mesh>

      {/* Folhas */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.12,
            0.35 + (i % 2) * 0.08,
            Math.sin((angle * Math.PI) / 180) * 0.12,
          ]}
          rotation={[
            -0.3,
            (-angle * Math.PI) / 180,
            0.2 * (i % 2 === 0 ? 1 : -1),
          ]}
        >
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#2D5A3D" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
