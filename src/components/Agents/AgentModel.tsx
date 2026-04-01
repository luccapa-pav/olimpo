import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAgentStore } from '../../stores/agentStore';

interface AgentModelProps {
  agentId: string;
  positionPhase?: number;
  isSelected?: boolean;
}

// Shirt colors per agent — contraste visual para diferenciar personagens
const SHIRT: Record<string, string> = {
  atlas:      '#3A3018',  // dourado escuro
  hefesto:    '#1A2840',  // azul navy
  hermes:     '#0D2820',  // verde escuro
  prometheus: '#3A2010',  // âmbar escuro
  astraea:    '#380D20',  // rosa escuro
};
const SHIRT_DEFAULT = '#2E2E3A';

export function AgentModel({ agentId, positionPhase = 0, isSelected = false }: AgentModelProps) {
  const agent = useAgentStore((s) => s.agents.find((a) => a.id === agentId)!);

  const bodyRef     = useRef<THREE.Group>(null);
  const leftArmRef  = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // ── Medidas (pés em y=0) ──────────────────────────────────────
  const LEGS_H    = 0.22;
  const LEGS_CY   = LEGS_H / 2;                    // 0.11 — centro das pernas

  const TORSO_H   = 0.28;
  const TORSO_BOT = LEGS_H;                         // 0.22
  const TORSO_CY  = TORSO_BOT + TORSO_H / 2;        // 0.36
  const TORSO_TOP = TORSO_BOT + TORSO_H;             // 0.50

  const NECK_H    = 0.06;
  const NECK_CY   = TORSO_TOP + NECK_H / 2;         // 0.53

  const HEAD_R    = 0.155;
  const HEAD_CY   = NECK_CY + NECK_H / 2 + HEAD_R;  // 0.745

  const SHOULDER_Y = TORSO_BOT + TORSO_H * 0.75;    // 0.43

  const shirtColor = SHIRT[agentId] ?? SHIRT_DEFAULT;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const isWorking = agent.status === 'working';

    // Respiração — escala Y suave no tronco+cabeça
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(t * 1.1 + positionPhase) * 0.018;
    }

    // Braços: alcançam o teclado quando working
    const targetX = isWorking ? -1.2 : 0.15;
    const spd = Math.min(1, delta * 3.5);
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.x, targetX, spd,
      );
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.x, targetX, spd,
      );
    }
  });

  const headEmissive = isSelected ? 0.7 : 0.35;
  const statusColor =
    agent.status === 'working' ? '#00CC88'
    : agent.status === 'meeting' ? '#C9A84C'
    : '#555';

  return (
    <group ref={bodyRef}>

      {/* ── Pernas (postura sentada: rotation.x ≈ 60° p/ frente) ── */}
      <group position={[-0.06, LEGS_CY, 0]} rotation={[1.1, 0, 0.05]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.036, 0.030, LEGS_H, 6]} />
          <meshStandardMaterial color="#1A1A1A" roughness={0.8} />
        </mesh>
      </group>
      <group position={[0.06, LEGS_CY, 0]} rotation={[1.1, 0, -0.05]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.036, 0.030, LEGS_H, 6]} />
          <meshStandardMaterial color="#1A1A1A" roughness={0.8} />
        </mesh>
      </group>

      {/* ── Tronco / camisa ── */}
      <mesh position={[0, TORSO_CY, 0]}>
        <boxGeometry args={[0.22, TORSO_H, 0.13]} />
        <meshStandardMaterial
          color={shirtColor}
          emissive={shirtColor}
          emissiveIntensity={0.12}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* ── Pescoço ── */}
      <mesh position={[0, NECK_CY, 0]}>
        <cylinderGeometry args={[0.032, 0.032, NECK_H, 6]} />
        {/* tom de pele neutro */}
        <meshStandardMaterial color="#C8A882" roughness={0.6} />
      </mesh>

      {/* ── Cabeça ── */}
      <mesh position={[0, HEAD_CY, 0]}>
        <sphereGeometry args={[HEAD_R, 14, 10]} />
        <meshStandardMaterial
          color={agent.accentColor}
          emissive={agent.accentColor}
          emissiveIntensity={headEmissive}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>

      {/* ── Olhos ── (na face frontal, voltada p/ monitor em -Z)
           A câmera isométrica está em [14,14,14] então o lado -Z é parcialmente visível */}
      <mesh position={[-0.055, HEAD_CY + 0.025, -(HEAD_R - 0.01)]}>
        <sphereGeometry args={[0.022, 6, 6]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0.055, HEAD_CY + 0.025, -(HEAD_R - 0.01)]}>
        <sphereGeometry args={[0.022, 6, 6]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.9} />
      </mesh>
      {/* Pupilas */}
      <mesh position={[-0.055, HEAD_CY + 0.025, -(HEAD_R + 0.01)]}>
        <sphereGeometry args={[0.011, 5, 5]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.055, HEAD_CY + 0.025, -(HEAD_R + 0.01)]}>
        <sphereGeometry args={[0.011, 5, 5]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* ── Braço esquerdo (pivota do ombro) ── */}
      <group ref={leftArmRef} position={[-0.135, SHOULDER_Y, 0]}>
        <mesh position={[0, -0.10, 0]}>
          <cylinderGeometry args={[0.030, 0.024, 0.21, 6]} />
          <meshStandardMaterial
            color={shirtColor}
            emissive={shirtColor}
            emissiveIntensity={0.1}
            roughness={0.7}
          />
        </mesh>
      </group>

      {/* ── Braço direito ── */}
      <group ref={rightArmRef} position={[0.135, SHOULDER_Y, 0]}>
        <mesh position={[0, -0.10, 0]}>
          <cylinderGeometry args={[0.030, 0.024, 0.21, 6]} />
          <meshStandardMaterial
            color={shirtColor}
            emissive={shirtColor}
            emissiveIntensity={0.1}
            roughness={0.7}
          />
        </mesh>
      </group>

      {/* ══ Acessórios ══ */}

      {/* Atlas — medalhão dourado no peito */}
      {agentId === 'atlas' && (
        <mesh position={[0, TORSO_CY + 0.05, 0.07]}>
          <torusGeometry args={[0.05, 0.011, 8, 14]} />
          <meshStandardMaterial
            color="#FFD700" emissive="#C9A84C" emissiveIntensity={1.2}
            metalness={0.95} roughness={0.05}
          />
        </mesh>
      )}

      {/* Prometheus — óculos */}
      {agentId === 'prometheus' && (
        <group position={[0, HEAD_CY + 0.01, -(HEAD_R + 0.005)]}>
          <mesh position={[-0.054, 0, 0]}>
            <torusGeometry args={[0.033, 0.008, 6, 10]} />
            <meshStandardMaterial color="#6B3F00" emissive="#D8851E" emissiveIntensity={0.5} metalness={0.85} roughness={0.15} />
          </mesh>
          <mesh position={[0.054, 0, 0]}>
            <torusGeometry args={[0.033, 0.008, 6, 10]} />
            <meshStandardMaterial color="#6B3F00" emissive="#D8851E" emissiveIntensity={0.5} metalness={0.85} roughness={0.15} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.005, 0.005, 0.04, 4]} />
            <meshStandardMaterial color="#6B3F00" metalness={0.85} roughness={0.15} />
          </mesh>
        </group>
      )}

      {/* Astraea — colar (anel horizontal no pescoço) */}
      {agentId === 'astraea' && (
        <mesh position={[0, NECK_CY, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.044, 0.012, 8, 16]} />
          <meshStandardMaterial
            color={agent.accentColor} emissive={agent.accentColor}
            emissiveIntensity={0.7} metalness={0.6} roughness={0.2}
          />
        </mesh>
      )}

      {/* ── Indicador de status ── */}
      <mesh position={[0.16, HEAD_CY + HEAD_R + 0.1, 0]}>
        <sphereGeometry args={[0.040, 6, 6]} />
        <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={1.5} />
      </mesh>

    </group>
  );
}
