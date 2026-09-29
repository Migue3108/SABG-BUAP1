import type { MunicipalStep } from "@/types/workflow";
export type NavigationIcon =
    | "home"
    | "chapter"
    | "tracking"
    | "resources"
    | "help"
    | "users"
    | "building"
    | "audit"
    | "form";

export type ChapterNavigationStatus =
    | "completed"
    | "current"
    | "pending";

export type NavigationChild = {
    label: string;
    path: string;
    step?: MunicipalStep;
    disabled?: boolean;
};

export type NavigationItem = {
    id: string;
    label: string;
    description?: string;
    path?: string;
    icon: NavigationIcon;
    chapter?: number;
    step?: MunicipalStep;
    status?: ChapterNavigationStatus;
    disabled?: boolean;
    children?: NavigationChild[];
};

export type NavigationConfig = {
    items: NavigationItem[];
};