import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, ScrollView, TextInput,
  TouchableOpacity, SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { X, Lock, Eye, EyeOff } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthApiService } from '@/lib/api/auth-api';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  visible,
  onClose,
}: ChangePasswordModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    // Validation
    if (!formData.currentPassword.trim()) {
      Alert.alert(t.validationError, t.currentPasswordRequired || 'Current password is required');
      return;
    }
    if (!formData.newPassword.trim()) {
      Alert.alert(t.validationError, t.newPasswordRequired || 'New password is required');
      return;
    }
    if (formData.newPassword.length < 8) {
      Alert.alert(t.validationError, t.passwordMinLength || 'Password must be at least 8 characters');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert(t.validationError, t.passwordsDoNotMatch || 'Passwords do not match');
      return;
    }

    setIsSaving(true);
    try {
      await AuthApiService.changePassword(formData.currentPassword, formData.newPassword);
      Alert.alert(t.success || 'Success', t.passwordChangedSuccessfully || 'Password changed successfully', [
        {
          text: t.ok || 'OK',
          onPress: () => {
            setFormData({
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
            onClose();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || t.failedToChangePassword || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.changePassword}</Text>
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
              <Text style={styles.label}>{t.currentPassword} *</Text>
              <View style={styles.inputWithIcon}>
                <Lock size={16} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIconText]}
                  value={formData.currentPassword}
                  onChangeText={(text) => setFormData({ ...formData, currentPassword: text })}
                  placeholder={t.currentPassword}
                  placeholderTextColor={Colors.textLight}
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={styles.eyeButton}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} color={Colors.textLight} />
                  ) : (
                    <Eye size={20} color={Colors.textLight} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.newPassword} *</Text>
              <View style={styles.inputWithIcon}>
                <Lock size={16} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIconText]}
                  value={formData.newPassword}
                  onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
                  placeholder={t.newPassword}
                  placeholderTextColor={Colors.textLight}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeButton}
                >
                  {showNewPassword ? (
                    <EyeOff size={20} color={Colors.textLight} />
                  ) : (
                    <Eye size={20} color={Colors.textLight} />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>{t.passwordMinLength || 'Password must be at least 8 characters'}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.confirmNewPassword || 'Confirm New Password'} *</Text>
              <View style={styles.inputWithIcon}>
                <Lock size={16} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIconText]}
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                  placeholder={t.confirmNewPassword || 'Confirm New Password'}
                  placeholderTextColor={Colors.textLight}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={Colors.textLight} />
                  ) : (
                    <Eye size={20} color={Colors.textLight} />
                  )}
                </TouchableOpacity>
              </View>
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
  label: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
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
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginLeft: 12,
  },
  inputWithIconText: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 8,
    paddingRight: 40,
  },
  eyeButton: {
    padding: 8,
    marginRight: 8,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
});

