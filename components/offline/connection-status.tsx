"use client";

import { useState } from "react";
import {
    AlertTriangle,
    CloudCheck,
    CloudOff,
    Loader2,
    RefreshCw,
    Trash2,
} from "lucide-react";

import { useOptionalOfflineSync } from "@/lib/offline/sync-provider";

const KIND_LABELS: Record<string, string> = {
    progress: "Avance del flujo",
    diagnostic: "Diagnóstico",
    "chapter-1-assessment": "Autoevaluación del Capítulo 1",
};

// Indicador de conexión y sincronización para el header (solo panel municipal)
export function ConnectionStatus() {
    const sync = useOptionalOfflineSync();
    const [open, setOpen] = useState(false);

    if (!sync) return null;

    const { online, syncing, unauthorized, pendingCount, failedEntries } = sync;

    let tone = "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300";
    let icon = <CloudCheck className="h-4 w-4" />;
    let label = "Sincronizado";
    let detail = "Todo tu avance está guardado en el servidor.";

    if (!online) {
        tone = "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
        icon = <CloudOff className="h-4 w-4" />;
        label = pendingCount > 0 ? `Sin conexión · ${pendingCount}` : "Sin conexión";
        detail =
            pendingCount > 0
                ? `Tus cambios se guardan en este dispositivo. ${pendingCount} pendiente(s) se enviarán al reconectar.`
                : "Tus cambios se guardan en este dispositivo y se enviarán al reconectar.";
    } else if (unauthorized) {
        tone = "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300";
        icon = <AlertTriangle className="h-4 w-4" />;
        label = "Inicia sesión";
        detail = `Tu sesión expiró. Vuelve a iniciar sesión para enviar ${pendingCount} cambio(s) guardado(s) en este equipo.`;
    } else if (failedEntries.length > 0) {
        tone = "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300";
        icon = <AlertTriangle className="h-4 w-4" />;
        label = `${failedEntries.length} sin enviar`;
        detail = "El servidor rechazó algunos cambios guardados sin conexión.";
    } else if (pendingCount > 0) {
        tone = "border-primary/30 bg-primary-light text-primary";
        icon = syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />;
        label = syncing ? "Sincronizando…" : `${pendingCount} pendiente(s)`;
        detail = `${pendingCount} cambio(s) guardado(s) en este dispositivo esperan enviarse.`;
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((previous) => !previous)}
                aria-expanded={open}
                aria-label={detail}
                title={detail}
                className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition ${tone}`}
            >
                {icon}
                <span className="hidden sm:inline">{label}</span>
            </button>

            {open && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-80 rounded-2xl border border-border bg-surface p-4 text-left shadow-xl">
                    <p className="text-sm font-semibold text-text-primary">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-text-secondary">{detail}</p>

                    {failedEntries.length > 0 && (
                        <ul className="mt-3 space-y-2">
                            {failedEntries.map((entry) => (
                                <li
                                    key={entry.id}
                                    className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-2.5"
                                >
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-text-primary">
                                            {KIND_LABELS[entry.kind] ?? entry.kind}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-red-600 dark:text-red-400">
                                            {entry.error}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => sync.discard(entry.id)}
                                        aria-label="Descartar cambio"
                                        className="shrink-0 rounded-md p-1 text-text-secondary transition hover:text-red-600"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {unauthorized ? (
                        <a
                            href="/auth/login"
                            className="mt-3 inline-flex rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                        >
                            Iniciar sesión
                        </a>
                    ) : (
                        online && pendingCount > 0 && (
                            <button
                                type="button"
                                onClick={sync.syncNow}
                                disabled={syncing}
                                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                Sincronizar ahora
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
