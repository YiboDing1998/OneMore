import { apiClient } from '@/src/data/api/client';
import { ApiResponse } from '@/src/core/types';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  title: string;
  updatedAt: string;
  preview: string;
}

export interface AISearchResult {
  conversationId: string;
  conversationTitle: string;
  messageId: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
}

export async function getConversations() {
  const response = await apiClient.get<ApiResponse<{ conversations: AIConversation[] }>>(
    '/ai/conversations'
  );

  if (!response.success || !response.data) {
    throw new Error('Failed to load AI conversations');
  }

  return response.data.conversations;
}

export async function createConversation(title?: string) {
  const response = await apiClient.post<
    ApiResponse<{ conversation: { id: string; title: string } }>
  >('/ai/conversations', { title });

  if (!response.success || !response.data) {
    throw new Error('Failed to create conversation');
  }

  return response.data.conversation;
}

export async function renameConversation(conversationId: string, title: string) {
  const response = await apiClient.put<
    ApiResponse<{ conversation: { id: string; title: string } }>
  >(`/ai/conversations/${conversationId}`, { title });

  if (!response.success || !response.data) {
    throw new Error('Failed to rename conversation');
  }

  return response.data.conversation;
}

export async function deleteConversation(conversationId: string) {
  const response = await apiClient.delete<
    ApiResponse<{ deleted: boolean; nextConversationId: string }>
  >(`/ai/conversations/${conversationId}`);

  if (!response.success || !response.data) {
    throw new Error('Failed to delete conversation');
  }

  return response.data;
}

export async function searchHistory(query: string) {
  const response = await apiClient.get<ApiResponse<{ results: AISearchResult[] }>>(
    '/ai/search',
    { q: query }
  );

  if (!response.success || !response.data) {
    throw new Error('Failed to search history');
  }

  return response.data.results;
}

export async function getMessages(conversationId?: string) {
  const response = await apiClient.get<
    ApiResponse<{ conversationId: string; messages: AIMessage[] }>
  >('/ai/messages', conversationId ? { conversationId } : undefined);

  if (!response.success || !response.data) {
    throw new Error('Failed to load AI messages');
  }

  return response.data;
}

export async function sendMessage(message: string, conversationId: string) {
  const response = await apiClient.post<
    ApiResponse<{ conversationId: string; message: AIMessage; messages: AIMessage[] }>
  >('/ai/chat', { message, conversationId });

  if (!response.success || !response.data) {
    throw new Error('Failed to send AI message');
  }

  return response.data;
}
