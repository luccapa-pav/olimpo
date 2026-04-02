// Elementos vegetais e decorativos do escritório

// ── Vaso grande de chão — São Jorge (Sansevieria) ─────────────────────────────
export function LargePot({ position }: { position: [number, number, number] }) {
  const LEAF_H = 0.88;
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <group position={position}>
      {/* Vaso */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.19, 0.15, 0.44, 14]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.85} />
      </mesh>
      {/* Borda */}
      <mesh position={[0, 0.445, 0]}>
        <torusGeometry args={[0.19, 0.015, 6, 16]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.8} />
      </mesh>
      {/* Terra */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.44, 0]}>
        <circleGeometry args={[0.18, 12]} />
        <meshStandardMaterial color="#1A1008" roughness={1.0} />
      </mesh>
      {/* Folhas de espada */}
      {angles.map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        const spread = 0.055 + (i % 2) * 0.035;
        return (
          <mesh
            key={i}
            position={[Math.sin(r) * spread, 0.44 + LEAF_H / 2, Math.cos(r) * spread]}
            rotation={[(i % 2) * 0.13, r, (i % 3 === 0 ? 0.06 : -0.06)]}
          >
            <boxGeometry args={[0.038, LEAF_H, 0.012]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#1E4228' : '#2A5C35'} roughness={0.88} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Planta de chão (vaso + folhas esféricas) ─────────────────────────────────
interface PlantProps {
  position: [number, number, number];
  scale?: number;
}

export function Plant({ position, scale = 1 }: PlantProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.22, 12]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 12]} />
        <meshStandardMaterial color="#1A1A1A" roughness={1} />
      </mesh>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.12,
            0.35 + (i % 2) * 0.08,
            Math.sin((angle * Math.PI) / 180) * 0.12,
          ]}
          rotation={[-0.3, (-angle * Math.PI) / 180, 0.2 * (i % 2 === 0 ? 1 : -1)]}
        >
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color="#2D5A3D" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ── Planta decorativa alta (cilindro fino + esfera verde) ─────────────────────
interface DecoPlantProps {
  position: [number, number, number];
  height?: number;
  leafColor?: string;
}

export function DecoPlant({ position, height = 0.9, leafColor = '#2D5A3D' }: DecoPlantProps) {
  const leafCount = 4;
  return (
    <group position={position}>
      {/* Vaso */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.11, 0.085, 0.28, 10]} />
        <meshStandardMaterial color="#222222" roughness={0.9} />
      </mesh>
      {/* Borda do vaso */}
      <mesh position={[0, 0.275, 0]}>
        <torusGeometry args={[0.11, 0.012, 6, 12]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>
      {/* Terra */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.272, 0]}>
        <circleGeometry args={[0.10, 10]} />
        <meshStandardMaterial color="#1A1008" roughness={1.0} />
      </mesh>
      {/* 4 caules arqueados com folhas — estilo Zamioculca */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 8;
        const lean = 0.18 + (i % 2) * 0.08;
        const sx = Math.sin(angle) * lean;
        const sz = Math.cos(angle) * lean;
        return (
          <group key={i}>
            {/* Caule */}
            <mesh
              position={[sx * 0.5, 0.28 + height * 0.4, sz * 0.5]}
              rotation={[sz * 0.35, angle, -sx * 0.35]}
            >
              <cylinderGeometry args={[0.006, 0.009, height * 0.85, 6]} />
              <meshStandardMaterial color="#3A2A12" roughness={0.9} />
            </mesh>
            {/* Folhetos ao longo do caule */}
            {Array.from({ length: leafCount }, (_, j) => {
              const t = (j + 1) / (leafCount + 1);
              return (
                <mesh
                  key={j}
                  position={[sx * (0.3 + t * 0.7), 0.28 + height * t * 0.9, sz * (0.3 + t * 0.7)]}
                  rotation={[sz * 0.5 * t, angle + Math.PI / 2, -sx * 0.5 * t]}
                >
                  <boxGeometry args={[0.005, 0.085, 0.042]} />
                  <meshStandardMaterial color={j % 2 === 0 ? leafColor : '#3A6B4A'} roughness={0.88} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

// ── Máquina de café ───────────────────────────────────────────────────────────
interface CoffeeMachineProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function CoffeeMachine({ position, rotation = [0, 0, 0] }: CoffeeMachineProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Corpo principal */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.28, 0.42, 0.22]} />
        <meshStandardMaterial color="#111111" metalness={0.55} roughness={0.45} />
      </mesh>
      {/* Painel superior */}
      <mesh position={[0, 0.435, 0]}>
        <boxGeometry args={[0.26, 0.02, 0.20]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Reservatório de água (vidro translúcido) */}
      <mesh position={[0, 0.34, -0.085]}>
        <boxGeometry args={[0.16, 0.16, 0.055]} />
        <meshPhysicalMaterial
          color="#1E2A3A"
          transmission={0.4}
          roughness={0.1}
          thickness={0.04}
          transparent
          opacity={0.65}
        />
      </mesh>
      {/* Bandeja gotejadora */}
      <mesh position={[0, 0.065, 0.05]}>
        <boxGeometry args={[0.20, 0.035, 0.13]} />
        <meshStandardMaterial color="#222222" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Grade da bandeja */}
      <mesh position={[0, 0.085, 0.05]}>
        <boxGeometry args={[0.18, 0.006, 0.11]} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Bico dispensador */}
      <mesh position={[0, 0.22, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.013, 0.013, 0.075, 10]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Faixa metálica */}
      <mesh position={[0, 0.28, 0.115]}>
        <boxGeometry args={[0.18, 0.038, 0.008]} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Botões */}
      {[-0.055, 0, 0.055].map((x, i) => (
        <mesh key={i} position={[x, 0.32, 0.115]}>
          <cylinderGeometry args={[0.014, 0.014, 0.01, 10]} />
          <meshStandardMaterial
            color={i === 1 ? '#1A3A1A' : '#1A1A2A'}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      ))}
      {/* Indicador vermelho de energia */}
      <mesh position={[0.10, 0.36, 0.116]}>
        <sphereGeometry args={[0.011, 10, 10]} />
        <meshStandardMaterial color="#CC2200" emissive="#CC2200" emissiveIntensity={2.5} />
      </mesh>
      {/* Logo / plaquinha */}
      <mesh position={[0, 0.18, 0.116]}>
        <boxGeometry args={[0.10, 0.03, 0.005]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

// ── Vaso suspenso pra prateleira ──────────────────────────────────────────────
interface HangingPlantProps {
  position: [number, number, number];
}

export function HangingPlant({ position }: HangingPlantProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.3, 6]} />
        <meshStandardMaterial color="#4A3828" roughness={1} />
      </mesh>
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.12, 0.09, 0.2, 12]} />
        <meshStandardMaterial color="#2A2020" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.115, 0.115, 0.02, 12]} />
        <meshStandardMaterial color="#1A1010" roughness={1} />
      </mesh>
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <group key={i} position={[Math.cos(rad) * 0.08, 0.0, Math.sin(rad) * 0.08]}>
            {[0, 1, 2].map((seg) => (
              <mesh
                key={seg}
                position={[
                  Math.cos(rad) * seg * 0.06,
                  -seg * 0.12,
                  Math.sin(rad) * seg * 0.06,
                ]}
              >
                <sphereGeometry args={[0.055 - seg * 0.01, 8, 6]} />
                <meshStandardMaterial color="#2D5A3D" roughness={0.9} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

// ── Prateleira com vasos suspensos ────────────────────────────────────────────
interface ShelfWithPlantsProps {
  position: [number, number, number];
  count?: number;
}

export function ShelfWithPlants({ position, count = 3 }: ShelfWithPlantsProps) {
  const spacing = 0.6;
  const totalW = (count - 1) * spacing;
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[totalW + 0.4, 0.06, 0.2]} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[-(totalW / 2 + 0.1), -0.15, 0]}>
        <boxGeometry args={[0.05, 0.3, 0.18]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[totalW / 2 + 0.1, -0.15, 0]}>
        <boxGeometry args={[0.05, 0.3, 0.18]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </mesh>
      {Array.from({ length: count }).map((_, i) => (
        <HangingPlant key={i} position={[i * spacing - totalW / 2, 0.15, 0]} />
      ))}
    </group>
  );
}

// ── Suculenta pra cima da mesa ────────────────────────────────────────────────
interface SucculentProps {
  position: [number, number, number];
}

export function Succulent({ position }: SucculentProps) {
  return (
    <group position={position} scale={0.7}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.08, 0.065, 0.1, 12]} />
        <meshStandardMaterial color="#2A1A1A" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.078, 0.078, 0.015, 12]} />
        <meshStandardMaterial color="#1A0A0A" roughness={1} />
      </mesh>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const r = i % 2 === 0 ? 0.055 : 0.03;
        const h = i % 2 === 0 ? 0.14 : 0.1;
        return (
          <mesh
            key={i}
            position={[Math.cos(rad) * r, 0.14 + (i % 2) * 0.03, Math.sin(rad) * r]}
            rotation={[Math.cos(rad) * 0.5, 0, Math.sin(rad) * 0.5]}
          >
            <coneGeometry args={[0.035, h, 6]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#3A6B4A' : '#2D5A3D'} roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Planta trepadeira pra cantos ──────────────────────────────────────────────
interface ClimbingPlantProps {
  position: [number, number, number];
  height?: number;
}

export function ClimbingPlant({ position, height = 2.5 }: ClimbingPlantProps) {
  const segments = Math.floor(height / 0.35);
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.28, 12]} />
        <meshStandardMaterial color="#2A2020" roughness={0.9} />
      </mesh>
      <mesh position={[0.05, height / 2, 0.05]}>
        <cylinderGeometry args={[0.018, 0.025, height, 6]} />
        <meshStandardMaterial color="#3A2A1A" roughness={1} />
      </mesh>
      {Array.from({ length: segments }).map((_, i) => {
        const t = i / segments;
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <mesh
            key={i}
            position={[
              0.05 + side * (0.06 + Math.sin(t * 8) * 0.04),
              0.3 + t * height,
              0.05 + (i % 3 === 0 ? 0.05 : -0.03),
            ]}
            rotation={[side * 0.4, (i * 0.7) % (Math.PI * 2), side * 0.3]}
          >
            <sphereGeometry args={[0.07 + (i % 3) * 0.02, 8, 6]} />
            <meshStandardMaterial color={i % 3 === 0 ? '#2D5A3D' : '#3A6B4A'} roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}
