import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface HealthMetricCardProps {
  name: string;
  value: number | string;
  unit: string;
  reference: string;
  status: 'normal' | 'warning' | 'danger';
  trend?: 'up' | 'down' | 'stable';
  onPress?: () => void;
}

export default function HealthMetricCard({
  name,
  value,
  unit,
  reference,
  status,
  trend = 'stable',
  onPress,
}: HealthMetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return Colors.success;
      case 'warning':
        return Colors.warning;
      case 'danger':
        return Colors.danger;
      default:
        return Colors.textLight;
    }
  };

  const renderTrendIcon = () => {
    // For some metrics like blood pressure, lower is better
    const lowerIsBetter = ['Glicose', 'Colesterol', 'Pressão Arterial'].includes(name);
    
    let trendColor = Colors.textLight;
    if (trend !== 'stable') {
      if (lowerIsBetter) {
        trendColor = trend === 'down' ? Colors.success : Colors.warning;
      } else {
        trendColor = trend === 'up' ? Colors.success : Colors.warning;
      }
    }
    
    switch (trend) {
      case 'up':
        return <TrendingUp size={14} color={trendColor} />;
      case 'down':
        return <TrendingDown size={14} color={trendColor} />;
      case 'stable':
        return <Minus size={14} color={trendColor} />;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { borderLeftColor: getStatusColor() }]}
      onPress={onPress}
    >
      <Text style={styles.name}>{name}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>
          {value} <Text style={styles.unit}>{unit}</Text>
        </Text>
        <View style={styles.trendContainer}>
          {renderTrendIcon()}
        </View>
      </View>
      <Text style={styles.reference}>Ref: {reference}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '31%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  unit: {
    fontSize: 12,
    color: Colors.textLight,
  },
  trendContainer: {
    marginLeft: 4,
  },
  reference: {
    fontSize: 10,
    color: Colors.textLight,
  },
});