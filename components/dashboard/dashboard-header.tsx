"use client";

import Link from "next/link";
import {
    Bell,
    LogOut,
    Menu,
    Settings,
    UserRound,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { useRouter, usePathname } from "next/navigation";

import { authClient } from "@/lib/auth-client";

type DashboardHeaderProps = {
    userName: string;
    userRole: string;
    userInitials?: string;
    userEmail?: string;
    homePath?: string;
    profilePath?: string;
    preferencesPath?: string;
    onMenuClick?: () => void;
};

export function DashboardHeader({
    userName,
    userRole,
    userInitials,
    userEmail,
    homePath = "/",
    profilePath = "/perfil",
    preferencesPath = "/preferencias",
    onMenuClick,
}: DashboardHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();

    const isAdmin = userRole.toLowerCase().includes("admin");
    const isInAdmin = pathname?.startsWith("/admin") ?? false;

    const [profileOpen, setProfileOpen] =
        useState(false);

    const [signingOut, setSigningOut] =
        useState(false);

    const menuRef =
        useRef<HTMLDivElement>(null);

    const initials =
        userInitials ??
        userName
            .split(" ")
            .slice(0, 2)
            .map((word) =>
                word.charAt(0)
            )
            .join("")
            .toUpperCase();

    useEffect(() => {
        function handleClickOutside(
            event: MouseEvent
        ) {
            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target as Node
                )
            ) {
                setProfileOpen(false);
            }
        }

        function handleKeyDown(
            event: KeyboardEvent
        ) {
            if (
                event.key === "Escape"
            ) {
                setProfileOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    async function handleSignOut() {
        if (signingOut) {
            return;
        }

        setSigningOut(true);

        try {
            await authClient.signOut();
            window.location.href = "/";
        } catch {
            window.location.href = "/";
        } finally {
            setSigningOut(false);
            setProfileOpen(false);
        }
    }

    return (
        <header className="flex h-16 shrink-0 items-center border-b border-border bg-surface px-4 md:h-20 md:px-6 lg:px-8">
            <button
                type="button"
                onClick={onMenuClick}
                aria-label="Abrir menú de navegación"
                className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background hover:text-primary lg:hidden"
            >
                <Menu className="h-5 w-5" />
            </button>

            <Link
                href={homePath}
                className="hidden text-2xl font-bold text-primary transition-opacity hover:opacity-80 lg:block"
            >
                SABG-BUAP
            </Link>

            <div className="ml-auto flex items-center gap-2 md:gap-4">
                <button
                    type="button"
                    aria-label="Notificaciones"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background hover:text-primary"
                >
                    <Bell className="h-5 w-5" />
                </button>

                <div className="hidden h-10 w-px bg-border md:block" />

                <div className="hidden text-right md:block">
                    <p className="text-sm font-semibold text-text-primary">
                        {userName}
                    </p>

                    <p className="mt-0.5 text-xs text-text-secondary">
                        {userRole}
                    </p>
                </div>

                <div
                    ref={menuRef}
                    className="relative"
                >
                    <button
                        type="button"
                        aria-label="Abrir menú de perfil"
                        aria-expanded={
                            profileOpen
                        }
                        onClick={() =>
                            setProfileOpen(
                                (previous) =>
                                    !previous
                            )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        {initials || (
                            <UserRound className="h-5 w-5" />
                        )}
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-72 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">

                            <div className="p-2 space-y-1">

                                <Link
                                    href={profilePath}
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-background hover:text-primary"
                                >
                                    <UserRound className="h-4 w-4" />
                                    Mi perfil
                                </Link>

                                <Link
                                    href={preferencesPath}
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-background hover:text-primary"
                                >
                                    <Settings className="h-4 w-4" />
                                    Preferencias
                                </Link>
                            </div>

                            <div className="border-t border-border p-2">
                                <button
                                    type="button"
                                    disabled={
                                        signingOut
                                    }
                                    onClick={
                                        handleSignOut
                                    }
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <LogOut className="h-4 w-4" />

                                    {signingOut
                                        ? "Cerrando sesión..."
                                        : "Cerrar sesión"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}