import { create } from 'zustand';
import type { ChatMessage } from '../types';

interface ChatState {
  [agentId: string]: {
    messages: ChatMessage[];
    isLoading: boolean;
  };
}

interface UIStore {
  selectedAgentId: string | null;
  chatPanelOpen: boolean;
  chats: ChatState;
  selectAgent: (id: string | null) => void;
  setChatPanelOpen: (open: boolean) => void;
  addMessage: (agentId: string, message: ChatMessage) => void;
  setChatLoading: (agentId: string, loading: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedAgentId: null,
  chatPanelOpen: false,
  chats: {},

  selectAgent: (id) =>
    set({ selectedAgentId: id, chatPanelOpen: id !== null }),

  setChatPanelOpen: (open) =>
    set({ chatPanelOpen: open }),

  addMessage: (agentId, message) =>
    set((state) => ({
      chats: {
        ...state.chats,
        [agentId]: {
          messages: [...(state.chats[agentId]?.messages ?? []), message],
          isLoading: state.chats[agentId]?.isLoading ?? false,
        },
      },
    })),

  setChatLoading: (agentId, loading) =>
    set((state) => ({
      chats: {
        ...state.chats,
        [agentId]: {
          messages: state.chats[agentId]?.messages ?? [],
          isLoading: loading,
        },
      },
    })),
}));
