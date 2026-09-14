"use client";

import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNavigation } from "@/config/navigation/admin-navigation";
import { routes } from "@/config/routes";

type AdminDashboardShellProps = {
    children: ReactNode;
    user: {
        name: string;
        role: string;
        initials?: string;
    };
};

export function AdminDashboardShell({
    children,
    user,
}: AdminDashboardShellProps) {
    return (
        <DashboardShell
            navigation={adminNavigation}
            homePath={routes.admin.home}
            profilePath={routes.admin.profile}
            helpPath="/admin/ayuda"
            user={user}
            organization={{
                name: "SABG-BUAP",
                area: "Administración del sistema",
            }}
        >
            {children}
        </DashboardShell>
    );
}
