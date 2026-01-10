import { useState, useEffect, useCallback } from 'react';
import { appointmentsApiService, Appointment, FrontendAppointment } from '@/lib/api/appointments-api';

/**
 * Transform backend appointment to frontend format
 */
const transformAppointment = (apt: Appointment): FrontendAppointment => {
  let appointmentStatus: 'upcoming' | 'completed' | 'cancelled' = 'upcoming';
  if (apt.frontend_status) {
    appointmentStatus = apt.frontend_status;
  } else {
    const statusUpper = apt.status?.toUpperCase() || '';
    if (statusUpper.includes('CANCELLED') || statusUpper.includes('CANCELED')) {
      appointmentStatus = 'cancelled';
    } else if (statusUpper === 'COMPLETED') {
      appointmentStatus = 'completed';
    } else {
      appointmentStatus = 'upcoming';
    }
  }

  let appointmentType: 'virtual' | 'in-person' | 'phone' = 'in-person';
  const consultationType = apt.consultation_type?.toLowerCase()?.trim();
  if (consultationType === 'virtual') {
    appointmentType = 'virtual';
  } else if (consultationType === 'phone') {
    appointmentType = 'phone';
  } else {
    appointmentType = 'in-person';
  }

  const appointmentTypeIdValue =
    apt.appointment_type_id !== undefined && apt.appointment_type_id !== null
      ? apt.appointment_type_id
      : null;

  const appointmentTypePriceValue =
    typeof apt.appointment_type_price === 'number'
      ? apt.appointment_type_price
      : apt.appointment_type_price != null
      ? Number(apt.appointment_type_price)
      : null;

  const costValue =
    typeof apt.cost === 'number'
      ? apt.cost
      : appointmentTypePriceValue !== null
      ? appointmentTypePriceValue
      : undefined;

  const amountPaidValue =
    typeof apt.amount_paid === 'number'
      ? apt.amount_paid
      : apt.amount_paid != null
      ? Number(apt.amount_paid)
      : null;

  return {
    id: apt.id.toString(),
    doctor: apt.doctor_name || `Dr. ${apt.professional_id}`,
    doctorId: apt.professional_id,
    specialty: apt.doctor_specialty || '',
    date: apt.appointment_date || apt.scheduled_at || apt.created_at,
    status: appointmentStatus,
    type: appointmentType,
    cost: costValue,
    amountPaid: amountPaidValue,
    virtual_meeting_url: apt.virtual_meeting_url,
    timezone: apt.timezone,
    acuityCalendarId: apt.acuity_calendar_id || null,
    confirmation_page: apt.confirmation_page || null,
    notes: apt.notes || '',
    appointmentTypeId: appointmentTypeIdValue !== null ? String(appointmentTypeIdValue) : null,
    appointmentTypeName: apt.appointment_type_name ?? null,
    appointmentTypeDuration:
      apt.appointment_type_duration !== undefined && apt.appointment_type_duration !== null
        ? Number(apt.appointment_type_duration)
        : null,
    appointmentTypePrice: appointmentTypePriceValue,
    phone: apt.phone || null,
    location: apt.location || null,
  };
};

export function useAppointments() {
  const [appointments, setAppointments] = useState<FrontendAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiAppointments = await appointmentsApiService.fetchAppointments();
      const transformed = apiAppointments.map(transformAppointment);
      setAppointments(transformed);
    } catch (err: any) {
      setError(err.message || 'Failed to load appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelAppointment = useCallback(async (appointmentId: string | number) => {
    try {
      await appointmentsApiService.cancelAppointment(appointmentId);
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId.toString()));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to cancel appointment');
    }
  }, []);

  const rescheduleAppointment = useCallback(
    async (appointmentId: string | number, data: {
      appointment_date: string;
      consultation_type?: string;
      appointment_type_id?: number;
      notes?: string;
    }) => {
      try {
        const result = await appointmentsApiService.rescheduleAppointment(appointmentId, data);
        // Reload appointments to get updated data
        await loadAppointments();
        return result;
      } catch (err: any) {
        throw new Error(err.message || 'Failed to reschedule appointment');
      }
    },
    [loadAppointments]
  );

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return {
    appointments,
    loading,
    error,
    cancelAppointment,
    rescheduleAppointment,
    refresh: loadAppointments,
  };
}

