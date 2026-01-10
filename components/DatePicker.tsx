import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar as CalendarIcon, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface DatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  style?: any;
  error?: boolean;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  label,
  required = false,
  minimumDate,
  maximumDate,
  disabled = false,
  style,
  error = false,
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(
    value ? new Date(value + 'T00:00:00') : new Date()
  );

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selectedDate) {
        const dateStr = formatDate(selectedDate);
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
    onChange(dateStr);
    setShowPicker(false);
  };

  const handleCancel = () => {
    // Reset temp date to original value
    setTempDate(value ? new Date(value + 'T00:00:00') : new Date());
    setShowPicker(false);
  };

  return (
    <View style={style}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <TouchableOpacity
        style={[
          styles.dateInput,
          error && styles.dateInputError,
          disabled && styles.dateInputDisabled,
        ]}
        onPress={() => {
          if (!disabled) {
            setTempDate(value ? new Date(value + 'T00:00:00') : new Date());
            setShowPicker(true);
          }
        }}
        disabled={disabled}
      >
        <CalendarIcon size={20} color={disabled ? Colors.textLight : Colors.primary} />
        <Text style={[styles.dateText, !value && styles.placeholder, disabled && styles.disabledText]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      {/* Android DatePicker */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {/* iOS Modal with DatePicker */}
      {Platform.OS === 'ios' && showPicker && (
        <Modal
          visible={showPicker}
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
                <Text style={styles.modalTitle}>{label || 'Select Date'}</Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={[styles.modalButton, styles.modalButtonPrimary]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                textColor={Colors.text}
                style={styles.picker}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  required: {
    color: Colors.danger,
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
  },
  dateInputError: {
    borderColor: Colors.danger,
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

