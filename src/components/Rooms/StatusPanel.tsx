import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useAgentStore } from '../../stores/agentStore';
import type { AgentState } from '../../types';

const CANVAS_W = 2048;
const CANVAS_H = 1024;
const LW = 1024;
const LH = 512;

const PANEL_W = 10;
const PANEL_H = 5;

const FONT_SANS = '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

function getShortTitle(title: string): string {
  const noDash = title.split(' — ')[0].trim();
  return noDash.split(' + ')[0].trim();
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawMiniBarGraph(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  values: [number, number, number],
  color: string,
) {
  const BAR_W = 10;
  const MAX_H = 32;
  const GAP = 6;
  const labels = ['TSK', 'UPT', 'SIG'];

  values.forEach((v, i) => {
    const bx = x + i * (BAR_W + GAP);
    const bh = Math.max(3, Math.round(v * MAX_H));

    // Track
    drawRoundRect(ctx, bx, y - MAX_H, BAR_W, MAX_H, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fill();

    // Fill
    drawRoundRect(ctx, bx, y - bh, BAR_W, bh, 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Label
    ctx.font = `9px ${FONT_SANS}`;
    ctx.fillStyle = '#3A4A5A';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], bx + BAR_W / 2, y + 11);
    ctx.textAlign = 'left';
  });
}

function drawSparkline(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, color: string,
) {
  const now = Date.now();
  const points = 20;
  const step = w / (points - 1);

  // Fill area under sparkline
  ctx.beginPath();
  for (let i = 0; i < points; i++) {
    const t = (now * 0.001 + i * 0.6) % (Math.PI * 2);
    const val = (Math.sin(t * 1.3) * 0.3 + Math.sin(t * 0.7) * 0.4 + Math.sin(t * 2.1) * 0.2 + 0.5) * 0.85;
    const px = x + i * step;
    const py = y + h - val * h;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.6;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function agentHash(id: string, seed: number): number {
  let h = seed;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return h / 1000;
}

function drawPanel(ctx: CanvasRenderingContext2D, agents: AgentState[]) {
  const W = LW;
  const H = LH;

  ctx.save();
  ctx.scale(CANVAS_W / LW, CANVAS_H / LH);

  // ── Background ──────────────────────────────────────────────────────────────
  ctx.fillStyle = '#050912';
  ctx.fillRect(0, 0, W, H);

  // Subtle radial glow
  const radialGlow = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.65);
  radialGlow.addColorStop(0, 'rgba(15, 35, 70, 0.35)');
  radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, W, H);

  // ── Header ──────────────────────────────────────────────────────────────────
  const HEADER_H = 70;

  const headerGrad = ctx.createLinearGradient(0, 0, 0, HEADER_H);
  headerGrad.addColorStop(0, '#0B1424');
  headerGrad.addColorStop(1, '#070E1A');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(0, 0, W, HEADER_H);

  // Gold accent line
  ctx.fillStyle = '#C9A84C';
  ctx.fillRect(0, HEADER_H - 1, W, 1);

  // Left color accent bar
  ctx.fillStyle = '#C9A84C';
  ctx.fillRect(0, 0, 4, HEADER_H);

  // Title
  ctx.font = `bold 30px ${FONT_SANS}`;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('OLIMPO HQ', 24, 42);

  ctx.font = `400 15px ${FONT_SANS}`;
  ctx.fillStyle = '#4A6070';
  ctx.fillText('OPERATIONAL STATUS', 226, 42);

  // Network sparkline
  drawSparkline(ctx, W - 300, 12, 160, 44, '#4A7FE8');
  ctx.font = `10px ${FONT_SANS}`;
  ctx.fillStyle = '#2A3A4A';
  ctx.fillText('NET I/O', W - 306, 62);

  // LIVE pill
  drawRoundRect(ctx, W - 96, 22, 62, 22, 5);
  ctx.fillStyle = 'rgba(0, 232, 122, 0.12)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(W - 80, 33, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#00E87A';
  ctx.fill();
  ctx.font = `bold 12px ${FONT_SANS}`;
  ctx.fillStyle = '#00E87A';
  ctx.fillText('LIVE', W - 68, 37);

  // Timestamp
  const now = new Date();
  const ts = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
  ctx.font = `11px ${FONT_SANS}`;
  ctx.fillStyle = '#2A3A4A';
  ctx.textAlign = 'right';
  ctx.fillText(ts, W - 8, 62);
  ctx.textAlign = 'left';

  // ── Column headers ──────────────────────────────────────────────────────────
  const HDR_Y = HEADER_H + 28;
  ctx.font = `bold 11px ${FONT_SANS}`;
  ctx.fillStyle = '#2E4458';

  [['AGENTE', 60], ['FUNÇÃO', 260], ['TAREFA ATUAL', 475], ['MÉTRICAS', 820]].forEach(
    ([label, x]) => ctx.fillText(String(label), Number(x), HDR_Y),
  );

  ctx.strokeStyle = '#0C1A26';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, HDR_Y + 10);
  ctx.lineTo(W - 20, HDR_Y + 10);
  ctx.stroke();

  // ── Agent rows ──────────────────────────────────────────────────────────────
  const ROW_H = 66;
  const START_Y = HDR_Y + 28;

  agents.forEach((agent, i) => {
    const y = START_Y + i * ROW_H;
    const isActive  = agent.status !== 'idle';
    const isMeeting = agent.status === 'meeting';
    const isWorking = agent.status === 'working';
    const statusColor = isWorking ? '#00E87A' : isMeeting ? '#F0B429' : '#3A4A5A';

    // Alternating row tint
    if (i % 2 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.018)';
      ctx.fillRect(8, y - 24, W - 16, ROW_H - 2);
    }

    // Active left accent bar
    if (isActive) {
      ctx.fillStyle = agent.accentColor;
      ctx.fillRect(8, y - 24, 3, ROW_H - 2);
    }

    // Avatar ring
    ctx.beginPath();
    ctx.arc(38, y - 4, 17, 0, Math.PI * 2);
    ctx.fillStyle = `${agent.accentColor}18`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(38, y - 4, 17, 0, Math.PI * 2);
    ctx.strokeStyle = agent.accentColor;
    ctx.lineWidth = isActive ? 1.5 : 0.8;
    ctx.globalAlpha = isActive ? 1 : 0.4;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.font = `bold 15px ${FONT_SANS}`;
    ctx.fillStyle = isActive ? agent.accentColor : '#2A3A48';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(agent.name[0].toUpperCase(), 38, y - 4);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // Agent name
    ctx.font = `${isActive ? 'bold' : '400'} 19px ${FONT_SANS}`;
    ctx.fillStyle = isActive ? '#D8E4EE' : '#3A4A58';
    ctx.fillText(agent.name, 64, y - 8);

    // Status pill
    const pillW = 78;
    const pillH = 17;
    drawRoundRect(ctx, 64, y + 3, pillW, pillH, 4);
    ctx.fillStyle = `${statusColor}18`;
    ctx.fill();
    ctx.font = `bold 10px ${FONT_SANS}`;
    ctx.fillStyle = statusColor;
    ctx.textAlign = 'center';
    ctx.fillText(agent.status.toUpperCase(), 64 + pillW / 2, y + 15);
    ctx.textAlign = 'left';

    // Role
    ctx.font = `400 16px ${FONT_SANS}`;
    ctx.fillStyle = isActive ? '#6A8090' : '#2E3E4A';
    ctx.fillText(getShortTitle(agent.title), 260, y - 2);

    // Task
    const task = agent.currentTask ? truncate(agent.currentTask, 24) : '—';
    ctx.font = `${isActive ? '500' : '400'} 16px ${FONT_SANS}`;
    ctx.fillStyle = isActive ? (isMeeting ? '#F0B429' : '#00E87A') : '#1E2E3A';
    ctx.fillText(task, 475, y - 2);

    // Mini bars
    const v0 = isWorking ? 0.7 + agentHash(agent.id, 1) * 0.25 : agentHash(agent.id, 1) * 0.3;
    const v1 = isActive  ? 0.6 + agentHash(agent.id, 2) * 0.30 : 0.4 + agentHash(agent.id, 2) * 0.2;
    const v2 = isActive  ? 0.5 + agentHash(agent.id, 3) * 0.40 : agentHash(agent.id, 3) * 0.25;
    drawMiniBarGraph(ctx, 820, y + 8, [v0, v1, v2], isActive ? agent.accentColor : '#1E2E3A');

    // Row divider
    if (i < agents.length - 1) {
      ctx.strokeStyle = '#090F1C';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, y + ROW_H - 26);
      ctx.lineTo(W - 20, y + ROW_H - 26);
      ctx.stroke();
    }
  });

  // ── Bottom bar ──────────────────────────────────────────────────────────────
  const FOOTER_H = 32;
  ctx.fillStyle = '#030710';
  ctx.fillRect(0, H - FOOTER_H, W, FOOTER_H);
  ctx.fillStyle = '#C9A84C';
  ctx.fillRect(0, H - FOOTER_H, W, 1);

  const working = agents.filter((a) => a.status === 'working').length;
  const meeting = agents.filter((a) => a.status === 'meeting').length;
  const idle    = agents.filter((a) => a.status === 'idle').length;

  // Health dots
  agents.forEach((agent, ii) => {
    const dotX = 20 + ii * 30;
    const dotY = H - FOOTER_H / 2;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
    ctx.fillStyle = agent.status !== 'idle' ? agent.accentColor : '#151F2A';
    ctx.fill();
    ctx.font = `bold 8px ${FONT_SANS}`;
    ctx.fillStyle = agent.status !== 'idle' ? '#FFFFFF' : '#2A3A48';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(agent.name[0], dotX, dotY);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  });

  // Summary counts
  const cntX = 20 + agents.length * 30 + 20;
  ctx.font = `500 12px ${FONT_SANS}`;
  ctx.fillStyle = '#00E87A';
  ctx.fillText(`${working} WORKING`, cntX, H - 10);
  ctx.fillStyle = '#F0B429';
  ctx.fillText(`${meeting} MEETING`, cntX + 120, H - 10);
  ctx.fillStyle = '#3A4A5A';
  ctx.fillText(`${idle} IDLE`, cntX + 240, H - 10);

  // Gold border
  ctx.strokeStyle = '#C9A84C';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(2, 2, W - 4, H - 4);

  ctx.restore();
}

export function StatusPanel() {
  const agents = useAgentStore((s) => s.agents);

  const canvasRef  = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;
    canvasRef.current  = canvas;
    const tex = new THREE.CanvasTexture(canvas);
    textureRef.current = tex;
    return tex;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const tex    = textureRef.current;
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
        <meshStandardMaterial color="#141820" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Gold trim frame */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[PANEL_W + 0.14, PANEL_H + 0.14, 0.04]} />
        <meshStandardMaterial
          color="#C9A84C"
          emissive="#C9A84C"
          emissiveIntensity={0.22}
          metalness={0.95}
          roughness={0.12}
        />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[PANEL_W, PANEL_H]} />
        <meshStandardMaterial
          map={texture}
          emissive="#001830"
          emissiveIntensity={0.45}
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      {/* Screen ambient glow */}
      <pointLight position={[0, 0, 1.2]} intensity={0.8} color="#3060CC" distance={6} decay={2} />

      {/* Wall mount bracket */}
      <mesh position={[0, -PANEL_H / 2 - 0.2, -0.1]}>
        <boxGeometry args={[1.2, 0.12, 0.18]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}
