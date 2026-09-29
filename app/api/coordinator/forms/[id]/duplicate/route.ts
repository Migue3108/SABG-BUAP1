import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { buildSectionsCreate, getFormTree } from "@/lib/diagnostic-forms";

type RouteParams = { params: Promise<{ id: string }> };

// POST: Crear un borrador nuevo copiando categorías y preguntas
export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { user, response } = await requireApiUser(["coordinator"]);
    if (response) return response;

    const { id } = await params;
    const source = await getFormTree(id);

    if (!source) {
      return NextResponse.json(
        { error: "Formulario no encontrado" },
        { status: 404 }
      );
    }

    const copy = await prisma.diagnosticForm.create({
      data: {
        title: `${source.title} (copia)`.slice(0, 200),
        description: source.description,
        chapterNumber: source.chapterNumber,
        createdById: user.id,
        sections: { create: buildSectionsCreate(source.sections) },
      },
      select: { id: true },
    });

    return NextResponse.json({ id: copy.id }, { status: 201 });
  } catch (error) {
    console.error("[API_COORDINATOR_FORM_DUPLICATE] Error:", error);
    return NextResponse.json(
      { error: "Error al duplicar el formulario" },
      { status: 500 }
    );
  }
}
