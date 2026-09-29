import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { isLikertValue } from "@/config/likert";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import {
  LIMITS,
  averageOf,
  getPublishedFormTree,
} from "@/lib/diagnostic-forms";
import type { DiagnosticSubmissionView } from "@/types/diagnostic-form";

export const dynamic = "force-dynamic";

// Roles que usan el panel municipal
const MUNICIPAL_ROLES = ["municipal", "student", "teacher"] as const;

async function findSubmission(
  formId: string,
  userId: string
): Promise<DiagnosticSubmissionView | null> {
  const submission = await prisma.diagnosticSubmission.findUnique({
    where: { formId_userId: { formId, userId } },
    include: {
      answers: { select: { questionId: true, value: true, comment: true } },
    },
  });

  if (!submission) return null;

  return {
    id: submission.id,
    averageScore: submission.averageScore,
    submittedAt: submission.submittedAt.toISOString(),
    answers: submission.answers,
  };
}

// GET: Formulario publicado del Capítulo 2 y la respuesta del usuario (si existe)
export async function GET() {
  try {
    const { user, response } = await requireApiUser(MUNICIPAL_ROLES);
    if (response) return response;

    const form = await getPublishedFormTree();

    if (!form) {
      return NextResponse.json({ form: null, submission: null });
    }

    const submission = await findSubmission(form.id, user.id);

    return NextResponse.json({ form, submission });
  } catch (error) {
    console.error("[API_MUNICIPAL_DIAGNOSTIC_GET] Error:", error);
    return NextResponse.json(
      { error: "Error al consultar el diagnóstico" },
      { status: 500 }
    );
  }
}

// POST: Enviar respuestas. Todas las preguntas son obligatorias; el comentario es opcional.
export async function POST(request: Request) {
  try {
    const { user, response } = await requireApiUser(MUNICIPAL_ROLES);
    if (response) return response;

    const body = (await request.json().catch(() => null)) as {
      formId?: unknown;
      answers?: unknown;
    } | null;

    if (!body || typeof body.formId !== "string" || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: "Se requieren el formulario y la lista de respuestas" },
        { status: 400 }
      );
    }

    const form = await getPublishedFormTree();

    if (!form || form.id !== body.formId) {
      return NextResponse.json(
        {
          error:
            "El formulario ya no está disponible. Recarga la página para ver la versión vigente.",
        },
        { status: 409 }
      );
    }

    const answersByQuestion = new Map<string, { value: number; comment: string | null }>();

    for (const rawAnswer of body.answers) {
      const answer = (rawAnswer ?? {}) as Record<string, unknown>;

      if (typeof answer.questionId !== "string" || !isLikertValue(answer.value)) {
        return NextResponse.json(
          { error: "Cada respuesta debe tener un valor entre 1 y 5" },
          { status: 400 }
        );
      }

      const comment =
        typeof answer.comment === "string" && answer.comment.trim() !== ""
          ? answer.comment.trim()
          : null;

      if (comment && comment.length > LIMITS.comment) {
        return NextResponse.json(
          { error: `Los comentarios admiten máximo ${LIMITS.comment} caracteres` },
          { status: 400 }
        );
      }

      answersByQuestion.set(answer.questionId, { value: answer.value, comment });
    }

    const questions = form.sections.flatMap((section) => section.questions);
    const questionIds = new Set(questions.map((question) => question.id));
    const missing = questions.filter((question) => !answersByQuestion.has(question.id));

    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: `Faltan ${missing.length} pregunta(s) por responder`,
          missingQuestionIds: missing.map((question) => question.id),
        },
        { status: 400 }
      );
    }

    if ([...answersByQuestion.keys()].some((questionId) => !questionIds.has(questionId))) {
      return NextResponse.json(
        { error: "Hay respuestas que no pertenecen a este formulario" },
        { status: 400 }
      );
    }

    const answers = questions.map((question) => ({
      questionId: question.id,
      ...answersByQuestion.get(question.id)!,
    }));

    try {
      await prisma.diagnosticSubmission.create({
        data: {
          formId: form.id,
          userId: user.id,
          institution: user.institution,
          averageScore: averageOf(answers.map((answer) => answer.value)) ?? 0,
          answers: { create: answers },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return NextResponse.json(
          { error: "Ya respondiste este diagnóstico" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { submission: await findSubmission(form.id, user.id) },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API_MUNICIPAL_DIAGNOSTIC_POST] Error:", error);
    return NextResponse.json(
      { error: "Error al guardar el diagnóstico" },
      { status: 500 }
    );
  }
}
