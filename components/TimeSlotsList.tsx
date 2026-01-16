import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Colors from '@/constants/colors';
import { TimeSlot } from '@/lib/api/appointments-api';

interface TimeSlotsListProps {
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  onTimeSlotSelect: (slot: TimeSlot) => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function TimeSlotsList({
  timeSlots,
  selectedTimeSlot,
  onTimeSlotSelect,
  loading = false,
  disabled = false,
}: TimeSlotsListProps) {
  const formatTime = (timeSlot: TimeSlot): string => {
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

  const isTimeSlotSelected = (slot: TimeSlot): boolean => {
    if (!selectedTimeSlot) return false;
    
    // Compare by formatted time
    const slotTime = formatTime(slot);
    const selectedTime = formatTime(selectedTimeSlot);
    return slotTime === selectedTime || selectedTimeSlot === slot;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading time slots...</Text>
        </View>
      </View>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No time slots available for this date</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Select Time</Text>
      <View style={styles.timeSlotsGrid}>
        {timeSlots.map((slot, index) => {
          const isAvailable = slot.available !== undefined ? slot.available : true;
          const isSelected = isTimeSlotSelected(slot);
          const slotTime = formatTime(slot);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlotButton,
                isSelected && styles.timeSlotButtonSelected,
                !isAvailable && styles.timeSlotButtonDisabled,
              ]}
              onPress={() => onTimeSlotSelect(slot)}
              disabled={disabled || !isAvailable}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  isSelected && styles.timeSlotTextSelected,
                  !isAvailable && styles.timeSlotTextDisabled,
                ]}
              >
                {slotTime}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textLight,
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
  timeSlotsGrid: {
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
});
