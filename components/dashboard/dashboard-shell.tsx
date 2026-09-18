"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";

import type { NavigationConfig } from "@/types/navigation";

type DashboardShellProps = {
    children: ReactNode;

    navigation: NavigationConfig;

    homePath?: string;
    profilePath?: string;
    helpPath?: string;

    user: {
        name: string;
        role: string;
        initials?: string;
    };

    organization?: {
        name: string;
        area?: string;
        logo?: string;
    };
};

export function DashboardShell({
    children,
    navigation,
    homePath,
    profilePath,
    helpPath,
    user,
    organization,
}: DashboardShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    /*
     * Evita que el contenido de fondo haga scroll
     * mientras el menú móvil/tablet está abierto.
     */
    useEffect(() => {
        if (!sidebarOpen) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow =
                previousOverflow;
        };
    }, [sidebarOpen]);

    /*
     * Permite cerrar el drawer con Escape.
     */
    useEffect(() => {
        function handleKeyDown(
            event: KeyboardEvent
        ) {
            if (
                event.key === "Escape" &&
                sidebarOpen
            ) {
                setSidebarOpen(false);
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [sidebarOpen]);

    /*
     * Seguridad y prevención de BFCache:
     * Si el usuario cerró sesión y pulsa el botón "Atrás" en el navegador,
     * la página no debe restaurarse de la memoria caché y se redirige de inmediato a home.
     */
    useEffect(() => {
        function handlePageShow(event: PageTransitionEvent) {
            if (event.persisted) {
                window.location.replace("/");
            }
        }

        async function verifySession() {
            try {
                const res = await fetch("/api/auth/get-session", {
                    cache: "no-store",
                });
                if (!res.ok) {
                    window.location.replace("/");
                    return;
                }
                const data = await res.json();
                if (!data?.session) {
                    window.location.replace("/");
                }
            } catch {
                // No interrumpir si hay error de red local
            }
        }

        window.addEventListener("pageshow", handlePageShow);
        verifySession();

        return () => {
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, []);

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop */}
            <aside className="sticky top-0 hidden h-dvh shrink-0 self-start border-r border-border bg-surface lg:block">
                <DashboardSidebar
                    navigation={navigation}
                    organization={organization}
                    helpPath={helpPath}
                />
            </aside>

            {/* Overlay móvil / tablet */}
            <div
                aria-hidden={!sidebarOpen}
                onClick={() =>
                    setSidebarOpen(false)
                }
                className={[
                    "fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden",
                    sidebarOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0",
                ].join(" ")}
            />

            {/* Drawer móvil / tablet */}
            <aside
                aria-label="Navegación principal"
                aria-hidden={!sidebarOpen}
                className={[
                    "fixed inset-y-0 left-0 z-50 w-70 max-w-[85vw] border-r border-border bg-surface shadow-2xl transition-transform duration-300 ease-out lg:hidden",
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full",
                ].join(" ")}
            >
                <DashboardSidebar
                    navigation={navigation}
                    organization={organization}
                    helpPath={helpPath}
                    mobile
                    onClose={() =>
                        setSidebarOpen(false)
                    }
                    onNavigate={() =>
                        setSidebarOpen(false)
                    }
                />
            </aside>

            {/* Contenido */}
            <div className="flex min-w-0 flex-1 flex-col">
                <DashboardHeader
                    userName={user.name}
                    userRole={user.role}
                    userInitials={user.initials}
                    homePath={homePath}
                    profilePath={profilePath}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {children}
            </div>
        </div>
    );
}