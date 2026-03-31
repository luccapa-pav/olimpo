export type AgentStatus = 'idle' | 'working' | 'meeting';
export type AgentRoom = 'ceo' | 'workspace' | 'meeting' | 'private1' | 'private2';
export type AgentRole = 'diretoria' | 'operacional';

export interface AgentConfig {
  id: string;
  name: string;
  title: string;
  mythology: string;
  role: AgentRole;
  accentColor: string;
  defaultRoom: AgentRoom;
  deskObject: string;
  systemPrompt: string;
}

export interface AgentState extends AgentConfig {
  status: AgentStatus;
  currentTask: string | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AgentChat {
  agentId: string;
  messages: ChatMessage[];
  isLoading: boolean;
}
