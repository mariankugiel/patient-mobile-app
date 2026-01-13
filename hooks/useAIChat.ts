import { useState, useCallback } from 'react';
import { messagesApiService } from '@/lib/api/messages-api';
import type { AIChatMessage, AIChatRequest, AIChatResponse } from '@/types/messages';

interface UseAIChatReturn {
  messages: AIChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export function useAIChat(): UseAIChatReturn {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message immediately
    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      // Build conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const request: AIChatRequest = {
        message: content.trim(),
        conversation_history: conversationHistory,
      };

      const response: AIChatResponse = await messagesApiService.sendAIChatMessage(request);

      // Add bot response
      const botMessage: AIChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Failed to send AI chat message:', err);
      setError(err.message || 'Failed to send message');
      
      // Remove user message on error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}
