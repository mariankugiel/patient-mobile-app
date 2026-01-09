import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/lib/auth/auth-store';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  
  const { login, loginWithGoogle, isLoading, isAuthenticated, isRestoringSession, error, clearError } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isRestoringSession) {
    router.replace('/(tabs)/records');
    }
  }, [isAuthenticated, isRestoringSession, router]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert(t.error || 'Error', error, [
        { text: t.ok || 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError, t]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t.error || 'Error', t.fillAllFields);
      return;
    }

    try {
      await login(email.trim(), password);
      // Navigation will happen automatically via useEffect
    } catch (err) {
      // Error is handled by the store and shown via Alert
      console.error('Login error:', err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Navigation will happen automatically via useEffect
    } catch (err) {
      // Error is handled by the store and shown via Alert
      console.error('Google login error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/tngmkudgsyponxq7lbdtj' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.subtitle}>{t.yourHealthOnePlace}</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t.email}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.enterEmail}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t.password}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t.enterPassword}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.textLight} />
                  ) : (
                    <Eye size={20} color={Colors.textLight} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>{t.forgotPassword}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading || isRestoringSession}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.background} />
              ) : (
                <Text style={styles.loginButtonText}>{t.signIn}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>{t.or}</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity 
              style={[styles.googleButton, isLoading && styles.googleButtonDisabled]} 
              onPress={handleGoogleLogin}
              disabled={isLoading || isRestoringSession}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.text} />
              ) : (
                <>
                  <Image
                    source={{ uri: 'https://www.google.com/favicon.ico' }}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleButtonText}>{t.continueWithGoogle}</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>{t.dontHaveAccount}</Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.registerLink}>{t.register}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 280,
    height: 140,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.textLight,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: Colors.textLight,
    fontSize: 14,
  },
  registerLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});