import { useAgentStore } from '../../stores/agentStore';
import { useUIStore } from '../../stores/uiStore';

export function StatusBar() {
  const agents = useAgentStore((s) => s.agents);
  const { selectAgent, selectedAgentId } = useUIStore();

  const working = agents.filter((a) => a.status === 'working').length;
  const idle = agents.filter((a) => a.status === 'idle').length;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '48px',
        background: 'rgba(13,13,13,0.95)',
        borderTop: '1px solid #222',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '20px',
        zIndex: 50,
        fontFamily: 'monospace',
        fontSize: '11px',
      }}
    >
      {/* Logo */}
      <div style={{ color: '#C9A84C', fontWeight: 700, letterSpacing: '2px' }}>OLIMPO HQ</div>

      <div style={{ width: '1px', height: '20px', background: '#222' }} />

      {/* Status geral */}
      <div style={{ color: '#666' }}>
        <span style={{ color: '#00CC88' }}>{working}</span> trabalhando ·{' '}
        <span style={{ color: '#555' }}>{idle}</span> idle
      </div>

      <div style={{ width: '1px', height: '20px', background: '#222' }} />

      {/* Agentes clicáveis */}
      <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => selectAgent(selectedAgentId === agent.id ? null : agent.id)}
            style={{
              background: selectedAgentId === agent.id ? `${agent.accentColor}22` : 'transparent',
              border: `1px solid ${selectedAgentId === agent.id ? agent.accentColor : '#2A2A2A'}`,
              borderRadius: '4px',
              padding: '3px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: selectedAgentId === agent.id ? agent.accentColor : '#666',
              fontSize: '10px',
              transition: 'all 0.15s',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background:
                  agent.status === 'working'
                    ? '#00CC88'
                    : agent.status === 'meeting'
                      ? '#C9A84C'
                      : '#555',
              }}
            />
            {agent.name}
          </button>
        ))}
      </div>

      {/* Hint */}
      <div style={{ color: '#333', fontSize: '10px' }}>
        Clique num agente para abrir o chat
      </div>
    </div>
  );
}
