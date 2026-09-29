import { CircleHelp } from "lucide-react";

export const metadata = {
    title: "Ayuda · Coordinación SABG-BUAP",
};

const steps = [
    {
        title: "Crea un diagnóstico",
        body: "En Diagnósticos, usa “Nuevo diagnóstico”. Se crea un borrador con una categoría inicial.",
    },
    {
        title: "Organiza por categorías",
        body: "Agrega categorías (por ejemplo: Planeación, Control interno, Transparencia) y dentro de cada una las preguntas. Puedes reordenarlas con las flechas.",
    },
    {
        title: "Escala y comentarios",
        body: "Todas las preguntas usan una escala Likert de 5 puntos y son obligatorias para el municipio. El municipio puede agregar un comentario opcional en cada pregunta.",
    },
    {
        title: "Revisa y publica",
        body: "Usa “Vista previa” para ver el formulario como lo verá el municipio. Al publicar, se archiva el diagnóstico publicado anterior y el nuevo aparece en el Capítulo 2.",
    },
    {
        title: "Cambios después de publicar",
        body: "Un diagnóstico publicado o con respuestas no se puede editar, para no alterar respuestas ya enviadas. Usa “Duplicar” para crear una nueva versión en borrador.",
    },
    {
        title: "Consulta resultados",
        body: "En “Respuestas” verás el promedio general, el promedio y la distribución de cada pregunta, los comentarios y el detalle por municipio.",
    },
];

export default function CoordinatorHelpPage() {
    return (
        <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
            <div className="mx-auto max-w-4xl space-y-6">
                <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
                    <div className="flex items-center gap-3 text-primary">
                        <CircleHelp className="h-6 w-6" />
                        <p className="text-sm font-semibold">Centro de ayuda</p>
                    </div>
                    <h1 className="mt-2 text-2xl font-bold text-text-primary md:text-3xl">
                        Cómo usar el constructor de diagnósticos
                    </h1>
                </section>

                <ol className="space-y-4">
                    {steps.map((step, index) => (
                        <li
                            key={step.title}
                            className="flex gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm"
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                                {index + 1}
                            </span>
                            <div>
                                <h2 className="text-sm font-semibold text-text-primary">
                                    {step.title}
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-text-secondary">
                                    {step.body}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </main>
    );
}
