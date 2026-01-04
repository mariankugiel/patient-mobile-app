import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, SafeAreaView, FlatList, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { 
  Plus, 
  CheckSquare, 
  Edit2, 
  Trash2, 
  X, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Sunrise, 
  Moon, 
  Activity, 
  Gauge, 
  Droplet, 
  Utensils, 
  Dumbbell, 
  Salad, 
  Hourglass,
  Check,
  Square
} from 'lucide-react-native';
import Header from '@/components/Header';
import ProgressRing from '@/components/ProgressRing';
import Colors from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: number;
  code: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  goalId: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  icon: React.ReactNode;
  completedDays: number[]; // 0 = Sunday, 1 = Monday, etc.
}

interface Goal {
  id: number;
  letter: string;
  title: string;
  description: string;
  progress: number;
  startDate: string;
  endDate: string;
  tasks: Task[];
  icon: React.ReactNode;
}

// Utility functions for date handling
const getDayName = (dayIndex: number): string => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return days[dayIndex];
};

const getWeekDays = (date: Date): Date[] => {
  const day = date.getDay();
  const diff = date.getDate() - day;
  const weekStart = new Date(date);
  weekStart.setDate(diff);
  
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(weekStart);
    newDate.setDate(weekStart.getDate() + i);
    days.push(newDate);
  }
  
  return days;
};

const formatWeekRange = (weekStart: Date): string => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const startMonth = weekStart.toLocaleDateString('pt-BR', { month: 'short' }).slice(0, 3);
  const endMonth = weekEnd.toLocaleDateString('pt-BR', { month: 'short' }).slice(0, 3);
  
  if (startMonth === endMonth) {
    return `${startDay}-${endDay} ${startMonth}`;
  } else {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  }
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Storage keys - using the same keys as in index.tsx for synchronization
const TASKS_STORAGE_KEY = '@health_app_tasks';
const COMPLETED_DAYS_STORAGE_KEY = '@health_app_completed_days';

export default function HealthPlanScreen() {
  const router = useRouter();
  const today = new Date();
  
  // Week selection for calendar
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
  const [selectedWeek, setSelectedWeek] = useState(currentWeekStart);
  const [weekDays, setWeekDays] = useState(getWeekDays(selectedWeek));
  
  // State for tracking task completion
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [completedDays, setCompletedDays] = useState<Record<string, number[]>>({});
  
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      letter: 'A',
      title: "Reduzir Colesterol",
      description: "Reduzir o colesterol LDL para níveis saudáveis através de dieta e exercício",
      progress: 65,
      startDate: "2023-10-01",
      endDate: "2023-12-31",
      icon: <Activity size={24} color={Colors.danger} />,
      tasks: [
        {
          id: 1,
          code: "A1",
          title: "Caminhada diária",
          description: "30 minutos de caminhada todos os dias",
          dueDate: "2023-12-31",
          completed: false,
          goalId: 1,
          frequency: 'daily',
          icon: <Activity size={16} color={Colors.primary} />,
          completedDays: []
        },
        {
          id: 2,
          code: "A2",
          title: "Reduzir consumo de gorduras saturadas",
          description: "Limitar o consumo de alimentos ricos em gorduras saturadas",
          dueDate: "2023-12-31",
          completed: false,
          goalId: 1,
          frequency: 'daily',
          icon: <Activity size={16} color={Colors.primary} />,
          completedDays: []
        },
        {
          id: 3,
          code: "A3",
          title: "Aumentar consumo de fibras",
          description: "Consumir mais alimentos ricos em fibras como aveia e legumes",
          dueDate: "2023-12-31",
          completed: false,
          goalId: 1,
          frequency: 'weekly',
          icon: <Activity size={16} color={Colors.primary} />,
          completedDays: []
        }
      ]
    },
    {
      id: 2,
      letter: 'B',
      title: "Controlar Pressão Arterial",
      description: "Manter a pressão arterial em níveis saudáveis",
      progress: 40,
      startDate: "2023-11-01",
      endDate: "2024-01-31",
      icon: <Gauge size={24} color={Colors.primary} />,
      tasks: [
        {
          id: 4,
          code: "B1",
          title: "Reduzir consumo de sal",
          description: "Limitar o consumo de sal a menos de 5g por dia",
          dueDate: "2024-01-31",
          completed: false,
          goalId: 2,
          frequency: 'daily',
          icon: <Gauge size={16} color={Colors.primary} />,
          completedDays: []
        },
        {
          id: 5,
          code: "B2",
          title: "Praticar técnicas de relaxamento",
          description: "Dedicar 15 minutos por dia a técnicas de relaxamento",
          dueDate: "2024-01-31",
          completed: false,
          goalId: 2,
          frequency: 'daily',
          icon: <Gauge size={16} color={Colors.primary} />,
          completedDays: []
        }
      ]
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly'
  });

  // Load tasks from storage on component mount and when screen comes into focus
  const loadTasksFromStorage = useCallback(async () => {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      const completedDaysJson = await AsyncStorage.getItem(COMPLETED_DAYS_STORAGE_KEY);
      
      if (tasksJson) {
        const tasksData = JSON.parse(tasksJson);
        setCompletedTasks(tasksData);
        
        // Update the completed status of tasks
        const updatedGoals = goals.map(goal => {
          const updatedTasks = goal.tasks.map(task => {
            if (tasksData[task.id] !== undefined) {
              return { ...task, completed: tasksData[task.id] };
            }
            return task;
          });
          
          // Calculate new progress
          const completedTasksCount = updatedTasks.filter(t => t.completed).length;
          const totalTasks = updatedTasks.length;
          const newProgress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
          
          return {
            ...goal,
            tasks: updatedTasks,
            progress: newProgress
          };
        });
        
        setGoals(updatedGoals);
      }
      
      if (completedDaysJson) {
        const completedDaysData = JSON.parse(completedDaysJson);
        setCompletedDays(completedDaysData);
        
        // Update the completedDays of tasks
        const updatedGoals = goals.map(goal => {
          const updatedTasks = goal.tasks.map(task => {
            if (completedDaysData[task.id]) {
              return { ...task, completedDays: completedDaysData[task.id] };
            }
            return task;
          });
          
          return {
            ...goal,
            tasks: updatedTasks
          };
        });
        
        setGoals(updatedGoals);
      }
    } catch (error) {
      console.error('Failed to load tasks from storage', error);
    }
  }, [goals]);

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

  // Update week days when selected week changes
  useEffect(() => {
    setWeekDays(getWeekDays(selectedWeek));
  }, [selectedWeek]);

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;
    
    const totalTasks = goals.reduce((acc, goal) => acc + goal.tasks.length, 0);
    const completedTasksCount = goals.reduce((acc, goal) => 
      acc + goal.tasks.filter(task => task.completed).length, 0);
    
    return totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
  };

  const overallProgress = calculateOverallProgress();

  // Save task completion status to storage
  const saveTasksToStorage = async (updatedGoals: Goal[]) => {
    try {
      // Create a map of task IDs to completion status
      const tasksMap: Record<string, boolean> = {};
      const completedDaysMap: Record<string, number[]> = {};
      
      updatedGoals.forEach(goal => {
        goal.tasks.forEach(task => {
          tasksMap[task.id] = task.completed;
          completedDaysMap[task.id] = task.completedDays;
        });
      });
      
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksMap));
      await AsyncStorage.setItem(COMPLETED_DAYS_STORAGE_KEY, JSON.stringify(completedDaysMap));
    } catch (error) {
      console.error('Failed to save tasks to storage', error);
    }
  };

  const handleToggleTask = (task: Task) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === task.goalId) {
        const updatedTasks = goal.tasks.map(t => {
          if (t.id === task.id) {
            return { ...t, completed: !t.completed };
          }
          return t;
        });
        
        // Calculate new progress
        const completedTasksCount = updatedTasks.filter(t => t.completed).length;
        const totalTasks = updatedTasks.length;
        const newProgress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
        
        return {
          ...goal,
          tasks: updatedTasks,
          progress: newProgress
        };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    saveTasksToStorage(updatedGoals);
  };

  const handleToggleTaskDay = (task: Task, dayIndex: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === task.goalId) {
        const updatedTasks = goal.tasks.map(t => {
          if (t.id === task.id) {
            let updatedCompletedDays = [...t.completedDays];
            
            // If day is already completed, remove it, otherwise add it
            if (updatedCompletedDays.includes(dayIndex)) {
              updatedCompletedDays = updatedCompletedDays.filter(d => d !== dayIndex);
            } else {
              updatedCompletedDays.push(dayIndex);
            }
            
            return { 
              ...t, 
              completedDays: updatedCompletedDays,
              // Update completed status based on if there are any completed days
              completed: updatedCompletedDays.length > 0
            };
          }
          return t;
        });
        
        // Calculate new progress
        const completedTasksCount = updatedTasks.filter(t => t.completed).length;
        const totalTasks = updatedTasks.length;
        const newProgress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
        
        return {
          ...goal,
          tasks: updatedTasks,
          progress: newProgress
        };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    saveTasksToStorage(updatedGoals);
  };

  const handleAddTask = () => {
    if (selectedGoal && newTask.title && newTask.dueDate) {
      // Find the highest task number for this goal
      const goalTasks = selectedGoal.tasks.filter(t => t.code.startsWith(selectedGoal.letter));
      let maxTaskNumber = 0;
      
      goalTasks.forEach(task => {
        const taskNumber = parseInt(task.code.substring(1));
        if (!isNaN(taskNumber) && taskNumber > maxTaskNumber) {
          maxTaskNumber = taskNumber;
        }
      });
      
      const newTaskNumber = maxTaskNumber + 1;
      const newTaskCode = `${selectedGoal.letter}${newTaskNumber}`;
      
      const newTaskId = Math.max(...goals.flatMap(g => g.tasks.map(t => t.id)), 0) + 1;
      
      const updatedGoals = goals.map(goal => {
        if (goal.id === selectedGoal.id) {
          const updatedTasks = [
            ...goal.tasks,
            {
              id: newTaskId,
              code: newTaskCode,
              title: newTask.title,
              description: newTask.description,
              dueDate: newTask.dueDate,
              completed: false,
              goalId: goal.id,
              frequency: newTask.frequency,
              icon: goal.icon, // Use the same icon as the goal
              completedDays: []
            }
          ];
          
          // Calculate new progress
          const completedTasksCount = updatedTasks.filter(t => t.completed).length;
          const totalTasks = updatedTasks.length;
          const newProgress = Math.round((completedTasksCount / totalTasks) * 100);
          
          return {
            ...goal,
            tasks: updatedTasks,
            progress: newProgress
          };
        }
        return goal;
      });
      
      setGoals(updatedGoals);
      saveTasksToStorage(updatedGoals);
      setNewTask({ 
        title: '', 
        description: '', 
        dueDate: '',
        frequency: 'daily'
      });
      setTaskModalVisible(false);
    }
  };

  const handleDeleteTask = (taskId: number) => {
    const updatedGoals = goals.map(goal => {
      const taskExists = goal.tasks.some(t => t.id === taskId);
      
      if (taskExists) {
        const updatedTasks = goal.tasks.filter(t => t.id !== taskId);
        
        // Calculate new progress
        const completedTasksCount = updatedTasks.filter(t => t.completed).length;
        const totalTasks = updatedTasks.length;
        const newProgress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
        
        return {
          ...goal,
          tasks: updatedTasks,
          progress: newProgress
        };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    saveTasksToStorage(updatedGoals);
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

  // Check if a task should be shown on a specific day
  const shouldShowTaskOnDay = (task: Task, dayDate: Date): boolean => {
    const dayOfWeek = dayDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    if (task.frequency === 'daily') {
      return true;
    }
    
    if (task.frequency === 'weekly') {
      // For weekly tasks, we'll show them on a specific day (e.g., Monday)
      // This is a simplification - in a real app, you'd have more complex logic
      return dayOfWeek === 1; // Show on Monday
    }
    
    if (task.frequency === 'monthly') {
      // For monthly tasks, we'll show them on the 1st of the month
      return dayDate.getDate() === 1;
    }
    
    return false;
  };

  // Check if a task is completed on a specific day
  const isTaskCompletedOnDay = (task: Task, dayDate: Date): boolean => {
    const dayOfWeek = dayDate.getDay(); // 0 = Sunday, 6 = Saturday
    return task.completedDays.includes(dayOfWeek);
  };

  // Get all tasks for a specific day
  const getTasksForDay = (dayDate: Date): Task[] => {
    return goals.flatMap(goal => 
      goal.tasks.filter(task => shouldShowTaskOnDay(task, dayDate))
    );
  };

  // Toggle task completion for a specific day
  const toggleTaskCompletionForDay = (task: Task, dayDate: Date) => {
    const dayOfWeek = dayDate.getDay();
    handleToggleTaskDay(task, dayOfWeek);
  };

  const renderGoalItem = (goal: Goal) => {
    const completedTasksCount = goal.tasks.filter(task => task.completed).length;
    const totalTasks = goal.tasks.length;
    
    return (
      <View key={goal.id} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={styles.goalIconContainer}>
            {goal.icon}
          </View>
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>
              <Text style={styles.goalLetter}>{goal.letter}</Text>
              <Text>: {goal.title}</Text>
            </Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
          </View>
          <ProgressRing 
            size={60} 
            progress={goal.progress} 
            value={goal.progress} 
            color={Colors.primary}
            label=""
            showLabel={false}
          />
        </View>
        
        <View style={styles.goalDates}>
          <View style={styles.dateItem}>
            <Calendar size={16} color={Colors.primary} />
            <Text style={styles.dateText}>
              {new Date(goal.startDate).toLocaleDateString('pt-PT')} - {new Date(goal.endDate).toLocaleDateString('pt-PT')}
            </Text>
          </View>
        </View>
        
        <View style={styles.tasksSummary}>
          <Text style={styles.tasksSummaryText}>
            {completedTasksCount} de {totalTasks} tarefas concluídas
          </Text>
        </View>
        
        <View style={styles.goalActions}>
          <TouchableOpacity 
            style={styles.addTaskButton}
            onPress={() => {
              setSelectedGoal(goal);
              setTaskModalVisible(true);
            }}
          >
            <Plus size={16} color={Colors.background} />
            <Text style={styles.addTaskButtonText}>Adicionar Atividade</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editGoalButton}>
            <Edit2 size={16} color={Colors.primary} />
            <Text style={styles.editGoalButtonText}>Editar Objetivo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render a day column in the weekly calendar
  const renderDayColumn = (dayDate: Date, index: number) => {
    const isToday = isSameDay(dayDate, today);
    const dayTasks = getTasksForDay(dayDate);
    
    return (
      <View key={index} style={styles.dayColumn}>
        <View style={[
          styles.dayHeader,
          isToday && styles.todayHeader
        ]}>
          <Text style={[
            styles.dayName,
            isToday && styles.todayText
          ]}>
            {getDayName(dayDate.getDay())}
          </Text>
          <Text style={[
            styles.dayNumber,
            isToday && styles.todayText
          ]}>
            {dayDate.getDate()}
          </Text>
        </View>
        
        <View style={styles.dayTasks}>
          {dayTasks.map(task => {
            const isCompleted = isTaskCompletedOnDay(task, dayDate);
            
            return (
              <TouchableOpacity 
                key={`${task.id}-${dayDate.getDay()}`}
                style={[
                  styles.calendarTask,
                  isCompleted ? styles.completedTask : styles.pendingTask
                ]}
                onPress={() => toggleTaskCompletionForDay(task, dayDate)}
              >
                <Text 
                  style={[
                    styles.calendarTaskText,
                    isCompleted ? styles.completedTaskText : styles.pendingTaskText
                  ]}
                  numberOfLines={2}
                >
                  {task.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Plano de Saúde</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Plus size={20} color={Colors.background} />
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {/* Overall Progress Section */}
          <View style={styles.overallProgressContainer}>
            <ProgressRing 
              size={120} 
              progress={overallProgress} 
              value={overallProgress} 
              color={Colors.primary}
              label={`${overallProgress}%`}
              showLabel={true}
            />
            
            <View style={styles.progressDescriptionContainer}>
              <Text style={styles.progressTitle}>Progresso do Plano</Text>
              <Text style={styles.progressDescription}>
                Você está fazendo bons progressos no seu plano de saúde. Continue com as atividades diárias para melhorar seus resultados.
              </Text>
              <Text style={styles.progressRecommendation}>
                <Text style={styles.recommendationHighlight}>Recomendação: </Text>
                <Text>Foque em completar as tarefas relacionadas à pressão arterial para melhorar seus indicadores de saúde.</Text>
              </Text>
            </View>
          </View>

          {/* Weekly Calendar Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Calendário Semanal</Text>
            
            {/* Week Selector */}
            <View style={styles.weekSelectorContainer}>
              <TouchableOpacity 
                style={styles.weekNavButton}
                onPress={goToPreviousWeek}
              >
                <ChevronLeft size={20} color={Colors.primary} />
              </TouchableOpacity>
              
              <Text style={styles.weekRangeText}>
                {formatWeekRange(selectedWeek)}
              </Text>
              
              <TouchableOpacity 
                style={styles.weekNavButton}
                onPress={goToNextWeek}
              >
                <ChevronRight size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            
            {/* Calendar Grid */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.calendarContainer}
            >
              {weekDays.map((day, index) => renderDayColumn(day, index))}
            </ScrollView>
            
            {/* Legend */}
            <View style={styles.calendarLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.completedTask]} />
                <Text style={styles.legendText}>Realizada</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.pendingTask]} />
                <Text style={styles.legendText}>Por realizar</Text>
              </View>
            </View>
          </View>

          {/* Health Goals Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Objetivos de Saúde</Text>
            <View style={styles.goalsContainer}>
              {goals.map(renderGoalItem)}
            </View>
          </View>

          {/* Tasks Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Atividades</Text>
            <View style={styles.tasksContainer}>
              {goals.flatMap(goal => 
                goal.tasks.map(task => (
                  <View key={task.id} style={styles.taskItem}>
                    <View style={styles.taskIconContainer}>
                      {task.icon}
                    </View>
                    
                    <View style={styles.taskContent}>
                      <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                        <Text style={styles.taskCode}>{task.code}</Text>
                        <Text> - {task.title}</Text>
                      </Text>
                      
                      <View style={styles.taskMeta}>
                        <View style={styles.taskDueDate}>
                          <Clock size={14} color={Colors.textLight} />
                          <Text style={styles.taskDueDateText}>
                            {new Date(task.dueDate).toLocaleDateString('pt-PT')}
                          </Text>
                        </View>
                        <View style={styles.taskFrequency}>
                          <Text style={styles.taskFrequencyText}>
                            {task.frequency === 'daily' ? 'Diária' : 
                             task.frequency === 'weekly' ? 'Semanal' : 'Mensal'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.deleteTaskButton}
                      onPress={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 size={16} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>

        {/* Add Task Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={taskModalVisible}
          onRequestClose={() => setTaskModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Adicionar Atividade</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setTaskModalVisible(false)}
                >
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Título</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Título da atividade"
                    value={newTask.title}
                    onChangeText={(text) => setNewTask({...newTask, title: text})}
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Descrição</Text>
                  <TextInput
                    style={styles.formTextarea}
                    placeholder="Descrição da atividade"
                    value={newTask.description}
                    onChangeText={(text) => setNewTask({...newTask, description: text})}
                    multiline
                    numberOfLines={4}
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Data Limite</Text>
                  <View style={styles.dateInputContainer}>
                    <Calendar size={20} color={Colors.primary} />
                    <TextInput
                      style={styles.dateInput}
                      placeholder="AAAA-MM-DD"
                      value={newTask.dueDate}
                      onChangeText={(text) => setNewTask({...newTask, dueDate: text})}
                    />
                  </View>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Frequência</Text>
                  <View style={styles.frequencyContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.frequencyOption,
                        newTask.frequency === 'daily' && styles.frequencyOptionSelected
                      ]}
                      onPress={() => setNewTask({...newTask, frequency: 'daily'})}
                    >
                      <Text style={[
                        styles.frequencyOptionText,
                        newTask.frequency === 'daily' && styles.frequencyOptionTextSelected
                      ]}>Diária</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.frequencyOption,
                        newTask.frequency === 'weekly' && styles.frequencyOptionSelected
                      ]}
                      onPress={() => setNewTask({...newTask, frequency: 'weekly'})}
                    >
                      <Text style={[
                        styles.frequencyOptionText,
                        newTask.frequency === 'weekly' && styles.frequencyOptionTextSelected
                      ]}>Semanal</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.frequencyOption,
                        newTask.frequency === 'monthly' && styles.frequencyOptionSelected
                      ]}
                      onPress={() => setNewTask({...newTask, frequency: 'monthly'})}
                    >
                      <Text style={[
                        styles.frequencyOptionText,
                        newTask.frequency === 'monthly' && styles.frequencyOptionTextSelected
                      ]}>Mensal</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setTaskModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.saveButton,
                    (!newTask.title || !newTask.dueDate) && styles.saveButtonDisabled
                  ]}
                  onPress={handleAddTask}
                  disabled={!newTask.title || !newTask.dueDate}
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Add Goal Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Adicionar Objetivo</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Título</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Título do objetivo"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Descrição</Text>
                  <TextInput
                    style={styles.formTextarea}
                    placeholder="Descrição do objetivo"
                    multiline
                    numberOfLines={4}
                  />
                </View>
                
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel}>Data de Início</Text>
                    <View style={styles.dateInputContainer}>
                      <Calendar size={20} color={Colors.primary} />
                      <TextInput
                        style={styles.dateInput}
                        placeholder="AAAA-MM-DD"
                      />
                    </View>
                  </View>
                  
                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.formLabel}>Data de Fim</Text>
                    <View style={styles.dateInputContainer}>
                      <Calendar size={20} color={Colors.primary} />
                      <TextInput
                        style={styles.dateInput}
                        placeholder="AAAA-MM-DD"
                      />
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  // Overall Progress Section
  overallProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  progressDescriptionContainer: {
    flex: 1,
    marginLeft: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  progressDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
    lineHeight: 20,
  },
  progressRecommendation: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  recommendationHighlight: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  // Section Containers
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  // Weekly Calendar Section
  weekSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  weekRangeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  calendarContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayColumn: {
    width: 100,
    marginHorizontal: 4,
  },
  dayHeader: {
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  todayHeader: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 8,
  },
  dayName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  todayText: {
    color: Colors.primary,
  },
  dayTasks: {
    paddingTop: 8,
    minHeight: 150, // Ensure all columns have same minimum height
  },
  calendarTask: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  completedTask: {
    backgroundColor: Colors.success + '20',
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  pendingTask: {
    backgroundColor: Colors.danger + '20',
    borderLeftWidth: 3,
    borderLeftColor: Colors.danger,
  },
  calendarTaskText: {
    fontSize: 12,
  },
  completedTaskText: {
    color: Colors.success,
  },
  pendingTaskText: {
    color: Colors.danger,
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  // Goals Section
  goalsContainer: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
    marginRight: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  goalLetter: {
    color: Colors.primary,
  },
  goalDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  goalDates: {
    marginBottom: 12,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 8,
  },
  tasksSummary: {
    marginBottom: 16,
  },
  tasksSummaryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  // Tasks Section
  tasksContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tasksList: {
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  taskIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  taskCode: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  taskTitleCompleted: {
    color: Colors.textLight,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  taskDueDateText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  taskFrequency: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  taskFrequencyText: {
    fontSize: 12,
    color: Colors.primary,
  },
  deleteTaskButton: {
    padding: 8,
  },
  goalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addTaskButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  editGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editGoalButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden',
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
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  formTextarea: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
  },
  dateInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frequencyOption: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  frequencyOptionSelected: {
    backgroundColor: Colors.primary,
  },
  frequencyOptionText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  frequencyOptionTextSelected: {
    color: Colors.background,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.textLighter,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.background,
  },
});