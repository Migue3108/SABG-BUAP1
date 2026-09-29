import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const VALID_STEPS = [
  "not-started",
  "diagnosis",
  "route",
  "instrument",
  "evidence",
  "tracking",
];

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const preference = await prisma.userPreference.findUnique({
      where: { userId: session.user.id },
      select: {
        currentStep: true,
        activeChapter: true,
      },
    });

    return NextResponse.json({
      success: true,
      currentStep: preference?.currentStep || "not-started",
      activeChapter: preference?.activeChapter || 1,
    });
  } catch (error) {
    console.error("[API_USER_PROGRESS_GET] Error:", error);
    return NextResponse.json(
      { error: "Error al consultar el progreso del usuario" },
      { status: 500 }
    );
  }
}

// POST: solo avanza el paso y el capítulo, nunca retrocede. Así el reenvío tardío
// de cambios hechos sin conexión (o desde otro dispositivo) no borra avance.
export async function POST(request: Request) {
  try {
    const { user, response } = await requireApiUser();
    if (response) return response;

    const body = (await request.json().catch(() => null)) as {
      currentStep?: unknown;
      activeChapter?: unknown;
    } | null;

    const requestedStep =
      typeof body?.currentStep === "string" && VALID_STEPS.includes(body.currentStep)
        ? body.currentStep
        : null;

    const requestedChapter =
      typeof body?.activeChapter === "number" &&
      Number.isInteger(body.activeChapter) &&
      body.activeChapter >= 1 &&
      body.activeChapter <= 8
        ? body.activeChapter
        : null;

    const current = await prisma.userPreference.findUnique({
      where: { userId: user.id },
      select: { currentStep: true, activeChapter: true },
    });

    const currentStep = current?.currentStep ?? "not-started";
    const currentChapter = current?.activeChapter ?? 1;

    const nextStep =
      requestedStep && VALID_STEPS.indexOf(requestedStep) > VALID_STEPS.indexOf(currentStep)
        ? requestedStep
        : currentStep;

    const nextChapter = Math.max(requestedChapter ?? currentChapter, currentChapter);

    const preference = await prisma.userPreference.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        currentStep: nextStep,
        activeChapter: nextChapter,
      },
      update: {
        currentStep: nextStep,
        activeChapter: nextChapter,
      },
    });

    return NextResponse.json({
      success: true,
      currentStep: preference.currentStep,
      activeChapter: preference.activeChapter,
    });
  } catch (error) {
    console.error("[API_USER_PROGRESS_POST] Error:", error);
    return NextResponse.json(
      { error: "Error al guardar el progreso del usuario" },
      { status: 500 }
    );
  }
}
