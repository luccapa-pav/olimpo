import { Floor, Walls } from './Floor';
import { Lighting } from './Lighting';
import { CeoRoom } from '../Rooms/CeoRoom';
import { Workspace } from '../Rooms/Workspace';
import { StatusPanel } from '../Rooms/StatusPanel';
import { useAgentStore } from '../../stores/agentStore';
import { useUIStore } from '../../stores/uiStore';

// Cena principal do escritório 3D
export function Office() {
  const agents = useAgentStore((s) => s.agents);
  const { selectedAgentId, selectAgent } = useUIStore();

  const atlasAgent = agents.find((a) => a.id === 'atlas')!;
  const workspaceAgents = agents.filter((a) => a.defaultRoom === 'workspace');

  return (
    <>
      <Lighting />
      <Floor />
      <Walls />

      {/* Sala do CEO */}
      <CeoRoom
        agent={atlasAgent}
        onAgentClick={() => selectAgent(atlasAgent.id)}
        isSelected={selectedAgentId === atlasAgent.id}
      />

      {/* Área de trabalho */}
      <Workspace
        agents={workspaceAgents}
        selectedAgentId={selectedAgentId}
        onAgentClick={(id) => selectAgent(id)}
      />

      {/* Painel de status na parede */}
      <StatusPanel agents={agents} />
    </>
  );
}
