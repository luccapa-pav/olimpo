import { useMemo } from 'react';
import * as THREE from 'three';

// ── Notepad com CanvasTexture (linhas pautadas + faixa colorida) ──────────────
interface NotepadProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  accentColor?: string;
}

function createNotepadTexture(accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 192;
  const ctx = canvas.getContext('2d')!;

  // Paper background
  ctx.fillStyle = '#EEECE6';
  ctx.fillRect(0, 0, 256, 192);

  // Color header stripe
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.85;
  ctx.fillRect(0, 0, 256, 22);
  ctx.globalAlpha = 1;

  // Ruled lines
  ctx.strokeStyle = '#CCCCBB';
  ctx.lineWidth = 1;
  for (let y = 34; y < 192; y += 14) {
    ctx.beginPath();
    ctx.moveTo(18, y);
    ctx.lineTo(246, y);
    ctx.stroke();
  }

  // Margin line
  ctx.strokeStyle = '#E8A0A0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, 24);
  ctx.lineTo(28, 192);
  ctx.stroke();

  // Spiral binding dots on left edge
  for (let y = 28; y < 192; y += 18) {
    ctx.beginPath();
    ctx.arc(8, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#AAAAAA';
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

export function Notepad({ position, rotation = [0, 0, 0], accentColor = '#C9A84C' }: NotepadProps) {
  const texture = useMemo(() => createNotepadTexture(accentColor), [accentColor]);

  return (
    <group position={position} rotation={rotation}>
      {/* Paper body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.22, 0.005, 0.16]} />
        <meshStandardMaterial map={texture} roughness={0.9} metalness={0} />
      </mesh>
      {/* Bottom (plain white) */}
      <mesh position={[0, -0.003, 0]}>
        <boxGeometry args={[0.21, 0.002, 0.155]} />
        <meshStandardMaterial color="#F0EEE8" roughness={1} metalness={0} />
      </mesh>
      {/* Pen */}
      <mesh position={[0.13, 0.006, 0]} rotation={[0, 0.3, Math.PI / 2]}>
        <cylinderGeometry args={[0.004, 0.003, 0.17, 8]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Pen tip */}
      <mesh position={[0.13 + Math.sin(0.3) * 0.085, 0.006, -Math.cos(0.3) * 0.0]} rotation={[0, 0.3, Math.PI / 2]}>
        <coneGeometry args={[0.003, 0.018, 6]} />
        <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ── Garrafa d'água translúcida ────────────────────────────────────────────────
interface WaterBottleProps {
  position: [number, number, number];
  color?: string;
}

export function WaterBottle({ position, color = '#1A3A5A' }: WaterBottleProps) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.028, 0.026, 0.17, 14]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.45}
          roughness={0.05}
          metalness={0.05}
          thickness={0.03}
          transparent
          opacity={0.75}
        />
      </mesh>
      {/* Water fill (slightly darker, opaque) */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.022, 0.021, 0.09, 12]} />
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.018, 12]} />
        <meshStandardMaterial color="#DDDDDD" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Nozzle */}
      <mesh position={[0, 0.196, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.02, 8]} />
        <meshStandardMaterial color="#CCCCCC" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}

// ── Suporte de headset ────────────────────────────────────────────────────────
interface HeadsetStandProps {
  position: [number, number, number];
  accentColor?: string;
}

export function HeadsetStand({ position, accentColor = '#444444' }: HeadsetStandProps) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.055, 0.065, 0.018, 14]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Vertical rod */}
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.008, 0.009, 0.20, 8]} />
        <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Arc top (headband rest) */}
      <mesh position={[0, 0.21, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.055, 0.007, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Left ear cup */}
      <mesh position={[-0.055, 0.21, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.018, 14]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.15}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
      {/* Right ear cup */}
      <mesh position={[0.055, 0.21, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.018, 14]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.15}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}
