"use client";

import {
  Building2,
  Bot,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { useMunicipalProgress } from "@/contexts/municipal-progress-context";
import { RecentActivityWidget } from "@/components/municipal/dashboard/recent-activity-widget";
import { QuickShortcutsWidget } from "@/components/municipal/dashboard/quick-shortcuts-widget";
import Link from "next/link";

type CurrentUserProps = {
  name: string;
  email?: string;
  role?: string;
  institution?: string;
  title?: string;
};

type MunicipalDashboardContentProps = {
  currentUser?: CurrentUserProps;
};

export function MunicipalDashboardContent({
  currentUser,
}: MunicipalDashboardContentProps) {
  const { currentStep, unlockedChapter, isChapterUnlocked } = useMunicipalProgress();

  const firstName = currentUser?.name
    ? currentUser.name.trim().split(" ")[0]
    : "Usuario";

  const municipalityName = currentUser?.institution || "Municipio en Acompañamiento";
  const areaOrTitle = currentUser?.title || "Enlace de Control y Evaluación";
  const responsibleName = currentUser?.name || "Servidor Público Asignado";

  const isDocente = currentUser?.role === "teacher";
  const isCoordinador = currentUser?.role === "coordinator";
  const isSupervisor = isDocente || isCoordinador;

  // Lógica del botón de último punto en el sistema:
  // Si es su primera vez en el sistema, no redirigirá a ningún lado.
  // Si está en capítulo 1, a capítulo uno; y si ya avanzó a cap 2 u otros, de acuerdo al nivel alcanzado.
  const isFirstTime = currentStep === "not-started" && unlockedChapter <= 1;
  const activeChapter = unlockedChapter >= 1 ? unlockedChapter : 1;
  const resumePath = `/capitulo-${activeChapter}`;

  return (
    <>
      <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Bienvenida dinámica */}
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8 lg:p-10">
            <div className="flex items-center justify-between gap-10">
              <div className="max-w-4xl">
                {isDocente && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 mb-3">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Panel de Docente Asesor</span>
                  </div>
                )}
                {isCoordinador && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800 mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Panel de Coordinación SABG–BUAP</span>
                  </div>
                )}

                <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl lg:text-4xl lg:text-text-primary">
                  ¡Hola, {firstName}!
                </h1>

                <p className="mt-4 max-w-4xl text-sm leading-6 text-text-secondary md:text-base md:leading-7 lg:text-lg">
                  {isSupervisor
                    ? "Bienvenido al panel institucional del Sistema de Acompañamiento del Buen Gobierno Municipal. Desde este espacio podrás consultar y descargar los 8 capítulos del Manual Rector en formato PDF, revisar el marco normativo y dar seguimiento metodológico a los ayuntamientos."
                    : "Bienvenido al Sistema de Acompañamiento del Buen Gobierno Municipal. Aquí podrás consultar el documento rector metodológico, evaluar las capacidades institucionales de tu demarcación e impulsar la transparencia y el control interno."}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {/* Supervisor (Docente / Coordinador) */}
                  {isSupervisor && (
                    <Link
                      href="/capitulo-1"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
                    >
                      <BookOpen className="h-4 w-4" />
                      Explorar Capítulos
                    </Link>
                  )}

                  {/* Usuario municipal que ya tiene avance previo */}
                  {!isSupervisor && !isFirstTime && (
                    <Link
                      href={resumePath}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Continuar en Capítulo {activeChapter}
                    </Link>
                  )}

                  {/* Primera vez en el sistema: iniciar en Capítulo 1 */}
                  {!isSupervisor && isFirstTime && (
                    <Link
                      href="/capitulo-1"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Comenzar en Capítulo 1
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>

          {!isSupervisor && (
            <section className="rounded-2xl border border-primary/20 bg-primary-light p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Tu progreso actual
                  </p>

                  <p className="mt-2 text-lg font-semibold text-text-primary">
                    {isFirstTime
                      ? "Aún no has iniciado el acompañamiento institucional"
                      : `Capítulo ${activeChapter} · En proceso`}
                  </p>
                </div>

                <Link
                  href={isFirstTime ? "/capitulo-1" : resumePath}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  {isFirstTime ? "Comenzar Capítulo 1" : "Continuar proceso"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          )}

          {/* Información del Municipio / Adscripción Dinámica */}
          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <header className="flex items-center gap-3 border-b border-border px-6 py-5 lg:px-8">
              <Building2 className="h-6 w-6 text-primary" />

              <h2 className="text-xl font-semibold text-primary">
                {isSupervisor ? "Adscripción Institucional" : "Tu adscripción y municipio"}
              </h2>
            </header>

            <div className="grid gap-6 px-6 py-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
              <MunicipalInformation
                label={isSupervisor ? "Institución / Unidad" : "Municipio o Institución"}
                value={municipalityName}
              />

              <MunicipalInformation
                label="Área o Cargo"
                value={areaOrTitle}
              />

              <MunicipalInformation
                label={isSupervisor ? "Docente / Coordinador" : "Servidor / Titular Responsable"}
                value={responsibleName}
              />
            </div>
          </section>

          {/* Pequeños dashboards al ancho de la pantalla: Actividades Recientes y Atajos Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentActivityWidget />
            <QuickShortcutsWidget />
          </div>
        </div>

        {/* Asistente */}
        <button
          type="button"
          aria-label="Abrir Asistente SABG-BUAP"
          className="fixed bottom-8 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-transform hover:scale-105 lg:right-8"
        >
          <Bot className="h-6 w-6" />
        </button>
      </main>
    </>
  );
}

type MunicipalInformationProps = {
  label: string;
  value: string;
};

function MunicipalInformation({
  label,
  value,
}: MunicipalInformationProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </p>

      <p className="mt-2 text-base font-medium text-text-primary">
        {value}
      </p>
    </div>
  );
}