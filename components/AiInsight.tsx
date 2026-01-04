import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lightbulb, AlertTriangle, TrendingUp, Lightbulb as LightbulbIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import ProgressRing from './ProgressRing';

export interface InsightData {
  title: string;
  content?: string;
  date: string;
  concerns?: string[];
  improvements?: string[];
  recommendations?: string[];
}

interface AiInsightProps {
  insight: InsightData;
  simplified?: boolean;
  healthScore?: number; // Optional health score to display in ring
}

export default function AiInsight({ insight, simplified = false, healthScore }: AiInsightProps) {
  const { t } = useLanguage();
  
  if (simplified || (!insight.concerns && !insight.improvements && !insight.recommendations)) {
    // Simple version with just content
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Lightbulb size={20} color={Colors.primary} />
          <Text style={styles.title}>{insight.title}</Text>
          {healthScore !== undefined && (
            <View style={styles.scoreRingContainer}>
              <ProgressRing
                size={50}
                progress={healthScore}
                strokeWidth={4}
                label=""
                value={healthScore}
                color={healthScore >= 80 ? Colors.success : healthScore >= 60 ? Colors.warning : Colors.danger}
                showLabel={false}
              />
            </View>
          )}
        </View>
        {insight.content && <Text style={styles.content}>{insight.content}</Text>}
      </View>
    );
  }

  // Enhanced version with sections
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Lightbulb size={20} color={Colors.primary} />
        <Text style={styles.title}>{insight.title}</Text>
        {healthScore !== undefined && (
          <View style={styles.scoreRingContainer}>
            <ProgressRing
              size={44}
              progress={healthScore}
              strokeWidth={3}
              label=""
              value={healthScore}
              color={healthScore >= 80 ? Colors.success : healthScore >= 60 ? Colors.warning : Colors.danger}
              showLabel={false}
            />
          </View>
        )}
      </View>
      
      {insight.concerns && insight.concerns.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={16} color={Colors.warning} />
            <Text style={[styles.sectionTitle, { color: Colors.warning }]}>{t.areasOfConcern}</Text>
          </View>
          {insight.concerns.map((concern, index) => (
            <View key={`concern-${index}`} style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: Colors.warning }]} />
              <Text style={styles.bulletText}>{concern}</Text>
            </View>
          ))}
        </View>
      )}
      
      {insight.improvements && insight.improvements.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={16} color={Colors.success} />
            <Text style={[styles.sectionTitle, { color: Colors.success }]}>{t.positiveProgress}</Text>
          </View>
          {insight.improvements.map((improvement, index) => (
            <View key={`improvement-${index}`} style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: Colors.success }]} />
              <Text style={styles.bulletText}>{improvement}</Text>
            </View>
          ))}
        </View>
      )}
      
      {insight.recommendations && insight.recommendations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LightbulbIcon size={16} color={Colors.primary} />
            <Text style={[styles.sectionTitle, { color: Colors.primary }]}>{t.recommendations || 'Recommendations'}</Text>
          </View>
          {insight.recommendations.map((recommendation, index) => (
            <View key={`recommendation-${index}`} style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: Colors.primary }]} />
              <Text style={styles.bulletText}>{recommendation}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  scoreRingContainer: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  section: {
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingLeft: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textLight,
    lineHeight: 18,
  },
});