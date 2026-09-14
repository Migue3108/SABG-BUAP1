"use client";

import { useState } from "react";
import { KeyRound, Copy, Check, Mail, Loader2, X, AlertCircle } from "lucide-react";
import type { AdminUserItem } from "./users-manager-client";
import { copyToClipboard } from "@/lib/clipboard";

type ResetPasswordModalProps = {
  isOpen: boolean;
  user: AdminUserItem | null;
  onClose: () => void;
  onPasswordReset: () => void;
};

export function ResetPasswordModal({
  isOpen,
  user,
  onClose,
  onPasswordReset,
}: ResetPasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [emailSimulated, setEmailSimulated] = useState(false);

  if (!isOpen || !user) return null;

  async function handleReset() {
    if (!user) return;
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/admin/users/${user.id}/reset-password`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo restablecer la contraseña.");
      }

      setTempPassword(data.temporaryPassword);
      setEmailSimulated(data.emailSimulated);
      onPasswordReset();
    } catch (err: any) {
      setErrorMessage(err.message || "Error al restablecer contraseña.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    setTempPassword(null);
    setErrorMessage("");
    setCopiedPassword(false);
    onClose();
  }

  async function handleCopyPasswordOnly() {
    if (!tempPassword) return;
    const ok = await copyToClipboard(tempPassword);
    if (ok) {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2500);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Restablecer Contraseña
              </h3>
              <p className="text-xs text-text-secondary">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-text-primary transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {tempPassword ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-success/30 bg-success/10 p-3.5 text-xs text-success leading-relaxed">
              <strong>¡Contraseña temporal generada con éxito!</strong> Se ha reactivado la bandera de cambio obligatorio para este usuario.
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary-light/50 p-4">
              <span className="block text-xs font-semibold uppercase text-primary mb-1.5">
                Nueva Clave Temporal
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-mono text-lg font-bold text-text-primary tracking-wider select-all bg-surface/70 px-3 py-1 rounded border border-border">
                  {tempPassword}
                </span>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={handleCopyPasswordOnly}
                    title="Copiar contraseña temporal"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-hover shadow-sm"
                  >
                    {copiedPassword ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-white" />
                        ¡Copiada!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copiar clave
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-xs text-text-muted flex items-start gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                {emailSimulated
                  ? "Notificación generada en el registro del sistema (modo local sin servidor SMTP activo)."
                  : "Se ha enviado un correo electrónico con la nueva clave a la bandeja del usuario."}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              ¿Deseas generar una nueva contraseña temporal para{" "}
              <strong className="text-text-primary">{user.name}</strong>?
            </p>

            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800 leading-relaxed">
              La contraseña anterior quedará invalidada de inmediato. Al usuario se le asignará una nueva clave temporal y se le obligará a crear una nueva contraseña en su siguiente inicio de sesión.
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleClose}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary hover:bg-background transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  "Generar y notificar"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

