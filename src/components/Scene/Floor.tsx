// Estrutura física: chão, paredes externas e LEDs de contorno

const WALL_H = 3.5;

function WallMaterial() {
  return <meshStandardMaterial color="#1A1A1A" roughness={0.9} metalness={0.05} />;
}

export function Floor() {
  return (
    <>
      {/* Chão principal — concreto polido escuro */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-1.5, 0, -0.5]}>
        <planeGeometry args={[26, 24]} />
        <meshPhysicalMaterial color="#161616" roughness={0.12} metalness={0.45} reflectivity={0.8} />
      </mesh>

      {/* Overlay piso CEO */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-11, 0.002, -9.5]}>
        <planeGeometry args={[6, 5]} />
        <meshPhysicalMaterial color="#111111" roughness={0.15} metalness={0.3} />
      </mesh>

      {/* Overlay piso Sala Privada 1 — parede leste */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[9.0, 0.002, -8.5]}>
        <planeGeometry args={[2.38, 2.38]} />
        <meshPhysicalMaterial color="#111111" roughness={0.15} metalness={0.3} />
      </mesh>

      {/* Overlay piso Sala Privada 2 — parede leste */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[9.0, 0.002, -5.75]}>
        <planeGeometry args={[2.38, 2.38]} />
        <meshPhysicalMaterial color="#111111" roughness={0.15} metalness={0.3} />
      </mesh>

      {/* Overlay piso Sala de Reunião */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.5, 0.002, -9.5]}>
        <planeGeometry args={[6.88, 4.88]} />
        <meshPhysicalMaterial color="#111111" roughness={0.15} metalness={0.3} />
      </mesh>

      {/* ── LEDs dourados de contorno do chão ── */}

      {/* Soleira — entrada das salas privadas (sul das salas) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-11.25, 0.003, -4.25]}>
        <planeGeometry args={[5.5, 0.055]} />
        <meshStandardMaterial color="#DAA520" emissive="#DAA520" emissiveIntensity={0.5} />
      </mesh>

      {/* LED parede norte (fundo) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.5, 0.003, -11.9]}>
        <planeGeometry args={[26, 0.055]} />
        <meshStandardMaterial color="#DAA520" emissive="#DAA520" emissiveIntensity={0.4} />
      </mesh>

      {/* LED parede oeste (esquerda) */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[-13.9, 0.003, -0.5]}>
        <planeGeometry args={[24, 0.055]} />
        <meshStandardMaterial color="#DAA520" emissive="#DAA520" emissiveIntensity={0.4} />
      </mesh>

      {/* LED parede leste (direita) */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[10.9, 0.003, -0.5]}>
        <planeGeometry args={[24, 0.055]} />
        <meshStandardMaterial color="#DAA520" emissive="#DAA520" emissiveIntensity={0.4} />
      </mesh>

      {/* LED frente sul */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.5, 0.003, 11.4]}>
        <planeGeometry args={[26, 0.055]} />
        <meshStandardMaterial color="#DAA520" emissive="#DAA520" emissiveIntensity={0.35} />
      </mesh>

      {/* ── Cove LED ceiling strips (y=3.46) ── */}

      {/* Norte */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-1.5, 3.46, -11.85]}>
        <planeGeometry args={[26, 0.08]} />
        <meshStandardMaterial color="#FFF8E7" emissive="#FFF8E7" emissiveIntensity={0.8} />
      </mesh>

      {/* Oeste */}
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[-13.85, 3.46, -0.5]}>
        <planeGeometry args={[24, 0.08]} />
        <meshStandardMaterial color="#FFF8E7" emissive="#FFF8E7" emissiveIntensity={0.8} />
      </mesh>

      {/* Leste */}
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[10.85, 3.46, -0.5]}>
        <planeGeometry args={[24, 0.08]} />
        <meshStandardMaterial color="#FFF8E7" emissive="#FFF8E7" emissiveIntensity={0.8} />
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

      {/* ── Painéis acústicos — parede norte (8 painéis, y=2.2) ── */}
      {Array.from({ length: 8 }, (_, i) => {
        const panelW = 2.8;
        const gap = 0.08;
        const totalW = 8 * panelW + 7 * gap;
        const startX = -1.5 - totalW / 2 + panelW / 2;
        return (
          <mesh key={`ap${i}`} position={[startX + i * (panelW + gap), 2.2, -11.78]}>
            <boxGeometry args={[panelW, 1.0, 0.04]} />
            <meshStandardMaterial color="#222222" roughness={1.0} metalness={0} />
          </mesh>
        );
      })}

      {/* ── Rodapés metálicos dourados ── */}
      <mesh position={[-1.5, 0.04, -11.9]}>
        <boxGeometry args={[26, 0.08, 0.02]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-13.9, 0.04, -0.5]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[24, 0.08, 0.02]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[10.9, 0.04, -0.5]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[24, 0.08, 0.02]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.3} />
      </mesh>
    </>
  );
}

