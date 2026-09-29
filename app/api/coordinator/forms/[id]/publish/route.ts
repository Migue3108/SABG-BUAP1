import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { getFormTree, getPublishError } from "@/lib/diagnostic-forms";

type RouteParams = { params: Promise<{ id: string }> };

// POST: Publicar el formulario. Archiva cualquier otro publicado del capítulo.
export async function POST(_request: Request, { params }: RouteParams) {
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

    if (form.status !== "borrador") {
      return NextResponse.json(
        { error: "Solo se pueden publicar formularios en borrador" },
        { status: 409 }
      );
    }

    const publishError = getPublishError(form);

    if (publishError) {
      return NextResponse.json({ error: publishError }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.diagnosticForm.updateMany({
        where: {
          chapterNumber: form.chapterNumber,
          status: "publicado",
          id: { not: id },
        },
        data: { status: "archivado" },
      }),
      prisma.diagnosticForm.update({
        where: { id },
        data: { status: "publicado", publishedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ form: await getFormTree(id) });
  } catch (error) {
    console.error("[API_COORDINATOR_FORM_PUBLISH] Error:", error);
    return NextResponse.json(
      { error: "Error al publicar el formulario" },
      { status: 500 }
    );
  }
}
