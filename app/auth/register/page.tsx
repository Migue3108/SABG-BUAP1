import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { AuthCard } from "../components/auth-card";

export const metadata = {
  title: "Acceso Restringido · Registro Cerrado",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Acceso Restringido"
      description="Plataforma de Gobernanza y Acompañamiento Municipal SABG–BUAP"
      footer={
        <div className="text-center text-xs text-text-muted">
          Benemérita Universidad Autónoma de Puebla · Gobierno del Estado de Puebla
        </div>
      }
    >
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-text-primary">
            Sistema Cerrado e Institucional
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            El autoregistro público se encuentra deshabilitado. Todas las cuentas de acceso (enlaces municipales, docentes asesores y estudiantes de servicio social) son dadas de alta exclusivamente por el equipo de administración técnica de <strong>SABG–BUAP</strong>.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-4 text-left text-xs text-text-muted space-y-1">
          <p className="font-semibold text-text-secondary">¿Cómo obtener tus credenciales?</p>
          <p>
            Una vez que tu cuenta sea dada de alta por la administración, recibirás un correo electrónico con tu usuario y contraseña temporal de primer acceso.
          </p>
        </div>

        <Link
          href="/auth/login"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
        >
          Iniciar sesión
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </AuthCard>
  );
}
