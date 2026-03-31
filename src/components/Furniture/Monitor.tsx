// Monitor com tela com glow azulado
interface MonitorProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  active?: boolean;
  accentColor?: string;
}

export function Monitor({ position, rotation = [0, 0, 0], active = true, accentColor = '#4A90D9' }: MonitorProps) {
  const screenColor = active ? accentColor : '#111111';
  const emissiveIntensity = active ? 0.6 : 0;

  return (
    <group position={position} rotation={rotation}>
      {/* Tela */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 0.55, 0.04]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Display */}
      <mesh position={[0, 0, 0.022]}>
        <boxGeometry args={[0.82, 0.48, 0.001]} />
        <meshStandardMaterial
          color={screenColor}
          emissive={screenColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.1}
        />
      </mesh>

      {/* Moldura */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[0.2, 0.04, 0.04]} />
        <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Base */}
      <mesh position={[0, -0.38, 0.06]}>
        <boxGeometry args={[0.35, 0.04, 0.2]} />
        <meshStandardMaterial color="#1E1E1E" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}
