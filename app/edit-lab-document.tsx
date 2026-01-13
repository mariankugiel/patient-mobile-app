import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { HealthRecordsApiService } from '@/lib/api/health-records-api';
import DateTimePicker from '@react-native-community/datetimepicker';

// Lab test types matching web version
const labTestTypes = [
  { value: 'Complete Blood Count', labelKey: 'completeBloodCount' },
  { value: 'Comprehensive Metabolic Panel', labelKey: 'comprehensiveMetabolicPanel' },
  { value: 'Lipid Panel', labelKey: 'lipidPanel' },
  { value: 'Hemoglobin A1C', labelKey: 'hemoglobinA1C' },
  { value: 'Other', labelKey: 'other' },
];

export default function EditLabDocumentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useLanguage();
  const documentId = params.id ? parseInt(params.id as string) : null;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labTestDate, setLabTestDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [labTestType, setLabTestType] = useState<string>('');
  const [provider, setProvider] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [showTypePicker, setShowTypePicker] = useState(false);

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    if (!documentId) {
      Alert.alert(t.error || 'Error', t.documentNotFound || 'Document not found');
      router.back();
      return;
    }

    setIsLoading(true);
    try {
      const documents = await HealthRecordsApiService.getMedicalDocuments(0, 1000);
      const doc = documents.find((d: any) => d.id === documentId);
      
      if (doc) {
        setLabTestType(doc.lab_doc_type || '');
        setProvider(doc.provider || '');
        setDescription(doc.description || '');
        if (doc.lab_test_date) {
          setLabTestDate(new Date(doc.lab_test_date));
        }
      } else {
        Alert.alert(t.error || 'Error', t.documentNotFound || 'Document not found');
        router.back();
      }
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || 'Failed to load document');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    if (!documentId) return;

    if (!labTestType || !labTestDate) {
      Alert.alert(
        t.validationError || 'Validation Error',
        t.fieldRequired || 'Please fill in all required fields'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Note: This assumes an update API endpoint exists
      // If not, you may need to add it to HealthRecordsApiService
      await HealthRecordsApiService.updateMedicalDocument(documentId, {
        lab_test_date: formatDate(labTestDate),
        lab_doc_type: labTestType,
        provider: provider || undefined,
        description: description || undefined,
      });

      Alert.alert(
        t.save || 'Success',
        t.documentUpdatedSuccessfully || 'Document updated successfully!',
        [
          {
            text: t.confirm || 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || 'Failed to update document');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.editLabDocument || 'Edit Lab Document'}</Text>
          <View style={styles.spacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isSubmitting}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.editLabDocument || 'Edit Lab Document'}</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date - Required */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t.labTestDate || 'Test Date'} <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
            disabled={isSubmitting}
          >
            <Calendar size={20} color={Colors.primary} />
            <Text style={styles.dateText}>
              {labTestDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={labTestDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setLabTestDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        {/* Type - Required */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t.type || 'Type'} <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTypePicker(true)}
            disabled={isSubmitting}
          >
            <Text style={[styles.inputText, !labTestType && styles.placeholder]}>
              {labTestType || t.selectDocumentType || 'Select Document Type'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Provider - Optional */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t.provider || 'Provider'} <Text style={styles.optional}>({t.optional || 'optional'})</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t.healthcareProviderName || 'Healthcare provider name'}
            value={provider}
            onChangeText={setProvider}
            editable={!isSubmitting}
          />
        </View>

        {/* Description - Optional */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t.description || 'Description'} <Text style={styles.optional}>({t.optional || 'optional'})</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t.addDescriptionPlaceholder || 'Add description or observations'}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isSubmitting}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[
            styles.saveButton,
            (isSubmitting || !labTestType || !labTestDate) && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={isSubmitting || !labTestType || !labTestDate}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color={Colors.background} />
              <Text style={styles.saveButtonText}>{t.saving || 'Saving...'}</Text>
            </>
          ) : (
            <Text style={styles.saveButtonText}>
              {t.save || 'Save Changes'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Type Picker Modal */}
      <Modal
        visible={showTypePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTypePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.selectDocumentType || 'Select Document Type'}</Text>
            {labTestTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.modalOption,
                  labTestType === type.value && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setLabTestType(type.value);
                  setShowTypePicker(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  labTestType === type.value && styles.modalOptionTextSelected
                ]}>
                  {t[type.labelKey as keyof typeof t] || type.value}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowTypePicker(false)}
            >
              <Text style={styles.modalCancelText}>{t.cancel || 'Cancel'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  spacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: {
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
  optional: {
    color: Colors.textLight,
    fontWeight: 'normal',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 48,
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 48,
  },
  inputText: {
    fontSize: 16,
    color: Colors.text,
  },
  placeholder: {
    color: Colors.textLight,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    marginTop: 32,
    gap: 8,
    minHeight: 50,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.primary,
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  modalOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.secondary,
  },
  modalOptionSelected: {
    backgroundColor: Colors.primary,
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  modalOptionTextSelected: {
    color: Colors.background,
    fontWeight: '600',
  },
  modalCancelButton: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});
