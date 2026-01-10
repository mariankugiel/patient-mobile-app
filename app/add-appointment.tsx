import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, Video, Phone, Search, Check, X, Loader2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDoctors } from '@/hooks/useDoctors';
import { useAvailability } from '@/hooks/useAvailability';
import { useProfile } from '@/hooks/useProfile';
import { appointmentsApiService, Doctor, TimeSlot } from '@/lib/api/appointments-api';
import DatePicker from '@/components/DatePicker';

export default function AddAppointmentScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { profile } = useProfile();
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  
  // Selection states
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<{ id: string; name?: string; category?: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState('');
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
  
  // Load doctors on mount and when search/location changes
  useEffect(() => {
    resetDoctors();
    loadDoctors({ search: searchQuery, location: locationFilter, reset: true });
  }, [searchQuery, locationFilter]);
  
  // Load available dates when doctor and appointment type are selected
  useEffect(() => {
    if (selectedDoctor?.acuityCalendarId && selectedAppointmentType?.id) {
      const appointmentTypeId = parseInt(selectedAppointmentType.id, 10);
      loadAvailableDates(selectedDoctor.acuityCalendarId, appointmentTypeId);
    } else {
      resetAvailability();
      setSelectedDate('');
      setSelectedTimeSlot(null);
    }
  }, [selectedDoctor, selectedAppointmentType]);
  
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
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      Alert.alert(
        t.validationError || 'Error',
        error.message || 'Failed to book appointment. Please try again.'
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
  
  const formatTime = (timeSlot: TimeSlot) => {
    // Use displayTime if available (already formatted by API service)
    if (timeSlot.displayTime) {
      return timeSlot.displayTime;
    }
    
    // Use time field if it's already in HH:mm format
    if (timeSlot.time && !timeSlot.time.includes('T')) {
      const match = timeSlot.time.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        return `${match[1].padStart(2, '0')}:${match[2]}`;
      }
      return timeSlot.time;
    }
    
    // Try to extract from ISO datetime
    const isoString = timeSlot.isoTime || timeSlot.time || timeSlot.rawTime || '';
    if (isoString.includes('T')) {
      try {
        // Normalize timezone format (+0100 -> +01:00)
        const normalized = isoString.replace(/([+-])(\d{2})(\d{2})$/, '$1$2:$3');
        const date = new Date(normalized);
        if (!isNaN(date.getTime())) {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        }
      } catch (e) {
        // Fall through to regex
      }
      
      // Extract time using regex
      const match = isoString.match(/T(\d{2}):(\d{2})/);
      if (match) {
        return `${match[1]}:${match[2]}`;
      }
    }
    
    // Fallback: try to extract HH:mm from any string
    const match = isoString.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      return `${match[1].padStart(2, '0')}:${match[2]}`;
    }
    
    return '—';
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
        <Text style={styles.headerTitle}>{t.addAppointment || 'Book Appointment'}</Text>
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
        
        {/* Date Selection */}
        {selectedDoctor && selectedAppointmentType && (
          <>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <DatePicker
              value={selectedDate}
              onChange={(dateStr) => {
                setSelectedDate(dateStr);
                setSelectedTimeSlot(null);
              }}
              placeholder="Select date"
              label=""
              disabled={isBooking || loadingAvailability}
              minimumDate={new Date()}
            />
          </>
        )}
        
        {/* Time Selection */}
        {selectedDate && availableTimes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.timeSlotsContainer}>
              {availableTimes.map((slot, index) => {
                // Default to available if not specified
                const isAvailable = slot.available !== undefined ? slot.available : true;
                // Compare by formatted time for selection
                const slotTime = formatTime(slot);
                const selectedTime = selectedTimeSlot ? formatTime(selectedTimeSlot) : '';
                const isSelected = selectedTimeSlot === slot || slotTime === selectedTime;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeSlotButton,
                      isSelected && styles.timeSlotButtonSelected,
                      !isAvailable && styles.timeSlotButtonDisabled
                    ]}
                    onPress={() => setSelectedTimeSlot(slot)}
                    disabled={isBooking || !isAvailable}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      isSelected && styles.timeSlotTextSelected,
                      !isAvailable && styles.timeSlotTextDisabled
                    ]}>
                      {slotTime}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
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
              <Text style={styles.bookButtonText}>Booking...</Text>
            </>
          ) : (
            <Text style={styles.bookButtonText}>{t.appointmentsBookAppointment || 'Book Appointment'}</Text>
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
