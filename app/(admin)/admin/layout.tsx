import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import { routes } from "@/config/routes";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/login");
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

    if (!user || !user.active || user.role !== "admin") {
        redirect(routes.dashboard);
    }

    if (user.mustChangePassword) {
        redirect("/auth/first-login");
    }

    const initials = user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();

    return (
        <AdminDashboardShell
            user={{
                name: user.name,
                role: "Administrador",
                initials,
            }}
        >
            {children}
        </AdminDashboardShell>
    );
}
