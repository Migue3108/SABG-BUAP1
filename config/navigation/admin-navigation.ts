import type { NavigationConfig } from "@/types/navigation";
import { routes } from "@/config/routes";

export const adminNavigation: NavigationConfig = {
    items: [
        {
            id: "admin-dashboard",
            label: "Resumen",
            path: routes.admin.home,
            icon: "home",
        },
        {
            id: "admin-users",
            label: "Usuarios",
            path: routes.admin.users,
            icon: "users",
        },
        {
            id: "admin-municipalities",
            label: "Municipios",
            path: routes.admin.municipalities,
            icon: "building",
        },
        {
            id: "admin-audit",
            label: "Registro de auditoría",
            path: routes.admin.audit,
            icon: "audit",
        },
        {
            id: "admin-profile",
            label: "Perfil",
            path: routes.admin.profile,
            icon: "users",
        },
        {
            id: "admin-preferences",
            label: "Preferencias",
            path: routes.admin.preferences,
            icon: "chapter",
        },
    ],
};
