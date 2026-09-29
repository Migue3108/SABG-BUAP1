"use client";

import { useMemo, useState } from "react";
import { AlertCircle, MessageSquarePlus, MessageSquareX } from "lucide-react";

import { likertScale } from "@/config/likert";
import type {
    DiagnosticAnswerInput,
    DiagnosticFormTree,
} from "@/types/diagnostic-form";

type AnswerState = Partial<Record<string, { value?: number; comment: string; commentOpen: boolean }>>;

type DiagnosticFormRendererProps = {
    form: Pick<DiagnosticFormTree, "title" | "description" | "sections">;
    // respond: se envía; preview: interactivo sin guardar; readonly: muestra respuestas enviadas
    mode: "respond" | "preview" | "readonly";
    initialAnswers?: { questionId: string; value: number; comment: string | null }[];
    submitLabel?: string;
    onSubmit?: (answers: DiagnosticAnswerInput[]) => Promise<string | null>;
};

const COMMENT_MAX = 1000;

function buildInitialState(
    initialAnswers: DiagnosticFormRendererProps["initialAnswers"]
): AnswerState {
    const state: AnswerState = {};

    for (const answer of initialAnswers ?? []) {
        state[answer.questionId] = {
            value: answer.value,
            comment: answer.comment ?? "",
            commentOpen: Boolean(answer.comment),
        };
    }

    return state;
}

export function DiagnosticFormRenderer({
    form,
    mode,
    initialAnswers,
    submitLabel = "Finalizar diagnóstico",
    onSubmit,
}: DiagnosticFormRendererProps) {
    const readOnly = mode === "readonly";

    const [answers, setAnswers] = useState<AnswerState>(() =>
        buildInitialState(initialAnswers)
    );
    const [showErrors, setShowErrors] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [previewNotice, setPreviewNotice] = useState(false);

    const questions = useMemo(
        () => form.sections.flatMap((section) => section.questions),
        [form.sections]
    );

    const questionNumbers = useMemo(
        () => new Map(questions.map((question, index) => [question.id, index + 1])),
        [questions]
    );

    const answeredCount = questions.filter(
        (question) => answers[question.id]?.value !== undefined
    ).length;

    const missingIds = questions
        .filter((question) => answers[question.id]?.value === undefined)
        .map((question) => question.id);

    function updateAnswer(
        questionId: string,
        patch: Partial<AnswerState[string]>
    ) {
        setAnswers((previous) => {
            const current = previous[questionId] ?? { comment: "", commentOpen: false };
            return { ...previous, [questionId]: { ...current, ...patch } };
        });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitError(null);

        if (missingIds.length > 0) {
            setShowErrors(true);
            document
                .getElementById(`question-${missingIds[0]}`)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        if (mode === "preview") {
            setPreviewNotice(true);
            return;
        }

        if (!onSubmit) return;

        setSubmitting(true);

        const error = await onSubmit(
            questions.map((question) => {
                const comment = answers[question.id]?.comment.trim() ?? "";

                return {
                    questionId: question.id,
                    value: answers[question.id]?.value as number,
                    comment: comment === "" ? null : comment,
                };
            })
        );

        setSubmitting(false);
        setSubmitError(error);
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <h2 className="text-xl font-bold text-text-primary">
                    {form.title}
                </h2>
                {form.description && (
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-text-secondary">
                        {form.description}
                    </p>
                )}
                {!readOnly && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                            <span>
                                {answeredCount} de {questions.length} preguntas respondidas
                            </span>
                            <span className="text-red-600 dark:text-red-400">
                                * Todas las preguntas son obligatorias
                            </span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                    width: `${questions.length === 0 ? 0 : (answeredCount / questions.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                )}
            </section>

            {form.sections.map((section, sectionIndex) => (
                <section
                    key={section.id}
                    className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
                >
                    <header className="border-b border-border bg-primary-light/60 px-6 py-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                            Categoría {sectionIndex + 1}
                        </p>
                        <h3 className="mt-0.5 text-lg font-bold text-text-primary">
                            {section.title}
                        </h3>
                        {section.description && (
                            <p className="mt-1 whitespace-pre-line text-sm text-text-secondary">
                                {section.description}
                            </p>
                        )}
                    </header>

                    <div className="divide-y divide-border">
                        {section.questions.map((question) => {
                            const questionNumber = questionNumbers.get(question.id);
                            const answer = answers[question.id];
                            const hasError =
                                showErrors && answer?.value === undefined;

                            return (
                                <fieldset
                                    key={question.id}
                                    id={`question-${question.id}`}
                                    className={[
                                        "space-y-3 px-6 py-5 transition-colors",
                                        hasError ? "bg-red-50/70 dark:bg-red-950/20" : "",
                                    ].join(" ")}
                                >
                                    <legend className="sr-only">{question.text}</legend>
                                    <div>
                                        <p className="text-sm font-semibold text-text-primary">
                                            {questionNumber}. {question.text}
                                            {!readOnly && (
                                                <span className="text-red-600 dark:text-red-400"> *</span>
                                            )}
                                        </p>
                                        {question.helpText && (
                                            <p className="mt-1 whitespace-pre-line text-xs leading-5 text-text-secondary">
                                                {question.helpText}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-2 sm:grid-cols-5">
                                        {likertScale.map((option) => {
                                            const selected = answer?.value === option.value;

                                            return (
                                                <label
                                                    key={option.value}
                                                    className={[
                                                        "flex flex-row items-center gap-3 rounded-xl border p-3 text-left text-xs font-semibold transition sm:flex-col sm:gap-1 sm:text-center",
                                                        selected
                                                            ? "border-primary bg-primary-light text-primary"
                                                            : "border-border bg-background text-text-secondary",
                                                        readOnly
                                                            ? "cursor-default"
                                                            : "cursor-pointer hover:border-primary/40",
                                                        hasError ? "border-red-300 dark:border-red-800" : "",
                                                    ].join(" ")}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${question.id}`}
                                                        value={option.value}
                                                        checked={selected}
                                                        disabled={readOnly}
                                                        onChange={() =>
                                                            updateAnswer(question.id, { value: option.value })
                                                        }
                                                        className="sr-only"
                                                    />
                                                    <span className="text-base font-bold">
                                                        {option.value}
                                                    </span>
                                                    <span className="leading-4">{option.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    {hasError && (
                                        <p className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                                            <AlertCircle className="h-3.5 w-3.5" />
                                            Esta pregunta es obligatoria
                                        </p>
                                    )}

                                    {readOnly ? (
                                        answer?.comment && (
                                            <p className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-secondary">
                                                <span className="font-semibold text-text-primary">Comentario: </span>
                                                {answer.comment}
                                            </p>
                                        )
                                    ) : (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateAnswer(question.id, {
                                                        commentOpen: !answer?.commentOpen,
                                                    })
                                                }
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition hover:opacity-80"
                                            >
                                                {answer?.commentOpen ? (
                                                    <>
                                                        <MessageSquareX className="h-3.5 w-3.5" />
                                                        Ocultar comentario
                                                    </>
                                                ) : (
                                                    <>
                                                        <MessageSquarePlus className="h-3.5 w-3.5" />
                                                        {answer?.comment ? "Ver comentario" : "Agregar comentario"}
                                                    </>
                                                )}
                                            </button>

                                            {answer?.commentOpen && (
                                                <div className="mt-2">
                                                    <textarea
                                                        value={answer.comment}
                                                        maxLength={COMMENT_MAX}
                                                        onChange={(event) =>
                                                            updateAnswer(question.id, {
                                                                comment: event.target.value,
                                                            })
                                                        }
                                                        rows={3}
                                                        placeholder="Comentario opcional sobre esta pregunta..."
                                                        className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                                    />
                                                    <p className="mt-1 text-right text-[11px] text-text-muted">
                                                        {answer.comment.length}/{COMMENT_MAX}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </fieldset>
                            );
                        })}
                    </div>
                </section>
            ))}

            {!readOnly && (
                <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm" aria-live="polite">
                        {submitError ? (
                            <p className="font-semibold text-red-600 dark:text-red-400">{submitError}</p>
                        ) : previewNotice ? (
                            <p className="font-semibold text-primary">
                                Vista previa: el formulario está completo. Las respuestas no se guardan.
                            </p>
                        ) : showErrors && missingIds.length > 0 ? (
                            <p className="font-semibold text-red-600 dark:text-red-400">
                                Faltan {missingIds.length} pregunta(s) por responder.
                            </p>
                        ) : (
                            <p className="text-text-secondary">
                                Revisa tus respuestas antes de enviar. No podrás modificarlas después.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="shrink-0 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {submitting ? "Enviando..." : submitLabel}
                    </button>
                </div>
            )}
        </form>
    );
}
