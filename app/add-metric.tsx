import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronRight, Search, Plus, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { HealthRecordsApiService } from '@/lib/api/health-records-api';
import type { HealthRecordSection } from '@/lib/api/health-records-api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/lib/auth/auth-store';

type Step = 'type' | 'section' | 'metric' | 'value';

const HEALTH_RECORD_TYPES = [
  { id: 1, name: 'Analysis', nameKey: 'analises' },
  { id: 2, name: 'Vitals', nameKey: 'vitals' },
  { id: 3, name: 'Body', nameKey: 'body' },
  { id: 4, name: 'Lifestyle', nameKey: 'lifestyle' },
];

// Map tab names to health record type IDs (English names)
const TAB_TO_TYPE_ID: Record<string, number> = {
  'analyses': 1,
  'vitals': 2,
  'body': 3,
  'lifestyle': 4,
  'exams': 1, // Exams also use Analysis type
  // Support Portuguese names for backward compatibility
  'analises': 1,
  'vitais': 2,
  'corpo': 3,
  'exames': 1,
};

export default function AddMetricScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string; healthRecordTypeId?: string }>();
  const { t } = useLanguage();
  const { profile } = useAuthStore();
  
  // Determine initial type from params
  const initialTypeId = useMemo(() => {
    if (params.healthRecordTypeId) {
      return parseInt(params.healthRecordTypeId, 10);
    }
    if (params.type && TAB_TO_TYPE_ID[params.type]) {
      return TAB_TO_TYPE_ID[params.type];
    }
    return null;
  }, [params.healthRecordTypeId, params.type]);

  // Start at 'section' step if type is provided, otherwise 'type'
  const [step, setStep] = useState<Step>(initialTypeId ? 'section' : 'type');
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(initialTypeId);
  const [sections, setSections] = useState<HealthRecordSection[]>([]);
  const [adminTemplates, setAdminTemplates] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<HealthRecordSection | null>(null);
  const [metricTemplates, setMetricTemplates] = useState<any[]>([]);
  const [selectedMetricTemplate, setSelectedMetricTemplate] = useState<any | null>(null);
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [isCreatingMetric, setIsCreatingMetric] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Section creation form
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionDescription, setNewSectionDescription] = useState('');
  
  // Metric creation form
  const [newMetricName, setNewMetricName] = useState('');
  const [newMetricDisplayName, setNewMetricDisplayName] = useState('');
  const [newMetricUnit, setNewMetricUnit] = useState('');
  const [newMetricMin, setNewMetricMin] = useState('');
  const [newMetricMax, setNewMetricMax] = useState('');
  const [newMetricDescription, setNewMetricDescription] = useState('');
  
  // Value form
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  // Initialize type if provided via params
  useEffect(() => {
    if (initialTypeId && !selectedTypeId) {
      setSelectedTypeId(initialTypeId);
      setStep('section');
    }
  }, [initialTypeId]);

  // Load sections when type is selected
  useEffect(() => {
    if (selectedTypeId) {
      loadSections();
    }
  }, [selectedTypeId]);

  // Load metric templates when section is selected
  useEffect(() => {
    if (selectedSection && selectedSection.section_template_id) {
      loadMetricTemplates();
    }
  }, [selectedSection]);

  const loadSections = async () => {
    if (!selectedTypeId) return;
    
    setIsLoading(true);
    try {
      const data = await HealthRecordsApiService.getSectionsCombined(selectedTypeId);
      setSections(data.user_sections || []);
      setAdminTemplates(data.admin_templates || []);
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || 'Failed to load sections');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMetricTemplates = async () => {
    if (!selectedSection?.section_template_id || !selectedTypeId) return;
    
    setIsLoading(true);
    try {
      const templates = await HealthRecordsApiService.getAdminMetricTemplates(
        selectedSection.section_template_id,
        selectedTypeId
      );
      setMetricTemplates(templates || []);
    } catch (error: any) {
      console.error('Failed to load metric templates:', error);
      setMetricTemplates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeSelect = (typeId: number) => {
    setSelectedTypeId(typeId);
    setStep('section');
    setSelectedSection(null);
    setSections([]);
    setAdminTemplates([]);
  };

  // Initialize type if provided via params
  useEffect(() => {
    if (initialTypeId && !selectedTypeId) {
      setSelectedTypeId(initialTypeId);
      setStep('section');
    }
  }, [initialTypeId]);

  const handleSectionSelect = (section: HealthRecordSection) => {
    setSelectedSection(section);
    setStep('metric');
    setSelectedMetricTemplate(null);
    setMetricTemplates([]);
  };

  const handleCreateSection = async () => {
    if (!newSectionName.trim() || !selectedTypeId) {
      Alert.alert(t.validationError || 'Validation Error', t.pleaseSelectSection || 'Please enter section name');
      return;
    }

    setIsLoading(true);
    try {
      const section = await HealthRecordsApiService.createSection({
        name: newSectionName.toLowerCase().replace(/\s+/g, '_'),
        display_name: newSectionName,
        description: newSectionDescription || undefined,
        health_record_type_id: selectedTypeId,
      });
      
      // Reload sections
      await loadSections();
      setSelectedSection(section);
      setIsCreatingSection(false);
      setNewSectionName('');
      setNewSectionDescription('');
      setStep('metric');
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToCreateSection || 'Failed to create section');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMetric = async () => {
    if (!newMetricName.trim() || !selectedSection) {
      Alert.alert(t.validationError || 'Validation Error', t.pleaseEnterMetricName || 'Please enter metric name');
      return;
    }

    // Validate reference range
    const minValue = newMetricMin ? parseFloat(newMetricMin) : null;
    const maxValue = newMetricMax ? parseFloat(newMetricMax) : null;
    
    if ((minValue !== null && isNaN(minValue)) || (maxValue !== null && isNaN(maxValue))) {
      Alert.alert(t.validationError || 'Validation Error', t.pleaseEnterValidNumbers || 'Please enter valid numbers');
      return;
    }

    if (minValue !== null && maxValue !== null && minValue >= maxValue) {
      Alert.alert(t.validationError || 'Validation Error', t.minMustBeLessThanMax || 'Min must be less than max');
      return;
    }

    setIsLoading(true);
    try {
      // Create reference_data based on user's gender
      const userGender = profile?.gender?.toLowerCase() || 'male';
      const gender = userGender === 'female' ? 'female' : 'male';
      
      const referenceData = {
        male: { min: minValue || undefined, max: maxValue || undefined },
        female: { min: minValue || undefined, max: maxValue || undefined },
      };

      const metric = await HealthRecordsApiService.createMetric({
        section_id: selectedSection.id,
        name: newMetricName.toLowerCase().replace(/\s+/g, '_'),
        display_name: newMetricDisplayName || newMetricName,
        description: newMetricDescription || undefined,
        default_unit: newMetricUnit || undefined,
        reference_data: referenceData,
        data_type: 'number',
      });

      // Reload sections to get the new metric
      await loadSections();
      const updatedSection = sections.find(s => s.id === selectedSection.id) || selectedSection;
      const createdMetric = updatedSection.metrics?.find(m => m.id === metric.id);
      
      if (createdMetric) {
        setSelectedMetricTemplate({
          id: createdMetric.id,
          name: createdMetric.name,
          display_name: createdMetric.display_name,
          default_unit: createdMetric.default_unit || newMetricUnit,
        });
      }
      
      setIsCreatingMetric(false);
      setNewMetricName('');
      setNewMetricDisplayName('');
      setNewMetricUnit('');
      setNewMetricMin('');
      setNewMetricMax('');
      setNewMetricDescription('');
      setStep('value');
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToCreateMetric || 'Failed to create metric');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetricSelect = (template: any) => {
    setSelectedMetricTemplate(template);
    setStep('value');
  };

  const handleSave = async () => {
    if (!selectedSection || !selectedMetricTemplate || !value) {
      Alert.alert(t.validationError || 'Validation Error', t.fieldRequired || 'Please fill all required fields');
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      Alert.alert(t.validationError || 'Validation Error', t.fieldRequired || 'Please enter a valid number');
      return;
    }

    setIsLoading(true);
    try {
      await HealthRecordsApiService.createHealthRecord({
        section_id: selectedSection.id,
        metric_id: selectedMetricTemplate.id,
        value: numericValue,
        notes: notes || undefined,
      });

      Alert.alert(t.success || 'Success', t.measurementSaved || 'Measurement saved successfully', [
        { text: t.ok || 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToSave || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter(s => 
      s.display_name.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query)
    );
  }, [sections, searchQuery]);

  const filteredMetricTemplates = useMemo(() => {
    if (!searchQuery) return metricTemplates;
    const query = searchQuery.toLowerCase();
    return metricTemplates.filter(m => 
      m.display_name?.toLowerCase().includes(query) ||
      m.name?.toLowerCase().includes(query)
    );
  }, [metricTemplates, searchQuery]);

  const renderTypeSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t.selectHealthRecordType || 'Select Health Record Type'}</Text>
      <View style={styles.typeContainer}>
        {HEALTH_RECORD_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeItem,
              selectedTypeId === type.id && styles.typeItemSelected
            ]}
            onPress={() => handleTypeSelect(type.id)}
          >
            <Text style={[
              styles.typeItemText,
              selectedTypeId === type.id && styles.typeItemTextSelected
            ]}>
              {t[type.nameKey as keyof typeof t] || type.name}
            </Text>
            <ChevronRight size={20} color={selectedTypeId === type.id ? Colors.background : Colors.textLight} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSectionSelection = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={{ width: 24 }} />
        <Text style={styles.stepTitle}>{t.selectSection || 'Select Section'}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsCreatingSection(true)}
        >
          <Plus size={16} color={Colors.background} />
          <Text style={styles.addButtonText}>{t.add || 'Add'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder={t.searchSections || 'Search sections...'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textLight}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : (
        <ScrollView style={styles.listContainer}>
          {filteredSections.length === 0 ? (
            <Text style={styles.emptyText}>{t.noSectionsFound || 'No sections found'}</Text>
          ) : (
            filteredSections.map((section) => (
              <TouchableOpacity
                key={section.id}
                style={styles.listItem}
                onPress={() => handleSectionSelect(section)}
              >
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{section.display_name || section.name}</Text>
                  {section.description && (
                    <Text style={styles.listItemSubtitle}>{section.description}</Text>
                  )}
                </View>
                <ChevronRight size={20} color={Colors.textLight} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );

  const renderMetricSelection = () => {
    const existingMetrics = selectedSection?.metrics || [];
    const availableTemplates = metricTemplates.filter(template => {
      // Filter out templates that match existing metrics
      return !existingMetrics.some(m => 
        m.display_name?.toLowerCase() === template.display_name?.toLowerCase() ||
        m.name?.toLowerCase() === template.name?.toLowerCase()
      );
    });

    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <View style={{ width: 24 }} />
          <Text style={styles.stepTitle}>{t.selectMetric || 'Select Metric'}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setIsCreatingMetric(true)}
          >
            <Plus size={16} color={Colors.background} />
            <Text style={styles.addButtonText}>{t.add || 'Add'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.searchMetrics || 'Search metrics...'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        ) : (
          <ScrollView style={styles.listContainer}>
            {/* Existing Metrics */}
            {existingMetrics.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>{t.existing || 'Existing Metrics'}</Text>
                {existingMetrics.map((metric) => (
                  <TouchableOpacity
                    key={metric.id}
                    style={styles.listItem}
                    onPress={() => handleMetricSelect(metric)}
                  >
                    <View style={styles.listItemContent}>
                      <Text style={styles.listItemTitle}>{metric.display_name || metric.name}</Text>
                      {metric.unit && (
                        <Text style={styles.listItemSubtitle}>{metric.unit}</Text>
                      )}
                    </View>
                    <ChevronRight size={20} color={Colors.textLight} />
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Template Metrics */}
            {availableTemplates.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>{t.fromTemplate || 'From Template'}</Text>
                {filteredMetricTemplates
                  .filter(t => availableTemplates.includes(t))
                  .map((template) => (
                    <TouchableOpacity
                      key={template.id}
                      style={styles.listItem}
                      onPress={() => handleMetricSelect(template)}
                    >
                      <View style={styles.listItemContent}>
                        <Text style={styles.listItemTitle}>{template.display_name || template.name}</Text>
                        {template.default_unit && (
                          <Text style={styles.listItemSubtitle}>{template.default_unit}</Text>
                        )}
                      </View>
                      <ChevronRight size={20} color={Colors.textLight} />
                    </TouchableOpacity>
                  ))}
              </>
            )}

            {existingMetrics.length === 0 && availableTemplates.length === 0 && (
              <Text style={styles.emptyText}>{t.noMetricsFound || 'No metrics found'}</Text>
            )}
          </ScrollView>
        )}
      </View>
    );
  };

  const renderValueInput = () => {
    const metric = selectedMetricTemplate;
    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <View style={{ width: 24 }} />
          <Text style={styles.stepTitle}>{t.addMetricTitle || 'Add Measurement'}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.metricInfo}>
            <Text style={styles.metricName}>{metric?.display_name || metric?.name}</Text>
            {metric?.default_unit && (
              <Text style={styles.metricUnit}>{metric.default_unit}</Text>
            )}
          </View>

          <Text style={styles.label}>Value *</Text>
          <View style={styles.valueContainer}>
            <TextInput
              style={styles.valueInput}
              placeholder={t.enterValue || 'Enter value'}
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
              editable={!isLoading}
            />
            {metric?.default_unit && (
              <Text style={styles.valueUnit}>{metric.default_unit}</Text>
            )}
          </View>

          <Text style={styles.label}>{t.notesOptional || 'Notes (optional)'}</Text>
          <TextInput
            style={styles.notesInput}
            placeholder={t.addNotes || 'Add notes or observations'}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            editable={!isLoading}
          />

          <TouchableOpacity 
            style={[styles.saveButton, (!value || isLoading) && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!value || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <Text style={styles.saveButtonText}>{t.saveMeasurement || 'Save'}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (step === 'type' || (step === 'section' && initialTypeId)) {
              router.back();
            } else if (step === 'section') {
              setStep('type');
            } else if (step === 'metric') {
              setStep('section');
            } else {
              setStep('metric');
            }
          }}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.addMetricTitle || 'Add Measurement'}</Text>
        <View style={{ width: 24 }} />
      </View>

      {step === 'type' && renderTypeSelection()}
      {step === 'section' && renderSectionSelection()}
      {step === 'metric' && renderMetricSelection()}
      {step === 'value' && renderValueInput()}

      {/* Create Section Modal */}
      <Modal
        visible={isCreatingSection}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCreatingSection(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.createNewSection || 'Create New Section'}</Text>
              <TouchableOpacity onPress={() => setIsCreatingSection(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.label}>{t.sectionName || 'Section Name'} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t.sectionNamePlaceholder || 'e.g., Hematology'}
                value={newSectionName}
                onChangeText={setNewSectionName}
                editable={!isLoading}
              />

              <Text style={styles.label}>{t.sectionDescription || 'Description'}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t.sectionDescriptionPlaceholder || 'Section description...'}
                value={newSectionDescription}
                onChangeText={setNewSectionDescription}
                multiline
                numberOfLines={3}
                editable={!isLoading}
              />

              <TouchableOpacity
                style={[styles.modalButton, (!newSectionName.trim() || isLoading) && styles.modalButtonDisabled]}
                onPress={handleCreateSection}
                disabled={!newSectionName.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.background} />
                ) : (
                  <Text style={styles.modalButtonText}>{t.createSection || 'Create Section'}</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Create Metric Modal */}
      <Modal
        visible={isCreatingMetric}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCreatingMetric(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.createCustomMetric || 'Create Custom Metric'}</Text>
              <TouchableOpacity onPress={() => setIsCreatingMetric(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.label}>{t.metricName || 'Metric Name'} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t.metricNamePlaceholder || 'e.g., glucose'}
                value={newMetricName}
                onChangeText={setNewMetricName}
                editable={!isLoading}
              />

              <Text style={styles.label}>{t.metricDisplayName || 'Display Name'}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.metricDisplayNamePlaceholder || 'e.g., Blood Glucose'}
                value={newMetricDisplayName}
                onChangeText={setNewMetricDisplayName}
                editable={!isLoading}
              />

              <Text style={styles.label}>{t.metricUnit || 'Unit'}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.metricUnitPlaceholder || 'e.g., mg/dL, mmol/L, %'}
                value={newMetricUnit}
                onChangeText={setNewMetricUnit}
                editable={!isLoading}
              />

              <Text style={styles.label}>{t.referenceRange || 'Reference Range'}</Text>
              <View style={styles.referenceRangeContainer}>
                <View style={styles.referenceRangeInput}>
                  <Text style={styles.referenceRangeLabel}>{t.referenceRangeMin || 'Min'}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t.referenceRangeMinPlaceholder || 'e.g., 70'}
                    value={newMetricMin}
                    onChangeText={setNewMetricMin}
                    keyboardType="numeric"
                    editable={!isLoading}
                  />
                </View>
                <View style={styles.referenceRangeInput}>
                  <Text style={styles.referenceRangeLabel}>{t.referenceRangeMax || 'Max'}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t.referenceRangeMaxPlaceholder || 'e.g., 100'}
                    value={newMetricMax}
                    onChangeText={setNewMetricMax}
                    keyboardType="numeric"
                    editable={!isLoading}
                  />
                </View>
              </View>

              <Text style={styles.label}>{t.metricDescription || 'Description'}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t.metricDescriptionPlaceholder || 'Metric description...'}
                value={newMetricDescription}
                onChangeText={setNewMetricDescription}
                multiline
                numberOfLines={3}
                editable={!isLoading}
              />

              <TouchableOpacity
                style={[styles.modalButton, (!newMetricName.trim() || isLoading) && styles.modalButtonDisabled]}
                onPress={handleCreateMetric}
                disabled={!newMetricName.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.background} />
                ) : (
                  <Text style={styles.modalButtonText}>{t.createMetric || 'Create Metric'}</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingTop: 16,
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
  stepContainer: {
    flex: 1,
    padding: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    fontSize: 14,
    fontWeight: '600',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  typeContainer: {
    marginTop: 24,
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  typeItemSelected: {
    backgroundColor: Colors.primary,
  },
  typeItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  typeItemTextSelected: {
    color: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: 8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textLight,
    marginTop: 32,
    fontSize: 16,
  },
  loader: {
    marginTop: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  metricInfo: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  metricName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  metricUnit: {
    fontSize: 14,
    color: Colors.textLight,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  valueInput: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  valueUnit: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.textLight,
    width: 60,
  },
  notesInput: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
    color: Colors.text,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonDisabled: {
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
    maxHeight: '90%',
    paddingBottom: 32,
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
  modalScroll: {
    padding: 16,
  },
  input: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  referenceRangeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  referenceRangeInput: {
    flex: 1,
  },
  referenceRangeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
