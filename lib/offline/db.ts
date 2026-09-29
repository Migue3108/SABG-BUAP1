// Wrapper mínimo de IndexedDB para el modo sin conexión (solo cliente)

const DB_NAME = "sabg-offline";
const DB_VERSION = 1;

export const STORES = {
    outbox: "outbox",
    drafts: "drafts",
    pending: "pending",
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

let dbPromise: Promise<IDBDatabase> | null = null;

export function isIndexedDbAvailable(): boolean {
    return typeof window !== "undefined" && "indexedDB" in window;
}

function openDb(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(STORES.outbox)) {
                const outbox = db.createObjectStore(STORES.outbox, { keyPath: "id" });
                outbox.createIndex("userId", "userId");
            }

            if (!db.objectStoreNames.contains(STORES.drafts)) {
                db.createObjectStore(STORES.drafts, { keyPath: "key" });
            }

            if (!db.objectStoreNames.contains(STORES.pending)) {
                db.createObjectStore(STORES.pending, { keyPath: "key" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            dbPromise = null;
            reject(request.error);
        };
    });

    return dbPromise;
}

function wrap<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function withStore<T>(
    storeName: StoreName,
    mode: IDBTransactionMode,
    action: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
    const db = await openDb();
    const transaction = db.transaction(storeName, mode);
    return wrap(action(transaction.objectStore(storeName)));
}

export function idbGet<T>(storeName: StoreName, key: IDBValidKey): Promise<T | undefined> {
    return withStore(storeName, "readonly", (store) => store.get(key) as IDBRequest<T | undefined>);
}

export async function idbPut<T>(storeName: StoreName, value: T): Promise<void> {
    await withStore(storeName, "readwrite", (store) => store.put(value));
}

export async function idbDelete(storeName: StoreName, key: IDBValidKey): Promise<void> {
    await withStore(storeName, "readwrite", (store) => store.delete(key));
}

export function idbGetAllByIndex<T>(
    storeName: StoreName,
    indexName: string,
    value: IDBValidKey
): Promise<T[]> {
    return withStore(
        storeName,
        "readonly",
        (store) => store.index(indexName).getAll(value) as IDBRequest<T[]>
    );
}
