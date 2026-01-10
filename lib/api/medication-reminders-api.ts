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

export interface MedicationReminder {
  id: number;
  medication_id: number;
  user_id: number;
  reminder_time: string; // "08:00:00"
  user_timezone: string;
  days_of_week: string[];
  enabled: boolean;
  next_scheduled_at?: string;
  last_sent_at?: string;
  status: 'active' | 'paused' | 'deleted';
  created_at: string;
  updated_at?: string;
  medication_name?: string;
  medication_dosage?: string;
}

export interface CreateReminderRequest {
  medication_id: number;
  reminder_time: string; // "08:00:00"
  days_of_week: string[];
  enabled?: boolean;
}

export interface UpdateReminderRequest {
  reminder_time?: string;
  days_of_week?: string[];
  enabled?: boolean;
}

class MedicationRemindersApiService {
  async createReminder(reminder: CreateReminderRequest): Promise<MedicationReminder> {
    try {
      const response = await apiClient.post('/medication-reminders', reminder);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to create reminder');
    }
  }

  async getReminders(medicationId?: number): Promise<MedicationReminder[]> {
    try {
      const url = medicationId 
        ? `/medication-reminders/medications/${medicationId}/reminders`
        : '/medication-reminders';

      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to fetch reminders');
    }
  }

  async getReminder(reminderId: number): Promise<MedicationReminder> {
    try {
      const response = await apiClient.get(`/medication-reminders/${reminderId}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to fetch reminder');
    }
  }

  async updateReminder(reminderId: number, update: UpdateReminderRequest): Promise<MedicationReminder> {
    try {
      const response = await apiClient.put(`/medication-reminders/${reminderId}`, update);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to update reminder');
    }
  }

  async deleteReminder(reminderId: number): Promise<void> {
    try {
      await apiClient.delete(`/medication-reminders/${reminderId}`);
    } catch (error: any) {
      throw handleApiError(error, 'Failed to delete reminder');
    }
  }

  async toggleReminder(reminderId: number): Promise<MedicationReminder> {
    try {
      const response = await apiClient.post(`/medication-reminders/${reminderId}/toggle`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Failed to toggle reminder');
    }
  }
}

export const medicationRemindersApiService = new MedicationRemindersApiService();

