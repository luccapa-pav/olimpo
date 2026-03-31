import { Desk } from '../Furniture/Desk';
import { Chair } from '../Furniture/Chair';
import { Monitor } from '../Furniture/Monitor';
import { Plant } from '../Furniture/Plant';
import { Agent } from '../Agents/Agent';
import type { AgentState } from '../../types';

interface CeoRoomProps {
  agent: AgentState;
  onAgentClick: () => void;
  isSelected: boolean;
}

// Sala do CEO (Atlas) — canto superior esquerdo
export function CeoRoom({ agent, onAgentClick, isSelected }: CeoRoomProps) {
  const roomX = -8;
  const roomZ = -7;

  return (
    <group>
      {/* Divisória de vidro — parede norte da sala */}
      <mesh position={[roomX + 1.5, 2, roomZ + 2.5]}>
        <boxGeometry args={[5, 4, 0.06]} />
        <meshPhysicalMaterial
          color="#334466"
          transmission={0.7}
          roughness={0.05}
          metalness={0.1}
          opacity={0.5}
          transparent
        />
      </mesh>

      {/* Divisória lateral */}
      <mesh position={[roomX + 4, 2, roomZ]}>
        <boxGeometry args={[0.06, 4, 5]} />
        <meshPhysicalMaterial
          color="#334466"
          transmission={0.7}
          roughness={0.05}
          metalness={0.1}
          opacity={0.5}
          transparent
        />
      </mesh>

      {/* Mesa em L */}
      <Desk position={[roomX, 0, roomZ]} />
      <Desk position={[roomX + 1.65, 0, roomZ - 0.7]} rotation={[0, Math.PI / 2, 0]} />

      {/* Monitor ultrawide */}
      <Monitor
        position={[roomX, 1.15, roomZ - 0.25]}
        active={agent.status !== 'idle'}
        accentColor={agent.accentColor}
      />
      <Monitor
        position={[roomX + 1.65, 1.15, roomZ - 0.95]}
        rotation={[0, Math.PI / 2, 0]}
        active={agent.status === 'working'}
        accentColor="#2A2A4A"
      />

      {/* Cadeira executiva */}
      <Chair position={[roomX, 0, roomZ + 0.7]} rotation={[0, Math.PI, 0]} />

      {/* Planta no canto */}
      <Plant position={[roomX + 3.2, 0, roomZ - 2]} scale={1.3} />

      {/* Plaquinha "ATLAS" na parede de vidro */}
      <mesh position={[roomX + 1.5, 0.5, roomZ + 2.45]}>
        <boxGeometry args={[0.6, 0.15, 0.02]} />
        <meshStandardMaterial color={agent.accentColor} emissive={agent.accentColor} emissiveIntensity={0.5} />
      </mesh>

      {/* Agente Atlas */}
      <Agent
        agent={agent}
        position={[roomX, 1.15, roomZ + 0.55]}
        onClick={onAgentClick}
        isSelected={isSelected}
      />
    </group>
  );
}
