import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

// GLTF stub: import { useGLTF } from '@react-three/drei'
// const { scene } = useGLTF('/models/desk.glb')
// Drop desk.glb in /public/models/ to replace this procedural geometry

// ── Materiais compartilhados ─────────────────────────────────────────────────
const MAT = {
  surface: new THREE.MeshPhysicalMaterial({
    color: '#2A1A0A',
    roughness: 0.22,
    metalness: 0.08,
    clearcoat: 0.55,
    clearcoatRoughness: 0.15,
  }),
  metal:  new THREE.MeshStandardMaterial({ color: '#4A4A4A', metalness: 0.85, roughness: 0.15 }),
  leg:    new THREE.MeshStandardMaterial({ color: '#3A3A3A', metalness: 0.70, roughness: 0.30 }),
  shelf:  new THREE.MeshStandardMaterial({ color: '#1C1208', roughness: 0.75, metalness: 0.05 }),
};

interface DeskProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
}

export function Desk({ position, rotation = [0, 0, 0], width = 1.6 }: DeskProps) {
  const hw = width / 2 - 0.08;
  const legPositions: [number, number, number][] = [
    [-hw, 0.35, -0.38],
    [ hw, 0.35, -0.38],
    [-hw, 0.35,  0.38],
    [ hw, 0.35,  0.38],
  ];
  return (
    <group position={position} rotation={rotation}>
      {/* Tampo — nogueira escura polida, rounded edges */}
      <RoundedBox args={[width, 0.06, 0.85]} radius={0.018} smoothness={4}
        material={MAT.surface} position={[0, 0.75, 0]} />
      {/* Borda metálica frontal */}
      <mesh material={MAT.metal} position={[0, 0.73, 0.43]}>
        <boxGeometry args={[width, 0.03, 0.02]} />
      </mesh>
      {/* Pernas */}
      {legPositions.map((pos, i) => (
        <mesh key={i} material={MAT.leg} position={pos}>
          <boxGeometry args={[0.06, 0.7, 0.06]} />
        </mesh>
      ))}
      {/* Bandeja inferior */}
      <mesh material={MAT.shelf} position={[0, 0.08, 0]}>
        <boxGeometry args={[width - 0.2, 0.03, 0.6]} />
      </mesh>
    </group>
  );
}
