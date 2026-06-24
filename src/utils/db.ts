import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'bloomverse';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase | null = null;

async function getDB() {
  if (dbInstance) return dbInstance;
  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('gameState')) {
        db.createObjectStore('gameState');
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
      if (!db.objectStoreNames.contains('archive')) {
        db.createObjectStore('archive');
      }
    },
  });
  return dbInstance;
}

export async function saveData(store: string, key: string, value: unknown) {
  const db = await getDB();
  await db.put(store, value, key);
}

export async function loadData<T>(store: string, key: string): Promise<T | undefined> {
  const db = await getDB();
  return db.get(store, key);
}

export async function deleteData(store: string, key: string) {
  const db = await getDB();
  await db.delete(store, key);
}

export async function clearStore(store: string) {
  const db = await getDB();
  await db.clear(store);
}

export async function exportAllData(): Promise<string> {
  const db = await getDB();
  const gameState: Record<string, unknown> = {};
  const settings: Record<string, unknown> = {};
  const archive: Record<string, unknown> = {};

  const tx1 = db.transaction('gameState', 'readonly');
  let cursor1 = await tx1.store.openCursor();
  while (cursor1) {
    gameState[cursor1.key as string] = cursor1.value;
    cursor1 = await cursor1.continue();
  }

  const tx2 = db.transaction('settings', 'readonly');
  let cursor2 = await tx2.store.openCursor();
  while (cursor2) {
    settings[cursor2.key as string] = cursor2.value;
    cursor2 = await cursor2.continue();
  }

  const tx3 = db.transaction('archive', 'readonly');
  let cursor3 = await tx3.store.openCursor();
  while (cursor3) {
    archive[cursor3.key as string] = cursor3.value;
    cursor3 = await cursor3.continue();
  }

  return JSON.stringify({ gameState, settings, archive, version: 1, exportDate: Date.now() });
}

export async function importAllData(json: string) {
  const data = JSON.parse(json);
  const db = await getDB();

  if (data.gameState) {
    const tx = db.transaction('gameState', 'readwrite');
    await tx.store.clear();
    for (const [key, value] of Object.entries(data.gameState)) {
      await tx.store.put(value, key);
    }
    await tx.done;
  }

  if (data.settings) {
    const tx = db.transaction('settings', 'readwrite');
    await tx.store.clear();
    for (const [key, value] of Object.entries(data.settings)) {
      await tx.store.put(value, key);
    }
    await tx.done;
  }

  if (data.archive) {
    const tx = db.transaction('archive', 'readwrite');
    await tx.store.clear();
    for (const [key, value] of Object.entries(data.archive)) {
      await tx.store.put(value, key);
    }
    await tx.done;
  }
}

export async function resetAllData() {
  const db = await getDB();
  await db.clear('gameState');
  await db.clear('settings');
  await db.clear('archive');
}
