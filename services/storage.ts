import { IdeaData, ChatSession, ChatMessage, Attorney } from '../types';

const STORAGE_KEYS = {
  IDEA: 'iply_idea_data',
  CHATS: 'iply_chat_sessions',
  ATTORNEYS: 'iply_attorneys_data', // Added for Admin
};

// Safe wrapper for localStorage
const getStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
};

export const saveIdea = (data: IdeaData): void => {
  try {
    const storage = getStorage();
    if (storage) {
      storage.setItem(STORAGE_KEYS.IDEA, JSON.stringify(data));
    }
  } catch (e) {
    console.error('Failed to save idea', e);
  }
};

export const getIdea = (): IdeaData | null => {
  try {
    const storage = getStorage();
    if (storage) {
      const data = storage.getItem(STORAGE_KEYS.IDEA);
      return data ? JSON.parse(data) : null;
    }
  } catch (e) {
    console.error('Failed to get idea', e);
  }
  return null;
};

export const saveChatSession = (sessionId: string, messages: ChatMessage[]): void => {
  try {
    const storage = getStorage();
    if (storage) {
      const allChatsStr = storage.getItem(STORAGE_KEYS.CHATS);
      const allChats: Record<string, ChatMessage[]> = allChatsStr ? JSON.parse(allChatsStr) : {};
      allChats[sessionId] = messages;
      storage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(allChats));
    }
  } catch (e) {
    console.error('Failed to save chat', e);
  }
};

export const getChatSession = (sessionId: string): ChatMessage[] => {
  try {
    const storage = getStorage();
    if (storage) {
      const allChatsStr = storage.getItem(STORAGE_KEYS.CHATS);
      const allChats: Record<string, ChatMessage[]> = allChatsStr ? JSON.parse(allChatsStr) : {};
      return allChats[sessionId] || [];
    }
  } catch (e) {
    console.error('Failed to get chat', e);
  }
  return [];
};

// Admin: Save Attorneys
export const saveAttorneys = (attorneys: Attorney[]): void => {
  try {
    const storage = getStorage();
    if (storage) {
      storage.setItem(STORAGE_KEYS.ATTORNEYS, JSON.stringify(attorneys));
    }
  } catch (e) {
    console.error('Failed to save attorneys', e);
  }
};

// Admin: Get Attorneys
export const getAttorneysFromStorage = (): Attorney[] | null => {
  try {
    const storage = getStorage();
    if (storage) {
      const data = storage.getItem(STORAGE_KEYS.ATTORNEYS);
      return data ? JSON.parse(data) : null;
    }
  } catch (e) {
    console.error('Failed to get attorneys', e);
  }
  return null;
};