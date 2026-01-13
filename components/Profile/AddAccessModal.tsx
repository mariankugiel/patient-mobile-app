import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import Colors from '@/constants/colors';

type PermissionGroup = {
  view: boolean;
  download?: boolean;
  edit: boolean;
};

export type AddAccessInput = {
  contactType: 'professional' | 'personal';
  fullName: string;
  email: string;
  relationship: string;
  expires: string;
  permissions: {
    medicalHistory: PermissionGroup;
    healthRecords: PermissionGroup;
    healthPlan: PermissionGroup;
    medications: PermissionGroup;
    appointments: PermissionGroup;
    messages: PermissionGroup;
  };
};

type Props = {
  visible: boolean;
  loading?: boolean;
  onClose: () => void;
  onSave: (input: AddAccessInput) => void;
  initialInput?: AddAccessInput | null;
  title?: string;
  primaryLabel?: string;
};

const defaultPermissions = (): AddAccessInput['permissions'] => ({
  medicalHistory: { view: true, download: false, edit: false },
  healthRecords: { view: true, download: false, edit: false },
  healthPlan: { view: true, download: false, edit: false },
  medications: { view: true, download: false, edit: false },
  appointments: { view: true, edit: false },
  messages: { view: true, edit: false },
});

export function AddAccessModal({
  visible,
  loading,
  onClose,
  onSave,
  initialInput,
  title,
  primaryLabel,
}: Props) {
  const [contactType, setContactType] = useState<'professional' | 'personal'>('professional');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [expires, setExpires] = useState('');
  const [permissions, setPermissions] = useState<AddAccessInput['permissions']>(defaultPermissions());
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (visible) {
      if (initialInput) {
        setContactType(initialInput.contactType);
        setFullName(initialInput.fullName || '');
        setEmail(initialInput.email || '');
        setRelationship(initialInput.relationship || '');
        setExpires(initialInput.expires || '');
        setPermissions(initialInput.permissions || defaultPermissions());
      } else {
        // Reset form each time the modal opens
        setContactType('professional');
        setFullName('');
        setEmail('');
        setRelationship('');
        setExpires('');
        setPermissions(defaultPermissions());
      }
      setError('');
    }
  }, [visible, initialInput]);

  const togglePermission = (category: keyof AddAccessInput['permissions'], field: keyof PermissionGroup) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field],
        // auto-enable view when enabling edit
        ...(field === 'edit' && !prev[category].view ? { view: true } : {}),
      },
    }));
  };

  const handleSave = () => {
    if (!fullName.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!expires.trim()) {
      setError('Expiration date is required (YYYY-MM-DD).');
      return;
    }
    setError('');
    onSave({
      contactType,
      fullName: fullName.trim(),
      email: email.trim(),
      relationship: relationship.trim(),
      expires: expires.trim(),
      permissions,
    });
  };

  const renderPermissionRow = (
    title: string,
    category: keyof AddAccessInput['permissions'],
    showDownload = true
  ) => (
    <View style={styles.permissionRow}>
      <Text style={styles.permissionLabel}>{title}</Text>
      <View style={styles.permissionToggles}>
        <View style={styles.toggleItem}>
          <Text style={styles.toggleLabel}>View</Text>
          <Switch
            value={permissions[category].view}
            onValueChange={() => togglePermission(category, 'view')}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={permissions[category].view ? Colors.primary : '#f4f3f4'}
          />
        </View>
        {showDownload && (
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Download</Text>
            <Switch
              value={!!permissions[category].download}
              onValueChange={() => togglePermission(category, 'download')}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={permissions[category].download ? Colors.primary : '#f4f3f4'}
            />
          </View>
        )}
        <View style={styles.toggleItem}>
          <Text style={styles.toggleLabel}>Edit</Text>
          <Switch
            value={permissions[category].edit}
            onValueChange={() => togglePermission(category, 'edit')}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={permissions[category].edit ? Colors.primary : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{title || 'Grant Access'}</Text>
          <Text style={styles.subtitle}>Share your data with a professional or family member.</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Contact type</Text>
              <View style={styles.typeRow}>
                <TouchableOpacity
                  style={[
                    styles.typeChip,
                    contactType === 'professional' && styles.typeChipActive,
                  ]}
                  onPress={() => setContactType('professional')}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      contactType === 'professional' && styles.typeChipTextActive,
                    ]}
                  >
                    Health professional
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeChip, contactType === 'personal' && styles.typeChipActive]}
                  onPress={() => setContactType('personal')}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      contactType === 'personal' && styles.typeChipTextActive,
                    ]}
                  >
                    Family / friend
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Full name</Text>
              <TextInput
                style={styles.input}
                placeholder="Dr. Jane Doe"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Relationship / specialty</Text>
              <TextInput
                style={styles.input}
                placeholder="Cardiologist, Family, etc."
                value={relationship}
                onChangeText={setRelationship}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Expires</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={expires}
                onChangeText={setExpires}
              />
            </View>

            <View style={styles.permissionsCard}>
              <Text style={styles.sectionLabel}>Permissions</Text>
              {renderPermissionRow('Medical history', 'medicalHistory')}
              {renderPermissionRow('Health records', 'healthRecords')}
              {renderPermissionRow('Health plan', 'healthPlan')}
              {renderPermissionRow('Medications', 'medications')}
              {renderPermissionRow('Appointments', 'appointments', false)}
              {renderPermissionRow('Messages', 'messages', false)}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose} disabled={loading}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>{loading ? 'Saving…' : primaryLabel || 'Save access'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '92%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.secondary,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
  },
  typeChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  typeChipText: {
    fontSize: 14,
    color: Colors.text,
  },
  typeChipTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  permissionsCard: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  permissionRow: {
    marginBottom: 12,
  },
  permissionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  permissionToggles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  toggleItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  toggleLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  error: {
    marginTop: 10,
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  secondaryButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.text,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default AddAccessModal;

