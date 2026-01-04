import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Colors from '@/constants/colors';

interface ProgressRingProps {
  size: number;
  progress: number;
  innerProgress?: number;
  strokeWidth?: number;
  label: string;
  value: string | number;
  subValue?: string | number;
  color?: string;
  innerColor?: string;
  showLabel?: boolean;
  comparison?: {
    value: number;
    label: string;
  };
}

export default function ProgressRing({
  size,
  progress,
  innerProgress,
  strokeWidth = 10,
  label,
  value,
  subValue,
  color = Colors.primary,
  innerColor = Colors.secondary,
  showLabel = true,
  comparison,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;
  
  // For inner ring if provided
  const innerRadius = radius - strokeWidth - 2;
  const innerCircumference = innerRadius * 2 * Math.PI;
  const innerProgressValue = innerProgress !== undefined 
    ? innerCircumference - (innerProgress / 100) * innerCircumference
    : innerCircumference;

  return (
    <View style={styles.container}>
      <View style={styles.ringContainer}>
        <Svg width={size} height={size}>
          {/* Outer ring background */}
          <Circle
            stroke={Colors.border}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          
          {/* Outer ring progress */}
          <Circle
            stroke={color}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressValue}
            strokeLinecap="round"
            transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          />
          
          {/* Inner ring background (if innerProgress is provided) */}
          {innerProgress !== undefined && (
            <Circle
              stroke={Colors.border}
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={innerRadius}
              strokeWidth={strokeWidth}
            />
          )}
          
          {/* Inner ring progress (if innerProgress is provided) */}
          {innerProgress !== undefined && (
            <Circle
              stroke={innerColor}
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={innerRadius}
              strokeWidth={strokeWidth}
              strokeDasharray={innerCircumference}
              strokeDashoffset={innerProgressValue}
              strokeLinecap="round"
              transform={`rotate(-90, ${size / 2}, ${size / 2})`}
            />
          )}
        </Svg>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, size <= 50 && styles.smallValue]}>{value}</Text>
          {subValue && <Text style={styles.subValue}>{subValue}</Text>}
        </View>
      </View>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {comparison && (
            <View style={styles.comparisonContainer}>
              <Text style={[
                styles.comparisonValue,
                comparison.value > 0 ? styles.positiveComparison : 
                comparison.value < 0 ? styles.negativeComparison : styles.neutralComparison
              ]}>
                {comparison.value > 0 ? '+' : ''}{comparison.value}%
              </Text>
              <Text style={styles.comparisonLabel}>{comparison.label}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  smallValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  subValue: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: -4,
  },
  labelContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  comparisonValue: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  positiveComparison: {
    color: Colors.success,
  },
  negativeComparison: {
    color: Colors.danger,
  },
  neutralComparison: {
    color: Colors.textLight,
  },
  comparisonLabel: {
    fontSize: 10,
    color: Colors.textLight,
  },
});