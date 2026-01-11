import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PermissionsApiService } from '@/lib/api/permissions-api';
import { useNetworkStatus } from './useNetworkStatus';
import type { UserSharedAccess } from '@/lib/api/types';

/**
 * Hook for fetching data access permissions
 */
export function usePermissions() {
  const { isConnected } = useNetworkStatus();

  // Fetch shared access
  const {
    data: sharedAccess,
    isLoading: isLoadingAccess,
    error: accessError,
    refetch: refetchAccess,
  } = useQuery({
    queryKey: ['shared-access'],
    queryFn: async () => {
      return await PermissionsApiService.getSharedAccess();
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: isConnected, // Only fetch when online
  });

  // Mutation to update shared access and keep cache in sync
  const queryClient = useQueryClient();
  const {
    mutateAsync: updateSharedAccess,
    isPending: isUpdatingSharedAccess,
  } = useMutation({
    mutationFn: (payload: Partial<UserSharedAccess>) =>
      PermissionsApiService.updateSharedAccess(payload),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(['shared-access'], data);
      }
      refetchAccess();
      refetchLogs();
    },
    onError: () => {
      // If update fails, refetch to ensure UI stays consistent with backend
      refetchAccess();
      refetchLogs();
    },
  });

  // Fetch access logs
  const {
    data: accessLogs,
    isLoading: isLoadingLogs,
    error: logsError,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ['access-logs'],
    queryFn: async () => {
      return await PermissionsApiService.getAccessLogs();
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: isConnected,
  });

  const normalizedSharedAccess = sharedAccess ?? null;

  return {
    sharedAccess: normalizedSharedAccess,
    accessLogs: accessLogs?.logs || [],
    isLoading: isLoadingAccess || isLoadingLogs,
    isUpdatingSharedAccess,
    error: accessError || logsError,
    refetch: () => {
      refetchAccess();
      refetchLogs();
    },
    updateSharedAccess,
  };
}


