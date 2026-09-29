import { FormsManagerClient } from "@/components/coordinator/forms/forms-manager-client";
import { listFormSummaries } from "@/lib/diagnostic-forms";

export const metadata = {
    title: "Diagnósticos · Coordinación SABG-BUAP",
};

export default async function CoordinatorFormsPage() {
    const forms = await listFormSummaries();

    return (
        <main className="flex-1 bg-background px-4 py-6 md:px-6 md:py-8 lg:p-8">
            <div className="mx-auto max-w-7xl">
                <FormsManagerClient initialForms={forms} />
            </div>
        </main>
    );
}
