import { create } from 'zustand';
import { agents } from '../config/agents';
import type { AgentState, AgentStatus } from '../types';

interface AgentStore {
  agents: AgentState[];
  setAgentStatus: (id: string, status: AgentStatus) => void;
  setAgentTask: (id: string, task: string | null) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: agents.map((a) => ({
    ...a,
    status: 'idle',
    currentTask: null,
  })),

  setAgentStatus: (id, status) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? { ...a, status } : a)),
    })),

  setAgentTask: (id, task) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? { ...a, currentTask: task } : a)),
    })),
}));
