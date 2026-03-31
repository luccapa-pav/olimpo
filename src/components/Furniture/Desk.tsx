// Mesa de trabalho com superfície escura e borda metálica
interface DeskProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function Desk({ position, rotation = [0, 0, 0] }: DeskProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Tampo da mesa */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.06, 0.85]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Borda metálica frontal */}
      <mesh position={[0, 0.73, 0.43]}>
        <boxGeometry args={[1.6, 0.03, 0.02]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pernas */}
      {[[-0.72, -0.38], [0.72, -0.38], [-0.72, 0.38], [0.72, 0.38]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z]} castShadow>
          <boxGeometry args={[0.06, 0.7, 0.06]} />
          <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Bandeja inferior */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.4, 0.03, 0.6]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
    </group>
  );
}
