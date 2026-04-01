import { Billboard, Text } from '@react-three/drei';
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

      {/* Holographic floating name label — sci-fi premium */}
      <Billboard position={[0, 1.95, 0]} follow={true} scale={1.7}>
        {/* Dark chip background */}
        <mesh position={[0, 0, -0.002]}>
          <planeGeometry args={[0.82, 0.26]} />
          <meshStandardMaterial color="#030A10" transparent opacity={0.72} />
        </mesh>

        {/* Glow border — top */}
        <mesh position={[0, 0.13, -0.001]}>
          <planeGeometry args={[0.82, 0.008]} />
          <meshStandardMaterial color={agent.accentColor} emissive={agent.accentColor} emissiveIntensity={2.0} transparent opacity={0.9} />
        </mesh>
        {/* Glow border — bottom */}
        <mesh position={[0, -0.13, -0.001]}>
          <planeGeometry args={[0.82, 0.008]} />
          <meshStandardMaterial color={agent.accentColor} emissive={agent.accentColor} emissiveIntensity={2.0} transparent opacity={0.9} />
        </mesh>
        {/* Glow border — left */}
        <mesh position={[-0.41, 0, -0.001]}>
          <planeGeometry args={[0.008, 0.26]} />
          <meshStandardMaterial color={agent.accentColor} emissive={agent.accentColor} emissiveIntensity={2.0} transparent opacity={0.9} />
        </mesh>
        {/* Glow border — right */}
        <mesh position={[0.41, 0, -0.001]}>
          <planeGeometry args={[0.008, 0.26]} />
          <meshStandardMaterial color={agent.accentColor} emissive={agent.accentColor} emissiveIntensity={2.0} transparent opacity={0.9} />
        </mesh>

        {/* Name */}
        <Text
          fontSize={0.11}
          color={agent.accentColor}
          anchorX="center"
          anchorY="middle"
          position={[0, 0.04, 0]}
          letterSpacing={0.10}
          font={undefined}
        >
          {agent.name.toUpperCase()}
        </Text>

        {/* Status sub-label */}
        <Text
          fontSize={0.065}
          color="#446655"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.055, 0]}
          letterSpacing={0.06}
          font={undefined}
        >
          {agent.status.toUpperCase()}
        </Text>

        {/* Accent underline */}
        <mesh position={[0, -0.115, 0]}>
          <planeGeometry args={[0.52, 0.006]} />
          <meshStandardMaterial color={agent.accentColor} emissive={agent.accentColor} emissiveIntensity={2.0} transparent opacity={0.9} />
        </mesh>
      </Billboard>

      {/* Anel de seleção no chão */}
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
