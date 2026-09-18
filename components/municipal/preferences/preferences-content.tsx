"use client";

import { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  Bookmark,
  CheckCircle2,
  Sparkles,
  Layers,
  Settings2,
  Save,
  Check,
  BookOpen,
  ClipboardCheck,
  Scale,
  Building2,
  FileCheck2,
  Briefcase,
  FileText,
  Shield,
  HelpCircle,
  Bell,
} from "lucide-react";

import { useTheme } from "@/contexts/theme-context";
import {
  AVAILABLE_SHORTCUTS,
  DEFAULT_SHORTCUTS,
  type ShortcutItem,
} from "@/config/shortcuts";

export function PreferencesContent() {
  const { theme, setTheme } = useTheme();

  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(DEFAULT_SHORTCUTS);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    DEFAULT_SHORTCUTS.map((s) => s.id)
  );
  const [isSavingShortcuts, setIsSavingShortcuts] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Cargar preferencias del usuario desde la base de datos
  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await fetch("/api/user/preferences");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.shortcuts) && data.shortcuts.length > 0) {
            setShortcuts(data.shortcuts.slice(0, 3));
            setSelectedIds(data.shortcuts.slice(0, 3).map((s: any) => s.id));
          }
        }
      } catch (err) {
        console.warn("No se pudieron cargar preferencias del servidor:", err);
      }
    }
    loadPreferences();
  }, []);

  function toggleShortcutSelection(id: string) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 3) {
        alert("Solo puedes seleccionar un máximo de 3 atajos rápidos para el dashboard.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  }

  async function handleSaveShortcuts() {
    setIsSavingShortcuts(true);
    const newShortcuts = AVAILABLE_SHORTCUTS.filter((s) =>
      selectedIds.includes(s.id)
    ).slice(0, 3);

    try {
      const res = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortcuts: newShortcuts }),
      });

      if (res.ok) {
        setShortcuts(newShortcuts);
        setSaveSuccessMsg(true);
        setTimeout(() => setSaveSuccessMsg(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setShortcuts(newShortcuts);
    } finally {
      setIsSavingShortcuts(false);
    }
  }

  function renderIcon(iconName: ShortcutItem["iconName"]) {
    switch (iconName) {
      case "book":
        return <BookOpen className="h-4 w-4 text-primary" />;
      case "clipboard":
        return <ClipboardCheck className="h-4 w-4 text-emerald-600" />;
      case "scale":
        return <Scale className="h-4 w-4 text-amber-600" />;
      case "building":
        return <Building2 className="h-4 w-4 text-blue-600" />;
      case "filecheck":
        return <FileCheck2 className="h-4 w-4 text-teal-600" />;
      case "layers":
        return <Layers className="h-4 w-4 text-purple-600" />;
      case "briefcase":
        return <Briefcase className="h-4 w-4 text-indigo-600" />;
      case "file":
        return <FileText className="h-4 w-4 text-rose-600" />;
      case "shield":
        return <Shield className="h-4 w-4 text-sky-600" />;
      default:
        return <HelpCircle className="h-4 w-4 text-primary" />;
    }
  }

  return (
    <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8 transition-colors duration-200">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Encabezado */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-bold text-primary mb-2">
            <Settings2 className="w-3.5 h-3.5" />
            <span>Configuración de Usuario</span>
          </div>

          <h1 className="text-2xl font-black text-text-primary md:text-3xl">
            Preferencias del Sistema
          </h1>

          <p className="mt-2 text-xs md:text-sm leading-relaxed text-text-secondary max-w-2xl">
            Personaliza la apariencia visual de la plataforma y administra tus módulos favoritos para el
            dashboard. Estos ajustes se guardan exclusivamente en tu perfil de usuario y persisten
            automáticamente en cada inicio de sesión.
          </p>
        </section>

        {/* =========================================================================
            FUNCIÓN 1: TEMA O ESTILO DE LA PÁGINA (CLARO Y OSCURO)
           ========================================================================= */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Función 1 · Tema y Apariencia Visual</span>
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Elige entre el tema claro institucional y el tema oscuro de descanso visual
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Guardado en tu perfil</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Opción 1: Modo Claro */}
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

                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  Diseño estándar con fondo blanco suave, azul institucional BUAP y alto contraste
                  óptimo para entornos iluminados de oficina y gestión gubernamental.
                </p>

                {/* Previsualización miniatura del tema claro */}
                <div className="rounded-xl border border-slate-200 bg-[#f5f7fa] p-3 space-y-2 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-16 rounded bg-[#315aa6]" />
                    <div className="h-2 w-8 rounded bg-slate-300" />
                  </div>
                  <div className="h-10 rounded-lg bg-white border border-slate-200 p-2 space-y-1">
                    <div className="h-2 w-3/4 rounded bg-slate-400" />
                    <div className="h-1.5 w-1/2 rounded bg-slate-200" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                {theme === "light" ? "✓ Tema actualmente activo" : "Hacer clic para activar modo claro"}
              </div>
            </button>

            {/* Opción 2: Modo Oscuro */}
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

                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  Paleta visual profunda de grafito y zafiro que reduce la fatiga visual en sesiones prolongadas
                  y ambientes con poca iluminación.
                </p>

                {/* Previsualización miniatura del tema oscuro */}
                <div className="rounded-xl border border-slate-700 bg-[#0b1320] p-3 space-y-2 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-16 rounded bg-[#4f85e2]" />
                    <div className="h-2 w-8 rounded bg-slate-600" />
                  </div>
                  <div className="h-10 rounded-lg bg-[#121d2d] border border-slate-700 p-2 space-y-1">
                    <div className="h-2 w-3/4 rounded bg-slate-200" />
                    <div className="h-1.5 w-1/2 rounded bg-slate-500" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                {theme === "dark" ? "✓ Tema actualmente activo" : "Hacer clic para activar modo oscuro"}
              </div>
            </button>
          </div>
        </section>

        {/* =========================================================================
            FUNCIÓN 2: GESTIÓN DE ATAJOS RÁPIDOS DEL DASHBOARD
           ========================================================================= */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-primary" />
                <span>Función 2 · Configuración de Atajos Rápidos en Dashboard</span>
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Selecciona hasta 3 accesos directos que se mostrarán en tu panel principal
              </p>
            </div>

            <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0">
              {selectedIds.length} de 3 seleccionados
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AVAILABLE_SHORTCUTS.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleShortcutSelection(item.id)}
                  className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border bg-surface hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`rounded-lg p-2 shrink-0 ${
                      isSelected ? "bg-primary text-white" : "bg-surface-soft border border-border"
                    }`}
                  >
                    {renderIcon(item.iconName)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-text-primary truncate">
                        {item.label}
                      </p>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : "border-border bg-background"
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-snug mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-text-muted">
              {saveSuccessMsg ? (
                <span className="font-bold text-emerald-600 inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Atajos actualizados exitosamente en tu perfil
                </span>
              ) : (
                "Los atajos elegidos aparecerán en el widget de tu dashboard."
              )}
            </span>

            <button
              type="button"
              disabled={isSavingShortcuts || selectedIds.length === 0}
              onClick={handleSaveShortcuts}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSavingShortcuts ? "Guardando..." : "Guardar Atajos en Perfil"}</span>
            </button>
          </div>
        </section>

        {/* =========================================================================
            FUNCIÓN 3: NOTIFICACIONES INSTITUCIONALES
           ========================================================================= */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Notificaciones y Avisos de la Asesoría BUAP
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Recibir alertas por correo sobre revisiones metodológicas y validaciones de evidencias
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </section>
      </div>
    </main>
  );
}
