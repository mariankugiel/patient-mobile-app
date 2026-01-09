import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Trash2, Save, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFamilyMedicalHistory, FamilyHistoryEntry } from '@/hooks/useMedicalConditions';
import SimpleDropdown from '@/components/SimpleDropdown';
import ChronicDiseaseAutocomplete from '@/components/ChronicDiseaseAutocomplete';

export default function FamilyHistoryDetailScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ id: string }>();
  const entryId = params.id ? parseInt(params.id, 10) : null;

  const { history, updateHistoryEntry, deleteHistoryEntry, refresh } = useFamilyMedicalHistory();

  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const entry = entryId ? history.find(e => e.id === entryId) : null;

  const [formData, setFormData] = useState<FamilyHistoryEntry | null>(null);

  useEffect(() => {
    if (entry) {
      setFormData({ ...entry });
    }
  }, [entry]);

  const updateField = (field: string, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value } as FamilyHistoryEntry);
      if (validationErrors[field]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const addChronicDisease = () => {
    if (formData) {
      const chronicDiseases = formData.chronic_diseases || [];
      setFormData({
        ...formData,
        chronic_diseases: [...chronicDiseases, { disease: '', age_at_diagnosis: '', comments: '' }]
      });
    }
  };

  const updateChronicDisease = (index: number, field: string, value: string) => {
    if (formData && formData.chronic_diseases) {
      const updated = [...formData.chronic_diseases];
      updated[index] = { ...updated[index], [field]: value };
      setFormData({ ...formData, chronic_diseases: updated });
    }
  };

  const removeChronicDisease = (index: number) => {
    if (formData && formData.chronic_diseases) {
      const updated = formData.chronic_diseases.filter((_, i) => i !== index);
      setFormData({ ...formData, chronic_diseases: updated });
    }
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData?.relation?.trim()) {
      errors.relation = t.relationRequired || 'Relation is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !formData || !entryId) return;
    
    setSaving(true);
    try {
      await updateHistoryEntry(entryId, formData);
      await refresh();
      Alert.alert(t.save || 'Save', t.familyHistoryUpdated || 'Family history updated successfully');
      router.back();
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToUpdate || 'Failed to update family history');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!entryId) return;
    
    Alert.alert(
      t.delete || 'Delete',
      t.deleteFamilyHistoryConfirm || 'Are you sure you want to delete this family history entry? This action cannot be undone.',
      [
        { text: t.cancel || 'Cancel', style: 'cancel' },
        {
          text: t.delete || 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHistoryEntry(entryId);
              await refresh();
              router.back();
            } catch (error: any) {
              Alert.alert(t.error || 'Error', error.message || t.failedToUpdate || 'Failed to delete family history');
            }
          }
        }
      ]
    );
  };

  const relationOptions = useMemo(() => [
    { value: 'MOTHER', label: t.relationMother || 'Mother' },
    { value: 'FATHER', label: t.relationFather || 'Father' },
    { value: 'MATERNAL_GRANDMOTHER', label: t.relationMaternalGrandmother || 'Maternal Grandmother' },
    { value: 'MATERNAL_GRANDFATHER', label: t.relationMaternalGrandfather || 'Maternal Grandfather' },
    { value: 'PATERNAL_GRANDMOTHER', label: t.relationPaternalGrandmother || 'Paternal Grandmother' },
    { value: 'PATERNAL_GRANDFATHER', label: t.relationPaternalGrandfather || 'Paternal Grandfather' },
    { value: 'SISTER', label: t.relationSister || 'Sister' },
    { value: 'BROTHER', label: t.relationBrother || 'Brother' },
    { value: 'SON', label: t.relationSon || 'Son' },
    { value: 'DAUGHTER', label: t.relationDaughter || 'Daughter' }
  ], [t]);

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.familyHistoryDetails || 'Family History Details'}</Text>
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
          {t.editFamilyHistory || 'Edit Family History'}
        </Text>
        <TouchableOpacity onPress={handleDelete}>
          <Trash2 size={24} color={Colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {t.relation || 'Relation'} <Text style={styles.required}>*</Text>
            </Text>
            <SimpleDropdown
              value={formData?.relation || ''}
              options={relationOptions}
              onValueChange={(value) => updateField('relation', value)}
              placeholder={t.selectRelation || 'Select relation'}
              style={validationErrors.relation && styles.inputError}
            />
            {validationErrors.relation && (
              <Text style={styles.errorText}>{validationErrors.relation}</Text>
            )}
          </View>

            <View style={styles.inputGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.label}>{t.deceased || 'Deceased'}</Text>
                <Switch
                  value={formData?.is_deceased || false}
                  onValueChange={(value) => updateField('is_deceased', value)}
                />
              </View>
            </View>

            {formData?.is_deceased ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t.ageAtDeath || 'Age at Death'}</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.age_at_death?.toString() || ''}
                    onChangeText={(value) => updateField('age_at_death', value ? parseInt(value, 10) : undefined)}
                    placeholder="Enter age"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t.causeOfDeath || 'Cause of Death'}</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.cause_of_death || ''}
                    onChangeText={(value) => updateField('cause_of_death', value)}
                    placeholder={t.enterCauseOfDeath || 'Enter cause of death'}
                    multiline
                  />
                </View>
              </>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t.currentAge || 'Current Age'}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.current_age?.toString() || ''}
                  onChangeText={(value) => updateField('current_age', value ? parseInt(value, 10) : undefined)}
                  placeholder="Enter current age"
                  keyboardType="numeric"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <View style={styles.chronicDiseasesHeader}>
                <Text style={styles.label}>{t.chronicDiseases || 'Chronic Diseases'}</Text>
                <TouchableOpacity onPress={addChronicDisease} style={styles.addButton}>
                  <Plus size={16} color={Colors.primary} />
                  <Text style={styles.addButtonText}>{t.add || 'Add'}</Text>
                </TouchableOpacity>
              </View>
              {formData?.chronic_diseases?.map((disease, index) => (
                <View key={index} style={styles.chronicDiseaseCard}>
                  <View style={styles.chronicDiseaseHeader}>
                    <Text style={styles.chronicDiseaseTitle}>{t.disease || 'Disease'} {index + 1}</Text>
                    <TouchableOpacity onPress={() => removeChronicDisease(index)}>
                      <Trash2 size={16} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                  <ChronicDiseaseAutocomplete
                    value={disease.disease}
                    onChange={(value) => updateChronicDisease(index, 'disease', value)}
                    placeholder={t.diseaseName || 'Disease name'}
                  />
                  <TextInput
                    style={styles.input}
                    value={disease.age_at_diagnosis}
                    onChangeText={(value) => updateChronicDisease(index, 'age_at_diagnosis', value)}
                    placeholder={t.ageAtDiagnosis || 'Age at diagnosis'}
                  />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={disease.comments || ''}
                    onChangeText={(value) => updateChronicDisease(index, 'comments', value)}
                    placeholder={t.comments || 'Comments'}
                    multiline
                  />
                </View>
              ))}
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chronicDiseasesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  chronicDiseaseCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chronicDiseaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chronicDiseaseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
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
  chronicDiseaseItem: {
    marginBottom: 8,
  },
  chronicDiseaseComment: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
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

