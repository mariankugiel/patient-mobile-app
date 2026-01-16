import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, Video, Phone, Search, Check, X, Loader2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDoctors } from '@/hooks/useDoctors';
import { useAvailability } from '@/hooks/useAvailability';
import { useProfile } from '@/hooks/useProfile';
import { useAppointments } from '@/hooks/useAppointments';
import { appointmentsApiService, Doctor, TimeSlot } from '@/lib/api/appointments-api';
import AppointmentDatePicker from '@/components/AppointmentDatePicker';
import TimeSlotsList from '@/components/TimeSlotsList';

export default function AddAppointmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, language } = useLanguage();
  const { profile } = useProfile();
  
  // Check if this is a reschedule
  const isReschedule = !!params.rescheduleId;
  const rescheduleId = params.rescheduleId as string | undefined;
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  
  // Selection states
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<{ id: string; name?: string; category?: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(params.date as string || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState(params.notes as string || '');
  const [phone, setPhone] = useState('');
  
  // Modal states
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  
  // Loading and booking states
  const [isBooking, setIsBooking] = useState(false);
  const [loadingMoreDoctors, setLoadingMoreDoctors] = useState(false);
  
  // Hooks
  const { doctors, loading: loadingDoctors, error: doctorsError, hasMore, loadDoctors, reset: resetDoctors } = useDoctors();
  const { availableDates, availableTimes, loading: loadingAvailability, loadAvailableDates, loadAvailableTimes, reset: resetAvailability } = useAvailability();
  const { appointments, rescheduleAppointment } = useAppointments();
  
  // Load doctors on mount and when search/location changes
  useEffect(() => {
    resetDoctors();
    loadDoctors({ search: searchQuery, location: locationFilter, reset: true });
  }, [searchQuery, locationFilter]);

  // Pre-select doctor and appointment type when rescheduling
  useEffect(() => {
    if (isReschedule && params.doctorId && params.appointmentTypeId && doctors.length > 0) {
      // Find the doctor
      const doctor = doctors.find(d => d.id.toString() === params.doctorId);
      if (doctor && !selectedDoctor) {
        setSelectedDoctor(doctor);
      }
      
      // Set appointment type
      if (params.appointmentTypeId && !selectedAppointmentType) {
        setSelectedAppointmentType({ id: params.appointmentTypeId as string });
      }
    }
  }, [isReschedule, params.doctorId, params.appointmentTypeId, doctors, selectedDoctor, selectedAppointmentType]);
  
  // Current month for calendar (YYYY-MM format)
  const [currentMonth, setCurrentMonth] = useState<string>('');

  // Load available dates when doctor and appointment type are selected
  useEffect(() => {
    if (selectedDoctor?.acuityCalendarId && selectedAppointmentType?.id) {
      const appointmentTypeId = parseInt(selectedAppointmentType.id, 10);
      // Load current month's availability
      const today = new Date();
      const monthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      setCurrentMonth(monthStr);
      loadAvailableDates(selectedDoctor.acuityCalendarId, appointmentTypeId, monthStr);
    } else {
      resetAvailability();
      setSelectedDate('');
      setSelectedTimeSlot(null);
      setCurrentMonth('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoctor, selectedAppointmentType]);

  // Handle month change in calendar - fetch availability for new month
  const handleMonthChange = useCallback(async (month: string) => {
    if (selectedDoctor?.acuityCalendarId && selectedAppointmentType?.id && month !== currentMonth) {
      setCurrentMonth(month);
      const appointmentTypeId = parseInt(selectedAppointmentType.id, 10);
      await loadAvailableDates(selectedDoctor.acuityCalendarId, appointmentTypeId, month);
    }
  }, [selectedDoctor, selectedAppointmentType, currentMonth, loadAvailableDates]);
  
  // Load available times when date is selected
  useEffect(() => {
    if (selectedDoctor?.acuityCalendarId && selectedDate && selectedAppointmentType?.id) {
      const appointmentTypeId = parseInt(selectedAppointmentType.id, 10);
      loadAvailableTimes(selectedDoctor.acuityCalendarId, selectedDate, appointmentTypeId);
    } else {
      setSelectedTimeSlot(null);
    }
  }, [selectedDoctor, selectedDate, selectedAppointmentType]);
  
  // Get user info for booking
  const getUserInfo = () => {
    const email = profile?.email || '';
    const fullName = profile?.full_name || '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    return { email, firstName, lastName };
  };
  
  // Build ISO datetime from date and time slot
  const buildDateTimeISO = (date: string, timeSlot: TimeSlot): string => {
    if (timeSlot.isoTime) {
      return timeSlot.isoTime;
    }
    if (timeSlot.rawTime) {
      // Try to parse rawTime
      if (timeSlot.rawTime.includes('T')) {
        return timeSlot.rawTime;
      }
      // Build from time string like "14:30"
      const match = timeSlot.rawTime.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        const hours = match[1].padStart(2, '0');
        const minutes = match[2];
        return `${date}T${hours}:${minutes}:00`;
      }
    }
    // Fallback: use time field
    if (timeSlot.time) {
      const match = timeSlot.time.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        const hours = match[1].padStart(2, '0');
        const minutes = match[2];
        return `${date}T${hours}:${minutes}:00`;
      }
    }
    return `${date}T12:00:00`; // Default fallback
  };
  
  const handleBookAppointment = async () => {
    // Validation
    if (!selectedDoctor) {
      Alert.alert(t.validationError || 'Error', 'Please select a doctor');
      return;
    }
    
    if (!selectedAppointmentType) {
      Alert.alert(t.validationError || 'Error', 'Please select an appointment type');
      return;
    }
    
    if (!selectedDate) {
      Alert.alert(t.validationError || 'Error', 'Please select a date');
      return;
    }
    
    if (!selectedTimeSlot) {
      Alert.alert(t.validationError || 'Error', 'Please select a time');
      return;
    }
    
    // Validate phone for phone appointments
    const isPhoneCategory = selectedAppointmentType.category?.toLowerCase() === 'phone';
    if (isPhoneCategory && !phone.trim()) {
      Alert.alert(t.validationError || 'Error', 'Please provide a phone number for phone appointments');
      return;
    }
    
    // Get user info
    const { email, firstName, lastName } = getUserInfo();
    
    if (!email) {
      Alert.alert(t.validationError || 'Error', 'User email not found. Please update your profile.');
      return;
    }
    
    if (!lastName || lastName.trim() === '') {
      Alert.alert(t.validationError || 'Error', 'Please complete your profile with your full name');
      return;
    }
    
    setIsBooking(true);
    
    try {
      const datetimeISO = buildDateTimeISO(selectedDate, selectedTimeSlot);
      const appointmentTypeId = parseInt(selectedAppointmentType.id, 10);
      
      if (isReschedule && rescheduleId) {
        // Reschedule existing appointment
        await rescheduleAppointment(rescheduleId, {
          appointment_date: datetimeISO,
          appointment_type_id: appointmentTypeId || undefined,
          notes: notes.trim() || undefined,
        });
        
        Alert.alert(
          t.success || 'Success',
          'Appointment rescheduled successfully!',
          [
            {
              text: t.confirm || 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        // Book new appointment
        const appointmentData = {
          calendar_id: selectedDoctor.acuityCalendarId || '',
          appointment_type_id: appointmentTypeId || undefined,
          datetime: datetimeISO,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: isPhoneCategory ? phone.trim() : undefined,
          note: notes.trim() || undefined,
          timezone: selectedDoctor.timezone || undefined,
        };
        
        await appointmentsApiService.bookAppointment(appointmentData);
        
        Alert.alert(
          t.success || 'Success',
          'Appointment booked successfully!',
          [
            {
              text: t.confirm || 'OK',
              onPress: () => router.back()
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('Error booking/rescheduling appointment:', error);
      Alert.alert(
        t.validationError || 'Error',
        error.message || (isReschedule ? 'Failed to reschedule appointment. Please try again.' : 'Failed to book appointment. Please try again.')
      );
    } finally {
      setIsBooking(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const locale = language === 'pt-PT' ? 'pt-PT' : language === 'es-ES' ? 'es-ES' : 'en-US';
      return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };
  
  const getAppointmentTypeIcon = (category?: string) => {
    const cat = category?.toLowerCase() || '';
    if (cat === 'virtual') {
      return <Video size={20} color={Colors.primary} />;
    } else if (cat === 'phone') {
      return <Phone size={20} color={Colors.primary} />;
    }
    return <MapPin size={20} color={Colors.primary} />;
  };
  
  const getAppointmentTypeText = (category?: string) => {
    const cat = category?.toLowerCase() || '';
    if (cat === 'virtual') {
      return t.byVideo || 'Video';
    } else if (cat === 'phone') {
      return t.byPhone || 'Phone';
    }
    return t.inPerson || 'In Person';
  };
  
  const loadMoreDoctors = async () => {
    if (hasMore && !loadingMoreDoctors) {
      setLoadingMoreDoctors(true);
      try {
        await loadDoctors({ search: searchQuery, location: locationFilter, reset: false });
      } finally {
        setLoadingMoreDoctors(false);
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isBooking}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isReschedule ? (t.rescheduleAppointment || 'Reschedule Appointment') : (t.addAppointment || 'Book Appointment')}
        </Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
            <Search size={20} color={Colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search doctors..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              editable={!isBooking}
            />
          </View>
        </View>
        
        {/* Doctors Section */}
        <Text style={styles.sectionTitle}>Select Doctor</Text>
        {loadingDoctors && doctors.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>{t.loading || 'Loading doctors...'}</Text>
          </View>
        ) : doctorsError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{doctorsError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadDoctors({ reset: true })}>
              <Text style={styles.retryButtonText}>{t.retry || 'Retry'}</Text>
            </TouchableOpacity>
          </View>
        ) : doctors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No doctors found</Text>
          </View>
        ) : (
          <View style={styles.doctorsContainer}>
            {doctors.map((doctor) => (
              <TouchableOpacity
                key={doctor.id}
                style={[
                  styles.doctorCard,
                  selectedDoctor?.id === doctor.id && styles.doctorCardSelected
                ]}
                onPress={() => {
                  setSelectedDoctor(doctor);
                  setSelectedAppointmentType(null);
                  setSelectedDate('');
                  setSelectedTimeSlot(null);
                }}
                disabled={isBooking}
              >
                {doctor.avatar && (
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                      {doctor.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  {doctor.specialty && (
                    <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                  )}
                  {doctor.address && (
                    <View style={styles.doctorLocation}>
                      <MapPin size={14} color={Colors.textLight} />
                      <Text style={styles.doctorLocationText}>{doctor.address}</Text>
                    </View>
                  )}
                </View>
                {selectedDoctor?.id === doctor.id && (
                  <Check size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            
            {hasMore && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={loadMoreDoctors}
                disabled={loadingMoreDoctors}
              >
                {loadingMoreDoctors ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Text style={styles.loadMoreText}>Load More</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {/* Appointment Type Selection */}
        {selectedDoctor && selectedDoctor.appointmentTypes && selectedDoctor.appointmentTypes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Select Appointment Type</Text>
            <View style={styles.appointmentTypesContainer}>
              {selectedDoctor.appointmentTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.appointmentTypeCard,
                    selectedAppointmentType?.id === type.id && styles.appointmentTypeCardSelected
                  ]}
                  onPress={() => {
                    setSelectedAppointmentType(type);
                    setSelectedDate('');
                    setSelectedTimeSlot(null);
                  }}
                  disabled={isBooking}
                >
                  {getAppointmentTypeIcon(type.category)}
                  <View style={styles.appointmentTypeInfo}>
                    <Text style={styles.appointmentTypeName}>{type.name || getAppointmentTypeText(type.category)}</Text>
                    {type.duration && (
                      <Text style={styles.appointmentTypeDuration}>{type.duration} min</Text>
                    )}
                    {type.price && (
                      <Text style={styles.appointmentTypePrice}>${type.price}</Text>
                    )}
                  </View>
                  {selectedAppointmentType?.id === type.id && (
                    <Check size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        
        {/* Date Selection with Calendar */}
        {selectedDoctor && selectedAppointmentType && (
          <>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <AppointmentDatePicker
              value={selectedDate}
              onChange={(dateStr) => {
                setSelectedDate(dateStr);
                setSelectedTimeSlot(null);
              }}
              availableDates={availableDates}
              onMonthChange={handleMonthChange}
              placeholder="Select date"
              label=""
              disabled={isBooking || loadingAvailability}
              loading={loadingAvailability}
              minimumDate={new Date()}
            />
          </>
        )}
        
        {/* Time Selection - Appears below calendar when date is selected */}
        {selectedDate && (
          <TimeSlotsList
            timeSlots={availableTimes}
            selectedTimeSlot={selectedTimeSlot}
            onTimeSlotSelect={setSelectedTimeSlot}
            loading={loadingAvailability}
            disabled={isBooking}
          />
        )}
        
        {/* Phone Number (for phone appointments) */}
        {selectedAppointmentType?.category?.toLowerCase() === 'phone' && (
          <>
            <Text style={styles.sectionTitle}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!isBooking}
            />
          </>
        )}
        
        {/* Notes */}
        <Text style={styles.sectionTitle}>{t.notes || 'Notes'} (Optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Add any notes or questions..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          editable={!isBooking}
        />
        
        {/* Book Button */}
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedDoctor || !selectedAppointmentType || !selectedDate || !selectedTimeSlot || isBooking) && styles.bookButtonDisabled
          ]}
          onPress={handleBookAppointment}
          disabled={!selectedDoctor || !selectedAppointmentType || !selectedDate || !selectedTimeSlot || isBooking}
        >
          {isBooking ? (
            <>
              <ActivityIndicator size="small" color={Colors.background} />
              <Text style={styles.bookButtonText}>
                {isReschedule ? 'Rescheduling...' : 'Booking...'}
              </Text>
            </>
          ) : (
            <Text style={styles.bookButtonText}>
              {isReschedule ? (t.rescheduleAppointment || 'Reschedule') : (t.appointmentsBookAppointment || 'Book Appointment')}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    marginTop: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textLight,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 14,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.background,
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  doctorsContainer: {
    gap: 12,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  doctorCardSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primary + '10',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.background,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  doctorLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  doctorLocationText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  loadMoreButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  appointmentTypesContainer: {
    gap: 12,
  },
  appointmentTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  appointmentTypeCardSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primary + '10',
  },
  appointmentTypeInfo: {
    flex: 1,
  },
  appointmentTypeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  appointmentTypeDuration: {
    fontSize: 14,
    color: Colors.textLight,
  },
  appointmentTypePrice: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.secondary,
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  timeSlotButtonDisabled: {
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
  timeSlotText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: Colors.background,
    fontWeight: 'bold',
  },
  timeSlotTextDisabled: {
    color: Colors.textLight,
    opacity: 0.5,
  },
  timeSlotsLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  timeSlotsLoadingText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  noTimeSlotsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noTimeSlotsText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  input: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 48,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    marginTop: 32,
    gap: 8,
  },
  bookButtonDisabled: {
    backgroundColor: Colors.primary,
    opacity: 0.5,
  },
  bookButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
