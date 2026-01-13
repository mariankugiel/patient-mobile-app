import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import { SecureTokenStorage } from '../storage/secure-storage';
import { createClient } from '../supabase/client';

// Get API base URL from environment
// In Expo, environment variables prefixed with EXPO_PUBLIC_ are available at runtime
const getBaseUrl = () => {
  const extraUrl =
    Constants.expoConfig?.extra?.apiUrl ||
    // fallback for older manifests
    (Constants as any).manifest?.extra?.apiUrl;
  return (
    process.env.EXPO_PUBLIC_API_URL ||
    // fallback to web env name if provided
    (process.env as any).NEXT_PUBLIC_API_URL ||
    extraUrl ||
    'http://localhost:8000'
  );
};

// Create axios instance
const baseURL = `${getBaseUrl()}/api/v1`;
console.log('[api] baseURL', baseURL);

const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 120000, // 2 minutes default timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple session expired notifications
let sessionExpiredNotificationShown = false;

// Logout callback to clear auth state
let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

export const resetSessionExpiredFlag = () => {
  sessionExpiredNotificationShown = false;
};

// Request interceptor to add auth token and refresh if needed
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      let token = await SecureTokenStorage.getToken();
      const refreshToken = await SecureTokenStorage.getRefreshToken();

      // Fallback: if no token is stored, try Supabase session (helps on cold start)
      if (!token) {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            token = session.access_token;
            await SecureTokenStorage.setToken(
              session.access_token,
              session.refresh_token,
              session.expires_in
            );
            console.log('✅ Restored token from Supabase session');
          }
        } catch (fallbackErr: any) {
          console.warn('⚠️ Could not restore token from Supabase session', fallbackErr?.message || fallbackErr);
        }
      }

      // Check if token is expired or about to expire
      const isExpired = await SecureTokenStorage.isTokenExpired();

      if (token && isExpired && refreshToken) {
        console.log('🔄 Token expired or expiring soon, attempting refresh...');
        
        try {
          const supabase = createClient();
          
          // Check if we have a valid Supabase session
          const { data: { session: currentSession }, error: sessionError } = 
            await supabase.auth.getSession();
          
          // Only try to refresh via Supabase if we have a valid Supabase session
          if (currentSession && currentSession.refresh_token === refreshToken) {
            const { data: refreshData, error: refreshError } = 
              await supabase.auth.refreshSession();
            
            if (!refreshError && refreshData?.session) {
              // Update tokens in SecureStore
              token = refreshData.session.access_token;
              await SecureTokenStorage.setToken(
                token,
                refreshData.session.refresh_token,
                refreshData.session.expires_in
              );
              console.log('✅ Token refreshed via Supabase');
            }
          }
        } catch (refreshError: any) {
          // Silently handle refresh errors - response interceptor will handle 401
          console.warn('⚠️ Token refresh failed, will retry on 401:', refreshError.message);
        }
      }

      // Add token to request header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Debug logging for permissions endpoints only
      const url = config.url || '';
      if (url.includes('/auth/shared-access') || url.includes('/auth/access-logs')) {
        const authHeader = config.headers.Authorization as string | undefined;
        const authPreview = authHeader ? `${authHeader.slice(0, 20)}...` : 'missing';
        console.log('[api] request', {
          url: config.baseURL ? `${config.baseURL}${url}` : url,
          method: config.method,
          hasAuth: !!authHeader,
          authorization: authPreview,
        });
      }

      // Add Accept-Language header based on user's language preference
      // This would need to be read from AsyncStorage or context
      // For now, default to 'en'
      config.headers['Accept-Language'] = 'en';
    } catch (error) {
      console.error('❌ Request interceptor error:', error);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error('⏱️ Request timeout');
      return Promise.reject(error);
    }

    // Handle network errors
    if (
      error.code === 'NETWORK_ERROR' ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNRESET' ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ECONNABORTED' ||
      error.message?.includes('connection closed') ||
      error.message?.includes('Connection closed') ||
      error.message?.includes('socket hang up') ||
      error.message?.includes('ECONNRESET') ||
      error.message?.includes('Connection failed') ||
      error.message?.includes('timeout')
    ) {
      console.error('🌐 Network error:', error.message);
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Don't redirect for auth-related endpoints
      const isAuthEndpoint =
        error.config?.url?.includes('/login') ||
        error.config?.url?.includes('/register') ||
        error.config?.url?.includes('/auth/');

      const detail = error.response?.data?.detail;
      const normalizedDetail = typeof detail === 'string' ? detail.toLowerCase() : '';
      const shouldForceLogout =
        normalizedDetail.includes('invalid token') ||
        normalizedDetail.includes('token missing') ||
        normalizedDetail.includes('invalid authorization header format') ||
        normalizedDetail.includes('authentication failed') ||
        normalizedDetail.includes('session expired') ||
        normalizedDetail.includes('token expired');

      if (!isAuthEndpoint && shouldForceLogout) {
        // Clear tokens
        await SecureTokenStorage.clearTokens();

        // Clear auth state via logout callback
        if (logoutCallback) {
          logoutCallback();
        }

        // Only show session expired message once
        if (!sessionExpiredNotificationShown) {
          sessionExpiredNotificationShown = true;
          console.warn('⚠️ Session expired. User needs to log in again.');

          // Reset the flag after a delay
          setTimeout(() => {
            sessionExpiredNotificationShown = false;
          }, 5000);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

