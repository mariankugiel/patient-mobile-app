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
      const response = await apiClient.get('/auth/shared-access');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to get shared access data');
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
}

// Export alias for convenience
export const PermissionsAPI = PermissionsApiService;


