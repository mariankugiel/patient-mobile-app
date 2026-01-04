import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, ScrollView, TextInput,
  TouchableOpacity, SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { X, User, Phone, Mail } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import CustomPicker from '../CustomPicker';

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

interface AddEmergencyContactModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (contact: EmergencyContact) => Promise<void>;
  isSaving?: boolean;
  existingContact?: EmergencyContact | null;
}

export default function AddEmergencyContactModal({
  visible,
  onClose,
  onSave,
  isSaving = false,
  existingContact = null,
}: AddEmergencyContactModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<EmergencyContact>({
    name: '',
    relationship: '',
    phone: '',
    email: '',
  });

  React.useEffect(() => {
    if (existingContact) {
      setFormData(existingContact);
    } else {
      setFormData({
        name: '',
        relationship: '',
        phone: '',
        email: '',
      });
    }
  }, [existingContact, visible]);

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert(t.validationError || 'Validation Error', t.nameRequired || 'Name is required');
      return;
    }
    if (!formData.relationship.trim()) {
      Alert.alert(t.validationError || 'Validation Error', t.relationshipRequired || 'Relationship is required');
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert(t.validationError || 'Validation Error', t.phoneRequired || 'Phone number is required');
      return;
    }

    try {
      await onSave(formData);
      setFormData({
        name: '',
        relationship: '',
        phone: '',
        email: '',
      });
      onClose();
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToSave || 'Failed to save contact');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {existingContact ? t.editContact || 'Edit Contact' : t.addContact}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={styles.saveButtonText}>{t.save}</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <View style={styles.labelWithIcon}>
                <User size={16} color={Colors.primary} />
                <Text style={styles.label}>{t.name || 'Name'} *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder={t.name || 'Name'}
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelWithIcon}>
                <User size={16} color={Colors.primary} />
                <Text style={styles.label}>{t.relationship || 'Relationship'} *</Text>
              </View>
              <CustomPicker
                selectedValue={formData.relationship}
                onValueChange={(itemValue) => setFormData({ ...formData, relationship: itemValue })}
                items={[
                  { label: t.relationshipSpouse || 'Spouse/Partner', value: 'spouse' },
                  { label: t.relationshipParent || 'Parent', value: 'parent' },
                  { label: t.relationshipSibling || 'Sibling', value: 'sibling' },
                  { label: t.relationshipChild || 'Child', value: 'child' },
                  { label: t.relationshipFriend || 'Friend', value: 'friend' },
                  { label: t.relationshipOther || 'Other', value: 'other' },
                ]}
                placeholder={t.selectRelationship || 'Select relationship'}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelWithIcon}>
                <Phone size={16} color={Colors.primary} />
                <Text style={styles.label}>{t.mobilePhone || 'Mobile Phone'} *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder={t.mobilePhone || 'Mobile Phone'}
                placeholderTextColor={Colors.textLight}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelWithIcon}>
                <Mail size={16} color={Colors.primary} />
                <Text style={styles.label}>{t.emailOptional || 'Email (Optional)'}</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder={t.emailOptional || 'Email (Optional)'}
                placeholderTextColor={Colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  formSection: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

