import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../stores/uiStore';
import { useAgentStore } from '../../stores/agentStore';
import { sendChatMessage } from '../../api/chat';

function cleanText(text: string): string {
  return text
    .replace(/<(tool_call|tool_response|tool_use|tool_result)[\s\S]*?<\/(tool_call|tool_response|tool_use|tool_result)>/gi, '')
    .replace(/\[(tool_call|tool_response|tool_use|tool_result)\][\s\S]*?\[\/(tool_call|tool_response|tool_use|tool_result)\]/gi, '')
    .replace(/\[tool_(?:call|response|use|result)[^\]]*\]/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}

// Hex accent color + alpha hex (e.g. 'FF' = 100%, '1A' ≈ 10%)
function alpha(hex: string, a: string) {
  return hex + a;
}

export function ChatPanel() {
  const { selectedAgentId, chatPanelOpen, setChatPanelOpen, chats, addMessage, setChatLoading } =
    useUIStore();
  const agents = useAgentStore((s) => s.agents);
  const setAgentStatus = useAgentStore((s) => s.setAgentStatus);
  const setAgentTask = useAgentStore((s) => s.setAgentTask);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const agent = agents.find((a) => a.id === selectedAgentId);
  const chat = selectedAgentId ? chats[selectedAgentId] : undefined;

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages, chat?.isLoading]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (chatPanelOpen) {
      setTimeout(() => textareaRef.current?.focus(), 350);
    }
  }, [chatPanelOpen]);

  async function handleSend() {
    if (!agent || !input.trim() || chat?.isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
      timestamp: Date.now(),
    };

    const currentInput = input.trim();
    addMessage(agent.id, userMessage);
    setInput('');
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setChatLoading(agent.id, true);
    setAgentStatus(agent.id, 'working');
    setAgentTask(agent.id, currentInput.slice(0, 40));

    try {
      const allMessages = [...(chat?.messages ?? []), userMessage];
      const response = await sendChatMessage(agent.id, agent.systemPrompt, allMessages);
      addMessage(agent.id, {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      addMessage(agent.id, {
        role: 'assistant',
        content: `Erro: ${msg}`,
        timestamp: Date.now(),
      });
    } finally {
      setChatLoading(agent.id, false);
      setAgentStatus(agent.id, 'idle');
      setAgentTask(agent.id, null);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextareaInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    // Auto-grow up to 6 lines
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }

  const statusColor =
    agent?.status === 'working' ? '#00CC88'
    : agent?.status === 'meeting' ? '#C9A84C'
    : '#555555';
  const statusLabel =
    agent?.status === 'working' ? 'Working'
    : agent?.status === 'meeting' ? 'Meeting'
    : 'Idle';

  const canSend = !!input.trim() && !chat?.isLoading;

  return (
    <AnimatePresence>
      {chatPanelOpen && agent && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setChatPanelOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.32)',
              zIndex: 99,
              cursor: 'default',
            }}
          />

          {/* ── Panel ── */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '400px',
              background: '#1A1A1A',
              borderLeft: '1px solid #333',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 100,
              fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              overflow: 'hidden',
            }}
          >

            {/* ──────────── HEADER ──────────── */}
            <div
              style={{
                padding: '18px 20px 16px',
                background: '#141414',
                borderBottom: '1px solid #252525',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>

                {/* Avatar */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: agent.accentColor,
                    boxShadow: `0 0 20px ${alpha(agent.accentColor, '50')}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '19px',
                    fontWeight: 700,
                    color: '#000',
                    flexShrink: 0,
                    letterSpacing: '-0.5px',
                  }}
                >
                  {agent.name[0]}
                </div>

                {/* Name / title / mythology */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span
                      style={{
                        color: '#F2F2F2',
                        fontWeight: 700,
                        fontSize: '16px',
                        letterSpacing: '-0.3px',
                      }}
                    >
                      {agent.name}
                    </span>
                    {/* Status dot */}
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: statusColor,
                        boxShadow: `0 0 6px ${statusColor}`,
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: statusColor, fontSize: '11px', fontWeight: 500 }}>
                      {statusLabel}
                    </span>
                  </div>
                  <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                    {agent.title}
                  </div>
                  <div style={{ color: '#3D3D3D', fontSize: '11px', fontStyle: 'italic' }}>
                    {agent.mythology}
                  </div>
                </div>

                {/* Close button */}
                <CloseButton onClick={() => setChatPanelOpen(false)} />
              </div>
            </div>

            {/* ──────────── MESSAGES ──────────── */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                // Custom scrollbar via inline won't work, but we keep the styles minimal
              }}
            >
              {/* Empty state */}
              {(!chat?.messages || chat.messages.length === 0) && (
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    color: '#444',
                    paddingBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: alpha(agent.accentColor, '18'),
                      border: `1px solid ${alpha(agent.accentColor, '35')}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      color: agent.accentColor,
                      fontWeight: 700,
                    }}
                  >
                    {agent.name[0]}
                  </div>
                  <div style={{ fontSize: '14px', color: '#4A4A4A', fontWeight: 500 }}>
                    Conversa com {agent.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#383838', textAlign: 'center', maxWidth: '220px' }}>
                    Envie uma mensagem para começar
                  </div>
                </div>
              )}

              {/* Message list */}
              {chat?.messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    marginTop: i > 0 && chat.messages[i - 1].role !== msg.role ? '10px' : '4px',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '86%',
                      padding: '10px 14px',
                      borderRadius:
                        msg.role === 'user'
                          ? '16px 16px 4px 16px'
                          : '16px 16px 16px 4px',
                      background:
                        msg.role === 'user'
                          ? '#2A2A2A'
                          : alpha(agent.accentColor, '18'),
                      border: `1px solid ${
                        msg.role === 'user'
                          ? '#333'
                          : alpha(agent.accentColor, '30')
                      }`,
                      color: '#E4E4E4',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.role === 'assistant' ? cleanText(msg.content) : msg.content}
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#2E2E2E',
                      marginTop: '3px',
                      paddingLeft: msg.role === 'user' ? 0 : '4px',
                      paddingRight: msg.role === 'user' ? '4px' : 0,
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {chat?.isLoading && (() => {
                const loadingVerb: Record<string, string> = {
                  hermes: 'está pesquisando',
                  atlas:  'está analisando',
                };
                const verb = loadingVerb[agent.id] ?? 'está processando';
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: alpha(agent.accentColor, '20'),
                        border: `1px solid ${alpha(agent.accentColor, '40')}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        color: agent.accentColor,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {agent.name[0]}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '10px 14px',
                        background: alpha(agent.accentColor, '18'),
                        border: `1px solid ${alpha(agent.accentColor, '30')}`,
                        borderRadius: '16px 16px 16px 4px',
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.25, 1, 0.25], y: [0, -4, 0] }}
                          transition={{
                            duration: 0.75,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: 'easeInOut',
                          }}
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: agent.accentColor,
                          }}
                        />
                      ))}
                      <span style={{ color: '#666', fontSize: '12px', marginLeft: '4px' }}>
                        {agent.name} {verb}…
                      </span>
                    </div>
                  </motion.div>
                );
              })()}

              <div ref={messagesEndRef} />
            </div>

            {/* ──────────── INPUT ──────────── */}
            <div
              style={{
                padding: '12px 16px 16px',
                background: '#141414',
                borderTop: '1px solid #252525',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-end',
                  background: '#1E1E1E',
                  border: `1px solid ${canSend ? alpha(agent.accentColor, '50') : '#2A2A2A'}`,
                  borderRadius: '12px',
                  padding: '8px 8px 8px 14px',
                  transition: 'border-color 0.2s',
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaInput}
                  onKeyDown={handleKeyDown}
                  placeholder={`Mensagem para ${agent.name}…`}
                  rows={1}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    color: '#E4E4E4',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    resize: 'none',
                    outline: 'none',
                    lineHeight: '1.55',
                    padding: '2px 0',
                    overflowY: 'auto',
                    // height is managed by JS
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '8px',
                    background: canSend ? agent.accentColor : '#252525',
                    border: 'none',
                    color: canSend ? '#000' : '#3A3A3A',
                    cursor: canSend ? 'pointer' : 'not-allowed',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background 0.2s, color 0.2s',
                    fontWeight: 700,
                  }}
                >
                  ↑
                </button>
              </div>

              <div
                style={{
                  color: '#2E2E2E',
                  fontSize: '10px',
                  marginTop: '8px',
                  textAlign: 'center',
                  letterSpacing: '0.2px',
                }}
              >
                Enter para enviar · Shift+Enter para nova linha
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Sub-components ──────────────────────────────────────────

function CloseButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 28,
        height: 28,
        borderRadius: '6px',
        background: hovered ? '#2A2A2A' : 'transparent',
        border: 'none',
        color: hovered ? '#CCCCCC' : '#555',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background 0.15s, color 0.15s',
        lineHeight: 1,
      }}
    >
      ×
    </button>
  );
}
