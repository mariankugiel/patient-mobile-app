import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ThryveCallback() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const handleCallback = async () => {
      const dataSource = params.dataSource as string;
      const connected = params.connected === 'true';
      const error = params.error as string;

      // Wait a moment for any SDK callbacks to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (error) {
        console.error('Thryve connection error:', error);
        // Navigate back to profile with error
        router.replace({
          pathname: '/profile',
          params: { thryveError: error },
        });
      } else if (connected) {
        console.log('Thryve connection successful for data source:', dataSource);
        // Navigate back to profile with success
        router.replace({
          pathname: '/profile',
          params: { thryveSuccess: dataSource },
        });
      } else {
        // Navigate back to profile
        router.replace('/profile');
      }
    };

    handleCallback();
  }, [params, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>{t.loading || 'Processing...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    marginTop: 16,
    color: Colors.text,
  },
});

