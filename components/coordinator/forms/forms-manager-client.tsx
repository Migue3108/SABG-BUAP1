"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Archive,
    BarChart3,
    ClipboardCheck,
    Copy,
    Pencil,
    Plus,
    Send,
    Trash2,
} from "lucide-react";

import { FormStatusBadge } from "@/components/coordinator/forms/form-status-badge";
import { routes } from "@/config/routes";
import type { DiagnosticFormSummary } from "@/types/diagnostic-form";

type FormsManagerClientProps = {
    initialForms: DiagnosticFormSummary[];
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
});

export function FormsManagerClient({ initialForms }: FormsManagerClientProps) {
    const router = useRouter();
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function request(
        url: string,
        method: "POST" | "DELETE",
        busyKey: string
    ): Promise<{ id?: string } | null> {
        setBusyId(busyKey);
        setError(null);

        try {
            const response = await fetch(url, { method });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setError(data.error || "No se pudo completar la acción");
                return null;
            }

            return data;
        } catch {
            setError("Error de conexión. Intenta de nuevo.");
            return null;
        } finally {
            setBusyId(null);
        }
    }

    async function handleCreate() {
        const data = await request("/api/coordinator/forms", "POST", "new");
        if (data?.id) router.push(routes.coordinator.form(data.id));
    }

    async function handleDuplicate(form: DiagnosticFormSummary) {
        const data = await request(
            `/api/coordinator/forms/${form.id}/duplicate`,
            "POST",
            form.id
        );
        if (data?.id) router.push(routes.coordinator.form(data.id));
    }

    async function handlePublish(form: DiagnosticFormSummary) {
        const confirmed = window.confirm(
            `¿Publicar "${form.title}"?\n\nLos municipios lo verán en el Capítulo 2. Si hay otro diagnóstico publicado, se archivará. Después de publicar ya no podrás editarlo.`
        );
        if (!confirmed) return;

        if (await request(`/api/coordinator/forms/${form.id}/publish`, "POST", form.id)) {
            router.refresh();
        }
    }

    async function handleArchive(form: DiagnosticFormSummary) {
        const confirmed = window.confirm(
            `¿Archivar "${form.title}"?\n\nDejará de estar disponible para los municipios. Las respuestas se conservan.`
        );
        if (!confirmed) return;

        if (await request(`/api/coordinator/forms/${form.id}/archive`, "POST", form.id)) {
            router.refresh();
        }
    }

    async function handleDelete(form: DiagnosticFormSummary) {
        const confirmed = window.confirm(
            `¿Eliminar el borrador "${form.title}"? Esta acción no se puede deshacer.`
        );
        if (!confirmed) return;

        if (await request(`/api/coordinator/forms/${form.id}`, "DELETE", form.id)) {
            router.refresh();
        }
    }

    return (
        <div className="space-y-6">
            <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
                <div>
                    <p className="text-sm font-semibold text-primary">
                        Capítulo 2 · Diagnóstico municipal
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-text-primary md:text-3xl">
                        Diagnósticos
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                        Crea formularios por categorías con preguntas en escala Likert. Solo un diagnóstico puede estar publicado a la vez.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    disabled={busyId !== null}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" />
                    {busyId === "new" ? "Creando..." : "Nuevo diagnóstico"}
                </button>
            </section>

            {error && (
                <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                    {error}
                </p>
            )}

            {initialForms.length === 0 ? (
                <section className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
                        <ClipboardCheck className="h-6 w-6" />
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-text-primary">
                        Aún no hay diagnósticos
                    </h2>
                    <p className="mt-2 text-sm text-text-secondary">
                        Crea el primero con el botón “Nuevo diagnóstico”.
                    </p>
                </section>
            ) : (
                <ul className="space-y-4">
                    {initialForms.map((form) => {
                        const editable =
                            form.status === "borrador" && form.submissionCount === 0;
                        const busy = busyId === form.id;

                        return (
                            <li
                                key={form.id}
                                className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <FormStatusBadge status={form.status} />
                                            <Link
                                                href={routes.coordinator.form(form.id)}
                                                className="truncate text-base font-semibold text-text-primary hover:text-primary"
                                            >
                                                {form.title}
                                            </Link>
                                        </div>
                                        <p className="mt-1.5 text-xs text-text-secondary">
                                            {form.sectionCount} categorías · {form.questionCount} preguntas · {form.submissionCount} respuestas · Actualizado {dateFormatter.format(new Date(form.updatedAt))}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <ActionLink
                                            href={routes.coordinator.form(form.id)}
                                            icon={Pencil}
                                            label={editable ? "Editar" : "Ver"}
                                        />
                                        {form.status !== "borrador" && (
                                            <ActionLink
                                                href={routes.coordinator.responses(form.id)}
                                                icon={BarChart3}
                                                label="Respuestas"
                                            />
                                        )}
                                        <ActionButton
                                            icon={Copy}
                                            label="Duplicar"
                                            disabled={busy}
                                            onClick={() => handleDuplicate(form)}
                                        />
                                        {form.status === "borrador" && (
                                            <ActionButton
                                                icon={Send}
                                                label="Publicar"
                                                disabled={busy || form.questionCount === 0}
                                                onClick={() => handlePublish(form)}
                                            />
                                        )}
                                        {form.status === "publicado" && (
                                            <ActionButton
                                                icon={Archive}
                                                label="Archivar"
                                                disabled={busy}
                                                onClick={() => handleArchive(form)}
                                            />
                                        )}
                                        {editable && (
                                            <ActionButton
                                                icon={Trash2}
                                                label="Eliminar"
                                                danger
                                                disabled={busy}
                                                onClick={() => handleDelete(form)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

type IconComponent = React.ComponentType<{ className?: string }>;

const actionClassName =
    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";

function ActionLink({
    href,
    icon: Icon,
    label,
}: {
    href: string;
    icon: IconComponent;
    label: string;
}) {
    return (
        <Link
            href={href}
            className={`${actionClassName} border-border text-text-secondary hover:bg-background hover:text-primary`}
        >
            <Icon className="h-3.5 w-3.5" />
            {label}
        </Link>
    );
}

function ActionButton({
    icon: Icon,
    label,
    onClick,
    disabled,
    danger,
}: {
    icon: IconComponent;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    danger?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`${actionClassName} ${
                danger
                    ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                    : "border-border text-text-secondary hover:bg-background hover:text-primary"
            }`}
        >
            <Icon className="h-3.5 w-3.5" />
            {label}
        </button>
    );
}
