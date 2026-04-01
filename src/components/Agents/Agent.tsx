import { AgentCharacter } from './AgentCharacter';
import type { AgentState } from '../../types';

interface AgentProps {
  agent: AgentState;
  position: [number, number, number];
  rotation?: [number, number, number];
  onClick: () => void;
  isSelected: boolean;
}

export function Agent({ agent, position, rotation = [0, 0, 0], onClick, isSelected }: AgentProps) {
  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <AgentCharacter
        agentId={agent.id}
        positionPhase={position[0]}
        isSelected={isSelected}
      />

      {/* Anel de seleção no chão (referenciado ao chão, não à posição do agente) */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.30, 0]}>
          <ringGeometry args={[0.24, 0.30, 24]} />
          <meshStandardMaterial
            color={agent.accentColor}
            emissive={agent.accentColor}
            emissiveIntensity={1.2}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
    </group>
  );
}
