import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Pill, Edit, Trash2, Calendar, Clock, FileText, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMedications } from '@/hooks/useMedications';
import { Medication } from '@/lib/api/medications-api';
import TabView from '@/components/TabView';

type TabType = 'current' | 'previous';

export default function MedicationsScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('current');
  const [endingMedicationId, setEndingMedicationId] = useState<number | null>(null);
  const [deletingMedicationId, setDeletingMedicationId] = useState<number | null>(null);

  const { 
    medications: currentMeds, 
    loading: loadingCurrent, 
    error: errorCurrent,
    endMedication,
    deleteMedication,
    refresh: refreshCurrent
  } = useMedications('current');

  const { 
    medications: previousMeds, 
    loading: loadingPrevious, 
    error: errorPrevious,
    refresh: refreshPrevious
  } = useMedications('previous');

  const tabs = [
    { key: 'current', title: t.medicationsCurrentMedications || 'Current Medications', icon: Pill },
    { key: 'previous', title: t.medicationsPreviousMedications || 'Previous Medications', icon: Clock },
  ];

  const handleAddMedication = () => {
    router.push('/add-medication');
  };

  const handleEditMedication = (medication: Medication) => {
    router.push({
      pathname: '/medication-detail',
      params: { id: medication.id.toString() }
    });
  };

  const handleEndMedication = (medication: Medication) => {
    Alert.alert(
      t.medicationsEndMedication || 'End Medication',
      `${t.medicationsEndMedicationDescription || 'Are you sure you want to end'} "${medication.medication_name}"? ${t.medicationsEndMedicationDescription || 'You can optionally provide a reason.'}`,
      [
        {
          text: t.cancel || 'Cancel',
          style: 'cancel'
        },
        {
          text: t.medicationsEndMedication || 'End Medication',
          style: 'destructive',
          onPress: () => {
            setEndingMedicationId(medication.id);
            endMedication(medication.id)
              .then(() => {
                refreshCurrent();
                refreshPrevious();
              })
              .catch((err: any) => {
                Alert.alert(t.validationError || 'Error', err.message || 'Failed to end medication');
              })
              .finally(() => {
                setEndingMedicationId(null);
              });
          }
        }
      ]
    );
  };

  const handleDeleteMedication = (medication: Medication) => {
    Alert.alert(
      t.delete || 'Delete',
      `${t.deleteMedicationConfirm || 'Are you sure you want to delete'} "${medication.medication_name}"? ${t.deleteMedicationConfirmDesc || 'This action cannot be undone.'}`,
      [
        {
          text: t.cancel || 'Cancel',
          style: 'cancel'
        },
        {
          text: t.delete || 'Delete',
          style: 'destructive',
          onPress: () => {
            setDeletingMedicationId(medication.id);
            deleteMedication(medication.id)
              .catch((err: any) => {
                Alert.alert(t.validationError || 'Error', err.message || 'Failed to delete medication');
              })
              .finally(() => {
                setDeletingMedicationId(null);
              });
          }
        }
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t.notDefined || 'Not defined';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'pt' ? 'pt-PT' : language === 'es' ? 'es-ES' : 'en-US');
    } catch {
      return dateString;
    }
  };

  const renderMedicationCard = (medication: Medication, isCurrent: boolean) => (
    <View key={medication.id} style={[styles.medicationCard, isCurrent && styles.currentMedicationCard]}>
      <View style={styles.medicationHeader}>
        <View style={styles.medicationHeaderLeft}>
          <Pill size={20} color={isCurrent ? Colors.primary : Colors.textLight} />
          <Text style={styles.medicationName}>{medication.medication_name}</Text>
        </View>
        <View style={styles.medicationActions}>
          {isCurrent && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditMedication(medication)}
              >
                <Edit size={18} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteMedication(medication)}
                disabled={deletingMedicationId === medication.id}
              >
                {deletingMedicationId === medication.id ? (
                  <ActivityIndicator size="small" color={Colors.danger} />
                ) : (
                  <Trash2 size={18} color={Colors.danger} />
                )}
              </TouchableOpacity>
            </>
          )}
          {!isCurrent && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteMedication(medication)}
              disabled={deletingMedicationId === medication.id}
            >
              {deletingMedicationId === medication.id ? (
                <ActivityIndicator size="small" color={Colors.danger} />
              ) : (
                <Trash2 size={18} color={Colors.danger} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.medicationInfo}>
        {medication.dosage && medication.frequency && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.medicationsDosage || 'Dosage'}:</Text>
            <Text style={styles.infoValue}>{medication.dosage} • {medication.frequency}</Text>
          </View>
        )}

        {medication.purpose && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.medicationsPurpose || 'Purpose'}:</Text>
            <Text style={styles.infoValue}>{medication.purpose}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t.medicationsPrescribedBy || 'Prescribed By'}:</Text>
          <Text style={styles.infoValue}>{t.medicationsSelf || 'Self'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t.medicationsStartDate || 'Start Date'}:</Text>
          <Text style={styles.infoValue}>{formatDate(medication.start_date)}</Text>
        </View>

        {isCurrent ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.medicationsEndDate || 'End Date'}:</Text>
            <TouchableOpacity
              style={styles.endNowButton}
              onPress={() => handleEndMedication(medication)}
              disabled={endingMedicationId === medication.id}
            >
              {endingMedicationId === medication.id ? (
                <ActivityIndicator size="small" color={Colors.background} />
              ) : (
                <>
                  <Calendar size={14} color={Colors.background} />
                  <Text style={styles.endNowButtonText}>
                    {endingMedicationId === medication.id 
                      ? (t.medicationsEnding || 'Ending...')
                      : (t.medicationsEndNow || 'End Now')
                    }
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.medicationsEndDate || 'End Date'}:</Text>
            <Text style={styles.infoValue}>{formatDate(medication.end_date)}</Text>
          </View>
        )}

        {medication.reason_ended && !isCurrent && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.medicationsReasonEnded || 'Reason Ended'}:</Text>
            <Text style={styles.infoValue}>{medication.reason_ended}</Text>
          </View>
        )}

        {medication.last_filled_date && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.medicationsLastRefillDate || 'Last Refill Date'}:</Text>
            <Text style={styles.infoValue}>{formatDate(medication.last_filled_date)}</Text>
          </View>
        )}
      </View>

      {(medication.rx_number || medication.pharmacy || medication.original_quantity !== undefined || medication.refills_remaining !== undefined) && (
        <View style={styles.prescriptionInfo}>
          <Text style={styles.prescriptionTitle}>{t.medicationsPrescriptionInfo || 'Prescription Information'}</Text>
          {medication.rx_number && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t.medicationsRxNumber || 'Rx Number'}:</Text>
              <Text style={styles.infoValue}>{medication.rx_number}</Text>
            </View>
          )}
          {medication.pharmacy && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t.medicationsPharmacy || 'Pharmacy'}:</Text>
              <Text style={styles.infoValue}>{medication.pharmacy}</Text>
            </View>
          )}
          {medication.original_quantity !== undefined && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t.medicationsQuantity || 'Quantity'}:</Text>
              <Text style={styles.infoValue}>{medication.original_quantity}</Text>
            </View>
          )}
          {medication.refills_remaining !== undefined && medication.refills_remaining !== null && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t.medicationsRefillsRemaining || 'Refills Remaining'}:</Text>
              <Text style={styles.infoValue}>{medication.refills_remaining}</Text>
            </View>
          )}
        </View>
      )}

      {medication.instructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>{t.medicationsInstructions || 'Instructions'}</Text>
          <Text style={styles.instructionsText}>{medication.instructions}</Text>
        </View>
      )}
    </View>
  );

  const renderCurrentMedications = () => {
    if (loadingCurrent) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t.medicationsLoading || 'Loading medications...'}</Text>
        </View>
      );
    }

    if (errorCurrent) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorCurrent}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshCurrent}>
            <Text style={styles.retryButtonText}>{t.retry || 'Retry'}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (currentMeds.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Pill size={64} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>{t.medicationsNoCurrentMedications || 'No Current Medications'}</Text>
          <Text style={styles.emptyDescription}>
            {t.medicationsNoCurrentMedicationsDesc || "You don't have any active medications. Click the button above to add your first medication."}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentMeds.map(med => renderMedicationCard(med, true))}
      </ScrollView>
    );
  };

  const renderPreviousMedications = () => {
    if (loadingPrevious) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t.medicationsLoading || 'Loading medications...'}</Text>
        </View>
      );
    }

    if (errorPrevious) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorPrevious}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshPrevious}>
            <Text style={styles.retryButtonText}>{t.retry || 'Retry'}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (previousMeds.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Pill size={64} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>{t.medicationsNoPreviousMedications || 'No Previous Medications'}</Text>
          <Text style={styles.emptyDescription}>
            {t.medicationsNoPreviousMedicationsDesc || "You don't have any previous medications. Medications you end will appear here."}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {previousMeds.map(med => renderMedicationCard(med, false))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.medications || 'Medications'}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddMedication}
        >
          <Plus size={24} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <TabView 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
      />

      {activeTab === 'current' ? renderCurrentMedications() : renderPreviousMedications()}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  medicationCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currentMedicationCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  medicationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  medicationInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textLight,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  endNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  endNowButtonText: {
    fontSize: 12,
    color: Colors.background,
    fontWeight: '600',
  },
  prescriptionInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  prescriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  instructionsContainer: {
    marginTop: 12,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textLight,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.background,
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
});
