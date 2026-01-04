import { useQuery } from '@tanstack/react-query';
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

  return {
    sharedAccess: sharedAccess || ({} as UserSharedAccess),
    accessLogs: accessLogs?.logs || [],
    isLoading: isLoadingAccess || isLoadingLogs,
    error: accessError || logsError,
    refetch: () => {
      refetchAccess();
      refetchLogs();
    },
  };
}


