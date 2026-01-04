import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface PickerItem {
  label: string;
  value: string;
}

interface CustomPickerProps {
  selectedValue?: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
  placeholder?: string;
  icon?: React.ReactNode;
}

export default function CustomPicker({
  selectedValue,
  onValueChange,
  items,
  placeholder = 'Select an option',
  icon,
}: CustomPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const selectedItem = items.find(item => item.value === selectedValue);
  const displayText = selectedItem ? selectedItem.label : placeholder;

  return (
    <>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setShowPicker(true)}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[styles.selectButtonText, !selectedValue && styles.selectButtonPlaceholder]}>
          {displayText}
        </Text>
        <ChevronDown size={16} color={Colors.textLight} />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.pickerModalOverlay}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>{placeholder}</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.pickerOption,
                    selectedValue === item.value && styles.pickerOptionSelected
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setShowPicker(false);
                  }}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    selectedValue === item.value && styles.pickerOptionTextSelected
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 48,
  },
  iconContainer: {
    marginRight: 8,
  },
  selectButtonText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  selectButtonPlaceholder: {
    color: Colors.textLight,
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  pickerOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerOptionSelected: {
    backgroundColor: Colors.primary + '20',
  },
  pickerOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  pickerOptionTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

