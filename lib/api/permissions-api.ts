import apiClient from './axios-config';
import type { UserSharedAccess, AccessLogEntry } from './types';

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
 * Permissions API Service
 * Handles all data access permissions API calls
 */
export class PermissionsApiService {
  /**
   * Get user shared access (permissions)
   */
  static async getSharedAccess(): Promise<UserSharedAccess> {
    try {
      console.log('[permissions] getSharedAccess →');
      const response = await apiClient.get('/auth/shared-access');
      const hp = response.data?.health_professionals?.length ?? 0;
      const ff = response.data?.family_friends?.length ?? 0;
      console.log('[permissions] getSharedAccess ← status', response.status, 'hp', hp, 'ff', ff);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to get shared access data');
    }
  }

  /**
   * Update user shared access (permissions)
   */
  static async updateSharedAccess(sharedAccessData: Partial<UserSharedAccess>): Promise<UserSharedAccess> {
    try {
      console.log('[permissions] updateSharedAccess → payload', sharedAccessData);
      const response = await apiClient.put('/auth/shared-access', sharedAccessData);
      console.log('[permissions] updateSharedAccess ← status', response.status, 'data', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[permissions] updateSharedAccess error', error);
      throw handleApiError(error, 'Failed to update shared access data');
    }
  }

  /**
   * Get user access logs
   */
  static async getAccessLogs(): Promise<{ logs?: AccessLogEntry[] }> {
    try {
      const response = await apiClient.get('/auth/access-logs');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to get access logs');
    }
  }

  /**
   * Send an invitation email to an allowed user (if not registered)
   */
  static async inviteSharedAccess(invitation: {
    email: string;
    name?: string;
    type?: string;
    relationship?: string;
    expires?: string;
    permissions?: any;
  }): Promise<any> {
    try {
      console.log('[permissions] inviteSharedAccess →', invitation.email);
      const response = await apiClient.post('/auth/shared-access/invite', invitation);
      console.log('[permissions] inviteSharedAccess ← status', response.status);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to send invitation');
    }
  }
}

// Export alias for convenience
export const PermissionsAPI = PermissionsApiService;


