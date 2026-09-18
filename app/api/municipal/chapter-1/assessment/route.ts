import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const assessments = await prisma.chapterAssessment.findMany({
      where: {
        userId: session.user.id,
        chapterNumber: 1,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      latest: assessments[0] || null,
      history: assessments,
    });
  } catch (error) {
    console.error("Error al obtener autoevaluaciones del capítulo 1:", error);
    return NextResponse.json(
      { error: "Error al consultar las autoevaluaciones" },
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
    const { responses, reflectionNotes } = body;

    if (!responses || typeof responses !== "object") {
      return NextResponse.json(
        { error: "Se requiere el objeto con las respuestas de verificación" },
        { status: 400 }
      );
    }

    const values = Object.values(responses) as string[];
    if (values.length === 0) {
      return NextResponse.json(
        { error: "La lista de respuestas no puede estar vacía" },
        { status: 400 }
      );
    }

    // Cálculo del puntaje sobre 100%
    let totalPoints = 0;
    let hasWarning = false;

    for (const val of values) {
      if (val === "applies") {
        totalPoints += 1;
      } else if (val === "partial") {
        totalPoints += 0.5;
        hasWarning = true;
      } else {
        hasWarning = true;
      }
    }

    const score = Math.round((totalPoints / values.length) * 100);

    const warningNotes = hasWarning
      ? "Favor de revisar la información una vez más antes de continuar al Capítulo 2. Existen puntos marcados como pendientes o parcialmente cumplidos."
      : null;

    const assessment = await prisma.chapterAssessment.create({
      data: {
        userId: session.user.id,
        chapterNumber: 1,
        responses,
        score,
        hasWarning,
        warningNotes,
        reflectionNotes: reflectionNotes || null,
      },
    });

    return NextResponse.json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error("Error al registrar autoevaluación del capítulo 1:", error);
    return NextResponse.json(
      { error: "Error al guardar la autoevaluación" },
      { status: 500 }
    );
  }
}

