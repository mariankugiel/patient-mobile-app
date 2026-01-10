import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, User } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { medicationsApiService, MedicationCreate } from '@/lib/api/medications-api';
import DatePicker from '@/components/DatePicker';

export default function AddMedicationScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic fields
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [purpose, setPurpose] = useState('');
  const [prescribedBy, setPrescribedBy] = useState('');
  const [instructions, setInstructions] = useState('');

  // Date fields - auto-set end date to tomorrow when start date changes
  const getDefaultStartDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getDefaultEndDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());

  // Prescription fields
  const [rxNumber, setRxNumber] = useState('');
  const [pharmacy, setPharmacy] = useState('');
  const [originalQuantity, setOriginalQuantity] = useState('');
  const [refillsRemaining, setRefillsRemaining] = useState('');
  const [lastFilledDate, setLastFilledDate] = useState(getDefaultStartDate());

  const handleStartDateChange = (dateStr: string) => {
    setStartDate(dateStr);
    // Auto-set end date to day after start date
    if (dateStr) {
      const start = new Date(dateStr);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      setEndDate(end.toISOString().split('T')[0]);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!name.trim()) {
      Alert.alert(
        t.validationError || 'Validation Error',
        t.medicationsPleaseFillInName || 'Please fill in the medication name.'
      );
      return;
    }
    if (!dosage.trim()) {
      Alert.alert(
        t.validationError || 'Validation Error',
        t.medicationsPleaseFillInDosage || 'Please fill in the dosage.'
      );
      return;
    }
    if (!frequency.trim()) {
      Alert.alert(
        t.validationError || 'Validation Error',
        t.medicationsPleaseFillInFrequency || 'Please fill in the frequency.'
      );
      return;
    }
    if (!startDate) {
      Alert.alert(
        t.validationError || 'Validation Error',
        t.medicationsPleaseFillInStartDate || 'Please fill in the start date.'
      );
      return;
    }
    if (!endDate) {
      Alert.alert(
        t.validationError || 'Validation Error',
        t.medicationsPleaseFillInEndDate || 'Please fill in the end date.'
      );
      return;
    }

    // Validate end date is after start date
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (endDateObj <= startDateObj) {
      Alert.alert(
        t.validationError || 'Validation Error',
        t.medicationsEndDateMustBeAfterStartDate || 'End date must be after start date.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const medicationData: MedicationCreate = {
        medication_name: name.trim(),
        medication_type: 'prescription',
        dosage: dosage.trim() || undefined,
        frequency: frequency.trim() || undefined,
        purpose: purpose.trim() || undefined,
        instructions: instructions.trim() || undefined,
        start_date: startDate,
        end_date: endDate || undefined,
        // Prescription information
        rx_number: rxNumber.trim() || undefined,
        pharmacy: pharmacy.trim() || undefined,
        original_quantity: originalQuantity ? parseInt(originalQuantity) : undefined,
        refills_remaining: refillsRemaining ? parseInt(refillsRemaining) : undefined,
        last_filled_date: lastFilledDate || undefined,
      };

      await medicationsApiService.createMedication(medicationData);
      
      Alert.alert(
        t.save || 'Success',
        t.medicationAddedSuccessfully || 'Medication added successfully!',
        [
          {
            text: t.confirm || 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      console.error('Error adding medication:', error);
      Alert.alert(
        t.validationError || 'Error',
        error.message || (t.medicationAddFailed || 'Failed to add medication. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Text style={styles.headerTitle}>{t.medicationsAddNewMedication || 'Add New Medication'}</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionDescription}>
          {t.medicationsEnterDetails || 'Enter the details of your new medication.'}
        </Text>

        {/* Name - Required */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t.medicationsName || 'Name'} <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t.medicationsNamePlaceholder || 'Enter medication name'}
            value={name}
            onChangeText={setName}
            editable={!isSubmitting}
          />
        </View>

        {/* Dosage - Required */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t.medicationsDosage || 'Dosage'} <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t.medicationsDosagePlaceholder || 'Enter dosage (e.g., 10mg)'}
            value={dosage}
            onChangeText={setDosage}
            editable={!isSubmitting}
          />
        </View>

        {/* Frequency - Required */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t.medicationsFrequency || 'Frequency'} <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t.medicationsFrequencyPlaceholder || 'Enter frequency (e.g., Once daily)'}
            value={frequency}
            onChangeText={setFrequency}
            editable={!isSubmitting}
          />
        </View>

        {/* Purpose - Optional */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.medicationsPurpose || 'Purpose'}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.medicationsPurposePlaceholder || 'What is this medication for?'}
            value={purpose}
            onChangeText={setPurpose}
            editable={!isSubmitting}
          />
        </View>

        {/* Prescribed By - Optional */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.medicationsPrescribedBy || 'Prescribed By'}</Text>
          <View style={styles.inputWithIcon}>
            <User size={20} color={Colors.primary} />
            <TextInput
              style={styles.iconInput}
              placeholder={t.medicationsPrescribedByPlaceholder || "Doctor's name"}
              value={prescribedBy}
              onChangeText={setPrescribedBy}
              editable={!isSubmitting}
            />
          </View>
        </View>

        {/* Start Date and End Date - Required (in one row) */}
        <View style={styles.formGroup}>
          <View style={styles.twoColumnRow}>
            <View style={styles.halfWidth}>
              <DatePicker
                value={startDate}
                onChange={handleStartDateChange}
                placeholder={t.medicationsStartDate || 'Select start date'}
                label={t.medicationsStartDate || 'Start Date'}
                required
                maximumDate={endDate ? new Date(endDate) : undefined}
                disabled={isSubmitting}
                style={{ marginBottom: 0 }}
              />
            </View>
            <View style={styles.halfWidth}>
              <DatePicker
                value={endDate}
                onChange={(dateStr) => {
                  setEndDate(dateStr);
                }}
                placeholder={t.medicationsEndDate || 'Select end date'}
                label={t.medicationsEndDate || 'End Date'}
                required
                minimumDate={startDate ? new Date(new Date(startDate).getTime() + 86400000) : undefined}
                disabled={isSubmitting}
                error={startDate && endDate && new Date(endDate) <= new Date(startDate)}
                style={{ marginBottom: 0 }}
              />
            </View>
          </View>
          {startDate && endDate && new Date(endDate) <= new Date(startDate) && (
            <Text style={styles.errorText}>
              {t.medicationsEndDateMustBeAfterStartDate || 'End date must be after start date.'}
            </Text>
          )}
        </View>

        {/* Instructions - Optional */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.medicationsInstructions || 'Instructions'}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t.medicationsInstructionsPlaceholder || 'Enter instructions'}
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isSubmitting}
          />
        </View>

        {/* Prescription Section */}
        <View style={styles.prescriptionSection}>
          <Text style={styles.sectionTitle}>{t.medicationsPrescription || 'Prescription'}</Text>
          
          <View style={styles.prescriptionFields}>
            {/* Rx Number */}
            <View style={styles.formGroup}>
              <Text style={styles.smallLabel}>{t.medicationsRxNumber || 'Rx Number'}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.medicationsRxNumberPlaceholder || 'Prescription number'}
                value={rxNumber}
                onChangeText={setRxNumber}
                editable={!isSubmitting}
              />
            </View>

            {/* Pharmacy */}
            <View style={styles.formGroup}>
              <Text style={styles.smallLabel}>{t.medicationsPharmacy || 'Pharmacy'}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.medicationsPharmacyPlaceholder || 'Pharmacy name'}
                value={pharmacy}
                onChangeText={setPharmacy}
                editable={!isSubmitting}
              />
            </View>

            {/* Two column layout for Quantity and Refills */}
            <View style={styles.twoColumnRow}>
              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.smallLabel}>{t.medicationsQuantity || 'Quantity'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.medicationsQuantityPlaceholder || 'Original quantity'}
                  value={originalQuantity}
                  onChangeText={setOriginalQuantity}
                  keyboardType="numeric"
                  editable={!isSubmitting}
                />
              </View>

              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.smallLabel}>{t.medicationsRefillsRemaining || 'Refills Remaining'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.medicationsRefillsRemainingPlaceholder || 'Number of refills'}
                  value={refillsRemaining}
                  onChangeText={setRefillsRemaining}
                  keyboardType="numeric"
                  editable={!isSubmitting}
                />
              </View>
            </View>

            {/* Last Filled Date */}
            <View style={styles.formGroup}>
              <DatePicker
                value={lastFilledDate}
                onChange={setLastFilledDate}
                placeholder={t.medicationsLastFilled || 'Select date'}
                label={t.medicationsLastFilled || 'Last Filled'}
                disabled={isSubmitting}
                style={{ marginBottom: 0 }}
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[
            styles.saveButton,
            (isSubmitting || !name || !dosage || !frequency || !startDate || !endDate || (startDate && endDate && new Date(endDate) <= new Date(startDate))) && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={isSubmitting || !name || !dosage || !frequency || !startDate || !endDate || (startDate && endDate && new Date(endDate) <= new Date(startDate))}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color={Colors.background} />
              <Text style={styles.saveButtonText}>{t.medicationsSaving || 'Saving...'}</Text>
            </>
          ) : (
            <Text style={styles.saveButtonText}>
              {t.medicationsAddMedication || 'Add Medication'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  sectionDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 24,
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
  smallLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 6,
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
    minHeight: 48,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 48,
  },
  iconInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
    minHeight: 24,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
  },
  prescriptionSection: {
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  prescriptionFields: {
    gap: 0,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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
});
