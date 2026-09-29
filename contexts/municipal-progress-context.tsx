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
import { enqueue, requestSync } from "@/lib/offline/outbox";

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

function furthestStep(a: MunicipalStep, b: MunicipalStep): MunicipalStep {
    return stepOrder.indexOf(a) >= stepOrder.indexOf(b) ? a : b;
}

type ProgressUpdate = {
    currentStep?: MunicipalStep;
    activeChapter?: number;
};

// Encola el avance para enviarlo al servidor; si no hay conexión se queda
// guardado en el dispositivo y se envía al reconectar.
function saveProgressRemotely(userId: string | undefined, update: ProgressUpdate) {
    if (!userId) {
        fetch("/api/user/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(update),
        }).catch(() => {});
        return;
    }

    enqueue({
        userId,
        kind: "progress",
        url: "/api/user/progress",
        body: update,
        dedupeKey: "progress",
    })
        .then(requestSync)
        .catch((err) => {
            console.warn("No se pudo guardar el avance en el dispositivo:", err);
        });
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

        // 2. Tomar el avance más lejano entre este dispositivo y lo que envió el servidor
        const saved =
            typeof window !== "undefined"
                ? localStorage.getItem(stepKey)
                : null;

        let localStep: MunicipalStep = initialStep;

        if (saved && isMunicipalStep(saved)) {
            localStep = furthestStep(saved, initialStep);
        }

        const savedChapter = Number(
            typeof window !== "undefined"
                ? localStorage.getItem(chapterKey)
                : null
        );

        const localChapter =
            Number.isInteger(savedChapter) && savedChapter >= 1
                ? Math.max(savedChapter, initialChapter)
                : initialChapter;

        setCurrentStep(localStep);
        setUnlockedChapter(localChapter);

        if (typeof window !== "undefined") {
            localStorage.setItem(stepKey, localStep);
            localStorage.setItem(chapterKey, String(localChapter));
        }

        setHydrated(true);

        // 3. Fusionar con la base de datos: nunca se retrocede, y si el dispositivo
        // va adelante (avance hecho sin conexión) se sube al servidor
        async function syncDbProgress() {
            try {
                const res = await fetch("/api/user/progress", {
                    cache: "no-store",
                });

                if (!res.ok) return;

                const data = await res.json();

                const dbStep: MunicipalStep =
                    typeof data.currentStep === "string" && isMunicipalStep(data.currentStep)
                        ? data.currentStep
                        : "not-started";

                const dbChapter =
                    typeof data.activeChapter === "number" && data.activeChapter >= 1
                        ? data.activeChapter
                        : 1;

                const mergedStep = furthestStep(localStep, dbStep);
                const mergedChapter = Math.max(localChapter, dbChapter);

                setCurrentStep((previous) => furthestStep(previous, mergedStep));
                setUnlockedChapter((previous) => Math.max(previous, mergedChapter));

                if (typeof window !== "undefined") {
                    localStorage.setItem(stepKey, mergedStep);
                    localStorage.setItem(chapterKey, String(mergedChapter));
                }

                if (mergedStep !== dbStep || mergedChapter !== dbChapter) {
                    saveProgressRemotely(userId, {
                        currentStep: mergedStep,
                        activeChapter: mergedChapter,
                    });
                }
            } catch {
                // Sin conexión: se conserva el avance local
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

                saveProgressRemotely(userId, { currentStep: step });

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

                saveProgressRemotely(userId, { activeChapter: nextChapter });

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

                saveProgressRemotely(userId, { activeChapter: chapter });

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