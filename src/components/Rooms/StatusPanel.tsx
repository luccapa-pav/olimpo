import { Html } from '@react-three/drei';
import type { AgentState } from '../../types';

interface StatusPanelProps {
  agents: AgentState[];
}

const STATUS_LABELS: Record<string, string> = {
  idle: 'Idle',
  working: 'Trabalhando',
  meeting: 'Em reunião',
};

// Painel de status na parede — visível de longe
export function StatusPanel({ agents }: StatusPanelProps) {
  return (
    <group position={[2, 2, -11.5]}>
      {/* Painel físico na parede */}
      <mesh>
        <boxGeometry args={[10, 3, 0.08]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Borda dourada */}
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[10.1, 3.1, 0.01]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.3} />
      </mesh>

      {/* Conteúdo HTML overlay */}
      <Html
        position={[0, 0, 0.1]}
        center
        transform
        occlude={false}
        style={{ width: '480px' }}
      >
        <div
          style={{
            background: 'rgba(13,13,13,0.95)',
            border: '1px solid #C9A84C44',
            borderRadius: '8px',
            padding: '12px 16px',
            width: '480px',
            fontFamily: 'monospace',
          }}
        >
          <div
            style={{
              color: '#C9A84C',
              fontSize: '11px',
              letterSpacing: '3px',
              marginBottom: '10px',
              textTransform: 'uppercase',
            }}
          >
            OLIMPO HQ — STATUS DO TIME
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {agents.map((agent) => (
              <div
                key={agent.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 8px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '4px',
                  border: `1px solid ${agent.accentColor}22`,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background:
                      agent.status === 'working'
                        ? '#00CC88'
                        : agent.status === 'meeting'
                          ? '#C9A84C'
                          : '#555555',
                    boxShadow:
                      agent.status === 'working'
                        ? '0 0 6px #00CC88'
                        : agent.status === 'meeting'
                          ? '0 0 6px #C9A84C'
                          : 'none',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ color: agent.accentColor, fontSize: '10px', fontWeight: 600 }}>
                    {agent.name}
                  </div>
                  <div style={{ color: '#666', fontSize: '9px' }}>
                    {STATUS_LABELS[agent.status]}
                    {agent.currentTask && ` — ${agent.currentTask.slice(0, 20)}…`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
}
