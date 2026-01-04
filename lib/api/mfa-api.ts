import { createClient } from '@/lib/supabase/client';
import { SecureTokenStorage } from '../storage/secure-storage';

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
 * Ensure Supabase has a valid session before MFA operations
 */
const ensureSupabaseSession = async (supabase: ReturnType<typeof createClient>): Promise<void> => {
  // Check if we have a valid session
  let { data: { session }, error: getSessionError } = await supabase.auth.getSession();
  
  if (getSessionError) {
    console.warn('⚠️ getSession error:', getSessionError.message);
  }
  
  if (!session) {
    console.log('🔄 No active Supabase session, attempting to restore...');
    
    // Try to restore session from stored tokens
    const accessToken = await SecureTokenStorage.getToken();
    const refreshToken = await SecureTokenStorage.getRefreshToken();
    
    if (!accessToken || !refreshToken) {
      throw new Error('Auth session missing! Please log in again.');
    }
    
    // Try to set the session using stored tokens
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    
    if (sessionError) {
      console.error('❌ Failed to set Supabase session:', sessionError.message);
      console.error('❌ Error details:', JSON.stringify(sessionError, null, 2));
      
      // If setSession fails with "invalid claim" or "missing sub", the token might be invalid
      if (sessionError.message?.includes('invalid claim') || sessionError.message?.includes('missing sub')) {
        throw new Error('Invalid authentication token. Please log out and log in again.');
      }
      
      // Try refreshing the session as a last resort
      try {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !refreshData?.session) {
          console.error('❌ Failed to refresh session:', refreshError?.message);
          throw new Error('Auth session missing! Please log in again.');
        }
        
        // Update stored tokens with refreshed session
        await SecureTokenStorage.setToken(
          refreshData.session.access_token,
          refreshData.session.refresh_token,
          refreshData.session.expires_in
        );
        
        // Store minimal session (without full user object to avoid SecureStore size limit)
        await SecureTokenStorage.setSupabaseSession({
          access_token: refreshData.session.access_token,
          refresh_token: refreshData.session.refresh_token,
          expires_in: refreshData.session.expires_in,
          expires_at: refreshData.session.expires_at,
          token_type: refreshData.session.token_type || 'bearer',
          // Don't store user object - it's too large for SecureStore
        });
        
        session = refreshData.session;
        console.log('✅ Supabase session refreshed successfully');
      } catch (refreshErr: any) {
        console.error('❌ Session refresh also failed:', refreshErr.message);
        throw new Error('Auth session missing! Please log in again.');
      }
    } else if (sessionData?.session) {
      session = sessionData.session;
      console.log('✅ Supabase session restored from stored tokens');
      
      // Verify the restored session is actually valid
      if (!session.user || !session.access_token) {
        console.error('❌ Restored session is invalid - missing user or token');
        throw new Error('Invalid session: missing required data');
      }
      
      // Update stored session with minimal data (without full user object)
      await SecureTokenStorage.setSupabaseSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
        token_type: session.token_type || 'bearer',
        // Don't store user object - it's too large for SecureStore
      });
      
      // Re-fetch session from Supabase client to ensure it's properly set
      // This ensures the session is available for subsequent operations
      const { data: { session: verifiedSession }, error: verifyError } = await supabase.auth.getSession();
      if (verifyError) {
        console.warn('⚠️ getSession after setSession returned error:', verifyError.message);
        // Continue with the session from setSession if getSession fails
      } else if (verifiedSession) {
        // Use the verified session which should have all data
        session = verifiedSession;
        console.log('✅ Session verified from client - user ID:', session.user?.id);
      } else {
        // If getSession doesn't return a session, use the one from setSession
        console.log('✅ Session restored and set successfully - user ID:', session.user?.id);
      }
    } else {
      console.error('❌ setSession returned no session data');
      throw new Error('Auth session missing! Please log in again.');
    }
  } else {
    console.log('✅ Valid Supabase session found');
    
    // Check if session has user data, if not, retrieve it
    if (!session.user) {
      console.log('🔄 Session found but missing user data, retrieving user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('❌ Failed to retrieve user data:', userError?.message);
        throw new Error('Invalid session: missing user data');
      }
      // Reconstruct session with user data
      session = { ...session, user };
      console.log('✅ User data retrieved and added to session');
    }
  }
  
  // Final verification - ensure session has all required data
  if (!session) {
    throw new Error('Invalid session: no session available');
  }
  
  if (!session.user) {
    console.error('❌ Session missing user data after all attempts');
    throw new Error('Invalid session: missing user data');
  }
  
  if (!session.access_token) {
    console.error('❌ Session missing access token');
    throw new Error('Invalid session: missing access token');
  }
  
  console.log('✅ Session verified - user ID:', session.user.id);
};

export interface MFAEnrollResponse {
  id: string;
  type: string;
  totp?: {
    qr_code: string;
    secret: string;
    uri: string;
  };
}

export interface MFAFactor {
  id: string;
  type: string;
  status: string;
  friendly_name?: string;
}

export class MFAApiService {
  /**
   * Enroll a new TOTP factor for 2FA
   */
  static async enrollMFA(friendlyName: string = 'My Authenticator App'): Promise<MFAEnrollResponse> {
    try {
      const supabase = createClient();
      
      // Ensure we have a valid session
      await ensureSupabaseSession(supabase);
      
      // Check for existing unverified factors and clean them up
      const { data: factorsData, error: listError } = await supabase.auth.mfa.listFactors();
      
      if (!listError && factorsData) {
        const existingFactors = factorsData.all || [];
        const verifiedFactors = factorsData.totp || [];
        
        // Clean up unverified factors with the same name
        for (const factor of existingFactors) {
          if (factor.friendly_name === friendlyName) {
            const isVerified = verifiedFactors.some((vf: any) => vf.id === factor.id);
            if (!isVerified) {
              await supabase.auth.mfa.unenroll({ factorId: factor.id });
            }
          }
        }
      }
      
      // Enroll new factor
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName,
      });
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Failed to enroll MFA factor');
      }
      
      return data as MFAEnrollResponse;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to enroll 2FA');
    }
  }
  
  /**
   * Verify and activate a TOTP factor
   */
  static async verifyMFAEnrollment(factorId: string, code: string): Promise<{ verified: boolean }> {
    try {
      const supabase = createClient();
      
      // Ensure we have a valid session
      await ensureSupabaseSession(supabase);
      
      // Validate code format
      const codeString = String(code).trim();
      if (codeString.length !== 6 || !/^\d{6}$/.test(codeString)) {
        throw new Error('Invalid code format. Please enter a 6-digit code.');
      }
      
      // Create challenge
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });
      
      if (challengeError || !challengeData?.id) {
        throw challengeError || new Error('Failed to create verification challenge');
      }
      
      // Verify immediately
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: codeString,
      });
      
      if (error) {
        throw error;
      }
      
      return { verified: true };
    } catch (error: any) {
      throw handleApiError(error, 'Failed to verify 2FA code');
    }
  }
  
  /**
   * List all MFA factors for the current user
   */
  static async listFactors(): Promise<MFAFactor[]> {
    try {
      const supabase = createClient();
      
      // Ensure we have a valid session
      await ensureSupabaseSession(supabase);
      
      // Double-check session is available before making the MFA call
      const { data: { session: finalCheck }, error: finalError } = await supabase.auth.getSession();
      if (finalError || !finalCheck) {
        console.error('❌ Session not available for MFA operation:', finalError?.message);
        throw new Error('Auth session missing! Please log in again.');
      }
      
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) {
        // If error is about missing session, provide a clearer message
        if (error.message?.includes('session') || error.message?.includes('Auth')) {
          throw new Error('Auth session missing! Please log in again.');
        }
        throw error;
      }
      
      // Map the response to match our interface (factor_type -> type)
      return (data?.totp || []).map((factor: any) => ({
        id: factor.id,
        type: factor.factor_type || factor.type || 'totp',
        status: factor.status,
        friendly_name: factor.friendly_name,
      })) as MFAFactor[];
    } catch (error: any) {
      throw handleApiError(error, 'Failed to list MFA factors');
    }
  }
  
  /**
   * Unenroll (disable) an MFA factor
   */
  static async unenrollMFA(factorId: string): Promise<void> {
    try {
      const supabase = createClient();
      
      // Ensure we have a valid session
      await ensureSupabaseSession(supabase);
      
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      throw handleApiError(error, 'Failed to disable 2FA');
    }
  }
}

