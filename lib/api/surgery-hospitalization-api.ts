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

export interface SurgeryHospitalization {
  id: number;
  user_id: number;
  procedure_type: 'surgery' | 'hospitalization';
  name: string;
  procedure_date: string;
  reason?: string;
  treatment?: string;
  body_area?: string;
  recovery_status: 'full_recovery' | 'partial_recovery' | 'no_recovery';
  notes?: string;
  created_at: string;
  updated_at?: string;
  created_by: number;
  updated_by?: number;
}

export interface SurgeryHospitalizationCreate {
  procedure_type: 'surgery' | 'hospitalization';
  name: string;
  procedure_date: string;
  reason?: string;
  treatment?: string;
  body_area?: string;
  recovery_status?: 'full_recovery' | 'partial_recovery' | 'no_recovery';
  notes?: string;
}

export interface SurgeryHospitalizationUpdate {
  procedure_type?: 'surgery' | 'hospitalization';
  name?: string;
  procedure_date?: string;
  reason?: string;
  treatment?: string;
  body_area?: string;
  recovery_status?: 'full_recovery' | 'partial_recovery' | 'no_recovery';
  notes?: string;
}

export interface SurgeryHospitalizationListResponse {
  surgeries: SurgeryHospitalization[];
  total: number;
  skip: number;
  limit: number;
}

// ============================================================================
// API SERVICE
// ============================================================================

export class SurgeryHospitalizationApiService {
  /**
   * Get all surgeries and hospitalizations
   */
  static async getAll(skip: number = 0, limit: number = 100): Promise<SurgeryHospitalizationListResponse> {
    try {
      const response = await apiClient.get('/health-records/surgeries-hospitalizations', {
        params: { skip, limit }
      });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to get surgeries and hospitalizations');
    }
  }

  /**
   * Get a specific surgery or hospitalization
   */
  static async getById(id: number): Promise<SurgeryHospitalization> {
    try {
      const response = await apiClient.get(`/health-records/surgeries-hospitalizations/${id}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to get surgery/hospitalization');
    }
  }

  /**
   * Create a new surgery or hospitalization
   */
  static async create(data: SurgeryHospitalizationCreate): Promise<SurgeryHospitalization> {
    try {
      const response = await apiClient.post('/health-records/surgeries-hospitalizations', data);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to create surgery/hospitalization');
    }
  }

  /**
   * Update a surgery or hospitalization
   */
  static async update(id: number, data: SurgeryHospitalizationUpdate): Promise<SurgeryHospitalization> {
    try {
      const response = await apiClient.put(`/health-records/surgeries-hospitalizations/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to update surgery/hospitalization');
    }
  }

  /**
   * Delete a surgery or hospitalization
   */
  static async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/health-records/surgeries-hospitalizations/${id}`);
    } catch (error: any) {
      throw handleApiError(error, 'Failed to delete surgery/hospitalization');
    }
  }
}

