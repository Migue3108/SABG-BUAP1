"use client";

import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useMunicipalNavigation } from "@/hooks/use-municipal-navigation";

type MunicipalDashboardShellProps = {
    children: ReactNode;

    user: {
        name: string;
        role: string;
        rawRole?: string;
        initials?: string;
        email?: string;
    };

    organization?: {
        name: string;
        area?: string;
        logo?: string;
    };
};

export function MunicipalDashboardShell({
    children,
    user,
    organization,
}: MunicipalDashboardShellProps) {
    const navigation = useMunicipalNavigation(user.rawRole);

    return (
        <DashboardShell
            navigation={navigation}
            homePath="/dashboard"
            profilePath="/perfil"
            user={user}
            organization={organization}
        >
            {children}
        </DashboardShell>
    );
}