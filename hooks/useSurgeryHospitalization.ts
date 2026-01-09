import { useState, useEffect, useCallback } from 'react';
import { SurgeryHospitalizationApiService, SurgeryHospitalization, SurgeryHospitalizationCreate, SurgeryHospitalizationUpdate } from '@/lib/api/surgery-hospitalization-api';

export function useSurgeryHospitalization() {
  const [surgeries, setSurgeries] = useState<SurgeryHospitalization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSurgeries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await SurgeryHospitalizationApiService.getAll();
      setSurgeries(response.surgeries || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to load surgeries and hospitalizations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSurgery = useCallback(async (data: SurgeryHospitalizationCreate) => {
    try {
      const newSurgery = await SurgeryHospitalizationApiService.create(data);
      setSurgeries(prev => [newSurgery, ...prev]);
      return newSurgery;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create surgery/hospitalization';
      throw new Error(errorMessage);
    }
  }, []);

  const updateSurgery = useCallback(async (id: number, data: SurgeryHospitalizationUpdate) => {
    try {
      const updatedSurgery = await SurgeryHospitalizationApiService.update(id, data);
      setSurgeries(prev => prev.map(surgery => 
        surgery.id === id ? updatedSurgery : surgery
      ));
      return updatedSurgery;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to update surgery/hospitalization';
      throw new Error(errorMessage);
    }
  }, []);

  const deleteSurgery = useCallback(async (id: number) => {
    try {
      await SurgeryHospitalizationApiService.delete(id);
      setSurgeries(prev => prev.filter(surgery => surgery.id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to delete surgery/hospitalization';
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    loadSurgeries();
  }, [loadSurgeries]);

  return {
    surgeries,
    loading,
    error,
    createSurgery,
    updateSurgery,
    deleteSurgery,
    refresh: loadSurgeries
  };
}

