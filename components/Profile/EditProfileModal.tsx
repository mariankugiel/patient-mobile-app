import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { X, Mail, Phone, MapPin, Calendar, User, ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import * as ImagePicker from 'expo-image-picker';
import { uploadProfilePicture } from '@/lib/api/image-upload';
import { useAuthStore } from '@/lib/auth/auth-store';
import type { UserProfile } from '@/lib/api/types';
import { timezones, getTimezoneLabel } from '@/constants/timezones';
import { getInitials, getAvatarColor } from '@/lib/utils/avatar';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onSave: (updatedProfile: Partial<UserProfile>) => Promise<void>;
  isSaving?: boolean;
}

export default function EditProfileModal({
  visible,
  onClose,
  profile,
  onSave,
  isSaving = false,
}: EditProfileModalProps) {
  const { t } = useLanguage();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    date_of_birth: '',
    gender: '',
    height: '',
    weight: '',
    waist_diameter: '',
    blood_type: '',
    phone_country_code: '',
    phone_number: '',
    address: '',
    timezone: '',
  });

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showBloodTypePicker, setShowBloodTypePicker] = useState(false);
  const [showTimezonePicker, setShowTimezonePicker] = useState(false);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  ];

  const bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Initialize form data when profile changes
  useEffect(() => {
    if (profile) {
      const nameParts = profile.full_name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData({
        firstName,
        lastName,
        email: profile.email || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || '',
        height: profile.height ? String(profile.height) : '',
        weight: profile.weight ? String(profile.weight) : '',
        waist_diameter: profile.waist_diameter ? String(profile.waist_diameter) : '',
        blood_type: profile.blood_type || '',
        phone_country_code: profile.phone_country_code || '',
        phone_number: profile.phone_number || '',
        address: profile.address || '',
        timezone: profile.timezone || '',
      });
      setAvatarUri(profile.avatar_url || null);
    }
  }, [profile]);

  const handleImagePicker = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t.validationError,
          t.permissionRequired
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setAvatarUri(imageUri);

        // Upload image if user is authenticated
        if (user?.id) {
          setIsUploadingImage(true);
          try {
            const uploadedUrl = await uploadProfilePicture(imageUri, user.id);
            setAvatarUri(uploadedUrl);
          } catch (error: any) {
            console.error('Error uploading image:', error);
            Alert.alert(t.uploadFailed, error.message || t.failedToUpdate);
            // Keep the local URI for preview, but upload will fail
          } finally {
            setIsUploadingImage(false);
          }
        }
      }
    } catch (error: any) {
      console.error('Error picking image:', error);
      Alert.alert(t.validationError, t.failedToUpdate);
    }
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.firstName?.trim()) {
      Alert.alert(t.validationError, `${t.firstName} ${t.fieldRequired}`);
      return;
    }

    if (!formData.lastName?.trim()) {
      Alert.alert(t.validationError, `${t.lastName} ${t.fieldRequired}`);
      return;
    }

    if (!formData.email?.trim()) {
      Alert.alert(t.validationError, `${t.email} ${t.fieldRequired}`);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert(t.validationError, t.invalidEmail);
      return;
    }

    try {
      const updatedProfile: Partial<UserProfile> = {
        full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email.trim(),
        date_of_birth: formData.date_of_birth || undefined,
        gender: formData.gender || undefined,
        height: formData.height ? formData.height : undefined,
        weight: formData.weight ? formData.weight : undefined,
        waist_diameter: formData.waist_diameter ? formData.waist_diameter : undefined,
        blood_type: formData.blood_type || undefined,
        phone_country_code: formData.phone_country_code || undefined,
        phone_number: formData.phone_number || undefined,
        address: formData.address || undefined,
        timezone: formData.timezone || undefined,
        avatar_url: avatarUri || undefined,
      };

      await onSave(updatedProfile);
      onClose();
    } catch (error: any) {
      Alert.alert(t.validationError, error.message || t.failedToUpdate);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.edit}</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving || isUploadingImage}
            style={[styles.saveButton, (isSaving || isUploadingImage) && styles.saveButtonDisabled]}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={styles.saveButtonText}>{t.save}</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Profile Image */}
          <View style={styles.imageSection}>
            <TouchableOpacity
              onPress={handleImagePicker}
              disabled={isUploadingImage}
              style={styles.imageContainer}
            >
              {avatarUri && avatarUri.trim() !== '' && avatarUri !== 'null' ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={[styles.avatarInitials, { backgroundColor: getAvatarColor(profile?.full_name) }]}>
                  <Text style={styles.avatarInitialsText}>{getInitials(profile?.full_name)}</Text>
                </View>
              )}
              {isUploadingImage && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="small" color={Colors.background} />
                </View>
              )}
              <View style={styles.editImageBadge}>
                <Text style={styles.editImageText}>{t.edit}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            {/* First Name and Last Name */}
            <View style={styles.nameRow}>
              <View style={[styles.inputGroup, styles.nameInput]}>
                <Text style={styles.label}>{t.firstName} *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                  placeholder={t.firstName}
                  placeholderTextColor={Colors.textLight}
                />
              </View>
              <View style={[styles.inputGroup, styles.nameInput]}>
                <Text style={styles.label}>{t.lastName} *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                  placeholder={t.lastName}
                  placeholderTextColor={Colors.textLight}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.birthDate}</Text>
              <View style={styles.inputWithIcon}>
                <Calendar size={16} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIconText]}
                  value={formData.date_of_birth}
                  onChangeText={(text) => setFormData({ ...formData, date_of_birth: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.textLight}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.gender}</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowGenderPicker(true)}
              >
                <Text style={[styles.selectButtonText, !formData.gender && styles.selectButtonPlaceholder]}>
                  {formData.gender ? genderOptions.find(g => g.value === formData.gender)?.label || formData.gender : 'Select gender'}
                </Text>
                <ChevronDown size={16} color={Colors.textLight} />
              </TouchableOpacity>
            </View>

            {/* Height, Weight, Waist Diameter */}
            <View style={styles.measurementsRow}>
              <View style={[styles.inputGroup, styles.measurementInput]}>
                <Text style={styles.label}>{t.height}</Text>
                <View style={styles.measurementInputContainer}>
                  <TextInput
                    style={[styles.input, styles.measurementInputField]}
                    value={formData.height}
                    onChangeText={(text) => setFormData({ ...formData, height: text })}
                    placeholder="178"
                    placeholderTextColor={Colors.textLight}
                    keyboardType="numeric"
                  />
                  <Text style={styles.measurementUnit}>cm</Text>
                </View>
              </View>
              <View style={[styles.inputGroup, styles.measurementInput]}>
                <Text style={styles.label}>{t.weight}</Text>
                <View style={styles.measurementInputContainer}>
                  <TextInput
                    style={[styles.input, styles.measurementInputField]}
                    value={formData.weight}
                    onChangeText={(text) => setFormData({ ...formData, weight: text })}
                    placeholder="80"
                    placeholderTextColor={Colors.textLight}
                    keyboardType="numeric"
                  />
                  <Text style={styles.measurementUnit}>kg</Text>
                </View>
              </View>
              <View style={[styles.inputGroup, styles.measurementInput]}>
                <Text style={styles.label}>{t.waistDiameter}</Text>
                <View style={styles.measurementInputContainer}>
                  <TextInput
                    style={[styles.input, styles.measurementInputField]}
                    value={formData.waist_diameter}
                    onChangeText={(text) => setFormData({ ...formData, waist_diameter: text })}
                    placeholder="90"
                    placeholderTextColor={Colors.textLight}
                    keyboardType="numeric"
                  />
                  <Text style={styles.measurementUnit}>cm</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.bloodType}</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowBloodTypePicker(true)}
              >
                <Text style={[styles.selectButtonText, !formData.blood_type && styles.selectButtonPlaceholder]}>
                  {formData.blood_type || 'Select blood type'}
                </Text>
                <ChevronDown size={16} color={Colors.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.email} *</Text>
              <View style={styles.inputWithIcon}>
                <Mail size={16} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIconText]}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder={t.email}
                  placeholderTextColor={Colors.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.mobileNumber}</Text>
              <View style={styles.phoneRow}>
                <TextInput
                  style={[styles.input, styles.phoneCodeInput]}
                  value={formData.phone_country_code}
                  onChangeText={(text) => setFormData({ ...formData, phone_country_code: text })}
                  placeholder="+351"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="phone-pad"
                />
                <View style={styles.inputWithIcon}>
                  <Phone size={16} color={Colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.inputWithIconText, styles.phoneNumberInput]}
                    value={formData.phone_number}
                    onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
                    placeholder="912 345 678"
                    placeholderTextColor={Colors.textLight}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.location}</Text>
              <View style={styles.inputWithIcon}>
                <MapPin size={16} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIconText]}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder={t.location}
                  placeholderTextColor={Colors.textLight}
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.timezone}</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowTimezonePicker(true)}
              >
                <Text style={[styles.selectButtonText, !formData.timezone && styles.selectButtonPlaceholder]}>
                  {formData.timezone ? getTimezoneLabel(formData.timezone) : 'Select timezone'}
                </Text>
                <ChevronDown size={16} color={Colors.textLight} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Gender Picker Modal */}
          <Modal
            visible={showGenderPicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowGenderPicker(false)}
          >
            <View style={styles.pickerModalOverlay}>
              <View style={styles.pickerModalContent}>
                <View style={styles.pickerModalHeader}>
                  <Text style={styles.pickerModalTitle}>{t.gender}</Text>
                  <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                    <X size={24} color={Colors.text} />
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  {genderOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.pickerOption,
                        formData.gender === option.value && styles.pickerOptionSelected
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, gender: option.value });
                        setShowGenderPicker(false);
                      }}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        formData.gender === option.value && styles.pickerOptionTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Blood Type Picker Modal */}
          <Modal
            visible={showBloodTypePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowBloodTypePicker(false)}
          >
            <View style={styles.pickerModalOverlay}>
              <View style={styles.pickerModalContent}>
                <View style={styles.pickerModalHeader}>
                  <Text style={styles.pickerModalTitle}>{t.bloodType}</Text>
                  <TouchableOpacity onPress={() => setShowBloodTypePicker(false)}>
                    <X size={24} color={Colors.text} />
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  {bloodTypeOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.pickerOption,
                        formData.blood_type === option && styles.pickerOptionSelected
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, blood_type: option });
                        setShowBloodTypePicker(false);
                      }}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        formData.blood_type === option && styles.pickerOptionTextSelected
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Timezone Picker Modal */}
          <Modal
            visible={showTimezonePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowTimezonePicker(false)}
          >
            <View style={styles.pickerModalOverlay}>
              <View style={styles.pickerModalContent}>
                <View style={styles.pickerModalHeader}>
                  <Text style={styles.pickerModalTitle}>{t.timezone}</Text>
                  <TouchableOpacity onPress={() => setShowTimezonePicker(false)}>
                    <X size={24} color={Colors.text} />
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  {timezones.map((tz) => (
                    <TouchableOpacity
                      key={tz.value}
                      style={[
                        styles.pickerOption,
                        formData.timezone === tz.value && styles.pickerOptionSelected
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, timezone: tz.value });
                        setShowTimezonePicker(false);
                      }}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        formData.timezone === tz.value && styles.pickerOptionTextSelected
                      ]}>
                        {tz.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
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
    padding: 4,
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
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  avatarInitialsText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.background,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  editImageText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
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
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 12,
  },
  phoneCodeInput: {
    width: 100,
    flex: 0,
  },
  phoneNumberInput: {
    flex: 1,
    minWidth: 200,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameInput: {
    flex: 1,
  },
  measurementsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  measurementInput: {
    flex: 1,
  },
  measurementInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  measurementInputField: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  measurementUnit: {
    paddingRight: 12,
    fontSize: 14,
    color: Colors.textLight,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectButtonText: {
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

