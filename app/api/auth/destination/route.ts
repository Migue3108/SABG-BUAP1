import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { routes } from "@/config/routes";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { redirectTo: "/auth/login" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      active: true,
      mustChangePassword: true,
    },
  });

  if (!user || !user.active) {
    return NextResponse.json(
      { redirectTo: "/auth/login" },
      { status: 403 }
    );
  }

  // Si tiene pendiente cambio de contraseña obligatorio por primer acceso
  if (user.mustChangePassword) {
    return NextResponse.json({ redirectTo: "/auth/first-login" });
  }

  const redirectTo =
    user.role === "admin"
      ? routes.admin.home
      : routes.dashboard;

  return NextResponse.json({ redirectTo });
}
