import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const EXPIRES_IN_KEY = 'expires_in';
const SUPABASE_SESSION_KEY = 'supabase_session'; // Store full Supabase session

/**
 * Secure token storage using Expo SecureStore
 * Provides secure storage for authentication tokens
 */
export class SecureTokenStorage {
  /**
   * Store authentication tokens securely
   */
  static async setToken(
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number
  ): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      
      if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      }
      
      if (expiresIn) {
        await SecureStore.setItemAsync(EXPIRES_IN_KEY, expiresIn.toString());
      }
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  /**
   * Get access token
   */
  static async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token
   */
  static async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving refresh token:', error);
      return null;
    }
  }

  /**
   * Get token expiration time
   */
  static async getExpiresIn(): Promise<number | null> {
    try {
      const expiresIn = await SecureStore.getItemAsync(EXPIRES_IN_KEY);
      return expiresIn ? parseInt(expiresIn, 10) : null;
    } catch (error) {
      console.error('Error retrieving expires_in:', error);
      return null;
    }
  }

  /**
   * Check if token is expired or about to expire (within 1 minute)
   */
  static async isTokenExpired(): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (!token) return true;

      // Decode JWT without verification (we just need the expiration time)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp;
        if (!exp) return true; // No expiration means we should refresh

        // Check if token expires within the next 1 minute (60 seconds)
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = exp - currentTime;

        // Refresh if expired or expires within 60 seconds
        return timeUntilExpiry <= 60;
      } catch (decodeError) {
        // If we can't decode the token, assume it's invalid
        return true;
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  /**
   * Clear all stored tokens
   */
  static async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(EXPIRES_IN_KEY);
      await SecureStore.deleteItemAsync(SUPABASE_SESSION_KEY);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw new Error('Failed to clear authentication tokens');
    }
  }

  /**
   * Check if user has stored tokens
   */
  static async hasTokens(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  /**
   * Store minimal Supabase session data (only essential tokens, not full user object)
   * This avoids SecureStore 2048 byte limit
   */
  static async setSupabaseSession(session: {
    access_token: string;
    refresh_token: string;
    expires_in?: number;
    expires_at?: number;
    token_type?: string;
    user?: any;
  }): Promise<void> {
    try {
      // Store only essential session data (without full user object to avoid size limit)
      const minimalSession = {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
        token_type: session.token_type || 'bearer',
      };
      
      // Only store if it's small enough (check size)
      const sessionStr = JSON.stringify(minimalSession);
      if (sessionStr.length > 2000) {
        console.warn('⚠️ Session data too large, storing only tokens');
        // Fall back to storing only tokens
        await this.setToken(
          session.access_token,
          session.refresh_token,
          session.expires_in
        );
      } else {
        await SecureStore.setItemAsync(SUPABASE_SESSION_KEY, sessionStr);
        // Also store individual tokens for backward compatibility
        await this.setToken(
          session.access_token,
          session.refresh_token,
          session.expires_in
        );
      }
    } catch (error) {
      console.error('Error storing Supabase session:', error);
      // Fall back to storing only tokens
      await this.setToken(
        session.access_token,
        session.refresh_token,
        session.expires_in
      );
    }
  }

  /**
   * Get minimal Supabase session (only essential tokens)
   */
  static async getSupabaseSession(): Promise<any | null> {
    try {
      const sessionStr = await SecureStore.getItemAsync(SUPABASE_SESSION_KEY);
      if (sessionStr) {
        return JSON.parse(sessionStr);
      }
      // Fallback: construct from individual tokens
      const accessToken = await this.getToken();
      const refreshToken = await this.getRefreshToken();
      const expiresIn = await this.getExpiresIn();
      if (accessToken && refreshToken) {
        return {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn,
          token_type: 'bearer',
        };
      }
      return null;
    } catch (error) {
      console.error('Error retrieving Supabase session:', error);
      // Fallback: construct from individual tokens
      const accessToken = await this.getToken();
      const refreshToken = await this.getRefreshToken();
      const expiresIn = await this.getExpiresIn();
      if (accessToken && refreshToken) {
        return {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn,
          token_type: 'bearer',
        };
      }
      return null;
    }
  }
}


