import { AgentDesk } from '../Agents/AgentDesk';
import { Plant } from '../Furniture/Plant';
import type { AgentState } from '../../types';

interface WorkspaceProps {
  agents: AgentState[];
  selectedAgentId: string | null;
  onAgentClick: (id: string) => void;
}

const DESK_SPACING_X = 2.6;
const DESK_SPACING_Z = 2.4;
const MAX_PER_ROW = 4;

// Grid dinâmico de estações de trabalho — escala automaticamente com o time
export function Workspace({ agents, selectedAgentId, onAgentClick }: WorkspaceProps) {
  const originX = -3.5;
  const originZ = 4;

  return (
    <group>
      {/* Label da área */}
      <mesh position={[originX + 3.5, 0.01, originZ + 2.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 0.1]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.3} />
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

      {/* Plantas decorativas nos cantos */}
      <Plant position={[originX - 1.2, 0, originZ - 0.5]} />
      <Plant position={[originX + agents.length * 0.8 + 1.5, 0, originZ - 0.5]} scale={0.9} />
    </group>
  );
}
