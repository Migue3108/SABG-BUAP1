"use client";

import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { coordinatorNavigation } from "@/config/navigation/coordinator-navigation";
import { routes } from "@/config/routes";

type CoordinatorDashboardShellProps = {
    children: ReactNode;
    user: {
        name: string;
        role: string;
        initials?: string;
    };
};

export function CoordinatorDashboardShell({
    children,
    user,
}: CoordinatorDashboardShellProps) {
    return (
        <DashboardShell
            navigation={coordinatorNavigation}
            homePath={routes.coordinator.home}
            profilePath={routes.coordinator.profile}
            preferencesPath={routes.coordinator.preferences}
            helpPath={routes.coordinator.help}
            user={user}
            organization={{
                name: "SABG–BUAP",
                area: "Coordinación",
            }}
        >
            {children}
        </DashboardShell>
    );
}
