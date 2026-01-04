import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationsApiService } from '@/lib/api/notifications-api';
import { ProfileCacheService } from '@/lib/cache/profile-cache';
import { OfflineQueueService } from '@/lib/queue/offline-queue';
import { useNetworkStatus } from './useNetworkStatus';
import type { UserNotifications } from '@/lib/api/types';

/**
 * Hook for fetching and updating notification preferences
 * Handles caching and offline support
 */
export function useNotifications() {
  const queryClient = useQueryClient();
  const { isConnected } = useNetworkStatus();

  // Fetch notifications
  const {
    data: notifications,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const notificationsData = await NotificationsApiService.getNotifications();
        await ProfileCacheService.saveNotifications(notificationsData);
        return notificationsData;
      } catch (apiError: any) {
        if (!isConnected || apiError.message.includes('network')) {
          const cached = await ProfileCacheService.getNotifications();
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

  // Update notifications mutation
  const updateMutation = useMutation({
    mutationFn: async (notificationsData: Partial<UserNotifications>) => {
      if (!isConnected) {
        await OfflineQueueService.queueUpdate(
          'notifications',
          '/auth/notifications',
          'PUT',
          notificationsData
        );
        if (notifications) {
          const updated = { ...notifications, ...notificationsData };
          await ProfileCacheService.saveNotifications(updated);
          return updated;
        }
        throw new Error('Offline: Update queued');
      }

      const updated = await NotificationsApiService.updateNotifications(notificationsData);
      await ProfileCacheService.saveNotifications(updated);
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['notifications'], data);
    },
  });

  return {
    notifications,
    isLoading,
    error,
    refetch,
    updateNotifications: updateMutation.mutate,
    updateNotificationsAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}


