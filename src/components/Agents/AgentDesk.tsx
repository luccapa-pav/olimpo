import { Desk } from '../Furniture/Desk';
import { Chair } from '../Furniture/Chair';
import { Monitor } from '../Furniture/Monitor';
import { Succulent } from '../Furniture/Plant';
import { DeskObject } from '../Furniture/DeskObject';
import { PCTower } from '../Furniture/PCTower';
import { Notepad, WaterBottle } from '../Furniture/DeskProps';
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
        <meshStandardMaterial color="#1E1E1E" roughness={0.85} />
      </mesh>
      {/* Mouse */}
      <mesh position={[x + 0.32, y + 0.785, z + 0.15]}>
        <boxGeometry args={[0.07, 0.015, 0.10]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* PC Tower — lado direito atrás do monitor */}
      <PCTower position={[x + 0.70, y, z - 0.28]} agentId={agent.id} />
      {/* Objeto personalizado do agente */}
      <DeskObject agentId={agent.id} position={[x + 0.6, y + 0.82, z - 0.15]} />
      {/* Suculenta no canto esquerdo */}
      <Succulent position={[x - 0.58, y + 0.78, z - 0.22]} />
      {/* Notepad — à esquerda do teclado */}
      <Notepad
        position={[x - 0.42, y + 0.778, z - 0.08]}
        accentColor={agent.accentColor}
      />
      {/* Garrafa d'água — canto frontal direito */}
      <WaterBottle position={[x + 0.52, y + 0.775, z + 0.28]} />
      {/* Cable management — fios atrás do monitor descendo ao PC tower */}
      {/* Bundle de cabos horizontal, atrás do monitor */}
      <mesh position={[x + 0.20, y + 0.92, z - 0.38]} rotation={[0, 0, Math.PI / 12]}>
        <cylinderGeometry args={[0.008, 0.008, 0.32, 6]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
      </mesh>
      {/* Cabo descendo verticalmente ao tower */}
      <mesh position={[x + 0.60, y + 0.55, z - 0.28]}>
        <cylinderGeometry args={[0.006, 0.006, 0.62, 6]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
      </mesh>
      {/* Cabo USB pequeno horizontal */}
      <mesh position={[x - 0.02, y + 0.80, z - 0.32]} rotation={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.22, 6]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>

      {/* Agente sentado */}
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
