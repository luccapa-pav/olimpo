import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Hue inicial por agente para fases distintas
const AGENT_HUE_OFFSET: Record<string, number> = {
  atlas:      0.12,   // amber/gold
  hefesto:    0.60,   // blue
  hermes:     0.33,   // green
  prometheus: 0.08,   // orange
  astraea:    0.88,   // pink/magenta
  iris:       0.72,   // violet
};

interface PCTowerProps {
  position: [number, number, number];
  agentId: string;
}

export function PCTower({ position, agentId }: PCTowerProps) {
  const glowMatRef    = useRef<THREE.MeshStandardMaterial>(null);
  const stripMatRef   = useRef<THREE.MeshStandardMaterial>(null);
  const hueOffset     = AGENT_HUE_OFFSET[agentId] ?? 0.5;
  const glowColor     = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Full color cycle every ~25 seconds, offset per agent
    const hue = (hueOffset + t * 0.04) % 1;
    glowColor.setHSL(hue, 0.85, 0.55);

    if (glowMatRef.current) {
      glowMatRef.current.emissive.copy(glowColor);
      glowMatRef.current.emissiveIntensity = 0.6 + Math.sin(t * 1.5) * 0.15;
    }
    if (stripMatRef.current) {
      stripMatRef.current.emissive.copy(glowColor);
      stripMatRef.current.emissiveIntensity = 0.9 + Math.sin(t * 1.5) * 0.1;
    }
    state.invalidate();
  });

  return (
    <group position={position}>
      {/* Case body */}
      <mesh position={[0, 0.21, 0]}>
        <boxGeometry args={[0.18, 0.42, 0.22]} />
        <meshStandardMaterial color="#0F0F0F" metalness={0.65} roughness={0.35} />
      </mesh>

      {/* Transparent side panel (left face) */}
      <mesh position={[-0.088, 0.21, 0]}>
        <boxGeometry args={[0.008, 0.38, 0.20]} />
        <meshPhysicalMaterial
          color="#0A1520"
          transmission={0.55}
          roughness={0.05}
          metalness={0.05}
          thickness={0.01}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Internal RGB glow (behind side panel) */}
      <mesh position={[-0.06, 0.21, 0]}>
        <boxGeometry args={[0.04, 0.30, 0.14]} />
        <meshStandardMaterial
          ref={glowMatRef}
          color="#000000"
          emissive="#ffffff"
          emissiveIntensity={0.6}
          roughness={1}
          metalness={0}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* RGB front strip */}
      <mesh position={[0.091, 0.21, 0]}>
        <boxGeometry args={[0.006, 0.36, 0.008]} />
        <meshStandardMaterial
          ref={stripMatRef}
          color="#000000"
          emissive="#ffffff"
          emissiveIntensity={0.9}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Top panel */}
      <mesh position={[0, 0.425, 0]}>
        <boxGeometry args={[0.17, 0.015, 0.21]} />
        <meshStandardMaterial color="#181818" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Front mesh grill (upper) */}
      <mesh position={[0.091, 0.30, 0]}>
        <boxGeometry args={[0.004, 0.14, 0.18]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Fan circle 1 */}
      <mesh position={[0.091, 0.30, 0.04]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.048, 0.006, 6, 18]} />
        <meshStandardMaterial color="#222222" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Fan circle 2 */}
      <mesh position={[0.091, 0.30, -0.04]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.038, 0.005, 6, 16]} />
        <meshStandardMaterial color="#1E1E1E" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Power LED */}
      <mesh position={[0.092, 0.10, 0.08]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color="#00FF44" emissive="#00FF44" emissiveIntensity={3} />
      </mesh>

      {/* Power button */}
      <mesh position={[0.092, 0.10, 0.04]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.006, 10]} />
        <meshStandardMaterial color="#222222" metalness={0.4} roughness={0.7} />
      </mesh>

      {/* Base feet */}
      {[-0.07, 0.07].map((x, i) => (
        <mesh key={i} position={[x, 0.008, 0]}>
          <boxGeometry args={[0.04, 0.015, 0.20]} />
          <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
