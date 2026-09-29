export type DiagnosticFormStatus =
    | "borrador"
    | "publicado"
    | "archivado";

export type DiagnosticQuestion = {
    id: string;
    text: string;
    helpText: string | null;
    type: "likert";
    order: number;
};

export type DiagnosticSection = {
    id: string;
    title: string;
    description: string | null;
    order: number;
    questions: DiagnosticQuestion[];
};

export type DiagnosticFormTree = {
    id: string;
    title: string;
    description: string | null;
    chapterNumber: number;
    status: DiagnosticFormStatus;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    submissionCount: number;
    sections: DiagnosticSection[];
};

export type DiagnosticFormSummary = {
    id: string;
    title: string;
    description: string | null;
    status: DiagnosticFormStatus;
    publishedAt: string | null;
    updatedAt: string;
    sectionCount: number;
    questionCount: number;
    submissionCount: number;
};

// Cuerpo que envía el constructor al guardar
export type DiagnosticFormInput = {
    title: string;
    description?: string | null;
    sections: {
        title: string;
        description?: string | null;
        questions: {
            text: string;
            helpText?: string | null;
        }[];
    }[];
};

export type DiagnosticAnswerInput = {
    questionId: string;
    value: number;
    comment?: string | null;
};

export type DiagnosticSubmissionView = {
    id: string;
    averageScore: number;
    submittedAt: string;
    answers: {
        questionId: string;
        value: number;
        comment: string | null;
    }[];
};

export type DiagnosticQuestionStats = {
    questionId: string;
    average: number | null;
    distribution: Record<number, number>;
};

export type DiagnosticResponsesReport = {
    form: DiagnosticFormTree;
    overallAverage: number | null;
    questionStats: DiagnosticQuestionStats[];
    submissions: {
        id: string;
        userName: string;
        userEmail: string;
        institution: string | null;
        averageScore: number;
        submittedAt: string;
        answers: {
            questionId: string;
            value: number;
            comment: string | null;
        }[];
    }[];
};
