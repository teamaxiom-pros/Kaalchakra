import { progressService, AuthoritativeCompletionPayload } from './progressService';
import { isSupabaseReady } from '../lib/supabase/client';

export interface QueuedSyncEvent {
  eventId: string;
  sessionId: string;
  playerId: string;
  experienceId: string;
  eventType: 'session_completed' | 'action_taken';
  schemaVersion: number;
  createdAt: string;
  payload: AuthoritativeCompletionPayload;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed' | 'synced';
}

const DB_NAME = 'kaalchakra_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'sync_queue';

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise(resolve => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'eventId' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export const offlineSyncService = {
  async queueSession(payload: AuthoritativeCompletionPayload, playerId: string): Promise<string> {
    const eventId = crypto.randomUUID();
    const event: QueuedSyncEvent = {
      eventId,
      sessionId: payload.sessionId,
      playerId,
      experienceId: payload.experienceId,
      eventType: 'session_completed',
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      payload,
      retryCount: 0,
      status: 'pending',
    };

    const db = await openDatabase();
    if (db) {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(event);
      } catch (err) {
        console.warn('Failed to save to IndexedDB:', err);
      }
    }

    return eventId;
  },

  async getPendingCount(): Promise<number> {
    const db = await openDatabase();
    if (!db) return 0;

    return new Promise(resolve => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).count();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(0);
      } catch {
        resolve(0);
      }
    });
  },

  async syncPendingQueue(): Promise<{ synced: number; failed: number }> {
    if (!isSupabaseReady() || !navigator.onLine) {
      return { synced: 0, failed: 0 };
    }

    const db = await openDatabase();
    if (!db) return { synced: 0, failed: 0 };

    return new Promise(resolve => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = async () => {
        const events: QueuedSyncEvent[] = req.result || [];
        let synced = 0;
        let failed = 0;

        for (const ev of events) {
          try {
            const res = await progressService.submitAuthoritativeCompletion(ev.payload);
            if (res.success) {
              // Delete synced event
              const delTx = db.transaction(STORE_NAME, 'readwrite');
              delTx.objectStore(STORE_NAME).delete(ev.eventId);
              synced++;
            } else {
              failed++;
            }
          } catch {
            failed++;
          }
        }

        resolve({ synced, failed });
      };

      req.onerror = () => resolve({ synced: 0, failed: 0 });
    });
  },
};
