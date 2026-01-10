import { useState, useCallback } from 'react';
import { appointmentsApiService, TimeSlot } from '@/lib/api/appointments-api';

export function useAvailability() {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [weeklyAvailability, setWeeklyAvailability] = useState<Record<string, TimeSlot[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAvailableDates = useCallback(async (
    calendarId: string,
    appointmentTypeId?: number,
    month?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const dates = await appointmentsApiService.getAvailabilityDates(calendarId, appointmentTypeId, month);
      setAvailableDates(dates);
      return dates;
    } catch (err: any) {
      setError(err.message || 'Failed to load available dates');
      setAvailableDates([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAvailableTimes = useCallback(async (
    calendarId: string,
    date: string,
    appointmentTypeId?: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      const times = await appointmentsApiService.getAvailabilityTimes(calendarId, date, appointmentTypeId);
      setAvailableTimes(times);
      return times;
    } catch (err: any) {
      setError(err.message || 'Failed to load available times');
      setAvailableTimes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWeeklyAvailability = useCallback(async (
    calendarId: string,
    startDate: string,
    appointmentTypeId?: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      const week = await appointmentsApiService.getAvailabilityWeek(calendarId, startDate, appointmentTypeId);
      setWeeklyAvailability(week);
      return week;
    } catch (err: any) {
      setError(err.message || 'Failed to load weekly availability');
      setWeeklyAvailability({});
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAvailableDates([]);
    setAvailableTimes([]);
    setWeeklyAvailability({});
    setError(null);
  }, []);

  return {
    availableDates,
    availableTimes,
    weeklyAvailability,
    loading,
    error,
    loadAvailableDates,
    loadAvailableTimes,
    loadWeeklyAvailability,
    reset,
  };
}

