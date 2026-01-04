import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { Calendar, Clock, Pill } from 'lucide-react-native';
import Colors from '@/constants/colors';

export interface ActivityItemProps {
  type: 'appointment' | 'medication' | 'activity';
  title: string;
  subtitle: string;
  time?: string;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

export default function ActivityItem({ 
  type, 
  title, 
  subtitle, 
  time,
  titleStyle,
  subtitleStyle
}: ActivityItemProps) {
  const renderIcon = () => {
    switch (type) {
      case 'appointment':
        return <Calendar size={20} color={Colors.primary} />;
      case 'medication':
        return <Pill size={20} color={Colors.primary} />;
      case 'activity':
        return <Calendar size={20} color={Colors.primary} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
      </View>
      {time && (
        <View style={styles.timeContainer}>
          <Clock size={14} color={Colors.textLight} />
          <Text style={styles.timeText}>{time}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
});