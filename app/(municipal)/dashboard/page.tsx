import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MunicipalDashboardContent } from "@/components/municipal/dashboard/municipal-dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard Operativo | SABG-BUAP",
};

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      role: true,
      institution: true,
      title: true,
    },
  });

  return (
    <MunicipalDashboardContent
      currentUser={{
        name: user?.name || session.user.name || "Usuario",
        email: user?.email || session.user.email,
        role: user?.role || "municipal",
        institution: user?.institution || undefined,
        title: user?.title || undefined,
      }}
    />
  );
}
