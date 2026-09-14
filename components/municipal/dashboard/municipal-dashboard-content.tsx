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
import { StartDiagnosisButton } from "@/components/municipal/dashboard/start-diagnosis-button";
import Link from "next/link";
import { routes } from "@/config/routes";

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
  const { currentStep } = useMunicipalProgress();

  const firstName = currentUser?.name
    ? currentUser.name.trim().split(" ")[0]
    : "Usuario";

  const municipalityName = currentUser?.institution || "Municipio en Acompañamiento";
  const areaOrTitle = currentUser?.title || "Enlace de Control y Evaluación";
  const responsibleName = currentUser?.name || "Servidor Público Asignado";

  return (
    <>
      <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Bienvenida dinámica */}
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8 lg:p-10">
            <div className="flex items-center justify-between gap-10">
              <div className="max-w-4xl">
                <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl lg:text-4xl lg:text-text-primary">
                  ¡Hola, {firstName}!
                </h1>

                <p className="mt-4 max-w-4xl text-sm leading-6 text-text-secondary md:text-base md:leading-7 lg:text-lg">
                  Bienvenido al Sistema de Acompañamiento del Buen Gobierno Municipal.
                  Aquí podrás consultar el documento rector metodológico, evaluar
                  las capacidades institucionales de tu demarcación e impulsar
                  la transparencia y el control interno.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <Link
                    href={routes.chapter1.home}
                    className="flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-primary hover:text-primary"
                  >
                    <BookOpen className="h-4 w-4" />
                    Documento Rector (8 Capítulos)
                  </Link>

                  <StartDiagnosisButton />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-primary/20 bg-primary-light p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Tu progreso actual
                </p>

                <p className="mt-2 text-lg font-semibold text-text-primary">
                  {currentStep === "not-started"
                    ? "Aún no has iniciado el diagnóstico"
                    : "Capítulo 2 · Diagnóstico municipal"}
                </p>
              </div>

              {currentStep !== "not-started" && (
                <Link
                  href={routes.chapter2.home}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  Continuar proceso
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </section>

          {/* Información del Municipio / Adscripción Dinámica */}
          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <header className="flex items-center gap-3 border-b border-border px-6 py-5 lg:px-8">
              <Building2 className="h-6 w-6 text-primary" />

              <h2 className="text-xl font-semibold text-primary">
                Tu adscripción y municipio
              </h2>
            </header>

            <div className="grid gap-6 px-6 py-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
              <MunicipalInformation
                label="Municipio o Institución"
                value={municipalityName}
              />

              <MunicipalInformation
                label="Área o Cargo"
                value={areaOrTitle}
              />

              <MunicipalInformation
                label="Servidor / Titular Responsable"
                value={responsibleName}
              />
            </div>
          </section>
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