import Link from "next/link";
import { ArrowRight, ClipboardCheck, FilePen, Send, Users } from "lucide-react";

import { FormStatusBadge } from "@/components/coordinator/forms/form-status-badge";
import { routes } from "@/config/routes";
import { listFormSummaries } from "@/lib/diagnostic-forms";

export const metadata = {
    title: "Coordinación · SABG-BUAP",
};

export default async function CoordinatorHomePage() {
    const forms = await listFormSummaries();

    const published = forms.find((form) => form.status === "publicado");
    const drafts = forms.filter((form) => form.status === "borrador").length;
    const totalSubmissions = forms.reduce(
        (total, form) => total + form.submissionCount,
        0
    );

    const metrics = [
        {
            label: "Formularios",
            value: forms.length,
            detail: "Diagnósticos creados para el Capítulo 2",
            icon: ClipboardCheck,
        },
        {
            label: "Borradores",
            value: drafts,
            detail: "Pendientes de publicar",
            icon: FilePen,
        },
        {
            label: "Publicado",
            value: published ? 1 : 0,
            detail: published ? published.title : "Ningún diagnóstico disponible",
            icon: Send,
        },
        {
            label: "Respuestas",
            value: totalSubmissions,
            detail: "Diagnósticos enviados por municipios",
            icon: Users,
        },
    ];

    return (
        <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
                    <p className="text-sm font-semibold text-primary">
                        Panel de Coordinación
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-text-primary md:text-3xl">
                        Resumen
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary md:text-base">
                        Diseña el diagnóstico municipal del Capítulo 2 y consulta las respuestas de los municipios.
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
                                <p className="mt-1 truncate text-xs leading-5 text-text-secondary">
                                    {metric.detail}
                                </p>
                            </article>
                        );
                    })}
                </section>

                <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-text-primary">
                                Diagnóstico vigente
                            </h2>
                            <p className="mt-1 text-sm text-text-secondary">
                                Es el formulario que ven los municipios en el Capítulo 2.
                            </p>
                        </div>
                        <Link
                            href={routes.coordinator.forms}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                        >
                            Ver diagnósticos
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {published ? (
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <FormStatusBadge status={published.status} />
                                    <p className="truncate text-sm font-semibold text-text-primary">
                                        {published.title}
                                    </p>
                                </div>
                                <p className="mt-1 text-xs text-text-secondary">
                                    {published.sectionCount} categorías · {published.questionCount} preguntas · {published.submissionCount} respuestas
                                </p>
                            </div>
                            <Link
                                href={routes.coordinator.responses(published.id)}
                                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition hover:bg-surface hover:text-primary"
                            >
                                Ver respuestas
                            </Link>
                        </div>
                    ) : (
                        <p className="mt-5 rounded-xl border border-dashed border-border p-4 text-sm text-text-secondary">
                            Aún no hay un diagnóstico publicado. Los municipios verán un aviso hasta que publiques uno.
                        </p>
                    )}
                </section>
            </div>
        </main>
    );
}
