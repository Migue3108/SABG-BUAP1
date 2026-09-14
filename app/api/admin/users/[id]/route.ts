import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

// PATCH: Editar información, rol o estado del usuario
export async function PATCH(
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

    const existingTarget = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!existingTarget) {
      return NextResponse.json(
        { error: "El usuario que intentas modificar no existe." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, email, role, institution, phone, title, active } = body;

    const dataToUpdate: any = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 3) {
        return NextResponse.json(
          { error: "El nombre debe tener al menos 3 caracteres." },
          { status: 400 }
        );
      }
      dataToUpdate.name = name.trim();
    }

    if (email !== undefined) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const normalizedEmail = email.toLowerCase().trim();
      if (!emailRegex.test(normalizedEmail)) {
        return NextResponse.json(
          { error: "El correo electrónico no tiene una estructura válida (ejemplo: usuario@municipio.gob.mx o usuario@correo.com)." },
          { status: 400 }
        );
      }

      if (normalizedEmail !== existingTarget.email) {
        const emailInUse = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });
        if (emailInUse) {
          return NextResponse.json(
            { error: "Ese correo ya está en uso por otro usuario." },
            { status: 409 }
          );
        }
        dataToUpdate.email = normalizedEmail;
      }
    }

    if (role !== undefined) {
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

      // Evitar que el administrador se quite a sí mismo el rol de admin
      if (caller.id === targetUserId && role !== "admin") {
        return NextResponse.json(
          { error: "No puedes removerte tus propios permisos de administrador." },
          { status: 400 }
        );
      }

      dataToUpdate.role = role as UserRole;
    }

    if (institution !== undefined) {
      dataToUpdate.institution = institution ? institution.trim() : null;
    }

    if (phone !== undefined) {
      dataToUpdate.phone = phone ? phone.trim() : null;
    }

    if (title !== undefined) {
      dataToUpdate.title = title ? title.trim() : null;
    }

    if (active !== undefined) {
      // Evitar que el administrador se desactive a sí mismo
      if (caller.id === targetUserId && active === false) {
        return NextResponse.json(
          { error: "No puedes desactivar tu propia cuenta de administrador." },
          { status: 400 }
        );
      }
      dataToUpdate.active = Boolean(active);
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: dataToUpdate,
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

    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        userId: caller.id,
        action: "EDITAR_USUARIO",
        module: "ADMIN",
        entityType: "user",
        entityId: targetUserId,
        detailsJson: {
          targetEmail: updatedUser.email,
          changes: dataToUpdate,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Usuario actualizado correctamente.",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("[API_ADMIN_USER_PATCH] Error:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar usuario." },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar usuario de forma segura
export async function DELETE(
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

    // Salvaguarda: No permitir que el admin se elimine a sí mismo
    if (caller.id === targetUserId) {
      return NextResponse.json(
        { error: "No puedes eliminar tu propia cuenta de administrador." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "El usuario que intentas eliminar no existe." },
        { status: 404 }
      );
    }

    // Eliminar de Prisma (las relaciones están configuradas con Cascade o SetNull)
    await prisma.user.delete({
      where: { id: targetUserId },
    });

    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        userId: caller.id,
        action: "ELIMINAR_USUARIO",
        module: "ADMIN",
        entityType: "user",
        entityId: targetUserId,
        detailsJson: {
          deletedUserEmail: targetUser.email,
          deletedUserName: targetUser.name,
          deletedUserRole: targetUser.role,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `El usuario ${targetUser.name} (${targetUser.email}) fue eliminado exitosamente.`,
    });
  } catch (error: any) {
    console.error("[API_ADMIN_USER_DELETE] Error:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar usuario." },
      { status: 500 }
    );
  }
}

