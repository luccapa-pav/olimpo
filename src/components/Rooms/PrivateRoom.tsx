import { Chair } from '../Furniture/Chair';

// Sala privada ~3×3.5 unidades internas
// Recebe `position` como centro da sala
// Paredes: 3 lados de vidro fosco + 1 parede opaca (norte/fundo)

const WALL_H = 3.5;
const W = 4.0;   // largura total (incluindo vidro)
const D = 3.5;   // profundidade total

interface PrivateRoomProps {
  position: [number, number, number];
  occupied?: boolean;
  roomName?: string;
}

function RoundTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.06, 24]} />
        <meshStandardMaterial color="#303030" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <torusGeometry args={[0.62, 0.022, 8, 24]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.045, 0.07, 0.7, 8]} />
        <meshStandardMaterial color="#3A3A3A" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.04, 12]} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

// Vidro fosco — mais privacidade que o CEO (transmission=0.3)
function FrostedGlass({
  position,
  args,
  rotation = [0, 0, 0] as [number, number, number],
}: {
  position: [number, number, number];
  args: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshPhysicalMaterial
        color="#1a2a3a"
        transmission={0.3}
        roughness={0.3}
        thickness={0.05}
        metalness={0.05}
        opacity={0.75}
        transparent
      />
    </mesh>
  );
}

// Indicador de status na porta
function DoorIndicator({
  occupied,
  offsetX,
  offsetZ,
}: {
  occupied: boolean;
  offsetX: number;
  offsetZ: number;
}) {
  const color = occupied ? '#CC3333' : '#00CC88';
  return (
    <group position={[offsetX, 1.1, offsetZ]}>
      <mesh>
        <boxGeometry args={[0.4, 0.16, 0.03]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>
      <mesh position={[-0.14, 0, 0.02]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.04, 0, 0.02]}>
        <boxGeometry args={[0.18, 0.04, 0.005]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

export function PrivateRoom({ position, occupied = false, roomName: _roomName = 'Sala' }: PrivateRoomProps) {
  const [px, py, pz] = position;

  const chairPositions: { pos: [number, number, number]; rot: [number, number, number] }[] = [
    { pos: [0, 0, 0.85],   rot: [0, Math.PI, 0] },
    { pos: [0, 0, -0.85],  rot: [0, 0, 0] },
    { pos: [0.85, 0, 0],   rot: [0, -Math.PI / 2, 0] },
    { pos: [-0.85, 0, 0],  rot: [0, Math.PI / 2, 0] },
  ];

  return (
    <group position={[px, py, pz]}>
      {/* Piso da sala — tom levemente diferente */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[W - 0.12, D - 0.12]} />
        <meshStandardMaterial color="#161616" roughness={0.9} />
      </mesh>

      {/* Parede fundo (norte) — opaca */}
      <mesh position={[0, WALL_H / 2, -D / 2]}>
        <boxGeometry args={[W, WALL_H, 0.15]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} />
      </mesh>

      {/* Vidro fosco — face sul (frente/porta) */}
      <FrostedGlass
        position={[0, WALL_H / 2, D / 2]}
        args={[W, WALL_H, 0.06]}
      />

      {/* Vidro fosco — face leste */}
      <FrostedGlass
        position={[W / 2, WALL_H / 2, 0]}
        args={[0.06, WALL_H, D]}
      />

      {/* Vidro fosco — face oeste */}
      <FrostedGlass
        position={[-W / 2, WALL_H / 2, 0]}
        args={[0.06, WALL_H, D]}
      />

      {/* Mesa redonda central */}
      <RoundTable position={[0, 0, 0]} />

      {/* 4 cadeiras ao redor */}
      {chairPositions.map(({ pos, rot }, i) => (
        <Chair key={i} position={pos} rotation={rot} />
      ))}

      {/* Porta de vidro com moldura na face sul */}
      <group position={[0, 0, D / 2]}>
        {/* Moldura */}
        <mesh position={[0, 0.75, 0.01]}>
          <boxGeometry args={[0.82, 1.52, 0.07]} />
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Vidro */}
        <mesh position={[0, 0.75, 0.01]}>
          <boxGeometry args={[0.68, 1.34, 0.05]} />
          <meshPhysicalMaterial
            color="#1a2a3a"
            transmission={0.5}
            roughness={0.1}
            thickness={0.04}
            transparent
            opacity={0.55}
          />
        </mesh>
        {/* Maçaneta */}
        <mesh position={[0.30, 0.75, 0.05]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Plaquinha com nome da sala */}
        <mesh position={[0, 1.65, 0.05]}>
          <boxGeometry args={[0.52, 0.12, 0.03]} />
          <meshStandardMaterial
            color="#8899AA"
            emissive="#8899AA"
            emissiveIntensity={0.4}
            metalness={0.4}
          />
        </mesh>
      </group>

      {/* Indicador de status ao lado da porta */}
      <DoorIndicator occupied={occupied} offsetX={0.55} offsetZ={D / 2 + 0.06} />
    </group>
  );
}
