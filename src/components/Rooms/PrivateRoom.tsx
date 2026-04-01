import { Chair } from '../Furniture/Chair';

// Sala privada 2.5×2.5 — posicionada no canto superior esquerdo (atrás do CEO)
// Recebe `position` como centro da sala

const WALL_H = 3.5;
const W = 2.5;   // largura total
const D = 2.5;   // profundidade total

interface PrivateRoomProps {
  position: [number, number, number];
  occupied?: boolean;
  roomName?: string;
}

function RoundTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.06, 24]} />
        <meshStandardMaterial color="#303030" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <torusGeometry args={[0.48, 0.018, 8, 24]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.7, 12]} />
        <meshStandardMaterial color="#3A3A3A" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 12]} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

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
        color="#b8d4e8"
        transmission={0.92}
        roughness={0.06}
        thickness={0.25}
        metalness={0}
        ior={1.5}
      />
    </mesh>
  );
}

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
        <sphereGeometry args={[0.04, 10, 10]} />
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

  // 3 cadeiras ao redor da mesa redonda
  const chairPositions: { pos: [number, number, number]; rot: [number, number, number] }[] = [
    { pos: [0, 0, 0.70],    rot: [0, Math.PI, 0] },
    { pos: [-0.62, 0, -0.48], rot: [0, 0.55, 0] },
    { pos: [0.62, 0, -0.48],  rot: [0, -0.55, 0] },
  ];

  return (
    <group position={[px, py, pz]}>
      {/* Piso da sala */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[W - 0.12, D - 0.12]} />
        <meshStandardMaterial color="#161616" roughness={0.9} />
      </mesh>

      {/* Luz interna quente */}
      <pointLight position={[0, 2.8, 0]} intensity={0.35} color="#FFF5E6" distance={5} decay={2} />

      {/* Parede fundo (norte) — opaca */}
      <mesh position={[0, WALL_H / 2, -D / 2]}>
        <boxGeometry args={[W, WALL_H, 0.15]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} />
      </mesh>

      {/* Vidro fosco — face sul (frente/porta) */}
      <FrostedGlass position={[0, WALL_H / 2, D / 2]} args={[W, WALL_H, 0.06]} />

      {/* Vidro fosco — face leste */}
      <FrostedGlass position={[W / 2, WALL_H / 2, 0]} args={[0.06, WALL_H, D]} />

      {/* Vidro fosco — face oeste */}
      <FrostedGlass position={[-W / 2, WALL_H / 2, 0]} args={[0.06, WALL_H, D]} />

      {/* Mesa redonda central */}
      <RoundTable position={[0, 0, 0]} />

      {/* 3 cadeiras ao redor */}
      {chairPositions.map(({ pos, rot }, i) => (
        <Chair key={i} position={pos} rotation={rot} />
      ))}

      {/* Porta de vidro com moldura na face sul */}
      <group position={[0, 0, D / 2]}>
        <mesh position={[0, 0.75, 0.01]}>
          <boxGeometry args={[0.76, 1.52, 0.07]} />
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.75, 0.01]}>
          <boxGeometry args={[0.62, 1.34, 0.05]} />
          <meshPhysicalMaterial
            color="#1a2a3a"
            transmission={0.5}
            roughness={0.1}
            thickness={0.04}
            transparent
            opacity={0.55}
          />
        </mesh>
        <mesh position={[0.27, 0.75, 0.05]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.65, 0.05]}>
          <boxGeometry args={[0.46, 0.12, 0.03]} />
          <meshStandardMaterial
            color="#8899AA"
            emissive="#8899AA"
            emissiveIntensity={0.4}
            metalness={0.4}
          />
        </mesh>
      </group>

      {/* Indicador de status ao lado da porta */}
      <DoorIndicator occupied={occupied} offsetX={0.48} offsetZ={D / 2 + 0.06} />
    </group>
  );
}
