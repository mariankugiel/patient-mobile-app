import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = '@offline_update_queue';

export interface QueuedUpdate {
  id: string;
  type: 'profile' | 'emergency' | 'notifications' | 'permissions';
  endpoint: string;
  method: 'PUT' | 'POST' | 'DELETE';
  data: any;
  timestamp: number;
  retries: number;
}

/**
 * Offline Queue Service
 * Handles queuing of updates when device is offline
 */
export class OfflineQueueService {
  /**
   * Add update to queue
   */
  static async queueUpdate(
    type: QueuedUpdate['type'],
    endpoint: string,
    method: QueuedUpdate['method'],
    data: any
  ): Promise<void> {
    try {
      const queue = await this.getQueue();
      const update: QueuedUpdate = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        endpoint,
        method,
        data,
        timestamp: Date.now(),
        retries: 0,
      };

      queue.push(update);
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error queueing update:', error);
    }
  }

  /**
   * Get all queued updates
   */
  static async getQueue(): Promise<QueuedUpdate[]> {
    try {
      const queueJson = await AsyncStorage.getItem(QUEUE_KEY);
      return queueJson ? JSON.parse(queueJson) : [];
    } catch (error) {
      console.error('Error getting queue:', error);
      return [];
    }
  }

  /**
   * Remove update from queue
   */
  static async removeUpdate(updateId: string): Promise<void> {
    try {
      const queue = await this.getQueue();
      const filtered = queue.filter((update) => update.id !== updateId);
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing update from queue:', error);
    }
  }

  /**
   * Clear entire queue
   */
  static async clearQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(QUEUE_KEY);
    } catch (error) {
      console.error('Error clearing queue:', error);
    }
  }

  /**
   * Get queue size
   */
  static async getQueueSize(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  }

  /**
   * Increment retry count for an update
   */
  static async incrementRetry(updateId: string): Promise<void> {
    try {
      const queue = await this.getQueue();
      const update = queue.find((u) => u.id === updateId);
      if (update) {
        update.retries += 1;
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      }
    } catch (error) {
      console.error('Error incrementing retry:', error);
    }
  }

  /**
   * Remove updates that have exceeded max retries
   */
  static async removeFailedUpdates(maxRetries: number = 3): Promise<void> {
    try {
      const queue = await this.getQueue();
      const filtered = queue.filter((update) => update.retries < maxRetries);
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing failed updates:', error);
    }
  }
}


