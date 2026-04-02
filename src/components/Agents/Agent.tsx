import { useMemo } from 'react';
import * as THREE from 'three';
import { Billboard } from '@react-three/drei';
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
  const labelTexture = useMemo(() => {
    const W = 512, H = 128;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, W, H);

    // Outer glow
    ctx.fillStyle = agent.accentColor;
    ctx.globalAlpha = 0.28;
    if ((ctx as any).roundRect) (ctx as any).roundRect(2, 2, W - 4, H - 4, 14);
    else ctx.rect(2, 2, W - 4, H - 4);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Dark background
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 1.0;
    if ((ctx as any).roundRect) (ctx as any).roundRect(8, 8, W - 16, H - 16, 8);
    else ctx.rect(8, 8, W - 16, H - 16);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Top + bottom accent lines
    ctx.strokeStyle = agent.accentColor;
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.moveTo(22, 11); ctx.lineTo(W - 22, 11);
    ctx.moveTo(22, H - 11); ctx.lineTo(W - 22, H - 11);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Name
    ctx.font = 'bold 48px monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(agent.name.toUpperCase(), W / 2, H * 0.38);

    // Status
    ctx.font = '26px monospace';
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = agent.accentColor;
    ctx.fillText(agent.status.toUpperCase(), W / 2, H * 0.72);
    ctx.globalAlpha = 1;

    return new THREE.CanvasTexture(canvas);
  }, [agent.name, agent.accentColor, agent.status]);

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <AgentCharacter
        agentId={agent.id}
        positionPhase={position[0]}
        isSelected={isSelected}
      />

      {/* Holographic floating name label — single CanvasTexture mesh, zero Z-fighting */}
      <Billboard position={[0, 1.95, 0]} follow={true} scale={[3.6, 1.1, 1]}>
        <mesh renderOrder={10}>
          <planeGeometry args={[0.82, 0.26]} />
          <meshBasicMaterial
            map={labelTexture}
            transparent
            depthWrite={false}
            depthTest={false}
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
