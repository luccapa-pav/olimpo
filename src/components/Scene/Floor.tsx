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
        <meshStandardMaterial color="#141414" roughness={0.4} metalness={0.12} />
      </mesh>

      {/* Overlay piso CEO — dark noble wood */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-11, 0.01, -9.5]}>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial
          color="#1A0E06"
          roughness={0.6}
          metalness={0.05}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* Overlay piso Sala de Reunião — luxury carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.5, 0.01, -9.5]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial
          color="#14100A"
          roughness={1.0}
          metalness={0}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* Overlay piso Sala Privada 1 — deep navy */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.75, 0.01, -10.25]}>
        <planeGeometry args={[3.38, 3.38]} />
        <meshStandardMaterial
          color="#080E18"
          roughness={0.85}
          metalness={0}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* Overlay piso Sala Privada 2 — deep navy */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[9.0, 0.01, -10.25]}>
        <planeGeometry args={[3.38, 3.38]} />
        <meshStandardMaterial
          color="#080E18"
          roughness={0.85}
          metalness={0}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
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

      {/* Sul */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-1.5, 3.46, 11.85]}>
        <planeGeometry args={[26, 0.08]} />
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

      {/* Parede sul — fecha o void visível da câmera isométrica */}
      <mesh position={[-1.5, WALL_H / 2, 12]}>
        <boxGeometry args={[26, WALL_H, 0.2]} />
        <WallMaterial />
      </mesh>

      {/* Painéis acústicos parede sul */}
      {Array.from({ length: 8 }, (_, i) => {
        const panelW = 2.8;
        const gap = 0.08;
        const totalW = 8 * panelW + 7 * gap;
        const startX = -1.5 - totalW / 2 + panelW / 2;
        return (
          <mesh key={`sp${i}`} position={[startX + i * (panelW + gap), 2.2, 11.78]}>
            <boxGeometry args={[panelW, 1.0, 0.04]} />
            <meshStandardMaterial color="#222222" roughness={1.0} metalness={0} />
          </mesh>
        );
      })}

    </>
  );
}

