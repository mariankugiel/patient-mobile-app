import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileApiService } from '@/lib/api/profile-api';
import { ProfileCacheService } from '@/lib/cache/profile-cache';
import { OfflineQueueService } from '@/lib/queue/offline-queue';
import { useNetworkStatus } from './useNetworkStatus';
import { useAuthStore } from '@/lib/auth/auth-store';
import type { UserProfile } from '@/lib/api/types';

/**
 * Hook for fetching and updating user profile
 * Handles caching and offline support
 */
export function useProfile() {
  const queryClient = useQueryClient();
  const { isConnected } = useNetworkStatus();
  const { isAuthenticated, profile: authStoreProfile } = useAuthStore();

  // Fetch profile
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        // Try to fetch from API
        const profileData = await ProfileApiService.getProfile();
        // Cache the profile
        await ProfileCacheService.saveProfile(profileData);
        // Sync with auth store
        useAuthStore.setState({ profile: profileData });
        return profileData;
      } catch (apiError: any) {
        // If offline or API fails, try cache
        if (!isConnected || apiError.message.includes('network')) {
          const cached = await ProfileCacheService.getProfile();
          if (cached) {
            return cached;
          }
        }
        // If all else fails, use auth store profile
        if (authStoreProfile) {
          return authStoreProfile;
        }
        throw apiError;
      }
    },
    enabled: isAuthenticated, // Only fetch when authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    // Use auth store profile as placeholder data (always available, even if query hasn't run)
    placeholderData: authStoreProfile || undefined,
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      if (!isConnected) {
        // Queue update for later
        await OfflineQueueService.queueUpdate(
          'profile',
          '/auth/profile',
          'PUT',
          profileData
        );
        // Optimistically update cache
        if (profile) {
          const updated = { ...profile, ...profileData };
          await ProfileCacheService.saveProfile(updated);
          return updated;
        }
        throw new Error('Offline: Update queued');
      }

      // Online: Update via API
      const updated = await ProfileApiService.updateProfile(profileData);
      await ProfileCacheService.saveProfile(updated);
      return updated;
    },
    onSuccess: (data) => {
      // Update query cache
      queryClient.setQueryData(['profile'], data);
      // Sync profile with auth store so Header component gets updated avatar
      // Use the store's internal update method to avoid duplicate API calls
      useAuthStore.setState({ profile: data });
    },
    onError: (error: any) => {
      // Error handling is done in the mutation function
      console.error('Profile update error:', error);
    },
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: updateMutation.mutate,
    updateProfileAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

