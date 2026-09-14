import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { MunicipalDashboardShell } from "@/components/municipal/municipal-dashboard-shell";

import { MunicipalProgressProvider } from "@/contexts/municipal-progress-context";

export default async function MunicipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session =
    await auth.api.getSession({
      headers: await headers(),
    });

  if (!session) {
    redirect("/auth/login");
  }

  const user =
    await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: true,
        active: true,
        mustChangePassword: true,
        institution: true,
        title: true,
      },
    });

  if (!user || !user.active) {
    redirect("/auth/login");
  }

  if (user.mustChangePassword) {
    redirect("/auth/first-login");
  }

  if (user.role === "admin") {
    redirect("/admin");
  }

  const ROLE_LABELS: Record<string, string> = {
    admin: "Administrador Técnico",
    coordinator: "Coordinación SABG–BUAP",
    teacher: "Docente Asesor",
    student: "Estudiante SS / PP",
    municipal: "Enlace Municipal",
  };

  const displayRole = ROLE_LABELS[user.role] ?? "Usuario";

  const name =
    session.user.name ??
    displayRole;

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) =>
      word.charAt(0)
    )
    .join("")
    .toUpperCase();

  return (
    <MunicipalProgressProvider>
      <MunicipalDashboardShell
        user={{
          name,
          role: displayRole,
          initials,
          email: session.user.email,
        }}
        organization={{
          name: user.institution || "SABG–BUAP",
          area: user.title || "Gestión Municipal",
        }}
      >
        {children}
      </MunicipalDashboardShell>
    </MunicipalProgressProvider>
  );
}