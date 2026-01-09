import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Trash2, Save } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrentMedicalConditions, usePastMedicalConditions, CurrentCondition, PastCondition } from '@/hooks/useMedicalConditions';

export default function ConditionDetailScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ id: string; type: 'current' | 'past' }>();
  const conditionId = params.id ? parseInt(params.id, 10) : null;
  const conditionType = params.type || 'current';

  const { conditions: currentConditions, updateCondition: updateCurrent, deleteCondition: deleteCurrent, refresh: refreshCurrent } = useCurrentMedicalConditions();
  const { conditions: pastConditions, updateCondition: updatePast, deleteCondition: deletePast, refresh: refreshPast } = usePastMedicalConditions();

  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Get the condition based on type
  const getCondition = () => {
    if (!conditionId) return null;
    if (conditionType === 'current') {
      return currentConditions.find(c => c.id === conditionId) || null;
    } else {
      return pastConditions.find(c => c.id === conditionId) || null;
    }
  };

  const condition = getCondition();

  // Form state
  const [formData, setFormData] = useState<CurrentCondition | PastCondition | null>(null);

  useEffect(() => {
    if (condition) {
      setFormData({ ...condition });
    }
  }, [condition]);

  const updateField = (field: string, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value } as CurrentCondition | PastCondition);
      // Clear validation error
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
    
    if (!formData?.condition?.trim()) {
      errors.condition = t.conditionNameRequired || 'Condition name is required';
    }
    
    if (!formData?.diagnosedDate?.trim()) {
      errors.diagnosedDate = t.dateDiagnosedRequired || 'Diagnosed date is required';
    }

    if (conditionType === 'past' && formData && 'resolvedDate' in formData && !formData.resolvedDate?.trim()) {
      errors.resolvedDate = t.dateResolvedRequired || 'Resolved date is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !formData || !conditionId) return;
    
    setSaving(true);
    try {
      if (conditionType === 'current') {
        await updateCurrent(conditionId, formData as Omit<CurrentCondition, 'id'>);
        await refreshCurrent();
      } else {
        await updatePast(conditionId, formData as Omit<PastCondition, 'id'>);
        await refreshPast();
      }
      Alert.alert(t.save || 'Save', t.conditionUpdated || 'Condition updated successfully');
      router.back();
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToUpdate || 'Failed to update condition');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!conditionId) return;
    
    Alert.alert(
      t.delete || 'Delete',
      conditionType === 'current' 
        ? (t.deleteCurrentConditionConfirm || 'Are you sure you want to delete this medical condition? This action cannot be undone.')
        : (t.deletePastConditionConfirm || 'Are you sure you want to delete this past medical condition? This action cannot be undone.'),
      [
        { text: t.cancel || 'Cancel', style: 'cancel' },
        {
          text: t.delete || 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (conditionType === 'current') {
                await deleteCurrent(conditionId);
                await refreshCurrent();
              } else {
                await deletePast(conditionId);
                await refreshPast();
              }
              router.back();
            } catch (error: any) {
              Alert.alert(t.error || 'Error', error.message || t.failedToUpdate || 'Failed to delete condition');
            }
          }
        }
      ]
    );
  };

  if (!condition) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.conditionDetails || 'Condition Details'}</Text>
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
          {t.editCondition || 'Edit Condition'}
        </Text>
        <TouchableOpacity onPress={handleDelete}>
          <Trash2 size={24} color={Colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t.conditionName || 'Condition Name'} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.condition && styles.inputError]}
                value={formData?.condition || ''}
                onChangeText={(value) => updateField('condition', value)}
                placeholder={t.enterConditionName || 'Enter condition name'}
              />
              {validationErrors.condition && (
                <Text style={styles.errorText}>{validationErrors.condition}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t.status || 'Status'}
              </Text>
              <View style={styles.statusContainer}>
                {(['controlled', 'partiallyControlled', 'uncontrolled'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      formData && 'status' in formData && formData.status === status && styles.statusButtonActive
                    ]}
                    onPress={() => updateField('status', status)}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData && 'status' in formData && formData.status === status && styles.statusButtonTextActive
                    ]}>
                      {status === 'controlled' ? t.statusControlled : 
                       status === 'partiallyControlled' ? t.statusPartiallyControlled : 
                       t.statusUncontrolled}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t.dateDiagnosed || 'Date Diagnosed'} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.diagnosedDate && styles.inputError]}
                value={formData?.diagnosedDate || ''}
                onChangeText={(value) => updateField('diagnosedDate', value)}
                placeholder="YYYY-MM-DD"
              />
              {validationErrors.diagnosedDate && (
                <Text style={styles.errorText}>{validationErrors.diagnosedDate}</Text>
              )}
            </View>

            {conditionType === 'past' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {t.dateResolved || 'Date Resolved'} <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, validationErrors.resolvedDate && styles.inputError]}
                  value={formData && 'resolvedDate' in formData ? formData.resolvedDate || '' : ''}
                  onChangeText={(value) => updateField('resolvedDate', value)}
                  placeholder="YYYY-MM-DD"
                />
                {validationErrors.resolvedDate && (
                  <Text style={styles.errorText}>{validationErrors.resolvedDate}</Text>
                )}
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t.treatment || 'Treatment'}
              </Text>
              <TextInput
                style={styles.input}
                value={formData?.treatedWith || ''}
                onChangeText={(value) => updateField('treatedWith', value)}
                placeholder={t.currentTreatment || 'Current treatment'}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t.notes || 'Notes'}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData?.notes || ''}
                onChangeText={(value) => updateField('notes', value)}
                placeholder={t.additionalNotes || 'Additional notes about the condition'}
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

