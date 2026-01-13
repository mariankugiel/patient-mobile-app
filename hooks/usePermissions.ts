import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PermissionsApiService } from '@/lib/api/permissions-api';
import { useNetworkStatus } from './useNetworkStatus';
import type { UserSharedAccess } from '@/lib/api/types';

const hasEntries = (data?: UserSharedAccess | null) =>
  !!data &&
  (((data.health_professionals?.length ?? 0) + (data.family_friends?.length ?? 0)) > 0);

/**
 * Hook for fetching data access permissions
 */
export function usePermissions() {
  const { isConnected } = useNetworkStatus();
  const [lastNonEmpty, setLastNonEmpty] = React.useState<UserSharedAccess | null>(null);

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
    onSuccess: (data, variables) => {
      // API may return 204/no body or an empty object; fall back to submitted payload
      const hasResponseEntries =
        !!data &&
        (((data as UserSharedAccess).health_professionals?.length ?? 0) +
          ((data as UserSharedAccess).family_friends?.length ?? 0) >
          0);

      const next = hasResponseEntries ? (data as UserSharedAccess) : (variables as UserSharedAccess) ?? null;
      queryClient.setQueryData(['shared-access'], next);
      if (hasEntries(next)) {
        setLastNonEmpty(next as UserSharedAccess);
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

  // Track last non-empty shared access so refetches that return empty don't clear UI
  React.useEffect(() => {
    if (hasEntries(sharedAccess)) {
      setLastNonEmpty(sharedAccess as UserSharedAccess);
    }
  }, [sharedAccess]);

  const normalizedSharedAccess = hasEntries(sharedAccess)
    ? (sharedAccess as UserSharedAccess)
    : lastNonEmpty ?? (sharedAccess as UserSharedAccess) ?? null;

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


