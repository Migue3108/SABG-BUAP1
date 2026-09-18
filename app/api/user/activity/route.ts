import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 1. Obtener logs de auditoría del usuario
    const auditLogs = await prisma.auditLog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // 2. Obtener evaluaciones registradas por el usuario
    const assessments = await prisma.chapterAssessment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // 3. Formatear y unificar lista de actividades
    const activities: Array<{
      id: string;
      action: string;
      title: string;
      description: string;
      timestamp: string;
      type: "assessment" | "security" | "navigation" | "preference" | "general";
    }> = [];

    for (const a of assessments) {
      activities.push({
        id: `assessment-${a.id}`,
        action: "EVALUACION_CAPITULO",
        title: `Autoevaluación Capítulo ${a.chapterNumber}`,
        description: `Lista de verificación completada con ${a.score}% de cumplimiento.`,
        timestamp: a.createdAt.toISOString(),
        type: "assessment",
      });
    }

    for (const log of auditLogs) {
      let type: "assessment" | "security" | "navigation" | "preference" | "general" = "general";
      let title = log.action;
      let desc = (log.detailsJson as any)?.description || log.module;

      if (log.action.includes("PASSWORD") || log.action.includes("LOGIN") || log.action.includes("AUTH")) {
        type = "security";
        title = "Seguridad de la Cuenta";
        desc = log.action === "CAMBIO_PASSWORD" ? "Contraseña actualizada exitosamente" : "Acceso registrado al sistema";
      } else if (log.action.includes("TEMA") || log.action.includes("PREFERENCIA")) {
        type = "preference";
        title = "Preferencia del Sistema";
        desc = (log.detailsJson as any)?.description || "Ajuste en la configuración del perfil";
      } else if (log.action.includes("CONSULTA") || log.action.includes("RECURSO")) {
        type = "navigation";
        title = "Consulta de Material";
        desc = (log.detailsJson as any)?.description || "Exploración de documentos rectorales";
      }

      activities.push({
        id: `audit-${log.id}`,
        action: log.action,
        title,
        description: desc,
        timestamp: log.createdAt.toISOString(),
        type,
      });
    }

    // Si aún no tiene actividades en DB, incluir actividades iniciales de inducción
    if (activities.length === 0) {
      activities.push({
        id: "initial-1",
        action: "INICIO_SESION",
        title: "Primer Ingreso",
        description: "Bienvenido al Sistema de Acompañamiento del Buen Gobierno Municipal.",
        timestamp: session.session.createdAt ? new Date(session.session.createdAt).toISOString() : new Date().toISOString(),
        type: "security",
      });
    }

    // Ordenar por fecha más reciente
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      success: true,
      activities: activities.slice(0, 6),
    });
  } catch (error) {
    console.error("Error al obtener actividades del usuario:", error);
    return NextResponse.json(
      { error: "Error al consultar actividades" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { action, module, description } = body;

    const newLog = await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: action || "ACCION_USUARIO",
        module: module || "DASHBOARD",
        detailsJson: { description: description || "Acción registrada en la plataforma" },
      },
    });

    return NextResponse.json({
      success: true,
      log: newLog,
    });
  } catch (error) {
    console.error("Error al registrar actividad del usuario:", error);
    return NextResponse.json(
      { error: "Error al registrar la actividad" },
      { status: 500 }
    );
  }
}

