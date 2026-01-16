import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, User } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { medicationsApiService, MedicationUpdate } from '@/lib/api/medications-api';
import { useMedications } from '@/hooks/useMedications';
import DatePicker from '@/components/DatePicker';

export default function EditMedicationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const medicationId = params.id ? parseInt(params.id as string) : null;

  // Get medication from hook
  const { medications: currentMeds } = useMedications('current');
  const { medications: previousMeds } = useMedications('previous');
  const allMedications = [...currentMeds, ...previousMeds];
  const medication = medicationId ? allMedications.find(m => m.id === medicationId) : null;

  // Basic fields
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [purpose, setPurpose] = useState('');
  const [prescribedBy, setPrescribedBy] = useState('');
  const [instructions, setInstructions] = useState('');

  // Date fields
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Prescription fields
  const [rxNumber, setRxNumber] = useState<string | null>(null);
  const [pharmacy, setPharmacy] = useState<string | null>(null);
  const [originalQuantity, setOriginalQuantity] = useState<string | null>(null);
  const [refillsRemaining, setRefillsRemaining] = useState<string | null>(null);
  const [lastFilledDate, setLastFilledDate] = useState('');

  // Load medication data
  useEffect(() => {
    if (medication) {
      setName(medication.medication_name || '');
      setDosage(medication.dosage || '');
      setFrequency(medication.frequency || '');
      setPurpose(medication.purpose || '');
      setInstructions(medication.instructions || '');
      setStartDate(medication.start_date ? medication.start_date.split('T')[0] : '');
      setEndDate(medication.end_date ? medication.end_date.split('T')[0] : '');
      setRxNumber(medication.rx_number || null);
      setPharmacy(medication.pharmacy || null);
      setOriginalQuantity(medication.original_quantity !== null && medication.original_quantity !== undefined ? medication.original_quantity.toString() : null);
      setRefillsRemaining(medication.refills_remaining !== null && medication.refills_remaining !== undefined ? medication.refills_remaining.toString() : null);
      setLastFilledDate(medication.last_filled_date ? medication.last_filled_date.split('T')[0] : '');
      setIsLoading(false);
    } else if (!medicationId) {
      Alert.alert(t.error || 'Error', 'Medication not found');
      router.back();
    }
  }, [medication, medicationId]);

  const handleSave = async () => {
    if (!medicationId) return;

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

    // Validate end date is after start date if both are set
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      if (endDateObj <= startDateObj) {
        Alert.alert(
          t.validationError || 'Validation Error',
          t.medicationsEndDateMustBeAfterStartDate || 'End date must be after start date.'
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Helper function to convert empty strings to null (to clear fields on server)
      // If value is undefined, don't include it (no change)
      // If value is empty string, send null (clear the field)
      // Otherwise, send the trimmed value
      const toNullIfEmpty = (value: string | null | undefined): string | null | undefined => {
        if (value === undefined) return undefined; // Don't change if not provided
        if (value === null) return null; // Explicitly null
        const trimmed = value.trim();
        return trimmed === '' ? null : trimmed; // Empty string becomes null to clear
      };

      // Helper for numeric fields - if undefined, don't change; if null, send null to clear
      const handleNumericField = (value: string | null | undefined, allowZero: boolean = false): number | null | undefined => {
        if (value === undefined) return undefined; // Don't change if not provided
        if (value === null || value === '') return null; // Explicitly null to clear the field
        const parsed = parseInt(value);
        return isNaN(parsed) ? null : parsed;
      };

      const medicationData: MedicationUpdate = {
        medication_name: name.trim(),
        dosage: toNullIfEmpty(dosage) as string | null | undefined,
        frequency: toNullIfEmpty(frequency) as string | null | undefined,
        purpose: toNullIfEmpty(purpose) as string | null | undefined,
        instructions: toNullIfEmpty(instructions) as string | null | undefined,
        start_date: startDate,
        end_date: endDate || undefined,
        // Prescription information - explicitly send null to clear fields when empty
        rx_number: toNullIfEmpty(rxNumber) as string | null | undefined,
        pharmacy: toNullIfEmpty(pharmacy) as string | null | undefined,
        original_quantity: handleNumericField(originalQuantity, false) as number | null | undefined,
        refills_remaining: handleNumericField(refillsRemaining, true) as number | null | undefined, // Allow 0 for refills
        last_filled_date: (() => {
          if (!lastFilledDate) return undefined;
          const dateStr = lastFilledDate.trim();
          return dateStr === '' ? null : dateStr;
        })() as string | null | undefined,
      };

      await medicationsApiService.updateMedication(medicationId, medicationData);
      
      Alert.alert(
        t.save || 'Success',
        'Medication updated successfully!',
        [
          {
            text: t.confirm || 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      console.error('Error updating medication:', error);
      Alert.alert(
        t.validationError || 'Error',
        error.message || 'Failed to update medication. Please try again.'
      );
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
          <Text style={styles.headerTitle}>Edit Medication</Text>
          <View style={styles.spacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (!medication) {
    return null;
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
        <Text style={styles.headerTitle}>Edit Medication</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionDescription}>
          Edit the details of your medication.
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

        {/* Start Date and End Date */}
        <View style={styles.formGroup}>
          <View style={styles.twoColumnRow}>
            <View style={styles.halfWidth}>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
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
                onChange={setEndDate}
                placeholder={t.medicationsEndDate || 'Select end date'}
                label={t.medicationsEndDate || 'End Date'}
                minimumDate={startDate ? new Date(new Date(startDate).getTime() + 86400000) : undefined}
                disabled={isSubmitting}
                error={startDate && endDate ? new Date(endDate) <= new Date(startDate) : undefined}
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
                value={rxNumber ?? ''}
                onChangeText={(text) => {
                  setRxNumber(text === '' ? null : text);
                }}
                editable={!isSubmitting}
              />
            </View>

            {/* Pharmacy */}
            <View style={styles.formGroup}>
              <Text style={styles.smallLabel}>{t.medicationsPharmacy || 'Pharmacy'}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.medicationsPharmacyPlaceholder || 'Pharmacy name'}
                value={pharmacy ?? ''}
                onChangeText={(text) => {
                  setPharmacy(text === '' ? null : text);
                }}
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
                  value={originalQuantity ?? ''}
                  onChangeText={(text) => {
                    setOriginalQuantity(text === '' ? null : text);
                  }}
                  keyboardType="numeric"
                  editable={!isSubmitting}
                />
              </View>

              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.smallLabel}>{t.medicationsRefillsRemaining || 'Refills Remaining'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.medicationsRefillsRemainingPlaceholder || 'Number of refills'}
                  value={refillsRemaining ?? ''}
                  onChangeText={(text) => {
                    setRefillsRemaining(text === '' ? null : text);
                  }}
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
            (isSubmitting || !name || !dosage || !frequency || !startDate || (startDate && endDate && new Date(endDate) <= new Date(startDate))) && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={isSubmitting || !name || !dosage || !frequency || !startDate || !!(startDate && endDate && new Date(endDate) <= new Date(startDate))}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color={Colors.background} />
              <Text style={styles.saveButtonText}>{t.medicationsSaving || 'Saving...'}</Text>
            </>
          ) : (
            <Text style={styles.saveButtonText}>
              {t.save || 'Save Changes'}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
