import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EmergencyApiService } from '@/lib/api/emergency-api';
import { ProfileCacheService } from '@/lib/cache/profile-cache';
import { OfflineQueueService } from '@/lib/queue/offline-queue';
import { useNetworkStatus } from './useNetworkStatus';
import type { UserEmergency } from '@/lib/api/types';

/**
 * Hook for fetching and updating emergency data
 * Handles caching and offline support
 */
export function useEmergency() {
  const queryClient = useQueryClient();
  const { isConnected } = useNetworkStatus();

  // Fetch emergency data
  const {
    data: emergency,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['emergency'],
    queryFn: async () => {
      try {
        const emergencyData = await EmergencyApiService.getEmergency();
        await ProfileCacheService.saveEmergency(emergencyData);
        return emergencyData;
      } catch (apiError: any) {
        if (!isConnected || apiError.message.includes('network')) {
          const cached = await ProfileCacheService.getEmergency();
          if (cached) {
            return cached;
          }
        }
        throw apiError;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Update emergency mutation
  const updateMutation = useMutation({
    mutationFn: async (emergencyData: Partial<UserEmergency>) => {
      if (!isConnected) {
        await OfflineQueueService.queueUpdate(
          'emergency',
          '/auth/emergency',
          'PUT',
          emergencyData
        );
        if (emergency) {
          const updated = { ...emergency, ...emergencyData };
          await ProfileCacheService.saveEmergency(updated);
          return updated;
        }
        throw new Error('Offline: Update queued');
      }

      const updated = await EmergencyApiService.updateEmergency(emergencyData);
      await ProfileCacheService.saveEmergency(updated);
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['emergency'], data);
    },
  });

  return {
    emergency,
    isLoading,
    error,
    refetch,
    updateEmergency: updateMutation.mutate,
    updateEmergencyAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}


