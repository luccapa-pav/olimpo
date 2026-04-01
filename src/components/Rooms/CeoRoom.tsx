import { Desk } from '../Furniture/Desk';
import { Chair } from '../Furniture/Chair';
import { Monitor } from '../Furniture/Monitor';
import { Plant, ShelfWithPlants } from '../Furniture/Plant';
import { Agent } from '../Agents/Agent';
import type { AgentState } from '../../types';

// Sala do CEO: x[-14,-8], z[-12,-7] → 6×5 unidades
// Paredes externas (norte/oeste) fornecidas pelo Floor.tsx
// Este componente adiciona as divisórias de vidro (leste + sul)

const WALL_H = 3.5;

// Divisória de vidro premium
function GlassDivider({
  position,
  args,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  args: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshPhysicalMaterial
        color="#1a2a3a"
        transmission={0.6}
        roughness={0.1}
        thickness={0.05}
        metalness={0.1}
        opacity={0.7}
        transparent
      />
    </mesh>
  );
}

interface CeoRoomProps {
  agent: AgentState;
  onAgentClick: () => void;
  isSelected: boolean;
}

export function CeoRoom({ agent, onAgentClick, isSelected }: CeoRoomProps) {
  // Centro da sala: (-11, 0, -9.5)
  const cx = -11;
  const cz = -9.5;

  return (
    <group>
      {/* Divisória de vidro — face leste (x = -8) separando CEO do corredor */}
      <GlassDivider
        position={[-8, WALL_H / 2, -9.5]}
        args={[0.06, WALL_H, 5]}
      />

      {/* Divisória de vidro — face sul (z = -7) separando CEO das salas privadas */}
      <GlassDivider
        position={[-11, WALL_H / 2, -7]}
        args={[6, WALL_H, 0.06]}
      />

      {/* Mesa em L */}
      <Desk position={[cx, 0, cz - 0.3]} />
      <Desk position={[cx + 1.7, 0, cz - 1.2]} rotation={[0, Math.PI / 2, 0]} />

      {/* Monitor principal */}
      <Monitor
        position={[cx - 0.1, 1.15, cz - 0.6]}
        active={agent.status !== 'idle'}
        accentColor={agent.accentColor}
      />
      {/* Monitor lateral */}
      <Monitor
        position={[cx + 1.7, 1.15, cz - 1.75]}
        rotation={[0, Math.PI / 2, 0]}
        active={agent.status === 'working'}
        accentColor="#2A3A5A"
      />

      {/* Cadeira executiva */}
      <Chair position={[cx, 0, cz + 0.6]} rotation={[0, Math.PI, 0]} />

      {/* Planta de chão no canto */}
      <Plant position={[-12.8, 0, -11.5]} scale={1.4} />

      {/* Prateleira com 3 vasos suspensos na parede leste (x=-8) */}
      <ShelfWithPlants position={[-8.12, 2.2, -10.2]} count={3} />

      {/* Plaquinha dourada "CEO" na divisória de vidro */}
      <mesh position={[-8, 0.5, -9.5]}>
        <boxGeometry args={[0.04, 0.18, 0.55]} />
        <meshStandardMaterial
          color={agent.accentColor}
          emissive={agent.accentColor}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Porta de vidro — face sul (z = -7), centrada no quarto CEO */}
      <group position={[cx, 0, -7]}>
        {/* Moldura metálica */}
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.82, 1.52, 0.07]} />
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Vidro da porta */}
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.68, 1.34, 0.05]} />
          <meshPhysicalMaterial
            color="#1a2a3a"
            transmission={0.5}
            roughness={0.1}
            thickness={0.04}
            transparent
            opacity={0.55}
          />
        </mesh>
        {/* Maçaneta */}
        <mesh position={[0.30, 0.75, 0.04]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Plaquinha "Atlas" em dourado */}
        <mesh position={[0, 1.65, 0.04]}>
          <boxGeometry args={[0.5, 0.12, 0.03]} />
          <meshStandardMaterial
            color={agent.accentColor}
            emissive={agent.accentColor}
            emissiveIntensity={0.6}
            metalness={0.6}
          />
        </mesh>
      </group>

      {/* Agente Atlas — sentado na cadeira executiva */}
      <Agent
        agent={agent}
        position={[cx, 0.30, cz + 0.60]}
        rotation={[0, Math.PI, 0]}
        onClick={onAgentClick}
        isSelected={isSelected}
      />
    </group>
  );
}
