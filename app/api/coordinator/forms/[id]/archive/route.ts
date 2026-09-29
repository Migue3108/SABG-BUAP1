import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

// POST: Archivar el formulario (deja de estar disponible para los municipios)
export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { response } = await requireApiUser(["coordinator"]);
    if (response) return response;

    const { id } = await params;
    const form = await prisma.diagnosticForm.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!form) {
      return NextResponse.json(
        { error: "Formulario no encontrado" },
        { status: 404 }
      );
    }

    if (form.status === "archivado") {
      return NextResponse.json(
        { error: "El formulario ya está archivado" },
        { status: 409 }
      );
    }

    await prisma.diagnosticForm.update({
      where: { id },
      data: { status: "archivado" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API_COORDINATOR_FORM_ARCHIVE] Error:", error);
    return NextResponse.json(
      { error: "Error al archivar el formulario" },
      { status: 500 }
    );
  }
}
