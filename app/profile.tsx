import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, Alert, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, User, Settings, LogOut, ChevronRight, Shield, 
  Clock, Lock, Bell, Smartphone, Heart, Moon, Sun, 
  Phone, Mail, MapPin, Activity,
  AlertTriangle, Droplet, Globe, Pill, Baby, Calendar,
  Type, Eye, Watch, Zap, Mountain, Stethoscope, Compass, CircleDot, Thermometer
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useProfile } from '@/hooks/useProfile';
import { useEmergency } from '@/hooks/useEmergency';
import { PermissionsApiService } from '@/lib/api/permissions-api';
import { useNotifications } from '@/hooks/useNotifications';
import { usePermissions } from '@/hooks/usePermissions';
import { useThryveIntegration } from '@/hooks/useThryveIntegration';
import { useAuthStore } from '@/lib/auth/auth-store';
import EditProfileModal from '@/components/Profile/EditProfileModal';
import ChangePasswordModal from '@/components/Profile/ChangePasswordModal';
import EditEmergencyModal from '@/components/Profile/EditEmergencyModal';
import AddEmergencyContactModal from '@/components/Profile/AddEmergencyContactModal';
import TwoFactorAuthModal from '@/components/Profile/TwoFactorAuthModal';
import AddAccessModal, { AddAccessInput } from '@/components/Profile/AddAccessModal';
import { getInitials, getAvatarColor } from '@/lib/utils/avatar';
import { getHealthServiceIconWithBackground } from '@/lib/utils/health-service-icons';
import { getAvailableIntegrations } from '@/lib/constants/thryve-data-sources';
import type { UserSharedAccess } from '@/lib/api/types';

type Integration = {
  id: string;
  name: string;
  connected: boolean;
  platform: 'android' | 'ios' | null;
};

type SharingOption = {
  id: number;
  name: string;
  enabled: boolean;
};

type SharingCategory = {
  id: number;
  category: string;
  options: SharingOption[];
};

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

type Permission = {
  id: string;
  contactId?: string;
  contactEmail?: string;
  name: string;
  role: string;
  specialty: string;
  accessLevel: string;
  grantedDate: string;
  expiryDate?: string | null;
  revokedDate?: string;
  image: string;
};

const DEFAULT_HEALTH_PRO_IMAGE =
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
const DEFAULT_FAMILY_IMAGE =
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

// Backend handles invitation email; no client mailto
const INVITE_LINK = 'https://patient.saluso.app';

export default function ProfileScreen() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme, textSize, setTextSize, accessibility, updateAccessibility } = useTheme();
  const [activeTab, setActiveTab] = useState('personal');
  const [permissionsTab, setPermissionsTab] = useState('current');
  
  // Backend data hooks
  const queryClient = useQueryClient();
  const { profile: authStoreProfile, isAuthenticated } = useAuthStore();
  const { profile, isLoading: isLoadingProfile, updateProfile, updateProfileAsync, isUpdating: isUpdatingProfile, refetch: refetchProfile } = useProfile();
  const { emergency, isLoading: isLoadingEmergency, updateEmergency, isUpdating: isUpdatingEmergency } = useEmergency();
  const { notifications, isLoading: isLoadingNotifications, updateNotifications, isUpdating: isUpdatingNotifications } = useNotifications();
  const { sharedAccess, accessLogs, isLoading: isLoadingPermissions, updateSharedAccess, isUpdatingSharedAccess } = usePermissions();
  const { logout } = useAuthStore();
  
  // Use profile from hook, fallback to auth store profile
  const displayProfile = profile || authStoreProfile;
  
  // Use avatar from profile (from useProfile hook, which has caching and offline support)
  // This will be synced with auth store when profile is updated
  const avatarUrl = displayProfile?.avatar_url;
  const hasAvatar = avatarUrl && avatarUrl.trim() !== '' && avatarUrl !== 'null';
  const initials = getInitials(displayProfile?.full_name);
  const avatarColor = getAvatarColor(displayProfile?.full_name);
  
  // Ensure profile is loaded - sync auth store profile to React Query cache immediately
  React.useEffect(() => {
    if (authStoreProfile && !profile) {
      // Set the auth store profile in React Query cache so it's available immediately
      queryClient.setQueryData(['profile'], authStoreProfile);
    }
  }, [authStoreProfile, profile, queryClient]);
  
  // Refetch profile if authenticated but no data available
  React.useEffect(() => {
    if (isAuthenticated && !profile && !isLoadingProfile && !authStoreProfile) {
      // If authenticated but no profile data at all, try to refetch
      console.log('🔄 Refetching profile - no data available');
      refetchProfile();
    }
  }, [isAuthenticated, profile, isLoadingProfile, authStoreProfile, refetchProfile]);
  
  // Map backend permissions to UI format
  const [currentPermissions, setCurrentPermissions] = useState<Permission[]>([]);
  const [revokedPermissions, setRevokedPermissions] = useState<Permission[]>([]);

  const formatDateSafe = (value: string | null | undefined) => {
    if (!value) return '';
    const date = new Date(value);
    return isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString(
          language === 'pt-PT' ? 'pt-PT' : language === 'es-ES' ? 'es-ES' : 'en-US'
        );
  };
  
  // Update permissions when sharedAccess loads
  React.useEffect(() => {
    if (!sharedAccess) return;

    const healthProfessionals = (sharedAccess.health_professionals || []).map((hp, index) => ({
      id: hp.id || `hp-${index + 1}`,
      contactId: hp.id,
      contactEmail: hp.profile_email,
      name: hp.profile_fullname || 'Unknown',
      // default to professional so it always passes the filter
      role: hp.permissions_contact_type || 'professional',
      specialty: hp.permissions_relationship || '',
      accessLevel: hp.accessLevel || 'Parcial',
      grantedDate: hp.lastAccessed || new Date().toISOString(),
      expiryDate: hp.expires || null,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    }));
    
    const familyFriends = (sharedAccess.family_friends || []).map((ff, index) => ({
      id: ff.id || `ff-${healthProfessionals.length + index + 1}`,
      contactId: ff.id,
      contactEmail: ff.profile_email,
      name: ff.profile_fullname || 'Unknown',
      // default to personal/family so it passes the family filter
      role: ff.permissions_contact_type || 'personal',
      specialty: '',
      accessLevel: ff.accessLevel || 'Limitado',
      grantedDate: ff.lastAccessed || new Date().toISOString(),
      expiryDate: ff.expires || null,
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    }));
    
    const merged = [...healthProfessionals, ...familyFriends];
    console.log('[permissions] mapped sharedAccess -> currentPermissions', {
      hp: healthProfessionals.length,
      ff: familyFriends.length,
      total: merged.length,
    });
    setCurrentPermissions(merged);
  }, [sharedAccess]);
  
  // Thryve integration hook
  const {
    integrations: thryveIntegrations,
    loading: thryveLoading,
    connectIntegration,
    disconnectIntegration,
    refreshStatus,
  } = useThryveIntegration();
  
  const [sharingOptions, setSharingOptions] = useState<SharingCategory[]>([]);
  
  const [emailNotifications, setEmailNotifications] = useState<NotificationSetting[]>([
    { id: 'appointments', title: 'Lembretes de Consultas', description: 'Receba lembretes 24h antes das suas consultas', enabled: true },
    { id: 'medication', title: 'Lembretes de Medicamentos', description: 'Receba lembretes para tomar os seus medicamentos', enabled: true },
  ]);
  
  const [pushNotifications, setPushNotifications] = useState<NotificationSetting[]>([
    { id: 'messages', title: 'Mensagens', description: 'Receba notificações de novas mensagens', enabled: true },
    { id: 'healthTips', title: 'Recomendações de Saúde', description: 'Receba dicas e recomendações personalizadas', enabled: false },
  ]);
  
  
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [twoFactorModalVisible, setTwoFactorModalVisible] = useState(false);
  const [editEmergencyModalVisible, setEditEmergencyModalVisible] = useState(false);
const [addAccessModalVisible, setAddAccessModalVisible] = useState(false);
const [addContactModalVisible, setAddContactModalVisible] = useState(false);
const [editingContact, setEditingContact] = useState<any>(null); // Emergency contacts
const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
const [editInitialInput, setEditInitialInput] = useState<AddAccessInput | null>(null);
  
  const removeFromSharedAccess = async (permission: Permission) => {
    const currentShared = sharedAccess || {};
    const filterOut = (list?: any[]) =>
      (list || []).filter(
        (c) =>
          c.id !== permission.contactId &&
          c.profile_email?.toLowerCase() !== permission.contactEmail?.toLowerCase()
      );

    // Remove from both lists to handle roles like doctor/hospital/personal consistently
    const nextShared = {
      ...currentShared,
      health_professionals: filterOut(currentShared.health_professionals),
      family_friends: filterOut(currentShared.family_friends),
    };

    try {
      await updateSharedAccess(nextShared);
    } catch (err) {
      console.warn('[permissions] failed to persist revoke', err);
    }
  };

  const handleDeletePermission = (permissionId: string, fromRevoked = false) => {
    const list = fromRevoked ? revokedPermissions : currentPermissions;
    const permission = list.find(p => p.id === permissionId);
    if (!permission) return;
    Alert.alert(
      t.delete || 'Delete',
      'Are you sure you want to permanently remove this access?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete || 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (fromRevoked) {
              setRevokedPermissions(revokedPermissions.filter(p => p.id !== permissionId));
            } else {
              setCurrentPermissions(currentPermissions.filter(p => p.id !== permissionId));
            }
            await removeFromSharedAccess(permission);
            console.log(`Permission deleted for: ${permission.name}`);
          },
        },
      ]
    );
  };

  const handleRevokePermission = (permissionId: string) => {
    Alert.alert(
      t.revoke,
      'Are you sure you want to revoke access to this data?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.revoke,
          style: 'destructive',
          onPress: () => {
            const permission = currentPermissions.find(p => p.id === permissionId);
            if (permission) {
              setCurrentPermissions(currentPermissions.filter(p => p.id !== permissionId));
              setRevokedPermissions([...revokedPermissions, { ...permission, revokedDate: new Date().toISOString() }]);
              removeFromSharedAccess(permission);
              console.log(`Permission revoked for: ${permission.name}`);
            }
          }
        }
      ]
    );
  };
  
  const mapContactToInput = (contact: any): AddAccessInput => ({
    contactType: contact.permissions_contact_type === 'professional' ? 'professional' : 'personal',
    fullName: contact.profile_fullname || '',
    email: contact.profile_email || '',
    relationship: contact.permissions_relationship || '',
    expires: contact.expires || '',
    permissions: {
      medicalHistory: { view: !!contact.medical_history_view, download: !!contact.medical_history_download, edit: !!contact.medical_history_edit },
      healthRecords: { view: !!contact.health_records_view, download: !!contact.health_records_download, edit: !!contact.health_records_edit },
      healthPlan: { view: !!contact.health_plan_view, download: !!contact.health_plan_download, edit: !!contact.health_plan_edit },
      medications: { view: !!contact.medications_view, download: !!contact.medications_download, edit: !!contact.medications_edit },
      appointments: { view: !!contact.appointments_view, edit: !!contact.appointments_edit },
      messages: { view: !!contact.messages_view, edit: !!contact.messages_edit },
    },
  });

  const handleEditPermission = (permissionId: string) => {
    const permission = currentPermissions.find(p => p.id === permissionId);
    if (!permission) return;
    const contact =
      (sharedAccess?.health_professionals || []).find(
        (c: any) => c.id === permission.contactId || c.profile_email?.toLowerCase() === permission.contactEmail?.toLowerCase()
      ) ||
      (sharedAccess?.family_friends || []).find(
        (c: any) => c.id === permission.contactId || c.profile_email?.toLowerCase() === permission.contactEmail?.toLowerCase()
      );
    const initial = contact ? mapContactToInput(contact) : null;
    setEditingPermission(permission);
    setEditInitialInput(initial);
    setAddAccessModalVisible(true);
  };
  
  const handleRestorePermission = (permissionId: string) => {
    Alert.alert(
      t.restoreAccess,
      'Do you want to restore access to this data?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.restoreAccess,
          onPress: () => {
            const permission = revokedPermissions.find(p => p.id === permissionId);
            if (permission) {
              const { revokedDate, ...restoredPermission } = permission;
              setRevokedPermissions(revokedPermissions.filter(p => p.id !== permissionId));
              setCurrentPermissions([...currentPermissions, restoredPermission as Permission]);
              console.log(`Permission restored for: ${permission.name}`);
            }
          }
        }
      ]
    );
  };
  
  const handleAddNewAccess = () => {
    setEditingPermission(null);
    setEditInitialInput(null);
    setAddAccessModalVisible(true);
  };

  const handleSaveNewAccess = async (input: AddAccessInput) => {
    try {
      const expiresNormalized =
        /^\d{8}$/.test(input.expires.trim())
          ? `${input.expires.slice(0, 4)}-${input.expires.slice(4, 6)}-${input.expires.slice(6, 8)}`
          : input.expires.trim();

      const entryId = editingPermission?.contactId || `contact-${Date.now()}`;
      const newEntry = {
        id: entryId,
        permissions_contact_type: input.contactType === 'professional' ? 'professional' : 'personal',
        profile_fullname: input.fullName,
        profile_email: input.email,
        permissions_relationship: input.relationship,
        medical_history_view: input.permissions.medicalHistory.view,
        medical_history_download: input.permissions.medicalHistory.download,
        medical_history_edit: input.permissions.medicalHistory.edit,
        health_records_view: input.permissions.healthRecords.view,
        health_records_download: input.permissions.healthRecords.download,
        health_records_edit: input.permissions.healthRecords.edit,
        health_plan_view: input.permissions.healthPlan.view,
        health_plan_download: input.permissions.healthPlan.download,
        health_plan_edit: input.permissions.healthPlan.edit,
        medications_view: input.permissions.medications.view,
        medications_download: input.permissions.medications.download,
        medications_edit: input.permissions.medications.edit,
        appointments_view: input.permissions.appointments.view,
        appointments_edit: input.permissions.appointments.edit,
        messages_view: input.permissions.messages.view,
        messages_edit: input.permissions.messages.edit,
        accessLevel: input.permissions.healthRecords.edit || input.permissions.healthPlan.edit ? 'Completo' : 'Limitado',
        status: 'Active',
        lastAccessed: 'Never',
        expires: expiresNormalized,
      };

      const current: UserSharedAccess = sharedAccess || {};
      const withoutContact = (list?: any[]) =>
        (list || []).filter(
          (c) =>
            c.id !== entryId &&
            c.profile_email?.toLowerCase() !== newEntry.profile_email.toLowerCase()
        );

      const nextHealthPros = withoutContact(current.health_professionals);
      const nextFamilyFriends = withoutContact(current.family_friends);

      if (newEntry.permissions_contact_type === 'professional') {
        nextHealthPros.push(newEntry);
      } else {
        nextFamilyFriends.push(newEntry);
      }

      const updated: UserSharedAccess = {
        ...current,
        health_professionals: nextHealthPros,
        family_friends: nextFamilyFriends,
      };

      console.log('[permissions] handleSaveNewAccess payload', updated);

      // Optimistically update UI list so the new contact appears immediately
      const newPermission: Permission = {
        id: entryId,
        contactId: entryId,
        contactEmail: newEntry.profile_email,
        name: newEntry.profile_fullname || 'Unknown',
        role: newEntry.permissions_contact_type || input.contactType,
        specialty: newEntry.permissions_relationship || '',
        accessLevel: newEntry.accessLevel || 'Limitado',
        grantedDate: new Date().toISOString(),
        expiryDate: newEntry.expires || null,
        image: input.contactType === 'professional' ? DEFAULT_HEALTH_PRO_IMAGE : DEFAULT_FAMILY_IMAGE,
      };

      if (editingPermission) {
        setCurrentPermissions((prev) =>
          prev.map((p) => (p.id === editingPermission.id ? newPermission : p))
        );
      } else {
        setCurrentPermissions((prev) => [...prev, newPermission]);
      }

      queryClient.setQueryData(['shared-access'], updated);

      await updateSharedAccess(updated);

      if (!editingPermission) {
        // Send invite if the allowed user isn't registered (backend will decide and email if needed)
        try {
          const contactTypeForInvite = input.contactType === 'professional' ? 'doctor' : 'personal';
          await PermissionsApiService.inviteSharedAccess({
            email: newEntry.profile_email,
            name: newEntry.profile_fullname,
            type: contactTypeForInvite,
            relationship: newEntry.permissions_relationship,
            expires: newEntry.expires,
            permissions: input.permissions,
          });
        } catch (inviteErr) {
          console.warn('[permissions] inviteSharedAccess failed', inviteErr);
        }
      }

      setEditingPermission(null);
      setEditInitialInput(null);
      setAddAccessModalVisible(false);
      Alert.alert(t.success || 'Success', 'Access granted successfully.');
    } catch (err: any) {
      const message = err?.message || 'Failed to grant access. Please try again.';
      Alert.alert(t.error || 'Error', message);
    }
  };
  
  // Handle Thryve callback params
  const params = useLocalSearchParams();
  useEffect(() => {
    if (params.thryveSuccess) {
      Alert.alert(
        t.connectionSuccess || 'Success',
        t.connectionSuccess || 'Connected successfully'
      );
      refreshStatus();
    } else if (params.thryveError) {
      Alert.alert(
        t.connectionFailed || 'Error',
        params.thryveError as string
      );
    }
  }, [params, refreshStatus, t]);

  const handleToggleIntegration = async (integrationId: string) => {
    const integration = thryveIntegrations.find((i) => i.id === integrationId);
    if (!integration) return;

    try {
      if (integration.connected) {
        // Disconnect
        Alert.alert(
          t.disconnected || 'Disconnect',
          `${t.disconnectConfirm || 'Are you sure you want to disconnect'} ${integrationId}?`,
          [
            { text: t.cancel, style: 'cancel' },
            {
              text: t.disconnected || 'Disconnect',
              style: 'destructive',
              onPress: async () => {
                try {
                  await disconnectIntegration(integrationId);
                  Alert.alert(
                    t.success || 'Success',
                    t.disconnected || 'Disconnected successfully'
                  );
                } catch (error: any) {
                  Alert.alert(t.error || 'Error', error.message || 'Failed to disconnect');
                }
              },
            },
          ]
        );
      } else {
        // Connect
        await connectIntegration(integrationId);
        // For web data sources, the browser will handle the redirect
        // For native sources, the connection happens immediately
        if (integration.available !== false) {
          // Only show success for native sources (web sources redirect to browser)
          const config = getAvailableIntegrations().find((c) => c.id === integrationId);
          if (config?.isNative) {
            Alert.alert(
              t.connectionSuccess || 'Success',
              t.connectionSuccess || 'Connected successfully'
            );
          }
        }
      }
    } catch (error: any) {
      Alert.alert(t.error || 'Error', error.message || 'Failed to toggle integration');
    }
  };
  
  const handleToggleSharingOption = (categoryId: number, optionId: number) => {
    setSharingOptions(sharingOptions.map(category => 
      category.id === categoryId
        ? {
            ...category,
            options: category.options.map(option =>
              option.id === optionId
                ? { ...option, enabled: !option.enabled }
                : option
            )
          }
        : category
    ));
    console.log(`Sharing option ${optionId} in category ${categoryId} toggled`);
  };
  
  const handleToggleEmailNotification = (notificationId: string) => {
    setEmailNotifications(emailNotifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, enabled: !notification.enabled }
        : notification
    ));
    console.log(`Email notification ${notificationId} toggled`);
  };
  
  const handleTogglePushNotification = (notificationId: string) => {
    setPushNotifications(pushNotifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, enabled: !notification.enabled }
        : notification
    ));
    console.log(`Push notification ${notificationId} toggled`);
  };
  
  const handleToggleAccessibility = async (setting: 'higherContrast' | 'reduceMotion') => {
    await updateAccessibility({
      [setting]: !accessibility[setting]
    });
  };

  const renderPersonalDataTab = () => {
    if (isLoadingProfile) {
      return (
        <View style={[styles.tabContent, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t.loading}</Text>
        </View>
      );
    }

    // Format date of birth
    const formatDate = (dateString?: string) => {
      if (!dateString) return t.notDefined;
      try {
        const date = new Date(dateString);
        const locale = language === 'pt-PT' ? 'pt-PT' : language === 'es-ES' ? 'es-ES' : 'en-US';
        return date.toLocaleDateString(locale);
      } catch {
        return dateString;
      }
    };

    // Format phone number
    const formatPhone = (countryCode?: string, phoneNumber?: string) => {
      if (!phoneNumber) return t.notDefined;
      return countryCode ? `${countryCode} ${phoneNumber}` : phoneNumber;
    };

    return (
    <View style={styles.tabContent}>
      <View style={styles.profileHeader}>
          {hasAvatar ? (
        <Image 
              source={{ uri: avatarUrl }} 
          style={styles.profileImage} 
        />
          ) : (
            <View style={[styles.avatarInitials, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarInitialsText}>{initials}</Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => setEditProfileModalVisible(true)}
          >
            <Text style={styles.editProfileText}>{t.edit}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
          {/* Full Name with icon */}
        <View style={styles.infoItem}>
            <View style={styles.infoWithIcon}>
              <User size={16} color={Colors.primary} />
              <Text style={styles.infoLabel}>{t.fullName}</Text>
            </View>
            <Text style={styles.infoValue}>{displayProfile?.full_name || t.notDefined}</Text>
        </View>
        
          {/* Date of Birth and Gender in one row */}
          <View style={styles.dobGenderRow}>
            <View style={[styles.infoItem, styles.dobGenderItem]}>
              <View style={styles.infoWithIcon}>
                <Calendar size={16} color={Colors.primary} />
                <Text style={styles.infoLabel}>{t.birthDate}</Text>
              </View>
              <Text style={styles.infoValue}>{formatDate(displayProfile?.date_of_birth)}</Text>
        </View>
            
            <View style={[styles.infoItem, styles.dobGenderItem]}>
              <Text style={styles.infoLabel}>{t.gender}</Text>
              <Text style={styles.infoValue}>
                {displayProfile?.gender === 'male' ? 'Male' : 
                 displayProfile?.gender === 'female' ? 'Female' : 
                 displayProfile?.gender === 'other' ? 'Other' : 
                 displayProfile?.gender === 'prefer-not-to-say' ? 'Prefer not to say' : 
                 t.notDefined}
              </Text>
            </View>
          </View>
          
          {/* Height, Weight, Waist Diameter removed from view - only in edit mode */}
        
        <View style={styles.infoItem}>
          <View style={styles.infoWithIcon}>
            <Mail size={16} color={Colors.primary} />
              <Text style={styles.infoLabel}>{t.email}</Text>
          </View>
            <Text style={styles.infoValue}>{displayProfile?.email || t.notDefined}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <View style={styles.infoWithIcon}>
            <Phone size={16} color={Colors.primary} />
              <Text style={styles.infoLabel}>{t.mobileNumber}</Text>
          </View>
            <Text style={styles.infoValue}>{formatPhone(displayProfile?.phone_country_code, displayProfile?.phone_number)}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <View style={styles.infoWithIcon}>
            <MapPin size={16} color={Colors.primary} />
              <Text style={styles.infoLabel}>{t.location}</Text>
          </View>
            <Text style={styles.infoValue}>{displayProfile?.address || t.notDefined}</Text>
        </View>
        
        <View style={styles.infoItem}>
            <View style={styles.infoWithIcon}>
              <Globe size={16} color={Colors.primary} />
              <Text style={styles.infoLabel}>{t.timezone}</Text>
        </View>
            <Text style={styles.infoValue}>{displayProfile?.timezone || t.notDefined}</Text>
        </View>
      </View>
    </View>
  );
  };

  const renderEmergencyTab = () => {
    if (isLoadingEmergency) {
      return (
        <View style={[styles.tabContent, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t.loading}</Text>
        </View>
      );
    }

    const contacts = emergency?.contacts || [];

    return (
    <View style={styles.tabContent}>
      <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>{t.emergencyContacts}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingContact(null);
              setAddContactModalVisible(true);
            }}
          >
            <Text style={styles.addButtonText}>+ {t.addContact}</Text>
        </TouchableOpacity>
      </View>

        {contacts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No emergency contacts added</Text>
          </View>
        ) : (
          contacts.map((contact, index) => (
            <View key={index} style={styles.contactCard}>
        <View style={styles.contactHeader}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelation}>{contact.relationship}</Text>
        </View>
        <View style={styles.contactInfo}>
          <View style={styles.infoWithIcon}>
            <Phone size={16} color={Colors.primary} />
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
          </View>
                {contact.email && (
                  <View style={[styles.infoWithIcon, { marginTop: 8 }]}>
                    <Mail size={16} color={Colors.primary} />
                    <Text style={styles.contactPhone}>{contact.email}</Text>
                  </View>
                )}
        </View>
        <View style={styles.contactActions}>
                    <TouchableOpacity
                      style={styles.contactAction}
                      onPress={() => {
                        setEditingContact(contact);
                        setAddContactModalVisible(true);
                      }}
                    >
                      <Text style={styles.contactActionText}>{t.edit}</Text>
          </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.contactAction}
                  onPress={() => {
                    Alert.alert(
                      t.remove,
                      'Are you sure you want to remove this contact?',
                      [
                        { text: t.cancel, style: 'cancel' },
                        {
                          text: t.remove,
                          style: 'destructive',
                          onPress: async () => {
                            const updatedContacts = contacts.filter((_, i) => i !== index);
                            await updateEmergency({ contacts: updatedContacts });
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text style={[styles.contactActionText, { color: Colors.danger }]}>{t.remove}</Text>
          </TouchableOpacity>
        </View>
      </View>
          ))
        )}

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>{t.emergencyMedicalInfo}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditEmergencyModalVisible(true)}
          >
            <Text style={styles.editButtonText}>{t.edit}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emergencyInfoCard}>
          <View style={styles.emergencyInfoItem}>
          <View style={styles.infoWithIcon}>
              <Droplet size={16} color={Colors.primary} />
              <Text style={styles.emergencyInfoLabel}>{t.bloodType}:</Text>
          </View>
            <Text style={styles.emergencyInfoValue}>{displayProfile?.blood_type || t.notDefined}</Text>
        </View>
          
          <View style={styles.emergencyInfoItem}>
            <View style={styles.infoWithIcon}>
              <AlertTriangle size={16} color={Colors.primary} />
              <Text style={styles.emergencyInfoLabel}>{t.allergies}:</Text>
        </View>
            <Text style={styles.emergencyInfoValue}>{emergency?.allergies || displayProfile?.allergies || t.none}</Text>
      </View>

          <View style={styles.emergencyInfoItem}>
            <View style={styles.infoWithIcon}>
              <Heart size={16} color={Colors.primary} />
              <Text style={styles.emergencyInfoLabel}>{t.healthProblems}:</Text>
            </View>
            <Text style={styles.emergencyInfoValue}>{emergency?.health_problems || displayProfile?.current_health_problems?.join(', ') || t.none}</Text>
      </View>

        <View style={styles.emergencyInfoItem}>
          <View style={styles.infoWithIcon}>
              <Pill size={16} color={Colors.primary} />
              <Text style={styles.emergencyInfoLabel}>{t.currentMedications}:</Text>
          </View>
            <Text style={styles.emergencyInfoValue}>{emergency?.medications || t.none}</Text>
        </View>
        
        <View style={styles.emergencyInfoItem}>
          <View style={styles.infoWithIcon}>
              <Baby size={16} color={Colors.primary} />
              <Text style={styles.emergencyInfoLabel}>{t.pregnancyStatus}:</Text>
          </View>
            <Text style={styles.emergencyInfoValue}>
              {emergency?.pregnancy_status === 'no' ? t.notPregnant :
               emergency?.pregnancy_status === 'yes' ? t.pregnant :
               emergency?.pregnancy_status === 'unknown' ? t.unknown :
               emergency?.pregnancy_status === 'na' ? t.notApplicable :
               t.notDefined}
            </Text>
        </View>
        
        <View style={styles.emergencyInfoItem}>
          <View style={styles.infoWithIcon}>
            <Heart size={16} color={Colors.primary} />
              <Text style={styles.emergencyInfoLabel}>{t.organDonor}:</Text>
          </View>
            <Text style={styles.emergencyInfoValue}>
              {emergency?.organ_donor === true ? t.yes :
               emergency?.organ_donor === false ? t.no :
               t.notDefined}
            </Text>
        </View>
      </View>
    </View>
  );
  };

  const renderSecurityTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.securitySection}>
        <TouchableOpacity 
          style={styles.securityItem}
          onPress={() => setChangePasswordModalVisible(true)}
        >
          <View style={styles.securityItemContent}>
            <Lock size={20} color={Colors.primary} />
            <View style={styles.securityItemInfo}>
              <Text style={styles.securityItemTitle}>{t.changePassword}</Text>
              <Text style={styles.securityItemDescription}>{t.lastChanged || 'Last changed'}: 15/09/2023</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.securityItem}
          onPress={() => setTwoFactorModalVisible(true)}
        >
          <View style={styles.securityItemContent}>
            <Smartphone size={20} color={Colors.primary} />
            <View style={styles.securityItemInfo}>
              <Text style={styles.securityItemTitle}>{t.twoFactorAuth}</Text>
              <Text style={styles.securityItemDescription}>{t.enabled || 'Enabled'}</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.securityItem}>
          <View style={styles.securityItemContent}>
            <Activity size={20} color={Colors.primary} />
            <View style={styles.securityItemInfo}>
              <Text style={styles.securityItemTitle}>{t.connectedDevices}</Text>
              <Text style={styles.securityItemDescription}>2 {t.activeDevices}</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const isHealthProfessionalRole = (role?: string) => {
    const normalized = (role || '').toLowerCase();
    return [
      'médica',
      'médico',
      'enfermeiro',
      'professional',
      'doctor',
      'healthcare facility',
      'health professional',
    ].includes(normalized);
  };

  const isFamilyFriendRole = (role?: string) => {
    const normalized = (role || '').toLowerCase();
    return ['familiar', 'amigo', 'family', 'friend', 'personal', 'family / friend'].includes(normalized);
  };

  const renderPermissionsTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.permissionsTabs}>
          <TouchableOpacity 
            style={[styles.permissionsTab, permissionsTab === 'current' && styles.activePermissionsTab]}
            onPress={() => setPermissionsTab('current')}
          >
            <Shield size={16} color={permissionsTab === 'current' ? Colors.primary : Colors.textLight} />
            <Text style={[styles.permissionsTabText, permissionsTab === 'current' && styles.activePermissionsTabText]}>
              {t.currentAccess}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.permissionsTab, permissionsTab === 'revoked' && styles.activePermissionsTab]}
            onPress={() => setPermissionsTab('revoked')}
          >
            <Lock size={16} color={permissionsTab === 'revoked' ? Colors.primary : Colors.textLight} />
            <Text style={[styles.permissionsTabText, permissionsTab === 'revoked' && styles.activePermissionsTabText]}>
              {t.revokedAccess}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.permissionsTab, permissionsTab === 'logs' && styles.activePermissionsTab]}
            onPress={() => setPermissionsTab('logs')}
          >
            <Clock size={16} color={permissionsTab === 'logs' ? Colors.primary : Colors.textLight} />
            <Text style={[styles.permissionsTabText, permissionsTab === 'logs' && styles.activePermissionsTabText]}>
              {t.accessLogs}
            </Text>
          </TouchableOpacity>
        </View>
        
        {permissionsTab === 'current' && (
          <View style={styles.permissionsList}>
            {/* debug: current permissions count */}
            <Text style={styles.permissionDetailText}>
              {`Current permissions: ${currentPermissions.length}`}
            </Text>
            <View style={styles.permissionCategory}>
              <Text style={styles.permissionCategoryTitle}>{t.healthProfessionals}</Text>
              
              {currentPermissions
                .filter((p) => isHealthProfessionalRole(p.role))
                .map((permission) => (
                <View key={permission.id} style={styles.permissionItem}>
                  <View style={styles.permissionHeader}>
                    <Image 
                      source={{ uri: permission.image }} 
                      style={styles.permissionImage} 
                    />
                    <View style={styles.permissionInfo}>
                      <Text style={styles.permissionName}>{permission.name}</Text>
                      <Text style={styles.permissionRole}>{permission.role} • {permission.specialty}</Text>
                    </View>
                    <View style={[
                      styles.accessLevelBadge,
                      permission.accessLevel === 'Completo' ? styles.fullAccessBadge :
                      permission.accessLevel === 'Parcial' ? styles.partialAccessBadge :
                      styles.limitedAccessBadge
                    ]}>
                      <Text style={styles.accessLevelText}>{permission.accessLevel}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.permissionDetails}>
                    <Text style={styles.permissionDetailText}>
                      {t.accessGranted} {formatDateSafe(permission.grantedDate) || '—'}
                      {permission.expiryDate
                        ? ` • ${t.accessExpires} ${formatDateSafe(permission.expiryDate) || '—'}`
                        : ''}
                    </Text>
                  </View>
                  
                  <View style={styles.permissionActions}>
                    <TouchableOpacity 
                      style={styles.permissionActionButton}
                      onPress={() => handleEditPermission(permission.id)}
                    >
                      <Text style={styles.permissionActionText}>{t.edit}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.permissionActionButton, styles.revokeButton]}
                      onPress={() => handleRevokePermission(permission.id)}
                    >
                      <Text style={styles.revokeButtonText}>{t.revoke}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.permissionActionButton, styles.deleteButton]}
                      onPress={() => handleDeletePermission(permission.id, false)}
                    >
                      <Text style={styles.deleteButtonText}>{t.delete || 'Delete'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            
            <View style={styles.permissionCategory}>
              <Text style={styles.permissionCategoryTitle}>{t.familyFriends}</Text>
              
              {currentPermissions.filter((p) => isFamilyFriendRole(p.role)).map((permission) => (
                <View key={permission.id} style={styles.permissionItem}>
                  <View style={styles.permissionHeader}>
                    <Image 
                      source={{ uri: permission.image }} 
                      style={styles.permissionImage} 
                    />
                    <View style={styles.permissionInfo}>
                      <Text style={styles.permissionName}>{permission.name}</Text>
                      <Text style={styles.permissionRole}>{permission.role}</Text>
                    </View>
                    <View style={[
                      styles.accessLevelBadge,
                      permission.accessLevel === 'Completo' ? styles.fullAccessBadge :
                      permission.accessLevel === 'Parcial' ? styles.partialAccessBadge :
                      styles.limitedAccessBadge
                    ]}>
                      <Text style={styles.accessLevelText}>{permission.accessLevel}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.permissionDetails}>
                    <Text style={styles.permissionDetailText}>
                      {t.accessGranted} {new Date(permission.grantedDate).toLocaleDateString(language === 'pt-PT' ? 'pt-PT' : language === 'es-ES' ? 'es-ES' : 'en-US')}
                      {permission.expiryDate ? ` • ${t.accessExpires} ${new Date(permission.expiryDate).toLocaleDateString(language === 'pt-PT' ? 'pt-PT' : language === 'es-ES' ? 'es-ES' : 'en-US')}` : ''}
                    </Text>
                  </View>
                  
                  <View style={styles.permissionActions}>
                    <TouchableOpacity 
                      style={styles.permissionActionButton}
                      onPress={() => handleEditPermission(permission.id)}
                    >
                      <Text style={styles.permissionActionText}>{t.edit}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.permissionActionButton, styles.revokeButton]}
                      onPress={() => handleRevokePermission(permission.id)}
                    >
                      <Text style={styles.revokeButtonText}>{t.revoke}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.permissionActionButton, styles.deleteButton]}
                      onPress={() => handleDeletePermission(permission.id, false)}
                    >
                      <Text style={styles.deleteButtonText}>{t.delete || 'Delete'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.addPermissionButton}
              onPress={handleAddNewAccess}
            >
              <Text style={styles.addPermissionText}>+ {t.addNewAccess}</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {permissionsTab === 'revoked' && (
          <View style={styles.permissionsList}>
            {revokedPermissions.map((permission) => (
              <View key={permission.id} style={styles.permissionItem}>
                <View style={styles.permissionHeader}>
                  <Image 
                    source={{ uri: permission.image }} 
                    style={styles.permissionImage} 
                  />
                  <View style={styles.permissionInfo}>
                    <Text style={styles.permissionName}>{permission.name}</Text>
                    <Text style={styles.permissionRole}>{permission.role} • {permission.specialty}</Text>
                  </View>
                  <View style={styles.revokedBadge}>
                    <Text style={styles.revokedText}>{t.revoked}</Text>
                  </View>
                </View>
                
                <View style={styles.permissionDetails}>
                  <Text style={styles.permissionDetailText}>
                    {t.accessGranted} {new Date(permission.grantedDate).toLocaleDateString(language === 'pt-PT' ? 'pt-PT' : language === 'es-ES' ? 'es-ES' : 'en-US')}
                    {permission.revokedDate && ' • '}
                    {permission.revokedDate && `${t.revoked} ${new Date(permission.revokedDate).toLocaleDateString(language === 'pt-PT' ? 'pt-PT' : language === 'es-ES' ? 'es-ES' : 'en-US')}`}
                  </Text>
                </View>
                
                <View style={styles.permissionActions}>
                  <TouchableOpacity 
                    style={styles.permissionActionButton}
                    onPress={() => handleRestorePermission(permission.id)}
                  >
                    <Text style={styles.permissionActionText}>{t.restoreAccess}</Text>
                  </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.permissionActionButton, styles.deleteButton]}
                      onPress={() => handleDeletePermission(permission.id, true)}
                    >
                      <Text style={styles.deleteButtonText}>{t.delete || 'Delete'}</Text>
                    </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {permissionsTab === 'logs' && (
          <View style={styles.permissionsList}>
            {accessLogs.length === 0 ? (
              <Text style={styles.emptyStateText}>{t.notDefined || 'No access logs yet.'}</Text>
            ) : (
              accessLogs.map((log) => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logHeader}>
                    <View style={styles.logAvatarPlaceholder}>
                      <Text style={styles.logAvatarText}>{log.name?.charAt(0) || '?'}</Text>
                    </View>
                    <View style={styles.logInfo}>
                      <Text style={styles.logName}>{log.name}</Text>
                      <Text style={styles.logAction}>{log.action}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.logTime}>
                    {log.date}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
        
        <View style={styles.sharingOptionsContainer}>
          <Text style={styles.sharingOptionsTitle}>{t.sharingOptions}</Text>
          
          {sharingOptions.map((category) => (
            <View key={category.id} style={styles.sharingCategory}>
              <Text style={styles.sharingCategoryTitle}>{category.category}</Text>
              
              {category.options.map((option) => (
                <TouchableOpacity 
                  key={option.id} 
                  style={styles.sharingOption}
                  onPress={() => handleToggleSharingOption(category.id, option.id)}
                >
                  <Text style={styles.sharingOptionName}>{option.name}</Text>
                  <View style={[
                    styles.sharingToggle,
                    option.enabled ? styles.sharingToggleEnabled : styles.sharingToggleDisabled
                  ]}>
                    <View style={[
                      styles.sharingToggleHandle,
                      option.enabled && styles.sharingToggleHandleEnabled
                    ]} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };


  const renderIntegrationsTab = () => {
    const availableConfigs = getAvailableIntegrations();
    const nativeIntegrations = availableConfigs.filter((c) => c.isNative);
    const webIntegrations = availableConfigs.filter((c) => !c.isNative);

    const getIntegrationStatus = (configId: string) => {
      return thryveIntegrations.find((i) => i.id === configId);
    };

    const renderIntegrationItem = (config: typeof availableConfigs[0]) => {
      const status = getIntegrationStatus(config.id);
      const connected = status?.connected || false;
      const loading = status?.loading || false;
      const available = status?.available !== false;

      return (
        <TouchableOpacity
          key={config.id}
          style={styles.integrationItem}
          onPress={() => available && !loading && handleToggleIntegration(config.id)}
          disabled={loading || !available}
        >
          <View style={styles.integrationItemContent}>
            {getHealthServiceIconWithBackground(config.id, 24, 48)}
            <View style={styles.integrationItemInfo}>
              <View style={styles.integrationTitleRow}>
                <Text style={styles.integrationItemTitle}>{config.name}</Text>
                {!available && (
                  <Text style={styles.platformNote}>
                  {Platform.OS === 'ios' ? 'iOS' : 'Android'} only
                </Text>
                )}
              </View>
              <Text style={styles.integrationItemDescription}>
                {loading
                  ? t.connecting || 'Connecting...'
                  : connected
                  ? t.connected || 'Connected'
                  : t.notConnected || 'Not Connected'}
              </Text>
            </View>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <View
              style={[
                styles.integrationToggle,
                connected ? styles.integrationToggleEnabled : styles.integrationToggleDisabled,
              ]}
            >
              <View
                style={[
                  styles.integrationToggleHandle,
                  connected && styles.integrationToggleHandleEnabled,
                ]}
              />
            </View>
          )}
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionDescription}>
          {t.integrationsDescription || 'Connect your wearable devices and health apps to automatically sync your health data.'}
        </Text>

        {/* Mobile Health Services Section */}
        {nativeIntegrations.length > 0 && (
          <>
            <Text style={styles.sectionTitleText}>
              {t.mobileHealthServices || 'Mobile Health Services'}
            </Text>
            <View style={styles.integrationSection}>
              {nativeIntegrations.map(renderIntegrationItem)}
            </View>
          </>
        )}

        {/* Web Services Section */}
        {webIntegrations.length > 0 && (
          <>
            <Text style={[styles.sectionTitleText, { marginTop: 24 }]}>
              {t.webServices || 'Web Services'}
            </Text>
            <View style={styles.integrationSection}>
              {webIntegrations.map(renderIntegrationItem)}
            </View>
          </>
        )}

        {thryveLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
      </View>
    );
  };

  const renderNotificationsTab = () => {
    if (isLoadingNotifications) {
      return (
        <View style={[styles.tabContent, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t.loading}</Text>
        </View>
      );
    }

    const handleToggleEmailAppointments = async () => {
      await updateNotifications({
        email_appointments: !notifications?.email_appointments,
      });
    };

    const handleToggleEmailMedications = async () => {
      await updateNotifications({
        email_medications: !notifications?.email_medications,
      });
    };

    const handleToggleEmailTasks = async () => {
      await updateNotifications({
        email_tasks: !notifications?.email_tasks,
      });
    };

    const handleTogglePushAppointments = async () => {
      await updateNotifications({
        push_appointments: !notifications?.push_appointments,
      });
    };

    const handleTogglePushMedications = async () => {
      await updateNotifications({
        push_medications: !notifications?.push_medications,
      });
    };

    const handleTogglePushTasks = async () => {
      await updateNotifications({
        push_tasks: !notifications?.push_tasks,
      });
    };

    return (
    <View style={styles.tabContent}>
      <View style={styles.notificationSection}>
          <Text style={styles.notificationSectionTitle}>{t.emailNotifications}</Text>
        
          <TouchableOpacity 
            style={styles.notificationItem}
            onPress={handleToggleEmailAppointments}
            disabled={isUpdatingNotifications}
          >
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>{t.appointmentReminders}</Text>
              <Text style={styles.notificationDescription}>{t.appointmentRemindersDesc}</Text>
            </View>
            <View style={[
              styles.notificationToggle,
              notifications?.email_appointments ? styles.notificationToggleEnabled : styles.notificationToggleDisabled
            ]}>
              <View style={[
                styles.notificationToggleHandle,
                notifications?.email_appointments && styles.notificationToggleHandleEnabled
              ]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.notificationItem}
            onPress={handleToggleEmailMedications}
            disabled={isUpdatingNotifications}
          >
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>{t.medicationReminders}</Text>
              <Text style={styles.notificationDescription}>{t.medicationRemindersDesc}</Text>
            </View>
            <View style={[
              styles.notificationToggle,
              notifications?.email_medications ? styles.notificationToggleEnabled : styles.notificationToggleDisabled
            ]}>
              <View style={[
                styles.notificationToggleHandle,
                notifications?.email_medications && styles.notificationToggleHandleEnabled
              ]} />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.notificationSectionTitle}>{t.pushNotifications}</Text>
          
          <TouchableOpacity 
            style={styles.notificationItem}
            onPress={handleTogglePushAppointments}
            disabled={isUpdatingNotifications}
          >
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>{t.appointments}</Text>
              <Text style={styles.notificationDescription}>{t.appointmentRemindersDesc}</Text>
            </View>
            <View style={[
              styles.notificationToggle,
              notifications?.push_appointments ? styles.notificationToggleEnabled : styles.notificationToggleDisabled
            ]}>
              <View style={[
                styles.notificationToggleHandle,
                notifications?.push_appointments && styles.notificationToggleHandleEnabled
              ]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.notificationItem}
            onPress={handleTogglePushMedications}
            disabled={isUpdatingNotifications}
          >
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>{t.medications}</Text>
              <Text style={styles.notificationDescription}>{t.medicationRemindersDesc}</Text>
            </View>
            <View style={[
              styles.notificationToggle,
              notifications?.push_medications ? styles.notificationToggleEnabled : styles.notificationToggleDisabled
            ]}>
              <View style={[
                styles.notificationToggleHandle,
                notifications?.push_medications && styles.notificationToggleHandleEnabled
              ]} />
            </View>
          </TouchableOpacity>
      </View>
    </View>
  );
  };

  const renderPreferencesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.preferenceSection}>
        <Text style={styles.preferenceSectionTitle}>{t.language}</Text>
        
        <View style={styles.languageOptions}>
          <TouchableOpacity 
            style={[
              styles.languageOption, 
              language === 'pt-PT' && styles.languageOptionSelected
            ]}
            onPress={async () => {
              setLanguage('pt-PT');
              try {
                await updateProfile({ language: 'pt' });
              } catch (error) {
                console.error('Failed to update language:', error);
              }
            }}
          >
            <Globe size={20} color={language === 'pt-PT' ? Colors.primary : Colors.textLight} />
            <Text style={[
              styles.languageOptionText,
              language === 'pt-PT' && styles.languageOptionTextSelected
            ]}>
              {t.portuguesePortugal}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.languageOption, 
              language === 'es-ES' && styles.languageOptionSelected
            ]}
            onPress={async () => {
              setLanguage('es-ES');
              try {
                await updateProfile({ language: 'es' });
              } catch (error) {
                console.error('Failed to update language:', error);
              }
            }}
          >
            <Globe size={20} color={language === 'es-ES' ? Colors.primary : Colors.textLight} />
            <Text style={[
              styles.languageOptionText,
              language === 'es-ES' && styles.languageOptionTextSelected
            ]}>
              {t.spanishSpain}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.languageOption, 
              language === 'en-US' && styles.languageOptionSelected
            ]}
            onPress={async () => {
              setLanguage('en-US');
              try {
                await updateProfile({ language: 'en' });
              } catch (error) {
                console.error('Failed to update language:', error);
              }
            }}
          >
            <Globe size={20} color={language === 'en-US' ? Colors.primary : Colors.textLight} />
            <Text style={[
              styles.languageOptionText,
              language === 'en-US' && styles.languageOptionTextSelected
            ]}>
              {t.englishUsa}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.preferenceSectionTitle}>{t.theme}</Text>
        
        <View style={styles.themeOptions}>
          <TouchableOpacity 
            style={[styles.themeOption, theme === 'light' && styles.themeOptionSelected]}
            onPress={async () => {
              await setTheme('light');
            }}
          >
            <Sun size={24} color={theme === 'light' ? Colors.primary : Colors.textLight} />
            <Text style={[styles.themeOptionText, theme === 'light' && styles.themeOptionTextSelected]}>
              {t.light}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.themeOption, theme === 'dark' && styles.themeOptionSelected]}
            onPress={async () => {
              await setTheme('dark');
            }}
          >
            <Moon size={24} color={theme === 'dark' ? Colors.primary : Colors.textLight} />
            <Text style={[styles.themeOptionText, theme === 'dark' && styles.themeOptionTextSelected]}>
              {t.dark}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.themeOption, theme === 'system' && styles.themeOptionSelected]}
            onPress={async () => {
              await setTheme('system');
            }}
          >
            <Smartphone size={24} color={theme === 'system' ? Colors.primary : Colors.textLight} />
            <Text style={[styles.themeOptionText, theme === 'system' && styles.themeOptionTextSelected]}>
              {t.system}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.preferenceSectionTitle}>{t.accessibility}</Text>
        
        <View style={styles.accessibilityItem}>
          <View style={styles.accessibilityInfo}>
            <View style={styles.accessibilityInfoWithIcon}>
              <Type size={20} color={Colors.primary} />
            <Text style={styles.accessibilityTitle}>{t.textSize}</Text>
            </View>
          </View>
          <View style={styles.accessibilityControl}>
            <TouchableOpacity 
              style={[styles.accessibilityButton, textSize === 'small' && styles.accessibilityButtonActive]}
              onPress={async () => await setTextSize('small')}
            >
              <Text style={[styles.accessibilityButtonText, textSize === 'small' && styles.accessibilityButtonTextActive]}>
                A-
              </Text>
            </TouchableOpacity>
            <Text style={styles.accessibilityValue}>
              {textSize === 'small' ? t.small : 
               textSize === 'large' ? t.large : 
               t.normal}
            </Text>
            <TouchableOpacity 
              style={[styles.accessibilityButton, textSize === 'large' && styles.accessibilityButtonActive]}
              onPress={async () => await setTextSize('large')}
            >
              <Text style={[styles.accessibilityButtonText, textSize === 'large' && styles.accessibilityButtonTextActive]}>
                A+
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.accessibilityItem}
          onPress={() => handleToggleAccessibility('higherContrast')}
        >
          <View style={styles.accessibilityInfo}>
            <View style={styles.accessibilityInfoWithIcon}>
              <Eye size={20} color={Colors.primary} />
            <Text style={styles.accessibilityTitle}>{t.higherContrast}</Text>
            </View>
            <Text style={styles.accessibilityDescription}>{t.higherContrastDesc}</Text>
          </View>
          <View style={[
            styles.accessibilityToggle,
            accessibility.higherContrast ? styles.accessibilityToggleEnabled : styles.accessibilityToggleDisabled
          ]}>
            <View style={[
              styles.accessibilityToggleHandle,
              accessibility.higherContrast && styles.accessibilityToggleHandleEnabled
            ]} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.accessibilityItem}
          onPress={() => handleToggleAccessibility('reduceMotion')}
        >
          <View style={styles.accessibilityInfo}>
            <View style={styles.accessibilityInfoWithIcon}>
              <Activity size={20} color={Colors.primary} />
            <Text style={styles.accessibilityTitle}>{t.reduceMotion}</Text>
            </View>
            <Text style={styles.accessibilityDescription}>{t.reduceMotionDesc}</Text>
          </View>
          <View style={[
            styles.accessibilityToggle,
            accessibility.reduceMotion ? styles.accessibilityToggleEnabled : styles.accessibilityToggleDisabled
          ]}>
            <View style={[
              styles.accessibilityToggleHandle,
              accessibility.reduceMotion && styles.accessibilityToggleHandleEnabled
            ]} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.profileTitle}</Text>
          <View style={{ width: 24 }}></View>
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
          >
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
              onPress={() => setActiveTab('personal')}
            >
              <User size={16} color={activeTab === 'personal' ? Colors.primary : Colors.textLight} />
              <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>
                {t.profilePersonalData}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'emergency' && styles.activeTab]}
              onPress={() => setActiveTab('emergency')}
            >
              <AlertTriangle size={16} color={activeTab === 'emergency' ? Colors.primary : Colors.textLight} />
              <Text style={[styles.tabText, activeTab === 'emergency' && styles.activeTabText]}>
                {t.profileEmergency}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'security' && styles.activeTab]}
              onPress={() => setActiveTab('security')}
            >
              <Lock size={16} color={activeTab === 'security' ? Colors.primary : Colors.textLight} />
              <Text style={[styles.tabText, activeTab === 'security' && styles.activeTabText]}>
                {t.profileSecurity}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'permissions' && styles.activeTab]}
              onPress={() => setActiveTab('permissions')}
            >
              <Shield size={16} color={activeTab === 'permissions' ? Colors.primary : Colors.textLight} />
              <Text style={[styles.tabText, activeTab === 'permissions' && styles.activeTabText]}>
                {t.profilePermissions}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'integrations' && styles.activeTab]}
              onPress={() => setActiveTab('integrations')}
            >
              <Activity size={16} color={activeTab === 'integrations' ? Colors.primary : Colors.textLight} />
              <Text style={[styles.tabText, activeTab === 'integrations' && styles.activeTabText]}>
                {t.profileIntegrations}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
              onPress={() => setActiveTab('notifications')}
            >
              <Bell size={16} color={activeTab === 'notifications' ? Colors.primary : Colors.textLight} />
              <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>
                {t.profileNotifications}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'preferences' && styles.activeTab]}
              onPress={() => setActiveTab('preferences')}
            >
              <Settings size={16} color={activeTab === 'preferences' ? Colors.primary : Colors.textLight} />
              <Text style={[styles.tabText, activeTab === 'preferences' && styles.activeTabText]}>
                {t.profilePreferences}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'personal' && renderPersonalDataTab()}
          {activeTab === 'emergency' && renderEmergencyTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'permissions' && renderPermissionsTab()}
          {activeTab === 'integrations' && renderIntegrationsTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
        </ScrollView>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={async () => {
            Alert.alert(
              t.endSession,
              t.endSessionConfirm,
              [
                { text: t.cancel, style: 'cancel' },
                {
                  text: t.endSession,
                  style: 'destructive',
                  onPress: async () => {
                    await logout();
                    router.replace('/auth/login');
                  },
                },
              ]
            );
          }}
        >
          <LogOut size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>{t.logout}</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={editProfileModalVisible}
        onClose={() => setEditProfileModalVisible(false)}
        profile={profile || null}
        onSave={async (profileData) => {
          await updateProfileAsync(profileData);
        }}
        isSaving={isUpdatingProfile}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={changePasswordModalVisible}
        onClose={() => setChangePasswordModalVisible(false)}
      />

      {/* Two-Factor Authentication Modal */}
      <TwoFactorAuthModal
        visible={twoFactorModalVisible}
        onClose={() => setTwoFactorModalVisible(false)}
      />

      {/* Edit Emergency Modal */}
      <EditEmergencyModal
        visible={editEmergencyModalVisible}
        onClose={() => setEditEmergencyModalVisible(false)}
        emergency={emergency || null}
        onSave={async (emergencyData) => {
          await updateEmergency(emergencyData);
        }}
        isSaving={isUpdatingEmergency}
      />

      {/* Add/Edit Emergency Contact Modal */}
      <AddEmergencyContactModal
        visible={addContactModalVisible}
        onClose={() => {
          setAddContactModalVisible(false);
          setEditingContact(null);
        }}
        existingContact={editingContact}
        onSave={async (contact) => {
          const contacts = emergency?.contacts || [];
          if (editingContact) {
            // Update existing contact
            const updatedContacts = contacts.map((c, index) => {
              const contactIndex = contacts.findIndex(
                (ec) => ec.name === editingContact.name && ec.phone === editingContact.phone
              );
              return contactIndex === index ? contact : c;
            });
            await updateEmergency({ contacts: updatedContacts });
          } else {
            // Add new contact
            await updateEmergency({ contacts: [...contacts, contact] });
          }
        }}
        isSaving={isUpdatingEmergency}
      />

      {/* Grant data access modal */}
      <AddAccessModal
        visible={addAccessModalVisible}
        loading={isUpdatingSharedAccess}
        onClose={() => {
          setAddAccessModalVisible(false);
          setEditingPermission(null);
          setEditInitialInput(null);
        }}
        onSave={handleSaveNewAccess}
        initialInput={editInitialInput || undefined}
        title={editingPermission ? t.edit : undefined}
        primaryLabel={editingPermission ? t.save || 'Save' : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  tabContent: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  avatarInitials: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  avatarInitialsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.background,
  },
  editProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
  },
  editProfileText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    marginBottom: 16,
  },
  dobGenderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dobGenderItem: {
    flex: 1,
    marginBottom: 0,
  },
  measurementsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  measurementItem: {
    flex: 1,
    marginBottom: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
  },
  infoWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    padding: 4,
  },
  addButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editButtonText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 12,
  },
  contactCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  contactRelation: {
    fontSize: 14,
    color: Colors.textLight,
  },
  contactInfo: {
    marginBottom: 12,
  },
  contactPhone: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  contactAction: {
    padding: 4,
  },
  contactActionText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  emergencyInfoCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emergencyInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyInfoLabel: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  emergencyInfoValue: {
    fontSize: 14,
    color: Colors.textLight,
  },
  securitySection: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  securityItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityItemInfo: {
    marginLeft: 12,
  },
  securityItemTitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  securityItemDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  permissionsTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    padding: 4,
  },
  permissionsTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  activePermissionsTab: {
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  permissionsTabText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  activePermissionsTabText: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  permissionsList: {
    marginBottom: 24,
  },
  permissionCategory: {
    marginBottom: 16,
  },
  permissionCategoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  permissionItem: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  permissionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  permissionRole: {
    fontSize: 14,
    color: Colors.textLight,
  },
  accessLevelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  fullAccessBadge: {
    backgroundColor: Colors.success + '20',
  },
  partialAccessBadge: {
    backgroundColor: Colors.warning + '20',
  },
  limitedAccessBadge: {
    backgroundColor: Colors.danger + '20',
  },
  accessLevelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
  },
  revokedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: Colors.textLighter + '20',
  },
  revokedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textLighter,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.danger + '20',
    borderWidth: 1,
    borderColor: Colors.danger + '40',
  },
  deleteButtonText: {
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '600',
  },
  permissionDetails: {
    marginBottom: 12,
  },
  permissionDetailText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  permissionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  permissionActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.secondary,
  },
  permissionActionText: {
    fontSize: 12,
    color: Colors.text,
  },
  revokeButton: {
    backgroundColor: Colors.danger + '20',
  },
  revokeButtonText: {
    fontSize: 12,
    color: Colors.danger,
  },
  addPermissionButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    marginTop: 8,
  },
  addPermissionText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  logItem: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logAvatarText: {
    color: Colors.text,
    fontWeight: '700',
  },
  logImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  logInfo: {
    flex: 1,
  },
  logName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  logAction: {
    fontSize: 14,
    color: Colors.textLight,
  },
  logTime: {
    fontSize: 12,
    color: Colors.textLighter,
    alignSelf: 'flex-end',
  },
  sharingOptionsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sharingOptionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  sharingCategory: {
    marginBottom: 16,
  },
  sharingCategoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  sharingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sharingOptionName: {
    fontSize: 14,
    color: Colors.text,
  },
  sharingToggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  sharingToggleEnabled: {
    backgroundColor: Colors.primary,
  },
  sharingToggleDisabled: {
    backgroundColor: Colors.textLighter,
  },
  sharingToggleHandle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  sharingToggleHandleEnabled: {
    marginLeft: 16,
  },
  integrationSection: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  integrationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  integrationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  integrationItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  integrationItemInfo: {
    flex: 1,
  },
  integrationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  integrationItemTitle: {
    fontSize: 16,
    color: Colors.text,
  },
  platformNote: {
    fontSize: 11,
    color: Colors.textLight,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  integrationItemDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  integrationToggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  integrationToggleEnabled: {
    backgroundColor: Colors.primary,
  },
  integrationToggleDisabled: {
    backgroundColor: Colors.textLighter,
  },
  integrationToggleHandle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  integrationToggleHandleEnabled: {
    marginLeft: 16,
  },
  notificationSection: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
    marginTop: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  notificationToggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  notificationToggleEnabled: {
    backgroundColor: Colors.primary,
  },
  notificationToggleDisabled: {
    backgroundColor: Colors.textLighter,
  },
  notificationToggleHandle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  notificationToggleHandleEnabled: {
    marginLeft: 16,
  },
  preferenceSection: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  preferenceSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
    marginTop: 16,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  themeOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    width: '30%',
  },
  themeOptionSelected: {
    backgroundColor: Colors.primary + '20',
  },
  themeOptionText: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
  },
  themeOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  accessibilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  accessibilityInfo: {
    flex: 1,
  },
  accessibilityInfoWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  accessibilityTitle: {
    fontSize: 16,
    color: Colors.text,
  },
  accessibilityDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  accessibilityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessibilityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  accessibilityButtonActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  accessibilityButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  accessibilityButtonTextActive: {
    color: Colors.primary,
  },
  accessibilityValue: {
    fontSize: 14,
    color: Colors.text,
    marginHorizontal: 8,
  },
  accessibilityToggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  accessibilityToggleEnabled: {
    backgroundColor: Colors.primary,
  },
  accessibilityToggleDisabled: {
    backgroundColor: Colors.textLighter,
  },
  accessibilityToggleHandle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  accessibilityToggleHandleEnabled: {
    marginLeft: 16,
  },
  languageOptions: {
    marginBottom: 24,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    marginBottom: 12,
  },
  languageOptionSelected: {
    backgroundColor: Colors.primary + '20',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  languageOptionText: {
    fontSize: 16,
    color: Colors.textLight,
    marginLeft: 12,
  },
  languageOptionTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.danger,
    marginLeft: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: Colors.textLight,
  },
});