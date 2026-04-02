import { Floor, Walls } from './Floor';
import { Lighting } from './Lighting';
import { TrackLighting } from './TrackLighting';
import { CeoRoom } from '../Rooms/CeoRoom';
import { Workspace } from '../Rooms/Workspace';
import { StatusPanel } from '../Rooms/StatusPanel';
import { PrivateRoom } from '../Rooms/PrivateRoom';
import { MeetingRoom } from '../Rooms/MeetingRoom';
import { Lounge } from '../Rooms/Lounge';
import { ClimbingPlant, DecoPlant, CoffeeMachine, LargePot } from '../Furniture/Plant';
import { BookshelfPlaceholder } from '../Furniture/Placeholders';

import { useAgentStore } from '../../stores/agentStore';
import { useUIStore } from '../../stores/uiStore';

export function Office() {
  const agents = useAgentStore((s) => s.agents);
  const { selectedAgentId, selectAgent, privateRoomOccupied } = useUIStore();

  const atlasAgent = agents.find((a) => a.id === 'atlas')!;
  const workspaceAgents = agents.filter((a) => a.defaultRoom === 'workspace');

  return (
    <>
      <Lighting />
      <TrackLighting />
      <Floor />
      <Walls />

      {/* Sala do CEO — canto noroeste: x[-14,-8], z[-12,-7] */}
      <CeoRoom
        agent={atlasAgent}
        onAgentClick={() => selectAgent(atlasAgent.id)}
        isSelected={selectedAgentId === atlasAgent.id}
      />

      {/* Sala de Reunião Geral — à direita do CEO: x[-8,-1], z[-12,-7] */}
      <MeetingRoom agentCount={workspaceAgents.length} />

      {/* Salas privadas — canto nordeste
          Sala 1: W=3.5, centro x=5.75 → east glass x=7.5, west x=4.0
          Sala 2: W=3.4, centro x=9.2  → west glass x=7.5 (toca Sala1), east glass x=10.9 (parede leste)
          Ambas: D=5.0, centro z=-9.5  → norte z=-12.0 (parede), sul z=-7.0 (alinha CEO) */}
      <PrivateRoom position={[1.975, 0, -9.5]} width={5.95} occupied={privateRoomOccupied[0]} roomName="Sala 1" />
      <PrivateRoom position={[7.925, 0, -9.5]} width={5.95} occupied={privateRoomOccupied[1]} roomName="Sala 2" />

      {/* Área de trabalho */}
      <Workspace
        agents={workspaceAgents}
        selectedAgentId={selectedAgentId}
        onAgentClick={(id) => selectAgent(id)}
      />

      {/* ── Vegetação ── */}

      {/* Trepadeira no canto nordeste */}
      <ClimbingPlant position={[10.5, 0, -5.0]} height={2.8} />

      {/* Sul das salas privadas (corredor leste) */}
      <DecoPlant position={[8.5, 0, -3.0]} height={0.95} leafColor="#2D5A3D" />

      {/* Canto sudeste */}
      <DecoPlant position={[9.5, 0, 3.5]} height={0.75} leafColor="#3A6B4A" />

      {/* ── Vasos grandes nos cantos do salão ── */}
      <LargePot position={[9.0, 0, 2.5]} />
      <LargePot position={[-13.0, 0, 2.5]} />
      <LargePot position={[9.0, 0, -2.5]} />

      {/* ── Máquina de café — canto nordeste da área de trabalho ── */}
      <CoffeeMachine position={[6.5, 0.8, -0.5]} rotation={[0, -Math.PI / 2, 0]} />

      {/* ── Zona de break norte — leste das salas privadas ── */}

      {/* Tapete delimitando a zona */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.5, 0.004, -5.0]}>
        <planeGeometry args={[3.5, 2.5]} />
        <meshStandardMaterial color="#14100A" roughness={0.95} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1} />
      </mesh>

      {/* Sofá voltado para norte */}
      <group position={[7.5, 0, -5.5]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.20, 0]}>
          <boxGeometry args={[1.8, 0.40, 0.75]} />
          <meshStandardMaterial color="#1A1A1E" roughness={0.92} />
        </mesh>
        <mesh position={[0, 0.48, -0.32]}>
          <boxGeometry args={[1.8, 0.44, 0.14]} />
          <meshStandardMaterial color="#1A1A1E" roughness={0.92} />
        </mesh>
        {([-0.87, 0.87] as number[]).map((ox, i) => (
          <mesh key={i} position={[ox, 0.30, 0]}>
            <boxGeometry args={[0.12, 0.24, 0.75]} />
            <meshStandardMaterial color="#1A1A1E" roughness={0.92} />
          </mesh>
        ))}
      </group>

      {/* Mesa de centro da zona de break */}
      <mesh position={[7.5, 0.30, -4.6]}>
        <boxGeometry args={[0.9, 0.04, 0.55]} />
        <meshStandardMaterial color="#0E0E0E" metalness={0.55} roughness={0.35} />
      </mesh>
      {([[-0.35, -0.2], [0.35, -0.2], [-0.35, 0.2], [0.35, 0.2]] as [number, number][]).map(([ox, oz], i) => (
        <mesh key={i} position={[7.5 + ox, 0.15, -4.6 + oz]}>
          <cylinderGeometry args={[0.02, 0.02, 0.30, 8]} />
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Luz de ambiente do lounge norte */}
      <pointLight position={[7.5, 2.8, -5.0]} intensity={0.4} color="#FFE8C0" distance={4} decay={2} />

      {/* Plantas na zona de break */}
      <LargePot position={[5.8, 0, -5.8]} />
      <DecoPlant position={[6.2, 0, -4.0]} height={0.95} leafColor="#2D5A3D" />

      {/* Armário de arquivo — final da fila de trabalho */}
      <group position={[-0.8, 0, 0.5]}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.55, 1.10, 0.50]} />
          <meshStandardMaterial color="#1A1A1A" roughness={0.85} metalness={0.05} />
        </mesh>
        {([0.38, 0.12, -0.14, -0.40] as number[]).map((dy, i) => (
          <mesh key={i} position={[0, dy + 0.55, 0.26]}>
            <boxGeometry args={[0.48, 0.22, 0.02]} />
            <meshStandardMaterial color="#222222" roughness={0.8} metalness={0.1} />
          </mesh>
        ))}
        {([0.38, 0.12, -0.14, -0.40] as number[]).map((dy, i) => (
          <mesh key={i} position={[0.14, dy + 0.55, 0.28]}>
            <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
            <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Painel de status na parede fundo */}
      <StatusPanel />

      {/* Estante menor no lado oeste da parede norte (atrás da sala CEO) */}
      <BookshelfPlaceholder position={[-12.5, 0, -11.72]} width={2.5} />

      {/* Lounge — canto sudeste */}
      <Lounge />
    </>
  );
}
