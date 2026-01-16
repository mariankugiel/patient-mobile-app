import React from 'react';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsApiService } from '@/lib/api/permissions-api';
import { useNetworkStatus } from './useNetworkStatus';
import type { UserSharedAccess } from '@/lib/api/types';

const hasEntries = (data?: UserSharedAccess | null) =>
  !!data &&
  (((data.health_professionals?.length ?? 0) + (data.family_friends?.length ?? 0)) > 0);

const STORAGE_KEY = 'shared-access-cache';

/**
 * Hook for fetching data access permissions
 */
export function usePermissions() {
  const { isConnected } = useNetworkStatus();
  const queryClient = useQueryClient();
  const lastNonEmptyRef = React.useRef<UserSharedAccess | null>(
    (queryClient.getQueryData(['shared-access']) as UserSharedAccess) || null
  );
  const hydratedRef = React.useRef(false);

  // Hydrate from local cache on mount so we have data immediately on navigation
  React.useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as UserSharedAccess;
          if (hasEntries(parsed)) {
            lastNonEmptyRef.current = parsed;
            queryClient.setQueryData(['shared-access'], parsed);
          }
        }
      } catch (e) {
        console.warn('Failed to hydrate shared access cache', e);
      }
    })();
  }, [queryClient]);

  // Fetch shared access
  const {
    data: sharedAccess,
    isLoading: isLoadingAccess,
    error: accessError,
    refetch: refetchAccess,
  } = useQuery<UserSharedAccess>({
    queryKey: ['shared-access'],
    queryFn: async () => {
      return await PermissionsApiService.getSharedAccess();
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    // Always attempt to fetch; react-query will retry based on network conditions
    enabled: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  } as UseQueryOptions<UserSharedAccess>);

  // Preserve last non-empty payload so navigation/unmounts don't wipe UI
  React.useEffect(() => {
    if (hasEntries(sharedAccess)) {
      lastNonEmptyRef.current = sharedAccess as UserSharedAccess;
      queryClient.setQueryData(['shared-access'], sharedAccess);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sharedAccess)).catch(() => {});
    } else if (hasEntries(lastNonEmptyRef.current)) {
      queryClient.setQueryData(['shared-access'], lastNonEmptyRef.current);
    }
  }, [sharedAccess, queryClient]);

  // Mutation to update shared access and keep cache in sync
  const {
    mutateAsync: updateSharedAccess,
    isPending: isUpdatingSharedAccess,
  } = useMutation({
    mutationFn: (payload: Partial<UserSharedAccess>) =>
      PermissionsApiService.updateSharedAccess(payload),
    onMutate: (payload) => {
      const hp = payload.health_professionals?.length ?? 0;
      const ff = payload.family_friends?.length ?? 0;
      console.log('[permissions] mutate start hp', hp, 'ff', ff);
    },
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
        lastNonEmptyRef.current = next as UserSharedAccess;
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      }
      refetchAccess();
      refetchLogs();
    },
    onError: (err) => {
      console.error('[permissions] mutate error', err);
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
  const normalizedSharedAccess = hasEntries(sharedAccess)
    ? (sharedAccess as UserSharedAccess)
    : lastNonEmptyRef.current ?? (sharedAccess as UserSharedAccess) ?? null;

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


