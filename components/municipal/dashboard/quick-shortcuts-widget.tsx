"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Bookmark,
  ExternalLink,
  BookOpen,
  ClipboardCheck,
  Scale,
  Building2,
  FileCheck2,
  Layers,
  Briefcase,
  FileText,
  Shield,
  HelpCircle,
  X,
  Check,
  Settings2,
} from "lucide-react";

import {
  AVAILABLE_SHORTCUTS,
  DEFAULT_SHORTCUTS,
  type ShortcutItem,
} from "@/config/shortcuts";

export function QuickShortcutsWidget() {
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(DEFAULT_SHORTCUTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Cargar atajos guardados de la API de preferencias
  useEffect(() => {
    async function loadShortcuts() {
      try {
        const res = await fetch("/api/user/preferences");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.shortcuts) && data.shortcuts.length > 0) {
            setShortcuts(data.shortcuts.slice(0, 3));
          }
        }
      } catch (err) {
        console.warn("No se pudieron cargar atajos del servidor:", err);
      }
    }
    loadShortcuts();
  }, []);

  function handleOpenModal() {
    setSelectedIds(shortcuts.map((s) => s.id));
    setIsModalOpen(true);
  }

  function toggleSelection(id: string) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 3) {
        alert("Solo puedes seleccionar un máximo de 3 atajos rápidos.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  }

  async function handleSaveShortcuts() {
    setIsSaving(true);
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
        setIsModalOpen(false);
      } else {
        throw new Error("Error al guardar");
      }
    } catch {
      // Fallback local
      setShortcuts(newShortcuts);
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
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
    <>
      <section className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary">
                <Bookmark className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary leading-tight">
                  Atajos Rápidos ({shortcuts.length}/3)
                </h2>
                <p className="text-[11px] text-text-secondary">
                  Acceso directo a tus módulos prioritarios
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 transition"
              aria-label="Personalizar atajos rápidos"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Personalizar</span>
            </button>
          </div>

          {/* Atajos en cuadrícula o lista */}
          <div className="mt-4 space-y-2.5">
            {shortcuts.map((s) => {
              if (s.isExternal) {
                return (
                  <a
                    key={s.id}
                    href={s.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-soft/40 transition hover:border-primary/40 hover:bg-surface-soft group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-lg p-2 bg-background border border-border shrink-0">
                        {renderIcon(s.iconName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-text-primary group-hover:text-primary transition truncate">
                          {s.label}
                        </p>
                        <p className="text-[11px] text-text-muted truncate">
                          {s.description}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-text-muted group-hover:text-primary shrink-0 ml-2" />
                  </a>
                );
              }

              return (
                <Link
                  key={s.id}
                  href={s.path}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-soft/40 transition hover:border-primary/40 hover:bg-surface-soft group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-lg p-2 bg-background border border-border shrink-0">
                      {renderIcon(s.iconName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary group-hover:text-primary transition truncate">
                        {s.label}
                      </p>
                      <p className="text-[11px] text-text-muted truncate">
                        {s.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-primary group-hover:underline shrink-0 ml-2">
                    Abrir &rarr;
                  </span>
                </Link>
              );
            })}

            {/* Espacios vacíos si tiene menos de 3 */}
            {Array.from({ length: Math.max(0, 3 - shortcuts.length) }).map((_, idx) => (
              <button
                key={`empty-${idx}`}
                type="button"
                onClick={handleOpenModal}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-border/80 bg-background/50 text-text-muted hover:border-primary hover:text-primary transition text-xs font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Añadir atajo rápido</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
          <span>Personalizado para tu perfil</span>
          <button
            type="button"
            onClick={handleOpenModal}
            className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <Settings2 className="h-3 w-3" />
            Editar atajos
          </button>
        </div>
      </section>

      {/* Modal de Personalización de Atajos */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl max-h-[85vh] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-2.5">
                <Bookmark className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Personalizar Atajos Rápidos
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Selecciona hasta 3 accesos directos para tu panel principal ({selectedIds.length}/3)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-soft"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-5 space-y-3">
              {AVAILABLE_SHORTCUTS.map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSelection(item.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border bg-surface hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`rounded-lg p-2 shrink-0 ${
                          isSelected ? "bg-primary text-white" : "bg-surface-soft border border-border"
                        }`}
                      >
                        {renderIcon(item.iconName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-text-primary truncate">
                            {item.label}
                          </p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-text-muted font-medium">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "border-border bg-background"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-border p-4 bg-surface-soft">
              <span className="text-xs text-text-secondary">
                {selectedIds.length} de 3 atajos seleccionados
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:bg-background border border-border transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isSaving || selectedIds.length === 0}
                  onClick={handleSaveShortcuts}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-sm transition disabled:opacity-50"
                >
                  {isSaving ? "Guardando..." : "Guardar Atajos"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

