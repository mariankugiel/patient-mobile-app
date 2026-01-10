import { useState, useEffect, useCallback } from 'react';
import { medicationsApiService, Medication, MedicationCreate, MedicationUpdate } from '@/lib/api/medications-api';

export function useMedications(statusFilter?: 'current' | 'previous') {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMedications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await medicationsApiService.getMedications(statusFilter);
      setMedications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const createMedication = useCallback(async (medication: MedicationCreate): Promise<Medication> => {
    try {
      const created = await medicationsApiService.createMedication(medication);
      await loadMedications();
      return created;
    } catch (err: any) {
      throw err;
    }
  }, [loadMedications]);

  const updateMedication = useCallback(async (id: number, medication: MedicationUpdate): Promise<Medication> => {
    try {
      const updated = await medicationsApiService.updateMedication(id, medication);
      await loadMedications();
      return updated;
    } catch (err: any) {
      throw err;
    }
  }, [loadMedications]);

  const deleteMedication = useCallback(async (id: number) => {
    try {
      await medicationsApiService.deleteMedication(id);
      setMedications(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      throw err;
    }
  }, []);

  const endMedication = useCallback(async (id: number, reason?: string): Promise<Medication> => {
    try {
      const result = await medicationsApiService.endMedication(id, reason);
      await loadMedications();
      return result.medication;
    } catch (err: any) {
      throw err;
    }
  }, [loadMedications]);

  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  return {
    medications,
    loading,
    error,
    createMedication,
    updateMedication,
    deleteMedication,
    endMedication,
    refresh: loadMedications
  };
}

