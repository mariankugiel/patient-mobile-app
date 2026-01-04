import apiClient from './axios-config';
import type {
  UserLoginData,
  LoginResponse,
  AuthTokenResponse,
  UserProfile,
  UserEmergency,
  UserNotifications,
  OAuthUserProfileData,
} from './types';

/**
 * Helper function to handle API errors
 */
const handleApiError = (error: any, defaultMessage: string): Error => {
  // Handle timeout errors specifically
  if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
    return new Error('Connection failed. Please check your internet connection and try again.');
  }

  // Handle network errors
  if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return new Error('Unable to connect to server. Please check your internet connection.');
  }

  const message = error.response?.data?.detail || error.message || defaultMessage;
  return new Error(message);
};

/**
 * Auth API Service
 * Handles all authentication-related API calls
 */
export class AuthApiService {
  /**
   * Login user with email and password
   */
  static async login(credentials: UserLoginData): Promise<LoginResponse> {
    try {
      // Backend expects form data for login
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await apiClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Login failed');
    }
  }

  /**
   * Register a new user
   */
  static async register(userData: {
    email: string;
    password: string;
    full_name?: string;
    date_of_birth?: string;
    phone_number?: string;
    address?: string;
    timezone?: string;
  }): Promise<{ id: number; email: string }> {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Registration failed');
    }
  }

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

  /**
   * Create OAuth user profile (for Google, GitHub, etc.)
   */
  static async createOAuthUserProfile(
    oauthData: OAuthUserProfileData
  ): Promise<UserProfile> {
    try {
      const response = await apiClient.post('/auth/oauth-profile', oauthData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to create OAuth user profile');
    }
  }

  /**
   * Change password
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to change password');
    }
  }

  /**
   * Request password reset
   */
  static async resetPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/auth/reset-password', { email });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to send password reset email');
    }
  }
}

// Export alias for convenience
export const AuthAPI = AuthApiService;


