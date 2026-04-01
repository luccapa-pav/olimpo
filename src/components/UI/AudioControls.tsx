import { useEffect, useRef } from 'react';
import { useAudio } from '../../hooks/useAudio';
import { useAgentStore } from '../../stores/agentStore';
import { useUIStore } from '../../stores/uiStore';

export function AudioControls() {
  const { isReady, lofiEnabled, masterMuted, activate, toggleLofi, toggleMute, playTyping, playNotification } =
    useAudio();

  const agents = useAgentStore((s) => s.agents);
  const chats = useUIStore((s) => s.chats);

  // Referências para lógica de efeitos sem re-render
  const anyWorkingRef = useRef(false);
  const mutedRef = useRef(masterMuted);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevChatLengths = useRef<Record<string, number>>({});

  anyWorkingRef.current = agents.some((a) => a.status === 'working');
  mutedRef.current = masterMuted;

  // Som de digitação recursivo com timing irregular
  useEffect(() => {
    function scheduleClick() {
      if (!anyWorkingRef.current || mutedRef.current) return;
      playTyping();
      typingTimerRef.current = setTimeout(scheduleClick, 55 + Math.random() * 210);
    }

    if (anyWorkingRef.current && !masterMuted && isReady) {
      scheduleClick();
    }

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agents, masterMuted, isReady]);

  // Notificação ao receber resposta do assistente
  useEffect(() => {
    if (!isReady || masterMuted) return;
    Object.entries(chats).forEach(([id, chat]) => {
      const prev = prevChatLengths.current[id] ?? 0;
      const curr = chat.messages.length;
      if (curr > prev && chat.messages[curr - 1]?.role === 'assistant') {
        playNotification();
      }
      prevChatLengths.current[id] = curr;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats]);

  const btnBase: React.CSSProperties = {
    background: 'none',
    border: '1px solid #2A2A2A',
    borderRadius: '6px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '11px',
    fontFamily: 'monospace',
    transition: 'all 0.15s',
    color: '#999',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '56px',
        right: '16px',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '6px',
      }}
    >
      {!isReady ? (
        // Botão de ativação — precisa de gesto do usuário pra AudioContext
        <button
          onClick={activate}
          style={{
            ...btnBase,
            border: '1px solid #C9A84C44',
            color: '#C9A84C',
            background: 'rgba(13,13,13,0.9)',
          }}
        >
          🔇 Ativar áudio
        </button>
      ) : (
        <div
          style={{
            background: 'rgba(13,13,13,0.92)',
            border: '1px solid #222',
            borderRadius: '8px',
            padding: '8px 10px',
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          {/* Mute geral */}
          <button
            onClick={toggleMute}
            style={{
              ...btnBase,
              color: masterMuted ? '#555' : '#E8E8E8',
              border: `1px solid ${masterMuted ? '#222' : '#444'}`,
            }}
            title={masterMuted ? 'Ativar som' : 'Mutar'}
          >
            {masterMuted ? '🔇' : '🔊'}
          </button>

          {/* Toggle lo-fi */}
          <button
            onClick={toggleLofi}
            style={{
              ...btnBase,
              color: lofiEnabled ? '#C9A84C' : '#555',
              border: `1px solid ${lofiEnabled ? '#C9A84C44' : '#222'}`,
              background: lofiEnabled ? 'rgba(201,168,76,0.06)' : 'none',
            }}
            title={lofiEnabled ? 'Parar lo-fi' : 'Lo-fi ambient'}
          >
            ♪ Lo-fi
          </button>
        </div>
      )}
    </div>
  );
}
