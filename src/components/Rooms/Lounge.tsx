// Lounge — Área de Descompressão, canto sudeste: centro [7.5, 0, 7.5]

const SOFA_COLOR = '#1A1A1E';
const CUSHION_COLOR = '#232330';
const TABLE_COLOR = '#0E0E0E';
const RUG_COLOR = '#1A1010';

function Sofa({ position, rotation = [0, 0, 0] as [number, number, number] }: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const [x, y, z] = position;
  return (
    <group position={[x, y, z]} rotation={rotation}>
      {/* Assento */}
      <mesh position={[0, 0.20, 0]}>
        <boxGeometry args={[1.8, 0.40, 0.75]} />
        <meshStandardMaterial color={SOFA_COLOR} roughness={0.92} />
      </mesh>
      {/* Almofadas do assento */}
      <mesh position={[-0.45, 0.36, 0]}>
        <boxGeometry args={[0.72, 0.10, 0.60]} />
        <meshStandardMaterial color={CUSHION_COLOR} roughness={0.95} />
      </mesh>
      <mesh position={[0.45, 0.36, 0]}>
        <boxGeometry args={[0.72, 0.10, 0.60]} />
        <meshStandardMaterial color={CUSHION_COLOR} roughness={0.95} />
      </mesh>
      {/* Encosto */}
      <mesh position={[0, 0.48, -0.32]}>
        <boxGeometry args={[1.8, 0.44, 0.14]} />
        <meshStandardMaterial color={SOFA_COLOR} roughness={0.92} />
      </mesh>
      {/* Apoio de braço esquerdo */}
      <mesh position={[-0.87, 0.30, 0]}>
        <boxGeometry args={[0.12, 0.24, 0.75]} />
        <meshStandardMaterial color={SOFA_COLOR} roughness={0.92} />
      </mesh>
      {/* Apoio de braço direito */}
      <mesh position={[0.87, 0.30, 0]}>
        <boxGeometry args={[0.12, 0.24, 0.75]} />
        <meshStandardMaterial color={SOFA_COLOR} roughness={0.92} />
      </mesh>
      {/* Base/pernas */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[1.76, 0.08, 0.70]} />
        <meshStandardMaterial color="#111111" roughness={0.85} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function Lounge() {
  return (
    <group>
      {/* Tapete */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.5, 0.005, 7.5]}>
        <planeGeometry args={[4.8, 3.8]} />
        <meshStandardMaterial
          color={RUG_COLOR}
          roughness={0.95}
          metalness={0}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* Sofá 1 — lado norte, virado para o sul */}
      <Sofa position={[7.5, 0, 6.2]} rotation={[0, Math.PI, 0]} />

      {/* Sofá 2 — lado sul, virado para o norte */}
      <Sofa position={[7.5, 0, 8.8]} rotation={[0, 0, 0]} />

      {/* Mesa de centro — tampo */}
      <mesh position={[7.5, 0.33, 7.5]}>
        <boxGeometry args={[1.2, 0.055, 0.65]} />
        <meshStandardMaterial color={TABLE_COLOR} metalness={0.55} roughness={0.35} />
      </mesh>
      {/* Mesa de centro — pernas */}
      {([[-0.5, -0.27], [0.5, -0.27], [-0.5, 0.27], [0.5, 0.27]] as [number, number][]).map(([ox, oz], i) => (
        <mesh key={i} position={[7.5 + ox, 0.165, 7.5 + oz]}>
          <cylinderGeometry args={[0.025, 0.025, 0.33, 8]} />
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Luminária de ambiente */}
      <pointLight position={[7.5, 2.5, 7.5]} intensity={0.35} color="#FFE8C0" distance={5} decay={2} />
    </group>
  );
}
