"use client";

import { useState, useEffect } from "react";
import {
  X,
  UserCheck,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";
import type { AdminUserItem } from "./users-manager-client";
import { MunicipalitySelect } from "./municipality-select";

type EditUserModalProps = {
  isOpen: boolean;
  user: AdminUserItem | null;
  onClose: () => void;
  onUserUpdated: () => void;
};

const ROLES = [
  { id: "municipal", label: "Enlace / Usuario Municipal", desc: "Captura de diagnósticos y evidencias del ayuntamiento" },
  { id: "student", label: "Estudiante SS / PP", desc: "Acompañamiento en territorio, bitácora y apoyo técnico" },
  { id: "teacher", label: "Docente Asesor", desc: "Revisión metodológica, observaciones y validación de evidencias" },
  { id: "coordinator", label: "Coordinación SABG–BUAP", desc: "Supervisión regional, indicadores y observatorio" },
  { id: "admin", label: "Administrador Técnico", desc: "Gestión técnica, accesos y auditoría de la plataforma" },
];

export function EditUserModal({
  isOpen,
  user,
  onClose,
  onUserUpdated,
}: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "municipal",
    institution: "",
    phone: "",
    title: "",
    active: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "municipal",
        institution: user.institution || "",
        phone: user.phone || "",
        title: user.title || "",
        active: user.active ?? true,
      });
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [user]);

  if (!isOpen || !user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setErrorMessage("");
    setSuccessMessage("");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage("Por favor ingresa un correo electrónico válido (ejemplo: usuario@municipio.gob.mx o usuario@correo.com).");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo actualizar el usuario.");
      }

      setSuccessMessage("Usuario actualizado correctamente.");
      onUserUpdated();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Error al guardar los cambios.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-background px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Editar Usuario</h2>
              <p className="text-xs text-text-secondary">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-background hover:text-text-primary transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-6 space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3.5 text-sm text-danger">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-3.5 text-sm text-success">
              <Check className="h-5 w-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Nombre completo *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Correo electrónico *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
              Rol en la plataforma *
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {ROLES.map((r) => {
                const isSelected = formData.role === r.id;
                return (
                  <label
                    key={r.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                      isSelected
                        ? "border-primary bg-primary-light/50 ring-1 ring-primary"
                        : "border-border bg-background hover:border-text-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="edit-role"
                      value={r.id}
                      checked={isSelected}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="mt-1 h-4 w-4 text-primary accent-primary"
                    />
                    <div>
                      <p className="text-xs font-bold text-text-primary">{r.label}</p>
                      <p className="text-[11px] text-text-secondary mt-0.5">{r.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MunicipalitySelect
              label="Municipio o Institución"
              value={formData.institution}
              onChange={(val) => setFormData({ ...formData, institution: val })}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Cargo o Título
              </label>
              <input
                type="text"
                placeholder="Ej. Contralor / Asesor"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">Estado de la cuenta</p>
              <p className="text-xs text-text-secondary">
                {formData.active
                  ? "El usuario puede ingresar y operar normalmente."
                  : "Acceso bloqueado: el usuario no podrá iniciar sesión."}
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-border after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-success peer-checked:after:translate-x-full peer-focus:outline-none" />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-background transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

