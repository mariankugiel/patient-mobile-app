import { useQuery } from '@tanstack/react-query';
import { HealthRecordsApiService, SummaryData } from '@/lib/api/health-records-api';
import { useAuthStore } from '@/lib/auth/auth-store';

/**
 * Hook to fetch health records summary data
 */
export function useHealthRecordsSummary() {
  const { isAuthenticated } = useAuthStore();

  return useQuery<SummaryData>({
    queryKey: ['health-records-summary'],
    queryFn: () => HealthRecordsApiService.getSummary(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

