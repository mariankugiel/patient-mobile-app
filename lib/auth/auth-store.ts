import { create } from 'zustand';
import { SecureTokenStorage } from '../storage/secure-storage';
import { AuthApiService } from '../api/auth-api';
import { signInWithGoogle } from './google-auth';
import type { UserProfile } from '../api/types';

interface User {
  id: string;
  email: string;
  user_metadata?: Partial<UserProfile>;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  is_active?: boolean;
  created_at?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRestoringSession: boolean;
  isLoadingProfile: boolean;
  error: string | null;
}

interface AuthActions {
  // Login actions
  login: (username: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  
  // Session management
  restoreSession: () => Promise<void>;
  refreshToken: () => Promise<void>;
  
  // Profile management
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  
  // Error handling
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  isRestoringSession: true,
  isLoadingProfile: false,
  error: null,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  /**
   * Login with email and password
   */
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await AuthApiService.login({ username, password });

      if (!response.access_token || !response.refresh_token) {
        throw new Error('Missing token information from login response');
      }

      // Store tokens securely
      await SecureTokenStorage.setToken(
        response.access_token,
        response.refresh_token,
        response.expires_in
      );

      // Set Supabase session with the tokens (backend returns Supabase tokens)
      const { createClient } = await import('../supabase/client');
      const supabase = createClient();
      
      // Store minimal session data (without full user object to avoid SecureStore size limit)
      await SecureTokenStorage.setSupabaseSession({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_in: response.expires_in,
        token_type: 'bearer',
      });
      
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      if (sessionError) {
        console.warn('⚠️ Failed to set Supabase session:', sessionError.message);
        // Don't throw - we can still proceed with backend authentication
      } else if (sessionData?.session) {
        console.log('✅ Supabase session set successfully');
        // Update stored session with minimal data (without full user object)
        await SecureTokenStorage.setSupabaseSession({
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
          expires_in: sessionData.session.expires_in,
          expires_at: sessionData.session.expires_at,
          token_type: sessionData.session.token_type || 'bearer',
          // Don't store user object - it's too large for SecureStore
        });
      }

      // Create user object
      const user: User = {
        id: response.user_id || '',
        email: username,
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_in: response.expires_in,
        is_active: true,
      };

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Fetch user profile
      await get().fetchProfile();
    } catch (error: any) {
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: error.message || 'Login failed',
      });
      throw error;
    }
  },

  /**
   * Login with Google OAuth
   */
  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await signInWithGoogle();

      if (!result.success || !result.user) {
        throw new Error(result.error || 'Google sign-in failed');
      }

      set({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Fetch user profile
      await get().fetchProfile();
    } catch (error: any) {
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: error.message || 'Google sign-in failed',
      });
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      // Clear tokens
      await SecureTokenStorage.clearTokens();

      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      // Clear state even if token clearing fails
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Restore session from stored tokens
   */
  restoreSession: async () => {
    set({ isRestoringSession: true });

    try {
      const hasTokens = await SecureTokenStorage.hasTokens();

      if (!hasTokens) {
        set({ isRestoringSession: false });
        return;
      }

      // Check if token is expired
      const isExpired = await SecureTokenStorage.isTokenExpired();

      if (isExpired) {
        // Try to refresh token
        try {
          await get().refreshToken();
        } catch (refreshError: any) {
          // If refresh fails, clear tokens and exit
          console.log('Token refresh failed during session restoration:', refreshError.message);
          await SecureTokenStorage.clearTokens();
          set({ isRestoringSession: false });
          return;
        }
      }

      // Fetch profile to verify session is valid
      await get().fetchProfile();

      // If profile fetch succeeds, we have a valid session
      const token = await SecureTokenStorage.getToken();
      const refreshToken = await SecureTokenStorage.getRefreshToken();

      if (token && refreshToken) {
        set({
          isAuthenticated: true,
          user: {
            id: '', // Will be set from profile
            email: '',
            access_token: token,
            refresh_token: refreshToken,
          },
        });
        
        // Fetch profile after restoring session
        try {
          await get().fetchProfile();
        } catch (profileError) {
          console.error('Failed to fetch profile during session restoration:', profileError);
          // Continue even if profile fetch fails
        }
      }
    } catch (error: any) {
      console.error('Session restoration error:', error);
      // Clear invalid tokens
      await SecureTokenStorage.clearTokens();
      set({
        isAuthenticated: false,
        user: null,
        profile: null,
      });
    } finally {
      set({ isRestoringSession: false });
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async () => {
    try {
      const refreshToken = await SecureTokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { createClient } = await import('../supabase/client');
      const supabase = createClient();

      // Check if we have a valid session first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No active session, try to set session from stored tokens
        const accessToken = await SecureTokenStorage.getToken();
        if (accessToken && refreshToken) {
          // Set the session manually
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (sessionError || !sessionData.session) {
            throw new Error('Invalid stored session');
          }
        } else {
          throw new Error('No stored session available');
        }
      }

      const { data, error } = await supabase.auth.refreshSession();

      if (error || !data?.session) {
        throw new Error(error?.message || 'Failed to refresh token');
      }

      // Store new tokens
      await SecureTokenStorage.setToken(
        data.session.access_token,
        data.session.refresh_token,
        data.session.expires_in
      );

      // Update user in store
      const currentUser = get().user;
      if (currentUser) {
        set({
          user: {
            ...currentUser,
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in,
          },
        });
      }
    } catch (error: any) {
      console.error('Token refresh error:', error);
      // If refresh fails, clear tokens but don't throw - let restoreSession handle it
      if (error.message?.includes('Auth session missing') || error.message?.includes('Invalid stored session')) {
        // Silently fail - this is expected when there's no valid session
        await SecureTokenStorage.clearTokens();
        return;
      }
      // For other errors, logout user
      await get().logout();
      throw error;
    }
  },

  /**
   * Fetch user profile
   */
  fetchProfile: async () => {
    set({ isLoadingProfile: true, error: null });

    try {
      const profile = await AuthApiService.getProfile();
      console.log('✅ Auth store: Profile fetched:', profile);

      // Update user with profile data
      const currentUser = get().user;
      if (currentUser) {
        set({
          user: {
            ...currentUser,
            id: profile.supabase_user_id || currentUser.id,
            email: profile.email || currentUser.email,
            user_metadata: profile,
          },
        });
      }

      set({
        profile,
        isLoadingProfile: false,
      });
      console.log('✅ Auth store: Profile set in store');
    } catch (error: any) {
      console.error('❌ Auth store: Fetch profile error:', error);
      set({
        isLoadingProfile: false,
        error: error.message || 'Failed to fetch profile',
      });
      // Don't throw - allow app to continue with limited functionality
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: Partial<UserProfile>) => {
    try {
      const updatedProfile = await AuthApiService.updateProfile(profileData);

      set({
        profile: updatedProfile,
      });

      // Update user metadata
      const currentUser = get().user;
      if (currentUser) {
        set({
          user: {
            ...currentUser,
            user_metadata: updatedProfile,
          },
        });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to update profile' });
      throw error;
    }
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  },
}));

// Set logout callback for axios interceptor
useAuthStore.subscribe(
  (state) => {
    if (!state.isAuthenticated && state.user === null) {
      // User logged out, axios interceptor can use this
    }
  }
);


