"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import {
    ArrowRight,
    CheckCircle2,
    FileText,
    Trash2,
    UploadCloud,
} from "lucide-react";

import { useMunicipalProgress } from "@/contexts/municipal-progress-context";
import { MunicipalWorkflowProgress } from "@/components/dashboard/progress/municipal-workflow-progress";

import { clearDraft, loadDraft, useAutosaveDraft } from "@/lib/offline/drafts";
import { useOfflineSync } from "@/lib/offline/sync-provider";

import type { EvidenceFile } from "@/types/evidence";

// Los archivos seleccionados se guardan en el dispositivo (IndexedDB) para no perderlos al recargar
const DRAFT_KEY =
    "chapter-2-evidence";

const MAX_FILE_SIZE =
    5 * 1024 * 1024;

const ACCEPTED_TYPE =
    "application/pdf";

export function EvidenceUpload() {
    const router = useRouter();

    const inputRef =
        useRef<HTMLInputElement>(null);

    const {
        currentStep,
        isUnlocked,
        isCompleted,
        completeStep,
    } = useMunicipalProgress();

    const [
        evidences,
        setEvidences,
    ] = useState<EvidenceFile[]>([]);

    const [
        generalError,
        setGeneralError,
    ] = useState("");

    const evidenceUnlocked =
        isUnlocked("evidence");

    const evidenceCompleted =
        isCompleted("evidence");

    const { userId } = useOfflineSync();

    const [
        draftLoaded,
        setDraftLoaded,
    ] = useState(false);

    useAutosaveDraft(
        userId,
        DRAFT_KEY,
        evidences,
        draftLoaded && !evidenceCompleted
    );

    useEffect(() => {
        let cancelled = false;

        loadDraft<EvidenceFile[]>(
            userId,
            DRAFT_KEY
        ).then((stored) => {
            if (cancelled) {
                return;
            }

            if (stored?.length) {
                setEvidences(stored);
            }

            setDraftLoaded(true);
        });

        return () => {
            cancelled = true;
        };
    }, [userId]);

    function validateFile(
        file: File
    ): string | null {
        const isPdf =
            file.type === ACCEPTED_TYPE ||
            file.name
                .toLowerCase()
                .endsWith(".pdf");

        if (!isPdf) {
            return "Solo se aceptan archivos PDF.";
        }

        if (
            file.size >
            MAX_FILE_SIZE
        ) {
            return "El archivo supera el límite de 5 MB.";
        }

        return null;
    }

    function handleFiles(
        files: FileList | null
    ) {
        if (!files) {
            return;
        }

        setGeneralError("");

        const incomingFiles =
            Array.from(files);

        const validFiles: EvidenceFile[] = [];

        let hasErrors = false;

        incomingFiles.forEach(
            (file) => {
                const error =
                    validateFile(file);

                if (error) {
                    hasErrors = true;

                    validFiles.push({
                        id: crypto.randomUUID(),
                        file,
                        name: file.name,
                        size: file.size,
                        status: "error",
                        error,
                    });

                    return;
                }

                validFiles.push({
                    id: crypto.randomUUID(),
                    file,
                    name: file.name,
                    size: file.size,
                    status: "ready",
                });
            }
        );

        if (hasErrors) {
            setGeneralError(
                "Algunos archivos no cumplen con los requisitos."
            );
        }

        setEvidences(
            (previous) => [
                ...previous,
                ...validFiles,
            ]
        );

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    function removeEvidence(
        id: string
    ) {
        setEvidences(
            (previous) =>
                previous.filter(
                    (evidence) =>
                        evidence.id !== id
                )
        );
    }

    function handleSubmit() {
        const validEvidences =
            evidences.filter(
                (evidence) =>
                    evidence.status === "ready"
            );

        if (
            validEvidences.length === 0
        ) {
            setGeneralError(
                "Debes agregar al menos una evidencia PDF válida."
            );

            return;
        }

        completeStep("evidence");

        clearDraft(
            userId,
            DRAFT_KEY
        );

        router.push(
            "/seguimiento"
        );
    }

    if (!evidenceUnlocked) {
        return (
            <>
                <MunicipalWorkflowProgress />
                <main className="flex-1 bg-background p-6 lg:p-8">
                    <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
                        <h1 className="text-2xl font-bold text-text-primary">
                            Evidencias no disponibles
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-text-secondary">
                            Primero debes completar el instrumento correspondiente.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/capitulo-2/instrumento"
                                )
                            }
                            className="mt-6 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white"
                        >
                            Ir al instrumento
                        </button>
                    </section>
                </main>
            </>
        );
    }

    if (evidenceCompleted) {
        return (
            <>
                <MunicipalWorkflowProgress />
                <EvidenceCompleted />
            </>
        );
    }

    return (
        <>
            <MunicipalWorkflowProgress />
            <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
                        <div className="flex items-center gap-2 text-primary">
                            <UploadCloud className="h-5 w-5" />

                            <p className="text-xs font-semibold uppercase tracking-wide">
                                Evidencias
                            </p>
                        </div>

                        <h1 className="mt-3 text-2xl font-bold text-text-primary md:text-3xl">
                            Integra tus evidencias
                        </h1>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary md:text-base">
                            Adjunta los documentos que respalden el trabajo realizado durante esta etapa.
                        </p>

                        <div className="mt-5 rounded-xl border border-primary/20 bg-primary-light p-4">
                            <p className="text-sm font-semibold text-text-primary">
                                Requisitos de archivo
                            </p>

                            <p className="mt-1 text-sm text-text-secondary">
                                Solo archivos PDF · Máximo 5 MB por archivo.
                            </p>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            multiple
                            onChange={(event) =>
                                handleFiles(
                                    event.target.files
                                )
                            }
                            className="hidden"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                inputRef.current?.click()
                            }
                            className="flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background px-6 py-10 text-center transition hover:border-primary/50 hover:bg-primary-light"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                                <UploadCloud className="h-7 w-7" />
                            </div>

                            <p className="mt-4 font-semibold text-text-primary">
                                Selecciona tus evidencias
                            </p>

                            <p className="mt-2 text-sm text-text-secondary">
                                Puedes seleccionar uno o varios archivos PDF.
                            </p>

                            <p className="mt-1 text-xs text-text-muted">
                                Máximo 5 MB por archivo
                            </p>
                        </button>

                        {generalError && (
                            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {generalError}
                            </p>
                        )}

                        {evidences.length > 0 && (
                            <div className="mt-6 space-y-3">
                                <div>
                                    <h2 className="font-semibold text-text-primary">
                                        Archivos seleccionados
                                    </h2>

                                    <p className="mt-1 text-sm text-text-secondary">
                                        Revisa que todos los documentos cumplan con los requisitos antes de continuar.
                                    </p>
                                </div>

                                {evidences.map(
                                    (evidence) => (
                                        <EvidenceItem
                                            key={
                                                evidence.id
                                            }
                                            evidence={
                                                evidence
                                            }
                                            onRemove={() =>
                                                removeEvidence(
                                                    evidence.id
                                                )
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )}

                        <div className="mt-8 flex justify-end border-t border-border pt-6">
                            <button
                                type="button"
                                disabled={
                                    evidences.filter(
                                        (evidence) =>
                                            evidence.status ===
                                            "ready"
                                    ).length === 0
                                }
                                onClick={
                                    handleSubmit
                                }
                                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Enviar evidencias

                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

function EvidenceItem({
    evidence,
    onRemove,
}: {
    evidence: EvidenceFile;
    onRemove: () => void;
}) {
    const isError =
        evidence.status === "error";

    return (
        <div
            className={[
                "flex items-start gap-4 rounded-xl border p-4",
                isError
                    ? "border-red-200 bg-red-50"
                    : "border-border bg-background",
            ].join(" ")}
        >
            <div
                className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    isError
                        ? "bg-red-100 text-red-600"
                        : "bg-primary-light text-primary",
                ].join(" ")}
            >
                <FileText className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text-primary">
                    {evidence.name}
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                    {formatFileSize(
                        evidence.size
                    )}
                </p>

                {isError ? (
                    <p className="mt-2 text-xs font-medium text-red-600">
                        {evidence.error}
                    </p>
                ) : (
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-700">
                        <CheckCircle2 className="h-4 w-4" />

                        Archivo válido
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={onRemove}
                aria-label={`Eliminar ${evidence.name}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface hover:text-red-600"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}

function EvidenceCompleted() {
    const router = useRouter();

    return (
        <main className="flex-1 bg-background p-6 lg:p-8">
            <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                    <CheckCircle2 className="h-7 w-7" />
                </div>

                <h1 className="mt-5 text-2xl font-bold text-text-primary">
                    Evidencias enviadas
                </h1>

                <p className="mt-3 text-sm leading-6 text-text-secondary">
                    Tus evidencias fueron registradas correctamente y ahora pueden pasar a revisión.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/seguimiento"
                        )
                    }
                    className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    Ir a seguimiento
                </button>
            </section>
        </main>
    );
}

function formatFileSize(
    bytes: number
) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (
        bytes <
        1024 * 1024
    ) {
        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;
    }

    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(2)} MB`;
}