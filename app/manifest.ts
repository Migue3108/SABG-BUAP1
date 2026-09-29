import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SABG-BUAP | Buen Gobierno Municipal",
    short_name: "SABG-BUAP",
    description:
      "Plataforma de acompañamiento del Buen Gobierno Municipal. Funciona sin conexión y sincroniza el avance al reconectar.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f5f7fa",
    theme_color: "#315aa6",
    lang: "es-MX",
    icons: [
      {
        src: "/logotipo.png",
        sizes: "232x216",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
