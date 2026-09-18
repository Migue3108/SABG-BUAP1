import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
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

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { currentStep, activeChapter } = body;

    const dataToUpdate: Record<string, any> = {};

    if (currentStep && VALID_STEPS.includes(currentStep)) {
      dataToUpdate.currentStep = currentStep;
    }

    if (
      typeof activeChapter === "number" &&
      Number.isInteger(activeChapter) &&
      activeChapter >= 1 &&
      activeChapter <= 8
    ) {
      dataToUpdate.activeChapter = activeChapter;
    }

    const preference = await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        currentStep: dataToUpdate.currentStep || "not-started",
        activeChapter: dataToUpdate.activeChapter || 1,
      },
      update: dataToUpdate,
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

