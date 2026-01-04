import { useQuery } from '@tanstack/react-query';
import { HealthRecordsApiService } from '@/lib/api/health-records-api';
import { useAuthStore } from '@/lib/auth/auth-store';

/**
 * Hook to fetch health records dashboard data for a specific type
 * @param healthRecordTypeId - The health record type ID (1=Analysis, 2=Vitals, 3=Body, 4=Lifestyle)
 * @param enabled - Whether the query should be enabled (default: true)
 */
export function useHealthRecordsDashboard(healthRecordTypeId: number, enabled: boolean = true) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['health-records-dashboard', healthRecordTypeId],
    queryFn: () => HealthRecordsApiService.getDashboard(healthRecordTypeId),
    enabled: isAuthenticated && !!healthRecordTypeId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

