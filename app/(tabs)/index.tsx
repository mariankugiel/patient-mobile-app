import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Header from '@/components/Header';
import ProgressRing from '@/components/ProgressRing';
import ProgressBar from '@/components/ProgressBar';
import ActivityItem from '@/components/ActivityItem';
import SectionHeader from '@/components/SectionHeader';
import AiInsight from '@/components/AiInsight';
import LineChartComponent from '@/components/LineChartComponent';
import Colors from '@/constants/colors';
import { 
  patientData, 
  healthMetrics, 
  healthPlanProgress, 
  medications, 
  appointments, 
  aiHealthInsight,
  healthPlanInsight,
  vitalSigns,
  bloodTestResults,
  bodyMetrics
} from '@/constants/patient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

// Define health plan activities to match the ones in plans.tsx
interface HealthPlanActivity {
  id: number;
  name: string;
  frequency: string;
  duration?: string;
  time?: string;
  completed?: boolean;
  date?: string;
  code?: string;
  goalId?: number;
}

// Updated health plan activities to match the ones in plans.tsx
const healthPlanActivities: HealthPlanActivity[] = [
  {
    id: 1,
    code: "A1",
    name: "Caminhada diária",
    frequency: "Diariamente",
    duration: "30 minutos",
    time: "07:00",
    completed: false,
    goalId: 1
  },
  {
    id: 2,
    code: "A2",
    name: "Reduzir consumo de gorduras saturadas",
    frequency: "Diariamente",
    time: "Durante o dia",
    completed: false,
    goalId: 1
  },
  {
    id: 3,
    code: "A3",
    name: "Aumentar consumo de fibras",
    frequency: "Semanalmente",
    duration: "Durante o dia",
    time: "Refeições",
    completed: false,
    goalId: 1
  },
  {
    id: 4,
    code: "B1",
    name: "Reduzir consumo de sal",
    frequency: "Diariamente",
    duration: "Durante o dia",
    time: "Refeições",
    completed: false,
    goalId: 2
  },
  {
    id: 5,
    code: "B2",
    name: "Praticar técnicas de relaxamento",
    frequency: "Diariamente",
    duration: "15 minutos",
    time: "21:00",
    completed: false,
    goalId: 2
  }
];

// Mock lifestyle data
const lifestyleData = {
  currentWeek: {
    sleep: {
      average: 7.2, // hours
      goal: 8, // hours
      progress: 90 // percentage of goal
    },
    activity: {
      steps: 8500,
      goal: 10000,
      progress: 85 // percentage of goal
    },
    combined: 87 // combined lifestyle score
  },
  previousWeek: {
    sleep: {
      average: 6.8,
      goal: 8,
      progress: 85
    },
    activity: {
      steps: 7800,
      goal: 10000,
      progress: 78
    },
    combined: 82
  }
};

// Storage keys - using the same keys as in plans.tsx for synchronization
const TASKS_STORAGE_KEY = '@health_app_tasks';
const COMPLETED_DAYS_STORAGE_KEY = '@health_app_completed_days';

// Date utility functions
const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

const formatDateFull = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
};

const formatWeekday = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3);
};

const formatDay = (date: Date): string => {
  return date.getDate().toString();
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Generate dates for the date picker
const generateDates = (selectedDate: Date, daysCount: number = 7): Date[] => {
  const dates: Date[] = [];
  const startDate = new Date(selectedDate);
  startDate.setDate(startDate.getDate() - Math.floor(daysCount / 2));
  
  for (let i = 0; i < daysCount; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

// Generate weeks for the week slider
const generateWeeks = (currentWeek: Date, weeksCount: number = 5): Date[] => {
  const weeks: Date[] = [];
  const startWeek = new Date(currentWeek);
  startWeek.setDate(startWeek.getDate() - (7 * Math.floor(weeksCount / 2)));
  
  for (let i = 0; i < weeksCount; i++) {
    const week = new Date(startWeek);
    week.setDate(startWeek.getDate() + (i * 7));
    weeks.push(week);
  }
  
  return weeks;
};

// Format week range (e.g., "10-16 Mai")
const formatWeekRange = (weekStart: Date): string => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const month = weekEnd.toLocaleDateString('pt-BR', { month: 'short' }).slice(0, 3);
  
  return `${startDay}-${endDay} ${month}`;
};

export default function DashboardScreen() {
  const router = useRouter();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [dates, setDates] = useState(generateDates(today));
  const dateListRef = useRef<FlatList>(null);
  
  // Week selection for Esta semana section
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
  const [selectedWeek, setSelectedWeek] = useState(currentWeekStart);
  const [weeks, setWeeks] = useState(generateWeeks(currentWeekStart));
  const weekListRef = useRef<FlatList>(null);
  
  // State for tracking completion status
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});
  const [completedMedications, setCompletedMedications] = useState<Record<string, boolean>>({});
  const [completedDays, setCompletedDays] = useState<Record<string, number[]>>({});

  // Calculate activity completion percentages
  const [dailyActivityProgress, setDailyActivityProgress] = useState(0);
  const [weeklyActivityProgress, setWeeklyActivityProgress] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [completedActivitiesCount, setCompletedActivitiesCount] = useState(0);

  // Update dates when selected date changes
  useEffect(() => {
    setDates(generateDates(selectedDate));
  }, [selectedDate]);

  // Scroll to selected date in date picker
  useEffect(() => {
    if (dateListRef.current) {
      const index = dates.findIndex(date => isSameDay(date, selectedDate));
      if (index !== -1) {
        dateListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5
        });
      }
    }
  }, [dates, selectedDate]);

  // Scroll to selected week in week slider
  useEffect(() => {
    if (weekListRef.current) {
      const index = weeks.findIndex(week => 
        week.getFullYear() === selectedWeek.getFullYear() && 
        week.getMonth() === selectedWeek.getMonth() && 
        week.getDate() === selectedWeek.getDate()
      );
      if (index !== -1) {
        weekListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5
        });
      }
    }
  }, [weeks, selectedWeek]);

  // Load task completion status from storage
  const loadTasksFromStorage = useCallback(async () => {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      const completedDaysJson = await AsyncStorage.getItem(COMPLETED_DAYS_STORAGE_KEY);
      
      if (tasksJson) {
        const tasksData = JSON.parse(tasksJson);
        
        // Update completed activities based on stored data
        const updatedActivities: Record<string, boolean> = {};
        healthPlanActivities.forEach(activity => {
          updatedActivities[activity.id.toString()] = tasksData[activity.id] || false;
        });
        
        setCompletedActivities(updatedActivities);
        
        // Update completed medications based on stored data
        const updatedMedications: Record<string, boolean> = {};
        medications.forEach(medication => {
          updatedMedications[medication.id.toString()] = tasksData[medication.id] || false;
        });
        
        setCompletedMedications(updatedMedications);
      }
      
      if (completedDaysJson) {
        const completedDaysData = JSON.parse(completedDaysJson);
        setCompletedDays(completedDaysData);
      }
    } catch (error) {
      console.error('Failed to load tasks from storage', error);
    }
  }, []);

  // Load tasks when component mounts
  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  // Reload tasks when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTasksFromStorage();
      return () => {};
    }, [loadTasksFromStorage])
  );

  // Calculate activity progress whenever completed activities change
  useEffect(() => {
    // Get daily activities for the selected date
    const dailyActivities = filterActivitiesForSelectedDay();
    const totalDailyActivities = dailyActivities.planActivities.length + dailyActivities.medications.length;
    
    if (totalDailyActivities === 0) {
      setDailyActivityProgress(0);
    } else {
      // Count completed activities
      const completedDailyCount = Object.values(completedActivities).filter(Boolean).length + 
                                 Object.values(completedMedications).filter(Boolean).length;
      
      // Calculate percentage
      const dailyPercentage = Math.round((completedDailyCount / totalDailyActivities) * 100);
      setDailyActivityProgress(dailyPercentage);
    }
    
    // For weekly progress, we'll use a simplified calculation for demo
    // In a real app, you'd track completion across the whole week
    const totalWeeklyActivities = healthPlanActivities.length + medications.length;
    const completedWeeklyCount = Object.values(completedActivities).filter(Boolean).length + 
                                Object.values(completedMedications).filter(Boolean).length;
    
    setTotalActivities(totalWeeklyActivities);
    setCompletedActivitiesCount(completedWeeklyCount);
    
    const weeklyPercentage = Math.round(
      (completedWeeklyCount / totalWeeklyActivities) * 100
    );
    setWeeklyActivityProgress(weeklyPercentage);
    
  }, [completedActivities, completedMedications, selectedDate]);

  // Save task completion status to storage
  const saveTasksToStorage = async (updatedActivities: Record<string, boolean>, updatedMedications: Record<string, boolean>) => {
    try {
      // Combine activities and medications into a single map
      const tasksMap: Record<string, boolean> = {
        ...updatedActivities,
        ...updatedMedications
      };
      
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksMap));
      
      // Also update completedDays if needed
      if (Object.keys(completedDays).length > 0) {
        await AsyncStorage.setItem(COMPLETED_DAYS_STORAGE_KEY, JSON.stringify(completedDays));
      }
    } catch (error) {
      console.error('Failed to save tasks to storage', error);
    }
  };

  // Toggle completion status for activities
  const toggleActivityCompletion = (id: number) => {
    const updatedActivities = {
      ...completedActivities,
      [id.toString()]: !completedActivities[id.toString()]
    };
    
    // Update completedDays for this activity
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
    const activityId = id.toString();
    
    let updatedCompletedDays = { ...completedDays };
    
    if (!updatedCompletedDays[activityId]) {
      updatedCompletedDays[activityId] = [];
    }
    
    // If activity is now completed, add today to completedDays if not already there
    if (updatedActivities[activityId]) {
      if (!updatedCompletedDays[activityId].includes(dayOfWeek)) {
        updatedCompletedDays[activityId] = [...updatedCompletedDays[activityId], dayOfWeek];
      }
    } 
    // If activity is now uncompleted, remove today from completedDays
    else {
      updatedCompletedDays[activityId] = updatedCompletedDays[activityId].filter(day => day !== dayOfWeek);
    }
    
    setCompletedDays(updatedCompletedDays);
    setCompletedActivities(updatedActivities);
    
    // Save both to storage
    saveTasksToStorage(updatedActivities, completedMedications);
    AsyncStorage.setItem(COMPLETED_DAYS_STORAGE_KEY, JSON.stringify(updatedCompletedDays));
  };

  // Toggle completion status for medications
  const toggleMedicationCompletion = (id: number) => {
    const updatedMedications = {
      ...completedMedications,
      [id.toString()]: !completedMedications[id.toString()]
    };
    
    // Update completedDays for this medication
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
    const medicationId = id.toString();
    
    let updatedCompletedDays = { ...completedDays };
    
    if (!updatedCompletedDays[medicationId]) {
      updatedCompletedDays[medicationId] = [];
    }
    
    // If medication is now completed, add today to completedDays if not already there
    if (updatedMedications[medicationId]) {
      if (!updatedCompletedDays[medicationId].includes(dayOfWeek)) {
        updatedCompletedDays[medicationId] = [...updatedCompletedDays[medicationId], dayOfWeek];
      }
    } 
    // If medication is now uncompleted, remove today from completedDays
    else {
      updatedCompletedDays[medicationId] = updatedCompletedDays[medicationId].filter(day => day !== dayOfWeek);
    }
    
    setCompletedDays(updatedCompletedDays);
    setCompletedMedications(updatedMedications);
    
    // Save both to storage
    saveTasksToStorage(completedActivities, updatedMedications);
    AsyncStorage.setItem(COMPLETED_DAYS_STORAGE_KEY, JSON.stringify(updatedCompletedDays));
  };

  // Calculate metabolic age
  const calculateMetabolicAge = () => {
    const weight = patientData.weight; // in kg
    const height = patientData.height; // in cm
    const gender = patientData.gender || 'female'; // default to female if not specified
    const age = patientData.age;
    
    // Get fat mass percentage from body metrics
    const fatMassPercentage = bodyMetrics.find(m => m.name === "Massa Gorda")?.value || 24;
    
    let metabolicAge;
    if (gender === 'male') {
      // Formula for male
      metabolicAge = Math.round((88.362 + 13.397 * weight + 4.799 * height - (370 + 21.6 * (1 - fatMassPercentage / 100) * weight)) / 5.677);
    } else {
      // Formula for female
      metabolicAge = Math.round((447.593 + 9.247 * weight + 3.098 * height - (370 + 21.6 * (1 - fatMassPercentage / 100) * weight)) / 4.33);
    }
    
    return {
      value: metabolicAge,
      status: metabolicAge < age ? 'good' : 'warning',
      difference: age - metabolicAge
    };
  };

  const metabolicAge = calculateMetabolicAge();

  // Get the latest metrics for chart display with proper type handling
  const latestMetrics = [
    // Heart rate
    {
      ...(healthMetrics.find(m => m.name === "Frequência Cardíaca") || {
        id: 0,
        name: "Frequência Cardíaca",
        value: 0,
        unit: "bpm",
        reference: "60-100",
        status: "normal",
        date: "",
        icon: "heart",
        trend: "stable"
      }),
      data: vitalSigns.find(v => v.name === "Frequência Cardíaca")?.data || []
    },
    // Glucose
    {
      ...(healthMetrics.find(m => m.name === "Glicose") || {
        id: 0,
        name: "Glicose",
        value: 0,
        unit: "mg/dL",
        reference: "70-99",
        status: "normal",
        date: "",
        icon: "droplet",
        trend: "stable"
      }),
      data: bloodTestResults.biochemistry.find(b => b.name === "Glicose")?.data || []
    },
    // Blood pressure
    {
      ...(healthMetrics.find(m => m.name === "Pressão Arterial") || {
        id: 0,
        name: "Pressão Arterial",
        value: 0,
        unit: "mmHg",
        reference: "120/80",
        status: "normal",
        date: "",
        icon: "activity",
        trend: "stable"
      }),
      data: vitalSigns.find(v => v.name === "Pressão Arterial")?.data || []
    }
  ];

  // Format data for charts
  const formatChartData = (metric: any) => {
    if (!metric || !metric.data) return [];
    return metric.data.map((d: any) => ({
      date: d.date,
      value: d.value
    }));
  };

  // Filter activities for selected day
  const filterActivitiesForSelectedDay = () => {
    // Helper function to check if an activity should be shown on the selected day
    const shouldShowActivity = (frequency: string): boolean => {
      const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
      
      if (frequency.toLowerCase().includes('diariamente')) {
        return true;
      }
      
      if (frequency.includes('3x por semana')) {
        // Assume Monday, Wednesday, Friday
        return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
      }
      
      if (frequency.includes('2x por semana')) {
        // Assume Tuesday, Thursday
        return dayOfWeek === 2 || dayOfWeek === 4;
      }
      
      if (frequency.includes('2x por dia')) {
        return true;
      }
      
      return false;
    };
    
    // Filter medications for selected day
    const dayMedications = medications.filter(med => {
      // For simplicity, show all medications with a time property
      return med.time !== undefined;
    });
    
    // Filter appointments for selected day
    const dayAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return isSameDay(appointmentDate, selectedDate) && 
             appointment.status === 'upcoming';
    });
    
    // Get health plan activities for selected day
    const dayPlanActivities = healthPlanActivities.filter((activity: HealthPlanActivity) => {
      return shouldShowActivity(activity.frequency);
    });
    
    return {
      medications: dayMedications,
      appointments: dayAppointments,
      planActivities: dayPlanActivities
    };
  };

  const dailyActivities = filterActivitiesForSelectedDay();

  // Navigate to previous day
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const prevWeek = new Date(selectedWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setSelectedWeek(prevWeek);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const nextWeek = new Date(selectedWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedWeek(nextWeek);
  };

  // Calculate lifestyle comparison with previous week
  const calculateLifestyleComparison = () => {
    const currentScore = lifestyleData.currentWeek.combined;
    const previousScore = lifestyleData.previousWeek.combined;
    
    return {
      value: Math.round(((currentScore - previousScore) / previousScore) * 100),
      label: "vs semana anterior"
    };
  };

  // Render date item for date picker
  const renderDateItem = ({ item }: { item: Date }) => {
    const isSelected = isSameDay(item, selectedDate);
    const isToday = isSameDay(item, today);
    
    return (
      <TouchableOpacity
        style={[
          styles.dateItem,
          isSelected && styles.selectedDateItem,
          isToday && styles.todayDateItem
        ]}
        onPress={() => setSelectedDate(item)}
      >
        <Text style={[
          styles.dateWeekday,
          isSelected && styles.selectedDateText
        ]}>
          {formatWeekday(item)}
        </Text>
        <Text style={[
          styles.dateDay,
          isSelected && styles.selectedDateText,
          isToday && styles.todayDateText
        ]}>
          {formatDay(item)}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render week item for week slider
  const renderWeekItem = ({ item }: { item: Date }) => {
    const isSelected = 
      item.getFullYear() === selectedWeek.getFullYear() && 
      item.getMonth() === selectedWeek.getMonth() && 
      item.getDate() === selectedWeek.getDate();
    
    const isCurrentWeek = 
      item.getFullYear() === currentWeekStart.getFullYear() && 
      item.getMonth() === currentWeekStart.getMonth() && 
      item.getDate() === currentWeekStart.getDate();
    
    return (
      <TouchableOpacity
        style={[
          styles.weekItem,
          isSelected && styles.selectedWeekItem,
          isCurrentWeek && styles.currentWeekItem
        ]}
        onPress={() => setSelectedWeek(item)}
      >
        <Text style={[
          styles.weekText,
          isSelected && styles.selectedWeekText
        ]}>
          {formatWeekRange(item)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Health Summary Title */}
          <Text style={styles.sectionTitleBlack}>Resumo de saúde - estado atual e progresso</Text>
          
          {/* Health Score Rings */}
          <View style={styles.ringsContainer}>
            <ProgressRing 
              size={120} 
              progress={patientData.healthScore} 
              label="Saúde Geral" 
              value={patientData.healthScore} 
              color={Colors.primary}
            />
            <ProgressRing 
              size={120} 
              progress={weeklyActivityProgress} 
              label="Status semana" 
              value={completedActivitiesCount}
              subValue={`em ${totalActivities} planeadas`}
              color={Colors.primaryDark}
            />
          </View>

          {/* Esta semana Section */}
          <SectionHeader 
            title="Esta semana" 
            showViewAll={false}
          />
          
          {/* Week Selector */}
          <View style={styles.weekPickerContainer}>
            <TouchableOpacity 
              style={styles.weekNavButton} 
              onPress={goToPreviousWeek}
            >
              <ChevronLeft size={20} color={Colors.primary} />
            </TouchableOpacity>
            
            <FlatList
              ref={weekListRef}
              data={weeks}
              renderItem={renderWeekItem}
              keyExtractor={(item) => formatDateShort(item)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.weekList}
              initialScrollIndex={weeks.findIndex(week => 
                week.getFullYear() === selectedWeek.getFullYear() && 
                week.getMonth() === selectedWeek.getMonth() && 
                week.getDate() === selectedWeek.getDate()
              )}
              onScrollToIndexFailed={() => {}}
            />
            
            <TouchableOpacity 
              style={styles.weekNavButton} 
              onPress={goToNextWeek}
            >
              <ChevronRight size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          {/* Esta semana Rings */}
          <View style={styles.weeklyRingsContainer}>
            <ProgressRing 
              size={120} 
              progress={weeklyActivityProgress} 
              label="Atividades" 
              value={completedActivitiesCount}
              subValue={`em ${totalActivities} planeadas`}
              color={Colors.primary}
            />
            <ProgressRing 
              size={120} 
              progress={lifestyleData.currentWeek.combined} 
              label="Lifestyle" 
              value={lifestyleData.currentWeek.combined} 
              color={Colors.success}
              comparison={calculateLifestyleComparison()}
            />
          </View>

          {/* AI Health Insight */}
          <AiInsight insight={aiHealthInsight} />

          {/* Latest Metrics */}
          <SectionHeader 
            title="Últimas Medições" 
            onPress={() => router.push('/(tabs)/records')}
          />
          <View style={styles.chartsContainer}>
            {latestMetrics.map((metric, index) => (
              <View key={`metric-chart-${index}`} style={styles.chartCard}>
                <Text style={styles.chartTitle}>{metric.name}</Text>
                <LineChartComponent 
                  data={formatChartData(metric)}
                  referenceValue={metric.reference}
                  width={screenWidth - 48}
                  height={150}
                  color={metric.status === "normal" ? Colors.success : Colors.warning}
                  isDoubleValue={metric.name === "Pressão Arterial"}
                  showAxis={true}
                />
                <View style={styles.chartFooter}>
                  <Text style={styles.chartValue}>
                    {metric.value} <Text style={styles.chartUnit}>{metric.unit}</Text>
                  </Text>
                  <Text style={styles.chartReference}>Ref: {metric.reference}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Health Plan Progress */}
          <SectionHeader 
            title="Plano de Saúde" 
            onPress={() => router.push('/(tabs)/plans')}
          />
          <AiInsight insight={healthPlanInsight} />
          <View style={styles.progressContainer}>
            {healthPlanProgress.map((progress) => (
              <ProgressBar
                key={progress.id}
                progress={progress.progress}
                goal={progress.goal}
                target={progress.target}
                current={progress.current}
              />
            ))}
          </View>

          {/* Metabolic Age Card - Moved here after Health Plan */}
          <View style={styles.metabolicAgeCard}>
            <View style={styles.metabolicAgeContent}>
              <Text style={styles.metabolicAgeTitle}>Idade Metabólica</Text>
              <View style={styles.metabolicAgeValues}>
                <Text style={[
                  styles.metabolicAgeValue, 
                  metabolicAge.status === 'good' ? styles.metabolicAgeGood : styles.metabolicAgeWarning
                ]}>
                  {metabolicAge.value}
                </Text>
                <Text style={styles.metabolicAgeVs}>vs</Text>
                <Text style={styles.actualAgeValue}>{patientData.age}</Text>
              </View>
              <Text style={styles.metabolicAgeDescription}>
                {metabolicAge.status === 'good' 
                  ? `Sua idade metabólica está ${Math.abs(metabolicAge.difference)} anos abaixo da sua idade real. Excelente!` 
                  : `Sua idade metabólica está ${Math.abs(metabolicAge.difference)} anos acima da sua idade real. Foco em melhorar!`}
              </Text>
            </View>
            <View style={[
              styles.metabolicAgeIndicator,
              metabolicAge.status === 'good' ? styles.metabolicAgeGoodBg : styles.metabolicAgeWarningBg
            ]}>
              <Text style={styles.metabolicAgeIndicatorText}>
                {metabolicAge.status === 'good' ? 'BOM' : 'ATENÇÃO'}
              </Text>
            </View>
          </View>

          {/* Metabolic Age Recommendations */}
          <View style={styles.recommendationsCard}>
            <Text style={styles.recommendationsTitle}>Recomendações para Melhorar Idade Metabólica</Text>
            
            <View style={styles.recommendationItem}>
              <View style={styles.recommendationBullet} />
              <Text style={styles.recommendationText}>
                <Text style={styles.recommendationBold}>Exercícios de alta intensidade:</Text>
                <Text> Inclua 2-3 sessões semanais de HIIT (Treino Intervalado de Alta Intensidade) de 20-30 minutos para aumentar o metabolismo basal.</Text>
              </Text>
            </View>
            
            <View style={styles.recommendationItem}>
              <View style={styles.recommendationBullet} />
              <Text style={styles.recommendationText}>
                <Text style={styles.recommendationBold}>Sono de qualidade:</Text>
                <Text> Priorize 7-8 horas de sono ininterrupto por noite para regular os hormônios metabólicos e melhorar a recuperação celular.</Text>
              </Text>
            </View>
          </View>

          {/* Daily Activities */}
          <SectionHeader 
            title="Atividades do dia" 
            showViewAll={false}
          />
          
          {/* Date Selector */}
          <View style={styles.datePickerContainer}>
            <TouchableOpacity 
              style={styles.dateNavButton} 
              onPress={goToPreviousDay}
            >
              <ChevronLeft size={20} color={Colors.primary} />
            </TouchableOpacity>
            
            <FlatList
              ref={dateListRef}
              data={dates}
              renderItem={renderDateItem}
              keyExtractor={(item) => formatDateShort(item)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateList}
              initialScrollIndex={dates.findIndex(date => isSameDay(date, selectedDate))}
              onScrollToIndexFailed={() => {}}
            />
            
            <TouchableOpacity 
              style={styles.dateNavButton} 
              onPress={goToNextDay}
            >
              <ChevronRight size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.selectedDateFullText}>
            {formatDateFull(selectedDate)}
          </Text>
          
          <View style={styles.activitiesContainer}>
            {/* Health Plan Activities */}
            {dailyActivities.planActivities.length > 0 && (
              <>
                <Text style={styles.activitySectionTitle}>Plano de Saúde</Text>
                {dailyActivities.planActivities.map((activity: HealthPlanActivity) => (
                  <View key={`plan-${activity.id}`} style={styles.activityItemContainer}>
                    <View style={[
                      styles.activityContent,
                      completedActivities[activity.id.toString()] && styles.activityCompleted
                    ]}>
                      <ActivityItem
                        type="appointment"
                        title={activity.code ? `${activity.code} - ${activity.name}` : activity.name}
                        subtitle={`${activity.frequency}${activity.duration ? `, ${activity.duration}` : ''}`}
                        time={activity.time || ""}
                        titleStyle={completedActivities[activity.id.toString()] ? styles.completedText : undefined}
                        subtitleStyle={completedActivities[activity.id.toString()] ? styles.completedText : undefined}
                      />
                    </View>
                    <TouchableOpacity 
                      style={styles.checkboxContainer}
                      onPress={() => toggleActivityCompletion(activity.id)}
                    >
                      <View style={[
                        styles.checkbox,
                        completedActivities[activity.id.toString()] && styles.checkboxChecked
                      ]}>
                        {completedActivities[activity.id.toString()] && (
                          <Check size={14} color="#fff" />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {/* Medications */}
            {dailyActivities.medications.length > 0 && (
              <>
                <Text style={styles.activitySectionTitle}>Medicações</Text>
                {dailyActivities.medications.map((medication) => (
                  <View key={`med-${medication.id}`} style={styles.activityItemContainer}>
                    <View style={[
                      styles.activityContent,
                      completedMedications[medication.id.toString()] && styles.activityCompleted
                    ]}>
                      <ActivityItem
                        type="medication"
                        title={medication.name}
                        subtitle={`${medication.dosage}, ${medication.frequency}`}
                        time={medication.time || ""}
                        titleStyle={completedMedications[medication.id.toString()] ? styles.completedText : undefined}
                        subtitleStyle={completedMedications[medication.id.toString()] ? styles.completedText : undefined}
                      />
                    </View>
                    <TouchableOpacity 
                      style={styles.checkboxContainer}
                      onPress={() => toggleMedicationCompletion(medication.id)}
                    >
                      <View style={[
                        styles.checkbox,
                        completedMedications[medication.id.toString()] && styles.checkboxChecked
                      ]}>
                        {completedMedications[medication.id.toString()] && (
                          <Check size={14} color="#fff" />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {/* Appointments */}
            {dailyActivities.appointments.length > 0 && (
              <>
                <Text style={styles.activitySectionTitle}>Consultas</Text>
                {dailyActivities.appointments.map((appointment) => (
                  <ActivityItem
                    key={`apt-${appointment.id}`}
                    type="appointment"
                    title={appointment.doctor}
                    subtitle={`${appointment.specialty}, ${new Date(appointment.date).toLocaleDateString('pt-PT')}`}
                    time={appointment.time}
                  />
                ))}
              </>
            )}

            {/* Show message if no activities */}
            {dailyActivities.planActivities.length === 0 && 
             dailyActivities.medications.length === 0 && 
             dailyActivities.appointments.length === 0 && (
              <Text style={styles.noActivitiesMessage}>
                Não há atividades programadas para este dia.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionTitleBlack: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  ringsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    marginBottom: 16,
  },
  // Esta semana section
  weeklyRingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    marginBottom: 16,
  },
  weekPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weekList: {
    paddingVertical: 8,
  },
  weekItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedWeekItem: {
    backgroundColor: Colors.primary,
  },
  currentWeekItem: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  weekText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedWeekText: {
    color: Colors.background,
    fontWeight: 'bold',
  },
  weekNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  // Metabolic Age Card
  metabolicAgeCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metabolicAgeContent: {
    flex: 1,
  },
  metabolicAgeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  metabolicAgeValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  metabolicAgeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  metabolicAgeGood: {
    color: Colors.success,
  },
  metabolicAgeWarning: {
    color: Colors.danger,
  },
  metabolicAgeVs: {
    fontSize: 14,
    color: Colors.textLight,
    marginRight: 8,
  },
  actualAgeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  metabolicAgeDescription: {
    fontSize: 12,
    color: Colors.textLight,
    lineHeight: 16,
  },
  metabolicAgeIndicator: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  metabolicAgeGoodBg: {
    backgroundColor: Colors.success + '20',
  },
  metabolicAgeWarningBg: {
    backgroundColor: Colors.danger + '20',
  },
  metabolicAgeIndicatorText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartsContainer: {
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  chartValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  chartUnit: {
    fontSize: 12,
    color: Colors.textLight,
  },
  chartReference: {
    fontSize: 12,
    color: Colors.textLight,
  },
  progressContainer: {
    marginBottom: 16,
  },
  // Date Picker
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  dateList: {
    paddingVertical: 8,
  },
  dateItem: {
    width: 45,
    height: 65,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedDateItem: {
    backgroundColor: Colors.primary,
  },
  todayDateItem: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dateWeekday: {
    fontSize: 12,
    color: Colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dateDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  selectedDateText: {
    color: Colors.background,
  },
  todayDateText: {
    color: Colors.primary,
  },
  dateNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedDateFullText: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  // Activities
  activitiesContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  activitySectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  noActivitiesMessage: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  // Activity Item with Checkbox - Updated for right-side checkbox
  activityItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    height: '100%',
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  activityContent: {
    flex: 1,
  },
  activityCompleted: {
    opacity: 0.7,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.textLight,
  },
  // Recommendations
  recommendationsCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  recommendationBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
    marginRight: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  recommendationBold: {
    fontWeight: 'bold',
  },
});