"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Users,
  Landmark,
  Compass,
  FileText,
  FileCheck,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  ClipboardCheck,
  Award,
  Layers,
  HelpCircle,
  Briefcase,
} from "lucide-react";

import { routes } from "@/config/routes";

export function ChapterOverview() {
  // Estado para controlar los acordeones informativos desplegables
  const [openSection, setOpenSection] = useState<string | null>("componentes");

  function toggleSection(id: string) {
    setOpenSection((prev) => (prev === id ? null : id));
  }

  return (
    <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* =========================================================================
            1. Encabezado Oficial del Capítulo 1
           ========================================================================= */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-bold text-primary mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Documento Rector Metodológico SABG–BUAP</span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-text-primary md:text-3xl lg:text-4xl">
                Capítulo 1: Fundamentos del Buen Gobierno y la Gobernanza Municipal
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
                Este capítulo abre la guía rectora. Antes de aplicar cualquier diagnóstico o instrumento
                operativo, el ayuntamiento debe reconocer los principios básicos que orientan el buen
                gobierno: <strong>legalidad, transparencia, rendición de cuentas, eficiencia y participación ciudadana</strong>.
              </p>

              {/* Botones de acción rápida en el Hero */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="/manual/capitulos/capitulo-1.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition"
                >
                  <FileText className="h-4 w-4" />
                  <span>Ver PDF Oficial del Capítulo 1</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>

                <Link
                  href={routes.chapter1.selfAssessment}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/5 px-5 py-2.5 text-xs font-bold text-primary hover:bg-primary/10 transition"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  <span>Autoevaluación (Pág. 7)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href={routes.chapter1.resources}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-surface-soft transition"
                >
                  <Layers className="h-4 w-4" />
                  <span>Biblioteca y Normatividad</span>
                </Link>
              </div>
            </div>

            {/* Ficha ejecutiva lateral */}
            <div className="rounded-xl border border-primary/20 bg-primary-light p-5 lg:w-72 shrink-0">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Ficha Técnica del Capítulo
              </p>

              <div className="mt-3 space-y-2.5 text-xs text-text-primary">
                <div>
                  <span className="block text-[11px] font-bold text-text-muted uppercase">Producto Esperado</span>
                  <p className="font-semibold text-text-primary">Marco conceptual adoptado para servidores públicos municipales</p>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-text-muted uppercase">Siguiente Conexión</span>
                  <p className="font-semibold text-text-primary">Capítulo 2: Diagnóstico Institucional Municipal</p>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-text-muted uppercase">Responsables</span>
                  <p className="font-medium text-text-secondary">Presidente Municipal, Síndico, Cabildo</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. Módulos Temáticos Desplegables (Organización limpia sin ruido visual)
           ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                Contenido Metodológico Sintetizado
              </p>
              <h2 className="text-xl font-bold text-text-primary">
                Estructura del Capítulo 1
              </h2>
            </div>
            <p className="text-xs text-text-secondary">
              Haz clic en cada sección para desplegar u ocultar los detalles
            </p>
          </div>

          <div className="space-y-3">
            {/* Acordeón 1: Concepto y Componentes del Buen Gobierno */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection("componentes")}
                className="w-full flex items-center justify-between p-5 text-left transition hover:bg-surface-soft/60"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      1.1 y 1.2 · Concepto y 5 Componentes del Buen Gobierno
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Prácticas y principios axiológicos que sustentan la administración municipal
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
                    openSection === "componentes" ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {openSection === "componentes" && (
                <div className="px-5 pb-5 pt-2 border-t border-border bg-surface-soft/40 animate-in fade-in-50 duration-150">
                  <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                    El buen gobierno es el conjunto de prácticas y principios que orientan la actuación
                    institucional hacia el bienestar colectivo, estructurado en 5 componentes fundamentales:
                  </p>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <span className="text-xs font-bold text-primary block mb-1">1. Transparencia y rendición</span>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Apertura informativa, portales accesibles y responsabilidad en el uso del patrimonio público.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <span className="text-xs font-bold text-primary block mb-1">2. Atención a demandas sociales</span>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Orientación hacia las necesidades colectivas prioritarias y grupos vulnerables.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <span className="text-xs font-bold text-primary block mb-1">3. Participación social</span>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Mecanismos permanentes de consulta, cabildo abierto y colaboración ciudadana.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <span className="text-xs font-bold text-primary block mb-1">4. Instituciones eficaces</span>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Capacidad de gestión para obtener resultados tangibles y servicios públicos de calidad.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface sm:col-span-2 lg:col-span-2">
                      <span className="text-xs font-bold text-primary block mb-1">5. Servidores públicos íntegros</span>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Personal capacitado, profesionalizado y estrictamente apegado a la ética pública y combate al conflicto de interés.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Acordeón 2: Marco Jurídico Municipal */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection("juridico")}
                className="w-full flex items-center justify-between p-5 text-left transition hover:bg-surface-soft/60"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      1.2.1 · Marco Jurídico Municipal del Buen Gobierno
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Fundamentación constitucional federal, estatal y leyes orgánicas
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
                    openSection === "juridico" ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {openSection === "juridico" && (
                <div className="px-5 pb-5 pt-2 border-t border-border bg-surface-soft/40 animate-in fade-in-50 duration-150">
                  <div className="grid md:grid-cols-3 gap-3.5 mb-3">
                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <span className="text-xs font-bold text-primary block mb-1">
                        Constitución Federal (CPEUM)
                      </span>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        <strong>Art. 115:</strong> Base del municipio libre, hacienda, gobierno y servicios.<br />
                        <strong>Art. 2, 3, 21 y 73:</strong> Pueblos indígenas, educación y seguridad pública.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <span className="text-xs font-bold text-primary block mb-1">
                        Constitución de Puebla
                      </span>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        <strong>Art. 102 a 106:</strong> Regulan personalidad jurídica, patrimonio propio,
                        administración municipal centralizada y descentralizada.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <span className="text-xs font-bold text-primary block mb-1">
                        Ley Orgánica Municipal
                      </span>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Bases de integración del ayuntamiento, facultades de presidencia, sindicatura,
                        regidurías, tesorería, secretaría y bandos locales.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-text-muted">
                      La colección completa de 17 leyes y lineamientos está disponible para consulta y descarga.
                    </p>
                    <Link
                      href={routes.chapter1.resources}
                      className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Ver textos legales completos</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Acordeón 3: Gobernanza y 4 Dimensiones */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection("dimensiones")}
                className="w-full flex items-center justify-between p-5 text-left transition hover:bg-surface-soft/60"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      1.3 y 1.4 · Gobernanza Municipal y sus 4 Dimensiones
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Proceso multidimensional de articulación entre gobierno y ciudadanía
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
                    openSection === "dimensiones" ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {openSection === "dimensiones" && (
                <div className="px-5 pb-5 pt-2 border-t border-border bg-surface-soft/40 animate-in fade-in-50 duration-150">
                  <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                    La gobernanza no depende únicamente de la acción gubernamental, sino de 4 dimensiones que
                    interactúan de manera coordinada:
                  </p>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <span className="text-xs font-bold text-primary block mb-1">a) Institucional</span>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Crea las reglas, mecanismos y políticas que permiten la participación social.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <span className="text-xs font-bold text-primary block mb-1">b) Política</span>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Aporta voluntad política, liderazgo y capacidad de concertación con la sociedad.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <span className="text-xs font-bold text-primary block mb-1">c) Financiera</span>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Garantiza recursos económicos suficientes y administrados con probidad.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <span className="text-xs font-bold text-primary block mb-1">d) Administrativa</span>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Ejecuta y coordina los canales formales de atención dentro del marco legal.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Acordeón 4: Responsables Institucionales */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection("responsables")}
                className="w-full flex items-center justify-between p-5 text-left transition hover:bg-surface-soft/60"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      1.6 · Responsables Institucionales en el Ayuntamiento
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Distribución de competencias en Cabildo, Presidencia y Sindicatura
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
                    openSection === "responsables" ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {openSection === "responsables" && (
                <div className="px-5 pb-5 pt-2 border-t border-border bg-surface-soft/40 animate-in fade-in-50 duration-150">
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <h4 className="text-xs font-bold text-text-primary mb-1">Presidente Municipal</h4>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Liderazgo institucional, ejecución de acuerdos de cabildo y representación del ayuntamiento en la adopción del buen gobierno.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <h4 className="text-xs font-bold text-text-primary mb-1">Síndico Municipal</h4>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Defensa legal de los intereses municipales, vigilancia de la hacienda y observancia del marco normativo aplicable.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <h4 className="text-xs font-bold text-text-primary mb-1">Cabildo</h4>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Órgano colegiado de deliberación, expedición de reglamentos y validación de políticas públicas y programas municipales.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Acordeón 5: Caso Práctico 1 */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection("casopractico")}
                className="w-full flex items-center justify-between p-5 text-left transition hover:bg-surface-soft/60"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      Caso Práctico Básico 1.1 · Opacidad y Quejas Ciudadanas
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Ejemplo didáctico formalizado en la página 9 del Manual Rector
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
                    openSection === "casopractico" ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {openSection === "casopractico" && (
                <div className="px-5 pb-5 pt-2 border-t border-border bg-surface-soft/40 animate-in fade-in-50 duration-150">
                  <div className="space-y-3 text-xs text-text-secondary">
                    <div className="bg-surface p-3.5 rounded-xl border border-border">
                      <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1">Situación:</span>
                      <p>
                        Un municipio presenta quejas constantes de la ciudadanía por falta de información sobre
                        el uso de recursos públicos. No se publican informes y las solicitudes ciudadanas no
                        reciben respuesta oportuna.
                      </p>
                    </div>

                    <div className="bg-surface p-3.5 rounded-xl border border-border">
                      <span className="font-bold text-primary block mb-1">Aplicación del Buen Gobierno:</span>
                      <p>
                        Publicación periódica de estados financieros conforme a la transparencia proactiva,
                        atención inmediata al artículo 6° constitucional y habilitación de canales de participación social.
                      </p>
                    </div>

                    <div className="bg-surface p-3.5 rounded-xl border border-border">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Resultado Esperado:</span>
                      <p>
                        Recuperación de la confianza ciudadana, disminución de quejas y fortalecimiento del vínculo entre
                        gobierno y sociedad como base del buen gobierno.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] text-text-muted">Documento descargable en 1 sola página:</span>
                    <a
                      href="/manual/casos-practicos/caso-practico-1.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Descargar PDF del Caso Práctico 1</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. Acciones Clave para Concluir el Capítulo 1
           ========================================================================= */}
        <section className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Acreditación y Avance
          </p>
          <h2 className="text-xl font-bold text-text-primary">
            Pasos para completar el Capítulo 1
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Paso 1: Autoevaluación */}
            <Link
              href={routes.chapter1.selfAssessment}
              className="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    Paso Obligatorio
                  </span>
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                </div>

                <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition">
                  Responder Lista de Verificación (Pág. 7)
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  Evalúa los 6 reactivos oficiales del Manual Rector. Tus respuestas se almacenarán
                  en la base de datos institucional para generar tu historial de cumplimiento y
                  habilitar el avance hacia el Capítulo 2.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center gap-2 text-xs font-bold text-primary">
                <span>Comenzar autoevaluación oficial</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Paso 2: Recursos y Leyes */}
            <Link
              href={routes.chapter1.resources}
              className="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-surface-soft text-text-secondary text-xs font-bold">
                    Material de Apoyo
                  </span>
                  <BookOpen className="h-5 w-5 text-text-muted group-hover:text-primary transition" />
                </div>

                <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition">
                  Consultar Leyes, Códigos y Anexos
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  Accede al catálogo de los 17 instrumentos jurídicos completos (CPEUM, Constitución de Puebla,
                  Ley Orgánica Municipal, Ley de Transparencia, etc.) para fundamentar acuerdos de cabildo.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center gap-2 text-xs font-bold text-text-primary group-hover:text-primary transition">
                <span>Explorar biblioteca jurídica</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}