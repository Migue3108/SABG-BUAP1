import type { NavigationConfig } from "@/types/navigation";
import { routes } from "@/config/routes";

export const coordinatorNavigation: NavigationConfig = {
    items: [
        {
            id: "coordinator-dashboard",
            label: "Resumen",
            path: routes.coordinator.home,
            icon: "home",
        },
        {
            id: "coordinator-forms",
            label: "Diagnósticos",
            description: "Constructor de formularios",
            path: routes.coordinator.forms,
            icon: "form",
        },
        {
            id: "coordinator-profile",
            label: "Perfil",
            path: routes.coordinator.profile,
            icon: "users",
        },
    ],
};
