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

      {/* Holographic floating name label — depthWrite/depthTest fix for no-flicker */}
      <Billboard position={[0, 1.95, 0]} follow={true} scale={1.7} renderOrder={10}>
        {/* Outer glow halo */}
        <mesh position={[0, 0, -0.025]} renderOrder={10}>
          <planeGeometry args={[0.90, 0.34]} />
          <meshStandardMaterial
            color={agent.accentColor}
            emissive={agent.accentColor}
            emissiveIntensity={0.7}
            transparent
            opacity={0.45}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>

        {/* Dark chip background */}
        <mesh position={[0, 0, -0.015]} renderOrder={11}>
          <planeGeometry args={[0.82, 0.26]} />
          <meshStandardMaterial
            color="#0F0F14"
            transparent
            opacity={0.88}
            depthWrite={false}
            depthTest={false}
          />
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
          material-depthWrite={false}
          renderOrder={12}
        >
          {agent.name.toUpperCase()}
        </Text>

        {/* Status sub-label */}
        <Text
          fontSize={0.065}
          color="#556677"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.055, 0]}
          letterSpacing={0.06}
          font={undefined}
          material-depthWrite={false}
          renderOrder={12}
        >
          {agent.status.toUpperCase()}
        </Text>

        {/* Accent underline */}
        <mesh position={[0, -0.115, -0.005]} renderOrder={11}>
          <planeGeometry args={[0.52, 0.006]} />
          <meshStandardMaterial
            color={agent.accentColor}
            emissive={agent.accentColor}
            emissiveIntensity={2.5}
            transparent
            opacity={0.95}
            depthWrite={false}
          />
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
