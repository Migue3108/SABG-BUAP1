"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { AdminUserItem } from "./users-manager-client";

type DeleteUserModalProps = {
  isOpen: boolean;
  user: AdminUserItem | null;
  onClose: () => void;
  onUserDeleted: () => void;
};

export function DeleteUserModal({
  isOpen,
  user,
  onClose,
  onUserDeleted,
}: DeleteUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen || !user) return null;

  async function handleDelete() {
    if (!user) return;
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo eliminar el usuario.");
      }

      onUserDeleted();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Error al eliminar usuario.");
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-danger">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-danger/10 border border-danger/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">Eliminar Usuario</h3>
            <p className="text-xs text-text-secondary">Acción irreversible</p>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed">
          ¿Estás seguro de que deseas eliminar la cuenta de{" "}
          <strong className="text-text-primary">{user.name}</strong> (
          <span className="font-mono text-xs">{user.email}</span>)?
        </p>

        <div className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-xs text-danger leading-relaxed">
          Se eliminarán sus credenciales de acceso, sesiones activas y asignaciones directas. Las evidencias y registros históricos quedarán archivados para trazabilidad.
        </div>

        {errorMessage && (
          <p className="text-xs text-danger font-semibold bg-danger/10 p-2.5 rounded-lg border border-danger/20">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-background transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-danger/90 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar definitivamente"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

