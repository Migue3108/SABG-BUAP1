"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ClipboardX, CloudOff, Eye, FileText, Loader2, Lock } from "lucide-react";

import { useMunicipalProgress } from "@/contexts/municipal-progress-context";
import { MunicipalWorkflowProgress } from "@/components/dashboard/progress/municipal-workflow-progress";
import { DiagnosticFormRenderer } from "@/components/diagnostic/diagnostic-form-renderer";
import type { DiagnosticAnswerDraft } from "@/components/diagnostic/diagnostic-form-renderer";
import { LIKERT_MAX } from "@/config/likert";
import { routes } from "@/config/routes";
import { clearDraft, loadDraft, useAutosaveDraft } from "@/lib/offline/drafts";
import {
    enqueue,
    isNetworkError,
    loadPending,
    outboxEvents,
    pendingKeyFor,
    requestSync,
    savePending,
} from "@/lib/offline/outbox";
import type { OutboxEntry } from "@/lib/offline/outbox";
import { useOfflineSync } from "@/lib/offline/sync-provider";
import type {
    DiagnosticAnswerInput,
    DiagnosticFormTree,
    DiagnosticSubmissionView,
} from "@/types/diagnostic-form";

const DIAGNOSTIC_URL = "/api/municipal/chapter-2/diagnostic";

type DiagnosticState =
    | { status: "loading" }
    | { status: "error"; message: string }
    | {
        status: "ready";
        form: DiagnosticFormTree | null;
        submission: DiagnosticSubmissionView | null;
        // true si la respuesta se envió sin conexión y aún no llega al servidor
        pendingSync: boolean;
        draft: DiagnosticAnswerDraft[];
    };

function draftKeyFor(formId: string) {
    return `diagnostic:${formId}`;
}

export function DiagnosisForm() {
    const router = useRouter();
    const { userId } = useOfflineSync();

    const {
        isCompleted,
        completeStep,
    } = useMunicipalProgress();

    const [state, setState] = useState<DiagnosticState>({ status: "loading" });
    const [viewingAnswers, setViewingAnswers] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [draft, setDraft] = useState<DiagnosticAnswerDraft[]>([]);

    const formId = state.status === "ready" ? state.form?.id ?? null : null;
    const canEdit =
        state.status === "ready" && state.form !== null && state.submission === null;

    const draftSavedAt = useAutosaveDraft(
        userId,
        formId ? draftKeyFor(formId) : null,
        draft,
        canEdit
    );

    useEffect(() => {
        let cancelled = false;

        async function loadDiagnostic() {
            try {
                const response = await fetch(DIAGNOSTIC_URL, {
                    cache: "no-store",
                });
                const data = await response.json().catch(() => ({}));

                if (cancelled) return;

                if (!response.ok) {
                    setState({
                        status: "error",
                        message: data.error || "No se pudo cargar el diagnóstico",
                    });
                    return;
                }

                const form: DiagnosticFormTree | null = data.form;
                let submission: DiagnosticSubmissionView | null = data.submission;
                let pendingSync = false;
                let savedDraft: DiagnosticAnswerDraft[] = [];

                if (form && !submission) {
                    const pending = await loadPending<DiagnosticSubmissionView>(
                        userId,
                        draftKeyFor(form.id)
                    ).catch(() => null);

                    if (pending) {
                        submission = pending;
                        pendingSync = true;
                    } else {
                        savedDraft =
                            (await loadDraft<DiagnosticAnswerDraft[]>(
                                userId,
                                draftKeyFor(form.id)
                            )) ?? [];
                    }
                }

                if (cancelled) return;

                setDraft(savedDraft);
                setState({ status: "ready", form, submission, pendingSync, draft: savedDraft });
            } catch {
                if (!cancelled) {
                    setState({
                        status: "error",
                        message:
                            "Sin conexión y el diagnóstico aún no se ha guardado en este dispositivo. Ábrelo una vez con internet para poder responderlo sin conexión.",
                    });
                }
            }
        }

        loadDiagnostic();

        return () => {
            cancelled = true;
        };
    }, [userId, reloadKey]);

    // Cuando la respuesta enviada sin conexión llega al servidor, recargar
    useEffect(() => {
        function handleSynced(event: Event) {
            const entry = (event as CustomEvent<OutboxEntry>).detail;

            if (entry?.kind === "diagnostic") {
                setReloadKey((key) => key + 1);
            }
        }

        outboxEvents.addEventListener("synced", handleSynced);
        return () => outboxEvents.removeEventListener("synced", handleSynced);
    }, []);

    // Si ya existe una respuesta (en DB o pendiente), sincroniza el progreso local
    const alreadySubmitted =
        state.status === "ready" && state.submission !== null;

    useEffect(() => {
        if (alreadySubmitted && !isCompleted("diagnosis")) {
            completeStep("diagnosis");
        }
    }, [alreadySubmitted, isCompleted, completeStep]);

    // Sin conexión: guarda la respuesta en el dispositivo y la encola para enviarla después
    async function queueSubmission(
        form: DiagnosticFormTree,
        answers: DiagnosticAnswerInput[]
    ) {
        const key = draftKeyFor(form.id);

        const view: DiagnosticSubmissionView = {
            id: "pendiente",
            averageScore:
                answers.reduce((sum, answer) => sum + answer.value, 0) /
                Math.max(answers.length, 1),
            submittedAt: new Date().toISOString(),
            answers: answers.map((answer) => ({
                questionId: answer.questionId,
                value: answer.value,
                comment: answer.comment ?? null,
            })),
        };

        await savePending(userId, key, view);
        await enqueue({
            userId,
            kind: "diagnostic",
            url: DIAGNOSTIC_URL,
            body: { formId: form.id, answers },
            pendingKey: pendingKeyFor(userId, key),
        });
        requestSync();
    }

    async function handleSubmit(
        answers: DiagnosticAnswerInput[]
    ): Promise<string | null> {
        if (state.status !== "ready" || !state.form) {
            return "El diagnóstico no está disponible";
        }

        const form = state.form;

        try {
            const response = await fetch(DIAGNOSTIC_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formId: form.id, answers }),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return data.error || "No se pudo enviar el diagnóstico";
            }
        } catch (error) {
            if (!isNetworkError(error)) {
                return "No se pudo enviar el diagnóstico. Intenta de nuevo.";
            }

            try {
                await queueSubmission(form, answers);
            } catch {
                return "Sin conexión y no se pudo guardar en este dispositivo. Intenta de nuevo.";
            }
        }

        await clearDraft(userId, draftKeyFor(form.id));
        completeStep("diagnosis");
        router.push(routes.chapter2.route);
        return null;
    }

    if (state.status === "loading") {
        return (
            <>
                <MunicipalWorkflowProgress />
                <section className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-10 text-sm text-text-secondary shadow-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    Cargando diagnóstico...
                </section>
            </>
        );
    }

    if (state.status === "error") {
        return (
            <>
                <MunicipalWorkflowProgress />
                <DiagnosisNotice
                    title="No se pudo cargar el diagnóstico"
                    message={state.message}
                />
            </>
        );
    }

    if (state.form && state.submission && viewingAnswers) {
        return (
            <>
                <MunicipalWorkflowProgress />
                <DiagnosisAnswers
                    form={state.form}
                    submission={state.submission}
                    pendingSync={state.pendingSync}
                    onBack={() => setViewingAnswers(false)}
                />
            </>
        );
    }

    if (state.submission || isCompleted("diagnosis")) {
        return (
            <>
                <MunicipalWorkflowProgress />
                <DiagnosisCompleted
                    pendingSync={state.pendingSync}
                    onViewAnswers={
                        state.form && state.submission
                            ? () => setViewingAnswers(true)
                            : undefined
                    }
                />
            </>
        );
    }

    if (!state.form) {
        return (
            <>
                <MunicipalWorkflowProgress />
                <DiagnosisNotice
                    title="El diagnóstico aún no está disponible"
                    message="Coordinación SABG–BUAP publicará el diagnóstico municipal en breve. Vuelve a consultar esta sección más tarde."
                />
            </>
        );
    }

    return (
        <>
            <MunicipalWorkflowProgress />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-w-0">
                    <DiagnosticFormRenderer
                        form={state.form}
                        mode="respond"
                        initialAnswers={state.draft}
                        onAnswersChange={setDraft}
                        onSubmit={handleSubmit}
                    />
                    {draftSavedAt && (
                        <p className="mt-3 text-right text-xs text-text-muted">
                            Avance guardado automáticamente en este dispositivo a las{" "}
                            {draftSavedAt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                    )}
                </div>

                <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
                    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                                <FileText className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-text-primary">
                                    Diagnóstico institucional
                                </p>

                                <p className="text-xs text-text-secondary">
                                    Etapa 1 de 4
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-text-secondary">
                            Identifica capacidades, cumplimiento institucional, riesgos y
                            áreas prioritarias para establecer una línea base del municipio.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-primary/20 bg-primary-light p-5">
                        <div className="flex gap-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                            <div>
                                <p className="text-sm font-semibold text-text-primary">
                                    Responde todas las preguntas
                                </p>

                                <p className="mt-1 text-sm leading-6 text-text-secondary">
                                    Cada pregunta usa una escala del 1 al 5. Puedes agregar un
                                    comentario opcional. La ruta recomendada se habilitará al
                                    enviar el diagnóstico.
                                </p>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </>
    );
}

function DiagnosisNotice({
    title,
    message,
}: {
    title: string;
    message: string;
}) {
    return (
        <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                    <ClipboardX className="h-7 w-7" />
                </div>

                <h1 className="mt-5 text-2xl font-bold text-text-primary">
                    {title}
                </h1>

                <p className="mt-3 text-sm leading-6 text-text-secondary">
                    {message}
                </p>
            </div>
        </section>
    );
}

const submittedAtFormatter = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
});

function DiagnosisAnswers({
    form,
    submission,
    pendingSync,
    onBack,
}: {
    form: DiagnosticFormTree;
    submission: DiagnosticSubmissionView;
    pendingSync: boolean;
    onBack: () => void;
}) {
    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"
            >
                <ArrowLeft className="h-4 w-4" />
                Volver
            </button>

            <section className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary-light p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                    <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                        <p className="text-sm font-semibold text-text-primary">
                            Respuestas enviadas (solo consulta)
                        </p>
                        <p className="mt-1 text-sm leading-6 text-text-secondary">
                            Enviado el {submittedAtFormatter.format(new Date(submission.submittedAt))}.
                            Las respuestas ya no pueden modificarse.
                        </p>
                        {pendingSync && <PendingSyncNote />}
                    </div>
                </div>

                <div className="shrink-0 rounded-xl border border-border bg-surface px-4 py-2 text-center">
                    <p className="text-xs font-semibold text-text-secondary">
                        Promedio
                    </p>
                    <p className="text-lg font-bold text-primary">
                        {submission.averageScore.toFixed(2)} / {LIKERT_MAX}
                    </p>
                </div>
            </section>

            <DiagnosticFormRenderer
                form={form}
                mode="readonly"
                initialAnswers={submission.answers}
            />
        </div>
    );
}

function PendingSyncNote() {
    return (
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            <CloudOff className="h-3.5 w-3.5" />
            Pendiente de sincronizar: se enviará al reconectar
        </p>
    );
}

function DiagnosisCompleted({
    pendingSync,
    onViewAnswers,
}: {
    pendingSync: boolean;
    onViewAnswers?: () => void;
}) {
    const router = useRouter();

    return (
        <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                    <CheckCircle2 className="h-7 w-7" />
                </div>

                <h1 className="mt-5 text-2xl font-bold text-text-primary">
                    Diagnóstico completado
                </h1>

                <p className="mt-3 text-sm leading-6 text-text-secondary">
                    Ya has respondido el diagnóstico institucional. La información fue
                    registrada y tu ruta recomendada ya se encuentra disponible.
                </p>

                {pendingSync && <PendingSyncNote />}

                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() =>
                            router.push(routes.chapter2.route)
                        }
                        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        Ver ruta recomendada
                    </button>

                    {onViewAnswers && (
                        <button
                            type="button"
                            onClick={onViewAnswers}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:border-primary/40 hover:text-primary"
                        >
                            <Eye className="h-4 w-4" />
                            Ver mis respuestas
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
