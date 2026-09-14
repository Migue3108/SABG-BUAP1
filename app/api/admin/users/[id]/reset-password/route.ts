import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { hashPassword } from "better-auth/crypto";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendWelcomeCredentialsEmail } from "@/lib/email";

function generateSecureTempPassword(): string {
  const words = ["Sabg", "Buap", "Gob"];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const randomChars = crypto.randomBytes(3).toString("hex").toUpperCase();
  const year = new Date().getFullYear();
  return `${randomWord}-${randomChars}-${year}!`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const caller = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, active: true },
    });

    if (!caller || !caller.active || caller.role !== "admin") {
      return NextResponse.json(
        { error: "Acceso denegado: se requieren permisos de Administrador" },
        { status: 403 }
      );
    }

    const { id: targetUserId } = await params;

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        institution: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "El usuario especificado no existe." },
        { status: 404 }
      );
    }

    // Generar nueva contraseña temporal
    const temporaryPassword = generateSecureTempPassword();
    const hashedPassword = await hashPassword(temporaryPassword);

    // Actualizar contraseña en la cuenta
    await prisma.account.updateMany({
      where: { userId: targetUserId },
      data: { password: hashedPassword },
    });

    // Reactivar la bandera de cambio obligatorio
    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        mustChangePassword: true,
        active: true, // Si estaba inactivo, se reactiva
      },
    });

    // Invalidar inmediatamente todas las sesiones previas del usuario
    await prisma.session.deleteMany({
      where: { userId: targetUserId },
    });

    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        userId: caller.id,
        action: "RESTABLECER_PASSWORD_ADMIN",
        module: "ADMIN",
        entityType: "user",
        entityId: targetUserId,
        detailsJson: {
          targetEmail: targetUser.email,
          targetName: targetUser.name,
        },
      },
    });

    // Enviar notificación por correo
    const emailResult = await sendWelcomeCredentialsEmail({
      to: targetUser.email,
      name: targetUser.name,
      role: targetUser.role,
      temporaryPassword,
      institution: targetUser.institution,
    });

    return NextResponse.json({
      success: true,
      message: "Contraseña temporal restablecida correctamente.",
      temporaryPassword,
      emailSent: emailResult.success,
      emailSimulated: emailResult.simulated,
    });
  } catch (error: any) {
    console.error("[API_RESET_PASSWORD_POST] Error:", error);
    return NextResponse.json(
      { error: error.message || "Error al restablecer contraseña." },
      { status: 500 }
    );
  }
}

