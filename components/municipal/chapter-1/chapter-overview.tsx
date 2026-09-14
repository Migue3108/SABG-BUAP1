"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  Landmark,
  Compass,
  FileCheck,
  Eye,
  HeartHandshake,
  TrendingUp,
  ArrowRight,
  ClipboardCheck,
  Layers,
  ChevronRight,
  Award,
} from "lucide-react";

import { routes } from "@/config/routes";

type ChapterData = {
  number: number;
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  objective: string;
  whyItMatters: string;
  tools: string[];
  deliverable: string;
  actionRoute?: string;
  actionText?: string;
};

const CHAPTERS_CATALOG: ChapterData[] = [
  {
    number: 1,
    id: "cap-1",
    title: "Fundamentos del Buen Gobierno y Gobernanza Municipal",
    subtitle: "Marco conceptual, axiológico y normativo",
    icon: Scale,
    badge: "Marco Rector",
    objective:
      "Reconocer los principios, componentes y fundamentos jurídicos (Constitución Federal, Estatal y Ley Orgánica Municipal) que orientan una administración pública municipal íntegra, transparente y con vocación de servicio.",
    whyItMatters:
      "Proporciona la certeza legal y la base de legitimidad institucional necesaria antes de aplicar cualquier instrumento de planeación o diagnóstico en el ayuntamiento.",
    tools: [
      "Marco axiológico de 6 valores fundamentales (Legalidad, Integridad, Transparencia, Rendición de cuentas, Eficiencia y Participación).",
      "Cédula de Autoevaluación de Fundamentos del Buen Gobierno.",
      "Mapeo de atribuciones y competencias del Cabildo y dependencias.",
    ],
    deliverable:
      "Adopción formal de los Principios de Buen Gobierno en sesión de Cabildo y acreditación diagnóstica inicial.",
    actionRoute: routes.chapter1.selfAssessment,
    actionText: "Iniciar autoevaluación del Cap. 1",
  },
  {
    number: 2,
    id: "cap-2",
    title: "Diagnóstico Institucional Municipal",
    subtitle: "Evaluación situacional de capacidades y áreas críticas",
    icon: ClipboardCheck,
    badge: "Diagnóstico",
    objective:
      "Evaluar de manera objetiva el estado de las capacidades organizacionales, normativas, tecnológicas y operativas en las dependencias de la administración municipal.",
    whyItMatters:
      "Permite identificar vacíos administrativos, duplicidad de procesos, riesgos de opacidad y requerimientos presupuestales antes de formular planes o proyectos de inversión.",
    tools: [
      "Lista de verificación institucional en 4 dimensiones (Planeación, Organización, Operación y Control).",
      "Matriz de hallazgos y brechas institucionales.",
      "Cuestionarios de capacidad de respuesta municipal.",
    ],
    deliverable:
      "Cédula de Diagnóstico Institucional y Matriz de Hallazgos Priorizados con semáforo de riesgo.",
    actionRoute: routes.chapter2.home,
    actionText: "Ir a Diagnóstico Municipal (Cap. 2)",
  },
  {
    number: 3,
    id: "cap-3",
    title: "Planeación Estratégica Municipal",
    subtitle: "Alineación y metas cuantificables",
    icon: Compass,
    badge: "Estrategia",
    objective:
      "Guiar la elaboración del Plan Municipal de Desarrollo (PMD) con visión plurianual, indicadores de desempeño y alineación estricta a los planes Estatal y Federal.",
    whyItMatters:
      "Erradica la improvisación y asegura que el gasto público municipal esté directamente vinculado a objetivos prioritarios y demandas sentidas de la población.",
    tools: [
      "Metodología de Marco Lógico y Árbol de Problemas/Objetivos.",
      "Matriz de Indicadores para Resultados (MIR).",
      "Fichas técnicas para el diseño de indicadores (KPIs).",
    ],
    deliverable:
      "Estructura programática del Plan Municipal de Desarrollo con metas evaluables e indicadores vinculados al presupuesto.",
  },
  {
    number: 4,
    id: "cap-4",
    title: "Control Interno y Gestión de Riesgos",
    subtitle: "Mecanismos preventivos y blindaje administrativo",
    icon: ShieldCheck,
    badge: "Control Interno",
    objective:
      "Implementar el Sistema de Control Interno Institucional y la administración activa de riesgos que puedan obstaculizar las metas gubernamentales o propiciar irregularidades.",
    whyItMatters:
      "Previene desvíos de fondos, evita observaciones y pliegos de cargos de la Auditoría Superior del Estado (ASE) y protege el patrimonio municipal.",
    tools: [
      "Modelo de Control Interno COSO adaptado a municipios de Puebla.",
      "Metodología de Identificación y Evaluación de Riesgos.",
      "Matriz y Mapa de Calor de Riesgos Institucionales.",
    ],
    deliverable:
      "Programa Anual de Control Interno (PACI) y Mapa de Riesgos Institucional aprobado por el Órgano Interno de Control.",
  },
  {
    number: 5,
    id: "cap-5",
    title: "Transparencia y Rendición de Cuentas",
    subtitle: "Gobierno abierto y acceso a la información pública",
    icon: Eye,
    badge: "Transparencia",
    objective:
      "Garantizar el cumplimiento al 100% de las obligaciones de transparencia activa, versiones públicas de contratos y respuesta expedita a solicitudes ciudadanas.",
    whyItMatters:
      "Recupera la confianza ciudadana, evita multas y medidas de apremio del órgano garante (ITAIPUE) y consolida una gestión visible y auditable.",
    tools: [
      "Catálogo de Obligaciones Comunes y Específicas de la Ley de Transparencia de Puebla.",
      "Guía práctica para elaboración de versiones públicas (protección de datos personales).",
      "Protocolo de gestión de la Unidad de Transparencia Municipal.",
    ],
    deliverable:
      "Portal de Transparencia Municipal actualizado, expedientes clasificados y protocolo de atención ciudadana.",
  },
  {
    number: 6,
    id: "cap-6",
    title: "Integridad y Ética Pública",
    subtitle: "Conducta, valores y prevención de faltas administrativas",
    icon: Sparkles,
    badge: "Integridad",
    objective:
      "Fomentar un clima organizacional basado en valores éticos, vocación de servicio y prevención activa de conflictos de interés y conductas irregulares.",
    whyItMatters:
      "La integridad es el pilar preventivo más eficaz contra la corrupción, el nepotismo, el desvío de recursos y el abuso de autoridad.",
    tools: [
      "Modelo de Código de Ética y Código de Conducta Municipal.",
      "Lineamientos para la instalación del Comité de Ética.",
      "Protocolo de canalización y atención de quejas y denuncias con anonimato.",
    ],
    deliverable:
      "Código de Ética publicado formalmente, Comité de Ética en funciones y buzón institucional de denuncia ciudadana.",
  },
  {
    number: 7,
    id: "cap-7",
    title: "Participación Ciudadana y Gobernanza",
    subtitle: "Corresponsabilidad vecinal y contraloría social",
    icon: HeartHandshake,
    badge: "Participación",
    objective:
      "Establecer mecanismos permanentes y estructurados de consulta ciudadana, cabildo abierto, presupuesto participativo y contraloría social en obras comunitarias.",
    whyItMatters:
      "La gobernanza moderna implica tomar decisiones en conjunto con la sociedad; la participación comunitaria asegura que las obras respondan a necesidades reales y perduren.",
    tools: [
      "Guía para la conformación de Comités de Contraloría Social en obra pública.",
      "Mecanismos de consulta y Cabildo Abierto.",
      "Formato de acta de supervisión ciudadana.",
    ],
    deliverable:
      "Registro de Comités Comunitarios de Contraloría Social activos con actas de verificación en campo de las obras locales.",
  },
  {
    number: 8,
    id: "cap-8",
    title: "Implementación y Seguimiento",
    subtitle: "Monitoreo, evaluación continua y memoria de gestión",
    icon: TrendingUp,
    badge: "Seguimiento",
    objective:
      "Articular un sistema de seguimiento del avance físico-financiero de metas, evaluación del impacto de los programas y elaboración de informes ejecutivos de resultados.",
    whyItMatters:
      "Asegura que el diagnóstico y las metas no queden en papel, permitiendo correcciones oportunas y garantizando una entrega-recepción ordenada al final del trienio.",
    tools: [
      "Tablero de Control de Mando con semáforos de cumplimiento.",
      "Fichas de evaluación trimestral de metas institucionales.",
      "Plantilla para el Informe de Gobierno Municipal.",
    ],
    deliverable:
      "Informes Ejecutivos de Avance Trimestral y Memoria de Gestión Institucional consolidada.",
  },
];

export function ChapterOverview() {
  const [selectedChapterNumber, setSelectedChapterNumber] = useState(1);
  const [viewMode, setViewMode] = useState<"focused" | "grid">("focused");

  const currentChapter =
    CHAPTERS_CATALOG.find((c) => c.number === selectedChapterNumber) ||
    CHAPTERS_CATALOG[0];

  const CurrentIcon = currentChapter.icon;

  return (
    <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* =========================================================================
            1. Encabezado del Documento Rector
           ========================================================================= */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-bold text-primary mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Documento Rector Metodológico SABG–BUAP</span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-text-primary md:text-3xl lg:text-4xl">
                Manual para el Buen Gobierno y Gobernanza Municipal
              </h1>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-text-secondary">
                Coedición institucional formalizada entre la <strong>Benemérita Universidad
                Autónoma de Puebla (Facultad de Administración)</strong> y el <strong>Gobierno
                del Estado de Puebla</strong>. Este instrumento rector articula la metodología
                completa a través de <strong>8 capítulos temáticos</strong> para transformar
                la gestión en los 217 municipios poblanos.
              </p>
            </div>

            {/* Ficha institucional lateral */}
            <div className="rounded-xl border border-primary/20 bg-primary-light p-5 lg:w-72 shrink-0">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Ficha del Documento Rector
              </p>
              <div className="mt-3 space-y-2 text-xs text-text-primary">
                <p>
                  <strong>Estructura:</strong> 8 Capítulos Integrales
                </p>
                <p>
                  <strong>Enfoque:</strong> 4 Fases de Aplicación
                </p>
                <p>
                  <strong>Alcance:</strong> 217 Municipios de Puebla
                </p>
                <p>
                  <strong>Acompañamiento:</strong> Asesoría BUAP en territorio
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-primary/20 flex items-center justify-between">
                <Link
                  href={routes.chapter1.resources}
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Ver recursos y anexos</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. Ciclo Metodológico de 4 Fases
           ========================================================================= */}
        <section className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
            Ciclo Metodológico Rector en Cuatro Fases
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                FASE 1
              </span>
              <h3 className="font-bold text-text-primary text-sm mt-1">Comprender</h3>
              <p className="text-xs text-text-secondary mt-1">
                Marco legal, responsabilidades y principios rectores (Cap. 1 y 6).
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                FASE 2
              </span>
              <h3 className="font-bold text-text-primary text-sm mt-1">Aplicar</h3>
              <p className="text-xs text-text-secondary mt-1">
                Diagnóstico de capacidades y planeación estratégica (Cap. 2 y 3).
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                FASE 3
              </span>
              <h3 className="font-bold text-text-primary text-sm mt-1">Documentar</h3>
              <p className="text-xs text-text-secondary mt-1">
                Control interno, mapas de riesgos y gobierno abierto (Cap. 4 y 5).
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                FASE 4
              </span>
              <h3 className="font-bold text-text-primary text-sm mt-1">Dar Seguimiento</h3>
              <p className="text-xs text-text-secondary mt-1">
                Contraloría social, tableros de control y memorias (Cap. 7 y 8).
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. Selector Interactivo de los 8 Capítulos
           ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                Desglose Modular Didáctico
              </p>
              <h2 className="text-xl font-bold text-text-primary">
                Los 8 Capítulos del Documento Rector
              </h2>
              <p className="text-xs text-text-secondary">
                Selecciona cualquier capítulo para revisar su síntesis ejecutiva, herramientas y producto entregable.
              </p>
            </div>

            {/* Alternador de vista */}
            <div className="inline-flex rounded-xl border border-border bg-surface p-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("focused")}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  viewMode === "focused"
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Vista Detallada
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  viewMode === "grid"
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Ver Todos (8)
              </button>
            </div>
          </div>

          {/* Barra de Pestañas de los 8 Capítulos */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {CHAPTERS_CATALOG.map((cap) => {
              const isSelected = selectedChapterNumber === cap.number;
              const Icon = cap.icon;
              return (
                <button
                  key={cap.number}
                  type="button"
                  onClick={() => {
                    setSelectedChapterNumber(cap.number);
                    if (viewMode === "grid") setViewMode("focused");
                  }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition border ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-surface text-text-secondary border-border hover:border-text-muted hover:text-text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>Capítulo {cap.number}</span>
                </button>
              );
            })}
          </div>

          {/* Modo Detallado / Enfocado */}
          {viewMode === "focused" && (
            <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 shadow-sm animate-in fade-in-50 duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <CurrentIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Capítulo {currentChapter.number}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {currentChapter.badge}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-text-primary mt-0.5">
                      {currentChapter.title}
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {currentChapter.subtitle}
                    </p>
                  </div>
                </div>

                {currentChapter.actionRoute && (
                  <Link
                    href={currentChapter.actionRoute}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition shrink-0"
                  >
                    <span>{currentChapter.actionText || "Comenzar"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>

              {/* Contenido Modular del Capítulo */}
              <div className="grid md:grid-cols-2 gap-6 pt-6">
                {/* Objetivo */}
                <div className="rounded-xl border border-border bg-slate-50/60 p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#174a91] mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-primary" />
                    <span>Objetivo Central</span>
                  </h4>
                  <p className="text-sm text-text-primary leading-relaxed">
                    {currentChapter.objective}
                  </p>
                </div>

                {/* Por qué importa */}
                <div className="rounded-xl border border-border bg-slate-50/60 p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>¿Por qué importa al Municipio?</span>
                  </h4>
                  <p className="text-sm text-text-primary leading-relaxed">
                    {currentChapter.whyItMatters}
                  </p>
                </div>

                {/* Herramientas y Anexos */}
                <div className="rounded-xl border border-border bg-slate-50/60 p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-primary" />
                    <span>Herramientas y Anexos Metodológicos</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-text-secondary">
                    {currentChapter.tools.map((tool, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Producto Entregable */}
                <div className="rounded-xl border border-border bg-slate-50/60 p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-amber-600" />
                    <span>Producto Entregable</span>
                  </h4>
                  <p className="text-sm font-semibold text-text-primary leading-relaxed">
                    {currentChapter.deliverable}
                  </p>
                  <p className="text-xs text-text-muted mt-2">
                    Documento auditable que acredita el cumplimiento del capítulo en el expediente municipal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Modo Cuadrícula Completa (Ver los 8 Capítulos simultáneamente) */}
          {viewMode === "grid" && (
            <div className="grid md:grid-cols-2 gap-6 animate-in fade-in-50 duration-200">
              {CHAPTERS_CATALOG.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.number}
                    className="rounded-2xl border border-border bg-surface p-6 shadow-sm hover:border-primary/40 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-primary">
                          Capítulo {cap.number}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {cap.badge}
                        </span>
                      </div>

                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-text-primary">
                            {cap.title}
                          </h4>
                          <p className="text-xs text-text-secondary">{cap.subtitle}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-text-secondary border-t border-border pt-3 mt-3">
                        <p>
                          <strong className="text-text-primary">Objetivo:</strong>{" "}
                          {cap.objective}
                        </p>
                        <p>
                          <strong className="text-text-primary">Entregable:</strong>{" "}
                          <span className="text-emerald-700 font-medium">{cap.deliverable}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedChapterNumber(cap.number);
                          setViewMode("focused");
                        }}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>Ver detalles completos</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {cap.actionRoute && (
                        <Link
                          href={cap.actionRoute}
                          className="text-xs font-bold text-primary hover:text-primary-hover"
                        >
                          Ir al módulo &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================================================================
            4. Acciones Rápidas del Capítulo 1
           ========================================================================= */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Pasos de Inicio
          </p>

          <h2 className="mt-1 text-xl font-bold text-text-primary">
            Actividades del Capítulo 1
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Link
              href={routes.chapter1.resources}
              className="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Paso 1
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-text-primary">
                    Consultar recursos y manual oficial
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Revisa las guías normativas, decretos y marco jurídico
                    relacionado con el Buen Gobierno y Gobernanza en Puebla.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
                    Ver recursos
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href={routes.chapter1.selfAssessment}
              className="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <ClipboardCheck className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Paso 2
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-text-primary">
                    Realizar autoevaluación inicial
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Identifica el nivel preliminar de cumplimiento de los
                    componentes de buen gobierno en el ayuntamiento.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
                    Iniciar autoevaluación
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}