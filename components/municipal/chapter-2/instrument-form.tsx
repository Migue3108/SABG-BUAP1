"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type { FormEvent } from "react";

import { useRouter } from "next/navigation";

import {
    ArrowRight,
    CheckCircle2,
    ClipboardList,
    FileText,
    Save,
} from "lucide-react";

import { municipalInstrumentMock } from "@/config/instrument";
import { useMunicipalProgress } from "@/contexts/municipal-progress-context";
import { MunicipalWorkflowProgress } from "@/components/dashboard/progress/municipal-workflow-progress";
import { clearDraft, loadDraft, useAutosaveDraft } from "@/lib/offline/drafts";
import { useOfflineSync } from "@/lib/offline/sync-provider";

// Clave anterior (global, sin usuario); se migra una vez al borrador por usuario
const LEGACY_STORAGE_KEY =
    "sabg-instrument-draft";

const DRAFT_KEY =
    "chapter-2-instrument";

type FormValues = Record<string, string>;

export function InstrumentForm() {
    const router = useRouter();

    const {
        isUnlocked,
        isCompleted,
        completeStep,
    } = useMunicipalProgress();

    const instrumentCompleted =
        isCompleted("instrument");

    const instrumentUnlocked =
        isUnlocked("instrument");

    const initialValues = useMemo(() => {
        return Object.fromEntries(
            municipalInstrumentMock.fields.map(
                (field) => [
                    field.id,
                    "",
                ]
            )
        );
    }, []);

    const [
        formData,
        setFormData,
    ] = useState<FormValues>(
        initialValues
    );

    const { userId } = useOfflineSync();

    const [
        draftLoaded,
        setDraftLoaded,
    ] = useState(false);

    const draftSavedAt = useAutosaveDraft(
        userId,
        DRAFT_KEY,
        formData,
        draftLoaded && !instrumentCompleted
    );

    /*
     * Recuperar borrador guardado en el dispositivo.
     */
    useEffect(() => {
        let cancelled = false;

        async function restoreDraft() {
            let stored =
                await loadDraft<FormValues>(
                    userId,
                    DRAFT_KEY
                );

            try {
                const legacy =
                    localStorage.getItem(
                        LEGACY_STORAGE_KEY
                    );

                if (!stored && legacy) {
                    stored = JSON.parse(legacy) as FormValues;
                }

                localStorage.removeItem(
                    LEGACY_STORAGE_KEY
                );
            } catch {}

            if (cancelled) {
                return;
            }

            if (stored) {
                setFormData((previous) => ({
                    ...previous,
                    ...stored,
                }));
            }

            setDraftLoaded(true);
        }

        restoreDraft();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    const isFormValid =
        municipalInstrumentMock.fields
            .filter(
                (field) =>
                    field.required
            )
            .every((field) => {
                return (
                    formData[
                        field.id
                    ]?.trim() !== ""
                );
            });

    function handleChange(
        fieldId: string,
        value: string
    ) {
        setFormData(
            (previous) => ({
                ...previous,
                [fieldId]: value,
            })
        );
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!isFormValid) {
            return;
        }

        completeStep("instrument");

        clearDraft(
            userId,
            DRAFT_KEY
        );

        router.push(
            "/capitulo-2/evidencias"
        );
    }

    return (
        <>
            <MunicipalWorkflowProgress />
            {!instrumentUnlocked ? (
                <InstrumentLocked />
            ) : instrumentCompleted ? (
                <InstrumentCompleted />
            ) : (
                <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                            {/* Formulario */}
                            <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                                <header className="border-b border-border p-6 md:p-8">
                                    <div className="flex items-center gap-2 text-primary">
                                        <ClipboardList className="h-5 w-5" />

                                        <p className="text-xs font-semibold uppercase tracking-wide">
                                            Instrumento asignado
                                        </p>
                                    </div>

                                    <p className="mt-4 text-sm font-semibold text-primary">
                                        Capítulo{" "}
                                        {
                                            municipalInstrumentMock.chapter
                                        }
                                        {" · "}
                                        Anexo{" "}
                                        {
                                            municipalInstrumentMock.annex
                                        }
                                    </p>

                                    <h1 className="mt-1 text-2xl font-bold text-text-primary md:text-3xl">
                                        {
                                            municipalInstrumentMock.title
                                        }
                                    </h1>

                                    <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">
                                        {
                                            municipalInstrumentMock.description
                                        }
                                    </p>
                                </header>

                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                    className="space-y-6 p-6 md:p-8"
                                >
                                    {municipalInstrumentMock.fields.map(
                                        (field) => (
                                            <InstrumentField
                                                key={field.id}
                                                field={field}
                                                value={
                                                    formData[
                                                    field.id
                                                    ] ?? ""
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            />
                                        )
                                    )}

                                    <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
                                        <p
                                            aria-live="polite"
                                            className="flex items-center justify-center gap-2 px-2 py-2.5 text-sm font-semibold text-text-secondary"
                                        >
                                            <Save className="h-4 w-4" />

                                            {draftSavedAt
                                                ? `Guardado automáticamente a las ${draftSavedAt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`
                                                : "Tu avance se guarda automáticamente"}
                                        </p>

                                        <button
                                            type="submit"
                                            disabled={
                                                !isFormValid
                                            }
                                            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Finalizar instrumento

                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </form>
                            </section>

                            {/* Contexto */}
                            <aside className="space-y-5">
                                <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                                            <FileText className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-text-primary">
                                                Instrumento
                                            </p>

                                            <p className="text-xs text-text-secondary">
                                                Etapa 3 de 4
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 space-y-4">
                                        <Information
                                            label="Capítulo relacionado"
                                            value={`Capítulo ${municipalInstrumentMock.chapter}`}
                                        />

                                        <Information
                                            label="Anexo"
                                            value={`Anexo ${municipalInstrumentMock.annex}`}
                                        />

                                        <Information
                                            label="Producto esperado"
                                            value={
                                                municipalInstrumentMock.expectedProduct
                                            }
                                        />
                                    </div>
                                </section>

                                <section className="rounded-2xl border border-primary/20 bg-primary-light p-5">
                                    <div className="flex gap-3">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                                        <div>
                                            <p className="text-sm font-semibold text-text-primary">
                                                Objetivo
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-text-secondary">
                                                {
                                                    municipalInstrumentMock.objective
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                                        Siguiente etapa
                                    </p>

                                    <p className="mt-2 font-semibold text-text-primary">
                                        Evidencias
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                                        Al finalizar este instrumento podrás documentar y adjuntar las evidencias correspondientes.
                                    </p>
                                </section>
                            </aside>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}

function InstrumentLocked() {
    const router = useRouter();

    return (
        <main className="flex-1 bg-background p-6 lg:p-8">
            <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
                <h1 className="text-2xl font-bold text-text-primary">
                    Instrumento no disponible
                </h1>

                <p className="mt-3 text-sm leading-6 text-text-secondary">
                    Primero debes completar y confirmar tu ruta recomendada.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/capitulo-2/ruta"
                        )
                    }
                    className="mt-6 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white"
                >
                    Ir a mi ruta
                </button>
            </section>
        </main>
    );
}

function InstrumentCompleted() {
    const router = useRouter();

    return (
        <main className="flex-1 bg-background p-6 lg:p-8">
            <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                    <CheckCircle2 className="h-7 w-7" />
                </div>

                <h1 className="mt-5 text-2xl font-bold text-text-primary">
                    Instrumento completado
                </h1>

                <p className="mt-3 text-sm leading-6 text-text-secondary">
                    El instrumento fue completado correctamente. Ahora puedes continuar con la integración de evidencias.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/capitulo-2/evidencias"
                        )
                    }
                    className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    Continuar con evidencias
                </button>
            </section>
        </main>
    );
}

function InstrumentField({
    field,
    value,
    onChange,
}: {
    field:
    typeof municipalInstrumentMock.fields[number];

    value: string;

    onChange: (
        id: string,
        value: string
    ) => void;
}) {
    return (
        <div>
            <label
                htmlFor={field.id}
                className="block text-sm font-semibold text-text-primary"
            >
                {field.label}

                {field.required && (
                    <span className="ml-1 text-primary">
                        *
                    </span>
                )}
            </label>

            {field.description && (
                <p className="mt-1 text-xs leading-5 text-text-secondary">
                    {field.description}
                </p>
            )}

            <div className="mt-2">
                {field.type ===
                    "textarea" && (
                        <textarea
                            id={field.id}
                            required={
                                field.required
                            }
                            rows={4}
                            value={value}
                            onChange={(event) =>
                                onChange(
                                    field.id,
                                    event.target.value
                                )
                            }
                            placeholder={
                                field.placeholder
                            }
                            className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    )}

                {field.type ===
                    "text" && (
                        <input
                            id={field.id}
                            required={
                                field.required
                            }
                            type="text"
                            value={value}
                            onChange={(event) =>
                                onChange(
                                    field.id,
                                    event.target.value
                                )
                            }
                            placeholder={
                                field.placeholder
                            }
                            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    )}

                {field.type ===
                    "select" && (
                        <select
                            id={field.id}
                            required={
                                field.required
                            }
                            value={value}
                            onChange={(event) =>
                                onChange(
                                    field.id,
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        >
                            <option value="">
                                Selecciona una opción
                            </option>

                            {field.options?.map(
                                (option) => (
                                    <option
                                        key={
                                            option.value
                                        }
                                        value={
                                            option.value
                                        }
                                    >
                                        {
                                            option.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    )}
            </div>
        </div>
    );
}

function Information({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-xs font-medium text-text-muted">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-text-primary">
                {value}
            </p>
        </div>
    );
}