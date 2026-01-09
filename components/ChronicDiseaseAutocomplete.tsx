import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { Heart, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

const DISEASE_KEYS = [
  'hypertension',
  'ischemicHeartDisease',
  'stroke',
  'type2Diabetes',
  'type1Diabetes',
  'cancer',
  'copd',
  'asthma',
  'arthritis',
  'backProblems',
  'chronicKidneyDisease',
  'highCholesterol',
  'obesity',
  'depression',
  'osteoporosis',
  'neurodegenerative',
  'chronicLiverDisease',
  'chronicGastrointestinal',
  'thyroidDisorders',
  'asthmaChronicBronchitis',
  'chronicSkin',
  'chronicDigestive',
  'chronicPain',
  'neurologicalBeyondDementia',
  'chronicMentalHealth',
  'chronicEyeDiseases',
  'chronicHearing',
  'chronicOralDental',
  'chronicRespiratoryAllergies',
  'chronicUrogenital',
  'chronicMetabolic',
  'others',
] as const;

interface ChronicDiseaseAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: any;
  error?: string;
}

export default function ChronicDiseaseAutocomplete({
  value,
  onChange,
  placeholder = 'Search or type a chronic disease...',
  style,
  error
}: ChronicDiseaseAutocompleteProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const translatedDiseases = useMemo(() => {
    return DISEASE_KEYS.map(key => {
      // Map key to translation key format (e.g., 'hypertension' -> 'chronicDiseaseHypertension')
      const translationKey = `chronicDisease${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof typeof t;
      const translation = t[translationKey] as string | undefined;
      return translation || key;
    });
  }, [t]);

  const filteredDiseases = useMemo(() => {
    if (!searchQuery.trim()) {
      return translatedDiseases;
    }
    const query = searchQuery.toLowerCase();
    return translatedDiseases.filter(disease =>
      disease && disease.toLowerCase().includes(query)
    );
  }, [searchQuery, translatedDiseases]);

  const handleSelect = (disease: string) => {
    onChange(disease);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.input, style, error && styles.inputError]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        {value ? (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            style={styles.clearButton}
          >
            <X size={16} color={Colors.textLight} />
          </TouchableOpacity>
        ) : (
          <Heart size={16} color={Colors.textLight} />
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Disease</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search diseases..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <FlatList
              data={filteredDiseases}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Heart size={16} color={Colors.primary} style={styles.optionIcon} />
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No diseases found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
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
  inputError: {
    borderColor: Colors.danger,
  },
  inputText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  placeholder: {
    color: Colors.textLight,
  },
  clearButton: {
    padding: 4,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
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
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalClose: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    margin: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: 14,
  },
});

