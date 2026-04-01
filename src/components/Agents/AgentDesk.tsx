import { Desk } from '../Furniture/Desk';
import { Chair } from '../Furniture/Chair';
import { Monitor } from '../Furniture/Monitor';
import { Succulent } from '../Furniture/Plant';
import { DeskObject } from '../Furniture/DeskObject';
import { Agent } from './Agent';
import type { AgentState } from '../../types';

interface AgentDeskProps {
  agent: AgentState;
  position: [number, number, number];
  onAgentClick: () => void;
  isSelected: boolean;
}

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
      {/* Objeto personalizado do agente ao lado do monitor */}
      <DeskObject agentId={agent.id} position={[x + 0.6, y + 0.82, z - 0.15]} />
      {/* Suculenta no canto oposto da mesa */}
      <Succulent position={[x - 0.58, y + 0.78, z - 0.22]} />
      {/* Agente sentado na cadeira — quadril no nível do assento (y=0.50) */}
      <Agent
        agent={agent}
        position={[x, y + 0.30, z + 0.70]}
        rotation={[0, Math.PI, 0]}
        onClick={onAgentClick}
        isSelected={isSelected}
      />
    </group>
  );
}
