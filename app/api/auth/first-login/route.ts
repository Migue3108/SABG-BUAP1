import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "better-auth/crypto";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { routes } from "@/config/routes";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Sesión no válida o expirada. Por favor ingresa nuevamente." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { password, confirmPassword } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "La nueva contraseña es obligatoria." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres de longitud." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Las contraseñas no coinciden." },
        { status: 400 }
      );
    }

    // Reglas de seguridad estrictas:
    // Al menos una mayúscula, una minúscula, un número y un carácter especial
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      const missing: string[] = [];
      if (!hasUpperCase) missing.push("una letra mayúscula (A-Z)");
      if (!hasLowerCase) missing.push("una letra minúscula (a-z)");
      if (!hasNumber) missing.push("un número (0-9)");
      if (!hasSpecialChar) missing.push("un carácter especial (!@#$%^&*...)");

      return NextResponse.json(
        {
          error: `La contraseña no cumple las reglas de seguridad. Falta incluir: ${missing.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    // Validar que la nueva contraseña no sea idéntica a la contraseña temporal previa
    const currentAccount = await prisma.account.findFirst({
      where: { userId: session.user.id },
      select: { password: true },
    });

    if (currentAccount?.password) {
      const isSameAsTemp = await verifyPassword({
        hash: currentAccount.password,
        password,
      });

      if (isSameAsTemp) {
        return NextResponse.json(
          {
            error:
              "La nueva contraseña no puede ser idéntica a la contraseña temporal asignada. Por favor define una clave personal diferente.",
          },
          { status: 400 }
        );
      }
    }

    // Encriptar la nueva contraseña con el mismo algoritmo de Better Auth (scrypt)
    const hashedPassword = await hashPassword(password);

    // Actualizar la contraseña en la cuenta de credenciales (invalida permanentemente la clave temporal previa)
    await prisma.account.updateMany({
      where: { userId: session.user.id },
      data: { password: hashedPassword },
    });

    // Desactivar la bandera de cambio obligatorio en el usuario y asegurar que esté activo
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        mustChangePassword: false,
        active: true,
      },
      select: { id: true, name: true, role: true, active: true },
    });

    // Invalidar cualquier otra sesión activa previa, dejando únicamente la sesión actual
    try {
      if (session.session?.token) {
        await prisma.session.deleteMany({
          where: {
            userId: session.user.id,
            token: { not: session.session.token },
          },
        });
      }
    } catch (sessionErr) {
      console.warn("[API_FIRST_LOGIN] Advertencia al purgar sesiones anteriores:", sessionErr);
    }

    // Registrar en auditoría
    try {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "CAMBIO_PASSWORD_PRIMER_ACCESO",
          module: "AUTH",
          entityType: "user",
          entityId: session.user.id,
          detailsJson: {
            userName: updatedUser.name,
            role: updatedUser.role,
          },
        },
      });
    } catch (auditErr) {
      console.warn("[API_FIRST_LOGIN] Advertencia al registrar bitácora:", auditErr);
    }

    const redirectTo =
      updatedUser.role === "admin"
        ? routes.admin.home
        : routes.dashboard;

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada exitosamente.",
      redirectTo,
    });
  } catch (error: any) {
    console.error("[API_FIRST_LOGIN_POST] Error:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar contraseña." },
      { status: 500 }
    );
  }
}

