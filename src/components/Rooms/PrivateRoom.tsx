import { Chair } from '../Furniture/Chair';

// Sala privada — posicionada no canto nordeste
// Recebe `position` como centro da sala

const WALL_H = 3.5;
const D = 5.0;   // face norte z_centro-2.5=-12.0, face sul z_centro+2.5=-7.0

interface PrivateRoomProps {
  position: [number, number, number];
  width?: number;   // largura da sala (default 3.5). Sala 2 usa 3.4 para encostar na parede leste.
  occupied?: boolean;
  roomName?: string;
}

function ExecutiveDesk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tampa da mesa */}
      <mesh position={[0, 0.76, 0]}>
        <boxGeometry args={[1.8, 0.05, 0.9]} />
        <meshStandardMaterial color="#1C1208" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Borda metálica */}
      <mesh position={[0, 0.74, 0]}>
        <boxGeometry args={[1.82, 0.03, 0.92]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 2 pés laterais */}
      {([-0.8, 0.8] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.37, 0]}>
          <boxGeometry args={[0.06, 0.74, 0.82]} />
          <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* Monitor */}
      <mesh position={[0.3, 1.13, -0.25]}>
        <boxGeometry args={[0.65, 0.38, 0.02]} />
        <meshStandardMaterial color="#111111" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.3, 0.92, -0.22]}>
        <boxGeometry args={[0.04, 0.3, 0.04]} />
        <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.5} />
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
        color="#e6f2ff"
        transmission={0.85}
        roughness={0.08}
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

export function PrivateRoom({ position, width = 3.5, occupied = false, roomName: _roomName = 'Sala' }: PrivateRoomProps) {
  const W = width;
  const [px, py, pz] = position;

  // 4 cadeiras: 1 executivo + 2 visitantes + 1 lateral
  const chairPositions: { pos: [number, number, number]; rot: [number, number, number] }[] = [
    { pos: [0, 0, 0.6],        rot: [0, Math.PI, 0] },
    { pos: [-0.55, 0, -1.2],   rot: [0, 0.2, 0] },
    { pos: [0.55, 0, -1.2],    rot: [0, -0.2, 0] },
    { pos: [1.1, 0, -0.3],     rot: [0, -Math.PI / 2, 0] },
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

      {/* Mesa executiva */}
      <ExecutiveDesk position={[0, 0, -0.5]} />

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

      {/* Floor lamp no canto traseiro */}
      <group position={[-1.4, 0, -1.7]}>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 1.8, 6]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.85, 0]}>
          <coneGeometry args={[0.18, 0.22, 10, 1, true]} />
          <meshStandardMaterial color="#888888" metalness={0.5} roughness={0.5} side={2} />
        </mesh>
        <pointLight position={[0, 1.7, 0]} intensity={0.5} color="#FFF5D6" distance={3} decay={2} />
      </group>

      {/* Indicador de status ao lado da porta */}
      <DoorIndicator occupied={occupied} offsetX={0.67} offsetZ={D / 2 + 0.06} />
    </group>
  );
}
