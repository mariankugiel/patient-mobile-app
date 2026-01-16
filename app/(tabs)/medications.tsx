import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Plus, Pill, Edit, Trash2, Calendar, Clock, FileText, X, Menu } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMedications } from '@/hooks/useMedications';
import { Medication } from '@/lib/api/medications-api';
import TabView from '@/components/TabView';
import SideDrawer from '@/components/SideDrawer';

type TabType = 'current' | 'previous';

export default function MedicationsScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('current');
  const [endingMedicationId, setEndingMedicationId] = useState<number | null>(null);
  const [deletingMedicationId, setDeletingMedicationId] = useState<number | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [openEndDialog, setOpenEndDialog] = useState(false);
  const [medicationToEnd, setMedicationToEnd] = useState<Medication | null>(null);
  const [endReason, setEndReason] = useState('');

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

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshCurrent();
      refreshPrevious();
    }, [refreshCurrent, refreshPrevious])
  );

  const handleAddMedication = () => {
    router.push('/add-medication');
  };

  const handleEditMedication = (medication: Medication) => {
    router.push({
      pathname: '/edit-medication',
      params: { id: medication.id.toString() }
    });
  };

  const handleOpenEndDialog = (medication: Medication) => {
    setMedicationToEnd(medication);
    setEndReason('');
    setOpenEndDialog(true);
  };

  const handleEndMedication = async () => {
    if (!medicationToEnd) return;
    
    setEndingMedicationId(medicationToEnd.id);
    try {
      await endMedication(medicationToEnd.id, endReason.trim() || undefined);
      refreshCurrent();
      refreshPrevious();
      setOpenEndDialog(false);
      setMedicationToEnd(null);
      setEndReason('');
    } catch (err: any) {
      Alert.alert(t.validationError || 'Error', err.message || 'Failed to end medication');
    } finally {
      setEndingMedicationId(null);
    }
  };

  const handleCloseEndDialog = () => {
    if (endingMedicationId === null) {
      setOpenEndDialog(false);
      setMedicationToEnd(null);
      setEndReason('');
    }
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
              onPress={() => handleOpenEndDialog(medication)}
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

      {(() => {
        // Check if any prescription field has a meaningful value
        const hasRxNumber = medication.rx_number && medication.rx_number.trim() !== '';
        const hasPharmacy = medication.pharmacy && medication.pharmacy.trim() !== '';
        const hasQuantity = medication.original_quantity !== undefined && medication.original_quantity !== null;
        const hasRefills = medication.refills_remaining !== undefined && medication.refills_remaining !== null;
        
        if (!hasRxNumber && !hasPharmacy && !hasQuantity && !hasRefills) {
          return null;
        }
        
        return (
          <View style={styles.prescriptionInfo}>
            <Text style={styles.prescriptionTitle}>{t.medicationsPrescriptionInfo || 'Prescription Information'}</Text>
            {hasRxNumber && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.medicationsRxNumber || 'Rx Number'}:</Text>
                <Text style={styles.infoValue}>{medication.rx_number}</Text>
              </View>
            )}
            {hasPharmacy && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.medicationsPharmacy || 'Pharmacy'}:</Text>
                <Text style={styles.infoValue}>{medication.pharmacy}</Text>
              </View>
            )}
            {hasQuantity && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.medicationsQuantity || 'Quantity'}:</Text>
                <Text style={styles.infoValue}>{medication.original_quantity}</Text>
              </View>
            )}
            {hasRefills && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.medicationsRefillsRemaining || 'Refills Remaining'}:</Text>
                <Text style={styles.infoValue}>{medication.refills_remaining}</Text>
              </View>
            )}
          </View>
        );
      })()}

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
            {t.medicationsNoCurrentMedicationsDesc || "You don't have any active medications. Click the button below to add your first medication."}
          </Text>
          <TouchableOpacity 
            style={styles.emptyAddButton}
            onPress={handleAddMedication}
          >
            <Plus size={20} color={Colors.background} />
            <Text style={styles.emptyAddButtonText}>{t.addMedication || 'Add Medication'}</Text>
          </TouchableOpacity>
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

  // Determine if we should show the header add button (only when there are entries and not loading)
  const hasEntries = !loadingCurrent && !loadingPrevious && (
    activeTab === 'current' 
      ? currentMeds.length > 0 
      : previousMeds.length > 0
  );

  return (
    <View style={styles.container}>
      <SideDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} onOpen={() => setDrawerVisible(true)} />
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDrawerVisible(true)}
        >
          <Menu size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>{t.medications || 'Medications'}</Text>
        {hasEntries && (
          <TouchableOpacity 
            style={styles.topHeaderAddButton}
            onPress={handleAddMedication}
          >
            <Plus size={20} color={Colors.background} />
            <Text style={styles.topHeaderAddButtonText}>
              {t.add || 'Add'}
            </Text>
          </TouchableOpacity>
        )}
        {!hasEntries && <View style={{ width: 40 }} />}
      </View>

      <TabView 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
      />

      {activeTab === 'current' ? renderCurrentMedications() : renderPreviousMedications()}

      {/* End Medication Dialog */}
      <Modal
        visible={openEndDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseEndDialog}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t.medicationsEndMedication || 'End Medication'}
              </Text>
              <TouchableOpacity
                onPress={handleCloseEndDialog}
                disabled={endingMedicationId !== null}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              {t.medicationsEndMedicationDescription || 'Are you sure you want to end'} "{medicationToEnd?.medication_name}"? {t.medicationsEndMedicationDescription || 'You can optionally provide a reason.'}
            </Text>

            <View style={styles.modalBody}>
              <Text style={styles.reasonLabel}>
                {t.medicationsEndReason || 'Reason (Optional)'}
              </Text>
              <TextInput
                style={styles.reasonInput}
                placeholder={t.medicationsEndReasonPlaceholder || 'e.g., Completed treatment, Side effects, Switched to alternative...'}
                placeholderTextColor={Colors.textLighter}
                value={endReason}
                onChangeText={setEndReason}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={endingMedicationId === null}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseEndDialog}
                disabled={endingMedicationId !== null}
              >
                <Text style={styles.cancelButtonText}>
                  {t.cancel || 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.endButton]}
                onPress={handleEndMedication}
                disabled={endingMedicationId !== null}
              >
                {endingMedicationId ? (
                  <ActivityIndicator size="small" color={Colors.background} />
                ) : (
                  <Text style={styles.endButtonText}>
                    {t.medicationsEndMedication || 'End Medication'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuButton: {
    padding: 4,
  },
  topHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  topHeaderAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  topHeaderAddButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
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
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  emptyAddButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 20,
    lineHeight: 20,
  },
  modalBody: {
    marginBottom: 20,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  reasonInput: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  endButton: {
    backgroundColor: '#FF9800', // Orange color matching web app
  },
  endButtonText: {
    color: Colors.background,
    fontWeight: '600',
    fontSize: 16,
  },
});
