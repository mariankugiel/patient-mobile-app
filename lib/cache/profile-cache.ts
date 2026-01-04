import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile, UserEmergency, UserNotifications } from '../api/types';

const CACHE_KEYS = {
  PROFILE: '@profile_cache',
  EMERGENCY: '@emergency_cache',
  NOTIFICATIONS: '@notifications_cache',
  CACHE_TIMESTAMP: '@cache_timestamp',
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Profile Cache Service
 * Handles local caching of profile data for offline support
 */
export class ProfileCacheService {
  /**
   * Save profile to cache
   */
  static async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.PROFILE, JSON.stringify(profile));
      await AsyncStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, Date.now().toString());
    } catch (error) {
      console.error('Error saving profile to cache:', error);
    }
  }

  /**
   * Get profile from cache
   */
  static async getProfile(): Promise<UserProfile | null> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEYS.PROFILE);
      if (!cached) return null;

      const timestamp = await AsyncStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
      if (timestamp) {
        const age = Date.now() - parseInt(timestamp, 10);
        if (age > CACHE_DURATION) {
          // Cache expired
          await this.clearProfile();
          return null;
        }
      }

      return JSON.parse(cached);
    } catch (error) {
      console.error('Error getting profile from cache:', error);
      return null;
    }
  }

  /**
   * Save emergency data to cache
   */
  static async saveEmergency(emergency: UserEmergency): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.EMERGENCY, JSON.stringify(emergency));
    } catch (error) {
      console.error('Error saving emergency to cache:', error);
    }
  }

  /**
   * Get emergency data from cache
   */
  static async getEmergency(): Promise<UserEmergency | null> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEYS.EMERGENCY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error getting emergency from cache:', error);
      return null;
    }
  }

  /**
   * Save notifications to cache
   */
  static async saveNotifications(notifications: UserNotifications): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications to cache:', error);
    }
  }

  /**
   * Get notifications from cache
   */
  static async getNotifications(): Promise<UserNotifications | null> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEYS.NOTIFICATIONS);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error getting notifications from cache:', error);
      return null;
    }
  }

  /**
   * Clear all profile cache
   */
  static async clearProfile(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        CACHE_KEYS.PROFILE,
        CACHE_KEYS.EMERGENCY,
        CACHE_KEYS.NOTIFICATIONS,
        CACHE_KEYS.CACHE_TIMESTAMP,
      ]);
    } catch (error) {
      console.error('Error clearing profile cache:', error);
    }
  }

  /**
   * Check if cache is valid (not expired)
   */
  static async isCacheValid(): Promise<boolean> {
    try {
      const timestamp = await AsyncStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
      if (!timestamp) return false;

      const age = Date.now() - parseInt(timestamp, 10);
      return age < CACHE_DURATION;
    } catch (error) {
      return false;
    }
  }
}


