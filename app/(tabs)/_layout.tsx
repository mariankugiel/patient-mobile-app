import React from 'react';
import { Tabs } from 'expo-router';
import { FileText, CheckSquare, Pill, Calendar } from 'lucide-react-native';
import { Platform } from 'react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const { t } = useLanguage();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLighter,
        tabBarStyle: {
          borderTopColor: Colors.border,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="records"
        options={{
          title: t.tabRecords,
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: t.tabPlans,
          tabBarIcon: ({ color, size }) => <CheckSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: t.tabMedications,
          tabBarIcon: ({ color, size }) => <Pill size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: t.tabAppointments,
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}