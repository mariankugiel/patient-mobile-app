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

export interface Medication {
  id: number;
  patient_id: number;
  medication_name: string;
  medication_type: 'prescription' | 'over_the_counter' | 'supplement' | 'vaccine';
  status: 'active' | 'discontinued' | 'completed' | 'on_hold';
  start_date: string;
  end_date?: string;
  reason_ended?: string;
  prescribed_by?: number;
  created_at: string;
  updated_at?: string;
  // Additional fields for UI compatibility
  dosage?: string;
  frequency?: string;
  purpose?: string;
  instructions?: string;
  // Prescription information (flat structure from backend)
  rx_number?: string;
  pharmacy?: string;
  original_quantity?: number;
  refills_remaining?: number;
  last_filled_date?: string;
  // Optional reminders (loaded separately)
  reminders?: Array<{
    id: string;
    time: string;
    days: string[];
    enabled: boolean;
  }>;
}

export interface MedicationCreate {
  medication_name: string;
  medication_type: 'prescription' | 'over_the_counter' | 'supplement' | 'vaccine';
  dosage?: string;
  frequency?: string;
  purpose?: string;
  instructions?: string;
  start_date: string;
  end_date?: string;
  // Prescription information
  rx_number?: string;
  pharmacy?: string;
  original_quantity?: number;
  refills_remaining?: number;
  last_filled_date?: string;
}

export interface MedicationUpdate {
  medication_name?: string;
  medication_type?: 'prescription' | 'over_the_counter' | 'supplement' | 'vaccine';
  dosage?: string | null;
  frequency?: string | null;
  purpose?: string | null;
  instructions?: string | null;
  status?: 'active' | 'discontinued' | 'completed' | 'on_hold';
  start_date?: string;
  end_date?: string;
  // Prescription information - null values are sent to clear fields
  rx_number?: string | null;
  pharmacy?: string | null;
  original_quantity?: number | null;
  refills_remaining?: number | null;
  last_filled_date?: string | null;
}

class MedicationsApiService {
  async getMedications(statusFilter?: 'current' | 'previous', patientId?: number): Promise<Medication[]> {
    try {
      const params: any = {};
      if (statusFilter) {
        params.status_filter = statusFilter;
      }
      if (patientId) {
        params.patient_id = patientId;
      }
      const response = await apiClient.get('/medications', { params });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to fetch medications');
    }
  }

  async getMedication(id: number): Promise<Medication> {
    try {
      const response = await apiClient.get(`/medications/${id}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to fetch medication');
    }
  }

  async createMedication(medication: MedicationCreate): Promise<Medication> {
    try {
      const response = await apiClient.post('/medications', medication);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to create medication');
    }
  }

  async updateMedication(id: number, medication: MedicationUpdate): Promise<Medication> {
    try {
      const response = await apiClient.put(`/medications/${id}`, medication);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to update medication');
    }
  }

  async deleteMedication(id: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`/medications/${id}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to delete medication');
    }
  }

  async endMedication(id: number, reason?: string): Promise<{ message: string; medication: Medication }> {
    try {
      const response = await apiClient.patch(`/medications/${id}/end`, { reason });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to end medication');
    }
  }
}

export const medicationsApiService = new MedicationsApiService();

