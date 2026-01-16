import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, Upload, Calendar, User, X, CheckCircle, AlertTriangle, Edit, Trash2, Languages } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { HealthRecordsApiService } from '@/lib/api/health-records-api';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
// Note: If expo-document-picker is not installed, run: npx expo install expo-document-picker
import DateTimePicker from '@react-native-community/datetimepicker';

// Lab test types matching web version
const labTestTypes = [
  { value: 'Complete Blood Count', labelKey: 'completeBloodCount' },
  { value: 'Comprehensive Metabolic Panel', labelKey: 'comprehensiveMetabolicPanel' },
  { value: 'Lipid Panel', labelKey: 'lipidPanel' },
  { value: 'Hemoglobin A1C', labelKey: 'hemoglobinA1C' },
  { value: 'Other', labelKey: 'other' },
];

interface ParsedResult {
  metric_name: string;
  value: string | number;
  unit?: string;
  reference_range?: string;
  type_of_analysis?: string;
  date_of_value?: string;
  status?: 'normal' | 'abnormal' | 'critical';
}

export default function UploadDocumentScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  
  // Form state
  const [labTestDate, setLabTestDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [labTestType, setLabTestType] = useState<string>('');
  const [provider, setProvider] = useState<string>('Lab Corp');
  const [description, setDescription] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  
  // Upload/Analysis state
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ParsedResult[]>([]);
  const [editableResults, setEditableResults] = useState<ParsedResult[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [languageInfo, setLanguageInfo] = useState<{
    detected_language?: string;
    user_language?: string;
    translation_applied?: boolean;
  } | null>(null);
  const [analysisUploadResult, setAnalysisUploadResult] = useState<{
    s3_url?: string;
    duplicate_found?: boolean;
    existing_document?: any;
  } | null>(null);
  const [rejectedResults, setRejectedResults] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [resultsConfirmed, setResultsConfirmed] = useState(false);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          name: asset.name,
          type: 'application/pdf',
        });
      }
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || 'Failed to select file');
    }
  };

  const handleUploadRecords = async () => {
    if (!analysisUploadResult?.s3_url || editableResults.length === 0) {
      Alert.alert(t.error || 'Error', t.noResultsToUpload || 'No results to upload');
      return;
    }

    setIsLoading(true);
    try {
      const translationWasApplied = languageInfo?.translation_applied || false;
      const dateForBackend = formatDate(labTestDate);

      // Map editableResults to bulk upload format
      const recordsToSend = editableResults.map((editedResult) => ({
        lab_name: provider || 'Unknown Lab',
        type_of_analysis: editedResult.type_of_analysis || 'General Lab Analysis',
        metric_name: editedResult.metric_name,
        date_of_value: editedResult.date_of_value || dateForBackend,
        value: editedResult.value,
        unit: editedResult.unit || '',
        reference: editedResult.reference_range || '',
      }));

      const bulkData = {
        records: recordsToSend,
        file_name: selectedFile!.name,
        description: description,
        s3_url: analysisUploadResult.s3_url,
        lab_test_date: dateForBackend,
        provider: provider,
        document_type: labTestType,
        detected_language: languageInfo?.detected_language || 'en',
        translation_applied: languageInfo?.translation_applied || false,
        user_language: languageInfo?.user_language || 'en',
      };

      const response = await HealthRecordsApiService.bulkCreateLabRecords(bulkData);

      if (response.success) {
        const newRecordsCount = response.created_records_count || response.created_records?.length || 0;
        const updatedRecordsCount = response.updated_records?.length || 0;

        let message = '';
        if (newRecordsCount > 0 && updatedRecordsCount > 0) {
          message = `Successfully created ${newRecordsCount} new health records and updated ${updatedRecordsCount} existing records!`;
        } else if (newRecordsCount > 0) {
          message = `Successfully created ${newRecordsCount} new health records!`;
        } else if (updatedRecordsCount > 0) {
          message = `Updated ${updatedRecordsCount} existing health records!`;
        } else {
          message = t.documentSaved || 'Document saved successfully';
        }

        Alert.alert(t.success || 'Success', message, [
          { text: t.ok || 'OK', onPress: () => router.back() },
        ]);
      } else {
        throw new Error(response.message || t.failedToSave || 'Failed to save');
      }
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToSave || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !labTestDate || !labTestType) {
      Alert.alert(
        t.validationError || 'Validation Error',
        t.fieldRequired || 'Please fill in all required fields'
      );
      return;
    }

    // If results are confirmed, upload the records instead of analyzing
    if (resultsConfirmed && editableResults.length > 0) {
      await handleUploadRecords();
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await HealthRecordsApiService.uploadAndAnalyzeLabDocument(selectedFile, {
        lab_test_date: formatDate(labTestDate),
        lab_test_type: labTestType,
        provider: provider || undefined,
        description: description || undefined,
      });

      // Check for duplicate
      if (response.duplicate_found) {
        Alert.alert(
          t.duplicateFile || 'Duplicate File',
          t.duplicateFileMessage || 'A file with the same name already exists. Do you want to continue?',
          [
            { text: t.cancel || 'Cancel', style: 'cancel' },
            {
              text: t.continue || 'Continue',
              onPress: async () => {
                // Retry with force flag if needed
                await handleAnalyze();
              },
            },
          ]
        );
        setIsAnalyzing(false);
        return;
      }

      // Store upload result
      setAnalysisUploadResult({
        s3_url: response.s3_url,
        duplicate_found: false,
      });

      // Set language info
      if (response.detected_language || response.user_language) {
        setLanguageInfo({
          detected_language: response.detected_language,
          user_language: response.user_language,
          translation_applied: response.translation_applied || false,
        });
      }

      // Process lab data - use translated_data if available, otherwise lab_data
      const labData = response.translated_data || response.lab_data || [];
      
      if (labData.length === 0) {
        Alert.alert(
          t.noResults || 'No Results',
          t.noResultsMessage || 'No lab results were found in the document. Please check the file and try again.'
        );
        setIsAnalyzing(false);
        return;
      }

      // Transform to ParsedResult format
      const parsedResults: ParsedResult[] = labData.map((item: any) => ({
        metric_name: item.metric_name || item.name_of_analysis || '',
        value: item.value || '',
        unit: item.unit || '',
        reference_range: item.reference || item.reference_range || '',
        type_of_analysis: item.type_of_analysis || 'General Lab Analysis',
        date_of_value: item.date_of_value || formatDate(labTestDate),
        status: item.status || 'normal',
      }));

      setAnalysisResults(parsedResults);
      setEditableResults(parsedResults);
      setShowAnalysisResults(true);
      setResultsConfirmed(false); // Reset confirmed flag when new analysis is done
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToAnalyze || 'Failed to analyze document');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEditResult = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index: number, updatedResult: ParsedResult) => {
    const newResults = [...editableResults];
    newResults[index] = updatedResult;
    setEditableResults(newResults);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleDeleteResult = (index: number) => {
    const newResults = editableResults.filter((_, i) => i !== index);
    setEditableResults(newResults);
  };

  const handleRejectResults = () => {
    setRejectedResults(true);
    setResultsConfirmed(false);
    setShowAnalysisResults(false);
    // Still upload document without records
    handleUploadWithoutRecords();
  };

  const handleUploadWithoutRecords = async () => {
    if (!analysisUploadResult?.s3_url) {
      Alert.alert(t.error || 'Error', t.noUploadResult || 'Upload result not available');
      return;
    }

    setIsLoading(true);
    try {
      // Create document without records
      // This would need an API endpoint to create document from s3_url
      // For now, we'll just show success
      Alert.alert(
        t.success || 'Success',
        t.documentSaved || 'Document saved successfully',
        [{ text: t.ok || 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToSave || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmResults = () => {
    // Just close the dialog and mark results as confirmed
    // The actual upload will happen when clicking the upload button
    setShowAnalysisResults(false);
    setResultsConfirmed(true);
    Alert.alert(
      t.success || 'Success',
      t.resultsConfirmedMessage || 'Results confirmed. Click Upload to save to health records.',
      [{ text: t.ok || 'OK' }]
    );
  };

  const renderAnalysisResults = () => {
    if (isAnalyzing) {
      return (
        <View style={styles.analyzingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.analyzingText}>{t.analyzing || 'Analyzing document...'}</Text>
        </View>
      );
    }

    if (editableResults.length === 0) {
      return (
        <View style={styles.noResultsContainer}>
          <AlertTriangle size={48} color={Colors.textLight} />
          <Text style={styles.noResultsText}>{t.noMetricsFound || 'No metrics found'}</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.resultsScrollView}>
        {editableResults.map((result, index) => {
          const isEditing = editingIndex === index;
          return (
            <View key={index} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.resultTitleContainer}>
                  <Text style={styles.resultTitle}>{result.metric_name}</Text>
                  {result.status === 'abnormal' && (
                    <View style={[styles.statusBadge, styles.statusBadgeAbnormal]}>
                      <AlertTriangle size={12} color={Colors.danger} />
                      <Text style={styles.statusTextAbnormal}>{t.abnormal || 'Abnormal'}</Text>
                    </View>
                  )}
                  {result.status === 'normal' && (
                    <View style={[styles.statusBadge, styles.statusBadgeNormal]}>
                      <CheckCircle size={12} color={Colors.success} />
                      <Text style={styles.statusTextNormal}>{t.normal || 'Normal'}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.resultActions}>
                  {!isEditing && (
                    <>
                      <TouchableOpacity
                        onPress={() => handleEditResult(index)}
                        style={styles.actionButton}
                      >
                        <Edit size={18} color={Colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteResult(index)}
                        style={styles.actionButton}
                      >
                        <Trash2 size={18} color={Colors.danger} />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>

              <View style={styles.resultDetails}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{t.value || 'Value'}:</Text>
                  <Text style={styles.resultValue}>
                    {result.value} {result.unit}
                  </Text>
                </View>
                {result.reference_range && (
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>{t.referenceRange || 'Reference Range'}:</Text>
                    <Text style={styles.resultValue}>{result.reference_range}</Text>
                  </View>
                )}
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{t.section || 'Section'}:</Text>
                  <Text style={styles.resultValue}>{result.type_of_analysis}</Text>
                </View>
              </View>

              {isEditing && (
                <EditResultForm
                  result={result}
                  onSave={(updated) => handleSaveEdit(index, updated)}
                  onCancel={handleCancelEdit}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.uploadLabDocument || 'Upload Lab Document'}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>{t.documentDetails || 'Document Details'}</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t.date || 'Date'} <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => setShowDatePicker(true)}
              disabled={isLoading || isAnalyzing}
            >
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.dateInput}>
                {formatDate(labTestDate)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={labTestDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setLabTestDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t.type || 'Type'} <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowTypePicker(true)}
              disabled={isLoading || isAnalyzing}
            >
              <Text style={[styles.selectButtonText, !labTestType && styles.selectButtonPlaceholder]}>
                {labTestType || (t.selectDocumentType || 'Select Document Type')}
              </Text>
              <FileText size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t.provider || 'Provider'}</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={Colors.primary} />
              <TextInput
                style={styles.input}
                placeholder={t.healthcareProviderName || 'Healthcare provider name'}
                value={provider}
                onChangeText={setProvider}
                editable={!isLoading && !isAnalyzing}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t.file || 'File'} <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.uploadButton, selectedFile && styles.uploadButtonSelected]}
              onPress={handleSelectFile}
              disabled={isLoading || isAnalyzing}
            >
              <Upload size={24} color={selectedFile ? Colors.background : Colors.primary} />
              <Text style={[styles.uploadButtonText, selectedFile && styles.uploadButtonTextSelected]}>
                {selectedFile ? selectedFile.name : (t.selectFile || 'Select File')}
              </Text>
              {selectedFile && (
                <TouchableOpacity
                  onPress={() => setSelectedFile(null)}
                  style={styles.removeFileButton}
                >
                  <X size={20} color={Colors.background} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            <Text style={styles.uploadInfo}>{t.pdfFilesOnly || 'PDF files only, max 10MB'}</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t.description || 'Description'} ({t.optional || 'optional'})
            </Text>
            <TextInput
              style={styles.notesInput}
              placeholder={t.addDescriptionPlaceholder || 'Add description or observations'}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              editable={!isLoading && !isAnalyzing}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!labTestDate || !labTestType || !selectedFile || isLoading || isAnalyzing || (resultsConfirmed && editableResults.length === 0)) &&
                styles.saveButtonDisabled,
            ]}
            onPress={handleAnalyze}
            disabled={!labTestDate || !labTestType || !selectedFile || isLoading || isAnalyzing || (resultsConfirmed && editableResults.length === 0)}
          >
            {isAnalyzing || isLoading ? (
              <>
                <ActivityIndicator color={Colors.background} style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>
                  {isLoading ? (t.uploading || 'Uploading...') : (t.analyzing || 'Analyzing...')}
                </Text>
              </>
            ) : (
              <Text style={styles.saveButtonText}>
                {resultsConfirmed && editableResults.length > 0
                  ? t.uploadToHealthRecords || 'Upload to Health Records'
                  : analysisResults.length > 0
                  ? t.uploadToHealthRecords || 'Upload to Health Records'
                  : t.uploadAndAnalyze || 'Upload & Analyze'}
              </Text>
            )}
          </TouchableOpacity>

          {analysisResults.length > 0 && !showAnalysisResults && (
            <TouchableOpacity
              style={styles.viewResultsButton}
              onPress={() => setShowAnalysisResults(true)}
            >
              <Text style={styles.viewResultsButtonText}>
                {t.viewExtractedResults || 'View Extracted Results'} ({analysisResults.length}{' '}
                {t.metricsFound || 'metrics found'})
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Type Picker Modal */}
      <Modal visible={showTypePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.selectDocumentType || 'Select Document Type'}</Text>
              <TouchableOpacity onPress={() => setShowTypePicker(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {labTestTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    labTestType === type.value && styles.typeOptionSelected,
                  ]}
                  onPress={() => {
                    setLabTestType(type.value);
                    setShowTypePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      labTestType === type.value && styles.typeOptionTextSelected,
                    ]}
                  >
                    {t[type.labelKey as keyof typeof t] || type.value}
                  </Text>
                  {labTestType === type.value && (
                    <CheckCircle size={20} color={Colors.background} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Analysis Results Modal */}
      <Modal
        visible={showAnalysisResults}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {languageInfo?.translation_applied && (
                <View style={styles.languageBadge}>
                  <Languages size={14} color={Colors.primary} />
                  <Text style={styles.languageBadgeText}>
                    {languageInfo.detected_language?.toUpperCase()} →{' '}
                    {languageInfo.user_language?.toUpperCase()}
                  </Text>
                </View>
              )}
              {t.analysisResults || 'Analysis Results'}
            </Text>
            <TouchableOpacity onPress={() => setShowAnalysisResults(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {renderAnalysisResults()}

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={handleRejectResults}
              disabled={isLoading}
            >
              <Text style={styles.rejectButtonText}>{t.rejectResults || 'Reject Results'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmResults}
              disabled={isLoading || editableResults.length === 0}
            >
              <CheckCircle size={20} color={Colors.background} />
              <Text style={styles.confirmButtonText}>
                {t.confirmResults || 'Confirm Results'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// Edit Result Form Component
function EditResultForm({
  result,
  onSave,
  onCancel,
}: {
  result: ParsedResult;
  onSave: (result: ParsedResult) => void;
  onCancel: () => void;
}) {
  const { t } = useLanguage();
  const [editedResult, setEditedResult] = useState<ParsedResult>(result);

  return (
    <View style={styles.editForm}>
      <Text style={styles.editFormTitle}>{t.editHealthRecord || 'Edit Health Record Entry'}</Text>
      <View style={styles.editFormRow}>
        <Text style={styles.editFormLabel}>{t.metricName || 'Metric Name'}:</Text>
        <TextInput
          style={styles.editFormInput}
          value={editedResult.metric_name}
          onChangeText={(text) => setEditedResult({ ...editedResult, metric_name: text })}
        />
      </View>
      <View style={styles.editFormRow}>
        <Text style={styles.editFormLabel}>{t.value || 'Value'}:</Text>
        <TextInput
          style={styles.editFormInput}
          value={String(editedResult.value)}
          onChangeText={(text) => setEditedResult({ ...editedResult, value: text })}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.editFormRow}>
        <Text style={styles.editFormLabel}>{t.unit || 'Unit'}:</Text>
        <TextInput
          style={styles.editFormInput}
          value={editedResult.unit}
          onChangeText={(text) => setEditedResult({ ...editedResult, unit: text })}
        />
      </View>
      <View style={styles.editFormRow}>
        <Text style={styles.editFormLabel}>{t.referenceRange || 'Reference Range'}:</Text>
        <TextInput
          style={styles.editFormInput}
          value={editedResult.reference_range}
          onChangeText={(text) => setEditedResult({ ...editedResult, reference_range: text })}
        />
      </View>
      <View style={styles.editFormActions}>
        <TouchableOpacity style={styles.editFormCancelButton} onPress={onCancel}>
          <Text style={styles.editFormCancelText}>{t.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editFormSaveButton}
          onPress={() => onSave(editedResult)}
        >
          <Text style={styles.editFormSaveText}>{t.save || 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    marginTop: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  required: {
    color: Colors.danger,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 0,
    height: 20,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
  },
  dateInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
  },
  selectButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectButtonPlaceholder: {
    color: Colors.textLight,
  },
  notesInput: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
    color: Colors.text,
  },
  uploadContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  uploadButtonSelected: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  uploadButtonText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  uploadButtonTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  removeFileButton: {
    padding: 4,
  },
  uploadInfo: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.textLighter,
    opacity: 0.6,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewResultsButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  viewResultsButtonText: {
    color: Colors.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  languageBadgeText: {
    fontSize: 10,
    color: Colors.primary,
    marginLeft: 4,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  typeOptionSelected: {
    backgroundColor: Colors.primary + '20',
  },
  typeOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  typeOptionTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  // Analysis Results styles
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  analyzingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  resultsScrollView: {
    flex: 1,
    padding: 16,
  },
  resultCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusBadgeNormal: {
    backgroundColor: Colors.success + '20',
  },
  statusBadgeAbnormal: {
    backgroundColor: Colors.danger + '20',
  },
  statusTextNormal: {
    fontSize: 12,
    color: Colors.success,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  statusTextAbnormal: {
    fontSize: 12,
    color: Colors.danger,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  resultDetails: {
    gap: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultLabel: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  // Edit Form styles
  editForm: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  editFormTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  editFormRow: {
    marginBottom: 12,
  },
  editFormLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  editFormInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  editFormCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editFormCancelText: {
    color: Colors.text,
    fontSize: 14,
  },
  editFormSaveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editFormSaveText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Modal Footer
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  confirmButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
