import { headers } from "next/headers";
import { UserRound } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CoordinatorProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const user = session
        ? await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { name: true, email: true, institution: true, title: true },
        })
        : null;

    return (
        <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
            <div className="mx-auto max-w-3xl">
                <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
                    <div className="flex items-center gap-3 text-primary">
                        <UserRound className="h-6 w-6" />
                        <p className="text-sm font-semibold">Mi cuenta</p>
                    </div>
                    <h1 className="mt-2 text-2xl font-bold text-text-primary md:text-3xl">
                        Perfil
                    </h1>
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <ProfileField label="Nombre" value={user?.name ?? "-"} />
                        <ProfileField label="Correo electrónico" value={user?.email ?? "-"} />
                        <ProfileField label="Rol" value="Coordinación SABG–BUAP" />
                        <ProfileField label="Institución" value={user?.institution ?? "-"} />
                        <ProfileField label="Cargo" value={user?.title ?? "-"} />
                    </div>
                </section>
            </div>
        </main>
    );
}

function ProfileField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</p>
            <p className="mt-2 text-sm font-medium text-text-primary">{value}</p>
        </div>
    );
}
