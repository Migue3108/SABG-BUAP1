import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/api-auth";
import { getFormResponses } from "@/lib/diagnostic-forms";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

// GET: Respuestas del formulario con promedios por pregunta
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { response } = await requireApiUser(["coordinator"]);
    if (response) return response;

    const { id } = await params;
    const report = await getFormResponses(id);

    if (!report) {
      return NextResponse.json(
        { error: "Formulario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("[API_COORDINATOR_FORM_RESPONSES] Error:", error);
    return NextResponse.json(
      { error: "Error al consultar las respuestas" },
      { status: 500 }
    );
  }
}
