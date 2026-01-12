import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import {
  getThryveSDK,
  getUserInformation,
  isNativeDataSourceAvailable,
  startNativeDataSource,
  stopNativeDataSource,
  connectWebDataSource,
  disconnectWebDataSource,
  UserInformation,
} from '@/lib/services/thryve-sdk-service';
import {
  INTEGRATION_CONFIGS,
  IntegrationConfig,
  getAvailableIntegrations,
} from '@/lib/constants/thryve-data-sources';
import { Source } from '@thryve/react-native-sdk';

export interface IntegrationStatus {
  id: string;
  connected: boolean;
  connectedAt?: string;
  available?: boolean;
  loading?: boolean;
}

export function useThryveIntegration() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);

  // Load integration status
  const loadIntegrationStatus = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get user information from SDK
      const info = await getUserInformation();
      setUserInfo(info);
      
      // Get available integrations for current platform
      const availableConfigs = getAvailableIntegrations();
      
      // Check availability for native sources
      const statusPromises = availableConfigs.map(async (config) => {
        let connected = false;
        let connectedAt: string | undefined;
        let available = true;
        
        // Check if connected (from userInfo)
        if (info?.connectedSources) {
          if (config.isNative && config.nativeSource) {
            // For native sources, check by source type
            // Note: You may need to map source types to IDs differently
            const sourceId = getSourceId(config.nativeSource);
            const connectedSource = info.connectedSources.find(
              (cs) => cs.id === sourceId
            );
            if (connectedSource) {
              connected = true;
              connectedAt = connectedSource.connectedAt;
            }
          } else if (config.dataSourceId) {
            // For web sources, check by data source ID
            const connectedSource = info.connectedSources.find(
              (cs) => cs.id === config.dataSourceId
            );
            if (connectedSource) {
              connected = true;
              connectedAt = connectedSource.connectedAt;
            }
          }
        }
        
        // Check availability for native sources
        if (config.isNative && config.nativeSource) {
          available = await isNativeDataSourceAvailable(config.nativeSource);
        }
        
        return {
          id: config.id,
          connected,
          connectedAt,
          available,
          loading: false,
        };
      });
      
      const statuses = await Promise.all(statusPromises);
      setIntegrations(statuses);
    } catch (error) {
      console.error('Failed to load integration status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    loadIntegrationStatus();
  }, [loadIntegrationStatus]);

  // Connect integration
  const connectIntegration = useCallback(
    async (integrationId: string) => {
      const config = INTEGRATION_CONFIGS.find((c) => c.id === integrationId);
      if (!config) {
        throw new Error('Integration not found');
      }

      // Update loading state
      setIntegrations((prev) =>
        prev.map((i) => (i.id === integrationId ? { ...i, loading: true } : i))
      );

      try {
        if (config.isNative && config.nativeSource) {
          // Native data source
          await new Promise<void>((resolve, reject) => {
            startNativeDataSource(config.nativeSource!, (success, errors) => {
              if (success) {
                resolve();
              } else {
                reject(new Error(errors?.join(', ') || 'Connection failed'));
              }
            });
          });
        } else if (config.dataSourceId) {
          // Web data source
          await connectWebDataSource(config.dataSourceId);
        } else {
          throw new Error('Invalid integration configuration');
        }

        // Reload status after connection
        await loadIntegrationStatus();
      } catch (error: any) {
        console.error('Failed to connect integration:', error);
        // Update loading state
        setIntegrations((prev) =>
          prev.map((i) => (i.id === integrationId ? { ...i, loading: false } : i))
        );
        throw error;
      }
    },
    [loadIntegrationStatus]
  );

  // Disconnect integration
  const disconnectIntegration = useCallback(
    async (integrationId: string) => {
      const config = INTEGRATION_CONFIGS.find((c) => c.id === integrationId);
      if (!config) {
        throw new Error('Integration not found');
      }

      // Update loading state
      setIntegrations((prev) =>
        prev.map((i) => (i.id === integrationId ? { ...i, loading: true } : i))
      );

      try {
        if (config.isNative && config.nativeSource) {
          // Native data source
          await new Promise<void>((resolve, reject) => {
            stopNativeDataSource(config.nativeSource!, (success, errors) => {
              if (success) {
                resolve();
              } else {
                reject(new Error(errors?.join(', ') || 'Disconnection failed'));
              }
            });
          });
        } else if (config.dataSourceId) {
          // Web data source
          await disconnectWebDataSource(config.dataSourceId);
        } else {
          throw new Error('Invalid integration configuration');
        }

        // Reload status after disconnection
        await loadIntegrationStatus();
      } catch (error: any) {
        console.error('Failed to disconnect integration:', error);
        // Update loading state
        setIntegrations((prev) =>
          prev.map((i) => (i.id === integrationId ? { ...i, loading: false } : i))
        );
        throw error;
      }
    },
    [loadIntegrationStatus]
  );

  return {
    integrations,
    loading,
    userInfo,
    connectIntegration,
    disconnectIntegration,
    refreshStatus: loadIntegrationStatus,
  };
}

// Helper to get source ID (you may need to adjust this based on Thryve SDK)
function getSourceId(source: Source): number {
  // Map Source enum to data source IDs
  // This mapping may need to be adjusted based on actual Thryve SDK implementation
  const sourceIdMap: Record<string, number> = {
    [Source.APPLE]: 100, // Example ID for Apple Health
    [Source.HEALTH_CONNECT]: 101, // Example ID for Health Connect
    [Source.SAMSUNG]: 102, // Example ID for Samsung Health
  };
  return sourceIdMap[source] || 0;
}

