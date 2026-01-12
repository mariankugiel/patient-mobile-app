import Constants from 'expo-constants';

export interface ThryveSDKConfig {
  partnerId: string;
  apiKey: string;
  appAuthorization?: string;
  // Add other required config fields based on Thryve SDK docs
}

export const getThryveConfig = (): ThryveSDKConfig => {
  return {
    partnerId: Constants.expoConfig?.extra?.thryvePartnerId || '',
    apiKey: Constants.expoConfig?.extra?.thryveApiKey || '',
    appAuthorization: Constants.expoConfig?.extra?.thryveAppAuthorization || '',
  };
};

