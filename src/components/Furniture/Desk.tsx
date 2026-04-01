import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

// GLTF stub: import { useGLTF } from '@react-three/drei'
// const { scene } = useGLTF('/models/desk.glb')
// Drop desk.glb in /public/models/ to replace this procedural geometry

// ── Black ash veneer texture (procedural) ────────────────────────────────────
function createAshVeneerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width  = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Base charcoal
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(0, 0, 512, 256);

  // Wood grain lines (horizontal, subtle)
  const rng = (seed: number) => ((seed * 1664525 + 1013904223) & 0xffffffff) / 0xffffffff;
  const grainCount = 18;
  for (let i = 0; i < grainCount; i++) {
    const baseY = (i / grainCount) * 256;
    const alpha = 0.03 + rng(i * 7) * 0.06;
    const width = 0.8 + rng(i * 13) * 1.4;

    ctx.beginPath();
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= 512; x += 12) {
      const noise = (rng(x * 0.01 + i * 0.3) - 0.5) * 4;
      ctx.lineTo(x, baseY + noise);
    }
    ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  // Fine micro-grain
  for (let i = 0; i < 60; i++) {
    const y = rng(i * 17) * 256;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y + (rng(i * 31) - 0.5) * 6);
    ctx.strokeStyle = `rgba(255,255,255,${(0.01 + rng(i * 7) * 0.02).toFixed(3)})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Metallic edge highlight (front edge)
  const edgeGrad = ctx.createLinearGradient(0, 246, 0, 256);
  edgeGrad.addColorStop(0, 'rgba(80,80,80,0)');
  edgeGrad.addColorStop(1, 'rgba(80,80,80,0.5)');
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 246, 512, 10);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return tex;
}

// Texture criada uma vez a nível de módulo — compartilhada por todas as mesas
const ashTexture = createAshVeneerTexture();

// ── Geometrias e materiais compartilhados ────────────────────────────────────
const GEO = {
  trim:  new THREE.BoxGeometry(1.6, 0.03, 0.02),
  leg:   new THREE.BoxGeometry(0.06, 0.7, 0.06),
  shelf: new THREE.BoxGeometry(1.4, 0.03, 0.6),
};

const MAT = {
  surface: new THREE.MeshPhysicalMaterial({ map: ashTexture, roughness: 0.45, metalness: 0.1, clearcoat: 0.4, clearcoatRoughness: 0.2 }),
  metal:   new THREE.MeshStandardMaterial({ color: '#4A4A4A', metalness: 0.85, roughness: 0.15 }),
  leg:     new THREE.MeshStandardMaterial({ color: '#3A3A3A', metalness: 0.7,  roughness: 0.3  }),
  shelf:   new THREE.MeshStandardMaterial({ color: '#252525', roughness: 0.85 }),
};

const LEG_POSITIONS: [number, number, number][] = [
  [-0.72, 0.35, -0.38],
  [ 0.72, 0.35, -0.38],
  [-0.72, 0.35,  0.38],
  [ 0.72, 0.35,  0.38],
];

interface DeskProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function Desk({ position, rotation = [0, 0, 0] }: DeskProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Tampo — black ash veneer, rounded edges */}
      <RoundedBox args={[1.6, 0.06, 0.85]} radius={0.018} smoothness={3} material={MAT.surface} position={[0, 0.75, 0]} />
      {/* Borda metálica frontal */}
      <mesh geometry={GEO.trim}  material={MAT.metal}   position={[0, 0.73, 0.43]} />
      {/* Pernas */}
      {LEG_POSITIONS.map((pos, i) => (
        <mesh key={i} geometry={GEO.leg} material={MAT.leg} position={pos} />
      ))}
      {/* Bandeja inferior */}
      <mesh geometry={GEO.shelf} material={MAT.shelf} position={[0, 0.08, 0]} />
    </group>
  );
}
