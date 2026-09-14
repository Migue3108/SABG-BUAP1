"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
    BookOpen,
    Building2,
    ChartNoAxesColumnIncreasing,
    ChevronDown,
    ChevronRight,
    CircleHelp,
    FolderOpen,
    House,
    LockKeyhole,
    X,
    ClipboardList,
    Users,
} from "lucide-react";

import type {
    NavigationConfig,
    NavigationIcon,
    NavigationItem,
} from "@/types/navigation";

type DashboardSidebarProps = {
    navigation: NavigationConfig;

    organization?: {
        name: string;
        area?: string;
        logo?: string;
    };

    helpPath?: string;
    mobile?: boolean;
    onClose?: () => void;
    onNavigate?: () => void;
};

const navigationIcons = {
    home: House,
    chapter: BookOpen,
    tracking: ChartNoAxesColumnIncreasing,
    resources: FolderOpen,
    help: CircleHelp,
    users: Users,
    building: Building2,
    audit: ClipboardList,
} satisfies Record<
    NavigationIcon,
    React.ElementType
>;

export function DashboardSidebar({
    navigation,
    organization,
    helpPath = "/ayuda",
    mobile = false,
    onClose,
    onNavigate,
}: DashboardSidebarProps) {
    return (
        <div className="flex h-dvh w-70 flex-col bg-surface">
            {/* Organización */}
            <div className="relative shrink-0 px-8 pb-6 pt-8">
                {mobile && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar menú"
                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}

                {organization?.logo && (
                    <img
                        src={organization.logo}
                        alt=""
                        className="mb-4 h-12 w-12 object-contain"
                    />
                )}

                {organization?.name && (
                    <p className="pr-5 text-sm font-semibold leading-5 text-primary">
                        {organization.name}
                    </p>
                )}

                {organization?.area && (
                    <p className="mt-1 text-sm text-text-secondary">
                        {organization.area}
                    </p>
                )}
            </div>

            {/* Navegación */}
            <nav className="min-h-0 flex-1 overflow-y-auto px-4">
                <div className="space-y-2">
                    {navigation.items.map((item) => (
                        <SidebarItem
                            key={item.id}
                            item={item}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            </nav>

            {/* Centro de ayuda - siempre al fondo */}
            <div className="shrink-0 bg-surface px-4 pb-8 pt-4">
                <Link
                    href={helpPath}
                    onClick={onNavigate}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-primary"
                >
                    <CircleHelp className="h-5 w-5 shrink-0" />

                    <span>Centro de ayuda</span>
                </Link>
            </div>
        </div>
    );
}

function SidebarItem({
    item,
    onNavigate,
}: {
    item: NavigationItem;
    onNavigate?: () => void;
}) {
    const pathname = usePathname();

    const hasChildren = Boolean(
        item.children?.length
    );

    const childrenContainActivePath =
        item.children?.some(
            (child) =>
                pathname === child.path
        ) ?? false;

    const active =
        pathname === item.path ||
        childrenContainActivePath;

    const [expanded, setExpanded] =
        useState(
            childrenContainActivePath
        );

    const Icon =
        navigationIcons[item.icon];

    if (item.disabled) {
        return (
            <div className="flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-muted opacity-55">
                <Icon className="h-5 w-5 shrink-0" />

                <span className="flex-1">
                    {item.label}
                </span>

                <LockKeyhole className="h-4 w-4" />
            </div>
        );
    }

    if (hasChildren) {
        return (
            <div>
                <button
                    type="button"
                    onClick={() =>
                        setExpanded(
                            (previous) =>
                                !previous
                        )
                    }
                    className={[
                        "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                        active
                            ? "bg-primary text-white"
                            : "text-text-secondary hover:bg-background hover:text-primary",
                    ].join(" ")}
                >
                    <Icon className="h-5 w-5 shrink-0" />

                    <span className="flex-1">
                        {item.label}
                    </span>

                    {expanded ? (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                        <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                </button>

                {expanded && (
                    <div className="mt-1 space-y-1 pl-9">
                        {item.children?.map(
                            (child) => {
                                const childActive =
                                    pathname ===
                                    child.path;

                                if (
                                    child.disabled
                                ) {
                                    return (
                                        <div
                                            key={
                                                child.path
                                            }
                                            className="flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted opacity-55"
                                        >
                                            <LockKeyhole className="h-3.5 w-3.5 shrink-0" />

                                            <span>
                                                {
                                                    child.label
                                                }
                                            </span>
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={
                                            child.path
                                        }
                                        href={
                                            child.path
                                        }
                                        onClick={
                                            onNavigate
                                        }
                                        className={[
                                            "block rounded-lg px-3 py-2 text-sm transition-colors",
                                            childActive
                                                ? "bg-primary-light font-medium text-primary"
                                                : "text-text-secondary hover:bg-background hover:text-primary",
                                        ].join(
                                            " "
                                        )}
                                    >
                                        {
                                            child.label
                                        }
                                    </Link>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        );
    }
    if (!item.path) {
        return null;
    }

    return (
        <Link
            href={item.path}
            onClick={onNavigate}
            className={[
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:bg-background hover:text-primary",
            ].join(" ")}
        >
            <Icon className="h-5 w-5 shrink-0" />

            <span>
                {item.label}
            </span>
        </Link>
    );
}