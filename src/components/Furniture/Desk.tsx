import * as THREE from 'three';

// ── Geometrias e materiais compartilhados — criados UMA vez, reutilizados em TODAS as mesas
const GEO = {
  top:   new THREE.BoxGeometry(1.6, 0.06, 0.85),
  trim:  new THREE.BoxGeometry(1.6, 0.03, 0.02),
  leg:   new THREE.BoxGeometry(0.06, 0.7, 0.06),
  shelf: new THREE.BoxGeometry(1.4, 0.03, 0.6),
};

const MAT = {
  surface: new THREE.MeshStandardMaterial({ color: '#3A3A3A', roughness: 0.5, metalness: 0.2 }),
  metal:   new THREE.MeshStandardMaterial({ color: '#444444', metalness: 0.8, roughness: 0.2 }),
  leg:     new THREE.MeshStandardMaterial({ color: '#444444', metalness: 0.6, roughness: 0.4 }),
  shelf:   new THREE.MeshStandardMaterial({ color: '#323232', roughness: 0.8 }),
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
      {/* Tampo */}
      <mesh geometry={GEO.top}   material={MAT.surface} position={[0, 0.75, 0]} />
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
