import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, ScrollView, TextInput,
  TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, Switch,
} from 'react-native';
import { X, AlertTriangle, Heart, Pill, Baby } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import type { UserEmergency } from '@/lib/api/types';
import CustomPicker from '../CustomPicker';

interface EditEmergencyModalProps {
  visible: boolean;
  onClose: () => void;
  emergency: UserEmergency | null;
  onSave: (data: Partial<UserEmergency>) => Promise<void>;
  isSaving?: boolean;
}

export default function EditEmergencyModal({
  visible,
  onClose,
  emergency,
  onSave,
  isSaving = false,
}: EditEmergencyModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    allergies: '',
    health_problems: '',
    medications: '',
    pregnancy_status: '',
    organ_donor: false,
  });

  useEffect(() => {
    if (emergency) {
      setFormData({
        allergies: emergency.allergies || '',
        health_problems: emergency.health_problems || '',
        medications: emergency.medications || '',
        pregnancy_status: emergency.pregnancy_status || '',
        organ_donor: emergency.organ_donor || false,
      });
    }
  }, [emergency]);

  const handleSave = async () => {
    try {
      await onSave(formData);
      onClose();
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToUpdate || 'Failed to update emergency information');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.emergencyMedicalInfo}</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={styles.saveButtonText}>{t.save}</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <View style={styles.labelWithIcon}>
                <AlertTriangle size={16} color={Colors.primary} />
                <Text style={styles.label}>{t.allergies}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.allergies}
                onChangeText={(text) => setFormData({ ...formData, allergies: text })}
                placeholder={t.allergies}
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelWithIcon}>
                <Heart size={16} color={Colors.primary} />
                <Text style={styles.label}>{t.healthProblems}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.health_problems}
                onChangeText={(text) => setFormData({ ...formData, health_problems: text })}
                placeholder={t.healthProblems}
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelWithIcon}>
                <Pill size={16} color={Colors.primary} />
                <Text style={styles.label}>{t.currentMedications}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.medications}
                onChangeText={(text) => setFormData({ ...formData, medications: text })}
                placeholder={t.currentMedications}
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelWithIcon}>
                <Baby size={16} color={Colors.primary} />
                <Text style={styles.label}>{t.pregnancyStatus}</Text>
              </View>
              <CustomPicker
                selectedValue={formData.pregnancy_status}
                onValueChange={(itemValue) => setFormData({ ...formData, pregnancy_status: itemValue })}
                items={[
                  { label: t.pregnancyNotPregnant || 'Not Pregnant', value: 'no' },
                  { label: t.pregnancyPregnant || 'Pregnant', value: 'yes' },
                  { label: t.pregnancyUnknown || 'Unknown', value: 'unknown' },
                  { label: t.pregnancyNotApplicable || 'Not Applicable', value: 'na' },
                ]}
                placeholder={t.selectStatus || 'Select status'}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelWithIcon}>
                <Heart size={16} color={Colors.primary} />
                <Text style={styles.label}>{t.organDonor}</Text>
              </View>
              <View style={styles.switchContainer}>
                <Switch
                  value={formData.organ_donor}
                  onValueChange={(value) => setFormData({ ...formData, organ_donor: value })}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.background}
                />
                <Text style={styles.switchLabel}>
                  {formData.organ_donor ? t.yes : t.no}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  formSection: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: Colors.text,
  },
});

