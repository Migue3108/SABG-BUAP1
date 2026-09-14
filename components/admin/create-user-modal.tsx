"use client";

import { useState } from "react";
import {
  X,
  UserPlus,
  Copy,
  Check,
  Mail,
  Shield,
  KeyRound,
  Building,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { copyToClipboard } from "@/lib/clipboard";

type CreateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
};

const ROLES = [
  { id: "municipal", label: "Enlace / Usuario Municipal", desc: "Captura de diagnósticos y evidencias del ayuntamiento" },
  { id: "student", label: "Estudiante SS / PP", desc: "Acompañamiento en territorio, bitácora y apoyo técnico" },
  { id: "teacher", label: "Docente Asesor", desc: "Revisión metodológica, observaciones y validación de evidencias" },
  { id: "coordinator", label: "Coordinación SABG–BUAP", desc: "Supervisión regional, indicadores y observatorio" },
  { id: "admin", label: "Administrador Técnico", desc: "Gestión técnica, accesos y auditoría de la plataforma" },
];

export function CreateUserModal({
  isOpen,
  onClose,
  onUserCreated,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "municipal",
    institution: "",
    phone: "",
    title: "",
    customPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdResult, setCreatedResult] = useState<{
    user: { name: string; email: string; role: string; institution?: string };
    temporaryPassword: string;
    emailSimulated?: boolean;
  } | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);

  if (!isOpen) return null;

  function resetForm() {
    setFormData({
      name: "",
      email: "",
      role: "municipal",
      institution: "",
      phone: "",
      title: "",
      customPassword: "",
    });
    setErrorMessage("");
    setCreatedResult(null);
    setCopiedPassword(false);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo crear el usuario");
      }

      setCreatedResult({
        user: data.user,
        temporaryPassword: data.temporaryPassword,
        emailSimulated: data.emailSimulated,
      });

      onUserCreated();
    } catch (err: any) {
      setErrorMessage(err.message || "Ocurrió un error al procesar el alta.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopyPasswordOnly() {
    if (!createdResult) return;
    const ok = await copyToClipboard(createdResult.temporaryPassword);
    if (ok) {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2500);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-background px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                {createdResult ? "Credenciales Generadas" : "Registrar Nuevo Usuario"}
              </h2>
              <p className="text-xs text-text-secondary">
                {createdResult
                  ? "La cuenta ha sido dada de alta exitosamente"
                  : "Alta institucional en el sistema cerrado SABG–BUAP"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-text-muted hover:bg-background hover:text-text-primary transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto p-6">
          {createdResult ? (
            /* Vista de éxito con credenciales */
            <div className="space-y-6">
              <div className="rounded-xl border border-success/30 bg-success/10 p-4 text-center">
                <p className="text-sm font-semibold text-success">
                  ¡Cuenta creada con éxito!
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Se ha generado la contraseña temporal y el usuario ha sido marcado para cambio obligatorio de contraseña en su primer inicio.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Ficha de Credenciales
                  </span>
                  <span className="rounded-full bg-primary-light px-3 py-0.5 text-xs font-bold text-primary capitalize">
                    {createdResult.user.role}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div>
                    <span className="block text-xs text-text-muted">Nombre</span>
                    <span className="font-semibold text-text-primary">
                      {createdResult.user.name}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-text-muted">Correo / Usuario</span>
                    <span className="font-semibold text-text-primary">
                      {createdResult.user.email}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-primary/20 bg-primary-light/50 p-4">
                  <span className="block text-xs font-semibold uppercase text-primary mb-1.5">
                    Contraseña Temporal Asignada
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="font-mono text-lg font-bold text-text-primary tracking-wider select-all bg-surface/70 px-3 py-1 rounded border border-border">
                      {createdResult.temporaryPassword}
                    </span>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={handleCopyPasswordOnly}
                        title="Copiar contraseña temporal"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover shadow-sm"
                      >
                        {copiedPassword ? (
                          <>
                            <Check className="h-4 w-4 text-white" />
                            ¡Copiada!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copiar contraseña
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-text-muted flex items-start gap-2">
                  <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    {createdResult.emailSimulated
                      ? "Notificación generada en el registro del sistema (modo local/simulado sin servidor SMTP activo)."
                      : "Se ha enviado un correo electrónico automático al usuario con estas instrucciones de acceso."}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-background transition"
                >
                  Registrar otro usuario
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition"
                >
                  Finalizar
                </button>
              </div>
            </div>
          ) : (
            /* Formulario de creación */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3.5 text-sm text-danger">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{errorMessage}</span>
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
                    placeholder="Ej. Mtra. Laura Gómez Sánchez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    Correo electrónico institucional *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="usuario@municipio.gob.mx o @buap.mx"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Rol en el sistema *
                </label>
                <div className="grid gap-2.5 sm:grid-cols-2">
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
                          name="role"
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
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    Institución o Municipio
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Ej. H. Ayuntamiento de Teziutlán"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    Cargo o Título institucional
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Contralora Municipal / Asesor"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary-light/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                  <KeyRound className="h-4 w-4" />
                  <span>Seguridad de Primer Acceso</span>
                </div>
                <p className="text-xs text-text-secondary">
                  El sistema generará una <strong>contraseña temporal segura</strong> y le enviará un correo con las credenciales. Al iniciar sesión por primera vez, el usuario estará obligado a definir su clave personal.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={handleClose}
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
                      Registrando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Crear cuenta y notificar
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

