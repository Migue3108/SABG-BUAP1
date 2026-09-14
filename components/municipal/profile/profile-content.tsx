"use client";

import {
  Building2,
  Mail,
  ShieldCheck,
  UserRound,
  Phone,
  Briefcase,
} from "lucide-react";

type ProfileContentProps = {
  user: {
    name: string;
    email?: string;
    role: string;
    institution?: string;
    title?: string;
    phone?: string;
  };
};

const ROLE_NAMES: Record<string, string> = {
  municipal: "Enlace / Funcionario Municipal",
  student: "Estudiante de Servicio Social / Práctica Profesional",
  teacher: "Docente Asesor",
  coordinator: "Coordinación General SABG–BUAP",
  admin: "Administrador Técnico",
};

export function ProfileContent({ user }: ProfileContentProps) {
  const initials = (user.name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  const roleLabel = ROLE_NAMES[user.role] ?? user.role;
  const institution = user.institution || "Municipio en Acompañamiento";
  const title = user.title || "Enlace Operativo";

  return (
    <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Cabecera del Perfil */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white shadow-sm">
              {initials}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Ficha de Usuario &bull; SABG–BUAP
              </p>

              <h1 className="mt-1 text-2xl font-bold text-text-primary md:text-3xl">
                {user.name}
              </h1>

              <p className="mt-1 text-sm text-text-secondary font-medium">
                {roleLabel}
              </p>
            </div>
          </div>
        </section>

        {/* Tarjetas de Información Personal y de Adscripción */}
        <section className="grid gap-4 md:grid-cols-2">
          <ProfileCard
            icon={Mail}
            label="Correo electrónico"
            value={user.email || "Sin correo registrado"}
          />

          <ProfileCard
            icon={ShieldCheck}
            label="Rol institucional"
            value={roleLabel}
          />

          <ProfileCard
            icon={Building2}
            label="Municipio o Institución"
            value={institution}
          />

          <ProfileCard
            icon={Briefcase}
            label="Cargo o Área"
            value={title}
          />

          {user.phone && (
            <ProfileCard
              icon={Phone}
              label="Teléfono de contacto"
              value={user.phone}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function ProfileCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm hover:border-primary/30 transition">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-text-muted">
            {label}
          </p>

          <p className="mt-1 text-sm font-semibold text-text-primary truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}