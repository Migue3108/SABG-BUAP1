"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    BarChart3,
    Copy,
    Eye,
    Lock,
    Pencil,
    Plus,
    Save,
    Send,
    Trash2,
} from "lucide-react";

import { DiagnosticFormRenderer } from "@/components/diagnostic/diagnostic-form-renderer";
import { FormStatusBadge } from "@/components/coordinator/forms/form-status-badge";
import { likertScale } from "@/config/likert";
import { routes } from "@/config/routes";
import type {
    DiagnosticFormInput,
    DiagnosticFormTree,
} from "@/types/diagnostic-form";

type DraftQuestion = { key: string; text: string; helpText: string };
type DraftSection = {
    key: string;
    title: string;
    description: string;
    questions: DraftQuestion[];
};
type Draft = { title: string; description: string; sections: DraftSection[] };

function newKey() {
    return crypto.randomUUID();
}

function toDraft(form: DiagnosticFormTree): Draft {
    return {
        title: form.title,
        description: form.description ?? "",
        sections: form.sections.map((section) => ({
            key: section.id,
            title: section.title,
            description: section.description ?? "",
            questions: section.questions.map((question) => ({
                key: question.id,
                text: question.text,
                helpText: question.helpText ?? "",
            })),
        })),
    };
}

function toInput(draft: Draft): DiagnosticFormInput {
    return {
        title: draft.title,
        description: draft.description,
        sections: draft.sections.map((section) => ({
            title: section.title,
            description: section.description,
            questions: section.questions.map((question) => ({
                text: question.text,
                helpText: question.helpText,
            })),
        })),
    };
}

function moveItem<T>(items: T[], index: number, offset: number): T[] {
    const target = index + offset;
    if (target < 0 || target >= items.length) return items;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    return copy;
}

const inputClassName =
    "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

export function FormBuilder({ initialForm }: { initialForm: DiagnosticFormTree }) {
    const router = useRouter();

    const locked =
        initialForm.status !== "borrador" || initialForm.submissionCount > 0;

    const [draft, setDraft] = useState<Draft>(() => toDraft(initialForm));
    const [savedSnapshot, setSavedSnapshot] = useState(() =>
        JSON.stringify(toInput(toDraft(initialForm)))
    );
    const [view, setView] = useState<"edit" | "preview">(locked ? "preview" : "edit");
    const [busy, setBusy] = useState<"save" | "publish" | "duplicate" | null>(null);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

    const dirty = JSON.stringify(toInput(draft)) !== savedSnapshot;
    const questionCount = draft.sections.reduce(
        (total, section) => total + section.questions.length,
        0
    );

    // Aviso del navegador si hay cambios sin guardar
    useEffect(() => {
        if (!dirty) return;

        function handleBeforeUnload(event: BeforeUnloadEvent) {
            event.preventDefault();
        }

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [dirty]);

    const previewForm = useMemo(
        () => ({
            title: draft.title || "Sin título",
            description: draft.description || null,
            sections: draft.sections.map((section, sectionIndex) => ({
                id: section.key,
                title: section.title || "Categoría sin nombre",
                description: section.description || null,
                order: sectionIndex,
                questions: section.questions.map((question, questionIndex) => ({
                    id: question.key,
                    text: question.text || "Pregunta sin texto",
                    helpText: question.helpText || null,
                    type: "likert" as const,
                    order: questionIndex,
                })),
            })),
        }),
        [draft]
    );

    function updateSection(sectionKey: string, patch: Partial<DraftSection>) {
        setDraft((previous) => ({
            ...previous,
            sections: previous.sections.map((section) =>
                section.key === sectionKey ? { ...section, ...patch } : section
            ),
        }));
    }

    function updateQuestion(
        sectionKey: string,
        questionKey: string,
        patch: Partial<DraftQuestion>
    ) {
        setDraft((previous) => ({
            ...previous,
            sections: previous.sections.map((section) =>
                section.key === sectionKey
                    ? {
                        ...section,
                        questions: section.questions.map((question) =>
                            question.key === questionKey ? { ...question, ...patch } : question
                        ),
                    }
                    : section
            ),
        }));
    }

    function addSection() {
        setDraft((previous) => ({
            ...previous,
            sections: [
                ...previous.sections,
                {
                    key: newKey(),
                    title: `Categoría ${previous.sections.length + 1}`,
                    description: "",
                    questions: [{ key: newKey(), text: "", helpText: "" }],
                },
            ],
        }));
    }

    function removeSection(sectionKey: string) {
        const section = draft.sections.find((item) => item.key === sectionKey);
        if (
            section &&
            section.questions.length > 0 &&
            !window.confirm(`¿Eliminar la categoría "${section.title}" y sus ${section.questions.length} pregunta(s)?`)
        ) {
            return;
        }

        setDraft((previous) => ({
            ...previous,
            sections: previous.sections.filter((item) => item.key !== sectionKey),
        }));
    }

    function moveSection(index: number, offset: number) {
        setDraft((previous) => ({
            ...previous,
            sections: moveItem(previous.sections, index, offset),
        }));
    }

    function addQuestion(sectionKey: string) {
        const section = draft.sections.find((item) => item.key === sectionKey);
        if (!section) return;
        updateSection(sectionKey, {
            questions: [...section.questions, { key: newKey(), text: "", helpText: "" }],
        });
    }

    function removeQuestion(sectionKey: string, questionKey: string) {
        const section = draft.sections.find((item) => item.key === sectionKey);
        if (!section) return;
        updateSection(sectionKey, {
            questions: section.questions.filter((question) => question.key !== questionKey),
        });
    }

    function moveQuestion(sectionKey: string, index: number, offset: number) {
        const section = draft.sections.find((item) => item.key === sectionKey);
        if (!section) return;
        updateSection(sectionKey, {
            questions: moveItem(section.questions, index, offset),
        });
    }

    async function save(): Promise<boolean> {
        const response = await fetch(`/api/coordinator/forms/${initialForm.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toInput(draft)),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            setMessage({ type: "error", text: data.error || "No se pudo guardar" });
            return false;
        }

        const saved = toDraft(data.form as DiagnosticFormTree);
        setDraft(saved);
        setSavedSnapshot(JSON.stringify(toInput(saved)));
        return true;
    }

    async function handleSave() {
        setBusy("save");
        setMessage(null);

        try {
            if (await save()) {
                setMessage({ type: "success", text: "Cambios guardados" });
            }
        } catch {
            setMessage({ type: "error", text: "Error de conexión. Intenta de nuevo." });
        } finally {
            setBusy(null);
        }
    }

    async function handlePublish() {
        const confirmed = window.confirm(
            "¿Publicar este diagnóstico?\n\nLos municipios lo verán en el Capítulo 2. Si hay otro diagnóstico publicado, se archivará. Después de publicar ya no podrás editarlo."
        );
        if (!confirmed) return;

        setBusy("publish");
        setMessage(null);

        try {
            if (dirty && !(await save())) return;

            const response = await fetch(
                `/api/coordinator/forms/${initialForm.id}/publish`,
                { method: "POST" }
            );
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setMessage({ type: "error", text: data.error || "No se pudo publicar" });
                return;
            }

            router.refresh();
        } catch {
            setMessage({ type: "error", text: "Error de conexión. Intenta de nuevo." });
        } finally {
            setBusy(null);
        }
    }

    async function handleDuplicate() {
        setBusy("duplicate");
        setMessage(null);

        try {
            const response = await fetch(
                `/api/coordinator/forms/${initialForm.id}/duplicate`,
                { method: "POST" }
            );
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setMessage({ type: "error", text: data.error || "No se pudo duplicar" });
                return;
            }

            router.push(routes.coordinator.form(data.id));
        } catch {
            setMessage({ type: "error", text: "Error de conexión. Intenta de nuevo." });
        } finally {
            setBusy(null);
        }
    }

    return (
        <div className="space-y-6">
            <Link
                href={routes.coordinator.forms}
                className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"
            >
                <ArrowLeft className="h-4 w-4" />
                Volver a diagnósticos
            </Link>

            {/* Barra superior */}
            <section className="sticky top-0 z-20 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <FormStatusBadge status={initialForm.status} />
                    <p className="truncate text-sm font-semibold text-text-primary">
                        {draft.title || "Sin título"}
                    </p>
                    {!locked && (
                        <span className="shrink-0 text-xs text-text-muted">
                            {dirty ? "Cambios sin guardar" : "Guardado"}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="inline-flex rounded-lg border border-border p-0.5">
                        {!locked && (
                            <ViewTab
                                active={view === "edit"}
                                onClick={() => setView("edit")}
                                icon={Pencil}
                                label="Editar"
                            />
                        )}
                        <ViewTab
                            active={view === "preview"}
                            onClick={() => setView("preview")}
                            icon={Eye}
                            label="Vista previa"
                        />
                    </div>

                    {locked ? (
                        <>
                            {initialForm.status !== "borrador" && (
                                <Link
                                    href={routes.coordinator.responses(initialForm.id)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition hover:bg-background hover:text-primary"
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    Respuestas
                                </Link>
                            )}
                            <button
                                type="button"
                                onClick={handleDuplicate}
                                disabled={busy !== null}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Copy className="h-4 w-4" />
                                {busy === "duplicate" ? "Duplicando..." : "Duplicar para editar"}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={busy !== null || !dirty}
                                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition hover:bg-background hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                {busy === "save" ? "Guardando..." : "Guardar"}
                            </button>
                            <button
                                type="button"
                                onClick={handlePublish}
                                disabled={busy !== null || questionCount === 0}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" />
                                {busy === "publish" ? "Publicando..." : "Publicar"}
                            </button>
                        </>
                    )}
                </div>
            </section>

            {message && (
                <p
                    role={message.type === "error" ? "alert" : "status"}
                    className={
                        message.type === "error"
                            ? "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                            : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    }
                >
                    {message.text}
                </p>
            )}

            {locked && (
                <p className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {initialForm.status === "publicado"
                        ? "Este diagnóstico está publicado y no se puede editar. Duplícalo para preparar una nueva versión."
                        : initialForm.status === "archivado"
                            ? "Este diagnóstico está archivado. Duplícalo para reutilizar sus categorías y preguntas."
                            : "Este borrador ya tiene respuestas y no se puede editar. Duplícalo para crear una nueva versión."}
                </p>
            )}

            {view === "preview" ? (
                <DiagnosticFormRenderer form={previewForm} mode="preview" />
            ) : (
                <>
                    {/* Datos generales */}
                    <section className="space-y-4 rounded-2xl border border-t-4 border-border border-t-primary bg-surface p-6 shadow-sm">
                        <input
                            value={draft.title}
                            onChange={(event) =>
                                setDraft((previous) => ({ ...previous, title: event.target.value }))
                            }
                            maxLength={200}
                            placeholder="Título del diagnóstico"
                            aria-label="Título del diagnóstico"
                            className={`${inputClassName} text-xl font-bold`}
                        />
                        <textarea
                            value={draft.description}
                            onChange={(event) =>
                                setDraft((previous) => ({ ...previous, description: event.target.value }))
                            }
                            maxLength={2000}
                            rows={3}
                            placeholder="Descripción o instrucciones para el municipio (opcional)"
                            aria-label="Descripción del diagnóstico"
                            className={`${inputClassName} resize-y`}
                        />
                        <p className="text-xs text-text-muted">
                            Todas las preguntas usan la escala Likert de 5 puntos ({likertScale[0].label} a {likertScale[likertScale.length - 1].label}), son obligatorias y permiten un comentario opcional.
                        </p>
                    </section>

                    {draft.sections.map((section, sectionIndex) => (
                        <section
                            key={section.key}
                            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
                        >
                            <header className="space-y-3 border-b border-border bg-primary-light/60 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                        Categoría {sectionIndex + 1} de {draft.sections.length}
                                    </p>
                                    <div className="flex gap-1">
                                        <IconButton
                                            icon={ArrowUp}
                                            label="Subir categoría"
                                            disabled={sectionIndex === 0}
                                            onClick={() => moveSection(sectionIndex, -1)}
                                        />
                                        <IconButton
                                            icon={ArrowDown}
                                            label="Bajar categoría"
                                            disabled={sectionIndex === draft.sections.length - 1}
                                            onClick={() => moveSection(sectionIndex, 1)}
                                        />
                                        <IconButton
                                            icon={Trash2}
                                            label="Eliminar categoría"
                                            danger
                                            onClick={() => removeSection(section.key)}
                                        />
                                    </div>
                                </div>
                                <input
                                    value={section.title}
                                    onChange={(event) =>
                                        updateSection(section.key, { title: event.target.value })
                                    }
                                    maxLength={200}
                                    placeholder="Nombre de la categoría"
                                    aria-label={`Nombre de la categoría ${sectionIndex + 1}`}
                                    className={`${inputClassName} font-semibold`}
                                />
                                <textarea
                                    value={section.description}
                                    onChange={(event) =>
                                        updateSection(section.key, { description: event.target.value })
                                    }
                                    maxLength={2000}
                                    rows={2}
                                    placeholder="Descripción de la categoría (opcional)"
                                    aria-label={`Descripción de la categoría ${sectionIndex + 1}`}
                                    className={`${inputClassName} resize-y`}
                                />
                            </header>

                            <div className="divide-y divide-border">
                                {section.questions.length === 0 && (
                                    <p className="px-5 py-6 text-center text-sm text-text-secondary">
                                        Esta categoría no tiene preguntas. Agrega al menos una para poder publicar.
                                    </p>
                                )}

                                {section.questions.map((question, questionIndex) => (
                                    <div key={question.key} className="space-y-3 p-5">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-2.5 w-6 shrink-0 text-sm font-bold text-text-muted">
                                                {questionIndex + 1}.
                                            </span>
                                            <div className="min-w-0 flex-1 space-y-2">
                                                <textarea
                                                    value={question.text}
                                                    onChange={(event) =>
                                                        updateQuestion(section.key, question.key, {
                                                            text: event.target.value,
                                                        })
                                                    }
                                                    maxLength={1000}
                                                    rows={2}
                                                    placeholder="Escribe la pregunta o afirmación"
                                                    aria-label={`Pregunta ${questionIndex + 1}`}
                                                    className={`${inputClassName} resize-y`}
                                                />
                                                <input
                                                    value={question.helpText}
                                                    onChange={(event) =>
                                                        updateQuestion(section.key, question.key, {
                                                            helpText: event.target.value,
                                                        })
                                                    }
                                                    maxLength={1000}
                                                    placeholder="Texto de ayuda (opcional)"
                                                    aria-label={`Ayuda de la pregunta ${questionIndex + 1}`}
                                                    className={`${inputClassName} text-xs`}
                                                />
                                            </div>
                                            <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                                                <IconButton
                                                    icon={ArrowUp}
                                                    label="Subir pregunta"
                                                    disabled={questionIndex === 0}
                                                    onClick={() => moveQuestion(section.key, questionIndex, -1)}
                                                />
                                                <IconButton
                                                    icon={ArrowDown}
                                                    label="Bajar pregunta"
                                                    disabled={questionIndex === section.questions.length - 1}
                                                    onClick={() => moveQuestion(section.key, questionIndex, 1)}
                                                />
                                                <IconButton
                                                    icon={Trash2}
                                                    label="Eliminar pregunta"
                                                    danger
                                                    onClick={() => removeQuestion(section.key, question.key)}
                                                />
                                            </div>
                                        </div>

                                        <div className="ml-9 grid gap-1.5 sm:grid-cols-5" aria-hidden="true">
                                            {likertScale.map((option) => (
                                                <div
                                                    key={option.value}
                                                    className="rounded-lg border border-dashed border-border px-2 py-1.5 text-center text-[11px] text-text-muted"
                                                >
                                                    <span className="font-bold">{option.value}</span> · {option.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border p-4">
                                <button
                                    type="button"
                                    onClick={() => addQuestion(section.key)}
                                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary-light"
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar pregunta
                                </button>
                            </div>
                        </section>
                    ))}

                    <button
                        type="button"
                        onClick={addSection}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-surface p-5 text-sm font-semibold text-text-secondary transition hover:border-primary/50 hover:text-primary"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar categoría
                    </button>
                </>
            )}
        </div>
    );
}

type IconComponent = React.ComponentType<{ className?: string }>;

function ViewTab({
    active,
    onClick,
    icon: Icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: IconComponent;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={[
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition",
                active
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:text-primary",
            ].join(" ")}
        >
            <Icon className="h-3.5 w-3.5" />
            {label}
        </button>
    );
}

function IconButton({
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
            aria-label={label}
            title={label}
            className={[
                "flex h-8 w-8 items-center justify-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-30",
                danger
                    ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                    : "text-text-secondary hover:bg-background hover:text-primary",
            ].join(" ")}
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}
