import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import {
  buildSectionsCreate,
  getFormTree,
  isFormLocked,
  parseFormInput,
} from "@/lib/diagnostic-forms";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

const LOCKED_MESSAGE =
  "Este formulario ya no se puede editar porque está publicado, archivado o tiene respuestas. Duplícalo para crear una nueva versión.";

// GET: Obtener el formulario completo
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { response } = await requireApiUser(["coordinator"]);
    if (response) return response;

    const { id } = await params;
    const form = await getFormTree(id);

    if (!form) {
      return NextResponse.json(
        { error: "Formulario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ form });
  } catch (error) {
    console.error("[API_COORDINATOR_FORM_GET] Error:", error);
    return NextResponse.json(
      { error: "Error al consultar el formulario" },
      { status: 500 }
    );
  }
}

// PUT: Reemplazar título, descripción, categorías y preguntas
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { response } = await requireApiUser(["coordinator"]);
    if (response) return response;

    const { id } = await params;
    const current = await getFormTree(id);

    if (!current) {
      return NextResponse.json(
        { error: "Formulario no encontrado" },
        { status: 404 }
      );
    }

    if (isFormLocked(current)) {
      return NextResponse.json({ error: LOCKED_MESSAGE }, { status: 409 });
    }

    const parsed = parseFormInput(await request.json().catch(() => null));

    if (parsed.error !== undefined) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { title, description, sections } = parsed.data;

    await prisma.$transaction([
      prisma.diagnosticFormSection.deleteMany({ where: { formId: id } }),
      prisma.diagnosticForm.update({
        where: { id },
        data: {
          title,
          description: description ?? null,
          sections: { create: buildSectionsCreate(sections) },
        },
      }),
    ]);

    const form = await getFormTree(id);

    return NextResponse.json({ form });
  } catch (error) {
    console.error("[API_COORDINATOR_FORM_PUT] Error:", error);
    return NextResponse.json(
      { error: "Error al guardar el formulario" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un borrador sin respuestas
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { response } = await requireApiUser(["coordinator"]);
    if (response) return response;

    const { id } = await params;
    const current = await getFormTree(id);

    if (!current) {
      return NextResponse.json(
        { error: "Formulario no encontrado" },
        { status: 404 }
      );
    }

    if (isFormLocked(current)) {
      return NextResponse.json(
        {
          error:
            "Solo se pueden eliminar borradores sin respuestas. Archiva el formulario en su lugar.",
        },
        { status: 409 }
      );
    }

    await prisma.diagnosticForm.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API_COORDINATOR_FORM_DELETE] Error:", error);
    return NextResponse.json(
      { error: "Error al eliminar el formulario" },
      { status: 500 }
    );
  }
}
