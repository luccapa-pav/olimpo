import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AgentCharacter } from './AgentCharacter';
import type { AgentState } from '../../types';
import { MEETING_SEATS } from '../../config/positions';

interface AgentProps {
  agent: AgentState;
  position: [number, number, number];
  rotation?: [number, number, number];
  onClick: () => void;
  isSelected: boolean;
}

export function Agent({ agent, position, rotation = [0, 0, 0], onClick, isSelected }: AgentProps) {
  const tagC = agent.tagColor ?? agent.accentColor;
  const innerRef   = useRef<THREE.Group>(null);
  const offsetRef  = useRef(new THREE.Vector3(0, 0, 0));
  const targetRef  = useRef(new THREE.Vector3(0, 0, 0));
  const walkTimeRef = useRef(0);

  useFrame((state, delta) => {
    if (!innerRef.current) return;
    const seat = agent.status === 'meeting' ? MEETING_SEATS[agent.id] : null;
    if (seat) {
      targetRef.current.set(
        seat[0] - position[0],
        seat[1] - position[1],
        seat[2] - position[2],
      );
    } else {
      targetRef.current.set(0, 0, 0);
    }

    const dist = offsetRef.current.distanceTo(targetRef.current);
    const isWalking = dist > 0.12;

    offsetRef.current.lerp(targetRef.current, delta * 1.8);
    innerRef.current.position.copy(offsetRef.current);

    if (isWalking) {
      walkTimeRef.current += delta;
      const wt = walkTimeRef.current;
      // Body sway left-right
      innerRef.current.rotation.z = Math.sin(wt * 8) * 0.04;
      // Vertical bounce (feet lifting)
      innerRef.current.position.y += Math.abs(Math.sin(wt * 8)) * 0.015;
    } else {
      walkTimeRef.current = 0;
      // Ease sway back to zero when stationary
      innerRef.current.rotation.z = THREE.MathUtils.lerp(innerRef.current.rotation.z, 0, delta * 6);
    }

    state.invalidate();
  });

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <group ref={innerRef}>
        <AgentCharacter
          agentId={agent.id}
          positionPhase={position[0]}
          isSelected={isSelected}
        />
      </group>

      {/* Name label — HTML screen-space, zero distortion */}
      <Html position={[0, 2.35, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(15,15,15,0.95)',
          color: '#FFF',
          padding: '5px 13px 4px',
          borderRadius: '4px',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '13px',
          fontWeight: 'bold',
          borderBottom: `3px solid ${tagC}`,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          letterSpacing: '0.5px',
          userSelect: 'none',
        }}>
          {agent.name.toUpperCase()}
          <div style={{
            fontSize: '9px',
            color: tagC,
            opacity: 0.85,
            marginTop: '1px',
            letterSpacing: '1px',
          }}>
            {agent.status.toUpperCase()}
          </div>
        </div>
      </Html>

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
