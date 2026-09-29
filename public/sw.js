/*
 * Service worker de SABG-BUAP: permite abrir el panel municipal sin conexión.
 * - Páginas municipales y APIs de lectura: red primero, caché como respaldo.
 * - Recursos estáticos de Next (/_next/static): caché primero (son inmutables).
 * - Nunca se cachean autenticación, admin, coordinación ni peticiones que no sean GET.
 * Cambiar VERSION invalida todas las cachés anteriores.
 */

const VERSION = "v1";
const STATIC_CACHE = `sabg-static-${VERSION}`;
const PAGES_CACHE = `sabg-pages-${VERSION}`;
const API_CACHE = `sabg-api-${VERSION}`;
const RESOURCES_CACHE = `sabg-resources-${VERSION}`;
const CURRENT_CACHES = [STATIC_CACHE, PAGES_CACHE, API_CACHE, RESOURCES_CACHE];

const OFFLINE_URL = "/offline.html";

const MUNICIPAL_PAGE =
    /^\/(dashboard|capitulo-[1-8]|recursos|seguimiento|perfil|preferencias|ayuda)(\/|$)/;
const CACHEABLE_API =
    /^\/api\/(user\/(progress|preferences|activity)|municipal\/)/;
const STATIC_ASSET = /\.(png|jpe?g|svg|webp|ico|woff2?)$/i;
// Excluye comillas, espacios, "\" (payload RSC escapado) y "&" (entidades HTML)
const STATIC_CHUNK = /\/_next\/static\/[^"'\s)\\&]+/g;

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(STATIC_CACHE)
            .then((cache) => cache.addAll([OFFLINE_URL, "/logotipo.png"]))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key.startsWith("sabg-") && !CURRENT_CACHES.includes(key))
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) return;

    if (url.pathname.startsWith("/_next/static/")) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }

    if (request.mode === "navigate" && MUNICIPAL_PAGE.test(url.pathname)) {
        event.respondWith(networkFirstPage(request));
        return;
    }

    // Las peticiones RSC sin red fallan normalmente: Next.js hace entonces una
    // navegación completa y esta se sirve desde la caché de páginas.

    if (CACHEABLE_API.test(url.pathname)) {
        event.respondWith(networkFirst(request, API_CACHE));
        return;
    }

    if (url.pathname.startsWith("/resources/")) {
        event.respondWith(staleWhileRevalidate(request, RESOURCES_CACHE));
        return;
    }

    if (STATIC_ASSET.test(url.pathname) || url.pathname === "/manifest.webmanifest") {
        event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    }
});

// Los mensajes se procesan en orden para que un borrado no se cruce con una descarga
let messageQueue = Promise.resolve();

self.addEventListener("message", (event) => {
    const data = event.data || {};
    let task = null;

    if (data.type === "WARM_CACHE" && Array.isArray(data.urls)) {
        task = () => warmCache(data.urls);
    }

    if (data.type === "CLEAR_USER_DATA") {
        task = () => Promise.all([caches.delete(PAGES_CACHE), caches.delete(API_CACHE)]);
    }

    if (task) {
        messageQueue = messageQueue.then(task).catch(() => {});
        event.waitUntil(messageQueue);
    }
});

function isCacheable(response) {
    return response && response.ok && response.type === "basic" && !response.redirected;
}

async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request, { ignoreVary: true });
    if (cached) return cached;

    const response = await fetch(request);

    if (isCacheable(response)) {
        const cache = await caches.open(cacheName);
        await cache.put(request, response.clone());
    }

    return response;
}

async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);

    try {
        const response = await fetch(request);

        if (isCacheable(response)) {
            await cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        const cached = await cache.match(request, { ignoreVary: true });
        if (cached) return cached;
        throw error;
    }
}

async function networkFirstPage(request) {
    const cache = await caches.open(PAGES_CACHE);
    const key = pageKey(request.url);

    try {
        // Las navegaciones usan redirect "manual": un redirect a "/" (sesión
        // expirada) llega como opaqueredirect y no se guarda.
        const response = await fetch(request);

        if (isCacheable(response)) {
            await cache.put(key, response.clone());
        }

        return response;
    } catch {
        const cached = await cache.match(key, { ignoreVary: true });
        if (cached) return cached;

        const offline = await caches.match(OFFLINE_URL);
        return offline || Response.error();
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request, { ignoreVary: true });

    const network = fetch(request)
        .then((response) => {
            if (isCacheable(response)) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => cached);

    return cached || network;
}

// Las páginas se guardan por ruta, sin parámetros de búsqueda
function pageKey(rawUrl) {
    const url = new URL(rawUrl);
    return `${url.origin}${url.pathname}`;
}

// Descarga páginas municipales (y sus scripts) para tenerlas sin conexión
async function warmCache(urls) {
    const pages = await caches.open(PAGES_CACHE);
    const statics = await caches.open(STATIC_CACHE);

    for (const path of urls) {
        try {
            const response = await fetch(path, { credentials: "same-origin", cache: "no-store" });

            if (!isCacheable(response)) continue;

            const html = await response.clone().text();
            await pages.put(pageKey(new URL(path, self.location.origin).href), response);

            const chunks = new Set(html.match(STATIC_CHUNK) || []);

            for (const chunk of chunks) {
                if (await statics.match(chunk)) continue;

                const chunkResponse = await fetch(chunk).catch(() => null);

                if (isCacheable(chunkResponse)) {
                    await statics.put(chunk, chunkResponse);
                }
            }
        } catch {
            // Sin red o página no disponible: se intentará en la siguiente carga
        }
    }
}
