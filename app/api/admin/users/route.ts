import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendWelcomeCredentialsEmail } from "@/lib/email";
import type { UserRole } from "@prisma/client";

function generateSecureTempPassword(): string {
  const words = ["Sabg", "Buap", "Gob"];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const randomChars = crypto.randomBytes(3).toString("hex").toUpperCase();
  const year = new Date().getFullYear();
  return `${randomWord}-${randomChars}-${year}!`;
}

// GET: Listar usuarios para el panel de administración
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const caller = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, active: true },
    });

    if (!caller || !caller.active || caller.role !== "admin") {
      return NextResponse.json(
        { error: "Acceso denegado: se requieren permisos de Administrador" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const roleFilter = searchParams.get("role") || "";

    const users = await prisma.user.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                  { institution: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          roleFilter ? { role: roleFilter as UserRole } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        mustChangePassword: true,
        institution: true,
        phone: true,
        title: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[API_ADMIN_USERS_GET] Error:", error);
    return NextResponse.json(
      { error: "Error al consultar usuarios" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo usuario por parte del Administrador
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const caller = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, active: true, name: true },
    });

    if (!caller || !caller.active || caller.role !== "admin") {
      return NextResponse.json(
        { error: "Acceso denegado: se requieren permisos de Administrador" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      role = "municipal",
      institution,
      phone,
      title,
      customPassword,
    } = body;

    if (!name || typeof name !== "string" || name.trim().length < 3) {
      return NextResponse.json(
        { error: "El nombre completo es obligatorio (mínimo 3 caracteres)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "El correo electrónico institucional no es válido." },
        { status: 400 }
      );
    }

    const validRoles: UserRole[] = [
      "admin",
      "coordinator",
      "teacher",
      "student",
      "municipal",
    ];

    if (!validRoles.includes(role as UserRole)) {
      return NextResponse.json(
        { error: `El rol '${role}' no es válido.` },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El correo electrónico ya se encuentra registrado en el sistema." },
        { status: 409 }
      );
    }

    // Generar contraseña temporal segura que cumpla estrictamente con las 5 reglas
    let temporaryPassword = generateSecureTempPassword();
    if (
      customPassword &&
      typeof customPassword === "string" &&
      customPassword.trim().length >= 8
    ) {
      const trimmed = customPassword.trim();
      const hasUpper = /[A-Z]/.test(trimmed);
      const hasLower = /[a-z]/.test(trimmed);
      const hasNum = /[0-9]/.test(trimmed);
      const hasSpec = /[^A-Za-z0-9]/.test(trimmed);

      if (hasUpper && hasLower && hasNum && hasSpec) {
        temporaryPassword = trimmed;
      }
    }

    // 1. Crear el usuario en Better Auth con su contraseña encriptada
    const authResult = await auth.api.signUpEmail({
      body: {
        name: name.trim(),
        email: normalizedEmail,
        password: temporaryPassword,
      },
    });

    if (!authResult?.user?.id) {
      throw new Error("No se pudo inicializar la cuenta en el proveedor de autenticación.");
    }

    // 2. Actualizar atributos institucionales y obligar a cambio de contraseña
    const createdUser = await prisma.user.update({
      where: { id: authResult.user.id },
      data: {
        name: name.trim(),
        role: role as UserRole,
        active: true,
        mustChangePassword: true,
        institution: institution ? institution.trim() : null,
        phone: phone ? phone.trim() : null,
        title: title ? title.trim() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        mustChangePassword: true,
        institution: true,
        createdAt: true,
      },
    });

    // 3. Registrar en bitácora de auditoría
    await prisma.auditLog.create({
      data: {
        userId: caller.id,
        action: "CREAR_USUARIO",
        module: "ADMIN",
        entityType: "user",
        entityId: createdUser.id,
        detailsJson: {
          createdName: createdUser.name,
          createdEmail: createdUser.email,
          role: createdUser.role,
          institution: createdUser.institution,
          createdByAdminId: caller.id,
        },
      },
    });

    // 4. Enviar notificación por correo con las credenciales
    const emailResult = await sendWelcomeCredentialsEmail({
      to: createdUser.email,
      name: createdUser.name,
      role: createdUser.role,
      temporaryPassword,
      institution: createdUser.institution,
    });

    return NextResponse.json({
      success: true,
      message: "Usuario creado exitosamente.",
      user: createdUser,
      temporaryPassword,
      emailSent: emailResult.success,
      emailSimulated: emailResult.simulated,
    });
  } catch (error: any) {
    console.error("[API_ADMIN_USERS_POST] Error:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear usuario en la plataforma." },
      { status: 500 }
    );
  }
}

