import { Chair } from '../Furniture/Chair';
import { Notepad } from '../Furniture/DeskProps';

// Sala de Reunião Geral: x[-8,-1], z[-12,-7]
// Centro: (-4.5, 0, -9.5) | Largura: 7 | Profundidade: 5
const WALL_H = 3.5;
const MR_CX = -4.5;
const MR_CZ = -9.5;
const MR_W = 7;
const MR_D = 5;

interface MeetingRoomProps {
  agentCount: number;
}

function GlassDivider({
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
        transmission={0.88}
        roughness={0.08}
        thickness={0.2}
        metalness={0}
        ior={1.5}
      />
    </mesh>
  );
}

function RoomDoor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Moldura metálica */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.82, 1.52, 0.07]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Vidro da porta */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.68, 1.34, 0.05]} />
        <meshPhysicalMaterial
          color="#b8d4e8"
          transmission={0.88}
          roughness={0.08}
          thickness={0.15}
          metalness={0}
          ior={1.5}
        />
      </mesh>
      {/* Maçaneta */}
      <mesh position={[0.30, 0.75, 0.04]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Plaquinha "Reunião" */}
      <mesh position={[0, 1.65, 0.04]}>
        <boxGeometry args={[0.66, 0.12, 0.03]} />
        <meshStandardMaterial
          color="#8899AA"
          emissive="#8899AA"
          emissiveIntensity={0.4}
          metalness={0.4}
        />
      </mesh>
    </group>
  );
}

export function MeetingRoom({ agentCount }: MeetingRoomProps) {
  // Mesa de conferência escala com agentes
  const tableLen = Math.min(Math.max((agentCount + 1) * 0.8, 3.0), MR_W - 1.5);
  const tableW = 1.2;
  const tableY = 0.75;

  const chairsPerSide = Math.max(Math.ceil(agentCount / 2), 2);
  const chairSpacing = tableLen / (chairsPerSide + 1);

  // Abertura da porta na parede sul (z=-7)
  const DOOR_W = 0.9;
  const doorX = MR_CX;
  const leftPanelW = (doorX - DOOR_W / 2) - (-8);
  const leftPanelCX = -8 + leftPanelW / 2;
  const rightPanelW = -1 - (doorX + DOOR_W / 2);
  const rightPanelCX = (doorX + DOOR_W / 2) + rightPanelW / 2;

  return (
    <group>
      {/* Divisória de vidro — face leste (x = -1) */}
      <GlassDivider
        position={[-1, WALL_H / 2, MR_CZ]}
        args={[0.06, WALL_H, MR_D]}
      />

      {/* Divisória sul — painel esquerdo */}
      <GlassDivider
        position={[leftPanelCX, WALL_H / 2, -7]}
        args={[leftPanelW, WALL_H, 0.06]}
      />

      {/* Divisória sul — painel direito */}
      <GlassDivider
        position={[rightPanelCX, WALL_H / 2, -7]}
        args={[rightPanelW, WALL_H, 0.06]}
      />

      {/* Porta de vidro com moldura */}
      <RoomDoor position={[doorX, 0, -7]} />

      {/* Tapete sob a mesa de conferência */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[MR_CX, 0.001, MR_CZ]}>
        <planeGeometry args={[tableLen + 1.2, tableW + 2.2]} />
        <meshStandardMaterial color="#161210" roughness={0.95} metalness={0} />
      </mesh>

      {/* Mesa de conferência — tampo */}
      <mesh position={[MR_CX, tableY, MR_CZ]}>
        <boxGeometry args={[tableLen, 0.06, tableW]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Borda metálica da mesa */}
      <mesh position={[MR_CX, tableY - 0.04, MR_CZ]}>
        <boxGeometry args={[tableLen + 0.04, 0.02, tableW + 0.04]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pernas da mesa */}
      {([
        [ tableLen / 2 - 0.2,  tableW / 2 - 0.15],
        [-(tableLen / 2 - 0.2),  tableW / 2 - 0.15],
        [ tableLen / 2 - 0.2, -(tableW / 2 - 0.15)],
        [-(tableLen / 2 - 0.2), -(tableW / 2 - 0.15)],
      ] as [number, number][]).map(([ox, oz], i) => (
        <mesh key={i} position={[MR_CX + ox, tableY / 2 - 0.03, MR_CZ + oz]}>
          <cylinderGeometry args={[0.04, 0.04, tableY - 0.03, 8]} />
          <meshStandardMaterial color="#3A3A3A" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Cadeiras — lado norte da mesa (frente à tela) */}
      {Array.from({ length: chairsPerSide }, (_, i) => (
        <Chair
          key={`n${i}`}
          position={[MR_CX - tableLen / 2 + chairSpacing * (i + 1), 0, MR_CZ - tableW / 2 - 0.55]}
          rotation={[0, 0, 0]}
        />
      ))}

      {/* Cadeiras — lado sul da mesa */}
      {Array.from({ length: chairsPerSide }, (_, i) => (
        <Chair
          key={`s${i}`}
          position={[MR_CX - tableLen / 2 + chairSpacing * (i + 1), 0, MR_CZ + tableW / 2 + 0.55]}
          rotation={[0, Math.PI, 0]}
        />
      ))}

      {/* Cadeira — cabeceira oeste (lugar de destaque / CEO) */}
      <Chair
        position={[MR_CX - tableLen / 2 - 0.55, 0, MR_CZ]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Cadeira — cabeceira leste */}
      <Chair
        position={[MR_CX + tableLen / 2 + 0.55, 0, MR_CZ]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* Notepads na mesa de conferência */}
      <Notepad position={[MR_CX - 0.8, tableY + 0.035, MR_CZ - 0.35]} accentColor="#C9A84C" />
      <Notepad position={[MR_CX,       tableY + 0.035, MR_CZ + 0.35]} rotation={[0, Math.PI, 0]} accentColor="#00CC88" />
      <Notepad position={[MR_CX + 0.8, tableY + 0.035, MR_CZ - 0.35]} accentColor="#5588FF" />

      {/* Tela/TV na parede do fundo (norte) */}
      <mesh position={[MR_CX, 1.6, -11.93]}>
        <boxGeometry args={[2.4, 1.3, 0.06]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      <mesh position={[MR_CX, 1.6, -11.89]}>
        <boxGeometry args={[2.2, 1.1, 0.01]} />
        <meshStandardMaterial
          color="#0A1530"
          emissive="#0A2560"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Luz gerenciada pelo Lighting.tsx */}
    </group>
  );
}
