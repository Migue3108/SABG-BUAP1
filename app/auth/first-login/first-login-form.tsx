"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AuthField } from "../components/auth-field";
import { PasswordRules, validatePasswordComplexity } from "../components/password-rules";

export function FirstLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const complexity = validatePasswordComplexity(password);
    if (!complexity.isValid) {
      setError(
        `Requisitos de seguridad pendientes: ${complexity.failedRules.join(", ")}.`
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/first-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo actualizar la contraseña.");
      }

      // Redirigir limpiamente al panel correspondiente (recarga completa de sesión y layouts)
      const targetUrl = data.redirectTo || "/dashboard";
      window.location.href = targetUrl;
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al actualizar la contraseña.");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="rounded-xl border border-primary/20 bg-primary-light/40 p-4 text-xs text-text-secondary leading-relaxed">
        <strong>Primer Acceso:</strong> Para resguardar la seguridad de tu información institucional, debes reemplazar tu contraseña temporal por una contraseña personal definitiva.
      </div>

      <AuthField
        id="password"
        label="Nueva contraseña"
        type="password"
        name="password"
        placeholder="Crea tu nueva contraseña"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <AuthField
        id="confirmPassword"
        label="Confirmar contraseña"
        type="password"
        name="confirmPassword"
        placeholder="Repite tu nueva contraseña"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        required
      />

      <PasswordRules password={password} />

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-2.5 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="
          flex h-11 w-full items-center justify-center gap-2
          rounded-lg bg-primary text-sm font-semibold text-white
          shadow-sm transition-all
          hover:bg-primary-hover
          focus:outline-none focus:ring-4 focus:ring-primary/20
          active:scale-[0.99] disabled:opacity-60
        "
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Guardando contraseña...
          </>
        ) : (
          "Guardar y continuar"
        )}
      </button>
    </form>
  );
}