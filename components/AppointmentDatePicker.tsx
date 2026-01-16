import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar as CalendarIcon, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import AppointmentCalendar from './AppointmentCalendar';

interface AppointmentDatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (date: string) => void;
  availableDates: string[]; // Array of dates in YYYY-MM-DD format
  onMonthChange?: (month: string) => void; // Format: YYYY-MM
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  minimumDate?: Date;
  loading?: boolean;
}

export default function AppointmentDatePicker({
  value,
  onChange,
  availableDates,
  onMonthChange,
  placeholder = 'Select date',
  label,
  disabled = false,
  minimumDate = new Date(),
  loading = false,
}: AppointmentDatePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(
    value ? new Date(value + 'T00:00:00') : new Date()
  );


  // Normalize available dates - extract date strings from objects if needed
  const normalizedAvailableDates = React.useMemo(() => {
    if (!availableDates || availableDates.length === 0) return [];
    
    return availableDates.map((item: any) => {
      if (typeof item === 'string') {
        return item;
      } else if (item && typeof item === 'object' && item.date) {
        return item.date;
      } else {
        return String(item);
      }
    }).filter(Boolean) as string[];
  }, [availableDates]);

  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateInputPress = () => {
    if (!disabled) {
      setTempDate(value ? new Date(value + 'T00:00:00') : new Date());
      setShowDatePicker(true);
    }
  };

  const handleDatePickerChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'set' && selectedDate) {
        const dateStr = formatDate(selectedDate);
        // Always allow selection - user might want to see times for that date
        onChange(dateStr);
      }
    } else {
      // iOS - update temp date, user confirms with Done button
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    const dateStr = formatDate(tempDate);
    // Always allow selection - user might want to see times for that date
    onChange(dateStr);
    setShowDatePicker(false);
  };

  const handleCancel = () => {
    setTempDate(value ? new Date(value + 'T00:00:00') : new Date());
    setShowDatePicker(false);
  };

  const handleDateSelect = (dateStr: string) => {
    onChange(dateStr);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      {/* Date Input */}
      <TouchableOpacity
        style={[
          styles.dateInput,
          disabled && styles.dateInputDisabled,
        ]}
        onPress={handleDateInputPress}
        disabled={disabled}
      >
        <CalendarIcon size={20} color={disabled ? Colors.textLight : Colors.primary} />
        <Text style={[styles.dateText, !value && styles.placeholder, disabled && styles.disabledText]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      {/* Android DatePicker */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleDatePickerChange}
          minimumDate={minimumDate}
        />
      )}

      {/* iOS Modal with DatePicker */}
      {Platform.OS === 'ios' && showDatePicker && (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.modalButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={[styles.modalButton, styles.modalButtonPrimary]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDatePickerChange}
                minimumDate={minimumDate}
                textColor={Colors.text}
                style={styles.picker}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Calendar - Show even if no dates yet (will show loading/unavailable) */}
      <View style={styles.calendarContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading available dates...</Text>
          </View>
        )}
        {!loading && availableDates.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No available dates found</Text>
          </View>
        )}
        <AppointmentCalendar
          selectedDate={value}
          availableDates={normalizedAvailableDates}
          onDateSelect={handleDateSelect}
          onMonthChange={onMonthChange}
          minimumDate={minimumDate}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 48,
    marginBottom: 16,
  },
  dateInputDisabled: {
    backgroundColor: Colors.secondary,
    opacity: 0.6,
  },
  dateText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  placeholder: {
    color: Colors.textLight,
  },
  disabledText: {
    color: Colors.textLight,
  },
  calendarContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalButton: {
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: '500',
  },
  modalButtonPrimary: {
    color: Colors.primary,
    fontWeight: '600',
  },
  picker: {
    width: '100%',
    height: 200,
  },
});
