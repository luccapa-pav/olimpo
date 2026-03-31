// Chão do escritório: concreto polido escuro com grid sutil
export function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial
        color="#111111"
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}

// Paredes do escritório
export function Walls() {
  return (
    <>
      {/* Parede fundo (norte) */}
      <mesh position={[0, 2.5, -12]} receiveShadow>
        <boxGeometry args={[30, 5, 0.2]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} />
      </mesh>

      {/* Parede esquerda (oeste) */}
      <mesh position={[-15, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 24]} />
        <meshStandardMaterial color="#181818" roughness={0.9} />
      </mesh>

      {/* Parede direita (leste) */}
      <mesh position={[15, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5, 24]} />
        <meshStandardMaterial color="#181818" roughness={0.9} />
      </mesh>

      {/* Teto */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[30, 0.2, 24]} />
        <meshStandardMaterial color="#0D0D0D" roughness={1} />
      </mesh>

      {/* Faixas LED no teto */}
      <mesh position={[-5, 4.85, 0]}>
        <boxGeometry args={[0.15, 0.05, 20]} />
        <meshStandardMaterial color="#E8E8E8" emissive="#E8E8E8" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[5, 4.85, 0]}>
        <boxGeometry args={[0.15, 0.05, 20]} />
        <meshStandardMaterial color="#E8E8E8" emissive="#E8E8E8" emissiveIntensity={0.8} />
      </mesh>
    </>
  );
}
