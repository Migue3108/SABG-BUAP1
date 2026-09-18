"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { useRouter } from "next/navigation";

import { AuthField } from "../components/auth-field";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const [email, setEmail] = useState(
    demoMode ? process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "" : ""
  );

  const [password, setPassword] = useState(
    demoMode ? process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "" : ""
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      console.error("Error de autenticación:", error);
      setErrorMessage(
        error.message ||
          `Error del servidor (${(error as any).status || 500}). Revisa los logs de Vercel.`
      );
      setIsLoading(false);
      return;
    }

    const destinationResponse = await fetch(
      "/api/auth/destination",
      { cache: "no-store" }
    );

    const destination = destinationResponse.ok
      ? await destinationResponse.json()
      : { redirectTo: "/dashboard" };

    window.location.replace(destination.redirectTo || "/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <AuthField
        id="email"
        label="Correo electrónico"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <AuthField
        id="password"
        label="Contraseña"
        type="password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="h-11 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}