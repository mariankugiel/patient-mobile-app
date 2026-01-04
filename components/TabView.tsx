import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Tab {
  key: string;
  title: string;
  icon: LucideIcon;
}

interface TabViewProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
}

export default function TabView({ tabs, activeTab, onTabChange }: TabViewProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabItem,
                isActive && styles.activeTabItem
              ]}
              onPress={() => onTabChange(tab.key)}
            >
              <Icon 
                size={20} 
                color={isActive ? Colors.primary : Colors.textLight} 
              />
              <Text 
                style={[
                  styles.tabTitle,
                  isActive && styles.activeTabTitle
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.secondary,
  },
  activeTabItem: {
    backgroundColor: Colors.primary + '20',
  },
  tabTitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 8,
  },
  activeTabTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});