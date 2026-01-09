import apiClient from './axios-config';

/**
 * Helper function to handle API errors
 */
const handleApiError = (error: any, defaultMessage: string): Error => {
  if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
    return new Error('Connection failed. Please check your internet connection and try again.');
  }
  if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    return new Error('Unable to connect to server. Please check your internet connection.');
  }
  const message = error.response?.data?.detail || error.message || defaultMessage;
  return new Error(message);
};

// ============================================================================
// TYPES
// ============================================================================

export interface BackendMedicalCondition {
  id?: number;
  condition_name: string;
  description?: string;
  diagnosed_date?: string;
  status: 'Active' | 'Resolved' | 'Chronic' | 'Remission' | 'Deceased' | 'controlled' | 'partiallyControlled' | 'uncontrolled' | 'resolved';
  severity?: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  source?: string;
  treatment_plan?: string;
  current_medications?: string[];
  outcome?: string;
  resolved_date?: string;
}

export interface BackendFamilyHistory {
  id?: number;
  condition_name?: string | null;
  relation: string;
  age_of_onset?: number | null;
  description?: string;
  outcome?: string | null;
  status?: 'Alive' | 'Deceased' | 'Unknown';
  source?: string;
  current_age?: number | null;
  is_deceased?: boolean;
  age_at_death?: number | null;
  cause_of_death?: string | null;
  chronic_diseases?: Array<{
    disease: string;
    age_at_diagnosis: string;
    comments?: string;
  }>;
  gender?: string | null;
}

export interface CurrentHealthProblem {
  condition: string;
  yearOfDiagnosis?: string;
  diagnosticProvider?: string;
  treatment: string;
  comments: string;
  status?: string;
  diagnosedDate?: string;
}

export interface PastMedicalCondition {
  condition: string;
  yearOfDiagnosis?: string;
  yearResolved?: string;
  treatment: string;
  comments: string;
  diagnosedDate?: string;
  resolvedDate?: string;
}

// ============================================================================
// API SERVICE
// ============================================================================

export class MedicalConditionApiService {
  /**
   * Maps backend status values to frontend status values
   */
  static mapStatusToFrontend(status: string): string {
    switch (status) {
      case 'Active': return 'controlled';
      case 'Chronic': return 'partiallyControlled';
      case 'Resolved': return 'resolved';
      case 'Remission': return 'remission';
      case 'Deceased': return 'deceased';
      case 'controlled':
      case 'partiallyControlled':
      case 'uncontrolled':
      case 'resolved':
      case 'remission':
      case 'deceased':
        return status;
      default: return 'uncontrolled';
    }
  }

  /**
   * Get all medical conditions
   */
  static async getAllMedicalConditions(): Promise<BackendMedicalCondition[]> {
    try {
      const response = await apiClient.get('/health-records/conditions');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      throw handleApiError(error, 'Failed to get medical conditions');
    }
  }

  /**
   * Get current health problems (conditions without resolved_date)
   */
  static async getCurrentHealthProblems(): Promise<BackendMedicalCondition[]> {
    try {
      const allConditions = await this.getAllMedicalConditions();
      return allConditions.filter((condition: BackendMedicalCondition) => 
        condition.status === 'Active' || 
        condition.status === 'Chronic' ||
        condition.status === 'uncontrolled' ||
        condition.status === 'controlled' ||
        condition.status === 'partiallyControlled' ||
        ((condition.status === 'resolved' || condition.status === 'Resolved') && !condition.resolved_date)
      );
    } catch (error: any) {
      throw handleApiError(error, 'Failed to get current health problems');
    }
  }

  /**
   * Create a current health problem
   */
  static async createCurrentHealthProblem(problem: CurrentHealthProblem): Promise<BackendMedicalCondition> {
    try {
      const backendData: any = {
        condition_name: problem.condition,
        description: problem.comments,
        status: problem.status || 'uncontrolled',
        source: 'Self Diagnosis',
        treatment_plan: problem.treatment,
      };

      if (problem.diagnosedDate && problem.diagnosedDate.trim()) {
        backendData.diagnosed_date = `${problem.diagnosedDate}T00:00:00`;
      } else if (problem.yearOfDiagnosis && problem.yearOfDiagnosis.trim()) {
        backendData.diagnosed_date = `${problem.yearOfDiagnosis}-01-01T00:00:00`;
      }

      const response = await apiClient.post('/health-records/conditions', backendData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to create health problem');
    }
  }

  /**
   * Update a current health problem
   */
  static async updateCurrentHealthProblem(id: number, problem: CurrentHealthProblem): Promise<BackendMedicalCondition> {
    try {
      const backendData: any = {
        condition_name: problem.condition,
        description: problem.comments,
        treatment_plan: problem.treatment,
        status: problem.status,
      };

      if (problem.diagnosedDate && problem.diagnosedDate.trim()) {
        backendData.diagnosed_date = `${problem.diagnosedDate}T00:00:00`;
      } else if (problem.yearOfDiagnosis && problem.yearOfDiagnosis.trim()) {
        backendData.diagnosed_date = `${problem.yearOfDiagnosis}-01-01T00:00:00`;
      }

      const response = await apiClient.put(`/health-records/conditions/${id}`, backendData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to update health problem');
    }
  }

  /**
   * Delete a current health problem
   */
  static async deleteCurrentHealthProblem(id: number): Promise<void> {
    try {
      await apiClient.delete(`/health-records/conditions/${id}`);
    } catch (error: any) {
      throw handleApiError(error, 'Failed to delete health problem');
    }
  }

  /**
   * Get past medical conditions (conditions with resolved_date)
   */
  static async getPastMedicalConditions(): Promise<BackendMedicalCondition[]> {
    try {
      const allConditions = await this.getAllMedicalConditions();
      return allConditions.filter((condition: BackendMedicalCondition) => 
        (condition.status === 'Resolved' || condition.status === 'resolved') && condition.resolved_date
      );
    } catch (error: any) {
      throw handleApiError(error, 'Failed to get past medical conditions');
    }
  }

  /**
   * Create a past medical condition
   */
  static async createPastMedicalCondition(condition: PastMedicalCondition | any): Promise<BackendMedicalCondition> {
    try {
      const conditionName = condition.condition || '';
      const description = condition.comments || condition.notes || '';
      const treatment = condition.treatment || condition.treatedWith || '';
      
      const backendData: any = {
        condition_name: conditionName,
        description: description,
        status: 'resolved',
        source: 'Self Diagnosis',
        treatment_plan: treatment,
      };

      if (condition.diagnosedDate && condition.diagnosedDate.trim()) {
        backendData.diagnosed_date = `${condition.diagnosedDate}T00:00:00`;
      } else if (condition.yearOfDiagnosis && condition.yearOfDiagnosis.trim()) {
        backendData.diagnosed_date = `${condition.yearOfDiagnosis}-01-01T00:00:00`;
      }
      
      if (condition.resolvedDate && condition.resolvedDate.trim()) {
        backendData.resolved_date = `${condition.resolvedDate}T00:00:00`;
      } else if (condition.yearResolved && condition.yearResolved.trim()) {
        backendData.resolved_date = `${condition.yearResolved}-01-01T00:00:00`;
      }

      const response = await apiClient.post('/health-records/conditions', backendData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to create past medical condition');
    }
  }

  /**
   * Update a past medical condition
   */
  static async updatePastMedicalCondition(id: number, condition: PastMedicalCondition | any): Promise<BackendMedicalCondition> {
    try {
      const conditionName = condition.condition || '';
      const description = condition.comments || condition.notes || '';
      const treatment = condition.treatment || condition.treatedWith || '';
      
      const backendData: any = {
        condition_name: conditionName,
        description: description,
        treatment_plan: treatment,
        status: condition.resolvedDate ? 'resolved' : 'uncontrolled',
      };

      if (condition.diagnosedDate && condition.diagnosedDate.trim()) {
        backendData.diagnosed_date = `${condition.diagnosedDate}T00:00:00`;
      } else if (condition.yearOfDiagnosis && condition.yearOfDiagnosis.trim()) {
        backendData.diagnosed_date = `${condition.yearOfDiagnosis}-01-01T00:00:00`;
      }
      
      if (condition.resolvedDate && condition.resolvedDate.trim()) {
        backendData.resolved_date = `${condition.resolvedDate}T00:00:00`;
      } else if (condition.yearResolved && condition.yearResolved.trim()) {
        backendData.resolved_date = `${condition.yearResolved}-01-01T00:00:00`;
      }

      const response = await apiClient.put(`/health-records/conditions/${id}`, backendData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to update past medical condition');
    }
  }

  /**
   * Delete a past medical condition
   */
  static async deletePastMedicalCondition(id: number): Promise<void> {
    try {
      await apiClient.delete(`/health-records/conditions/${id}`);
    } catch (error: any) {
      throw handleApiError(error, 'Failed to delete past medical condition');
    }
  }

  /**
   * Get family medical history
   */
  static async getFamilyHistory(): Promise<BackendFamilyHistory[]> {
    try {
      const response = await apiClient.get('/health-records/family-history');
      return response.data || [];
    } catch (error: any) {
      throw handleApiError(error, 'Failed to get family history');
    }
  }

  /**
   * Create family medical history
   */
  static async createFamilyHistory(history: any): Promise<BackendFamilyHistory> {
    try {
      const response = await apiClient.post('/health-records/family-history', history);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to create family history');
    }
  }

  /**
   * Update family medical history
   */
  static async updateFamilyHistory(id: number, history: any): Promise<BackendFamilyHistory> {
    try {
      const response = await apiClient.put(`/health-records/family-history/${id}`, history);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to update family history');
    }
  }

  /**
   * Delete family medical history
   */
  static async deleteFamilyHistory(id: number): Promise<void> {
    try {
      await apiClient.delete(`/health-records/family-history/${id}`);
    } catch (error: any) {
      throw handleApiError(error, 'Failed to delete family history');
    }
  }
}

