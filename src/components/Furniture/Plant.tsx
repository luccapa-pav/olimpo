// Elementos vegetais do escritório — todos com geometria primitiva estilizada

// Planta de chão (vaso + folhas esféricas)
interface PlantProps {
  position: [number, number, number];
  scale?: number;
}

export function Plant({ position, scale = 1 }: PlantProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.22, 8]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 8]} />
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
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#2D5A3D" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// Vaso suspenso pra prateleira do CEO
interface HangingPlantProps {
  position: [number, number, number];
}

export function HangingPlant({ position }: HangingPlantProps) {
  return (
    <group position={position}>
      {/* Corda de suspensão */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.3, 4]} />
        <meshStandardMaterial color="#4A3828" roughness={1} />
      </mesh>
      {/* Vaso */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.12, 0.09, 0.2, 8]} />
        <meshStandardMaterial color="#2A2020" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Terra */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.115, 0.115, 0.02, 8]} />
        <meshStandardMaterial color="#1A1010" roughness={1} />
      </mesh>
      {/* Folhas pendentes — caem do vaso */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <group key={i} position={[Math.cos(rad) * 0.08, 0.0, Math.sin(rad) * 0.08]}>
            {/* Haste */}
            {[0, 1, 2].map((seg) => (
              <mesh
                key={seg}
                position={[
                  Math.cos(rad) * seg * 0.06,
                  -seg * 0.12,
                  Math.sin(rad) * seg * 0.06,
                ]}
              >
                <sphereGeometry args={[0.055 - seg * 0.01, 5, 5]} />
                <meshStandardMaterial color="#2D5A3D" roughness={0.9} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

// Prateleira com vasos suspensos pra sala do CEO
interface ShelfWithPlantsProps {
  position: [number, number, number];
  count?: number;
}

export function ShelfWithPlants({ position, count = 3 }: ShelfWithPlantsProps) {
  const spacing = 0.6;
  const totalW = (count - 1) * spacing;
  return (
    <group position={position}>
      {/* Prateleira */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[totalW + 0.4, 0.06, 0.2]} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Suporte L esquerdo */}
      <mesh position={[-(totalW / 2 + 0.1), -0.15, 0]}>
        <boxGeometry args={[0.05, 0.3, 0.18]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Suporte L direito */}
      <mesh position={[totalW / 2 + 0.1, -0.15, 0]}>
        <boxGeometry args={[0.05, 0.3, 0.18]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Vasos suspensos */}
      {Array.from({ length: count }).map((_, i) => (
        <HangingPlant
          key={i}
          position={[i * spacing - totalW / 2, 0.15, 0]}
        />
      ))}
    </group>
  );
}

// Suculenta pequena pra cima da mesa
interface SucculentProps {
  position: [number, number, number];
}

export function Succulent({ position }: SucculentProps) {
  return (
    <group position={position} scale={0.7}>
      {/* Vaso pequeno */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.08, 0.065, 0.1, 8]} />
        <meshStandardMaterial color="#2A1A1A" roughness={0.9} />
      </mesh>
      {/* Terra */}
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.078, 0.078, 0.015, 8]} />
        <meshStandardMaterial color="#1A0A0A" roughness={1} />
      </mesh>
      {/* Folhas da suculenta — roseta de cones achatados */}
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
            <coneGeometry args={[0.035, h, 5]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#3A6B4A' : '#2D5A3D'} roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

// Planta trepadeira pra cantos (paredes)
interface ClimbingPlantProps {
  position: [number, number, number];
  height?: number;
}

export function ClimbingPlant({ position, height = 2.5 }: ClimbingPlantProps) {
  const segments = Math.floor(height / 0.35);
  return (
    <group position={position}>
      {/* Vaso base */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.28, 8]} />
        <meshStandardMaterial color="#2A2020" roughness={0.9} />
      </mesh>
      {/* Caule principal */}
      <mesh position={[0.05, height / 2, 0.05]}>
        <cylinderGeometry args={[0.018, 0.025, height, 5]} />
        <meshStandardMaterial color="#3A2A1A" roughness={1} />
      </mesh>
      {/* Folhas espalhadas ao longo do caule */}
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
            rotation={[
              side * 0.4,
              (i * 0.7) % (Math.PI * 2),
              side * 0.3,
            ]}
          >
            <sphereGeometry args={[0.07 + (i % 3) * 0.02, 5, 4]} />
            <meshStandardMaterial color={i % 3 === 0 ? '#2D5A3D' : '#3A6B4A'} roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}
