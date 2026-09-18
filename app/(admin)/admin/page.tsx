import Link from "next/link";
import {
    Activity,
    ArrowRight,
    Building2,
    ShieldCheck,
    Users,
} from "lucide-react";

import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
    const [totalUsers, activeUsers, inactiveUsers, usersByRole] =
        await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { active: true } }),
            prisma.user.count({ where: { active: false } }),
            prisma.user.groupBy({
                by: ["role"],
                _count: { _all: true },
            }),
        ]);

    const roleCounts = new Map(
        usersByRole.map((entry) => [entry.role, entry._count._all])
    );

    const metrics = [
        {
            label: "Usuarios registrados",
            value: totalUsers,
            detail: "Todas las cuentas del sistema",
            icon: Users,
        },
        {
            label: "Usuarios activos",
            value: activeUsers,
            detail: "Cuentas habilitadas para ingresar",
            icon: ShieldCheck,
        },
        {
            label: "Administradores",
            value: roleCounts.get("admin") ?? 0,
            detail: "Con acceso al panel administrativo",
            icon: Activity,
        },
        {
            label: "Cuentas inactivas",
            value: inactiveUsers,
            detail: "Requieren revisión administrativa",
            icon: Building2,
        },
    ];

    return (
        <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
                    <p className="text-sm font-semibold text-primary">
                        Panel de administrador
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-text-primary md:text-3xl">
                        Resumen del sistema
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary md:text-base">
                        Consulta el estado general de usuarios y accesos desde un solo lugar.
                    </p>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => {
                        const Icon = metric.icon;

                        return (
                            <article
                                key={metric.label}
                                className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <p className="text-3xl font-bold text-text-primary">
                                        {metric.value}
                                    </p>
                                </div>
                                <h2 className="mt-5 text-sm font-semibold text-text-primary">
                                    {metric.label}
                                </h2>
                                <p className="mt-1 text-xs leading-5 text-text-secondary">
                                    {metric.detail}
                                </p>
                            </article>
                        );
                    })}
                </section>

                <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-text-primary">
                                    Usuarios por rol
                                </h2>
                                <p className="mt-1 text-sm text-text-secondary">
                                    Distribución de las cuentas registradas.
                                </p>
                            </div>
                            <Link
                                href={routes.admin.users}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                            >
                                Ver usuarios
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="mt-6 space-y-4">
                            {[
                                ["Administradores", "admin"],
                                ["Coordinadores", "coordinator"],
                                ["Docentes", "teacher"],
                                ["Municipales", "municipal"],
                            ].map(([label, role]) => (
                                <div key={role}>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-text-secondary">{label}</span>
                                        <span className="font-semibold text-text-primary">
                                            {roleCounts.get(role as never) ?? 0}
                                        </span>
                                    </div>
                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                                        <div
                                            className="h-full rounded-full bg-primary"
                                            style={{
                                                width: `${totalUsers === 0 ? 0 : ((roleCounts.get(role as never) ?? 0) / totalUsers) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-primary/20 bg-primary-light p-6">
                        <div className="flex items-center gap-3 text-primary">
                            <ShieldCheck className="h-5 w-5" />
                            <h2 className="font-bold text-text-primary">
                                Próximas acciones
                            </h2>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-text-secondary">
                            Gestiona las cuentas, municipios y el registro de actividad administrativa.
                        </p>
                        <div className="mt-5 space-y-2">
                            <AdminLink href={routes.admin.users} label="Gestionar usuarios" />
                            <AdminLink href={routes.admin.municipalities} label="Gestionar municipios" />
                            <AdminLink href={routes.admin.audit} label="Consultar auditoría" />
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

function AdminLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between rounded-lg bg-surface px-4 py-3 text-sm font-semibold text-primary transition hover:bg-surface-soft"
        >
            {label}
            <ArrowRight className="h-4 w-4" />
        </Link>
    );
}
