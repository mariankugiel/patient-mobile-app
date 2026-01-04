import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Activity } from 'lucide-react-native';

export interface HealthServiceIconConfig {
  logoUrl: string;
  color: string;
  backgroundColor?: string;
}

/**
 * Health service logo URLs and configurations
 * Using official brand assets and reliable CDN sources
 */
export const healthServiceIcons: Record<string, HealthServiceIconConfig> = {
  healthConnect: {
    logoUrl: 'https://play-lh.googleusercontent.com/EbzDx68RZddtIMvs8H8MLcO-KOiBqEYJbi_kRjEdXved0p3KXr0nwUnLUgitZ5kQVWVZ=w240-h480-rw',
    color: '#4285F4', // Google Blue
    backgroundColor: '#E8F0FE',
  },
  appleHealth: {
    logoUrl: 'https://developer.apple.com/assets/elements/icons/healthkit/healthkit-96x96_2x.png',
    color: '#8E8E93', // Apple Gray
    backgroundColor: '#F2F2F7',
  },
  fitbit: {
    logoUrl: 'https://cdn.simpleicons.org/fitbit/00B0B9',
    color: '#00B0B9', // Fitbit Teal
    backgroundColor: '#E0F7FA',
  },
  garmin: {
    logoUrl: 'https://cdn.simpleicons.org/garmin/FF6600',
    color: '#FF6600', // Garmin Orange
    backgroundColor: '#FFF4E6',
  },
  polar: {
    logoUrl: 'https://cdn.simpleicons.org/polar/DC143C',
    color: '#DC143C', // Polar Red
    backgroundColor: '#FFE4E1',
  },
  samsungHealth: {
    logoUrl: 'https://cdn.simpleicons.org/samsung/1428A0',
    color: '#1428A0', // Samsung Blue
    backgroundColor: '#E3E8F5',
  },
  withings: {
    logoUrl: 'https://cdn.simpleicons.org/withings/00AEEF',
    color: '#00AEEF', // Withings Blue
    backgroundColor: '#E0F5FF',
  },
  strava: {
    logoUrl: 'https://cdn.simpleicons.org/strava/FC4C02',
    color: '#FC4C02', // Strava Orange
    backgroundColor: '#FFF0E6',
  },
  googleFit: {
    logoUrl: 'https://www.gstatic.com/images/branding/product/2x/fit_48dp.png',
    color: '#4285F4', // Google Blue
    backgroundColor: '#E8F0FE',
  },
  omron_connect: {
    logoUrl: 'https://cdn.simpleicons.org/omron/E60012',
    color: '#E60012', // Omron Red
    backgroundColor: '#FFE4E1',
  },
  suunto: {
    logoUrl: 'https://cdn.simpleicons.org/suunto/0066CC',
    color: '#0066CC', // Suunto Blue
    backgroundColor: '#E0F0FF',
  },
  oura: {
    logoUrl: 'https://cdn.simpleicons.org/oura/9333EA',
    color: '#9333EA', // Oura Purple
    backgroundColor: '#F3E8FF',
  },
  beurer: {
    logoUrl: 'https://cdn.simpleicons.org/beurer/00C853',
    color: '#00C853', // Beurer Green
    backgroundColor: '#E8F5E9',
  },
  huawei_health: {
    logoUrl: 'https://cdn.simpleicons.org/huawei/FF0000',
    color: '#FF0000', // Huawei Red
    backgroundColor: '#FFE4E1',
  },
  iHealth: {
    logoUrl: 'https://cdn.simpleicons.org/ihealth/00AEEF',
    color: '#00AEEF', // iHealth Blue
    backgroundColor: '#E0F5FF',
  },
  beurer: {
    logoUrl: 'https://cdn.simpleicons.org/beurer/00C853',
    color: '#00C853', // Beurer Green
    backgroundColor: '#E8F5E9',
  },
  huaweiHealth: {
    logoUrl: 'https://cdn.simpleicons.org/huawei/FF0000',
    color: '#FF0000', // Huawei Red
    backgroundColor: '#FFE4E1',
  },
  dexcom: {
    logoUrl: 'https://cdn.simpleicons.org/dexcom/0066CC',
    color: '#0066CC', // Dexcom Blue
    backgroundColor: '#E0F0FF',
  },
  whoop: {
    logoUrl: 'https://cdn.simpleicons.org/whoop/00D4FF',
    color: '#00D4FF', // Whoop Cyan
    backgroundColor: '#E0F7FF',
  },
  decathlon: {
    logoUrl: 'https://cdn.simpleicons.org/decathlon/FF6B00',
    color: '#FF6B00', // Decathlon Orange
    backgroundColor: '#FFF4E6',
  },
};

/**
 * Get health service icon component with color
 */
export function getHealthServiceIcon(serviceId: string, size: number = 24): React.ReactElement | null {
  const config = healthServiceIcons[serviceId];
  if (!config || !config.logoUrl) {
    // Fallback to default icon if config or logoUrl is missing
    const DefaultIcon = Activity;
    return <DefaultIcon size={size} color="#666666" />;
  }

  // Always use logo URL
  return (
    <Image
      source={{ uri: config.logoUrl }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}

/**
 * Get health service icon with background circle
 */
export function getHealthServiceIconWithBackground(
  serviceId: string,
  size: number = 24,
  containerSize: number = 48
): React.ReactElement | null {
  const config = healthServiceIcons[serviceId];
  if (!config || !config.logoUrl) {
    // Fallback to default icon if config or logoUrl is missing
    const DefaultIcon = Activity;
    return (
      <View style={[styles.iconContainer, { width: containerSize, height: containerSize, backgroundColor: '#F5F5F5' }]}>
        <DefaultIcon size={size} color="#666666" />
      </View>
    );
  }

  // Always use logo URL
  return (
    <View style={[
      styles.iconContainer,
      {
        width: containerSize,
        height: containerSize,
        backgroundColor: config.backgroundColor || '#F5F5F5',
      }
    ]}>
      <Image
        source={{ uri: config.logoUrl }}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

