import { Floor, Walls } from './Floor';
import { Lighting } from './Lighting';
import { CeoRoom } from '../Rooms/CeoRoom';
import { Workspace } from '../Rooms/Workspace';
import { StatusPanel } from '../Rooms/StatusPanel';
import { PrivateRoom } from '../Rooms/PrivateRoom';
import { MeetingRoom } from '../Rooms/MeetingRoom';
import { ClimbingPlant } from '../Furniture/Plant';
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

      {/* Salas privadas — entre área executiva e workspace, alinhadas à esquerda
          Sala 1: centro (-12, 0, -3.5) → x[-14,-10], z[-5.25,-1.75]
          Sala 2: centro (-7,  0, -3.5) → x[-9,-5],   z[-5.25,-1.75]
          Corredor entre elas: 1 unidade (x[-10,-9]) */}
      <PrivateRoom position={[-12, 0, -3.5]} occupied={privateRoomOccupied[0]} roomName="Sala 1" />
      <PrivateRoom position={[-7,  0, -3.5]} occupied={privateRoomOccupied[1]} roomName="Sala 2" />

      {/* Área de trabalho — origin (-12, 0, 0.5) */}
      <Workspace
        agents={workspaceAgents}
        selectedAgentId={selectedAgentId}
        onAgentClick={(id) => selectAgent(id)}
      />

      {/* Trepadeiras no canto leste */}
      <ClimbingPlant position={[9.5, 0, -11.5]} height={2.8} />
      <ClimbingPlant position={[10.5, 0, -8]} height={2.0} />

      {/* Painel de status na parede fundo */}
      <StatusPanel />
    </>
  );
}
