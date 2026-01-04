import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '@/lib/auth/auth-store';
import { SecureTokenStorage } from '@/lib/storage/secure-storage';
import { createClient } from '@/lib/supabase/client';
import { AuthApiService } from '@/lib/api/auth-api';
import Colors from '@/constants/colors';

/**
 * OAuth callback handler
 * Handles OAuth redirects from Google sign-in
 */
export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { loginWithGoogle } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract tokens from URL parameters
        const accessToken = params.access_token as string;
        const refreshToken = params.refresh_token as string;
        const expiresIn = params.expires_in as string;

        if (accessToken && refreshToken) {
          // Store tokens securely
          await SecureTokenStorage.setToken(
            accessToken,
            refreshToken,
            expiresIn ? parseInt(expiresIn, 10) : undefined
          );

          // Set session in Supabase
          const supabase = createClient();
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Failed to set Supabase session:', sessionError);
            router.replace('/auth/login');
            return;
          }

          if (!sessionData?.session?.user) {
            router.replace('/auth/login');
            return;
          }

          const user = sessionData.session.user;

          // Get or create user profile from backend
          let userProfile;
          let isNewUser = false;

          try {
            userProfile = await AuthApiService.getProfile();
            isNewUser = false;
          } catch (error: any) {
            isNewUser = true;
            try {
              userProfile = await AuthApiService.createOAuthUserProfile({
                email: user.email || '',
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
                avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
                provider: 'google',
              });
            } catch (profileError: any) {
              console.warn('Failed to create OAuth user profile:', profileError);
              userProfile = {
                email: user.email,
                full_name: user.user_metadata?.full_name || user.user_metadata?.name,
                is_new_user: true,
                onboarding_completed: false,
              };
            }
          }

          // Update auth store
          useAuthStore.setState({
            user: {
              id: user.id,
              email: user.email || '',
              user_metadata: {
                ...userProfile,
                is_new_user: isNewUser,
              },
              access_token: accessToken,
              refresh_token: refreshToken,
              expires_in: expiresIn ? parseInt(expiresIn, 10) : undefined,
            },
            isAuthenticated: true,
            profile: userProfile,
          });

          // Redirect to main app
          router.replace('/(tabs)');
        } else {
          // No tokens in callback, redirect to login
          router.replace('/auth/login');
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        router.replace('/auth/login');
      }
    };

    handleCallback();
  }, [params, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text,
  },
});


