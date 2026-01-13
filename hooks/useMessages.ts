import { useState, useEffect, useCallback, useRef } from 'react';
import { messagesApiService } from '@/lib/api/messages-api';
import type { 
  Conversation, 
  Message, 
  MessageType, 
  MessageFilters,
  MessageAttachment,
  BotConversation,
  SALUSO_SUPPORT_CONVERSATION_ID
} from '@/types/messages';

interface UseMessagesReturn {
  // Data
  conversations: Conversation[];
  botConversation: BotConversation | null;
  selectedConversation: Conversation | BotConversation | null;
  messages: Message[];
  unreadCount: number;
  loading: boolean;
  loadingConversations: boolean;
  loadingMessages: boolean;
  sendingMessage: boolean;
  error: string | null;

  // Actions
  selectConversation: (conversationId: string) => void;
  sendMessage: (content: string, type?: MessageType, attachments?: MessageAttachment[]) => Promise<void>;
  uploadFile: (file: { uri: string; name: string; type: string; size?: number }) => Promise<MessageAttachment>;
  markAsRead: (messageId?: string) => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
  loadMoreMessages: () => Promise<void>;

  // Message type specific actions
  handleMedicationAction: (messageId: string, action: 'taken' | 'snooze') => Promise<void>;
  handleAppointmentAction: (messageId: string, action: 'confirm' | 'reschedule' | 'cancel') => Promise<void>;
}

// Create bot conversation object
const createBotConversation = (): BotConversation => ({
  id: SALUSO_SUPPORT_CONVERSATION_ID,
  user_id: 0,
  contact_id: 0,
  contact_name: 'Saluso Support',
  contact_role: 'AI Assistant',
  contact_initials: 'SS',
  messages: [],
  unreadCount: 0,
  lastMessageTime: new Date().toISOString(),
  lastMessage: undefined,
  isArchived: false,
  isPinned: false,
  tags: [],
  isBot: true,
});

export function useMessages(patientId?: number | null): UseMessagesReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [botConversation] = useState<BotConversation>(createBotConversation());
  const [selectedConversation, setSelectedConversation] = useState<Conversation | BotConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const loadingMoreRef = useRef(false);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      setError(null);
      const response = await messagesApiService.getConversations(undefined, patientId || undefined);
      setConversations(response.conversations || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (err: any) {
      console.error('Failed to load conversations:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoadingConversations(false);
    }
  }, [patientId]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string, page = 1, reset = false) => {
    // Don't load messages for bot conversation here - handled by useAIChat
    if (conversationId === SALUSO_SUPPORT_CONVERSATION_ID) {
      return;
    }

    try {
      if (reset) {
        setLoadingMessages(true);
        setMessages([]);
        setCurrentPage(1);
      }
      setError(null);
      const response = await messagesApiService.getConversationMessages(
        conversationId,
        page,
        50,
        patientId || undefined
      );
      
      if (reset) {
        setMessages(response.messages || []);
      } else {
        setMessages(prev => [...(response.messages || []), ...prev]);
      }
      setHasMoreMessages(response.hasMore || false);
      setCurrentPage(page);
    } catch (err: any) {
      console.error('Failed to load messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoadingMessages(false);
      loadingMoreRef.current = false;
    }
  }, [patientId]);

  // Select conversation
  const selectConversation = useCallback((conversationId: string) => {
    if (conversationId === '__clear__' || conversationId === '') {
      setSelectedConversation(null);
      setMessages([]);
      return;
    }

    if (conversationId === SALUSO_SUPPORT_CONVERSATION_ID) {
      setSelectedConversation(botConversation);
      setMessages([]);
      return;
    }

    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setSelectedConversation(conversation);
      loadMessages(conversationId, 1, true);
      
      // Mark as read
      if (conversation.unreadCount > 0) {
        markConversationAsRead(conversationId);
      }
    }
  }, [conversations, botConversation, loadMessages, markConversationAsRead]);

  // Send message
  const sendMessage = useCallback(async (
    content: string,
    type: MessageType = 'general',
    attachments?: MessageAttachment[]
  ) => {
    if (!selectedConversation) return;

    // Bot conversation is handled by useAIChat hook
    if (selectedConversation.id === SALUSO_SUPPORT_CONVERSATION_ID) {
      throw new Error('Use useAIChat hook to send messages to bot');
    }

    try {
      setSendingMessage(true);
      setError(null);
      
      const request = {
        conversation_id: selectedConversation.id,
        content,
        message_type: type,
        priority: 'normal' as const,
        attachments,
      };

      const response = await messagesApiService.sendMessage(request);
      
      // Add message to local state
      setMessages(prev => [...prev, response.message]);
      
      // Update conversation
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: response.message,
                lastMessageTime: response.message.created_at,
              }
            : conv
        )
      );

      // Update selected conversation
      if (selectedConversation.id === response.conversation.id) {
        setSelectedConversation(response.conversation);
      }
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setSendingMessage(false);
    }
  }, [selectedConversation]);

  // Upload file
  const uploadFile = useCallback(async (file: { uri: string; name: string; type: string; size?: number }) => {
    try {
      return await messagesApiService.uploadFile(file);
    } catch (err: any) {
      console.error('Failed to upload file:', err);
      throw err;
    }
  }, []);

  // Mark messages as read
  const markAsRead = useCallback(async (messageId?: string) => {
    if (!selectedConversation || selectedConversation.id === SALUSO_SUPPORT_CONVERSATION_ID) return;

    try {
      if (messageId) {
        await messagesApiService.markMessageAsRead(messageId);
      } else {
        await messagesApiService.markMessagesAsRead(selectedConversation.id);
      }
      
      // Update local state
      setMessages(prev =>
        prev.map(msg =>
          !msg.read_at ? { ...msg, read_at: new Date().toISOString(), status: 'read' as const } : msg
        )
      );
    } catch (err: any) {
      console.error('Failed to mark as read:', err);
    }
  }, [selectedConversation]);

  // Mark conversation as read
  const markConversationAsRead = useCallback(async (conversationId: string) => {
    try {
      await messagesApiService.markMessagesAsRead(conversationId);
      
      // Update local state
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Failed to mark conversation as read:', err);
    }
  }, []);

  // Delete message
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await messagesApiService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (err: any) {
      console.error('Failed to delete message:', err);
      throw err;
    }
  }, []);

  // Delete conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      await messagesApiService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (err: any) {
      console.error('Failed to delete conversation:', err);
      throw err;
    }
  }, [selectedConversation]);

  // Load more messages
  const loadMoreMessages = useCallback(async () => {
    if (!selectedConversation || loadingMoreRef.current || !hasMoreMessages) return;
    if (selectedConversation.id === SALUSO_SUPPORT_CONVERSATION_ID) return;

    loadingMoreRef.current = true;
    await loadMessages(selectedConversation.id, currentPage + 1, false);
  }, [selectedConversation, hasMoreMessages, currentPage, loadMessages]);

  // Handle medication action
  const handleMedicationAction = useCallback(async (messageId: string, action: 'taken' | 'snooze') => {
    try {
      await messagesApiService.handleMedicationReminderAction(messageId, action);
      // Refresh messages
      if (selectedConversation && selectedConversation.id !== SALUSO_SUPPORT_CONVERSATION_ID) {
        await loadMessages(selectedConversation.id, 1, true);
      }
    } catch (err: any) {
      console.error('Failed to handle medication action:', err);
      throw err;
    }
  }, [selectedConversation, loadMessages]);

  // Handle appointment action
  const handleAppointmentAction = useCallback(async (messageId: string, action: 'confirm' | 'reschedule' | 'cancel') => {
    try {
      await messagesApiService.handleAppointmentReminderAction(messageId, action);
      // Refresh messages
      if (selectedConversation && selectedConversation.id !== SALUSO_SUPPORT_CONVERSATION_ID) {
        await loadMessages(selectedConversation.id, 1, true);
      }
    } catch (err: any) {
      console.error('Failed to handle appointment action:', err);
      throw err;
    }
  }, [selectedConversation, loadMessages]);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    botConversation,
    selectedConversation,
    messages,
    unreadCount,
    loading: loadingConversations || loadingMessages,
    loadingConversations,
    loadingMessages,
    sendingMessage,
    error,
    selectConversation,
    sendMessage,
    uploadFile,
    markAsRead,
    markConversationAsRead,
    deleteMessage,
    deleteConversation,
    refreshConversations: loadConversations,
    loadMoreMessages,
    handleMedicationAction,
    handleAppointmentAction,
  };
}
