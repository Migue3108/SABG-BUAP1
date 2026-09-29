export type LikertOption = {
    value: number;
    label: string;
};

// Escala fija de 5 puntos para las preguntas del diagnóstico
export const likertScale: LikertOption[] = [
    { value: 1, label: "Totalmente en desacuerdo" },
    { value: 2, label: "En desacuerdo" },
    { value: 3, label: "Ni de acuerdo ni en desacuerdo" },
    { value: 4, label: "De acuerdo" },
    { value: 5, label: "Totalmente de acuerdo" },
];

export const LIKERT_MIN = 1;
export const LIKERT_MAX = 5;

export function isLikertValue(value: unknown): value is number {
    return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= LIKERT_MIN &&
        value <= LIKERT_MAX
    );
}
