import { AgentDesk } from '../Agents/AgentDesk';
import { LargePot } from '../Furniture/Plant';
import type { AgentState } from '../../types';

interface WorkspaceProps {
  agents: AgentState[];
  selectedAgentId: string | null;
  onAgentClick: (id: string) => void;
}

const DESK_SPACING_X = 2.8;
const DESK_SPACING_Z = 2.6;
const MAX_PER_ROW = 4;

// Grid dinâmico — escala automaticamente com novos agentes
export function Workspace({ agents, selectedAgentId, onAgentClick }: WorkspaceProps) {
  const originX = -12;
  const originZ = 0.5;

  return (
    <group>
      {/* Borda dourada na entrada da área de trabalho */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[originX + 5.6, 0.003, originZ - 0.3]}>
        <planeGeometry args={[12.8, 0.06]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.4} />
      </mesh>

      {/* Mesas dos agentes */}
      {agents.map((agent, index) => {
        const col = index % MAX_PER_ROW;
        const row = Math.floor(index / MAX_PER_ROW);
        const x = originX + col * DESK_SPACING_X;
        const z = originZ + row * DESK_SPACING_Z;

        return (
          <AgentDesk
            key={agent.id}
            agent={agent}
            position={[x, 0, z]}
            onAgentClick={() => onAgentClick(agent.id)}
            isSelected={selectedAgentId === agent.id}
          />
        );
      })}

      {/* Vasos nos cantos */}
      <LargePot position={[originX - 1.3, 0, originZ]} />
      <LargePot position={[originX + MAX_PER_ROW * DESK_SPACING_X + 0.5, 0, originZ]} />
    </group>
  );
}
