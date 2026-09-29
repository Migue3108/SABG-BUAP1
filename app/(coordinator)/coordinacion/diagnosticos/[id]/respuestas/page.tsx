import { notFound } from "next/navigation";

import { FormResponses } from "@/components/coordinator/forms/form-responses";
import { getFormResponses } from "@/lib/diagnostic-forms";

export const metadata = {
    title: "Respuestas del diagnóstico · Coordinación SABG-BUAP",
};

export default async function CoordinatorFormResponsesPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const report = await getFormResponses(id);

    if (!report) {
        notFound();
    }

    return (
        <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
            <div className="mx-auto max-w-6xl">
                <FormResponses report={report} />
            </div>
        </main>
    );
}
