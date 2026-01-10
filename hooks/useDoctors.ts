import { useState, useCallback } from 'react';
import { appointmentsApiService, Doctor } from '@/lib/api/appointments-api';

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const loadDoctors = useCallback(async (params?: {
    search?: string;
    location?: string;
    offset?: number;
    limit?: number;
    reset?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchParams = {
        search: params?.search,
        location: params?.location,
        offset: params?.offset !== undefined ? params.offset : offset,
        limit: params?.limit || 20,
      };

      const data = await appointmentsApiService.getDoctors(fetchParams);
      
      if (params?.reset) {
        setDoctors(data);
        setOffset(data.length);
      } else {
        setDoctors(prev => [...prev, ...data]);
        setOffset(prev => prev + data.length);
      }
      
      // Assume there's more if we got a full page
      setHasMore(data.length === (params?.limit || 20));
    } catch (err: any) {
      setError(err.message || 'Failed to load doctors');
      if (params?.reset) {
        setDoctors([]);
      }
    } finally {
      setLoading(false);
    }
  }, [offset]);

  const reset = useCallback(() => {
    setDoctors([]);
    setOffset(0);
    setHasMore(false);
    setError(null);
  }, []);

  return {
    doctors,
    loading,
    error,
    hasMore,
    loadDoctors,
    reset,
  };
}

