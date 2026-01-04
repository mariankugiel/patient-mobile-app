import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
// In Expo, environment variables prefixed with EXPO_PUBLIC_ are available at runtime
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL or Anon Key not configured. OAuth and Supabase features will not work.');
}

/**
 * Create and export Supabase client instance
 * This client is used for OAuth authentication and Supabase Storage operations
 */
export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: async (key: string) => {
          // Use SecureStore for mobile
          const { SecureTokenStorage } = await import('../storage/secure-storage');
          
          // Supabase uses keys like 'sb-<project-ref>-auth-token' or 'supabase.auth.token'
          // Check for any auth token related key
          if (key.includes('auth-token') || key === 'supabase.auth.token' || key.includes('session') || key.includes('token')) {
            const session = await SecureTokenStorage.getSupabaseSession();
            if (session) {
              // Return the session as JSON string
              return JSON.stringify(session);
            }
            // Fallback: construct session from individual tokens
            const accessToken = await SecureTokenStorage.getToken();
            const refreshToken = await SecureTokenStorage.getRefreshToken();
            const expiresIn = await SecureTokenStorage.getExpiresIn();
            if (accessToken && refreshToken) {
              return JSON.stringify({
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: expiresIn,
                token_type: 'bearer',
              });
            }
            return null;
          }
          
          if (key.includes('access_token')) {
            return await SecureTokenStorage.getToken();
          }
          if (key.includes('refresh_token')) {
            return await SecureTokenStorage.getRefreshToken();
          }
          return null;
        },
        setItem: async (key: string, value: string) => {
          const { SecureTokenStorage } = await import('../storage/secure-storage');
          // Supabase stores session as JSON string
          try {
            const session = JSON.parse(value);
            if (session.access_token) {
              // Store full session
              await SecureTokenStorage.setSupabaseSession(session);
              // Also store individual tokens for backward compatibility
              await SecureTokenStorage.setToken(
                session.access_token,
                session.refresh_token,
                session.expires_in
              );
            }
          } catch (e) {
            // If not JSON, might be a direct token value
            if (key.includes('access_token')) {
              await SecureTokenStorage.setToken(value);
            }
          }
        },
        removeItem: async (key: string) => {
          const { SecureTokenStorage } = await import('../storage/secure-storage');
          await SecureTokenStorage.clearTokens();
        },
      },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // We handle this manually in mobile
    },
  });
};

// Export default client instance
export const supabase = createClient();

