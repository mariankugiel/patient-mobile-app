import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { createClient } from '@/lib/supabase/client';
import { SecureTokenStorage } from '@/lib/storage/secure-storage';
import { AuthApiService } from '@/lib/api/auth-api';

// Complete the auth session for better UX
WebBrowser.maybeCompleteAuthSession();

/**
 * Sign in with Google using Supabase OAuth
 * Handles the complete OAuth flow for mobile
 */
export async function signInWithGoogle(): Promise<{
  success: boolean;
  error?: string;
  user?: any;
}> {
  try {
    const supabase = createClient();

    // Create redirect URI for OAuth callback
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'saluso',
      path: 'auth/callback',
    });

    console.log('🔐 Starting Google OAuth flow...');
    console.log('🔗 Redirect URI:', redirectUri);

    // Initiate OAuth flow with Supabase
    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true, // We'll handle the browser redirect manually
      },
    });

    if (oauthError) {
      console.error('❌ OAuth error:', oauthError);
      return { success: false, error: oauthError.message };
    }

    if (!data?.url) {
      return { success: false, error: 'No OAuth URL returned' };
    }

    console.log('🌐 Opening OAuth URL in browser...');

    // Open OAuth URL in browser
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    console.log('📱 OAuth result:', result.type);

    if (result.type === 'success') {
      // Extract URL from result
      const { url } = result;
      
      // Parse the callback URL to extract tokens
      const parsedUrl = new URL(url);
      const accessToken = parsedUrl.searchParams.get('access_token');
      const refreshToken = parsedUrl.searchParams.get('refresh_token');
      const expiresIn = parsedUrl.searchParams.get('expires_in');

      if (accessToken && refreshToken) {
        // Store tokens securely
        await SecureTokenStorage.setToken(
          accessToken,
          refreshToken,
          expiresIn ? parseInt(expiresIn, 10) : undefined
        );

        // Set session in Supabase
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error('❌ Failed to set Supabase session:', sessionError);
          return { success: false, error: sessionError.message };
        }

        if (!sessionData?.session?.user) {
          return { success: false, error: 'No user data in session' };
        }

        const user = sessionData.session.user;
        console.log('✅ OAuth success, user:', user.email);

        // Get or create user profile from backend
        let userProfile;
        let isNewUser = false;

        try {
          // Try to get existing profile
          userProfile = await AuthApiService.getProfile();
          console.log('✅ Existing user profile found');
          isNewUser = false;
        } catch (error: any) {
          // Profile doesn't exist, create new one
          console.log('📝 Creating new user profile...');
          isNewUser = true;

          try {
            userProfile = await AuthApiService.createOAuthUserProfile({
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
              avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
              provider: 'google',
            });
            console.log('✅ OAuth user profile created successfully');
          } catch (profileError: any) {
            console.warn('⚠️ Failed to create OAuth user profile:', profileError);
            // Continue with minimal profile data
            userProfile = {
              email: user.email,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name,
              is_new_user: true,
              onboarding_completed: false,
            };
          }
        }

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            user_metadata: {
              ...userProfile,
              is_new_user: isNewUser,
            },
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn ? parseInt(expiresIn, 10) : undefined,
          },
        };
      } else {
        return { success: false, error: 'Missing tokens in OAuth callback' };
      }
    } else if (result.type === 'cancel') {
      return { success: false, error: 'OAuth flow cancelled by user' };
    } else {
      return { success: false, error: `OAuth flow failed: ${result.type}` };
    }
  } catch (error: any) {
    console.error('❌ Google sign-in error:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign in with Google',
    };
  }
}


