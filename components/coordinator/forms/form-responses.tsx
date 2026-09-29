"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

import { DiagnosticFormRenderer } from "@/components/diagnostic/diagnostic-form-renderer";
import { FormStatusBadge } from "@/components/coordinator/forms/form-status-badge";
import { LIKERT_MAX, likertScale } from "@/config/likert";
import { routes } from "@/config/routes";
import type { DiagnosticResponsesReport } from "@/types/diagnostic-form";

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
});

function formatScore(score: number | null): string {
    return score === null ? "—" : score.toFixed(2);
}

export function FormResponses({ report }: { report: DiagnosticResponsesReport }) {
    const { form, submissions, questionStats, overallAverage } = report;
    const [openSubmissionId, setOpenSubmissionId] = useState<string | null>(null);

    const statsByQuestion = new Map(
        questionStats.map((stats) => [stats.questionId, stats])
    );

    const commentsByQuestion = new Map<string, { userName: string; comment: string }[]>();
    for (const submission of submissions) {
        for (const answer of submission.answers) {
            if (!answer.comment) continue;
            const list = commentsByQuestion.get(answer.questionId) ?? [];
            list.push({ userName: submission.institution || submission.userName, comment: answer.comment });
            commentsByQuestion.set(answer.questionId, list);
        }
    }

    return (
        <div className="space-y-6">
            <Link
                href={routes.coordinator.form(form.id)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"
            >
                <ArrowLeft className="h-4 w-4" />
                Volver al diagnóstico
            </Link>

            <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                    <FormStatusBadge status={form.status} />
                    <p className="text-sm font-semibold text-primary">Respuestas</p>
                </div>
                <h1 className="mt-2 text-2xl font-bold text-text-primary md:text-3xl">
                    {form.title}
                </h1>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <Metric label="Respuestas recibidas" value={String(submissions.length)} />
                    <Metric
                        label="Promedio general"
                        value={`${formatScore(overallAverage)} / ${LIKERT_MAX}`}
                    />
                    <Metric
                        label="Preguntas"
                        value={String(questionStats.length)}
                    />
                </div>
            </section>

            {/* Promedio por pregunta */}
            {form.sections.map((section, sectionIndex) => (
                <section
                    key={section.id}
                    className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
                >
                    <header className="border-b border-border bg-primary-light/60 px-6 py-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                            Categoría {sectionIndex + 1}
                        </p>
                        <h2 className="mt-0.5 text-lg font-bold text-text-primary">
                            {section.title}
                        </h2>
                    </header>

                    <ul className="divide-y divide-border">
                        {section.questions.map((question) => {
                            const stats = statsByQuestion.get(question.id);
                            const comments = commentsByQuestion.get(question.id) ?? [];
                            const total = Object.values(stats?.distribution ?? {}).reduce(
                                (sum, count) => sum + count,
                                0
                            );

                            return (
                                <li key={question.id} className="space-y-3 px-6 py-5">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <p className="text-sm font-semibold text-text-primary">
                                            {question.text}
                                        </p>
                                        <p className="shrink-0 text-sm font-bold text-primary">
                                            {formatScore(stats?.average ?? null)} / {LIKERT_MAX}
                                        </p>
                                    </div>

                                    <div className="grid gap-1.5 sm:grid-cols-5">
                                        {likertScale.map((option) => {
                                            const count = stats?.distribution[option.value] ?? 0;
                                            const percent = total === 0 ? 0 : Math.round((count / total) * 100);

                                            return (
                                                <div key={option.value} className="text-[11px] text-text-secondary">
                                                    <div className="flex justify-between">
                                                        <span>{option.value} · {option.label}</span>
                                                        <span className="font-semibold text-text-primary">{count}</span>
                                                    </div>
                                                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
                                                        <div
                                                            className="h-full rounded-full bg-primary"
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {comments.length > 0 && (
                                        <details className="rounded-lg border border-border bg-background px-4 py-2 text-sm">
                                            <summary className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-primary">
                                                <MessageSquare className="h-3.5 w-3.5" />
                                                {comments.length} comentario(s)
                                            </summary>
                                            <ul className="mt-2 space-y-2 pb-1">
                                                {comments.map((item, index) => (
                                                    <li key={index} className="text-text-secondary">
                                                        <span className="font-semibold text-text-primary">{item.userName}: </span>
                                                        {item.comment}
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}

            {/* Respuestas individuales */}
            <section className="rounded-2xl border border-border bg-surface shadow-sm">
                <header className="border-b border-border px-6 py-4">
                    <h2 className="text-lg font-bold text-text-primary">
                        Respuestas por municipio
                    </h2>
                </header>

                {submissions.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-text-secondary">
                        Aún no hay respuestas para este diagnóstico.
                    </p>
                ) : (
                    <ul className="divide-y divide-border">
                        {submissions.map((submission) => {
                            const open = openSubmissionId === submission.id;

                            return (
                                <li key={submission.id}>
                                    <button
                                        type="button"
                                        onClick={() => setOpenSubmissionId(open ? null : submission.id)}
                                        aria-expanded={open}
                                        className="flex w-full flex-col gap-1 px-6 py-4 text-left transition hover:bg-background sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-text-primary">
                                                {submission.institution || "Sin institución"}
                                            </p>
                                            <p className="truncate text-xs text-text-secondary">
                                                {submission.userName} · {submission.userEmail} · {dateFormatter.format(new Date(submission.submittedAt))}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-3">
                                            <span className="text-sm font-bold text-primary">
                                                {formatScore(submission.averageScore)} / {LIKERT_MAX}
                                            </span>
                                            {open ? (
                                                <ChevronUp className="h-4 w-4 text-text-muted" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 text-text-muted" />
                                            )}
                                        </div>
                                    </button>

                                    {open && (
                                        <div className="border-t border-border bg-background p-4 md:p-6">
                                            <DiagnosticFormRenderer
                                                form={form}
                                                mode="readonly"
                                                initialAnswers={submission.answers}
                                            />
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </div>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-text-primary">{value}</p>
        </div>
    );
}
