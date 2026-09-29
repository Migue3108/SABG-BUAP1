import { notFound } from "next/navigation";

import { FormBuilder } from "@/components/coordinator/forms/form-builder";
import { getFormTree } from "@/lib/diagnostic-forms";

export const metadata = {
    title: "Constructor de diagnóstico · Coordinación SABG-BUAP",
};

export default async function CoordinatorFormPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const form = await getFormTree(id);

    if (!form) {
        notFound();
    }

    return (
        <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
            <div className="mx-auto max-w-5xl">
                <FormBuilder key={form.updatedAt} initialForm={form} />
            </div>
        </main>
    );
}
