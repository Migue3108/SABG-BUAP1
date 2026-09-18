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

    const preference = await prisma.userPreference.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      success: true,
      theme: preference?.theme || "light",
      shortcuts: (preference?.shortcuts as any) || [],
    });
  } catch (error) {
    console.error("Error al obtener preferencias de usuario:", error);
    return NextResponse.json(
      { error: "Error interno al consultar preferencias" },
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
    const { theme, shortcuts } = body;

    const dataToUpdate: Record<string, any> = {};

    if (theme && (theme === "light" || theme === "dark")) {
      dataToUpdate.theme = theme;
    }

    if (Array.isArray(shortcuts)) {
      // Máximo 3 atajos permitidos
      dataToUpdate.shortcuts = shortcuts.slice(0, 3);
    }

    const preference = await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        theme: dataToUpdate.theme || "light",
        shortcuts: dataToUpdate.shortcuts || [],
      },
      update: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      theme: preference.theme,
      shortcuts: (preference.shortcuts as any) || [],
    });
  } catch (error) {
    console.error("Error al guardar preferencias de usuario:", error);
    return NextResponse.json(
      { error: "Error al actualizar preferencias" },
      { status: 500 }
    );
  }
}

