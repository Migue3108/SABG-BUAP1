import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import {
  DIAGNOSTIC_CHAPTER,
  listFormSummaries,
} from "@/lib/diagnostic-forms";

export const dynamic = "force-dynamic";

// GET: Listar formularios de diagnóstico
export async function GET() {
  try {
    const { response } = await requireApiUser(["coordinator"]);
    if (response) return response;

    const forms = await listFormSummaries();

    return NextResponse.json({ forms });
  } catch (error) {
    console.error("[API_COORDINATOR_FORMS_GET] Error:", error);
    return NextResponse.json(
      { error: "Error al consultar los formularios" },
      { status: 500 }
    );
  }
}

// POST: Crear un borrador nuevo con una categoría inicial
export async function POST() {
  try {
    const { user, response } = await requireApiUser(["coordinator"]);
    if (response) return response;

    const form = await prisma.diagnosticForm.create({
      data: {
        title: "Diagnóstico municipal sin título",
        chapterNumber: DIAGNOSTIC_CHAPTER,
        createdById: user.id,
        sections: {
          create: [
            {
              title: "Categoría 1",
              order: 0,
            },
          ],
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ id: form.id }, { status: 201 });
  } catch (error) {
    console.error("[API_COORDINATOR_FORMS_POST] Error:", error);
    return NextResponse.json(
      { error: "Error al crear el formulario" },
      { status: 500 }
    );
  }
}
