"use client";

import { Sun, Moon, Check, CheckCircle2, Settings2 } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

export default function AdminPreferencesPage() {
  const { theme, setTheme } = useTheme();

  return (
    <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8 transition-colors duration-200">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3 text-primary mb-2">
            <Settings2 className="h-6 w-6" />
            <p className="text-xs font-bold uppercase tracking-wider">Panel Administrativo</p>
          </div>
          <h1 className="text-2xl font-black text-text-primary md:text-3xl">
            Preferencias del Administrador
          </h1>
          <p className="mt-2 text-xs md:text-sm leading-relaxed text-text-secondary">
            Personaliza el tema visual para tu cuenta administrativa. El cambio se guarda automáticamente en tu perfil.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Tema y Apariencia Visual</span>
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Elige el estilo visual para el panel de administración
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Guardado en tu perfil</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Modo Claro */}
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-5 rounded-2xl border-2 text-left transition relative flex flex-col justify-between ${
                theme === "light"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                  : "border-border bg-surface hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                      <Sun className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-text-primary">
                      Modo Claro Institucional
                    </span>
                  </div>
                  {theme === "light" && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  Fondo claro suave y azul institucional BUAP, ideal para gestión administrativa.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                {theme === "light" ? "✓ Tema activo" : "Activar modo claro"}
              </div>
            </button>

            {/* Modo Oscuro */}
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-5 rounded-2xl border-2 text-left transition relative flex flex-col justify-between ${
                theme === "dark"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                  : "border-border bg-surface hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-900/60 text-indigo-300">
                      <Moon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-text-primary">
                      Modo Oscuro (Nocturno)
                    </span>
                  </div>
                  {theme === "dark" && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  Tonalidades oscuras que reducen el brillo para revisión técnica y auditoría.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                {theme === "dark" ? "✓ Tema activo" : "Activar modo oscuro"}
              </div>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
