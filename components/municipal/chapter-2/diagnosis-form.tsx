"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ClipboardX, FileText, Loader2 } from "lucide-react";

import { useMunicipalProgress } from "@/contexts/municipal-progress-context";
import { MunicipalWorkflowProgress } from "@/components/dashboard/progress/municipal-workflow-progress";
import { DiagnosticFormRenderer } from "@/components/diagnostic/diagnostic-form-renderer";
import { routes } from "@/config/routes";
import type {
    DiagnosticAnswerInput,
    DiagnosticFormTree,
    DiagnosticSubmissionView,
} from "@/types/diagnostic-form";

type DiagnosticState =
    | { status: "loading" }
    | { status: "error"; message: string }
    | {
        status: "ready";
        form: DiagnosticFormTree | null;
        submission: DiagnosticSubmissionView | null;
    };

export function DiagnosisForm() {
    const router = useRouter();

    const {
        isCompleted,
        completeStep,
    } = useMunicipalProgress();

    const [state, setState] = useState<DiagnosticState>({ status: "loading" });

    useEffect(() => {
        let cancelled = false;

        async function loadDiagnostic() {
            try {
                const response = await fetch("/api/municipal/chapter-2/diagnostic", {
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

                setState({
                    status: "ready",
                    form: data.form,
                    submission: data.submission,
                });
            } catch {
                if (!cancelled) {
                    setState({
                        status: "error",
                        message: "Error de conexión. Recarga la página para intentar de nuevo.",
                    });
                }
            }
        }

        loadDiagnostic();

        return () => {
            cancelled = true;
        };
    }, []);

    // Si ya existe una respuesta en DB, sincroniza el progreso local
    const alreadySubmitted =
        state.status === "ready" && state.submission !== null;

    useEffect(() => {
        if (alreadySubmitted && !isCompleted("diagnosis")) {
            completeStep("diagnosis");
        }
    }, [alreadySubmitted, isCompleted, completeStep]);

    async function handleSubmit(
        answers: DiagnosticAnswerInput[]
    ): Promise<string | null> {
        if (state.status !== "ready" || !state.form) {
            return "El diagnóstico no está disponible";
        }

        try {
            const response = await fetch("/api/municipal/chapter-2/diagnostic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formId: state.form.id, answers }),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return data.error || "No se pudo enviar el diagnóstico";
            }
        } catch {
            return "Error de conexión. Intenta de nuevo.";
        }

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

    if (state.submission || isCompleted("diagnosis")) {
        return (
            <>
                <MunicipalWorkflowProgress />
                <DiagnosisCompleted />
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
                        onSubmit={handleSubmit}
                    />
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

function DiagnosisCompleted() {
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

                <button
                    type="button"
                    onClick={() =>
                        router.push(routes.chapter2.route)
                    }
                    className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    Ver ruta recomendada
                </button>
            </div>
        </section>
    );
}
