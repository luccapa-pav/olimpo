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

      {/* Salas privadas — corredor centro-norte
          Sala 1: centro (2.0, 0, -5.5) | Sala 2: centro (5.0, 0, -5.5) */}
      <PrivateRoom position={[5.75, 0, -10.25]} occupied={privateRoomOccupied[0]} roomName="Sala 1" />
      <PrivateRoom position={[9.0, 0, -10.25]} occupied={privateRoomOccupied[1]} roomName="Sala 2" />

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

      {/* Painel de status na parede fundo */}
      <StatusPanel />

      {/* Estante menor no lado oeste da parede norte (atrás da sala CEO) */}
      <BookshelfPlaceholder position={[-12.5, 0, -11.72]} width={2.5} />

      {/* Lounge — canto sudeste */}
      <Lounge />
    </>
  );
}
