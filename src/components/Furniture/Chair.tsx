// Cadeira gaming/ergonômica preta
interface ChairProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function Chair({ position, rotation = [0, 0, 0] }: ChairProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Assento */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.55, 0.08, 0.55]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.9} />
      </mesh>

      {/* Encosto */}
      <mesh position={[0, 0.9, -0.22]} castShadow>
        <boxGeometry args={[0.52, 0.75, 0.07]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.9} />
      </mesh>

      {/* Apoio de cabeça */}
      <mesh position={[0, 1.33, -0.2]}>
        <boxGeometry args={[0.3, 0.22, 0.07]} />
        <meshStandardMaterial color="#252525" roughness={0.9} />
      </mesh>

      {/* Coluna central */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Base estrela */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.28,
            0.03,
            Math.sin((angle * Math.PI) / 180) * 0.28,
          ]}
          rotation={[0, (-angle * Math.PI) / 180, 0]}
        >
          <boxGeometry args={[0.28, 0.04, 0.06]} />
          <meshStandardMaterial color="#222222" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* Braços */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.28, 0.62, -0.05]}>
          <boxGeometry args={[0.06, 0.08, 0.32]} />
          <meshStandardMaterial color="#252525" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
