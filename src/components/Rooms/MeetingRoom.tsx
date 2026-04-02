import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useAgentStore } from '../../stores/agentStore';

// Sala de Reunião Geral: x[-8,-1], z[-12,-7]
// Centro: (-4.5, 0, -9.5) | Largura: 7 | Profundidade: 5
const WALL_H = 3.5;
const MR_CX = -4.5;
const MR_CZ = -9.5;
const MR_W = 7;
const MR_D = 5;

// ── Materiais das cadeiras executivas ─────────────────────────────────────────
const CMAT = {
  leather: new THREE.MeshStandardMaterial({ color: '#3A3A3A', roughness: 0.72 }),
  carbon:  new THREE.MeshStandardMaterial({ color: '#0F0F0F', roughness: 0.20, metalness: 0.35 }),
  metal:   new THREE.MeshStandardMaterial({ color: '#444444', metalness: 0.70, roughness: 0.30 }),
  base:    new THREE.MeshStandardMaterial({ color: '#2A2A2A', metalness: 0.50, roughness: 0.50 }),
};

const STAR_DEG = [0, 72, 144, 216, 288];

interface PosProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

// ── Cadeira executiva: carbono + couro ────────────────────────────────────────
function MeetingChair({ position, rotation = [0, 0, 0] }: PosProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Assento — couro antracite */}
      <RoundedBox args={[0.55, 0.08, 0.55]} radius={0.025} smoothness={5}
        material={CMAT.leather} position={[0, 0.5, 0]} />
      {/* Encosto externo — fibra de carbono */}
      <RoundedBox args={[0.52, 0.75, 0.08]} radius={0.02} smoothness={5}
        material={CMAT.carbon} position={[0, 0.9, -0.22]} />
      {/* Encosto interno — couro */}
      <mesh position={[0, 0.9, -0.185]} material={CMAT.leather}>
        <boxGeometry args={[0.44, 0.65, 0.01]} />
      </mesh>
      {/* Costuras horizontais visíveis */}
      {([-0.22, 0, 0.22] as number[]).map((dy, i) => (
        <mesh key={i} position={[0, 0.9 + dy, -0.18]}>
          <boxGeometry args={[0.40, 0.005, 0.003]} />
          <meshStandardMaterial color="#505050" roughness={0.95} />
        </mesh>
      ))}
      {/* Apoio de cabeça — carbono */}
      <mesh position={[0, 1.33, -0.20]} material={CMAT.carbon}>
        <boxGeometry args={[0.30, 0.22, 0.07]} />
      </mesh>
      {/* Coluna central */}
      <mesh position={[0, 0.25, 0]} material={CMAT.metal}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
      </mesh>
      {/* Base estrela */}
      {STAR_DEG.map((angle, i) => (
        <mesh key={i} material={CMAT.base}
          position={[Math.cos((angle * Math.PI) / 180) * 0.28, 0.03, Math.sin((angle * Math.PI) / 180) * 0.28]}
          rotation={[0, (-angle * Math.PI) / 180, 0]}>
          <boxGeometry args={[0.28, 0.04, 0.06]} />
        </mesh>
      ))}
      {/* Braços */}
      <mesh position={[-0.28, 0.62, -0.05]} material={CMAT.carbon}>
        <boxGeometry args={[0.06, 0.08, 0.32]} />
      </mesh>
      <mesh position={[0.28, 0.62, -0.05]} material={CMAT.carbon}>
        <boxGeometry args={[0.06, 0.08, 0.32]} />
      </mesh>
    </group>
  );
}

// ── Vaso alto de concreto com planta elegante ─────────────────────────────────
function TallPlanter({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.24, 0.18, 1.10, 14]} />
        <meshStandardMaterial color="#585858" roughness={0.95} metalness={0} />
      </mesh>
      <mesh position={[0, 1.06, 0]}>
        <torusGeometry args={[0.24, 0.02, 6, 18]} />
        <meshStandardMaterial color="#484848" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.10, 0]}>
        <circleGeometry args={[0.22, 12]} />
        <meshStandardMaterial color="#1A1008" roughness={1.0} />
      </mesh>
      {[0, 90, 180, 270].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        const lean = 0.10 + (i % 2) * 0.06;
        return (
          <group key={i}>
            <mesh position={[Math.sin(r) * lean * 0.5, 1.75, Math.cos(r) * lean * 0.5]}
              rotation={[Math.cos(r) * 0.25, r, -Math.sin(r) * 0.25]}>
              <cylinderGeometry args={[0.007, 0.013, 1.50, 6]} />
              <meshStandardMaterial color="#3A2A12" roughness={0.9} />
            </mesh>
            {[0.3, 0.6, 0.9].map((t, j) => (
              <mesh key={j}
                position={[Math.sin(r) * lean * (0.3 + t * 0.6), 1.1 + t * 1.3, Math.cos(r) * lean * (0.3 + t * 0.6)]}
                rotation={[Math.cos(r) * 0.4 * t, r + Math.PI / 2, -Math.sin(r) * 0.4 * t]}>
                <boxGeometry args={[0.005, 0.22, 0.09]} />
                <meshStandardMaterial color={j % 2 === 0 ? '#2D5A3D' : '#3A6B4A'} roughness={0.85} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

// ── Divisória de vidro ────────────────────────────────────────────────────────
function GlassDivider({
  position, args, rotation = [0, 0, 0] as [number, number, number],
}: { position: [number, number, number]; args: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshPhysicalMaterial color="#e6f2ff" transmission={0.95} roughness={0.05} thickness={0.2} metalness={0} ior={1.5} />
    </mesh>
  );
}

// ── Porta de vidro com animação ───────────────────────────────────────────────
function RoomDoor({ position, open }: { position: [number, number, number]; open: boolean }) {
  const pivotRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!pivotRef.current) return;
    const target = open ? -Math.PI / 2 : 0;
    pivotRef.current.rotation.y = THREE.MathUtils.lerp(pivotRef.current.rotation.y, target, delta * 5);
    state.invalidate();
  });
  const [x, , z] = position;
  return (
    <group>
      <group ref={pivotRef} position={[x - 0.4, 0, z]}>
        <mesh position={[0.4, 0.75, 0]}>
          <boxGeometry args={[0.82, 1.52, 0.07]} />
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.4, 0.75, 0]}>
          <boxGeometry args={[0.68, 1.34, 0.05]} />
          <meshPhysicalMaterial color="#e6f2ff" transmission={0.95} roughness={0.05} thickness={0.15} metalness={0} ior={1.5} />
        </mesh>
        <mesh position={[0.70, 0.75, 0.04]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      <mesh position={[x, 1.65, z + 0.04]}>
        <boxGeometry args={[0.66, 0.12, 0.03]} />
        <meshStandardMaterial color="#8899AA" emissive="#8899AA" emissiveIntensity={0.4} metalness={0.4} />
      </mesh>
    </group>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
interface MeetingRoomProps {
  agentCount: number;
}

export function MeetingRoom({ agentCount }: MeetingRoomProps) {
  const anyMeeting = useAgentStore(s => s.agents.some(a => a.status === 'meeting'));
  const [doorOpen, setDoorOpen] = useState(false);
  const tvMatRef   = useRef<THREE.MeshStandardMaterial>(null);
  const glowLightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    if (anyMeeting) {
      setDoorOpen(true);
    } else {
      const t = setTimeout(() => setDoorOpen(false), 1500);
      return () => clearTimeout(t);
    }
  }, [anyMeeting]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tvMatRef.current) {
      const targetIntensity = anyMeeting ? 0.45 + Math.sin(t * 3) * 0.06 : 0.12;
      tvMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(tvMatRef.current.emissiveIntensity, targetIntensity, 0.04);
      tvMatRef.current.emissive.set(anyMeeting ? '#0A3A6A' : '#0A2040');
    }
    if (glowLightRef.current) {
      const targetGlow = anyMeeting ? 0.6 + Math.sin(t * 2) * 0.1 : 0.2;
      glowLightRef.current.intensity = THREE.MathUtils.lerp(glowLightRef.current.intensity, targetGlow, 0.04);
    }
    state.invalidate();
  });

  const tableLen     = Math.min(Math.max((agentCount + 1) * 0.8, 3.0), MR_W - 1.5);
  const tableW       = 1.2;
  const tableY       = 0.75;
  const tableSurface = tableY + 0.033;

  const chairsPerSide = Math.max(Math.ceil(agentCount / 2), 2);
  const chairSpacing  = tableLen / (chairsPerSide + 1);

  const DOOR_W      = 0.9;
  const doorX       = MR_CX;
  const leftPanelW  = (doorX - DOOR_W / 2) - (-8);
  const leftPanelCX = -8 + leftPanelW / 2;
  const rightPanelW = -1 - (doorX + DOOR_W / 2);
  const rightPanelCX = (doorX + DOOR_W / 2) + rightPanelW / 2;

  return (
    <group>
      {/* ── DIVISÓRIAS DE VIDRO ── */}
      <GlassDivider position={[-1, WALL_H / 2, MR_CZ]} args={[0.06, WALL_H, MR_D]} />
      <GlassDivider position={[leftPanelCX, WALL_H / 2, -7]}  args={[leftPanelW, WALL_H, 0.06]} />
      <GlassDivider position={[rightPanelCX, WALL_H / 2, -7]} args={[rightPanelW, WALL_H, 0.06]} />
      <RoomDoor position={[doorX, 0, -7]} open={doorOpen} />

      {/* ── PAINEL DE RIPAS ACÚSTICAS — parede norte ── */}
      {/* Backing escuro */}
      <mesh position={[MR_CX, 1.75, -11.92]}>
        <boxGeometry args={[6.6, 2.2, 0.018]} />
        <meshStandardMaterial color="#1C1208" roughness={0.9} />
      </mesh>
      {/* Ripas verticais de nogueira */}
      {Array.from({ length: 24 }, (_, i) => {
        const x = -7.7 + i * 0.275;
        return (
          <mesh key={i} position={[x, 1.75, -11.90]}>
            <boxGeometry args={[0.08, 2.0, 0.038]} />
            <meshStandardMaterial color="#5A3A18" roughness={0.65} />
          </mesh>
        );
      })}
      {/* LED wash quente sobre as ripas */}
      <pointLight position={[MR_CX, 3.3, -11.4]} intensity={1.2} color="#FFE0A0" distance={3.5} decay={2} />

      {/* ── TV EXECUTIVA ULTRA-THIN — parede norte ── */}
      {/* Moldura preta minimalista */}
      <mesh position={[MR_CX, 1.65, -11.885]}>
        <boxGeometry args={[2.6, 1.55, 0.028]} />
        <meshStandardMaterial color="#0A0A0A" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Tela — Olimpo HQ standby */}
      <mesh position={[MR_CX, 1.65, -11.870]}>
        <boxGeometry args={[2.44, 1.38, 0.004]} />
        <meshStandardMaterial ref={tvMatRef} color="#050D1A" emissive="#0A2040" emissiveIntensity={0.12} roughness={0.05} />
      </mesh>
      {/* Logo stripe dourada — "OLIMPO HQ" em standby */}
      <mesh position={[MR_CX, 1.65, -11.866]}>
        <boxGeometry args={[0.9, 0.06, 0.002]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.7} metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Glow da tela projetado para frente */}
      <pointLight ref={glowLightRef} position={[MR_CX, 1.65, -11.3]} intensity={0.2} color="#204080" distance={4} decay={2} />

      {/* ── TAPETE ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[MR_CX, 0.001, MR_CZ]}>
        <planeGeometry args={[tableLen + 1.2, tableW + 2.2]} />
        <meshStandardMaterial color="#161210" roughness={0.95} metalness={0} />
      </mesh>

      {/* ── MESA — nogueira escura polida ── */}
      <mesh position={[MR_CX, tableY, MR_CZ]}>
        <boxGeometry args={[tableLen, 0.06, tableW]} />
        <meshStandardMaterial color="#2A1A0A" roughness={0.22} metalness={0.12} />
      </mesh>
      {/* Borda metálica */}
      <mesh position={[MR_CX, tableY - 0.04, MR_CZ]}>
        <boxGeometry args={[tableLen + 0.04, 0.02, tableW + 0.04]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Pernas */}
      {([
        [ tableLen / 2 - 0.2,  tableW / 2 - 0.15],
        [-(tableLen / 2 - 0.2),  tableW / 2 - 0.15],
        [ tableLen / 2 - 0.2, -(tableW / 2 - 0.15)],
        [-(tableLen / 2 - 0.2), -(tableW / 2 - 0.15)],
      ] as [number, number][]).map(([ox, oz], i) => (
        <mesh key={i} position={[MR_CX + ox, tableY / 2 - 0.03, MR_CZ + oz]}>
          <cylinderGeometry args={[0.04, 0.04, tableY - 0.03, 8]} />
          <meshStandardMaterial color="#3A3A3A" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* ── RÉGUAS DE CONECTORES EMBUTIDOS (3) ── */}
      {([-0.28, 0, 0.28] as number[]).map((ox, i) => (
        <group key={i} position={[MR_CX + ox * tableLen * 0.8, tableSurface + 0.006, MR_CZ]}>
          <mesh>
            <boxGeometry args={[0.28, 0.010, 0.07]} />
            <meshStandardMaterial color="#1A1A1A" metalness={0.85} roughness={0.15} />
          </mesh>
          {([-0.08, 0, 0.08] as number[]).map((dx, j) => (
            <mesh key={j} position={[dx, 0.006, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.003, 8]} />
              <meshStandardMaterial color="#111" emissive="#00CCFF" emissiveIntensity={0.3} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── CADERNOS A5 (3) ── */}
      {([-0.28, 0, 0.28] as number[]).map((ox, i) => (
        <group key={i} position={[MR_CX + ox * tableLen * 0.6, tableSurface, MR_CZ - 0.3]}
          rotation={[0, (i - 1) * 0.08, 0]}>
          <mesh>
            <boxGeometry args={[0.15, 0.011, 0.21]} />
            <meshStandardMaterial color="#0F0F0F" roughness={0.8} />
          </mesh>
          {/* Faixa dourada */}
          <mesh position={[-0.074, 0.006, 0]}>
            <boxGeometry args={[0.005, 0.012, 0.21]} />
            <meshStandardMaterial color="#C9A84C" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* ── CANETAS EXECUTIVAS (3) ── */}
      {([-0.28, 0, 0.28] as number[]).map((ox, i) => (
        <mesh key={i} position={[MR_CX + ox * tableLen * 0.6 + 0.11, tableSurface + 0.003, MR_CZ - 0.22]}
          rotation={[0, 0.15, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.14, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* ── COPOS DE ÁGUA (2) ── */}
      {([-0.5, 0.5] as number[]).map((oz, i) => (
        <mesh key={i} position={[MR_CX, tableSurface + 0.048, MR_CZ + oz]}>
          <cylinderGeometry args={[0.027, 0.022, 0.095, 12]} />
          <meshPhysicalMaterial transmission={0.92} roughness={0.05} thickness={0.04} color="#FFFFFF" />
        </mesh>
      ))}

      {/* ── XÍCARAS DE CAFÉ (2) ── */}
      {([-1.0, 1.0] as number[]).map((ox, i) => (
        <group key={i} position={[MR_CX + ox * 0.4, tableSurface, MR_CZ + 0.2]}>
          <mesh position={[0, 0.025, 0]}>
            <cylinderGeometry args={[0.025, 0.020, 0.048, 12]} />
            <meshStandardMaterial color="#F8F5F0" roughness={0.6} />
          </mesh>
          {/* Pires */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
            <circleGeometry args={[0.040, 12]} />
            <meshStandardMaterial color="#F8F5F0" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ── CADEIRAS ── */}
      {Array.from({ length: chairsPerSide }, (_, i) => (
        <MeetingChair key={`n${i}`}
          position={[MR_CX - tableLen / 2 + chairSpacing * (i + 1), 0, MR_CZ - tableW / 2 - 0.55]}
          rotation={[0, 0, 0]} />
      ))}
      {Array.from({ length: chairsPerSide }, (_, i) => (
        <MeetingChair key={`s${i}`}
          position={[MR_CX - tableLen / 2 + chairSpacing * (i + 1), 0, MR_CZ + tableW / 2 + 0.55]}
          rotation={[0, Math.PI, 0]} />
      ))}
      <MeetingChair position={[MR_CX - tableLen / 2 - 0.55, 0, MR_CZ]} rotation={[0, Math.PI / 2, 0]} />
      <MeetingChair position={[MR_CX + tableLen / 2 + 0.55, 0, MR_CZ]} rotation={[0, -Math.PI / 2, 0]} />

      {/* ── VASO ALTO — canto junto à porta ── */}
      <TallPlanter position={[-7.2, 0, -7.4]} />

      {/* Luz gerenciada pelo Lighting.tsx */}
    </group>
  );
}
