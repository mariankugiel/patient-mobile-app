import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, ScrollView,
  TouchableOpacity, Alert, Switch,
  TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { X, Smartphone, Shield, CheckCircle, QrCode, Copy } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { MFAApiService, MFAEnrollResponse, MFAFactor } from '@/lib/api/mfa-api';
import { useAuthStore } from '@/lib/auth/auth-store';
import * as Clipboard from 'expo-clipboard';

interface TwoFactorAuthModalProps {
  visible: boolean;
  onClose: () => void;
}

type SetupStep = 'initial' | 'enrolling' | 'qr-code' | 'verifying' | 'enabled' | 'error';

export default function TwoFactorAuthModal({
  visible,
  onClose,
}: TwoFactorAuthModalProps) {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const [isEnabled, setIsEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState<SetupStep>('initial');
  const [enrollData, setEnrollData] = useState<MFAEnrollResponse | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);

  // Load current 2FA status
  useEffect(() => {
    if (visible) {
      loadMFAStatus();
    }
  }, [visible]);

  const loadMFAStatus = async () => {
    try {
      const factors = await MFAApiService.listFactors();
      const hasActiveFactor = factors.length > 0 && factors.some(f => f.status === 'verified');
      setIsEnabled(hasActiveFactor);
      if (hasActiveFactor) {
        setFactorId(factors.find(f => f.status === 'verified')?.id || null);
      }
      setSetupStep('initial');
    } catch (err: any) {
      console.error('Failed to load MFA status:', err);
      // If it's an auth session error, don't show it as an error - just assume 2FA is disabled
      if (err.message?.includes('Auth session missing')) {
        setIsEnabled(false);
        setFactorId(null);
        setSetupStep('initial');
        return;
      }
      setError(err.message || 'Failed to load 2FA status');
    }
  };

  const handleEnable2FA = async () => {
    setIsLoading(true);
    setError(null);
    setSetupStep('enrolling');

    try {
      const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';
      const friendlyName = `${firstName}-authenticator`;
      
      const data = await MFAApiService.enrollMFA(friendlyName);
      setEnrollData(data);
      setFactorId(data.id);
      setSetupStep('qr-code');
    } catch (err: any) {
      console.error('Failed to enroll 2FA:', err);
      setError(err.message || 'Failed to enable 2FA');
      setSetupStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6 || !factorId) {
      Alert.alert(t.error || 'Error', t.fieldRequired || 'Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSetupStep('verifying');

    try {
      await MFAApiService.verifyMFAEnrollment(factorId, verificationCode);
      setIsEnabled(true);
      setSetupStep('enabled');
      setVerificationCode('');
      Alert.alert(t.success || 'Success', t.twoFactorEnabledInfo || 'Two-factor authentication has been enabled successfully!');
    } catch (err: any) {
      console.error('Failed to verify 2FA code:', err);
      setError(err.message || 'Invalid verification code. Please try again.');
      setSetupStep('qr-code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!factorId) {
      Alert.alert(t.error || 'Error', 'No 2FA factor found');
      return;
    }

    Alert.alert(
      t.disable || 'Disable',
      t.disableTwoFactorConfirm || 'Are you sure you want to disable two-factor authentication?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.disable || 'Disable',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await MFAApiService.unenrollMFA(factorId);
              setIsEnabled(false);
              setFactorId(null);
              setEnrollData(null);
              setSetupStep('initial');
              Alert.alert(t.success || 'Success', t.twoFactorDisabled || 'Two-factor authentication has been disabled');
            } catch (err: any) {
              console.error('Failed to disable 2FA:', err);
              Alert.alert(t.error || 'Error', err.message || 'Failed to disable 2FA');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const copySecret = async () => {
    if (enrollData?.totp?.secret) {
      await Clipboard.setStringAsync(enrollData.totp.secret);
      Alert.alert(t.success || 'Success', 'Secret code copied to clipboard');
    }
  };

  const handleClose = () => {
    setSetupStep('initial');
    setEnrollData(null);
    setVerificationCode('');
    setError(null);
    onClose();
  };

  const renderContent = () => {
    if (setupStep === 'enrolling') {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Setting up 2FA...</Text>
        </View>
      );
    }

    if (setupStep === 'qr-code' && enrollData) {
      return (
        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Scan QR Code</Text>
          <Text style={styles.qrDescription}>
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </Text>
          
          {enrollData.totp?.uri ? (
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={enrollData.totp.uri}
                size={256}
                color={Colors.text}
                backgroundColor={Colors.background}
                logoSize={0}
                ecl="M"
              />
            </View>
          ) : enrollData.totp?.qr_code ? (
            <View style={styles.qrCodeContainer}>
              <Text style={styles.errorText}>QR code URI not available. Please use the secret key below.</Text>
            </View>
          ) : (
            <View style={styles.qrCodeContainer}>
              <Text style={styles.errorText}>QR code not available. Please use the secret key below.</Text>
            </View>
          )}

          {enrollData.totp?.secret && (
            <View style={styles.secretContainer}>
              <Text style={styles.secretLabel}>Or enter this code manually:</Text>
              <View style={styles.secretRow}>
                <Text style={styles.secretText} selectable>{enrollData.totp.secret}</Text>
                <TouchableOpacity onPress={copySecret} style={styles.copyButton}>
                  <Copy size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.verificationContainer}>
            <Text style={styles.verificationLabel}>Enter verification code:</Text>
            <TextInput
              style={styles.verificationInput}
              value={verificationCode}
              onChangeText={(text) => setVerificationCode(text.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            <TouchableOpacity
              style={[styles.verifyButton, (isLoading || verificationCode.length !== 6) && styles.verifyButtonDisabled]}
              onPress={handleVerifyCode}
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.background} />
              ) : (
                <Text style={styles.verifyButtonText}>{t.confirm}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (setupStep === 'verifying') {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Verifying code...</Text>
        </View>
      );
    }

    if (setupStep === 'enabled') {
      return (
        <View style={styles.successContainer}>
          <CheckCircle size={64} color={Colors.success} />
          <Text style={styles.successTitle}>2FA Enabled</Text>
          <Text style={styles.successText}>
            Two-factor authentication is now active. You'll be asked for a verification code when signing in.
          </Text>
          <TouchableOpacity style={styles.doneButton} onPress={handleClose}>
            <Text style={styles.doneButtonText}>{t.ok}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Initial state
    return (
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Shield size={48} color={Colors.primary} />
        </View>
        
        <Text style={styles.title}>{t.twoFactorAuth}</Text>
        <Text style={styles.description}>
          {t.twoFactorDescription || 'Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password.'}
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Smartphone size={20} color={Colors.primary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{t.twoFactorAuth}</Text>
              <Text style={styles.settingSubtitle}>
                {isEnabled ? (t.enabled || 'Enabled') : (t.disabled || 'Disabled')}
              </Text>
            </View>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={isEnabled ? handleDisable2FA : handleEnable2FA}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.background}
            disabled={isLoading}
          />
        </View>

        {isEnabled && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              {t.twoFactorEnabledInfo || 'Two-factor authentication is currently enabled. You will be asked for a verification code when signing in.'}
            </Text>
          </View>
        )}

        {error && setupStep === 'error' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setSetupStep('initial');
              }}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton} disabled={isLoading}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.twoFactorAuth}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {renderContent()}
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  content: {
    padding: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 32,
    lineHeight: 24,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  infoBox: {
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textLight,
  },
  qrContainer: {
    padding: 16,
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  qrDescription: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  qrCodeContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    width: '100%',
  },
  qrCode: {
    width: 256,
    height: 256,
    backgroundColor: '#FFFFFF',
  },
  secretContainer: {
    width: '100%',
    marginBottom: 24,
  },
  secretLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  secretRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secretText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'monospace',
    color: Colors.text,
  },
  copyButton: {
    padding: 8,
    marginLeft: 8,
  },
  verificationContainer: {
    width: '100%',
  },
  verificationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  verificationInput: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
    fontFamily: 'monospace',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  doneButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorBox: {
    backgroundColor: Colors.warning + '20',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: Colors.warning,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
});
