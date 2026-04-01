import { Floor, Walls } from './Floor';
import { Lighting } from './Lighting';
import { TrackLighting } from './TrackLighting';
import { CeoRoom } from '../Rooms/CeoRoom';
import { Workspace } from '../Rooms/Workspace';
import { StatusPanel } from '../Rooms/StatusPanel';
import { PrivateRoom } from '../Rooms/PrivateRoom';
import { MeetingRoom } from '../Rooms/MeetingRoom';
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

      {/* Salas privadas — parede leste, stacked north-south
          Sala 1: centro (9.0, 0, -8.5)  → x[7.75, 10.25], z[-9.75,-7.25]
          Sala 2: centro (9.0, 0, -5.75) → x[7.75, 10.25], z[-7.0, -4.5]  */}
      <PrivateRoom position={[9.0, 0, -8.5]}  occupied={privateRoomOccupied[0]} roomName="Sala 1" />
      <PrivateRoom position={[9.0, 0, -5.75]} occupied={privateRoomOccupied[1]} roomName="Sala 2" />

      {/* Área de trabalho */}
      <Workspace
        agents={workspaceAgents}
        selectedAgentId={selectedAgentId}
        onAgentClick={(id) => selectAgent(id)}
      />

      {/* ── Vegetação ── */}

      {/* Trepadeira no canto nordeste (longe das salas privadas) */}
      <ClimbingPlant position={[9.5, 0, -11.5]} height={2.8} />

      {/* Vasos decorativos espalhados */}
      {/* Canto nordeste */}
      <DecoPlant position={[8.0, 0, -11.2]} height={0.65} leafColor="#3A6B4A" />

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

      {/* Painel de status na parede fundo */}
      <StatusPanel />

      {/* ── Estantes de livros — parede norte, leste do painel ──
          Placeholder: substituir por useGLTF('/models/bookshelf.glb') */}
      <BookshelfPlaceholder position={[7.5, 0, -11.72]} width={4.5} />

      {/* Estante menor no lado oeste da parede norte (atrás da sala CEO) */}
      <BookshelfPlaceholder position={[-12.5, 0, -11.72]} width={2.5} />

      {/* ── Área de Descompressão (Lounge) — sudeste, abaixo do workspace ── */}
      {/* Tapete */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.65, 0.001, 6.3]}>
        <planeGeometry args={[4.2, 3.0]} />
        <meshStandardMaterial color="#1A1510" roughness={0.95} />
      </mesh>
      {/* Sofá 1 — assento */}
      <mesh position={[4.2, 0.20, 5.9]}>
        <boxGeometry args={[1.6, 0.4, 0.7]} />
        <meshStandardMaterial color="#1E1E22" roughness={0.92} />
      </mesh>
      {/* Sofá 1 — encosto */}
      <mesh position={[4.2, 0.44, 5.58]}>
        <boxGeometry args={[1.6, 0.42, 0.14]} />
        <meshStandardMaterial color="#1E1E22" roughness={0.92} />
      </mesh>
      {/* Sofá 1 — apoios de braço */}
      <mesh position={[3.35, 0.30, 5.9]}>
        <boxGeometry args={[0.12, 0.22, 0.7]} />
        <meshStandardMaterial color="#1A1A1E" roughness={0.92} />
      </mesh>
      <mesh position={[5.05, 0.30, 5.9]}>
        <boxGeometry args={[0.12, 0.22, 0.7]} />
        <meshStandardMaterial color="#1A1A1E" roughness={0.92} />
      </mesh>
      {/* Sofá 2 — assento */}
      <mesh position={[7.1, 0.20, 5.9]}>
        <boxGeometry args={[1.6, 0.4, 0.7]} />
        <meshStandardMaterial color="#1E1E22" roughness={0.92} />
      </mesh>
      {/* Sofá 2 — encosto */}
      <mesh position={[7.1, 0.44, 5.58]}>
        <boxGeometry args={[1.6, 0.42, 0.14]} />
        <meshStandardMaterial color="#1E1E22" roughness={0.92} />
      </mesh>
      {/* Sofá 2 — apoios de braço */}
      <mesh position={[6.25, 0.30, 5.9]}>
        <boxGeometry args={[0.12, 0.22, 0.7]} />
        <meshStandardMaterial color="#1A1A1E" roughness={0.92} />
      </mesh>
      <mesh position={[7.95, 0.30, 5.9]}>
        <boxGeometry args={[0.12, 0.22, 0.7]} />
        <meshStandardMaterial color="#1A1A1E" roughness={0.92} />
      </mesh>
      {/* Mesa de centro — tampo */}
      <mesh position={[5.65, 0.28, 7.0]}>
        <boxGeometry args={[0.9, 0.055, 0.55]} />
        <meshStandardMaterial color="#0E0E0E" metalness={0.55} roughness={0.35} />
      </mesh>
      {/* Mesa de centro — perna central */}
      <mesh position={[5.65, 0.13, 7.0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.26, 8]} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.75} roughness={0.3} />
      </mesh>
      {/* Mesa de centro — base */}
      <mesh position={[5.65, 0.02, 7.0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 12]} />
        <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.4} />
      </mesh>
    </>
  );
}
