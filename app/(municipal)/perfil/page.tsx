import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileContent } from "@/components/municipal/profile/profile-content";

export const metadata: Metadata = {
  title: "Mi Perfil | SABG-BUAP",
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
      id: true,
      name: true,
      email: true,
      role: true,
      institution: true,
      title: true,
      phone: true,
      createdAt: true,
    },
  });

  return (
    <ProfileContent
      user={{
        name: user?.name || session.user.name || "Usuario",
        email: user?.email || session.user.email,
        role: user?.role || "municipal",
        institution: user?.institution || undefined,
        title: user?.title || undefined,
        phone: user?.phone || undefined,
      }}
    />
  );
}
