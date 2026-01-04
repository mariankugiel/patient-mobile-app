import apiClient from './axios-config';
import type { UserNotifications } from './types';

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

/**
 * Notifications API Service
 * Handles all notification preferences API calls
 */
export class NotificationsApiService {
  /**
   * Get user notifications preferences
   */
  static async getNotifications(): Promise<UserNotifications> {
    try {
      const response = await apiClient.get('/auth/notifications');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to get notifications');
    }
  }

  /**
   * Update user notifications preferences
   */
  static async updateNotifications(
    notificationsData: Partial<UserNotifications>
  ): Promise<UserNotifications> {
    try {
      const response = await apiClient.put('/auth/notifications', notificationsData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to update notifications');
    }
  }
}

// Export alias for convenience
export const NotificationsAPI = NotificationsApiService;


