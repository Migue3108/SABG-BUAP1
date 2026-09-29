"use client";

import { useEffect } from "react";

import { routes } from "@/config/routes";

const LAST_USER_KEY = "sabg-sw-user";
const WARMED_AT_KEY = "sabg-sw-warmed-at";
const WARM_INTERVAL_MS = 6 * 60 * 60 * 1000;

// Todas las páginas del panel municipal que deben quedar disponibles sin conexión
function municipalRoutes(): string[] {
    const chapters = [
        routes.chapter1,
        routes.chapter2,
        routes.chapter3,
        routes.chapter4,
        routes.chapter5,
        routes.chapter6,
        routes.chapter7,
        routes.chapter8,
    ].flatMap((chapter) => Object.values(chapter));

    return [
        routes.dashboard,
        routes.profile,
        routes.preferences,
        routes.help,
        routes.resources,
        routes.tracking,
        ...chapters,
    ];
}

function readStorage(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStorage(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {}
}

// Pide al service worker olvidar las páginas y APIs en caché (cierre de sesión)
export async function clearOfflineCache() {
    if (!("serviceWorker" in navigator)) return;

    const registration = await navigator.serviceWorker.getRegistration();
    registration?.active?.postMessage({ type: "CLEAR_USER_DATA" });

    try {
        localStorage.removeItem(LAST_USER_KEY);
        localStorage.removeItem(WARMED_AT_KEY);
    } catch {}
}

export function ServiceWorkerRegistrar({ userId }: { userId: string }) {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
            return;
        }

        let cancelled = false;

        async function register() {
            try {
                await navigator.serviceWorker.register("/sw.js", { scope: "/" });
                const registration = await navigator.serviceWorker.ready;

                if (cancelled || !registration.active) return;

                // Otro usuario usó este equipo: no mezclar sus páginas en caché
                if (readStorage(LAST_USER_KEY) !== userId) {
                    registration.active.postMessage({ type: "CLEAR_USER_DATA" });
                    writeStorage(LAST_USER_KEY, userId);
                    writeStorage(WARMED_AT_KEY, "0");
                }

                const warmedAt = Number(readStorage(WARMED_AT_KEY) ?? 0);

                if (navigator.onLine && Date.now() - warmedAt > WARM_INTERVAL_MS) {
                    registration.active.postMessage({
                        type: "WARM_CACHE",
                        urls: municipalRoutes(),
                    });
                    writeStorage(WARMED_AT_KEY, String(Date.now()));
                }
            } catch (error) {
                console.warn("No se pudo registrar el modo sin conexión:", error);
            }
        }

        register();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    return null;
}
