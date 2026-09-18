"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  History,
  Info,
  RotateCcw,
  Save,
  Send,
  Sparkles,
} from "lucide-react";

import { useMunicipalProgress } from "@/contexts/municipal-progress-context";
import { routes } from "@/config/routes";

const STORAGE_KEY = "sabg-chapter-1-self-assessment-v2";

type AssessmentValue = "applies" | "partial" | "not-applies" | "";
type AssessmentAnswers = Record<string, AssessmentValue>;

const CHECKLIST_ITEMS = [
  {
    id: "item-1",
    number: "1",
    title: "Identificación del problema municipal",
    description: "Se identificó el problema municipal relacionado con el capítulo.",
    guidance:
      "Verifica si el ayuntamiento identificó claramente las debilidades institucionales, quejas ciudadanas o vacíos de información que afectan el buen gobierno.",
  },
  {
    id: "item-2",
    number: "2",
    title: "Revisión conceptual y responsables institucionales",
    description: "Se revisaron los conceptos básicos y responsables institucionales.",
    guidance:
      "Comprueba el conocimiento de los principios de legalidad, transparencia y las responsabilidades del Presidente Municipal, Síndico y Cabildo.",
  },
  {
    id: "item-3",
    number: "3",
    title: "Aplicación del instrumento correspondiente",
    description: "Se aplicó el instrumento o anexo correspondiente.",
    guidance:
      "Asegura que se haya analizado el Anexo 1 del Capítulo 1 y sus herramientas de fundamentación jurídica y axiológica.",
  },
  {
    id: "item-4",
    number: "4",
    title: "Generación del producto mínimo esperado",
    description: "Se generó el producto mínimo esperado.",
    guidance:
      "El producto mínimo consiste en el Marco Conceptual formalizado de Buen Gobierno para las personas servidoras públicas del ayuntamiento.",
  },
  {
    id: "item-5",
    number: "5",
    title: "Conservación de evidencia para seguimiento",
    description: "Se conservó evidencia suficiente para seguimiento.",
    guidance:
      "Confirma que existan minutas de trabajo, acuerdos o respaldos documentales listos para integrarse al expediente auditable.",
  },
  {
    id: "item-6",
    number: "6",
    title: "Definición del siguiente paso de mejora municipal",
    description: "Se definió el siguiente paso de mejora municipal.",
    guidance:
      "Valora si el ayuntamiento definió las áreas prioritarias para avanzar con éxito hacia el Capítulo 2: Diagnóstico Institucional Municipal.",
  },
] as const;

const ASSESSMENT_OPTIONS = [
  {
    value: "applies" as const,
    label: "Se aplica",
    colorClass:
      "text-emerald-700 bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  {
    value: "partial" as const,
    label: "Parcialmente",
    colorClass:
      "text-amber-700 bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  },
  {
    value: "not-applies" as const,
    label: "No se aplica",
    colorClass:
      "text-rose-700 bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
  },
];

const initialAnswers: AssessmentAnswers = Object.fromEntries(
  CHECKLIST_ITEMS.map((item) => [item.id, ""])
);

type PastAssessment = {
  id: string;
  score: number;
  hasWarning: boolean;
  warningNotes?: string | null;
  reflectionNotes?: string | null;
  createdAt: string;
};

export function SelfAssessmentForm() {
  const { completeChapter } = useMunicipalProgress();

  const [answers, setAnswers] = useState<AssessmentAnswers>(initialAnswers);
  const [reflectionNotes, setReflectionNotes] = useState("");
  const [savedLocally, setSavedLocally] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    score: number;
    hasWarning: boolean;
  } | null>(null);
  const [pastAssessments, setPastAssessments] = useState<PastAssessment[]>([]);

  // Cargar borrador de localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.reflectionNotes) setReflectionNotes(parsed.reflectionNotes);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Consultar historial de la base de datos
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/municipal/chapter-1/assessment");
        if (res.ok) {
          const data = await res.json();
          if (data.history && Array.isArray(data.history)) {
            setPastAssessments(data.history);
          }
        }
      } catch (err) {
        console.warn("No se pudo cargar el historial de la base de datos", err);
      }
    }
    loadHistory();
  }, []);

  const completedCount = useMemo(() => {
    return Object.values(answers).filter(Boolean).length;
  }, [answers]);

  const isFormComplete = completedCount === CHECKLIST_ITEMS.length;

  // Lógica de advertencia: si alguna respuesta es "No se aplica" o "Parcialmente"
  const hasWarning = useMemo(() => {
    return Object.values(answers).some(
      (val) => val === "not-applies" || val === "partial"
    );
  }, [answers]);

  const progressPercent = Math.round(
    (completedCount / CHECKLIST_ITEMS.length) * 100
  );

  function handleSelect(id: string, value: AssessmentValue) {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
    setSavedLocally(false);
  }

  function handleSaveDraft() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        answers,
        reflectionNotes,
      })
    );
    setSavedLocally(true);
  }

  function handleReset() {
    setAnswers(initialAnswers);
    setReflectionNotes("");
    localStorage.removeItem(STORAGE_KEY);
    setSavedLocally(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormComplete) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/municipal/chapter-1/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses: answers,
          reflectionNotes,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al guardar en el servidor");
      }

      const result = await res.json();
      localStorage.removeItem(STORAGE_KEY);

      // Desbloquear avance al siguiente capítulo en el contexto del usuario
      completeChapter(1);

      setSubmittedData({
        score: result.assessment.score,
        hasWarning: result.assessment.hasWarning,
      });
    } catch (err) {
      console.error(err);
      alert("Hubo un problema al guardar la autoevaluación. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submittedData) {
    return (
      <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">
              Capítulo 1 &bull; Autoevaluación Finalizada
            </p>

            <h1 className="mt-1 text-2xl font-black text-text-primary md:text-3xl">
              ¡Lista de Verificación Municipal Guardada!
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
              Tu autoevaluación oficial ha sido registrada exitosamente en la base de datos.
              El nivel de cumplimiento calculado para este capítulo es del{" "}
              <strong className="text-primary font-bold">{submittedData.score}%</strong>.
            </p>

            {submittedData.hasWarning && (
              <div className="mt-6 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/30 p-4 text-left">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                      Recomendación antes de iniciar el Capítulo 2
                    </h3>
                    <p className="mt-1 text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                      Se registraron aspectos con estado <strong>Parcialmente</strong> o{" "}
                      <strong>No se aplica</strong>. Te sugerimos revisar las recomendaciones del
                      Capítulo 1 en territorio y consultar los anexos normativos para asegurar que tu
                      ayuntamiento cuente con un marco institucional consolidado.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={routes.chapter2.home}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-hover transition"
              >
                <span>Continuar al Capítulo 2 (Diagnóstico)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={routes.chapter1.home}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-secondary hover:bg-surface-soft transition"
              >
                <span>Volver al Capítulo 1</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Encabezado Institucional */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-bold text-primary mb-2">
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Página 7 del Manual Rector Oficial</span>
              </div>

              <h1 className="text-2xl font-black text-text-primary md:text-3xl">
                Lista de Verificación Municipal de Cierre
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Instrumento rector de acreditación diagnóstica inicial del <strong>Capítulo 1</strong>.
                Valora cada uno de los 6 reactivos señalados formalmente en el Manual de Buen Gobierno
                y Gobernanza Municipal (Página 7).
              </p>
            </div>

            <div className="min-w-56 rounded-xl border border-border bg-surface-soft p-4 shrink-0">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold text-text-secondary">
                  Reactivos contestados
                </p>
                <p className="text-sm font-bold text-primary">
                  {completedCount} de {CHECKLIST_ITEMS.length}
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="mt-2 text-[11px] text-text-muted text-right font-medium">
                {progressPercent}% completado
              </p>
            </div>
          </div>
        </section>

        {/* Banner de Advertencia Dinámica en Vivo */}
        {hasWarning && isFormComplete && (
          <div className="rounded-2xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/90 dark:bg-amber-950/30 p-5 shadow-sm animate-in fade-in-50 duration-200">
            <div className="flex items-start gap-3.5">
              <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                  Advertencia: Favor de revisar la información una vez más antes de continuar al Capítulo 2
                </h3>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  Has marcado reactivos como <strong>Parcialmente</strong> o{" "}
                  <strong>No se aplica</strong>. Puedes guardar y continuar, pero se recomienda
                  analizar con el Cabildo o con tu Docente Asesor los puntos pendientes para que no se
                  conviertan en debilidades durante el Diagnóstico Municipal del Capítulo 2.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Guía informativa */}
        <section className="rounded-xl border border-primary/20 bg-primary-light p-4 text-xs text-text-secondary flex items-start gap-3">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p>
            Responde con objetividad técnica la situación que guarda actualmente tu ayuntamiento.
            Esta evaluación no es punitiva; sirve de línea base oficial para el acompañamiento BUAP.
          </p>
        </section>

        {/* Formulario de los 6 Reactivos */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <header className="border-b border-border bg-surface-soft/60 p-5 md:px-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                Reactivos Oficiales de la Lista de Verificación
              </h2>
            </header>

            <div className="divide-y divide-border">
              {CHECKLIST_ITEMS.map((item) => {
                const selectedValue = answers[item.id];

                return (
                  <div key={item.id} className="p-5 md:p-6 transition hover:bg-surface-soft/40">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                            {item.number}
                          </span>
                          <h3 className="text-sm font-bold text-text-primary">
                            {item.title}
                          </h3>
                        </div>

                        <p className="text-xs font-semibold text-primary mt-1">
                          &ldquo;{item.description}&rdquo;
                        </p>

                        <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                          {item.guidance}
                        </p>
                      </div>

                      {/* Botones de Opción */}
                      <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0">
                        {ASSESSMENT_OPTIONS.map((opt) => {
                          const isSelected = selectedValue === opt.value;

                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleSelect(item.id, opt.value)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                                isSelected
                                  ? `${opt.colorClass} ring-2 ring-primary/20 shadow-xs`
                                  : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-text-primary"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  isSelected ? "bg-current" : "bg-border"
                                }`}
                              />
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Observaciones Generales */}
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary mb-1">
              Observaciones Municipales y Notas de Contexto (Opcional)
            </h3>
            <p className="text-xs text-text-secondary mb-3">
              Puedes detallar circunstancias especiales, acuerdos de cabildo o consideraciones del municipio.
            </p>
            <textarea
              rows={3}
              value={reflectionNotes}
              onChange={(e) => {
                setReflectionNotes(e.target.value);
                setSavedLocally(false);
              }}
              placeholder="Ejemplo: Se cuenta con acuerdo de cabildo de fecha 15 de enero; pendiente publicación en bando oficial..."
              className="w-full resize-none rounded-xl border border-border bg-background p-3 text-xs text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </section>

          {/* Acciones del Formulario */}
          <section className="flex flex-col-reverse gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-surface-soft transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Limpiar respuestas</span>
            </button>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-surface-soft transition"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{savedLocally ? "Borrador guardado en equipo" : "Guardar borrador"}</span>
              </button>

              <button
                type="submit"
                disabled={!isFormComplete || isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? (
                  <span>Guardando en base de datos...</span>
                ) : (
                  <>
                    <span>Guardar y Finalizar Autoevaluación</span>
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </section>
        </form>

        {/* Historial de Evaluaciones Anteriores (si existen en la base de datos) */}
        {pastAssessments.length > 0 && (
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-text-primary">
                Historial de Evaluaciones Registradas ({pastAssessments.length})
              </h3>
            </div>

            <div className="space-y-2">
              {pastAssessments.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-soft/50 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary">#{pastAssessments.length - idx}</span>
                    <span className="text-text-secondary">
                      {new Date(item.createdAt).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-text-primary">Puntaje: {item.score}%</span>
                    {item.hasWarning ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 text-[10px] font-bold">
                        Con observaciones
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-[10px] font-bold">
                        100% Cumplido
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}