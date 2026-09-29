import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  DiagnosticFormInput,
  DiagnosticFormStatus,
  DiagnosticFormSummary,
  DiagnosticFormTree,
  DiagnosticResponsesReport,
} from "@/types/diagnostic-form";

export const DIAGNOSTIC_CHAPTER = 2;

export const LIMITS = {
  title: 200,
  description: 2000,
  sectionTitle: 200,
  questionText: 1000,
  helpText: 1000,
  comment: 1000,
  sections: 50,
  questionsPerSection: 100,
} as const;

const formTreeInclude = {
  sections: {
    orderBy: { order: "asc" },
    include: {
      questions: { orderBy: { order: "asc" } },
    },
  },
  _count: { select: { submissions: true } },
} satisfies Prisma.DiagnosticFormInclude;

type FormWithTree = Prisma.DiagnosticFormGetPayload<{
  include: typeof formTreeInclude;
}>;

export function serializeFormTree(form: FormWithTree): DiagnosticFormTree {
  return {
    id: form.id,
    title: form.title,
    description: form.description,
    chapterNumber: form.chapterNumber,
    status: form.status as DiagnosticFormStatus,
    publishedAt: form.publishedAt?.toISOString() ?? null,
    createdAt: form.createdAt.toISOString(),
    updatedAt: form.updatedAt.toISOString(),
    submissionCount: form._count.submissions,
    sections: form.sections.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      order: section.order,
      questions: section.questions.map((question) => ({
        id: question.id,
        text: question.text,
        helpText: question.helpText,
        type: "likert",
        order: question.order,
      })),
    })),
  };
}

export async function getFormTree(
  id: string
): Promise<DiagnosticFormTree | null> {
  const form = await prisma.diagnosticForm.findUnique({
    where: { id },
    include: formTreeInclude,
  });

  return form ? serializeFormTree(form) : null;
}

export async function getPublishedFormTree(): Promise<DiagnosticFormTree | null> {
  const form = await prisma.diagnosticForm.findFirst({
    where: { chapterNumber: DIAGNOSTIC_CHAPTER, status: "publicado" },
    orderBy: { publishedAt: "desc" },
    include: formTreeInclude,
  });

  return form ? serializeFormTree(form) : null;
}

export async function listFormSummaries(): Promise<DiagnosticFormSummary[]> {
  const forms = await prisma.diagnosticForm.findMany({
    where: { chapterNumber: DIAGNOSTIC_CHAPTER },
    orderBy: { updatedAt: "desc" },
    include: {
      sections: { select: { _count: { select: { questions: true } } } },
      _count: { select: { submissions: true } },
    },
  });

  return forms.map((form) => ({
    id: form.id,
    title: form.title,
    description: form.description,
    status: form.status as DiagnosticFormStatus,
    publishedAt: form.publishedAt?.toISOString() ?? null,
    updatedAt: form.updatedAt.toISOString(),
    sectionCount: form.sections.length,
    questionCount: form.sections.reduce(
      (total, section) => total + section._count.questions,
      0
    ),
    submissionCount: form._count.submissions,
  }));
}

// Un formulario solo se edita mientras es borrador y nadie lo ha respondido
export function isFormLocked(form: {
  status: string;
  submissionCount: number;
}): boolean {
  return form.status !== "borrador" || form.submissionCount > 0;
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptionalText(value: unknown): string | null {
  const text = cleanText(value);
  return text === "" ? null : text;
}

type ParseResult =
  | { data: DiagnosticFormInput; error?: never }
  | { data?: never; error: string };

// Valida el árbol que envía el constructor. Permite borradores incompletos
// (secciones sin preguntas), pero no textos vacíos ni demasiado largos.
export function parseFormInput(body: unknown): ParseResult {
  if (!body || typeof body !== "object") {
    return { error: "Cuerpo de la solicitud inválido" };
  }

  const raw = body as Record<string, unknown>;
  const title = cleanText(raw.title);

  if (!title) {
    return { error: "El formulario necesita un título" };
  }

  if (title.length > LIMITS.title) {
    return { error: `El título admite máximo ${LIMITS.title} caracteres` };
  }

  const description = cleanOptionalText(raw.description);

  if (description && description.length > LIMITS.description) {
    return {
      error: `La descripción admite máximo ${LIMITS.description} caracteres`,
    };
  }

  if (!Array.isArray(raw.sections)) {
    return { error: "Se requiere la lista de categorías" };
  }

  if (raw.sections.length > LIMITS.sections) {
    return { error: `Máximo ${LIMITS.sections} categorías por formulario` };
  }

  const sections: DiagnosticFormInput["sections"] = [];

  for (const [sectionIndex, rawSection] of raw.sections.entries()) {
    const section = (rawSection ?? {}) as Record<string, unknown>;
    const sectionTitle = cleanText(section.title);
    const label = `Categoría ${sectionIndex + 1}`;

    if (!sectionTitle) {
      return { error: `${label}: falta el nombre` };
    }

    if (sectionTitle.length > LIMITS.sectionTitle) {
      return {
        error: `${label}: el nombre admite máximo ${LIMITS.sectionTitle} caracteres`,
      };
    }

    const sectionDescription = cleanOptionalText(section.description);

    if (sectionDescription && sectionDescription.length > LIMITS.description) {
      return {
        error: `${label}: la descripción admite máximo ${LIMITS.description} caracteres`,
      };
    }

    if (!Array.isArray(section.questions)) {
      return { error: `${label}: lista de preguntas inválida` };
    }

    if (section.questions.length > LIMITS.questionsPerSection) {
      return {
        error: `${label}: máximo ${LIMITS.questionsPerSection} preguntas`,
      };
    }

    const questions: DiagnosticFormInput["sections"][number]["questions"] = [];

    for (const [questionIndex, rawQuestion] of section.questions.entries()) {
      const question = (rawQuestion ?? {}) as Record<string, unknown>;
      const text = cleanText(question.text);
      const questionLabel = `${label}, pregunta ${questionIndex + 1}`;

      if (!text) {
        return { error: `${questionLabel}: falta el texto` };
      }

      if (text.length > LIMITS.questionText) {
        return {
          error: `${questionLabel}: máximo ${LIMITS.questionText} caracteres`,
        };
      }

      const helpText = cleanOptionalText(question.helpText);

      if (helpText && helpText.length > LIMITS.helpText) {
        return {
          error: `${questionLabel}: la ayuda admite máximo ${LIMITS.helpText} caracteres`,
        };
      }

      questions.push({ text, helpText });
    }

    sections.push({
      title: sectionTitle,
      description: sectionDescription,
      questions,
    });
  }

  return { data: { title, description, sections } };
}

// Reglas para publicar: al menos una categoría y ninguna vacía
export function getPublishError(form: DiagnosticFormTree): string | null {
  if (form.sections.length === 0) {
    return "Agrega al menos una categoría antes de publicar";
  }

  const emptySection = form.sections.find(
    (section) => section.questions.length === 0
  );

  if (emptySection) {
    return `La categoría "${emptySection.title}" no tiene preguntas`;
  }

  return null;
}

export function buildSectionsCreate(
  sections: DiagnosticFormInput["sections"]
): Prisma.DiagnosticFormSectionCreateWithoutFormInput[] {
  return sections.map((section, sectionIndex) => ({
    title: section.title,
    description: section.description ?? null,
    order: sectionIndex,
    questions: {
      create: section.questions.map((question, questionIndex) => ({
        text: question.text,
        helpText: question.helpText ?? null,
        type: "likert",
        order: questionIndex,
      })),
    },
  }));
}

function roundScore(value: number): number {
  return Math.round(value * 100) / 100;
}

export function averageOf(values: number[]): number | null {
  if (values.length === 0) return null;
  return roundScore(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export async function getFormResponses(
  id: string
): Promise<DiagnosticResponsesReport | null> {
  const form = await getFormTree(id);
  if (!form) return null;

  const submissions = await prisma.diagnosticSubmission.findMany({
    where: { formId: id },
    orderBy: { submittedAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      answers: {
        select: { questionId: true, value: true, comment: true },
      },
    },
  });

  const valuesByQuestion = new Map<string, number[]>();

  for (const submission of submissions) {
    for (const answer of submission.answers) {
      const values = valuesByQuestion.get(answer.questionId) ?? [];
      values.push(answer.value);
      valuesByQuestion.set(answer.questionId, values);
    }
  }

  const questionStats = form.sections.flatMap((section) =>
    section.questions.map((question) => {
      const values = valuesByQuestion.get(question.id) ?? [];
      const distribution: Record<number, number> = {};

      for (const value of values) {
        distribution[value] = (distribution[value] ?? 0) + 1;
      }

      return {
        questionId: question.id,
        average: averageOf(values),
        distribution,
      };
    })
  );

  return {
    form,
    overallAverage: averageOf(submissions.map((submission) => submission.averageScore)),
    questionStats,
    submissions: submissions.map((submission) => ({
      id: submission.id,
      userName: submission.user.name,
      userEmail: submission.user.email,
      institution: submission.institution,
      averageScore: submission.averageScore,
      submittedAt: submission.submittedAt.toISOString(),
      answers: submission.answers,
    })),
  };
}
