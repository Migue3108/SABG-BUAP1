import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { UserRole } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ApiUser = {
  id: string;
  name: string;
  role: UserRole;
  institution: string | null;
};

type RequireUserResult =
  | { user: ApiUser; response?: never }
  | { user?: never; response: NextResponse };

// Valida sesión, usuario activo y (opcionalmente) rol dentro de un Route Handler.
export async function requireApiUser(
  allowedRoles?: readonly UserRole[]
): Promise<RequireUserResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      response: NextResponse.json({ error: "No autenticado" }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      role: true,
      active: true,
      institution: true,
    },
  });

  if (!user || !user.active) {
    return {
      response: NextResponse.json({ error: "Acceso denegado" }, { status: 403 }),
    };
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      response: NextResponse.json(
        { error: "Acceso denegado: permisos insuficientes" },
        { status: 403 }
      ),
    };
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      institution: user.institution,
    },
  };
}
