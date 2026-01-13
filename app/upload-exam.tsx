import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, Upload, Calendar, User, X, CheckCircle, AlertTriangle, Stethoscope, UserCircle, FileCheck } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { HealthRecordsApiService } from '@/lib/api/health-records-api';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// Image types matching web version
const imageTypes = [
  { value: 'X-Ray', labelKey: 'xRay' },
  { value: 'Ultrasound', labelKey: 'ultrasound' },
  { value: 'MRI', labelKey: 'mri' },
  { value: 'CT Scan', labelKey: 'ctScan' },
  { value: 'ECG', labelKey: 'ecg' },
  { value: 'Others', labelKey: 'others' },
];

// Findings options
const findingsOptions = [
  { value: 'No Findings', labelKey: 'noFindings' },
  { value: 'Low Risk Findings', labelKey: 'lowRiskFindings' },
  { value: 'Relevant Findings', labelKey: 'relevantFindings' },
];

export default function UploadExamScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  
  // Form state
  const [imageDate, setImageDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageType, setImageType] = useState<string>('');
  const [bodyPart, setBodyPart] = useState<string>('');
  const [findings, setFindings] = useState<string>('No Findings');
  const [interpretation, setInterpretation] = useState<string>('');
  const [conclusions, setConclusions] = useState<string>('');
  const [doctorName, setDoctorName] = useState<string>('');
  const [doctorNumber, setDoctorNumber] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string; type: string; size?: number } | null>(null);
  
  // Upload/Analysis state
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<{ s3_key?: string; [key: string]: any } | null>(null);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showFindingsPicker, setShowFindingsPicker] = useState(false);

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
          size: asset.size || 0,
        });
        
        // Auto-upload and analyze
        await handleUploadAndAnalyze({
          uri: asset.uri,
          name: asset.name,
          type: 'application/pdf',
          size: asset.size || 0,
        });
      }
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || 'Failed to select file');
    }
  };

  const mapExamTypeToImageType = (examType: string): string => {
    if (!examType) return 'Others';
    
    const normalizedType = examType.toLowerCase().trim();
    
    if (normalizedType.includes('x-ray') || normalizedType.includes('xray') || normalizedType.includes('raio-x') || 
        normalizedType.includes('rx') || normalizedType.includes('radiograf') || normalizedType.includes('radiologic')) {
      return 'X-Ray';
    }
    
    if (normalizedType.includes('ultrasound') || normalizedType.includes('ultrason') || normalizedType.includes('ultrasonography') || 
        normalizedType.includes('ecografia') || normalizedType.includes('echografia') || normalizedType.includes('sonograf')) {
      return 'Ultrasound';
    }
    
    if (normalizedType.includes('mri') || normalizedType.includes('magnetic resonance')) {
      return 'MRI';
    }
    
    if (normalizedType.includes('ct') || normalizedType.includes('computed tomography') || normalizedType.includes('tomography')) {
      return 'CT Scan';
    }
    
    if (normalizedType.includes('ecg') || normalizedType.includes('ekg') || normalizedType.includes('electrocardiogram') || 
        normalizedType.includes('electro-cardiogr')) {
      return 'ECG';
    }
    
    return 'Others';
  };

  const handleUploadAndAnalyze = async (file?: { uri: string; name: string; type: string; size?: number }) => {
    const fileToUpload = file || selectedFile;
    if (!fileToUpload) return;

    setIsUploading(true);
    try {
      const response = await HealthRecordsApiService.uploadMedicalImage(fileToUpload);

      if (response.duplicate_found) {
        Alert.alert(
          t.duplicateFile || 'Duplicate File',
          t.duplicateFileMessage || 'A file with the same name already exists. Do you want to continue?',
          [
            { text: t.cancel || 'Cancel', style: 'cancel' },
            { text: t.continue || 'Continue', onPress: () => handleUploadAndAnalyze(fileToUpload) }
          ]
        );
        setIsUploading(false);
        return;
      }

      if (response.success) {
        const infoToUse = response.translated_info || response.extracted_info;
        setExtractedInfo({
          ...infoToUse,
          s3_key: response.s3_key,
        });
        
        // Auto-fill form with extracted data
        if (infoToUse) {
          setImageType(mapExamTypeToImageType(infoToUse.exam_type || ''));
          setBodyPart(infoToUse.body_area || '');
          setInterpretation(infoToUse.interpretation || '');
          setConclusions(infoToUse.conclusions || '');
          setDoctorName(infoToUse.doctor_name || '');
          setDoctorNumber(infoToUse.doctor_number || '');
          setFindings(infoToUse.findings || 'No Findings');
          
          if (infoToUse.date_of_exam) {
            const dateParts = infoToUse.date_of_exam.split('-');
            if (dateParts.length === 3) {
              // Convert dd-mm-yyyy or yyyy-mm-dd to Date
              let year, month, day;
              if (dateParts[0].length === 4) {
                // yyyy-mm-dd
                [year, month, day] = dateParts;
              } else {
                // dd-mm-yyyy
                [day, month, year] = dateParts;
              }
              setImageDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
            }
          }
        }
        
        Alert.alert(t.success || 'Success', t.fileUploadedAnalyzed || 'File uploaded and analyzed successfully!');
      } else {
        Alert.alert(t.error || 'Error', response.message || t.failedToAnalyze || 'Failed to analyze file');
      }
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToAnalyze || 'Failed to analyze file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!imageType || !imageDate || !selectedFile) {
      Alert.alert(
        t.validationError || 'Validation Error',
        t.fieldRequired || 'Please fill in all required fields'
      );
      return;
    }

    setIsLoading(true);
    try {
      const saveData = {
        image_type: imageType,
        body_part: bodyPart || undefined,
        image_date: new Date(imageDate).toISOString(),
        interpretation: interpretation || undefined,
        conclusions: conclusions || undefined,
        doctor_name: doctorName || undefined,
        doctor_number: doctorNumber || undefined,
        original_filename: selectedFile.name,
        file_size_bytes: selectedFile.size || 0,
        content_type: selectedFile.type,
        s3_key: extractedInfo?.s3_key || '',
        findings: findings || 'No Findings',
      };

      const response = await HealthRecordsApiService.saveMedicalImage(saveData);

      if (response.success) {
        Alert.alert(
          t.success || 'Success',
          t.medicalImageSavedSuccess || 'Medical exam saved successfully!',
          [{ text: t.ok || 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert(t.error || 'Error', response.message || t.failedToSave || 'Failed to save');
      }
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToSave || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.uploadMedicalExam || 'Upload Medical Exam'}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>{t.examDetails || 'Exam Details'}</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t.imageType || 'Image Type'} <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowTypePicker(true)}
              disabled={isLoading || isUploading}
            >
              <Text style={[styles.selectButtonText, !imageType && styles.selectButtonPlaceholder]}>
                {imageType || (t.selectImageType || 'Select Image Type')}
              </Text>
              <Stethoscope size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t.bodyPart || 'Body Part'}</Text>
            <View style={styles.inputContainer}>
              <FileCheck size={20} color={Colors.primary} />
              <TextInput
                style={styles.input}
                placeholder={t.bodyPartPlaceholder || 'e.g., Chest, Upper abdomen'}
                value={bodyPart}
                onChangeText={setBodyPart}
                editable={!isLoading && !isUploading}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t.imageDate || 'Image Date'} <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => setShowDatePicker(true)}
              disabled={isLoading || isUploading}
            >
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.dateInput}>
                {formatDate(imageDate)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={imageDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setImageDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t.findings || 'Findings'}</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowFindingsPicker(true)}
              disabled={isLoading || isUploading}
            >
              <Text style={styles.selectButtonText}>
                {findingsOptions.find(opt => opt.value === findings)?.value || findings}
              </Text>
              <FileText size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t.interpretation || 'Interpretation'}</Text>
            <TextInput
              style={styles.notesInput}
              placeholder={t.interpretationPlaceholder || 'Medical interpretation of the image...'}
              value={interpretation}
              onChangeText={setInterpretation}
              multiline
              numberOfLines={4}
              editable={!isLoading && !isUploading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t.conclusions || 'Conclusions'}</Text>
            <TextInput
              style={styles.notesInput}
              placeholder={t.conclusionsPlaceholder || 'Conclusions and findings...'}
              value={conclusions}
              onChangeText={setConclusions}
              multiline
              numberOfLines={3}
              editable={!isLoading && !isUploading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t.doctorName || 'Doctor Name'}</Text>
            <View style={styles.inputContainer}>
              <UserCircle size={20} color={Colors.primary} />
              <TextInput
                style={styles.input}
                placeholder={t.doctorNamePlaceholder || "Doctor's name"}
                value={doctorName}
                onChangeText={setDoctorName}
                editable={!isLoading && !isUploading}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t.doctorNumber || 'Doctor Number'}</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={Colors.primary} />
              <TextInput
                style={styles.input}
                placeholder={t.doctorNumberPlaceholder || "Doctor's license number"}
                value={doctorNumber}
                onChangeText={setDoctorNumber}
                editable={!isLoading && !isUploading}
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
              disabled={isLoading || isUploading}
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
            {isUploading && (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.uploadingText}>{t.uploadingAnalyzing || 'Uploading and analyzing...'}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!imageType || !imageDate || !selectedFile || isLoading || isUploading) &&
                styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!imageType || !imageDate || !selectedFile || isLoading || isUploading}
          >
            {isLoading ? (
              <>
                <ActivityIndicator color={Colors.background} style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>{t.saving || 'Saving...'}</Text>
              </>
            ) : (
              <Text style={styles.saveButtonText}>{t.saveImage || 'Save Exam'}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Type Picker Modal */}
      <Modal visible={showTypePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.selectImageType || 'Select Image Type'}</Text>
              <TouchableOpacity onPress={() => setShowTypePicker(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {imageTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    imageType === type.value && styles.typeOptionSelected,
                  ]}
                  onPress={() => {
                    setImageType(type.value);
                    setShowTypePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      imageType === type.value && styles.typeOptionTextSelected,
                    ]}
                  >
                    {t[type.labelKey as keyof typeof t] || type.value}
                  </Text>
                  {imageType === type.value && (
                    <CheckCircle size={20} color={Colors.background} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Findings Picker Modal */}
      <Modal visible={showFindingsPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.selectFindings || 'Select Findings'}</Text>
              <TouchableOpacity onPress={() => setShowFindingsPicker(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {findingsOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.typeOption,
                    findings === option.value && styles.typeOptionSelected,
                  ]}
                  onPress={() => {
                    setFindings(option.value);
                    setShowFindingsPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      findings === option.value && styles.typeOptionTextSelected,
                    ]}
                  >
                    {t[option.labelKey as keyof typeof t] || option.value}
                  </Text>
                  {findings === option.value && (
                    <CheckCircle size={20} color={Colors.background} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    minHeight: 80,
    textAlignVertical: 'top',
    color: Colors.text,
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
    backgroundColor: `${Colors.primary}20`,
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
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  uploadingText: {
    fontSize: 14,
    color: Colors.primary,
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
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  typeOptionSelected: {
    backgroundColor: `${Colors.primary}20`,
  },
  typeOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  typeOptionTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
