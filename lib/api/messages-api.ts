import apiClient from './axios-config';
import type { 
  Conversation, 
  Message, 
  MessagesResponse, 
  SendMessageRequest, 
  SendMessageResponse,
  MessageFilters,
  MessageSearchParams,
  MessageAttachment,
  AIChatRequest,
  AIChatResponse
} from '@/types/messages';

/**
 * Helper function to handle API errors
 */
const handleApiError = (error: any, defaultMessage: string): Error => {
  if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
    return new Error('Connection failed. Please check your internet connection and try again.');
  }

  if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return new Error('Unable to connect to server. Please check your internet connection.');
  }

  const message = error.response?.data?.detail || error.message || defaultMessage;
  return new Error(message);
};

export class MessagesApiService {
  // Get all conversations with optional filtering
  async getConversations(filters?: MessageFilters, patientId?: number): Promise<MessagesResponse> {
    try {
      console.log('📋 API: Getting conversations with filters:', filters, 'patientId:', patientId);
      const params = new URLSearchParams();
      
      if (filters?.type?.length) {
        params.append('types', filters.type.join(','));
      }
      if (filters?.priority?.length) {
        params.append('priorities', filters.priority.join(','));
      }
      if (filters?.hasUnread) {
        params.append('hasUnread', 'true');
      }
      if (filters?.hasActionRequired) {
        params.append('hasActionRequired', 'true');
      }
      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }
      if (patientId) {
        params.append('patient_id', patientId.toString());
      }

      const url = `/messages/conversations?${params.toString()}`;
      console.log('📋 API: Request URL:', url);
      
      const response = await apiClient.get(url, {
        timeout: 60000
      });
      
      console.log('📋 API: Response status:', response.status);
      console.log('📋 API: Conversations in response:', response.data?.conversations?.length || 0);
      
      return response.data;
    } catch (error: any) {
      console.error('📋 API: Failed to fetch conversations:', error);
      throw handleApiError(error, 'Failed to fetch conversations');
    }
  }

  // Get messages for a specific conversation
  async getConversationMessages(conversationId: string, page = 1, limit = 50, patientId?: number): Promise<{ messages: Message[], hasMore: boolean }> {
    try {
      console.log('📥 API: Getting messages for conversation:', conversationId, 'patientId:', patientId);
      const params: any = { page, limit };
      if (patientId) {
        params.patient_id = patientId;
      }
      const response = await apiClient.get(`/messages/conversations/${conversationId}/messages`, {
        params
      });
      console.log('📥 API: Messages response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('📥 API: Failed to fetch conversation messages:', error);
      throw handleApiError(error, 'Failed to fetch conversation messages');
    }
  }

  // Send a new message
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      console.log('📤 API: Sending message request:', request);
      const response = await apiClient.post('/messages/send', request);
      console.log('📤 API: Message sent successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('📤 API: Failed to send message:', error);
      throw handleApiError(error, 'Failed to send message');
    }
  }

  // Upload file to S3 and return attachment data
  async uploadFile(file: { uri: string; name: string; type: string; size?: number }): Promise<MessageAttachment> {
    try {
      console.log('📎 API: Uploading file:', file.name);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
      
      // Upload to S3
      const response = await apiClient.post('/messages/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('📎 API: File uploaded successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('📎 API: Failed to upload file:', error);
      throw handleApiError(error, 'Failed to upload file');
    }
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId: string, messageIds?: string[]): Promise<void> {
    try {
      await apiClient.post(`/messages/conversations/${conversationId}/mark-read`, {
        messageIds
      });
    } catch (error: any) {
      console.error('Failed to mark messages as read:', error);
      throw handleApiError(error, 'Failed to mark messages as read');
    }
  }

  // Mark a specific message as read
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await apiClient.post(`/messages/${messageId}/mark-read`);
    } catch (error: any) {
      console.error('Failed to mark message as read:', error);
      throw handleApiError(error, 'Failed to mark message as read');
    }
  }

  // Archive a conversation
  async archiveConversation(conversationId: string): Promise<void> {
    try {
      await apiClient.post(`/messages/conversations/${conversationId}/archive`);
    } catch (error: any) {
      console.error('Failed to archive conversation:', error);
      throw handleApiError(error, 'Failed to archive conversation');
    }
  }

  // Pin/unpin a conversation
  async toggleConversationPin(conversationId: string, pinned: boolean): Promise<void> {
    try {
      await apiClient.post(`/messages/conversations/${conversationId}/pin`, { pinned });
    } catch (error: any) {
      console.error('Failed to toggle conversation pin:', error);
      throw handleApiError(error, 'Failed to toggle conversation pin');
    }
  }

  // Search messages
  async searchMessages(params: MessageSearchParams): Promise<{ messages: Message[], totalCount: number }> {
    try {
      const response = await apiClient.post('/messages/search', params);
      return response.data;
    } catch (error: any) {
      console.error('Failed to search messages:', error);
      throw handleApiError(error, 'Failed to search messages');
    }
  }

  // Get unread count
  async getUnreadCount(patientId?: number): Promise<{ count: number, byType: Record<string, number> }> {
    try {
      const params: any = {};
      if (patientId) {
        params.patient_id = patientId;
      }
      const response = await apiClient.get('/messages/unread-count', { params });
      return response.data;
    } catch (error: any) {
      console.error('Failed to get unread count:', error);
      throw handleApiError(error, 'Failed to get unread count');
    }
  }

  // Handle medication reminder actions
  async handleMedicationReminderAction(messageId: string, action: 'taken' | 'snooze'): Promise<void> {
    try {
      await apiClient.post(`/messages/${messageId}/medication-action`, { action });
    } catch (error: any) {
      console.error('Failed to handle medication reminder action:', error);
      throw handleApiError(error, 'Failed to handle medication reminder action');
    }
  }

  // Handle appointment reminder actions
  async handleAppointmentReminderAction(messageId: string, action: 'confirm' | 'reschedule' | 'cancel'): Promise<void> {
    try {
      await apiClient.post(`/messages/${messageId}/appointment-action`, { action });
    } catch (error: any) {
      console.error('Failed to handle appointment reminder action:', error);
      throw handleApiError(error, 'Failed to handle appointment reminder action');
    }
  }

  // Delete a message
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await apiClient.delete(`/messages/${messageId}`);
    } catch (error: any) {
      console.error('Failed to delete message:', error);
      throw handleApiError(error, 'Failed to delete message');
    }
  }

  // Delete conversation
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      console.log('🗑️ API: Deleting conversation:', conversationId);
      await apiClient.delete(`/messages/conversations/${conversationId}`);
      console.log('🗑️ API: Conversation deleted successfully');
    } catch (error: any) {
      console.error('🗑️ API: Failed to delete conversation:', error);
      throw handleApiError(error, 'Failed to delete conversation');
    }
  }

  // Send message to AI chat (Saluso Support)
  async sendAIChatMessage(request: AIChatRequest): Promise<AIChatResponse> {
    try {
      console.log('🤖 API: Sending AI chat message');
      const response = await apiClient.post<AIChatResponse>('/messages/chat/ai', request);
      console.log('🤖 API: AI chat response received');
      return response.data;
    } catch (error: any) {
      console.error('🤖 API: Failed to send AI chat message:', error);
      throw handleApiError(error, 'Failed to send AI chat message');
    }
  }
}

export const messagesApiService = new MessagesApiService();
