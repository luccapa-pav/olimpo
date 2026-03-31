import { Desk } from '../Furniture/Desk';
import { Chair } from '../Furniture/Chair';
import { Monitor } from '../Furniture/Monitor';
import { Agent } from './Agent';
import type { AgentState } from '../../types';

interface AgentDeskProps {
  agent: AgentState;
  position: [number, number, number];
  onAgentClick: () => void;
  isSelected: boolean;
}

// Estação de trabalho completa: mesa + cadeira + monitor + agente
export function AgentDesk({ agent, position, onAgentClick, isSelected }: AgentDeskProps) {
  const [x, y, z] = position;

  return (
    <group>
      <Desk position={[x, y, z]} />
      <Chair position={[x, y, z + 0.7]} rotation={[0, Math.PI, 0]} />
      <Monitor
        position={[x, y + 1.15, z - 0.2]}
        active={agent.status !== 'idle'}
        accentColor={agent.accentColor}
      />
      {/* Teclado */}
      <mesh position={[x, y + 0.8, z + 0.15]}>
        <boxGeometry args={[0.45, 0.02, 0.15]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
      {/* Agente flutuando acima da cadeira */}
      <Agent
        agent={agent}
        position={[x, y + 1.15, z + 0.55]}
        onClick={onAgentClick}
        isSelected={isSelected}
      />
    </group>
  );
}
