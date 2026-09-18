"use client";

import { useMemo } from "react";

import { municipalNavigationBase } from "@/config/navigation/municipal-navigation";
import { useMunicipalProgress } from "@/contexts/municipal-progress-context";

export function useMunicipalNavigation(_role?: string) {
    const {
        isUnlocked,
        isChapterUnlocked,
    } = useMunicipalProgress();

    return useMemo(() => {
        return {
            items: municipalNavigationBase.items.map((item) => ({
                ...item,

                disabled: item.chapter
                    ? !isChapterUnlocked(item.chapter)
                    : item.step
                        ? !isUnlocked(item.step)
                        : item.disabled,

                children: item.children?.map((child) => ({
                    ...child,

                    disabled: child.step
                        ? !isUnlocked(child.step)
                        : child.disabled,
                })),
            })),
        };
    }, [isChapterUnlocked, isUnlocked]);
}