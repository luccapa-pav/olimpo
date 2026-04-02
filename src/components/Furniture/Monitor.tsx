import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAgentStore } from '../../stores/agentStore';

interface MonitorProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  active?: boolean;
  accentColor?: string;
  agentId?: string;
}

export function Monitor({ position, rotation = [0, 0, 0], active = true, accentColor = '#4A90D9', agentId }: MonitorProps) {
  const screenMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2);

  const agentStatus = useAgentStore(s =>
    agentId ? (s.agents.find(a => a.id === agentId)?.status ?? 'idle') : null
  );
  const agentAccent = useAgentStore(s =>
    agentId ? (s.agents.find(a => a.id === agentId)?.accentColor ?? accentColor) : accentColor
  );

  useFrame((state) => {
    if (!screenMatRef.current || agentStatus === null) return;
    const t = state.clock.elapsedTime;
    const mat = screenMatRef.current;
    const phase = phaseRef.current;

    if (agentStatus === 'working') {
      mat.emissive.set(agentAccent);
      mat.emissiveIntensity = 0.44 + Math.sin(t * 6.5 + phase) * 0.19;
    } else if (agentStatus === 'meeting') {
      mat.emissive.set(agentAccent);
      mat.emissiveIntensity = 0.06 + Math.sin(t * 0.6 + phase) * 0.02;
    } else {
      // idle — gentle slow pulse
      mat.emissive.set(agentAccent);
      mat.emissiveIntensity = 0.16 + Math.sin(t * 1.6 + phase) * 0.05;
    }

    state.invalidate();
  });

  const screenColor = active ? accentColor : '#050C18';
  const emissive    = active ? accentColor : '#0A1A2E';
  const emissiveIntensity = active ? 0.6 : 0.18;

  return (
    <group position={position} rotation={rotation}>
      {/* Tela */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.55, 0.04]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Display */}
      <mesh position={[0, 0, 0.022]}>
        <boxGeometry args={[0.82, 0.48, 0.001]} />
        <meshStandardMaterial
          ref={screenMatRef}
          color={screenColor}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.1}
        />
      </mesh>

      {/* Moldura */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[0.2, 0.04, 0.04]} />
        <meshStandardMaterial color="#323232" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Base */}
      <mesh position={[0, -0.38, 0.06]}>
        <boxGeometry args={[0.35, 0.04, 0.2]} />
        <meshStandardMaterial color="#2E2E2E" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}
