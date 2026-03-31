import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Mesh } from 'three';
import type { AgentState } from '../../types';

interface AgentProps {
  agent: AgentState;
  position: [number, number, number];
  onClick: () => void;
  isSelected: boolean;
}

// Representação visual do agente: esfera colorida com nome + indicador de status
export function Agent({ agent, position, onClick, isSelected }: AgentProps) {
  const meshRef = useRef<Mesh>(null);
  const innerRef = useRef<Mesh>(null);

  // Animação idle: flutuação suave
  useFrame((state) => {
    if (!meshRef.current || !innerRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.05;
    innerRef.current.rotation.y = t * 0.5;
  });

  const statusColor =
    agent.status === 'working'
      ? '#00CC88'
      : agent.status === 'meeting'
        ? '#C9A84C'
        : '#555555';

  return (
    <group position={position}>
      {/* Corpo principal do agente */}
      <mesh ref={meshRef} onClick={onClick} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color={agent.accentColor}
          emissive={agent.accentColor}
          emissiveIntensity={isSelected ? 0.5 : 0.15}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Núcleo interno girando */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          color="#E8E8E8"
          emissive="#E8E8E8"
          emissiveIntensity={0.3}
          roughness={0.1}
        />
      </mesh>

      {/* Anel de seleção */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
          <ringGeometry args={[0.28, 0.32, 32]} />
          <meshStandardMaterial
            color={agent.accentColor}
            emissive={agent.accentColor}
            emissiveIntensity={1}
          />
        </mesh>
      )}

      {/* Indicador de status (bolinha colorida) */}
      <mesh position={[0.18, 0.18, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={1}
        />
      </mesh>

      {/* Label com nome (HTML overlay) */}
      <Html
        position={[0, 0.42, 0]}
        center
        distanceFactor={6}
        occlude={false}
      >
        <div
          style={{
            background: 'rgba(13,13,13,0.85)',
            border: `1px solid ${agent.accentColor}44`,
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '10px',
            color: '#E8E8E8',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={onClick}
        >
          {agent.name}
        </div>
      </Html>
    </group>
  );
}
