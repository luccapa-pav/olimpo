// Estrutura física: chão, paredes externas e barras LED lineares no teto
// LEDs: apenas barras PARALELAS (sentido Z, frente→fundo) — sem grid, sem cruzamentos

const WALL_H = 3.5;

function WallMaterial() {
  return <meshStandardMaterial color="#1A1A1A" roughness={0.9} metalness={0.05} />;
}

export function Floor() {
  return (
    <>
      {/* Chão principal — roughness 0.6 para reflexo sutil de luz */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.5, 0, -0.5]}>
        <planeGeometry args={[26, 24]} />
        <meshStandardMaterial color="#1C1C1C" roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Overlay piso CEO */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-11, 0.002, -9.5]}>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color="#161616" roughness={0.6} />
      </mesh>

      {/* Overlay piso Sala Privada 1 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, 0.002, -3.5]}>
        <planeGeometry args={[4, 3.5]} />
        <meshStandardMaterial color="#161616" roughness={0.6} />
      </mesh>

      {/* Overlay piso Sala Privada 2 — reposicionada: x[-9,-5], centro (-7, 0, -3.5) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7, 0.002, -3.5]}>
        <planeGeometry args={[4, 3.5]} />
        <meshStandardMaterial color="#161616" roughness={0.6} />
      </mesh>

      {/* Overlay piso Sala de Reunião: x[-8,-1], z[-12,-7], centro (-4.5, 0, -9.5) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.5, 0.002, -9.5]}>
        <planeGeometry args={[6.88, 4.88]} />
        <meshStandardMaterial color="#161616" roughness={0.6} />
      </mesh>

      {/* Soleira dourada entre corredor e salas privadas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-9, 0.003, -1.7]}>
        <planeGeometry args={[8.2, 0.06]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.4} />
      </mesh>
    </>
  );
}

export function Walls() {
  return (
    <>
      {/* ── Paredes ── */}
      <mesh position={[-1.5, WALL_H / 2, -12]}>
        <boxGeometry args={[26, WALL_H, 0.2]} />
        <WallMaterial />
      </mesh>
      <mesh position={[-14, WALL_H / 2, -0.5]}>
        <boxGeometry args={[0.2, WALL_H, 24]} />
        <WallMaterial />
      </mesh>
      <mesh position={[11, WALL_H / 2, -0.5]}>
        <boxGeometry args={[0.2, WALL_H, 24]} />
        <WallMaterial />
      </mesh>

      {/* ── Rodapés metálicos dourados ── */}
      <mesh position={[-1.5, 0.04, -11.9]}>
        <boxGeometry args={[26, 0.08, 0.02]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-13.9, 0.04, -0.5]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[24, 0.08, 0.02]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.3} />
      </mesh>

    </>
  );
}
