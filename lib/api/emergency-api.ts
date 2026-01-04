import apiClient from './axios-config';
import type { UserEmergency } from './types';

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
 * Emergency API Service
 * Handles all emergency-related API calls
 */
export class EmergencyApiService {
  /**
   * Get user emergency data
   */
  static async getEmergency(): Promise<UserEmergency> {
    try {
      const response = await apiClient.get('/auth/emergency');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to get emergency data');
    }
  }

  /**
   * Update user emergency data
   */
  static async updateEmergency(emergencyData: Partial<UserEmergency>): Promise<UserEmergency> {
    try {
      const response = await apiClient.put('/auth/emergency', emergencyData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to update emergency data');
    }
  }
}

// Export alias for convenience
export const EmergencyAPI = EmergencyApiService;


