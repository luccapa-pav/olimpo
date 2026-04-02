import { Desk } from '../Furniture/Desk';
import { Chair } from '../Furniture/Chair';
import { Monitor } from '../Furniture/Monitor';
import { LargePot, ShelfWithPlants } from '../Furniture/Plant';
import { Agent } from '../Agents/Agent';
import type { AgentState } from '../../types';

// Sala do CEO: x[-14,-8], z[-12,-7] → 6×5 unidades
// Paredes externas (norte/oeste) fornecidas pelo Floor.tsx

const WALL_H = 3.5;

function GlassDivider({
  position,
  args,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  args: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshPhysicalMaterial
        color="#1a2a3a"
        transmission={0.6}
        roughness={0.1}
        thickness={0.05}
        metalness={0.1}
        opacity={0.7}
        transparent
      />
    </mesh>
  );
}

interface CeoRoomProps {
  agent: AgentState;
  onAgentClick: () => void;
  isSelected: boolean;
}

export function CeoRoom({ agent, onAgentClick, isSelected }: CeoRoomProps) {
  const cx = -11;
  const cz = -9.5;
  const isActive = agent.status !== 'idle';
  const isWorking = agent.status === 'working';

  return (
    <group>

      {/* ── DIVISÓRIAS DE VIDRO ── */}
      <GlassDivider position={[-8, WALL_H / 2, -9.5]} args={[0.06, WALL_H, 5]} />
      <GlassDivider position={[-11, WALL_H / 2, -7]} args={[6, WALL_H, 0.06]} />

      {/* ── PAINÉIS ACÚSTICOS — parede oeste (x = -14) ── */}
      {/* Painel inferior */}
      <mesh position={[-13.88, 1.0, cz]}>
        <boxGeometry args={[0.05, 0.9, 4.2]} />
        <meshStandardMaterial color="#1A2035" roughness={1.0} metalness={0} />
      </mesh>
      {/* Painel superior */}
      <mesh position={[-13.88, 2.2, cz]}>
        <boxGeometry args={[0.05, 0.9, 4.2]} />
        <meshStandardMaterial color="#1A2035" roughness={1.0} metalness={0} />
      </mesh>
      {/* Divisórias verticais entre painéis */}
      {([-11.1, -9.5, -7.9] as number[]).map((z, i) => (
        <mesh key={i} position={[-13.88, 1.6, z]}>
          <boxGeometry args={[0.06, 1.8, 0.06]} />
          <meshStandardMaterial color="#2A3050" metalness={0.3} roughness={0.7} />
        </mesh>
      ))}

      {/* ── LED COVE — perímetro do teto da sala CEO ── */}
      {/* Norte */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[cx, 3.46, -11.92]}>
        <planeGeometry args={[5.8, 0.06]} />
        <meshStandardMaterial color={agent.accentColor} emissive={agent.accentColor} emissiveIntensity={0.7} />
      </mesh>
      {/* Sul */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[cx, 3.46, -7.08]}>
        <planeGeometry args={[5.8, 0.06]} />
        <meshStandardMaterial color={agent.accentColor} emissive={agent.accentColor} emissiveIntensity={0.7} />
      </mesh>
      {/* Oeste */}
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[-13.92, 3.46, cz]}>
        <planeGeometry args={[4.8, 0.06]} />
        <meshStandardMaterial color={agent.accentColor} emissive={agent.accentColor} emissiveIntensity={0.7} />
      </mesh>
      {/* Leste */}
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[-8.08, 3.46, cz]}>
        <planeGeometry args={[4.8, 0.06]} />
        <meshStandardMaterial color={agent.accentColor} emissive={agent.accentColor} emissiveIntensity={0.7} />
      </mesh>
      {/* Luz ambiente da sala */}
      <pointLight position={[cx, 2.8, cz]} intensity={0.5} color={agent.accentColor} distance={7} decay={2} />
      {/* RGB cool sob a mesa */}
      <pointLight position={[cx, 0.25, cz - 0.2]} intensity={0.35} color="#00FF88" distance={2.5} decay={2} />
      {/* Warm LED no console de troféus */}
      <pointLight position={[-8.5, 1.6, -9.5]} intensity={0.4} color="#FFF5D6" distance={4} decay={2} />

      {/* ── MESA PRINCIPAL (única) — largura estendida para triple monitor ── */}
      <Desk position={[cx, 0, cz - 0.3]} width={3.2} />

      {/* ── TRIPLE MONITOR SETUP ── */}

      {/* Monitor central — ultrawide 1.4×0.62 */}
      <group position={[cx, 1.255, cz - 0.66]}>
        {/* Frame */}
        <mesh>
          <boxGeometry args={[1.4, 0.62, 0.04]} />
          <meshStandardMaterial color="#111111" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Display */}
        <mesh position={[0, 0, 0.022]}>
          <boxGeometry args={[1.32, 0.55, 0.001]} />
          <meshStandardMaterial
            color={isActive ? agent.accentColor : '#050C18'}
            emissive={isActive ? agent.accentColor : '#0A1A2E'}
            emissiveIntensity={isActive ? 0.65 : 0.18}
            roughness={0.08}
          />
        </mesh>
        {/* Suporte articulado — haste */}
        <mesh position={[0, -0.38, 0.04]}>
          <boxGeometry args={[0.04, 0.08, 0.04]} />
          <meshStandardMaterial color="#3A3A3A" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Base do suporte */}
        <mesh position={[0, -0.46, 0.09]}>
          <boxGeometry args={[0.38, 0.03, 0.22]} />
          <meshStandardMaterial color="#2E2E2E" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>

      {/* Monitor esquerdo — angulado 22° inward */}
      <Monitor
        position={[cx - 1.15, 1.18, cz - 0.50]}
        rotation={[0, 0.38, 0]}
        active={isWorking}
        accentColor="#1A3A6A"
        agentId="atlas"
      />

      {/* Monitor direito — angulado 22° inward */}
      <Monitor
        position={[cx + 1.15, 1.18, cz - 0.50]}
        rotation={[0, -0.38, 0]}
        active={isWorking}
        accentColor="#1A3A6A"
        agentId="atlas"
      />

      {/* ── TECLADO MECÂNICO ── */}
      <group position={[cx - 0.08, 0.785, cz - 0.12]}>
        {/* Corpo */}
        <mesh>
          <boxGeometry args={[0.52, 0.025, 0.18]} />
          <meshStandardMaterial color="#0D0D0D" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Superfície de teclas */}
        <mesh position={[0, 0.016, 0]}>
          <boxGeometry args={[0.50, 0.010, 0.16]} />
          <meshStandardMaterial color="#161616" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Faixa RGB frontal */}
        <mesh position={[0, -0.008, 0.092]}>
          <boxGeometry args={[0.50, 0.006, 0.004]} />
          <meshStandardMaterial color="#000000" emissive={agent.accentColor} emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* ── MOUSE ERGONÔMICO ── */}
      <group position={[cx + 0.24, 0.782, cz + 0.04]}>
        <mesh rotation={[0, 0.15, 0]}>
          <boxGeometry args={[0.065, 0.032, 0.11]} />
          <meshStandardMaterial color="#0F0F0F" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* LED lateral */}
        <mesh position={[0.034, 0, 0]}>
          <boxGeometry args={[0.003, 0.024, 0.08]} />
          <meshStandardMaterial color="#000000" emissive={agent.accentColor} emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* ── SUPORTE DE HEADPHONE ── */}
      <group position={[cx - 0.62, 0.77, cz - 0.22]}>
        {/* Base */}
        <mesh>
          <cylinderGeometry args={[0.055, 0.065, 0.018, 12]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Haste */}
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.008, 0.009, 0.20, 8]} />
          <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Arco */}
        <mesh position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.055, 0.009, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#2A2A2A" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>

      {/* ── CADEIRA EXECUTIVA ── */}
      <Chair position={[cx, 0, cz + 0.6]} rotation={[0, Math.PI, 0]} />

      {/* ── CONSOLE DE CANTO COM MÁQUINA DE CAFÉ ── */}
      <group position={[-13.2, 0, -11.3]}>
        {/* Bancada */}
        <mesh position={[0, 0.76, 0]}>
          <boxGeometry args={[0.9, 0.04, 0.55]} />
          <meshStandardMaterial color="#1A1208" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Estrutura de suporte */}
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.06, 0.74, 0.5]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Corpo da máquina */}
        <mesh position={[0.1, 1.04, -0.05]}>
          <boxGeometry args={[0.28, 0.32, 0.28]} />
          <meshStandardMaterial color="#111111" metalness={0.75} roughness={0.2} />
        </mesh>
        {/* Visor LED */}
        <mesh position={[0.1, 1.12, 0.085]}>
          <boxGeometry args={[0.14, 0.06, 0.005]} />
          <meshStandardMaterial color="#001A33" emissive="#0066CC" emissiveIntensity={0.9} />
        </mesh>
        {/* Bico */}
        <mesh position={[0.1, 0.95, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.06, 8]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Xícara */}
        <mesh position={[0.1, 0.795, 0.06]}>
          <cylinderGeometry args={[0.025, 0.022, 0.04, 12]} />
          <meshStandardMaterial color="#F5F0E8" roughness={0.6} />
        </mesh>
      </group>

      {/* ── PLANTA DE CHÃO — canto SE, junto à porta ── */}
      <LargePot position={[-12.4, 0, -7.4]} />

      {/* ── PRATELEIRA COM VASOS — parede norte ── */}
      <ShelfWithPlants position={[-11, 2.2, -11.82]} count={3} />

      {/* ── CONSOLE DE TROFÉUS — junto à divisória leste ── */}
      <group position={[-8.22, 0, -9.5]}>
        {/* Tampo */}
        <mesh position={[0, 0.82, 0]}>
          <boxGeometry args={[0.40, 0.04, 3.2]} />
          <meshStandardMaterial color="#1C1208" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Borda metálica */}
        <mesh position={[0, 0.80, 0]}>
          <boxGeometry args={[0.42, 0.02, 3.22]} />
          <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* 3 pés */}
        {([-1.3, 0, 1.3] as number[]).map((oz, i) => (
          <mesh key={i} position={[0, 0.40, oz]}>
            <boxGeometry args={[0.36, 0.80, 0.05]} />
            <meshStandardMaterial color="#1A1A1A" metalness={0.4} roughness={0.5} />
          </mesh>
        ))}
        {/* LED strip sob o tampo */}
        <mesh position={[0.22, 0.79, 0]}>
          <boxGeometry args={[0.003, 0.015, 3.1]} />
          <meshStandardMaterial color="#FFF5D6" emissive="#FFF5D6" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* ── TROFÉUS NO CONSOLE ── */}
      {([[-8.22, 0.86, -10.8], [-8.22, 0.86, -9.8], [-8.22, 0.86, -8.8]] as [number, number, number][]).map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <boxGeometry args={[0.06, 0.04, 0.06]} />
            <meshStandardMaterial color="#2A2010" metalness={0.3} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.055, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.07, 6]} />
            <meshStandardMaterial color="#C9A84C" metalness={0.9} roughness={0.1} emissive="#C9A84C" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 0.11, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#C9A84C" metalness={0.95} roughness={0.05} emissive="#C9A84C" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}

      {/* ── PLAQUINHA CEO — divisória leste ── */}
      <mesh position={[-8, 0.5, -9.5]}>
        <boxGeometry args={[0.04, 0.18, 0.55]} />
        <meshStandardMaterial
          color={agent.accentColor}
          emissive={agent.accentColor}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* ── PORTA — face sul ── */}
      <group position={[cx, 0, -7]}>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.82, 1.52, 0.07]} />
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.68, 1.34, 0.05]} />
          <meshPhysicalMaterial
            color="#1a2a3a"
            transmission={0.5}
            roughness={0.1}
            thickness={0.04}
            transparent
            opacity={0.55}
          />
        </mesh>
        <mesh position={[0.30, 0.75, 0.04]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Plaquinha "Atlas" */}
        <mesh position={[0, 1.65, 0.04]}>
          <boxGeometry args={[0.5, 0.12, 0.03]} />
          <meshStandardMaterial
            color={agent.accentColor}
            emissive={agent.accentColor}
            emissiveIntensity={0.6}
            metalness={0.6}
          />
        </mesh>
      </group>

      {/* ── AGENTE ATLAS ── */}
      <Agent
        agent={agent}
        position={[cx, 0.30, cz + 0.60]}
        rotation={[0, Math.PI, 0]}
        onClick={onAgentClick}
        isSelected={isSelected}
      />

    </group>
  );
}
