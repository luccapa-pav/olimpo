import * as THREE from 'three';

// ── Geometrias e materiais compartilhados — criados UMA vez, reutilizados em TODAS as cadeiras
// Reduz draw calls e elimina alocação de buffers duplicados na GPU
const GEO = {
  seat:     new THREE.BoxGeometry(0.55, 0.08, 0.55),
  backrest: new THREE.BoxGeometry(0.52, 0.75, 0.07),
  headrest: new THREE.BoxGeometry(0.3, 0.22, 0.07),
  column:   new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6),
  arm:      new THREE.BoxGeometry(0.06, 0.08, 0.32),
  spoke:    new THREE.BoxGeometry(0.28, 0.04, 0.06),
};

const MAT = {
  dark:   new THREE.MeshStandardMaterial({ color: '#2E2E2E', roughness: 0.9 }),
  mid:    new THREE.MeshStandardMaterial({ color: '#353535', roughness: 0.9 }),
  metal:  new THREE.MeshStandardMaterial({ color: '#444444', metalness: 0.7, roughness: 0.3 }),
  base:   new THREE.MeshStandardMaterial({ color: '#323232', metalness: 0.5, roughness: 0.5 }),
};

const STAR_ANGLES = [0, 72, 144, 216, 288];

interface ChairProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function Chair({ position, rotation = [0, 0, 0] }: ChairProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Assento */}
      <mesh geometry={GEO.seat} material={MAT.dark} position={[0, 0.5, 0]} />

      {/* Encosto */}
      <mesh geometry={GEO.backrest} material={MAT.dark} position={[0, 0.9, -0.22]} />

      {/* Apoio de cabeça */}
      <mesh geometry={GEO.headrest} material={MAT.mid} position={[0, 1.33, -0.2]} />

      {/* Coluna central */}
      <mesh geometry={GEO.column} material={MAT.metal} position={[0, 0.25, 0]} />

      {/* Base estrela */}
      {STAR_ANGLES.map((angle, i) => (
        <mesh
          key={i}
          geometry={GEO.spoke}
          material={MAT.base}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.28,
            0.03,
            Math.sin((angle * Math.PI) / 180) * 0.28,
          ]}
          rotation={[0, (-angle * Math.PI) / 180, 0]}
        />
      ))}

      {/* Braços */}
      <mesh geometry={GEO.arm} material={MAT.mid} position={[-0.28, 0.62, -0.05]} />
      <mesh geometry={GEO.arm} material={MAT.mid} position={[ 0.28, 0.62, -0.05]} />
    </group>
  );
}
