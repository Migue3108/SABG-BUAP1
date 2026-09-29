import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { CoordinatorDashboardShell } from "@/components/coordinator/coordinator-dashboard-shell";
import { getHomePathForRole } from "@/config/routes";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CoordinatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            name: true,
            role: true,
            active: true,
            mustChangePassword: true,
        },
    });

    if (!user || !user.active) {
        redirect("/");
    }

    if (user.mustChangePassword) {
        redirect("/auth/first-login");
    }

    if (user.role !== "coordinator") {
        redirect(getHomePathForRole(user.role));
    }

    const initials = user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();

    return (
        <CoordinatorDashboardShell
            user={{
                name: user.name,
                role: "Coordinación SABG–BUAP",
                initials,
            }}
        >
            {children}
        </CoordinatorDashboardShell>
    );
}
