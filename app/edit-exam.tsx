import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Stethoscope, FileCheck, UserCircle, User, FileText, X, CheckCircle } from 'lucide-react-native';
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
      // Use the single exam endpoint instead of fetching all exams
      const exam = await HealthRecordsApiService.getMedicalImageById(examId);
      
      // Safely set all fields, truncating where necessary to match backend constraints
      setImageType(exam.image_type || '');
      
      // Truncate body_part to 100 characters to match database constraint
      const bodyPartValue = exam.body_part || '';
      setBodyPart(bodyPartValue.length > 100 ? bodyPartValue.substring(0, 100) : bodyPartValue);
      
      // Set findings (should be an enum value)
      const findingsValue = exam.findings || 'No Findings';
      setFindings(findingsValue);
      
      // Set text fields (interpretation and conclusions can be long, no truncation needed)
      setInterpretation(exam.interpretation || '');
      setConclusions(exam.conclusions || '');
      
      // Truncate doctor_name to 200 characters (database limit)
      const doctorNameValue = exam.doctor_name || '';
      setDoctorName(doctorNameValue.length > 200 ? doctorNameValue.substring(0, 200) : doctorNameValue);
      
      // Truncate doctor_number to 50 characters (database limit)
      const doctorNumberValue = exam.doctor_number || '';
      setDoctorNumber(doctorNumberValue.length > 50 ? doctorNumberValue.substring(0, 50) : doctorNumberValue);
      
      if (exam.image_date) {
        try {
          setImageDate(new Date(exam.image_date));
        } catch (dateError) {
          // If date parsing fails, use current date
          setImageDate(new Date());
        }
      }
    } catch (error: any) {
      // Ensure error message is always a string
      const errorMessage = error?.message || error?.toString() || 'Failed to load exam';
      const message = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);
      Alert.alert(t.error || 'Error', message);
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
      // Truncate all fields to match backend constraints before sending
      const truncatedBodyPart = bodyPart ? bodyPart.substring(0, 100) : undefined;
      const truncatedDoctorName = doctorName ? doctorName.substring(0, 200) : undefined;
      const truncatedDoctorNumber = doctorNumber ? doctorNumber.substring(0, 50) : undefined;
      
      // Ensure findings is valid
      const validFindings = findings || 'No Findings';
      
      await HealthRecordsApiService.updateMedicalImage(examId, {
        image_type: imageType,
        body_part: truncatedBodyPart,
        findings: validFindings,
        interpretation: interpretation || undefined,
        conclusions: conclusions || undefined,
        doctor_name: truncatedDoctorName,
        doctor_number: truncatedDoctorNumber,
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
      // Ensure error message is always a string
      let errorMessage = 'Failed to update exam';
      if (error?.message) {
        errorMessage = typeof error.message === 'string' ? error.message : String(error.message);
      } else if (error?.toString) {
        errorMessage = error.toString();
      }
      Alert.alert(t.error || 'Error', errorMessage);
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
          <View style={{ width: 24 }} />
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
        <View style={{ width: 24 }} />
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
              onChangeText={(text) => {
                // Limit to 100 characters to match database constraint
                if (text.length <= 100) {
                  setBodyPart(text);
                } else {
                  // Truncate and show warning
                  setBodyPart(text.substring(0, 100));
                  Alert.alert(
                    t.validationError || 'Validation Error',
                    t.bodyPartMaxLength || 'Body part is limited to 100 characters'
                  );
                }
              }}
              maxLength={100}
              editable={!isSubmitting}
            />
          </View>
          {bodyPart.length > 90 && (
            <Text style={styles.characterCount}>
              {bodyPart.length}/100 {t.characters || 'characters'}
            </Text>
          )}
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
            <FileText size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Interpretation */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.interpretation || 'Interpretation'}</Text>
          <TextInput
            style={styles.notesInput}
            placeholder={t.interpretationPlaceholder || 'Medical interpretation of the image...'}
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
            style={styles.notesInput}
            placeholder={t.conclusionsPlaceholder || 'Conclusions and findings...'}
            value={conclusions}
            onChangeText={setConclusions}
            multiline
            numberOfLines={3}
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
            <User size={20} color={Colors.primary} />
            <TextInput
              style={styles.input}
              placeholder={t.doctorNumberPlaceholder || "Doctor's license number"}
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
      <Modal
        visible={showFindingsPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFindingsPicker(false)}
      >
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  notesInput: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    color: Colors.text,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
    textAlign: 'right',
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
