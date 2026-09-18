"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  BriefcaseBusiness,
  FileText,
  ArrowRight,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  HelpCircle,
} from "lucide-react";

type TabMode = "overview" | "annexes" | "cases";

const CHAPTERS_ANNEXES = [
  {
    number: 1,
    title: "Fundamentos del Buen Gobierno y Gobernanza",
    description: "Marco conceptual, axiológico y normativo (CPEUM Art. 115, Constitución de Puebla y Ley Orgánica Municipal).",
    annexesDetail: "Anexo 1: Cédula de Autoevaluación de Buen Gobierno, listas de verificación y catálogo de 17 instrumentos legales.",
    pdfUrl: "/manual/capitulos/capitulo-1.pdf",
    moduleUrl: "/capitulo-1",
  },
  {
    number: 2,
    title: "Diagnóstico Institucional Municipal",
    description: "Evaluación objetiva de capacidades normativas, operativas, humanas y tecnológicas en áreas críticas.",
    annexesDetail: "Anexo 2: Cuestionario de diagnóstico situacional, matriz de hallazgos y semáforo de riesgos administrativos.",
    pdfUrl: "/manual/capitulos/capitulo-2.pdf",
    moduleUrl: "/capitulo-2",
  },
  {
    number: 3,
    title: "Planeación Estratégica Municipal",
    description: "Alineación del Plan Municipal de Desarrollo (PMD) con planes Estatal y Federal, metas y presupuesto por programas.",
    annexesDetail: "Anexo 3: Matriz de Indicadores para Resultados (MIR), árbol de problemas y Programa Operativo Anual (POA).",
    pdfUrl: "/manual/capitulos/capitulo-3.pdf",
    moduleUrl: "/capitulo-3",
  },
  {
    number: 4,
    title: "Control Interno y Gestión de Riesgos",
    description: "Mecanismos preventivos de control interno institucional y blindaje administrativo ante órganos fiscalizadores.",
    annexesDetail: "Anexo 4: Matriz de riesgos COSO municipal, mapa de calor de vulnerabilidades y Programa Anual de Control Interno.",
    pdfUrl: "/manual/capitulos/capitulo-4.pdf",
    moduleUrl: "/capitulo-4",
  },
  {
    number: 5,
    title: "Transparencia y Rendición de Cuentas",
    description: "Garantía del derecho de acceso a la información, gobierno abierto y cumplimiento de obligaciones de transparencia activa.",
    annexesDetail: "Anexo 5: Guía para versiones públicas, catálogo de obligaciones de la Ley de Transparencia y protocolos de respuesta.",
    pdfUrl: "/manual/capitulos/capitulo-5.pdf",
    moduleUrl: "/capitulo-5",
  },
  {
    number: 6,
    title: "Integridad y Ética Pública",
    description: "Cultura organizacional basada en valores, combate a la corrupción y prevención de conflictos de interés.",
    annexesDetail: "Anexo 6: Modelo de Código de Ética y Conducta, lineamientos del Comité de Ética y formato de conflicto de interés.",
    pdfUrl: "/manual/capitulos/capitulo-6.pdf",
    moduleUrl: "/capitulo-6",
  },
  {
    number: 7,
    title: "Participación Ciudadana y Gobernanza",
    description: "Corresponsabilidad vecinal, cabildo abierto, presupuestos participativos y contraloría social en obras públicas.",
    annexesDetail: "Anexo 7: Acta constitutiva de Comités de Contraloría Social, formato de supervisión en obra y canales de denuncia.",
    pdfUrl: "/manual/capitulos/capitulo-7.pdf",
    moduleUrl: "/capitulo-7",
  },
  {
    number: 8,
    title: "Implementación y Seguimiento",
    description: "Articulación de tableros de control de mando, monitoreo físico-financiero y memoria de gestión para entrega-recepción.",
    annexesDetail: "Anexo 8: Fichas técnicas de evaluación trimestral de metas, semáforos de cumplimiento y plantilla de Informe de Gobierno.",
    pdfUrl: "/manual/capitulos/capitulo-8.pdf",
    moduleUrl: "/capitulo-8",
  },
];

const PRACTICAL_CASES = [
  {
    number: 1,
    chapter: "Capítulo 1: Fundamentos",
    title: "Opacidad y quejas ciudadanas por falta de información",
    situation:
      "Un municipio presenta quejas constantes de la ciudadanía por falta de información sobre el uso de los recursos públicos. No se publican informes y las solicitudes ciudadanas no reciben respuesta oportuna.",
    application:
      "Publicación periódica de estados financieros conforme a la transparencia proactiva, atención oportuna al artículo 6° constitucional y habilitación de canales de participación social.",
    expectedResult:
      "Mayor confianza ciudadana en las instituciones municipales, reducción de quejas y fortalecimiento del vínculo entre gobierno y sociedad como base del buen gobierno.",
    didacticFeedback:
      "Este caso ilustra por qué la legalidad y la transparencia no son trámites burocráticos, sino el pilar de legitimidad del ayuntamiento. En la plataforma, completar la Autoevaluación del Capítulo 1 te ayuda a identificar a tiempo vacíos informativos en tu administración.",
    pdfUrl: "/manual/casos-practicos/caso-practico-1.pdf",
  },
  {
    number: 2,
    chapter: "Capítulo 2: Diagnóstico",
    title: "Duplicidad de funciones y desorganización interna",
    situation:
      "El ayuntamiento opera con procesos duplicados entre dependencias, demoras en trámites y falta de perfiles de puesto claros, lo que genera cuellos de botella en la atención comunitaria.",
    application:
      "Aplicación de la Cédula de Diagnóstico Institucional en 4 dimensiones (Planeación, Organización, Operación y Control) para mapear áreas críticas.",
    expectedResult:
      "Mapa claro de debilidades y capacidades institucionales con matriz de hallazgos priorizada.",
    didacticFeedback:
      "No se puede resolver lo que no se mide. El Diagnóstico Municipal del Capítulo 2 te permite focalizar los escasos recursos presupuestales en las áreas que realmente lo necesitan.",
    pdfUrl: "/manual/casos-practicos/caso-practico-2.pdf",
  },
  {
    number: 3,
    chapter: "Capítulo 3: Planeación",
    title: "Retrasos en servicios públicos por falta de metas claras",
    situation:
      "El municipio detecta retrasos recurrentes en la atención de alumbrado, pozos de agua y caminos debido a que las acciones se improvisan sin un Plan Municipal de Desarrollo estructurado.",
    application:
      "Conversión del PMD en herramienta de gestión con roles claros (Presidente, Tesorero, Contralor) y formulación de Programas Operativos Anuales (POA) con indicadores cuantificables.",
    expectedResult:
      "Mejora sustancial en tiempos de respuesta, eficiencia operativa y asignación presupuestal justificada.",
    didacticFeedback:
      "La planeación estratégica vincula el dinero público con resultados palpables para la ciudadanía. La plataforma te guiará paso a paso para definir indicadores medibles y alcanzables.",
    pdfUrl: "/manual/casos-practicos/caso-practico-3.pdf",
  },
  {
    number: 4,
    chapter: "Capítulo 4: Control Interno",
    title: "Errores recurrentes en el manejo de recursos financieros",
    situation:
      "Se detectan inconsistencias contables y riesgos de observaciones por parte de la Auditoría Superior del Estado (ASE) debido a la ausencia de controles internos y supervisión periódica.",
    application:
      "Identificación de riesgos institucionales, implementación de controles preventivos y adopción del modelo de control interno municipal COSO.",
    expectedResult:
      "Reducción drástica de observaciones administrativas y blindaje del patrimonio municipal.",
    didacticFeedback:
      "El control interno preventivo cuesta una fracción de lo que cuesta solventar un pliego de observaciones o sanciones resarcitorias. En este capítulo aprenderás a levantar mapas de riesgos eficaces.",
    pdfUrl: "/manual/casos-practicos/caso-practico-4.pdf",
  },
  {
    number: 5,
    chapter: "Capítulo 5: Transparencia",
    title: "Observaciones por portales oficiales desactualizados",
    situation:
      "El municipio es apercibido por el órgano garante de transparencia (ITAIPUE) debido a información incompleta, contratos sin versiones públicas y desatención a solicitudes de información.",
    application:
      "Revisión y actualización inmediata de las obligaciones de transparencia activa, protocolos de protección de datos personales y verificación periódica del portal institucional.",
    expectedResult:
      "Cumplimiento normativo al 100% en evaluaciones oficiales y consolidación de un gobierno abierto.",
    didacticFeedback:
      "Cumplir con la transparencia activa evita sanciones individuales a las y los funcionarios y protege la credibilidad de la administración.",
    pdfUrl: "/manual/casos-practicos/caso-practico-5.pdf",
  },
  {
    number: 6,
    chapter: "Capítulo 6: Integridad",
    title: "Conflicto de interés en asignación de obra pública",
    situation:
      "Un servidor público de obras interviene en la adjudicación de una pavimentación donde concursa una empresa vinculada a un familiar, sin haber presentado declaración previa de conflicto de interés.",
    application:
      "Actualización del Código de Ética y Conducta, capacitación obligatoria en responsabilidades administrativas, adopción de formatos de declaración de conflicto de interés y buzón de denuncia anónimo.",
    expectedResult:
      "Blindaje ético en contrataciones públicas y prevención de faltas administrativas graves.",
    didacticFeedback:
      "La integridad es el mecanismo anticorrupción más económico y duradero. La plataforma te ofrece los formatos oficiales listos para implementar en tu ayuntamiento.",
    pdfUrl: "/manual/casos-practicos/caso-practico-6.pdf",
  },
  {
    number: 7,
    chapter: "Capítulo 7: Participación",
    title: "Obra de pavimentación sin contraloría social ni comunicación",
    situation:
      "Se ejecuta una obra con recursos municipales sin informar a las y los vecinos, lo que provoca inconformidades vecinales, sospechas de mala calidad y falta de apropiación de la obra.",
    application:
      "Asambleas informativas, convocatoria pública, conformación y capacitación formal del Comité de Contraloría Social con vecinas y vecinos beneficiarios.",
    expectedResult:
      "Legitimidad institucional, corresponsabilidad ciudadana y supervisión transparente de la calidad de la obra.",
    didacticFeedback:
      "La ciudadanía informada se convierte en aliada de la obra pública. Este capítulo te provee los formatos de acta de asamblea y cédulas de supervisión comunitaria.",
    pdfUrl: "/manual/casos-practicos/caso-practico-7.pdf",
  },
  {
    number: 8,
    chapter: "Capítulo 8: Seguimiento",
    title: "Acciones gubernamentales ejecutadas sin medición de impacto",
    situation:
      "El ayuntamiento realiza actividades pero carece de un sistema de seguimiento físico-financiero, lo que impide demostrar resultados reales en los informes de gobierno y dificulta la entrega-recepción.",
    application:
      "Definición de semáforos de avance por dependencia, tableros de control trimestrales y consolidación de la memoria institucional.",
    expectedResult:
      "Toma de decisiones oportuna, informes de gobierno verídicos y entrega-recepción ordenada y transparente.",
    didacticFeedback:
      "El seguimiento continuo te permite corregir desviaciones a tiempo y no esperar hasta el final del trienio para descubrir metas incumplidas.",
    pdfUrl: "/manual/casos-practicos/caso-practico-8.pdf",
  },
];

export function ResourcesContent() {
  const [activeTab, setActiveTab] = useState<TabMode>("overview");

  return (
    <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Encabezado */}
        <section>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            SABG–BUAP &bull; Repositorio Metodológico
          </p>
          <h1 className="mt-1 text-2xl font-black text-text-primary md:text-3xl lg:text-4xl">
            Biblioteca de Recursos Institucionales
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">
            Accede al documento rector completo, a los anexos e instrumentos divididos por capítulo,
            y a los 8 casos prácticos con retroalimentación didáctica para fortalecer la gestión municipal.
          </p>

          {/* Navegación por Pestañas */}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-border pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "overview"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface text-text-secondary hover:text-text-primary border border-border"
              }`}
            >
              Vista General
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("annexes")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "annexes"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface text-text-secondary hover:text-text-primary border border-border"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Anexos (8 Capítulos)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("cases")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "cases"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface text-text-secondary hover:text-text-primary border border-border"
              }`}
            >
              <BriefcaseBusiness className="w-3.5 h-3.5" />
              <span>Casos Prácticos (8 PDFs)</span>
            </button>
          </div>
        </section>

        {/* =========================================================================
            PESTAÑA 1: VISTA GENERAL
           ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            {/* Banner Destacado: Guía Práctica Completa */}
            <section className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-primary/5 p-6 md:p-8 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-bold text-primary mb-3">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Documento Rector Completo</span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-black text-text-primary">
                    Manual para el Buen Gobierno y Gobernanza Municipal (VF)
                  </h2>

                  <p className="mt-2 text-xs md:text-sm text-text-secondary leading-relaxed">
                    Edición institucional completa formalizada entre la Benemérita Universidad
                    Autónoma de Puebla y el Gobierno del Estado de Puebla. Contiene el marco teórico,
                    metodológico, los 8 capítulos íntegros, instrumentos y anexos normativos.
                  </p>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                  <a
                    href="/manual/Manual_BuenGobiernoyGobernanza_vf.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Consultar Guía Práctica (PDF)</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </div>
              </div>
            </section>

            {/* Accesos a las Secciones de Anexos y Casos Prácticos */}
            <section className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between hover:border-primary/40 transition">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary mb-4">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">Anexos Metodológicos</h3>
                  <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                    Catálogo dividido en 8 fragmentos que corresponden a cada uno de los capítulos del
                    Manual. Incluye cédulas de autoevaluación, matrices de riesgos, códigos de ética y formatos oficiales.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setActiveTab("annexes")}
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                  >
                    <span>Explorar los 8 fragmentos de anexos</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between hover:border-primary/40 transition">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary mb-4">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">Casos Prácticos con Retroalimentación</h3>
                  <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                    Los 8 casos prácticos extraídos de la última página de cada capítulo PDF, complementados
                    con análisis didáctico formativo para guiar tu avance continuo en la plataforma.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setActiveTab("cases")}
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                  >
                    <span>Ver los 8 casos prácticos y descargar PDFs</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            PESTAÑA 2: ANEXOS (DIVIDIDO EN 8 FRAGMENTOS)
           ========================================================================= */}
        {activeTab === "annexes" && (
          <section className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-soft p-4 rounded-xl border border-border">
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  Catálogo de Anexos e Instrumentos por Capítulo
                </h2>
                <p className="text-xs text-text-secondary">
                  8 fragmentos temáticos estructurados con su enlace de descarga y módulo correspondiente
                </p>
              </div>
              <a
                href="/manual/Manual_BuenGobiernoyGobernanza_vf.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <span>Descargar Manual Completo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {CHAPTERS_ANNEXES.map((item) => (
                <article
                  key={item.number}
                  className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        Fragmento {item.number} &bull; Cap. {item.number}
                      </span>
                      <span className="text-[10px] text-text-muted font-mono">PDF Oficial</span>
                    </div>

                    <h3 className="text-sm font-bold text-text-primary leading-snug">
                      {item.title}
                    </h3>

                    <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-3 p-3 rounded-xl bg-surface-soft border border-border text-xs">
                      <span className="font-bold text-primary block mb-0.5">Herramientas y Anexos:</span>
                      <p className="text-text-secondary text-[11px] leading-relaxed">
                        {item.annexesDetail}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Ver Capítulo (PDF)</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>

                    <Link
                      href={item.moduleUrl}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-primary transition"
                    >
                      <span>Ir al Módulo</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            PESTAÑA 3: CASOS PRÁCTICOS (8 PDFs Y ANÁLISIS DIDÁCTICO)
           ========================================================================= */}
        {activeTab === "cases" && (
          <section className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="bg-primary-light p-4 rounded-xl border border-primary/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-text-secondary leading-relaxed">
                <strong className="text-text-primary block font-bold mb-0.5">
                  Casos Prácticos Oficiales (Última página de cada capítulo)
                </strong>
                Cada caso cuenta con su archivo <strong>PDF individual de 1 página</strong> listo para
                descargar y su correspondiente <strong>retroalimentación didáctica</strong> desarrollada por
                el equipo académico de la BUAP para ayudarte a aplicar las herramientas en tu municipio.
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {PRACTICAL_CASES.map((c) => (
                <article
                  key={c.number}
                  className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                        Caso Práctico {c.number}
                      </span>
                      <span className="text-[10px] text-text-muted font-medium">
                        {c.chapter}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-text-primary leading-snug mb-3">
                      {c.title}
                    </h3>

                    <div className="space-y-2 text-xs">
                      {/* Situación */}
                      <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60">
                        <span className="font-bold text-rose-800 dark:text-rose-300 block text-[11px]">Situación o Problema:</span>
                        <p className="text-rose-950 dark:text-rose-200 text-[11px] mt-0.5 leading-relaxed">
                          {c.situation}
                        </p>
                      </div>

                      {/* Aplicación */}
                      <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60">
                        <span className="font-bold text-primary block text-[11px]">Acciones del Buen Gobierno:</span>
                        <p className="text-slate-800 dark:text-slate-200 text-[11px] mt-0.5 leading-relaxed">
                          {c.application}
                        </p>
                      </div>

                      {/* Resultado Esperado */}
                      <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-[11px]">Resultado Esperado:</span>
                        <p className="text-emerald-950 dark:text-emerald-200 text-[11px] mt-0.5 leading-relaxed">
                          {c.expectedResult}
                        </p>
                      </div>

                      {/* Retroalimentación Didáctica BUAP */}
                      <div className="p-3 rounded-xl bg-surface-soft border border-border text-xs">
                        <div className="flex items-center gap-1.5 text-primary font-bold text-[11px] mb-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Retroalimentación Didáctica SABG–BUAP:</span>
                        </div>
                        <p className="text-text-secondary text-[11px] leading-relaxed">
                          {c.didacticFeedback}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Descarga del PDF individual del caso */}
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] text-text-muted">Hoja ejecutiva individual (1 pág.):</span>
                    <a
                      href={c.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar PDF</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}