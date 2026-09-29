"use client";

import { useEffect, useState } from "react";

import { STORES, idbDelete, idbGet, idbPut, isIndexedDbAvailable } from "./db";

type DraftRecord<T> = {
    key: string;
    data: T;
    updatedAt: number;
};

const AUTOSAVE_DELAY_MS = 500;

function draftKey(userId: string, formKey: string): string {
    return `${userId}:${formKey}`;
}

export async function loadDraft<T>(userId: string, formKey: string): Promise<T | null> {
    if (!isIndexedDbAvailable()) return null;

    try {
        const record = await idbGet<DraftRecord<T>>(STORES.drafts, draftKey(userId, formKey));
        return record?.data ?? null;
    } catch {
        return null;
    }
}

export async function saveDraft<T>(userId: string, formKey: string, data: T): Promise<void> {
    if (!isIndexedDbAvailable()) return;

    await idbPut<DraftRecord<T>>(STORES.drafts, {
        key: draftKey(userId, formKey),
        data,
        updatedAt: Date.now(),
    });
}

export async function clearDraft(userId: string, formKey: string): Promise<void> {
    if (!isIndexedDbAvailable()) return;
    await idbDelete(STORES.drafts, draftKey(userId, formKey)).catch(() => {});
}

// Guarda automáticamente `value` en el dispositivo (con debounce) mientras `enabled` sea true.
// Activar `enabled` solo después de restaurar el borrador previo para no sobrescribirlo.
// Devuelve la fecha del último guardado exitoso.
export function useAutosaveDraft<T>(
    userId: string | null,
    formKey: string | null,
    value: T,
    enabled: boolean
): Date | null {
    const [savedAt, setSavedAt] = useState<Date | null>(null);

    useEffect(() => {
        if (!enabled || !userId || !formKey) return;

        const timeout = window.setTimeout(() => {
            saveDraft(userId, formKey, value)
                .then(() => setSavedAt(new Date()))
                .catch((error) => console.warn("No se pudo guardar el borrador local:", error));
        }, AUTOSAVE_DELAY_MS);

        return () => window.clearTimeout(timeout);
    }, [userId, formKey, value, enabled]);

    return savedAt;
}
