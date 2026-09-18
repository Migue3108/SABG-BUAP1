"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import type { ReactNode } from "react";
import type { MunicipalStep } from "@/types/workflow";

const stepOrder: MunicipalStep[] = [
    "not-started",
    "diagnosis",
    "route",
    "instrument",
    "evidence",
    "tracking",
];

const getStepKey = (uid?: string) =>
    uid ? `sabg-step-${uid}` : "sabg-current-step";

const getChapterKey = (uid?: string) =>
    uid ? `sabg-chapter-${uid}` : "sabg-unlocked-chapter";

type MunicipalProgressContextValue = {
    currentStep: MunicipalStep;
    unlockedChapter: number;

    isUnlocked: (step: MunicipalStep) => boolean;
    isChapterUnlocked: (chapter: number) => boolean;
    isCompleted: (step: MunicipalStep) => boolean;

    completeStep: (step: MunicipalStep) => void;
    completeChapter: (chapter: number) => void;
    unlockChapter: (chapter: number) => void;

    setStep: (step: MunicipalStep) => void;
};

const MunicipalProgressContext =
    createContext<MunicipalProgressContextValue | null>(null);

type MunicipalProgressProviderProps = {
    children: ReactNode;
    userId?: string;
    initialStep?: MunicipalStep;
    initialChapter?: number;
};

function isMunicipalStep(value: string): value is MunicipalStep {
    return stepOrder.includes(value as MunicipalStep);
}

export function MunicipalProgressProvider({
    children,
    userId,
    initialStep = "not-started",
    initialChapter = 1,
}: MunicipalProgressProviderProps) {
    const [currentStep, setCurrentStep] =
        useState<MunicipalStep>(initialStep);
    const [unlockedChapter, setUnlockedChapter] =
        useState<number>(initialChapter);

    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        // 1. Purgar de inmediato claves globales anteriores para evitar que usuarios compartan progreso en la misma máquina
        if (typeof window !== "undefined") {
            localStorage.removeItem("sabg-current-step");
            localStorage.removeItem("sabg-unlocked-chapter");
        }

        const stepKey = getStepKey(userId);
        const chapterKey = getChapterKey(userId);

        // 2. Cargar clave exclusiva del usuario actual si existe en este dispositivo
        const saved =
            typeof window !== "undefined"
                ? localStorage.getItem(stepKey)
                : null;

        if (saved && isMunicipalStep(saved)) {
            setCurrentStep(saved);
        } else if (initialStep) {
            setCurrentStep(initialStep);
        }

        const savedChapterStr =
            typeof window !== "undefined"
                ? localStorage.getItem(chapterKey)
                : null;

        const savedChapter = Number(savedChapterStr);

        if (Number.isInteger(savedChapter) && savedChapter >= 1) {
            setUnlockedChapter(savedChapter);
        } else if (initialChapter) {
            setUnlockedChapter(initialChapter);
        }

        setHydrated(true);

        // 3. Sincronizar desde la base de datos para el usuario activo
        async function syncDbProgress() {
            try {
                const res = await fetch("/api/user/progress");
                if (res.ok) {
                    const data = await res.json();
                    if (data.currentStep && isMunicipalStep(data.currentStep)) {
                        setCurrentStep(data.currentStep);
                        if (typeof window !== "undefined") {
                            localStorage.setItem(stepKey, data.currentStep);
                        }
                    }
                    if (
                        typeof data.activeChapter === "number" &&
                        data.activeChapter >= 1
                    ) {
                        setUnlockedChapter(data.activeChapter);
                        if (typeof window !== "undefined") {
                            localStorage.setItem(
                                chapterKey,
                                String(data.activeChapter)
                            );
                        }
                    }
                }
            } catch {
                // Silencioso si falla fetch en modo offline
            }
        }

        syncDbProgress();
    }, [userId, initialStep, initialChapter]);

    const persistStep = useCallback(
        (step: MunicipalStep) => {
            setCurrentStep((previousStep) => {
                const previousIndex = stepOrder.indexOf(previousStep);
                const nextIndex = stepOrder.indexOf(step);

                if (previousIndex !== -1 && nextIndex < previousIndex) {
                    return previousStep;
                }

                if (typeof window !== "undefined") {
                    localStorage.setItem(getStepKey(userId), step);
                }

                // Guardar en la base de datos exclusivamente para este usuario
                fetch("/api/user/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ currentStep: step }),
                }).catch((err) => {
                    console.warn("No se pudo guardar el paso en base de datos:", err);
                });

                return step;
            });
        },
        [userId]
    );

    const currentIndex = stepOrder.indexOf(currentStep);

    const isUnlocked = useCallback(
        (step: MunicipalStep) => {
            if (currentStep === "not-started" && step === "diagnosis") {
                return true;
            }

            return stepOrder.indexOf(step) <= stepOrder.indexOf(currentStep);
        },
        [currentStep]
    );

    const isChapterUnlocked = useCallback(
        (chapter: number) => {
            // Capítulos 1 y 2 disponibles de manera inmediata para explorar
            if (chapter <= 2) {
                return true;
            }
            return chapter <= unlockedChapter;
        },
        [unlockedChapter]
    );

    const isCompleted = useCallback(
        (step: MunicipalStep) => {
            return stepOrder.indexOf(step) < currentIndex;
        },
        [currentIndex]
    );

    const completeStep = useCallback(
        (step: MunicipalStep) => {
            const stepIndex = stepOrder.indexOf(step);
            const curIndex = stepOrder.indexOf(currentStep);

            if (stepIndex === -1) {
                return;
            }

            const nextStep = stepOrder[stepIndex + 1];

            if (!nextStep) {
                return;
            }

            if (step === "diagnosis" && currentStep === "not-started") {
                persistStep("route");
                return;
            }

            if (stepIndex !== curIndex) {
                return;
            }

            persistStep(nextStep);
        },
        [currentStep, persistStep]
    );

    const completeChapter = useCallback(
        (chapter: number) => {
            setUnlockedChapter((previousChapter) => {
                if (chapter !== previousChapter) {
                    return previousChapter;
                }

                const nextChapter = chapter + 1;

                if (typeof window !== "undefined") {
                    localStorage.setItem(
                        getChapterKey(userId),
                        String(nextChapter)
                    );
                }

                // Persistir en base de datos para el usuario activo
                fetch("/api/user/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ activeChapter: nextChapter }),
                }).catch((err) => {
                    console.warn("No se pudo guardar el avance en base de datos:", err);
                });

                return nextChapter;
            });
        },
        [userId]
    );

    const unlockChapter = useCallback(
        (chapter: number) => {
            setUnlockedChapter((previousChapter) => {
                if (chapter <= previousChapter) {
                    return previousChapter;
                }

                if (typeof window !== "undefined") {
                    localStorage.setItem(
                        getChapterKey(userId),
                        String(chapter)
                    );
                }

                // Persistir en base de datos para el usuario activo
                fetch("/api/user/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ activeChapter: chapter }),
                }).catch((err) => {
                    console.warn("No se pudo guardar el desbloqueo en base de datos:", err);
                });

                return chapter;
            });
        },
        [userId]
    );

    const value = useMemo(
        () => ({
            currentStep,
            unlockedChapter,
            isUnlocked,
            isChapterUnlocked,
            isCompleted,
            completeStep,
            completeChapter,
            unlockChapter,
            setStep: persistStep,
        }),
        [
            currentStep,
            unlockedChapter,
            isUnlocked,
            isChapterUnlocked,
            isCompleted,
            completeStep,
            completeChapter,
            unlockChapter,
            persistStep,
        ]
    );

    if (!hydrated) {
        return null;
    }

    return (
        <MunicipalProgressContext.Provider value={value}>
            {children}
        </MunicipalProgressContext.Provider>
    );
}

export function useMunicipalProgress() {
    const context = useContext(MunicipalProgressContext);

    if (!context) {
        throw new Error(
            "useMunicipalProgress debe utilizarse dentro de MunicipalProgressProvider."
        );
    }

    return context;
}