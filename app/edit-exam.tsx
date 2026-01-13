import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Stethoscope, FileCheck, UserCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { HealthRecordsApiService, MedicalImageData } from '@/lib/api/health-records-api';
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

export default function EditExamScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useLanguage();
  const examId = params.id ? parseInt(params.id as string) : null;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageDate, setImageDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageType, setImageType] = useState<string>('');
  const [bodyPart, setBodyPart] = useState<string>('');
  const [findings, setFindings] = useState<string>('No Findings');
  const [interpretation, setInterpretation] = useState<string>('');
  const [conclusions, setConclusions] = useState<string>('');
  const [doctorName, setDoctorName] = useState<string>('');
  const [doctorNumber, setDoctorNumber] = useState<string>('');
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showFindingsPicker, setShowFindingsPicker] = useState(false);

  useEffect(() => {
    loadExam();
  }, [examId]);

  const loadExam = async () => {
    if (!examId) {
      Alert.alert(t.error || 'Error', t.examNotFound || 'Exam not found');
      router.back();
      return;
    }

    setIsLoading(true);
    try {
      const response = await HealthRecordsApiService.getMedicalImages(0, 1000);
      const exam = response.images.find((img: MedicalImageData) => img.id === examId);
      
      if (exam) {
        setImageType(exam.image_type || '');
        setBodyPart(exam.body_part || '');
        setFindings(exam.findings || 'No Findings');
        setInterpretation(exam.interpretation || '');
        setConclusions(exam.conclusions || '');
        setDoctorName(exam.doctor_name || '');
        setDoctorNumber(exam.doctor_number || '');
        if (exam.image_date) {
          setImageDate(new Date(exam.image_date));
        }
      } else {
        Alert.alert(t.error || 'Error', t.examNotFound || 'Exam not found');
        router.back();
      }
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || 'Failed to load exam');
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
    if (!examId) return;

    if (!imageType || !imageDate) {
      Alert.alert(
        t.validationError || 'Validation Error',
        t.fieldRequired || 'Please fill in all required fields'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await HealthRecordsApiService.updateMedicalImage(examId, {
        image_type: imageType,
        body_part: bodyPart || undefined,
        findings: findings || 'No Findings',
        interpretation: interpretation || undefined,
        conclusions: conclusions || undefined,
        doctor_name: doctorName || undefined,
        doctor_number: doctorNumber || undefined,
      });

      Alert.alert(
        t.save || 'Success',
        t.examUpdatedSuccessfully || 'Exam updated successfully!',
        [
          {
            text: t.confirm || 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || 'Failed to update exam');
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
          <Text style={styles.headerTitle}>{t.editExam || 'Edit Exam'}</Text>
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
        <Text style={styles.headerTitle}>{t.editExam || 'Edit Exam'}</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>{t.examDetails || 'Exam Details'}</Text>

        {/* Image Type - Required */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t.imageType || 'Image Type'} <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowTypePicker(true)}
            disabled={isSubmitting}
          >
            <Text style={[styles.selectButtonText, !imageType && styles.selectButtonPlaceholder]}>
              {imageType || (t.selectImageType || 'Select Image Type')}
            </Text>
            <Stethoscope size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Body Part */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.bodyPart || 'Body Part'}</Text>
          <View style={styles.inputContainer}>
            <FileCheck size={20} color={Colors.primary} />
            <TextInput
              style={styles.input}
              placeholder={t.bodyPartPlaceholder || 'e.g., Chest, Upper abdomen'}
              value={bodyPart}
              onChangeText={setBodyPart}
              editable={!isSubmitting}
            />
          </View>
        </View>

        {/* Image Date - Required */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t.imageDate || 'Image Date'} <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dateInputContainer}
            onPress={() => setShowDatePicker(true)}
            disabled={isSubmitting}
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

        {/* Findings */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.findings || 'Findings'}</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowFindingsPicker(true)}
            disabled={isSubmitting}
          >
            <Text style={styles.selectButtonText}>
              {findingsOptions.find(opt => opt.value === findings) 
                ? t[findingsOptions.find(opt => opt.value === findings)!.labelKey as keyof typeof t] || findings
                : findings}
            </Text>
            <Stethoscope size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Interpretation */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.interpretation || 'Interpretation'}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t.interpretationPlaceholder || 'Enter interpretation'}
            value={interpretation}
            onChangeText={setInterpretation}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isSubmitting}
          />
        </View>

        {/* Conclusions */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.conclusions || 'Conclusions'}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t.conclusionsPlaceholder || 'Enter conclusions'}
            value={conclusions}
            onChangeText={setConclusions}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isSubmitting}
          />
        </View>

        {/* Doctor Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.doctorName || 'Doctor Name'}</Text>
          <View style={styles.inputContainer}>
            <UserCircle size={20} color={Colors.primary} />
            <TextInput
              style={styles.input}
              placeholder={t.doctorNamePlaceholder || "Doctor's name"}
              value={doctorName}
              onChangeText={setDoctorName}
              editable={!isSubmitting}
            />
          </View>
        </View>

        {/* Doctor Number */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.doctorNumber || 'Doctor Number'}</Text>
          <View style={styles.inputContainer}>
            <UserCircle size={20} color={Colors.primary} />
            <TextInput
              style={styles.input}
              placeholder={t.doctorNumberPlaceholder || "Doctor's number"}
              value={doctorNumber}
              onChangeText={setDoctorNumber}
              editable={!isSubmitting}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[
            styles.saveButton,
            (isSubmitting || !imageType || !imageDate) && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={isSubmitting || !imageType || !imageDate}
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
            <Text style={styles.modalTitle}>{t.selectImageType || 'Select Image Type'}</Text>
            {imageTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.modalOption,
                  imageType === type.value && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setImageType(type.value);
                  setShowTypePicker(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  imageType === type.value && styles.modalOptionTextSelected
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

      {/* Findings Picker Modal */}
      <Modal
        visible={showFindingsPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFindingsPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.selectFindings || 'Select Findings'}</Text>
            {findingsOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  findings === option.value && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setFindings(option.value);
                  setShowFindingsPicker(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  findings === option.value && styles.modalOptionTextSelected
                ]}>
                  {t[option.labelKey as keyof typeof t] || option.value}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowFindingsPicker(false)}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
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
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 48,
  },
  selectButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectButtonPlaceholder: {
    color: Colors.textLight,
  },
  inputContainer: {
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
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  dateInputContainer: {
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
  dateInput: {
    fontSize: 16,
    color: Colors.text,
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
