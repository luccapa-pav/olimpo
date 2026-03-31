import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../stores/uiStore';
import { useAgentStore } from '../../stores/agentStore';
import { sendChatMessage } from '../../api/chat';

export function ChatPanel() {
  const { selectedAgentId, chatPanelOpen, setChatPanelOpen, chats, addMessage, setChatLoading } =
    useUIStore();
  const agents = useAgentStore((s) => s.agents);
  const setAgentStatus = useAgentStore((s) => s.setAgentStatus);
  const setAgentTask = useAgentStore((s) => s.setAgentTask);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agent = agents.find((a) => a.id === selectedAgentId);
  const chat = selectedAgentId ? chats[selectedAgentId] : undefined;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  async function handleSend() {
    if (!agent || !input.trim() || chat?.isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
      timestamp: Date.now(),
    };

    addMessage(agent.id, userMessage);
    setInput('');
    setChatLoading(agent.id, true);
    setAgentStatus(agent.id, 'working');
    setAgentTask(agent.id, input.trim().slice(0, 30));

    try {
      const allMessages = [...(chat?.messages ?? []), userMessage];
      const response = await sendChatMessage(agent.id, agent.systemPrompt, allMessages);

      addMessage(agent.id, {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      });
    } catch {
      addMessage(agent.id, {
        role: 'assistant',
        content: 'Desculpe, não consegui processar a mensagem. Verifique a configuração da API.',
        timestamp: Date.now(),
      });
    } finally {
      setChatLoading(agent.id, false);
      setAgentStatus(agent.id, 'idle');
      setAgentTask(agent.id, null);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <AnimatePresence>
      {chatPanelOpen && agent && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '360px',
            background: '#111111',
            borderLeft: `1px solid ${agent.accentColor}33`,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100,
            fontFamily: 'monospace',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${agent.accentColor}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: agent.accentColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#000',
                }}
              >
                {agent.name[0]}
              </div>
              <div>
                <div style={{ color: agent.accentColor, fontWeight: 700, fontSize: '13px' }}>
                  {agent.name}
                </div>
                <div style={{ color: '#666', fontSize: '10px' }}>{agent.title}</div>
              </div>
            </div>
            <button
              onClick={() => setChatPanelOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '18px',
                lineHeight: 1,
                padding: '4px',
              }}
            >
              ×
            </button>
          </div>

          {/* Mitologia */}
          <div
            style={{
              padding: '10px 20px',
              borderBottom: `1px solid #222`,
              color: '#444',
              fontSize: '10px',
              fontStyle: 'italic',
            }}
          >
            {agent.mythology}
          </div>

          {/* Mensagens */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {(!chat?.messages || chat.messages.length === 0) && (
              <div
                style={{
                  color: '#444',
                  fontSize: '11px',
                  textAlign: 'center',
                  marginTop: '20px',
                }}
              >
                Envie uma mensagem para {agent.name}
              </div>
            )}

            {chat?.messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '90%',
                    padding: '8px 12px',
                    borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: msg.role === 'user' ? `${agent.accentColor}22` : '#1A1A1A',
                    border: `1px solid ${msg.role === 'user' ? agent.accentColor + '44' : '#2A2A2A'}`,
                    color: '#E8E8E8',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {chat?.isLoading && (
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px 12px 12px 2px',
                    background: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                    color: agent.accentColor,
                    fontSize: '12px',
                  }}
                >
                  <span style={{ animation: 'pulse 1s infinite' }}>●●●</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: `1px solid #222`,
              display: 'flex',
              gap: '8px',
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Mensagem para ${agent.name}…`}
              rows={2}
              style={{
                flex: 1,
                background: '#1A1A1A',
                border: `1px solid #2A2A2A`,
                borderRadius: '6px',
                padding: '8px 10px',
                color: '#E8E8E8',
                fontSize: '12px',
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || chat?.isLoading}
              style={{
                background: input.trim() && !chat?.isLoading ? agent.accentColor : '#2A2A2A',
                border: 'none',
                borderRadius: '6px',
                padding: '0 14px',
                color: input.trim() && !chat?.isLoading ? '#000' : '#555',
                cursor: input.trim() && !chat?.isLoading ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                transition: 'background 0.2s',
              }}
            >
              ↑
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
