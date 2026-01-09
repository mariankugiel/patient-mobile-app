import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface DropdownOption {
  value: string;
  label: string;
}

interface SimpleDropdownProps {
  value: string;
  options: DropdownOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: any;
}

export default function SimpleDropdown({
  value,
  options,
  onValueChange,
  placeholder = 'Select...',
  style
}: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdown, style]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.dropdownText, !selectedOption && styles.placeholder]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={20} color={Colors.textLight} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    value === item.value && styles.optionSelected
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    value === item.value && styles.optionTextSelected
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dropdown: {
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
  dropdownText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  placeholder: {
    color: Colors.textLight,
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
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionSelected: {
    backgroundColor: Colors.secondary,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

