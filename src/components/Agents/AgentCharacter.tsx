import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAgentStore } from '../../stores/agentStore';

// ── Per-agent visual config ───────────────────────────────────────────────────
const CFG: Record<string, { shirt: string; pants: string; shoes: string; skin: string; hairColor: string }> = {
  atlas:      { shirt: '#F4F2EC', pants: '#1A1A2A', shoes: '#1A0F08', skin: '#C8A882', hairColor: '#3A2810' },
  hefesto:    { shirt: '#1A2840', pants: '#0D1520', shoes: '#222',    skin: '#C8A882', hairColor: '#0D0D0D' },
  hermes:     { shirt: '#0D3025', pants: '#0A1A10', shoes: '#1A2A1A', skin: '#C8A882', hairColor: '#8B6B3A' },
  prometheus: { shirt: '#E6E6E6', pants: '#222222', shoes: '#111',    skin: '#D4A870', hairColor: '#B85C20' },
  astraea:    { shirt: '#3A1020', pants: '#1A0A15', shoes: '#1A0A15', skin: '#E8C49A', hairColor: '#18083A' },
  iris:       { shirt: '#1A2050', pants: '#111830', shoes: '#111',    skin: '#C8A882', hairColor: '#7A2A40' },
};
const DEFAULT_CFG = { shirt: '#2E2E3A', pants: '#1A1A2A', shoes: '#111', skin: '#C8A882', hairColor: '#333' };

// ── Hair components (all receive headCY + headR + color) ─────────────────────

function HairAtlas({ headCY, headR, color }: { headCY: number; headR: number; color: string }) {
  // Neat flat-top businessman cut
  return (
    <group>
      <mesh position={[0, headCY + headR * 0.72, 0]}>
        <cylinderGeometry args={[headR * 0.82, headR * 0.9, headR * 0.38, 6]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}

function HairHefesto({ headCY, headR, color }: { headCY: number; headR: number; color: string }) {
  // Messy spiky clusters
  const clusters: [number, number, number][] = [
    [0,      headCY + headR * 0.92, 0],
    [-0.09,  headCY + headR * 0.85, 0.04],
    [0.09,   headCY + headR * 0.85, -0.04],
    [0.04,   headCY + headR * 0.97, 0.06],
    [-0.04,  headCY + headR * 0.94, -0.05],
  ];
  return (
    <group>
      {clusters.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[headR * 0.30, 6, 6]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function HairHermes({ headCY, headR, color }: { headCY: number; headR: number; color: string }) {
  // Side-swept medium brown
  return (
    <group>
      <mesh position={[-0.06, headCY + headR * 0.73, 0.02]}>
        <sphereGeometry args={[headR * 0.84, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
      {/* tufo frontal para o lado */}
      <mesh position={[-headR * 0.7, headCY + headR * 0.9, headR * 0.55]}>
        <boxGeometry args={[headR * 0.55, headR * 0.2, headR * 0.3]} />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
    </group>
  );
}

function HairPrometheus({ headCY, headR, color }: { headCY: number; headR: number; color: string }) {
  // Wavy copper / medium length
  return (
    <group>
      <mesh position={[0, headCY + headR * 0.72, 0]}>
        <sphereGeometry args={[headR * 0.93, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.78} />
      </mesh>
      {/* side waves */}
      <mesh position={[-headR * 0.88, headCY + headR * 0.18, 0]}>
        <sphereGeometry args={[headR * 0.36, 6, 6]} />
        <meshStandardMaterial color={color} roughness={0.78} />
      </mesh>
      <mesh position={[headR * 0.88, headCY + headR * 0.18, 0]}>
        <sphereGeometry args={[headR * 0.36, 6, 6]} />
        <meshStandardMaterial color={color} roughness={0.78} />
      </mesh>
    </group>
  );
}

function HairAstraea({ headCY, headR, color }: { headCY: number; headR: number; color: string }) {
  // Sleek dark cap + bun
  return (
    <group>
      <mesh position={[0, headCY + headR * 0.72, 0]}>
        <sphereGeometry args={[headR * 0.91, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.65} metalness={0.12} />
      </mesh>
      {/* bun */}
      <mesh position={[0, headCY + headR * 1.14, 0]}>
        <sphereGeometry args={[headR * 0.30, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.65} metalness={0.12} />
      </mesh>
      {/* bun band */}
      <mesh position={[0, headCY + headR * 1.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[headR * 0.30, 0.010, 6, 12]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.5} metalness={0.6} />
      </mesh>
    </group>
  );
}

function HairIris({ headCY, headR, color }: { headCY: number; headR: number; color: string }) {
  // Short pixie with front fringe
  return (
    <group>
      <mesh position={[0, headCY + headR * 0.76, 0]}>
        <sphereGeometry args={[headR * 0.85, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.83} />
      </mesh>
      <mesh position={[0, headCY + headR * 0.83, headR * 0.72]}>
        <boxGeometry args={[headR * 1.2, headR * 0.18, headR * 0.30]} />
        <meshStandardMaterial color={color} roughness={0.83} />
      </mesh>
    </group>
  );
}

const HAIR_MAP: Record<string, typeof HairAtlas> = {
  atlas: HairAtlas,
  hefesto: HairHefesto,
  hermes: HairHermes,
  prometheus: HairPrometheus,
  astraea: HairAstraea,
  iris: HairIris,
};

// ── Main component ────────────────────────────────────────────────────────────

interface AgentCharacterProps {
  agentId: string;
  positionPhase?: number;
  isSelected?: boolean;
}

export function AgentCharacter({ agentId, positionPhase = 0 }: AgentCharacterProps) {
  const agent = useAgentStore((s) => s.agents.find((a) => a.id === agentId)!);
  const cfg = CFG[agentId] ?? DEFAULT_CFG;

  const rootRef           = useRef<THREE.Group>(null);
  const shouldersRef      = useRef<THREE.Group>(null);
  const leftArmRef        = useRef<THREE.Group>(null);
  const rightArmRef       = useRef<THREE.Group>(null);
  const headRef           = useRef<THREE.Mesh>(null);
  const statusDotRef      = useRef<THREE.Mesh>(null);
  const bubbleMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const liftRef           = useRef(0);
  const isTypingRef       = useRef(false);

  // Chat bubble state: none → thinking (on working) → done (on idle after working) → none
  const [bubbleState, setBubbleState] = useState<'none' | 'thinking' | 'done'>('none');
  const prevStatusRef = useRef(agent.status);

  useEffect(() => {
    if (prevStatusRef.current === agent.status) return;
    if (agent.status === 'working') {
      setBubbleState('thinking');
    } else if (agent.status === 'idle' && prevStatusRef.current === 'working') {
      setBubbleState('done');
      const t = setTimeout(() => setBubbleState('none'), 2000);
      prevStatusRef.current = agent.status;
      return () => clearTimeout(t);
    }
    prevStatusRef.current = agent.status;
  }, [agent.status]);

  // Typing burst timer — runs independently of chat status
  useEffect(() => {
    let cancelled = false;
    const scheduleNext = () => {
      if (cancelled) return;
      setTimeout(() => {
        if (cancelled) return;
        isTypingRef.current = true;
        const duration = 2000 + Math.random() * 2000;
        setTimeout(() => {
          if (cancelled) return;
          isTypingRef.current = false;
          scheduleNext();
        }, duration);
      }, 5000 + Math.random() * 7000);
    };
    // Stagger start per agent
    const init = setTimeout(scheduleNext, positionPhase * 2000 + Math.random() * 4000);
    return () => { cancelled = true; clearTimeout(init); };
  }, [positionPhase]);

  // ── Measurements (y=0 = feet) ─────────────────────────────────────────────
  const LEGS_H     = 0.20;
  const LEGS_CY    = LEGS_H / 2;

  const TORSO_H    = 0.26;
  const TORSO_BOT  = LEGS_H;                         // 0.20
  const TORSO_CY   = TORSO_BOT + TORSO_H / 2;        // 0.33
  const TORSO_TOP  = TORSO_BOT + TORSO_H;             // 0.46

  const NECK_H     = 0.07;
  const NECK_CY    = TORSO_TOP + NECK_H / 2;          // 0.495

  const HEAD_R     = 0.21;
  const HEAD_CY    = TORSO_TOP + NECK_H + HEAD_R;     // 0.671 ≈ 0.67

  const SHOULDER_Y = TORSO_BOT + TORSO_H * 0.80;     // 0.408

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const isWorking = agent.status === 'working';

    // Breathing + subtle idle sway
    const breathSin = Math.sin(t * 1.1 + positionPhase);
    if (rootRef.current) {
      rootRef.current.scale.y = 1 + breathSin * 0.016;
      rootRef.current.rotation.z = Math.sin(t * 0.7 + positionPhase) * 0.007;
    }

    // Shoulder rise in sync with breathing
    if (shouldersRef.current) {
      shouldersRef.current.position.y = breathSin * 0.009;
    }

    // Head subtle look-around
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.8 + positionPhase) * 0.06;
    }

    // Arms reach toward keyboard when working; typing bursts add oscillation
    const targetX = isWorking ? -1.0 : 0.14;
    const spd = Math.min(1, delta * 3.5);
    const typingOsc = isTypingRef.current
      ? Math.sin(t * 14 + positionPhase) * (isWorking ? 0.10 : 0.055)
      : 0;
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, targetX + typingOsc, spd);
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, targetX - typingOsc, spd);
    }

    // Standing lift — sobe 0.28 unidades quando working
    const targetLift = isWorking ? 0.28 : 0;
    liftRef.current = THREE.MathUtils.lerp(liftRef.current, targetLift, delta * 4);
    if (rootRef.current) {
      rootRef.current.position.y = liftRef.current;
    }

    // Status dot pulse
    if (statusDotRef.current) {
      const mat = statusDotRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = isWorking
        ? 1.0 + Math.sin(t * 4) * 0.8
        : agent.status === 'meeting'
        ? 1.0 + Math.sin(t * 2) * 0.4
        : 1.5;
    }

    // Chat bubble opacity pulse when thinking
    if (bubbleMaterialRef.current && bubbleState === 'thinking') {
      bubbleMaterialRef.current.opacity = 0.55 + Math.sin(t * 3.5) * 0.25;
    }

    // Manter loop ativo para animações com frameloop="demand"
    state.invalidate();
  });

  const statusColor =
    agent.status === 'working'  ? '#0088FF'
    : agent.status === 'meeting' ? '#C9A84C'
    : '#00CC44';

  const HairComp = HAIR_MAP[agentId];

  return (
    <group ref={rootRef}>

      {/* ── LEGS — seated pose (bent toward +Z) ── */}
      <group position={[-0.065, LEGS_CY, 0]} rotation={[1.1, 0, 0.04]}>
        <mesh>
          <cylinderGeometry args={[0.038, 0.032, LEGS_H, 12]} />
          <meshStandardMaterial color={cfg.pants} roughness={0.85} />
        </mesh>
        <mesh position={[0, -(LEGS_H * 0.48), 0.05]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.058, 0.042, 0.09]} />
          <meshStandardMaterial color={cfg.shoes} roughness={0.75} metalness={0.1} />
        </mesh>
      </group>
      <group position={[0.065, LEGS_CY, 0]} rotation={[1.1, 0, -0.04]}>
        <mesh>
          <cylinderGeometry args={[0.038, 0.032, LEGS_H, 12]} />
          <meshStandardMaterial color={cfg.pants} roughness={0.85} />
        </mesh>
        <mesh position={[0, -(LEGS_H * 0.48), 0.05]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.058, 0.042, 0.09]} />
          <meshStandardMaterial color={cfg.shoes} roughness={0.75} metalness={0.1} />
        </mesh>
      </group>

      {/* ── TORSO ── */}
      <mesh position={[0, TORSO_CY, 0]}>
        <boxGeometry args={[0.25, TORSO_H, 0.15]} />
        <meshStandardMaterial
          color={cfg.shirt}
          emissive={cfg.shirt}
          emissiveIntensity={0.07}
          roughness={0.78}
          metalness={0.04}
        />
      </mesh>

      {/* ── NECK ── */}
      <mesh position={[0, NECK_CY, 0]}>
        <cylinderGeometry args={[0.035, 0.035, NECK_H, 12]} />
        <meshStandardMaterial color={cfg.skin} roughness={0.62} />
      </mesh>

      {/* ── HEAD ── */}
      <mesh ref={headRef} position={[0, HEAD_CY, 0]}>
        <sphereGeometry args={[HEAD_R, 16, 16]} />
        <meshStandardMaterial color={cfg.skin} roughness={0.55} />
      </mesh>

      {/* ── HAIR ── */}
      {HairComp && <HairComp headCY={HEAD_CY} headR={HEAD_R} color={cfg.hairColor} />}

      {/* ── EYES — on +Z face (toward camera) ── */}
      <mesh position={[-0.076, HEAD_CY + 0.038, HEAD_R - 0.012]}>
        <sphereGeometry args={[0.032, 14, 14]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.75} />
      </mesh>
      <mesh position={[0.076, HEAD_CY + 0.038, HEAD_R - 0.012]}>
        <sphereGeometry args={[0.032, 14, 14]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.75} />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.076, HEAD_CY + 0.038, HEAD_R + 0.016]}>
        <sphereGeometry args={[0.016, 6, 6]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0.076, HEAD_CY + 0.038, HEAD_R + 0.016]}>
        <sphereGeometry args={[0.016, 6, 6]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* ── ARMS — wrapped in shoulders group for breathing rise ── */}
      <group ref={shouldersRef}>
        {/* ── LEFT ARM ── */}
        <group ref={leftArmRef} position={[-0.148, SHOULDER_Y, 0]}>
          <mesh position={[0, -0.11, 0]}>
            <cylinderGeometry args={[0.033, 0.026, 0.22, 12]} />
            <meshStandardMaterial color={cfg.shirt} emissive={cfg.shirt} emissiveIntensity={0.05} roughness={0.78} />
          </mesh>
          <mesh position={[0, -0.225, 0]}>
            <sphereGeometry args={[0.030, 12, 12]} />
            <meshStandardMaterial color={cfg.skin} roughness={0.62} />
          </mesh>
        </group>

        {/* ── RIGHT ARM ── */}
        <group ref={rightArmRef} position={[0.148, SHOULDER_Y, 0]}>
          <mesh position={[0, -0.11, 0]}>
            <cylinderGeometry args={[0.033, 0.026, 0.22, 12]} />
            <meshStandardMaterial color={cfg.shirt} emissive={cfg.shirt} emissiveIntensity={0.05} roughness={0.78} />
          </mesh>
          <mesh position={[0, -0.225, 0]}>
            <sphereGeometry args={[0.030, 12, 12]} />
            <meshStandardMaterial color={cfg.skin} roughness={0.62} />
          </mesh>
        </group>
      </group>

      {/* ══ ACCESSORIES ══ */}

      {/* Atlas — white shirt strip + navy tie + gold medallion */}
      {agentId === 'atlas' && (
        <group>
          <mesh position={[0, TORSO_CY + 0.02, 0.077]}>
            <boxGeometry args={[0.065, TORSO_H * 0.72, 0.005]} />
            <meshStandardMaterial color="#F0EEE8" roughness={0.8} />
          </mesh>
          <mesh position={[0, TORSO_CY - 0.01, 0.081]}>
            <boxGeometry args={[0.033, TORSO_H * 0.56, 0.004]} />
            <meshStandardMaterial color="#1A2060" roughness={0.7} />
          </mesh>
          <mesh position={[0, TORSO_CY + 0.07, 0.082]}>
            <torusGeometry args={[0.036, 0.009, 8, 14]} />
            <meshStandardMaterial color="#FFD700" emissive="#C9A84C" emissiveIntensity={1.0} metalness={0.95} roughness={0.05} />
          </mesh>
        </group>
      )}

      {/* Hefesto — welding goggles on forehead */}
      {agentId === 'hefesto' && (
        <group position={[0, HEAD_CY + 0.055, HEAD_R * 0.68]}>
          <mesh position={[-0.068, 0, 0]}>
            <torusGeometry args={[0.040, 0.011, 6, 12]} />
            <meshStandardMaterial color="#4A3000" emissive="#FF8800" emissiveIntensity={0.45} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.068, 0, 0]}>
            <torusGeometry args={[0.040, 0.011, 6, 12]} />
            <meshStandardMaterial color="#4A3000" emissive="#FF8800" emissiveIntensity={0.45} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.006, 0.056, 4]} />
            <meshStandardMaterial color="#4A3000" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* Hermes — headphone arc + ear cups */}
      {agentId === 'hermes' && (
        <group>
          <mesh position={[0, HEAD_CY + HEAD_R * 0.58, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[HEAD_R * 0.92, 0.018, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#1A3A1A" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[-HEAD_R * 0.90, HEAD_CY, 0]}>
            <cylinderGeometry args={[0.042, 0.042, 0.052, 8]} />
            <meshStandardMaterial color="#0D2820" emissive="#00AA44" emissiveIntensity={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[HEAD_R * 0.90, HEAD_CY, 0]}>
            <cylinderGeometry args={[0.042, 0.042, 0.052, 8]} />
            <meshStandardMaterial color="#0D2820" emissive="#00AA44" emissiveIntensity={0.3} metalness={0.5} />
          </mesh>
        </group>
      )}

      {/* Prometheus — lab coat collar + glasses */}
      {agentId === 'prometheus' && (
        <group>
          {/* Lab coat collar */}
          <mesh position={[0, TORSO_TOP - 0.04, 0.076]}>
            <torusGeometry args={[0.052, 0.012, 6, 8]} />
            <meshStandardMaterial color="#DDDDDD" roughness={0.8} />
          </mesh>
          {/* Glasses */}
          <group position={[0, HEAD_CY + 0.012, HEAD_R + 0.006]}>
            <mesh position={[-0.068, 0, 0]}>
              <torusGeometry args={[0.042, 0.009, 6, 12]} />
              <meshStandardMaterial color="#6B3F00" emissive="#D8851E" emissiveIntensity={0.5} metalness={0.85} roughness={0.15} />
            </mesh>
            <mesh position={[0.068, 0, 0]}>
              <torusGeometry args={[0.042, 0.009, 6, 12]} />
              <meshStandardMaterial color="#6B3F00" emissive="#D8851E" emissiveIntensity={0.5} metalness={0.85} roughness={0.15} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.005, 0.005, 0.052, 4]} />
              <meshStandardMaterial color="#6B3F00" metalness={0.85} roughness={0.15} />
            </mesh>
          </group>
        </group>
      )}

      {/* Astraea — earrings + V-neck collar accent */}
      {agentId === 'astraea' && (
        <group>
          <mesh position={[-(HEAD_R * 0.95), HEAD_CY - 0.07, 0]}>
            <sphereGeometry args={[0.024, 6, 6]} />
            <meshStandardMaterial color={agent.accentColor} emissive={agent.accentColor} emissiveIntensity={0.9} metalness={0.5} />
          </mesh>
          <mesh position={[HEAD_R * 0.95, HEAD_CY - 0.07, 0]}>
            <sphereGeometry args={[0.024, 6, 6]} />
            <meshStandardMaterial color={agent.accentColor} emissive={agent.accentColor} emissiveIntensity={0.9} metalness={0.5} />
          </mesh>
          <mesh position={[0, TORSO_TOP - 0.05, 0.077]}>
            <torusGeometry args={[0.055, 0.011, 6, 8]} />
            <meshStandardMaterial color={agent.accentColor} emissive={agent.accentColor} emissiveIntensity={0.45} metalness={0.3} />
          </mesh>
        </group>
      )}

      {/* ── CHAT BUBBLE ── */}
      {bubbleState !== 'none' && (
        <group position={[-0.08, HEAD_CY + HEAD_R + 0.32, 0.05]}>
          <mesh>
            <sphereGeometry args={[0.13, 10, 10]} />
            <meshStandardMaterial
              ref={bubbleMaterialRef}
              color={bubbleState === 'done' ? '#00CC66' : '#FFFFFF'}
              emissive={bubbleState === 'done' ? '#00CC66' : '#FFFFFF'}
              emissiveIntensity={bubbleState === 'done' ? 0.8 : 0.4}
              transparent
              opacity={0.75}
            />
          </mesh>
          <Html center distanceFactor={4} style={{ pointerEvents: 'none' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 'bold',
              color: bubbleState === 'done' ? '#00CC66' : '#333',
              userSelect: 'none',
            }}>
              {bubbleState === 'done' ? '✓' : '···'}
            </span>
          </Html>
        </group>
      )}

      {/* ── STATUS indicator dot ── */}
      <mesh ref={statusDotRef} position={[0.19, HEAD_CY + HEAD_R + 0.11, 0]}>
        <sphereGeometry args={[0.040, 14, 14]} />
        <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={1.5} />
      </mesh>

    </group>
  );
}
