import { ThryveSDK, Source } from '@thryve/react-native-sdk';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform, Alert } from 'react-native';
import { getThryveConfig } from '@/lib/config/thryve-config';
import { INTEGRATION_CONFIGS, IntegrationConfig } from '@/lib/constants/thryve-data-sources';

let thryveSDKInstance: ThryveSDK | null = null;

export interface ThryveResponse<T> {
  successful: boolean;
  data?: T;
  errors?: Array<{ errorMessage?: string }>;
}

export interface ConnectedSource {
  id: number;
  connectedAt?: string;
}

export interface UserInformation {
  connectedSources: ConnectedSource[];
}

/**
 * Initialize and get Thryve SDK instance
 */
export function getThryveSDK(): ThryveSDK {
  if (!thryveSDKInstance) {
    const config = getThryveConfig();
    thryveSDKInstance = new ThryveSDK().getOrCreate(config);
  }
  return thryveSDKInstance;
}

/**
 * Get connection URL for web data source
 */
export async function getConnectDataSourceUrl(
  dataSourceId: number,
  redirectUrl: string = 'myapp://thryve-callback'
): Promise<string | null> {
  try {
    const sdk = getThryveSDK();
    const response = await sdk.getConnectDataSourceUrl(dataSourceId, redirectUrl);
    
    if (response.successful && response.data) {
      return response.data;
    }
    
    if (response.errors) {
      const errorMessages = response.errors
        .map((e) => e.errorMessage || 'Unknown error')
        .join(', ');
      throw new Error(errorMessages);
    }
    
    return null;
  } catch (error: any) {
    console.error('Failed to get connect URL:', error);
    throw error;
  }
}

/**
 * Get revoke URL for web data source
 */
export async function getRevokeDataSourceUrl(
  dataSourceId: number,
  requireUserAction: boolean = false,
  redirectUrl: string = 'myapp://thryve-callback'
): Promise<string | null> {
  try {
    const sdk = getThryveSDK();
    const response = await sdk.getRevokeDataSourceUrl(
      dataSourceId,
      requireUserAction,
      redirectUrl
    );
    
    if (response.successful && response.data) {
      return response.data;
    }
    
    if (response.errors) {
      const errorMessages = response.errors
        .map((e) => e.errorMessage || 'Unknown error')
        .join(', ');
      throw new Error(errorMessages);
    }
    
    return null;
  } catch (error: any) {
    console.error('Failed to get revoke URL:', error);
    throw error;
  }
}

/**
 * Check if native data source is available
 */
export async function isNativeDataSourceAvailable(source: Source): Promise<boolean> {
  try {
    const sdk = getThryveSDK();
    return await sdk.isAvailable(source);
  } catch (error) {
    console.error('Failed to check availability:', error);
    return false;
  }
}

/**
 * Start native data source connection
 */
export function startNativeDataSource(
  source: Source,
  onComplete?: (success: boolean, errors?: string[]) => void
): void {
  try {
    const sdk = getThryveSDK();
    sdk.start(source, (result) => {
      if (result.successful) {
        console.log(`✅ ${source} connection started successfully`);
        onComplete?.(true);
      } else {
        const errors = result.errors?.map((e) => e.errorMessage || 'Unknown error') || [];
        console.error(`❌ Failed to start ${source}:`, errors);
        onComplete?.(false, errors);
      }
    });
  } catch (error: any) {
    console.error('Failed to start native data source:', error);
    onComplete?.(false, [error.message || 'Unknown error']);
  }
}

/**
 * Stop native data source connection
 */
export function stopNativeDataSource(
  source: Source,
  onComplete?: (success: boolean, errors?: string[]) => void
): void {
  try {
    const sdk = getThryveSDK();
    sdk.stop(source, (result) => {
      if (result.successful) {
        console.log(`✅ ${source} connection stopped successfully`);
        onComplete?.(true);
      } else {
        const errors = result.errors?.map((e) => e.errorMessage || 'Unknown error') || [];
        console.error(`❌ Failed to stop ${source}:`, errors);
        onComplete?.(false, errors);
      }
    });
  } catch (error: any) {
    console.error('Failed to stop native data source:', error);
    onComplete?.(false, [error.message || 'Unknown error']);
  }
}

/**
 * Get user information (connected sources)
 */
export async function getUserInformation(): Promise<UserInformation | null> {
  try {
    const sdk = getThryveSDK();
    const response = await sdk.getUserInformation();
    
    if (response.successful && response.data) {
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get user information:', error);
    return null;
  }
}

/**
 * Open URL in external browser
 */
export async function openUrlInBrowser(url: string): Promise<void> {
  try {
    // Use expo-web-browser for better compatibility
    await WebBrowser.openBrowserAsync(url, {
      showInRecents: true,
    });
  } catch (error) {
    console.error('Failed to open browser:', error);
    // Fallback to Linking
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      throw new Error('Cannot open URL');
    }
  }
}

/**
 * Connect web data source
 */
export async function connectWebDataSource(
  dataSourceId: number,
  redirectUrl: string = 'myapp://thryve-callback'
): Promise<void> {
  const url = await getConnectDataSourceUrl(dataSourceId, redirectUrl);
  if (url) {
    await openUrlInBrowser(url);
  } else {
    throw new Error('Failed to get connection URL');
  }
}

/**
 * Disconnect web data source
 */
export async function disconnectWebDataSource(
  dataSourceId: number,
  requireUserAction: boolean = false,
  redirectUrl: string = 'myapp://thryve-callback'
): Promise<void> {
  const url = await getRevokeDataSourceUrl(dataSourceId, requireUserAction, redirectUrl);
  if (url) {
    await openUrlInBrowser(url);
  } else {
    throw new Error('Failed to get revoke URL');
  }
}

