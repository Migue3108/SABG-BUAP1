"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ClipboardCheck,
  ShieldCheck,
  Settings,
  BookOpen,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

type ActivityItem = {
  id: string;
  action: string;
  title: string;
  description: string;
  timestamp: string;
  type: "assessment" | "security" | "navigation" | "preference" | "general";
};

export function RecentActivityWidget() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        const res = await fetch("/api/user/activity");
        if (res.ok) {
          const data = await res.json();
          if (data.activities && Array.isArray(data.activities)) {
            setActivities(data.activities);
          }
        }
      } catch (err) {
        console.warn("No se pudieron cargar actividades:", err);
      } finally {
        setLoading(false);
      }
    }
    loadActivities();
  }, []);

  function formatTime(iso: string) {
    try {
      const date = new Date(iso);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

      if (diffMinutes < 1) return "Justo ahora";
      if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
      if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
      }

      return date.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Reciente";
    }
  }

  function getIcon(type: ActivityItem["type"]) {
    switch (type) {
      case "assessment":
        return <ClipboardCheck className="h-4 w-4 text-emerald-600" />;
      case "security":
        return <ShieldCheck className="h-4 w-4 text-blue-600" />;
      case "preference":
        return <Settings className="h-4 w-4 text-purple-600" />;
      case "navigation":
        return <BookOpen className="h-4 w-4 text-primary" />;
      default:
        return <Activity className="h-4 w-4 text-primary" />;
    }
  }

  return (
    <section className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary leading-tight">
                Actividades Recientes
              </h2>
              <p className="text-[11px] text-text-secondary">
                Tu historial de acciones en el sistema
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-text-muted">
            <Clock className="h-3 w-3" />
            En vivo
          </span>
        </div>

        {/* Lista de actividades */}
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="space-y-2 py-3">
              <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            </div>
          ) : activities.length === 0 ? (
            <div className="py-6 text-center text-xs text-text-muted">
              No hay actividades recientes registradas.
            </div>
          ) : (
            activities.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-2.5 rounded-xl border border-border/60 bg-surface-soft/40 transition hover:bg-surface-soft"
              >
                <div className="mt-0.5 shrink-0 rounded-lg p-1.5 bg-background border border-border/80">
                  {getIcon(item.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-text-primary truncate">
                      {item.title}
                    </p>
                    <span className="shrink-0 text-[10px] text-text-muted font-mono">
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-snug truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
        <span>Registro vinculado a tu sesión</span>
        <span className="font-semibold text-primary inline-flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          Sincronizado
        </span>
      </div>
    </section>
  );
}

