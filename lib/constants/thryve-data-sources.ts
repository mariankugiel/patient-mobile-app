import { Source } from '@thryve/react-native-sdk';
import { Platform } from 'react-native';

// Data source IDs (from Thryve backend)
export const DATA_SOURCE_IDS = {
  FITBIT: 1,
  GARMIN: 2,
  POLAR: 3,
  WITHINGS: 8,
  STRAVA: 4,
  OMRON_CONNECT: 5,
  SUUNTO: 6,
  OURA: 7,
  BEURER: 9,
  HUAWEI_HEALTH: 10,
  // Add more as needed
} as const;

// Native data sources (SDK Source enum)
export const NATIVE_SOURCES = {
  APPLE_HEALTH: Source.APPLE,
  HEALTH_CONNECT: Source.HEALTH_CONNECT,
  SAMSUNG_HEALTH: Source.SAMSUNG,
  // GOOGLE_FIT: Source.GOOGLE_FIT, // If available in SDK
} as const;

// Integration type mapping
export interface IntegrationConfig {
  id: string;
  name: string;
  dataSourceId?: number; // For web data sources
  nativeSource?: Source; // For native data sources
  platform: 'ios' | 'android' | 'both';
  isNative: boolean;
}

export const INTEGRATION_CONFIGS: IntegrationConfig[] = [
  // Native data sources
  {
    id: 'apple_health',
    name: 'Apple Health',
    nativeSource: NATIVE_SOURCES.APPLE_HEALTH,
    platform: 'ios',
    isNative: true,
  },
  {
    id: 'health_connect',
    name: 'Health Connect',
    nativeSource: NATIVE_SOURCES.HEALTH_CONNECT,
    platform: 'android',
    isNative: true,
  },
  {
    id: 'samsung_health',
    name: 'Samsung Health',
    nativeSource: NATIVE_SOURCES.SAMSUNG_HEALTH,
    platform: 'android',
    isNative: true,
  },
  // Web data sources
  {
    id: 'fitbit',
    name: 'Fitbit',
    dataSourceId: DATA_SOURCE_IDS.FITBIT,
    platform: 'both',
    isNative: false,
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    dataSourceId: DATA_SOURCE_IDS.GARMIN,
    platform: 'both',
    isNative: false,
  },
  {
    id: 'polar',
    name: 'Polar',
    dataSourceId: DATA_SOURCE_IDS.POLAR,
    platform: 'both',
    isNative: false,
  },
  {
    id: 'withings',
    name: 'Withings',
    dataSourceId: DATA_SOURCE_IDS.WITHINGS,
    platform: 'both',
    isNative: false,
  },
  {
    id: 'strava',
    name: 'Strava',
    dataSourceId: DATA_SOURCE_IDS.STRAVA,
    platform: 'both',
    isNative: false,
  },
  {
    id: 'omron_connect',
    name: 'Omron Connect',
    dataSourceId: DATA_SOURCE_IDS.OMRON_CONNECT,
    platform: 'both',
    isNative: false,
  },
  {
    id: 'suunto',
    name: 'Suunto',
    dataSourceId: DATA_SOURCE_IDS.SUUNTO,
    platform: 'both',
    isNative: false,
  },
  {
    id: 'oura',
    name: 'Oura',
    dataSourceId: DATA_SOURCE_IDS.OURA,
    platform: 'both',
    isNative: false,
  },
  {
    id: 'beurer',
    name: 'Beurer',
    dataSourceId: DATA_SOURCE_IDS.BEURER,
    platform: 'both',
    isNative: false,
  },
  {
    id: 'huawei_health',
    name: 'Huawei Health',
    dataSourceId: DATA_SOURCE_IDS.HUAWEI_HEALTH,
    platform: 'android',
    isNative: false,
  },
];

// Get available integrations for current platform
export const getAvailableIntegrations = (): IntegrationConfig[] => {
  const currentPlatform = Platform.OS === 'ios' ? 'ios' : 'android';
  return INTEGRATION_CONFIGS.filter(
    (config) => config.platform === 'both' || config.platform === currentPlatform
  );
};

