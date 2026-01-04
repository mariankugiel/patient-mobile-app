import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface ProgressBarProps {
  progress: number;
  goal: string;
  target: string;
  current: string;
}

export default function ProgressBar({ progress, goal, target, current }: ProgressBarProps) {
  const getProgressColor = () => {
    if (progress >= 90) return Colors.success;
    if (progress >= 60) return Colors.primary;
    if (progress >= 30) return Colors.warning;
    return Colors.danger;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.goal}>{goal}</Text>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${progress}%`, backgroundColor: getProgressColor() }
          ]} 
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Atual: {current}</Text>
        <Text style={styles.detailText}>Meta: {target}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  progressContainer: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 12,
    color: Colors.textLight,
  },
});