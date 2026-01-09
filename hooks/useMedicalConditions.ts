import { useState, useEffect, useCallback } from 'react';
import { MedicalConditionApiService, BackendMedicalCondition, BackendFamilyHistory } from '@/lib/api/medical-condition-api';

// ============================================================================
// TYPES
// ============================================================================

export interface CurrentCondition {
  id?: number;
  condition: string;
  diagnosedDate: string;
  treatedWith: string;
  status: 'controlled' | 'partiallyControlled' | 'uncontrolled';
  notes: string;
}

export interface PastCondition {
  id?: number;
  condition: string;
  diagnosedDate: string;
  treatedWith: string;
  resolvedDate: string;
  notes: string;
}

export interface FamilyHistoryEntry {
  id?: number;
  relation: string;
  is_deceased?: boolean;
  age_at_death?: number;
  cause_of_death?: string;
  current_age?: number;
  gender?: string;
  chronic_diseases?: Array<{
    disease: string;
    age_at_diagnosis: string;
    comments?: string;
  }>;
  condition?: string;
  ageOfOnset?: string;
  outcome?: string;
}

// ============================================================================
// CURRENT MEDICAL CONDITIONS HOOK
// ============================================================================

export function useCurrentMedicalConditions() {
  const [conditions, setConditions] = useState<CurrentCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConditions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const backendConditions = await MedicalConditionApiService.getCurrentHealthProblems();
      
      const transformedConditions: CurrentCondition[] = backendConditions.map(condition => ({
        id: condition.id,
        condition: condition.condition_name,
        diagnosedDate: condition.diagnosed_date ? condition.diagnosed_date.split('T')[0] : '',
        treatedWith: condition.treatment_plan || '',
        status: MedicalConditionApiService.mapStatusToFrontend(condition.status) as 'controlled' | 'partiallyControlled' | 'uncontrolled',
        notes: condition.description || ''
      }));
      
      setConditions(transformedConditions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCondition = useCallback(async (condition: Omit<CurrentCondition, 'id'>) => {
    try {
      let yearOfDiagnosis = '';
      if (condition.diagnosedDate) {
        const dateStr = condition.diagnosedDate;
        if (dateStr.includes('-')) {
          yearOfDiagnosis = dateStr.split('-')[0];
        } else {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            yearOfDiagnosis = date.getFullYear().toString();
          }
        }
      }

      const backendData = {
        condition: condition.condition,
        yearOfDiagnosis: yearOfDiagnosis,
        diagnosticProvider: condition.treatedWith,
        treatment: condition.treatedWith,
        comments: condition.notes,
        status: condition.status,
        diagnosedDate: condition.diagnosedDate
      };

      await MedicalConditionApiService.createCurrentHealthProblem(backendData);
      await loadConditions();
    } catch (err: any) {
      throw err;
    }
  }, [loadConditions]);

  const updateCondition = useCallback(async (id: number, condition: Omit<CurrentCondition, 'id'>) => {
    try {
      let yearOfDiagnosis = '';
      if (condition.diagnosedDate) {
        const dateStr = condition.diagnosedDate;
        if (dateStr.includes('-')) {
          yearOfDiagnosis = dateStr.split('-')[0];
        } else {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            yearOfDiagnosis = date.getFullYear().toString();
          }
        }
      }

      const backendData = {
        condition: condition.condition,
        yearOfDiagnosis: yearOfDiagnosis,
        diagnosticProvider: condition.treatedWith,
        treatment: condition.treatedWith,
        comments: condition.notes,
        status: condition.status,
        diagnosedDate: condition.diagnosedDate
      };

      await MedicalConditionApiService.updateCurrentHealthProblem(id, backendData);
      await loadConditions();
    } catch (err: any) {
      throw err;
    }
  }, [loadConditions]);

  const deleteCondition = useCallback(async (id: number) => {
    try {
      await MedicalConditionApiService.deleteCurrentHealthProblem(id);
      setConditions(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      throw err;
    }
  }, []);

  useEffect(() => {
    loadConditions();
  }, [loadConditions]);

  return {
    conditions,
    loading,
    error,
    addCondition,
    updateCondition,
    deleteCondition,
    refresh: loadConditions
  };
}

// ============================================================================
// PAST MEDICAL CONDITIONS HOOK
// ============================================================================

export function usePastMedicalConditions() {
  const [conditions, setConditions] = useState<PastCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConditions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const backendConditions = await MedicalConditionApiService.getPastMedicalConditions();
      
      const transformedConditions: PastCondition[] = backendConditions.map(condition => ({
        id: condition.id,
        condition: condition.condition_name,
        diagnosedDate: condition.diagnosed_date ? condition.diagnosed_date.split('T')[0] : '',
        treatedWith: condition.treatment_plan || '',
        resolvedDate: condition.resolved_date ? condition.resolved_date.split('T')[0] : '',
        notes: condition.description || ''
      }));
      
      setConditions(transformedConditions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCondition = useCallback(async (condition: Omit<PastCondition, 'id'>) => {
    try {
      let yearOfDiagnosis = '';
      let yearResolved = '';
      
      if (condition.diagnosedDate) {
        const dateStr = condition.diagnosedDate;
        if (dateStr.includes('-')) {
          yearOfDiagnosis = dateStr.split('-')[0];
        } else {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            yearOfDiagnosis = date.getFullYear().toString();
          }
        }
      }
      
      if (condition.resolvedDate) {
        const dateStr = condition.resolvedDate;
        if (dateStr.includes('-')) {
          yearResolved = dateStr.split('-')[0];
        } else {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            yearResolved = date.getFullYear().toString();
          }
        }
      }

      const backendData = {
        condition: condition.condition,
        yearOfDiagnosis: yearOfDiagnosis,
        yearResolved: yearResolved,
        treatment: condition.treatedWith,
        comments: condition.notes,
        diagnosedDate: condition.diagnosedDate,
        resolvedDate: condition.resolvedDate
      };

      await MedicalConditionApiService.createPastMedicalCondition(backendData);
      await loadConditions();
    } catch (err: any) {
      throw err;
    }
  }, [loadConditions]);

  const updateCondition = useCallback(async (id: number, condition: Omit<PastCondition, 'id'>) => {
    try {
      let yearOfDiagnosis = '';
      let yearResolved = '';
      
      if (condition.diagnosedDate) {
        const dateStr = condition.diagnosedDate;
        if (dateStr.includes('-')) {
          yearOfDiagnosis = dateStr.split('-')[0];
        } else {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            yearOfDiagnosis = date.getFullYear().toString();
          }
        }
      }
      
      if (condition.resolvedDate) {
        const dateStr = condition.resolvedDate;
        if (dateStr.includes('-')) {
          yearResolved = dateStr.split('-')[0];
        } else {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            yearResolved = date.getFullYear().toString();
          }
        }
      }

      const backendData = {
        condition: condition.condition,
        yearOfDiagnosis: yearOfDiagnosis,
        yearResolved: yearResolved,
        treatment: condition.treatedWith,
        comments: condition.notes,
        diagnosedDate: condition.diagnosedDate,
        resolvedDate: condition.resolvedDate
      };

      await MedicalConditionApiService.updatePastMedicalCondition(id, backendData);
      await loadConditions();
    } catch (err: any) {
      throw err;
    }
  }, [loadConditions]);

  const deleteCondition = useCallback(async (id: number) => {
    try {
      await MedicalConditionApiService.deletePastMedicalCondition(id);
      setConditions(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      throw err;
    }
  }, []);

  useEffect(() => {
    loadConditions();
  }, [loadConditions]);

  return {
    conditions,
    loading,
    error,
    addCondition,
    updateCondition,
    deleteCondition,
    refresh: loadConditions
  };
}

// ============================================================================
// FAMILY MEDICAL HISTORY HOOK
// ============================================================================

export function useFamilyMedicalHistory() {
  const [history, setHistory] = useState<FamilyHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const backendHistory = await MedicalConditionApiService.getFamilyHistory();
      
      const transformedHistory: FamilyHistoryEntry[] = backendHistory.map(entry => ({
        id: entry.id,
        relation: entry.relation,
        is_deceased: entry.is_deceased,
        age_at_death: entry.age_at_death || undefined,
        cause_of_death: entry.cause_of_death || undefined,
        current_age: entry.current_age || undefined,
        gender: entry.gender || undefined,
        chronic_diseases: entry.chronic_diseases || [],
        condition: entry.condition_name || undefined,
        ageOfOnset: entry.age_of_onset?.toString() || '',
        outcome: entry.outcome || undefined
      }));
      
      setHistory(transformedHistory);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addHistoryEntry = useCallback(async (entry: any) => {
    try {
      await MedicalConditionApiService.createFamilyHistory(entry);
      await loadHistory();
    } catch (err: any) {
      throw err;
    }
  }, [loadHistory]);

  const updateHistoryEntry = useCallback(async (id: number, entry: any) => {
    try {
      await MedicalConditionApiService.updateFamilyHistory(id, entry);
      await loadHistory();
    } catch (err: any) {
      throw err;
    }
  }, [loadHistory]);

  const deleteHistoryEntry = useCallback(async (id: number) => {
    try {
      await MedicalConditionApiService.deleteFamilyHistory(id);
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (err: any) {
      throw err;
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    loading,
    error,
    addHistoryEntry,
    updateHistoryEntry,
    deleteHistoryEntry,
    refresh: loadHistory
  };
}

