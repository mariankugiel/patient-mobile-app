import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppointmentCalendarProps {
  selectedDate: string; // Format: YYYY-MM-DD
  availableDates: string[]; // Array of dates in YYYY-MM-DD format
  onDateSelect: (date: string) => void;
  onMonthChange?: (month: string) => void; // Format: YYYY-MM
  minimumDate?: Date;
  loading?: boolean;
}

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function AppointmentCalendar({
  selectedDate,
  availableDates,
  onDateSelect,
  onMonthChange,
  minimumDate = new Date(),
  loading = false,
}: AppointmentCalendarProps) {
  const { language } = useLanguage();
  
  // Get current month from selected date or use today
  const getCurrentMonth = () => {
    if (selectedDate) {
      const date = new Date(selectedDate + 'T00:00:00');
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  };

  const [currentMonth, setCurrentMonth] = React.useState<Date>(getCurrentMonth());

  // Update current month when selectedDate changes
  React.useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate + 'T00:00:00');
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }, [selectedDate]);

  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString(
      language === 'pt-PT' ? 'pt-PT' : language === 'es-ES' ? 'es-ES' : 'en-US',
      { month: 'long', year: 'numeric' }
    );
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newMonth);
    const monthStr = `${newMonth.getFullYear()}-${String(newMonth.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange?.(monthStr);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newMonth);
    const monthStr = `${newMonth.getFullYear()}-${String(newMonth.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange?.(monthStr);
  };

  // Get all days in the month
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const days: Array<{ date: Date | null; dateStr: string | null }> = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: null, dateStr: null });
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      // Ensure date is valid
      if (isNaN(date.getTime())) {
        continue;
      }
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ date, dateStr });
    }

    return days;
  };

  // Normalize available dates - handle both string arrays and object arrays
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
    }).filter(Boolean).map((dateStr: string) => {
      // Ensure YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch {
        return null;
      }
    }).filter(Boolean) as string[];
  }, [availableDates]);


  // Normalize date string to YYYY-MM-DD format
  const normalizeDateStr = (dateStr: string | null): string | null => {
    if (!dateStr) return null;
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    // Try to parse and format
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return null;
    }
  };

  // Check if date is available
  // Weekends (Saturday/Sunday) are treated exactly the same as weekdays
  // If a weekend date is in availableDates, it's available (dark text)
  // If not, it's unavailable (lighter text)
  const isDateAvailable = (dateStr: string | null): boolean => {
    if (!dateStr) return false;
    const normalizedDateStr = normalizeDateStr(dateStr);
    if (!normalizedDateStr) return false;
    
    // Use the pre-normalized available dates
    // No special handling for weekends - they're checked the same as any other date
    const isAvailable = normalizedAvailableDates.includes(normalizedDateStr);
    return isAvailable;
  };

  // Check if date is selected
  const isDateSelected = (dateStr: string | null): boolean => {
    if (!dateStr) return false;
    return selectedDate === dateStr;
  };

  // Check if date is today
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is disabled (before minimum date)
  const isDateDisabled = (date: Date | null): boolean => {
    if (!date) return true;
    const minDate = new Date(minimumDate);
    minDate.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < minDate;
  };

  // Format date string
  const formatDateStr = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const days = getDaysInMonth();
  const today = new Date();
  const canGoPrevious = currentMonth > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <View style={styles.container}>
      {/* Month Navigation */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goToPreviousMonth}
          disabled={!canGoPrevious || loading}
          style={[styles.navButton, (!canGoPrevious || loading) && styles.navButtonDisabled]}
        >
          <ChevronLeft size={20} color={(!canGoPrevious || loading) ? Colors.textLight : Colors.text} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{getMonthName(currentMonth)}</Text>
        <TouchableOpacity
          onPress={goToNextMonth}
          disabled={loading}
          style={[styles.navButton, loading && styles.navButtonDisabled]}
        >
          <ChevronRight size={20} color={loading ? Colors.textLight : Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Weekday Headers */}
      <View style={styles.weekdayContainer}>
        {weekdays.map((day, index) => (
          <View key={index} style={styles.weekdayHeader}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {days.map((day, index) => {
          if (!day.date) {
            return <View key={index} style={styles.dateCell} />;
          }

          const dateStr = day.dateStr!;
          // Use dateStr as key to ensure unique keys and proper rendering
          const uniqueKey = `date-${dateStr}-${index}`;
          const available = isDateAvailable(dateStr);
          const selected = isDateSelected(dateStr);
          const today = isToday(day.date);
          const disabled = isDateDisabled(day.date);
          
          // Weekends are treated the same as any other date
          // If they're in availableDates, they're available (dark text)
          // If not, they're unavailable (lighter text)
          // No special weekend styling

          return (
            <TouchableOpacity
              key={uniqueKey}
              style={styles.dateCell}
              onPress={() => {
                if (!disabled && available) {
                  onDateSelect(dateStr);
                }
              }}
              disabled={disabled || !available}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.dateCircle,
                  selected && styles.dateCircleSelected,
                  // Only show today border if it's today, not selected, and not available
                  today && !selected && !available && styles.dateCircleToday,
                ]}
              >
                <Text
                  style={[
                    styles.dateText, // Default: dark text for available dates
                    selected && styles.dateTextSelected, // White text when selected
                    !available && !selected && styles.dateTextUnavailable, // Lighter text for unavailable
                    disabled && styles.dateTextDisabled, // Disabled styling
                    // Only show today style if it's today, not selected, and not available
                    today && !selected && !available && styles.dateTextToday,
                  ]}
                >
                  {day.date.getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  weekdayContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayHeader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: '14.28%', // 7 columns
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    backgroundColor: 'transparent', // Ensure no rectangular background
    overflow: 'hidden', // Ensure circular shape is maintained
  },
  dateCircle: {
    width: 44,
    height: 44,
    borderRadius: 22, // Makes it circular (half of width/height)
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden', // Ensure circular shape is maintained
  },
  dateCircleSelected: {
    backgroundColor: Colors.primary,
    borderRadius: 22, // Explicitly set to ensure circular shape (half of 44)
    width: 44, // Ensure fixed width
    height: 44, // Ensure fixed height
    overflow: 'hidden', // Clip content to circle
  },
  dateCircleToday: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 22, // Ensure circular border
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  dateTextSelected: {
    color: Colors.background,
    fontWeight: '600',
  },
  dateTextUnavailable: {
    color: Colors.textLight,
    opacity: 0.5, // Same as disabled/past days - much lighter
  },
  dateTextDisabled: {
    color: Colors.textLight,
    opacity: 0.5,
  },
  dateTextToday: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
