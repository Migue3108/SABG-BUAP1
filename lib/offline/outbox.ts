// Cola de envíos pendientes: lo que el usuario hace sin conexión se guarda aquí
// y se reenvía al servidor en orden cuando vuelve el internet.

import { STORES, idbDelete, idbGet, idbGetAllByIndex, idbPut, isIndexedDbAvailable } from "./db";

export type OutboxEntry = {
    id: string;
    userId: string;
    kind: string;
    url: string;
    method: "POST";
    body: Record<string, unknown>;
    createdAt: number;
    attempts: number;
    status: "queued" | "failed";
    error?: string;
    // Entradas con la misma dedupeKey se fusionan (p. ej. el progreso del flujo)
    dedupeKey?: string;
    // Registro en el store "pending" que se borra al sincronizar
    pendingKey?: string;
};

export type FlushResult = "idle" | "ok" | "offline" | "unauthorized" | "failed";

export const outboxEvents = new EventTarget();

type OutboxEventType =
    | "change"
    | "synced"
    | "sync-requested"
    | "flush-start"
    | "flush-end";

function emit(type: OutboxEventType, detail?: OutboxEntry) {
    outboxEvents.dispatchEvent(new CustomEvent(type, { detail }));
}

// Pide al proveedor de sincronización que intente vaciar la cola ahora
export function requestSync() {
    emit("sync-requested");
}

function newId(): string {
    return `${Date.now().toString(36)}-${crypto.randomUUID()}`;
}

export async function listOutbox(userId: string): Promise<OutboxEntry[]> {
    if (!isIndexedDbAvailable()) return [];

    const entries = await idbGetAllByIndex<OutboxEntry>(STORES.outbox, "userId", userId);
    return entries.sort((a, b) => a.createdAt - b.createdAt);
}

export async function enqueue(
    entry: Pick<OutboxEntry, "userId" | "kind" | "url" | "body" | "dedupeKey" | "pendingKey">
): Promise<void> {
    if (!isIndexedDbAvailable()) return;

    if (entry.dedupeKey) {
        const existing = (await listOutbox(entry.userId)).find(
            (item) => item.dedupeKey === entry.dedupeKey && item.status === "queued"
        );

        if (existing) {
            await idbPut<OutboxEntry>(STORES.outbox, {
                ...existing,
                body: { ...existing.body, ...entry.body },
            });
            emit("change");
            return;
        }
    }

    await idbPut<OutboxEntry>(STORES.outbox, {
        ...entry,
        id: newId(),
        method: "POST",
        createdAt: Date.now(),
        attempts: 0,
        status: "queued",
    });
    emit("change");
}

export async function discardEntry(id: string): Promise<void> {
    const entry = await idbGet<OutboxEntry>(STORES.outbox, id);
    await idbDelete(STORES.outbox, id);

    if (entry?.pendingKey) {
        await idbDelete(STORES.pending, entry.pendingKey);
    }

    emit("change");
}

let flushing: Promise<FlushResult> | null = null;

// Envía las entradas del usuario en orden. Solo se procesa un vaciado a la vez.
export function flushOutbox(userId: string): Promise<FlushResult> {
    if (!flushing) {
        flushing = runFlush(userId).finally(() => {
            flushing = null;
            emit("flush-end");
        });
    }

    return flushing;
}

async function runFlush(userId: string): Promise<FlushResult> {
    const entries = (await listOutbox(userId)).filter((entry) => entry.status === "queued");

    if (entries.length === 0) return "idle";

    emit("flush-start");

    let result: FlushResult = "ok";

    for (const entry of entries) {
        let response: Response;

        try {
            response = await fetch(entry.url, {
                method: entry.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(entry.body),
                cache: "no-store",
            });
        } catch {
            // Sin red: se conserva la entrada y se reintenta después
            return "offline";
        }

        // 409: el servidor ya tiene ese registro (reenvío duplicado)
        if (response.ok || response.status === 409) {
            await idbDelete(STORES.outbox, entry.id);

            if (entry.pendingKey) {
                await idbDelete(STORES.pending, entry.pendingKey);
            }

            emit("synced", entry);
            continue;
        }

        if (response.status === 401) {
            emit("change");
            return "unauthorized";
        }

        if (response.status >= 500) {
            await idbPut<OutboxEntry>(STORES.outbox, {
                ...entry,
                attempts: entry.attempts + 1,
            });
            result = "failed";
            break;
        }

        const data = await response.json().catch(() => ({}));

        await idbPut<OutboxEntry>(STORES.outbox, {
            ...entry,
            attempts: entry.attempts + 1,
            status: "failed",
            error: typeof data.error === "string" ? data.error : `Error ${response.status}`,
        });
        result = "failed";
    }

    emit("change");
    return result;
}

// Respuestas enviadas sin conexión que aún no llegan al servidor
export function pendingKeyFor(userId: string, key: string): string {
    return `${userId}:${key}`;
}

export async function savePending<T>(userId: string, key: string, data: T): Promise<void> {
    if (!isIndexedDbAvailable()) return;
    await idbPut(STORES.pending, { key: pendingKeyFor(userId, key), data, savedAt: Date.now() });
}

export async function loadPending<T>(userId: string, key: string): Promise<T | null> {
    if (!isIndexedDbAvailable()) return null;
    const record = await idbGet<{ data: T }>(STORES.pending, pendingKeyFor(userId, key));
    return record?.data ?? null;
}

// Diferencia un error de red de una respuesta del servidor
export function isNetworkError(error: unknown): boolean {
    return error instanceof TypeError;
}
