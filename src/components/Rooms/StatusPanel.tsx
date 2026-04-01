import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useAgentStore } from '../../stores/agentStore';
import type { AgentState } from '../../types';

const CANVAS_W = 1024;
const CANVAS_H = 512;

// Panel 3D dimensions — matches 2:1 canvas ratio
const PANEL_W = 10;
const PANEL_H = 5;

function getShortTitle(title: string): string {
  const noDash = title.split(' — ')[0].trim();
  return noDash.split(' + ')[0].trim();
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

function drawPanel(ctx: CanvasRenderingContext2D, agents: AgentState[]) {
  const W = CANVAS_W;
  const H = CANVAS_H;

  // Background
  ctx.fillStyle = '#0A0A0F';
  ctx.fillRect(0, 0, W, H);

  // Subtle scanline texture
  for (let y = 0; y < H; y += 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, y, W, 1);
  }

  // Inner glow border
  const glow = ctx.createLinearGradient(0, 0, 0, H);
  glow.addColorStop(0, 'rgba(0, 204, 136, 0.06)');
  glow.addColorStop(0.5, 'rgba(0, 204, 136, 0.02)');
  glow.addColorStop(1, 'rgba(0, 204, 136, 0.06)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Title bar background
  ctx.fillStyle = '#0F1A15';
  ctx.fillRect(0, 0, W, 74);

  // Title
  ctx.font = 'bold 28px "Courier New", Courier, monospace';
  ctx.fillStyle = '#00CC88';
  ctx.fillText('OLIMPO HQ', 32, 42);
  ctx.fillStyle = '#AAAAAA';
  ctx.fillText('— Status do Time', 208, 42);

  // Live indicator dot
  ctx.beginPath();
  ctx.arc(W - 44, 36, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#00CC88';
  ctx.fill();
  ctx.font = '16px "Courier New", Courier, monospace';
  ctx.fillStyle = '#00CC88';
  ctx.fillText('LIVE', W - 34, 41);

  // Title separator
  ctx.strokeStyle = '#1A3328';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 74);
  ctx.lineTo(W, 74);
  ctx.stroke();

  // Column headers
  ctx.font = '17px "Courier New", Courier, monospace';
  ctx.fillStyle = '#3A5A4A';
  ctx.fillText('●  AGENTE', 28, 100);
  ctx.fillText('FUNÇÃO', 270, 100);
  ctx.fillText('TAREFA ATUAL', 490, 100);
  ctx.fillText('INÍCIO', 840, 100);

  // Header separator
  ctx.strokeStyle = '#1A2A22';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, 110);
  ctx.lineTo(W - 28, 110);
  ctx.stroke();

  // Agent rows
  const ROW_H = 72;
  const START_Y = 160;

  agents.forEach((agent, i) => {
    const y = START_Y + i * ROW_H;
    const isActive = agent.status !== 'idle';
    const isMeeting = agent.status === 'meeting';

    // Row hover/active background
    if (isActive) {
      ctx.fillStyle = isMeeting
        ? 'rgba(201, 168, 76, 0.05)'
        : 'rgba(0, 204, 136, 0.04)';
      ctx.fillRect(8, y - 34, W - 16, ROW_H - 4);

      // Left accent bar using agent color
      ctx.fillStyle = agent.accentColor;
      ctx.fillRect(8, y - 34, 3, ROW_H - 4);
    }

    // Status dot
    const dotColor = isActive
      ? isMeeting ? '#C9A84C' : '#00CC88'
      : '#444444';

    ctx.font = '24px "Courier New", Courier, monospace';
    ctx.fillStyle = dotColor;
    ctx.fillText(isActive ? '●' : '○', 28, y);

    // Agent name
    ctx.font = isActive
      ? 'bold 24px "Courier New", Courier, monospace'
      : '24px "Courier New", Courier, monospace';
    ctx.fillStyle = isActive ? '#F0F0F0' : '#666666';
    ctx.fillText(agent.name, 68, y);

    // Role title
    ctx.font = '21px "Courier New", Courier, monospace';
    ctx.fillStyle = isActive ? '#888888' : '#444444';
    ctx.fillText(getShortTitle(agent.title), 270, y);

    // Current task
    const task = agent.currentTask ? truncate(agent.currentTask, 24) : 'idle';
    ctx.font = '21px "Courier New", Courier, monospace';
    ctx.fillStyle = isActive
      ? isMeeting ? '#C9A84C' : '#00CC88'
      : '#444444';
    ctx.fillText(task, 490, y);

    // Time
    const timeStr = agent.taskStartedAt ? formatTime(agent.taskStartedAt) : '--';
    ctx.font = '21px "Courier New", Courier, monospace';
    ctx.fillStyle = isActive ? '#666666' : '#333333';
    ctx.fillText(timeStr, 840, y);

    // Row separator
    if (i < agents.length - 1) {
      ctx.strokeStyle = '#111A15';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(28, y + ROW_H - 40);
      ctx.lineTo(W - 28, y + ROW_H - 40);
      ctx.stroke();
    }
  });

  // Bottom status summary
  const working = agents.filter((a) => a.status === 'working').length;
  const meeting = agents.filter((a) => a.status === 'meeting').length;
  const idle = agents.filter((a) => a.status === 'idle').length;

  ctx.fillStyle = '#0F1A15';
  ctx.fillRect(0, H - 32, W, 32);
  ctx.strokeStyle = '#1A3328';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, H - 32);
  ctx.lineTo(W, H - 32);
  ctx.stroke();

  ctx.font = '16px "Courier New", Courier, monospace';
  ctx.fillStyle = '#00CC88';
  ctx.fillText(`● ${working} working`, 28, H - 11);
  ctx.fillStyle = '#C9A84C';
  ctx.fillText(`◆ ${meeting} meeting`, 180, H - 11);
  ctx.fillStyle = '#555555';
  ctx.fillText(`○ ${idle} idle`, 340, H - 11);
}

export function StatusPanel() {
  const agents = useAgentStore((s) => s.agents);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    canvasRef.current = canvas;
    const tex = new THREE.CanvasTexture(canvas);
    textureRef.current = tex;
    return tex;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const tex = textureRef.current;
    if (!canvas || !tex) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawPanel(ctx, agents);
    tex.needsUpdate = true;
  }, [agents]);

  return (
    <group position={[0, 2.5, -11.75]}>
      {/* Outer metal housing */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[PANEL_W + 0.3, PANEL_H + 0.3, 0.1]} />
        <meshStandardMaterial
          color="#1C1C1C"
          metalness={0.85}
          roughness={0.25}
          envMapIntensity={1}
        />
      </mesh>

      {/* Thin metallic border trim */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[PANEL_W + 0.14, PANEL_H + 0.14, 0.04]} />
        <meshStandardMaterial
          color="#2E2E2E"
          metalness={0.95}
          roughness={0.1}
          emissive="#0A1A12"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Screen surface */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[PANEL_W, PANEL_H]} />
        <meshStandardMaterial
          map={texture}
          emissive="#001A0D"
          emissiveIntensity={0.25}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Screen ambient glow — green tint */}
      <pointLight
        position={[0, 0, 1.2]}
        intensity={0.6}
        color="#00CC88"
        distance={5}
        decay={2}
      />

      {/* Wall mount bracket */}
      <mesh position={[0, -PANEL_H / 2 - 0.2, -0.1]}>
        <boxGeometry args={[1.2, 0.12, 0.18]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}
