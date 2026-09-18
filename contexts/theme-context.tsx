"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme = "light",
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const pathname = usePathname();
  const isAuthOrPublic =
    !pathname ||
    pathname === "/" ||
    pathname === "/conocenos" ||
    pathname.startsWith("/auth");

  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [mounted, setMounted] = useState(false);

  function applyThemeClass(t: Theme) {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (t === "dark") {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
      }
    }
  }

  function resetTheme() {
    setThemeState("light");
    applyThemeClass("light");
    if (typeof window !== "undefined") {
      localStorage.removeItem("sabg-theme");
      document.cookie =
        "sabg-theme=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }
  }

  // Sincronizar tema de forma estable y natural
  useEffect(() => {
    setMounted(true);

    // 1. Revisar si hay tema guardado en localStorage
    const local = localStorage.getItem("sabg-theme") as Theme | null;
    if (local === "light" || local === "dark") {
      setThemeState(local);
      applyThemeClass(local);
    } else if (initialTheme) {
      applyThemeClass(initialTheme);
    }

    // 2. Sincronizar con la base de datos para el usuario actualmente activo
    async function syncDbTheme() {
      try {
        const res = await fetch("/api/user/preferences");
        if (res.ok) {
          const data = await res.json();
          if (data.theme && (data.theme === "light" || data.theme === "dark")) {
            setThemeState(data.theme);
            applyThemeClass(data.theme);
            localStorage.setItem("sabg-theme", data.theme);
            document.cookie = `sabg-theme=${data.theme}; path=/; max-age=31536000; SameSite=Lax`;
          }
        }
      } catch {
        // Silencioso en modo offline o no autenticado
      }
    }

    syncDbTheme();
  }, [initialTheme]);

  function setTheme(newTheme: Theme) {
    if (isAuthOrPublic) return;

    setThemeState(newTheme);
    applyThemeClass(newTheme);

    // Guardar en localStorage
    localStorage.setItem("sabg-theme", newTheme);

    // Guardar en cookie para SSR
    document.cookie = `sabg-theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;

    // Persistir en base de datos para el usuario
    fetch("/api/user/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: newTheme }),
    }).catch((err) => {
      console.warn("No se pudo guardar la preferencia en el servidor:", err);
    });
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
}

