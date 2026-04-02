import { create } from 'zustand';
import { agents } from '../config/agents';
import type { AgentState, AgentStatus } from '../types';

interface AgentStore {
  agents: AgentState[];
  setAgentStatus: (id: string, status: AgentStatus) => void;
  setAgentTask:   (id: string, task: string | null) => void;
  startMeeting:   (agentIds: string[]) => void;
  endMeeting:     (agentIds: string[]) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: agents.map((a) => ({
    ...a,
    status: 'idle',
    currentTask: null,
    taskStartedAt: null,
  })),

  setAgentStatus: (id, status) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? { ...a, status } : a)),
    })),

  setAgentTask: (id, task) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === id
          ? { ...a, currentTask: task, taskStartedAt: task ? Date.now() : null }
          : a
      ),
    })),

  startMeeting: (agentIds) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        agentIds.includes(a.id) ? { ...a, status: 'meeting' } : a
      ),
    })),

  endMeeting: (agentIds) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        agentIds.includes(a.id) ? { ...a, status: 'idle', currentTask: null } : a
      ),
    })),
}));
