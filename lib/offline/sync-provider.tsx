"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { ReactNode } from "react";

import {
    discardEntry,
    flushOutbox,
    listOutbox,
    outboxEvents,
} from "./outbox";
import type { OutboxEntry } from "./outbox";

const RETRY_INTERVAL_MS = 30_000;

type OfflineSyncContextValue = {
    userId: string;
    online: boolean;
    syncing: boolean;
    unauthorized: boolean;
    pendingCount: number;
    failedEntries: OutboxEntry[];
    lastSyncedAt: Date | null;
    syncNow: () => void;
    discard: (id: string) => Promise<void>;
};

const OfflineSyncContext = createContext<OfflineSyncContextValue | null>(null);

export function OfflineSyncProvider({
    userId,
    children,
}: {
    userId: string;
    children: ReactNode;
}) {
    const [online, setOnline] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);
    const [entries, setEntries] = useState<OutboxEntry[]>([]);
    const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

    const refreshEntries = useCallback(async () => {
        try {
            setEntries(await listOutbox(userId));
        } catch {
            // IndexedDB no disponible (modo privado, etc.)
        }
    }, [userId]);

    const syncNow = useCallback(async () => {
        const result = await flushOutbox(userId).catch(() => "failed" as const);

        // "idle" no toca la red, así que solo se confía en el navegador
        if (result === "idle") {
            setOnline(navigator.onLine);
        } else {
            setOnline(result !== "offline");
        }

        setUnauthorized(result === "unauthorized");

        if (result === "ok") {
            setLastSyncedAt(new Date());
        }

        await refreshEntries();
    }, [userId, refreshEntries]);

    const pendingCount = entries.filter((entry) => entry.status === "queued").length;

    useEffect(() => {
        function handleOnline() {
            setOnline(true);
            syncNow();
        }

        function handleOffline() {
            setOnline(false);
        }

        function handleVisibility() {
            if (document.visibilityState === "visible") {
                syncNow();
            }
        }

        function handleChange() {
            refreshEntries();
        }

        function handleSyncRequested() {
            syncNow();
        }

        function handleFlushStart() {
            setSyncing(true);
        }

        function handleFlushEnd() {
            setSyncing(false);
        }

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        document.addEventListener("visibilitychange", handleVisibility);
        outboxEvents.addEventListener("change", handleChange);
        outboxEvents.addEventListener("sync-requested", handleSyncRequested);
        outboxEvents.addEventListener("flush-start", handleFlushStart);
        outboxEvents.addEventListener("flush-end", handleFlushEnd);

        // El primer vaciado también fija el estado inicial de conexión
        const initialSync = window.setTimeout(syncNow, 0);

        return () => {
            window.clearTimeout(initialSync);
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            document.removeEventListener("visibilitychange", handleVisibility);
            outboxEvents.removeEventListener("change", handleChange);
            outboxEvents.removeEventListener("sync-requested", handleSyncRequested);
            outboxEvents.removeEventListener("flush-start", handleFlushStart);
            outboxEvents.removeEventListener("flush-end", handleFlushEnd);
        };
    }, [syncNow, refreshEntries]);

    // Reintento periódico mientras haya cambios en cola
    useEffect(() => {
        if (pendingCount === 0) return;

        const interval = window.setInterval(syncNow, RETRY_INTERVAL_MS);
        return () => window.clearInterval(interval);
    }, [pendingCount, syncNow]);

    const discard = useCallback(async (id: string) => {
        await discardEntry(id);
        await refreshEntries();
    }, [refreshEntries]);

    const value = useMemo(
        () => ({
            userId,
            online,
            syncing,
            unauthorized,
            pendingCount,
            failedEntries: entries.filter((entry) => entry.status === "failed"),
            lastSyncedAt,
            syncNow: () => {
                syncNow();
            },
            discard,
        }),
        [userId, online, syncing, unauthorized, pendingCount, entries, lastSyncedAt, syncNow, discard]
    );

    return (
        <OfflineSyncContext.Provider value={value}>
            {children}
        </OfflineSyncContext.Provider>
    );
}

export function useOfflineSync(): OfflineSyncContextValue {
    const context = useContext(OfflineSyncContext);

    if (!context) {
        throw new Error("useOfflineSync debe utilizarse dentro de OfflineSyncProvider.");
    }

    return context;
}

// Para componentes compartidos (header) que también se usan fuera del panel municipal
export function useOptionalOfflineSync(): OfflineSyncContextValue | null {
    return useContext(OfflineSyncContext);
}
