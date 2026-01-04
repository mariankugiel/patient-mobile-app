import apiClient from './axios-config';
import type { UserProfile } from './types';

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
 * Profile API Service
 * Handles all profile-related API calls
 */
export class ProfileApiService {
  /**
   * Get user profile
   */
  static async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to get profile');
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to update profile');
    }
  }
}

// Export alias for convenience
export const ProfileAPI = ProfileApiService;


