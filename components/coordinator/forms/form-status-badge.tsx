import type { DiagnosticFormStatus } from "@/types/diagnostic-form";

const STATUS_STYLES: Record<DiagnosticFormStatus, { label: string; className: string }> = {
    borrador: {
        label: "Borrador",
        className:
            "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
    },
    publicado: {
        label: "Publicado",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    archivado: {
        label: "Archivado",
        className: "border-border bg-background text-text-muted",
    },
};

export function FormStatusBadge({ status }: { status: DiagnosticFormStatus }) {
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.borrador;

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.className}`}
        >
            {style.label}
        </span>
    );
}
