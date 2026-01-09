import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Trash2, Save } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSurgeryHospitalization, SurgeryHospitalization } from '@/hooks/useSurgeryHospitalization';

export default function SurgeryDetailScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ id: string }>();
  const surgeryId = params.id ? parseInt(params.id, 10) : null;

  const { surgeries, updateSurgery, deleteSurgery, refresh } = useSurgeryHospitalization();

  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const surgery = surgeryId ? surgeries.find(s => s.id === surgeryId) : null;

  const [formData, setFormData] = useState<Partial<SurgeryHospitalization> | null>(null);

  useEffect(() => {
    if (surgery) {
      setFormData({
        procedure_type: surgery.procedure_type,
        name: surgery.name,
        procedure_date: surgery.procedure_date ? surgery.procedure_date.split('T')[0] : '',
        reason: surgery.reason || '',
        treatment: surgery.treatment || '',
        body_area: surgery.body_area || '',
        recovery_status: surgery.recovery_status,
        notes: surgery.notes || ''
      });
    }
  }, [surgery]);

  const updateField = (field: string, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
      if (validationErrors[field]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData?.name?.trim()) {
      errors.name = t.procedureNameRequired || 'Procedure name is required';
    }
    
    if (!formData?.procedure_date?.trim()) {
      errors.procedure_date = t.procedureDateRequired || 'Procedure date is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !formData || !surgeryId) return;
    
    setSaving(true);
    try {
      await updateSurgery(surgeryId, formData);
      await refresh();
      Alert.alert(t.save || 'Save', t.surgeryUpdated || 'Surgery/hospitalization updated successfully');
      router.back();
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToUpdate || 'Failed to update surgery/hospitalization');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!surgeryId) return;
    
    Alert.alert(
      t.delete || 'Delete',
      t.deleteSurgeryConfirm || 'Are you sure you want to delete this surgery/hospitalization? This action cannot be undone.',
      [
        { text: t.cancel || 'Cancel', style: 'cancel' },
        {
          text: t.delete || 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSurgery(surgeryId);
              await refresh();
              router.back();
            } catch (error: any) {
              Alert.alert(t.error || 'Error', error.message || t.failedToUpdate || 'Failed to delete surgery/hospitalization');
            }
          }
        }
      ]
    );
  };

  const getProcedureTypeLabel = (type: string): string => {
    return type === 'surgery' ? (t.surgery || 'Surgery') : (t.hospitalization || 'Hospitalization');
  };

  const getRecoveryStatusColor = (status: string): string => {
    switch (status) {
      case 'full_recovery':
        return Colors.success;
      case 'partial_recovery':
        return Colors.warning;
      case 'no_recovery':
        return Colors.danger;
      default:
        return Colors.textLight;
    }
  };

  const getRecoveryStatusLabel = (status: string): string => {
    switch (status) {
      case 'full_recovery':
        return t.recoveryFull || 'Full Recovery';
      case 'partial_recovery':
        return t.recoveryPartial || 'Partial Recovery';
      case 'no_recovery':
        return t.recoveryNone || 'No Recovery';
      default:
        return status;
    }
  };

  if (!surgery) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.surgeryDetails || 'Surgery Details'}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t.loading || 'Loading...'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t.editSurgeryHospitalization || 'Edit Surgery/Hospitalization'}
        </Text>
        <TouchableOpacity onPress={handleDelete}>
          <Trash2 size={24} color={Colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t.procedureType || 'Procedure Type'}
              </Text>
              <View style={styles.statusContainer}>
                {(['surgery', 'hospitalization'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.statusButton,
                      formData?.procedure_type === type && styles.statusButtonActive
                    ]}
                    onPress={() => updateField('procedure_type', type)}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData?.procedure_type === type && styles.statusButtonTextActive
                    ]}>
                      {getProcedureTypeLabel(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t.procedureName || 'Procedure Name'} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.name && styles.inputError]}
                value={formData?.name || ''}
                onChangeText={(value) => updateField('name', value)}
                placeholder={t.enterProcedureName || 'Enter procedure name'}
              />
              {validationErrors.name && (
                <Text style={styles.errorText}>{validationErrors.name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t.procedureDate || 'Procedure Date'} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.procedure_date && styles.inputError]}
                value={formData?.procedure_date || ''}
                onChangeText={(value) => updateField('procedure_date', value)}
                placeholder="YYYY-MM-DD"
              />
              {validationErrors.procedure_date && (
                <Text style={styles.errorText}>{validationErrors.procedure_date}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t.reason || 'Reason'}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData?.reason || ''}
                onChangeText={(value) => updateField('reason', value)}
                placeholder={t.enterReason || 'Enter reason for procedure'}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t.treatment || 'Treatment'}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData?.treatment || ''}
                onChangeText={(value) => updateField('treatment', value)}
                placeholder={t.enterTreatment || 'Enter treatment details'}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t.bodyArea || 'Body Area'}
              </Text>
              <TextInput
                style={styles.input}
                value={formData?.body_area || ''}
                onChangeText={(value) => updateField('body_area', value)}
                placeholder={t.enterBodyArea || 'Enter body area'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t.recoveryStatus || 'Recovery Status'}
              </Text>
              <View style={styles.statusContainer}>
                {(['full_recovery', 'partial_recovery', 'no_recovery'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      formData?.recovery_status === status && styles.statusButtonActive
                    ]}
                    onPress={() => updateField('recovery_status', status)}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData?.recovery_status === status && styles.statusButtonTextActive
                    ]}>
                      {getRecoveryStatusLabel(status)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t.notes || 'Notes'}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData?.notes || ''}
                onChangeText={(value) => updateField('notes', value)}
                placeholder={t.additionalNotes || 'Additional notes'}
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={Colors.background} />
              ) : (
                <>
                  <Save size={20} color={Colors.background} />
                  <Text style={styles.saveButtonText}>{t.save || 'Save'}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
      </ScrollView>
    </SafeAreaView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  cancelButton: {
    fontSize: 16,
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textLight,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  required: {
    color: Colors.danger,
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
  inputError: {
    borderColor: Colors.danger,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.secondary,
  },
  statusButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statusButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  statusButtonTextActive: {
    color: Colors.background,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    gap: 16,
  },
  detailCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.text,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  editButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

