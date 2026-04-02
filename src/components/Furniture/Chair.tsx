import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

// ── Materiais executivos — carbono + couro ────────────────────────────────────
const MAT = {
  leather: new THREE.MeshStandardMaterial({ color: '#3A3A3A', roughness: 0.72, metalness: 0.0 }),
  carbon:  new THREE.MeshStandardMaterial({ color: '#0F0F0F', roughness: 0.20, metalness: 0.35 }),
  metal:   new THREE.MeshStandardMaterial({ color: '#444444', metalness: 0.70, roughness: 0.30 }),
  base:    new THREE.MeshStandardMaterial({ color: '#2A2A2A', metalness: 0.50, roughness: 0.50 }),
  stitch:  new THREE.MeshStandardMaterial({ color: '#505050', roughness: 0.95, metalness: 0.0 }),
};

const GEO = {
  column: new THREE.CylinderGeometry(0.04, 0.04, 0.5, 16),
  spoke:  new THREE.BoxGeometry(0.28, 0.04, 0.06),
  inner:  new THREE.BoxGeometry(0.44, 0.65, 0.01),
  head:   new THREE.BoxGeometry(0.30, 0.22, 0.07),
  arm:    new THREE.BoxGeometry(0.06, 0.08, 0.32),
  stitch: new THREE.BoxGeometry(0.40, 0.005, 0.003),
};

const STAR_ANGLES = [0, 72, 144, 216, 288];

interface ChairProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function Chair({ position, rotation = [0, 0, 0] }: ChairProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Assento — couro antracite */}
      <RoundedBox args={[0.55, 0.08, 0.55]} radius={0.025} smoothness={5}
        material={MAT.leather} position={[0, 0.5, 0]} />

      {/* Encosto externo — fibra de carbono */}
      <RoundedBox args={[0.52, 0.75, 0.08]} radius={0.02} smoothness={5}
        material={MAT.carbon} position={[0, 0.9, -0.22]} />

      {/* Encosto interno — couro */}
      <mesh geometry={GEO.inner} material={MAT.leather} position={[0, 0.9, -0.185]} />

      {/* Costuras horizontais */}
      {([-0.22, 0, 0.22] as number[]).map((dy, i) => (
        <mesh key={i} geometry={GEO.stitch} material={MAT.stitch}
          position={[0, 0.9 + dy, -0.18]} />
      ))}

      {/* Apoio de cabeça — carbono */}
      <mesh geometry={GEO.head} material={MAT.carbon} position={[0, 1.33, -0.20]} />

      {/* Coluna central */}
      <mesh geometry={GEO.column} material={MAT.metal} position={[0, 0.25, 0]} />

      {/* Base estrela */}
      {STAR_ANGLES.map((angle, i) => (
        <mesh key={i} geometry={GEO.spoke} material={MAT.base}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.28,
            0.03,
            Math.sin((angle * Math.PI) / 180) * 0.28,
          ]}
          rotation={[0, (-angle * Math.PI) / 180, 0]} />
      ))}

      {/* Braços */}
      <mesh geometry={GEO.arm} material={MAT.carbon} position={[-0.28, 0.62, -0.05]} />
      <mesh geometry={GEO.arm} material={MAT.carbon} position={[ 0.28, 0.62, -0.05]} />
    </group>
  );
}
