import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, MapPin, Calendar, Eye, Edit } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

type RiskLevel = 'low' | 'moderate' | 'high';

interface ExamItemProps {
  type: string;
  date: string;
  region: string;
  conclusion: string;
  fileName: string;
  risk: RiskLevel;
  onView?: () => void;
  onEdit?: () => void;
}

export default function ExamItem({
  type,
  date,
  region,
  conclusion,
  fileName,
  risk,
  onView,
  onEdit,
}: ExamItemProps) {
  const { t } = useLanguage();

  const getRiskBadgeColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case 'low':
        return {
          bg: '#FFF8E1',
          text: '#F9A825',
        };
      case 'moderate':
        return {
          bg: '#FFF3E0',
          text: '#FB8C00',
        };
      case 'high':
        return {
          bg: '#FFEBEE',
          text: '#E53935',
        };
    }
  };

  const getRiskLabel = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case 'low':
        return t.lowRiskFindings;
      case 'moderate':
        return t.moderateRiskFindings;
      case 'high':
        return t.highRiskFindings;
    }
  };

  const riskColors = getRiskBadgeColor(risk);
  const riskLabel = getRiskLabel(risk);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <FileText size={24} color={Colors.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.type}>{type}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Calendar size={16} color={Colors.textLight} />
          <Text style={styles.infoText}>{date}</Text>
        </View>
        <View style={styles.infoItem}>
          <MapPin size={16} color={Colors.textLight} />
          <Text style={styles.infoText}>{region}</Text>
        </View>
      </View>

      <View style={styles.fileRow}>
        <Text style={styles.fileName}>{fileName}</Text>
      </View>

      <View style={styles.conclusionContainer}>
        <Text style={styles.conclusionText}>{conclusion}</Text>
      </View>

      <View style={styles.footer}>
        <View style={[styles.riskBadge, { backgroundColor: riskColors.bg }]}>
          <Text style={[styles.riskText, { color: riskColors.text }]}>
            {riskLabel}
          </Text>
        </View>
        <View style={styles.actions}>
          {onView && (
            <TouchableOpacity style={styles.actionButton} onPress={onView}>
              <Eye size={18} color={Colors.primary} />
              <Text style={styles.actionText}>{t.viewExam}</Text>
            </TouchableOpacity>
          )}
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Edit size={18} color={Colors.primary} />
              <Text style={styles.actionText}>{t.editExam}</Text>
            </TouchableOpacity>
          )}
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  type: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  fileRow: {
    marginBottom: 12,
  },
  fileName: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  conclusionContainer: {
    backgroundColor: Colors.primary + '08',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 4,
  },
  conclusionText: {
    fontSize: 14,
    color: Colors.primary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  riskText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.primary + '10',
  },
  actionText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
});
