import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart, Droplet, Activity, Percent, Footprints, Moon, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface MetricCardProps {
  name: string;
  value: number | string;
  unit: string;
  reference: string;
  status: 'normal' | 'warning' | 'danger';
  date: string;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
}

export default function MetricCard({
  name,
  value,
  unit,
  reference,
  status,
  date,
  icon,
  trend = 'stable',
}: MetricCardProps) {
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

  const renderIcon = () => {
    switch (icon) {
      case 'heart':
        return <Heart size={24} color={getStatusColor()} />;
      case 'droplet':
        return <Droplet size={24} color={getStatusColor()} />;
      case 'activity':
        return <Activity size={24} color={getStatusColor()} />;
      case 'percent':
        return <Percent size={24} color={getStatusColor()} />;
      case 'footprints':
        return <Footprints size={24} color={getStatusColor()} />;
      case 'moon':
        return <Moon size={24} color={getStatusColor()} />;
      default:
        return <Activity size={24} color={getStatusColor()} />;
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
        return <TrendingUp size={16} color={trendColor} />;
      case 'down':
        return <TrendingDown size={16} color={trendColor} />;
      case 'stable':
        return <Minus size={16} color={trendColor} />;
    }
  };

  return (
    <View style={[styles.container, { borderLeftColor: getStatusColor() }]}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.valueContainer}>
          <View style={styles.valueAndTrend}>
            <Text style={styles.value}>
              {value} <Text style={styles.unit}>{unit}</Text>
            </Text>
            <View style={styles.trendContainer}>
              {renderTrendIcon()}
            </View>
          </View>
          <Text style={styles.reference}>Ref: {reference}</Text>
        </View>
        <Text style={styles.date}>{new Date(date).toLocaleDateString('pt-PT')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  valueAndTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  unit: {
    fontSize: 14,
    color: Colors.textLight,
  },
  trendContainer: {
    marginLeft: 8,
  },
  reference: {
    fontSize: 12,
    color: Colors.textLight,
  },
  date: {
    fontSize: 12,
    color: Colors.textLighter,
  },
});