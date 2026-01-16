import apiClient from './axios-config';

// ============================================================================
// TYPES
// ============================================================================

export interface Doctor {
  id: string | number;
  name: string;
  firstName?: string;
  lastName?: string;
  specialty?: string | null;
  avatar?: string | null;
  address?: string | null;
  isOnline?: boolean;
  email?: string;
  acuityCalendarId?: string | null;
  acuityOwnerId?: string | null;
  timezone?: string | null;
  appointmentTypes?: Array<{
    id: string;
    name?: string;
    description?: string;
    duration?: number;
    price?: number;
    type?: string;
    category?: string;
  }>;
}

export interface Appointment {
  id: number;
  patient_id: number;
  professional_id: number;
  appointment_date?: string;
  scheduled_at?: string;
  duration_minutes: number;
  appointment_type: string | number;
  status: string;
  frontend_status?: 'upcoming' | 'completed' | 'cancelled';
  symptoms?: string;
  notes?: string;
  diagnosis?: string;
  treatment_plan?: string;
  prescription?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at?: string;
  // Acuity integration fields
  acuity_appointment_id?: string;
  acuity_calendar_id?: string;
  confirmation_page?: string | null;
  // Video meeting fields
  virtual_meeting_url?: string;
  virtual_meeting_id?: string;
  virtual_meeting_platform?: string;
  consultation_type?: 'virtual' | 'in_person' | 'phone';
  // Doctor information
  doctor_name?: string;
  doctor_specialty?: string;
  // Cost information
  cost?: number;
  currency?: string;
  payment_status?: string;
  timezone?: string;
  appointment_type_id?: number | null;
  appointment_type_name?: string | null;
  appointment_type_duration?: number | null;
  appointment_type_price?: number | null;
  amount_paid?: number | null;
  is_paid?: boolean;
  phone?: string | null;
  location?: string | null;
}

export interface FrontendAppointment {
  id: string;
  doctor: string;
  doctorId?: string | number;
  specialty: string;
  date: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'virtual' | 'in-person' | 'phone';
  cost?: number;
  amountPaid?: number | null;
  virtual_meeting_url?: string;
  timezone?: string;
  acuityCalendarId?: string | null;
  confirmation_page?: string | null;
  notes?: string;
  appointmentTypeId?: string | number | null;
  appointmentTypeName?: string | null;
  appointmentTypeDuration?: number | null;
  appointmentTypePrice?: number | null;
  phone?: string | null;
  location?: string | null;
}

export interface AcuityEmbedConfig {
  embed_url: string;
  iframe_src: string;
  owner_id: string;
  calendar_id?: string;
}

export interface VideoRoomData {
  room_url: string;
  room_name: string;
  patient_token: string;
  professional_token?: string;
}

export interface AppointmentBookRequest {
  calendar_id: string;
  appointment_type_id?: number;
  datetime: string; // ISO format with timezone
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  note?: string;
  timezone?: string;
}

export interface AppointmentRescheduleRequest {
  appointment_date: string;
  consultation_type?: string;
  appointment_type_id?: number;
  notes?: string;
}

export interface TimeSlot {
  time?: string;
  available?: boolean;
  isoTime?: string;
  rawTime?: string;
  datetime?: string;
  start_time?: string;
  startTime?: string;
  displayTime?: string;
}

// ============================================================================
// API SERVICE
// ============================================================================

class AppointmentsApiService {
  /**
   * Get available doctors for appointments with search
   */
  async getDoctors(params?: {
    search?: string;
    location?: string;
    offset?: number;
    limit?: number;
  }): Promise<Doctor[]> {
    const response = await apiClient.get('/appointments/doctors', { params });
    return response.data;
  }

  /**
   * Get Acuity embed URL for a specific doctor
   */
  async getAcuityEmbedUrl(professionalId: number): Promise<AcuityEmbedConfig> {
    const response = await apiClient.get(`/appointments/doctors/${professionalId}/acuity-embed`);
    return response.data;
  }

  /**
   * Get available dates for a calendar
   */
  async getAvailabilityDates(calendarId: string, appointmentTypeId?: number, month?: string): Promise<string[]> {
    const params: any = {
      calendar_id: calendarId,
    };
    if (appointmentTypeId !== undefined && appointmentTypeId !== null) {
      params.appointment_type_id = appointmentTypeId;
    }
    if (month) {
      params.month = month;
    }
    const response = await apiClient.get('/appointments/availability/dates', { params });
    const datesRaw = response.data.dates || [];
    
    // Extract date strings from objects if needed
    // API might return [{date: "2026-01-15"}, ...] or ["2026-01-15", ...]
    const dates = datesRaw.map((item: any) => {
      if (typeof item === 'string') {
        return item;
      } else if (item && typeof item === 'object' && item.date) {
        return item.date;
      } else {
        return String(item);
      }
    }).filter(Boolean);
    
    return dates;
  }

  /**
   * Normalize time slot from backend (can be string or object)
   */
  private normalizeTimeSlot(slot: any, date: string): TimeSlot {
    let rawValue = '';
    let isoCandidate = '';
    
    // Handle string slots
    if (typeof slot === 'string') {
      rawValue = slot.trim();
      if (rawValue.includes('T')) {
        isoCandidate = rawValue;
      }
    } else if (typeof slot === 'object' && slot !== null) {
      // Extract time from various possible fields
      const candidate = slot.time || slot.datetime || slot.start_time || slot.startTime || null;
      if (candidate !== null && candidate !== undefined) {
        rawValue = candidate.toString().trim();
        if (slot.datetime || rawValue.includes('T')) {
          isoCandidate = slot.datetime?.toString() || rawValue;
        }
      }
    }
    
    // Normalize ISO string (fix timezone format: +0100 -> +01:00)
    let isoTime = '';
    if (isoCandidate) {
      try {
        // Normalize timezone format
        const normalized = isoCandidate.replace(/([+-])(\d{2})(\d{2})$/, '$1$2:$3');
        // Validate it's a valid ISO string
        const testDate = new Date(normalized);
        if (!isNaN(testDate.getTime())) {
          isoTime = normalized;
        }
      } catch {
        // If parsing fails, try original
        isoTime = isoCandidate;
      }
    }
    
    // Extract display time
    let displayTime = rawValue;
    if (isoTime) {
      try {
        const dateObj = new Date(isoTime);
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        displayTime = `${hours}:${minutes}`;
      } catch {
        // Fall through to regex parsing
      }
    } else if (rawValue) {
      // Try to extract HH:mm from raw string
      const match = rawValue.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        displayTime = `${match[1].padStart(2, '0')}:${match[2]}`;
      }
    }
    
    return {
      time: displayTime || rawValue,
      available: slot.available !== undefined ? slot.available : true, // Default to available
      isoTime: isoTime || undefined,
      rawTime: rawValue || undefined,
      datetime: slot.datetime || undefined,
      start_time: slot.start_time || undefined,
      startTime: slot.startTime || undefined,
      displayTime: displayTime || undefined,
    };
  }

  /**
   * Get available time slots for a calendar on a specific date
   */
  async getAvailabilityTimes(calendarId: string, date: string, appointmentTypeId?: number): Promise<TimeSlot[]> {
    const params: any = {
      calendar_id: calendarId,
      date: date,
    };
    if (appointmentTypeId !== undefined && appointmentTypeId !== null) {
      params.appointment_type_id = appointmentTypeId;
    }
    const response = await apiClient.get('/appointments/availability/times', { params });
    const times = response.data.times || [];
    
    // Normalize time slots to ensure consistent format
    return times.map((slot: any) => this.normalizeTimeSlot(slot, date));
  }

  /**
   * Get available time slots for each day in a week
   */
  async getAvailabilityWeek(calendarId: string, startDate: string, appointmentTypeId?: number): Promise<Record<string, TimeSlot[]>> {
    const params: any = {
      calendar_id: calendarId,
      start_date: startDate,
    };
    if (appointmentTypeId !== undefined && appointmentTypeId !== null) {
      params.appointment_type_id = appointmentTypeId;
    }
    const response = await apiClient.get('/appointments/availability/week', { params });
    if (response.data?.week) {
      const result: Record<string, TimeSlot[]> = {};
      for (const day of response.data.week) {
        if (day?.date) {
          const slots = day.slots || [];
          // Normalize time slots
          result[day.date] = slots.map((slot: any) => this.normalizeTimeSlot(slot, day.date));
        }
      }
      return result;
    }
    return {};
  }

  /**
   * Get all appointments for current user
   */
  async fetchAppointments(): Promise<Appointment[]> {
    const response = await apiClient.get('/appointments/');
    return response.data;
  }

  /**
   * Get appointment by ID
   */
  async getAppointment(appointmentId: number): Promise<Appointment> {
    const response = await apiClient.get(`/appointments/${appointmentId}`);
    return response.data;
  }

  /**
   * Get video room URL and token for an appointment
   */
  async getVideoRoomUrl(appointmentId: number): Promise<VideoRoomData> {
    const response = await apiClient.get(`/appointments/${appointmentId}/video-room`);
    return response.data;
  }

  /**
   * Reschedule an appointment
   */
  async rescheduleAppointment(
    appointmentId: string | number,
    data: AppointmentRescheduleRequest
  ): Promise<{ message: string; appointment: any }> {
    const payload: any = {
      appointment_date: data.appointment_date,
    };
    if (data.consultation_type) {
      payload.consultation_type = data.consultation_type;
    }
    if (data.appointment_type_id !== undefined) {
      payload.appointment_type_id = data.appointment_type_id;
    }
    if (data.notes) {
      payload.notes = data.notes;
    }
    const response = await apiClient.put(`/appointments/${appointmentId}`, payload);
    return response.data;
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId: string | number): Promise<void> {
    await apiClient.delete(`/appointments/${appointmentId}`);
  }

  /**
   * Update phone number for an appointment
   */
  async updateAppointmentPhone(appointmentId: string | number, phone: string): Promise<any> {
    const response = await apiClient.patch(`/appointments/${appointmentId}/phone`, {
      phone
    });
    return response.data;
  }

  /**
   * Create a new appointment via Acuity API
   */
  async bookAppointment(data: AppointmentBookRequest): Promise<any> {
    const response = await apiClient.post('/appointments/', data);
    return response.data;
  }
}

export const appointmentsApiService = new AppointmentsApiService();
export default appointmentsApiService;

