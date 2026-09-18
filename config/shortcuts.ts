export type ShortcutItem = {
  id: string;
  label: string;
  description: string;
  path: string;
  iconName: "book" | "clipboard" | "scale" | "building" | "filecheck" | "layers" | "briefcase" | "file" | "shield" | "help";
  category: "Capítulo 1" | "Capítulo 2" | "Recursos" | "Gestión";
  isExternal?: boolean;
};

export const AVAILABLE_SHORTCUTS: ShortcutItem[] = [
  {
    id: "cap1-home",
    label: "Capítulo 1: Fundamentos",
    description: "Marco conceptual, axiológico y jurídico del Buen Gobierno.",
    path: "/capitulo-1",
    iconName: "book",
    category: "Capítulo 1",
  },
  {
    id: "cap1-eval",
    label: "Autoevaluación (Pág. 7)",
    description: "Lista de verificación municipal oficial de cierre del Cap. 1.",
    path: "/capitulo-1/autoevaluacion",
    iconName: "clipboard",
    category: "Capítulo 1",
  },
  {
    id: "cap1-normativa",
    label: "Biblioteca Jurídica (17 Leyes)",
    description: "Colección de leyes, códigos y normas aplicables al ayuntamiento.",
    path: "/capitulo-1/recursos",
    iconName: "scale",
    category: "Capítulo 1",
  },
  {
    id: "cap2-home",
    label: "Capítulo 2: Diagnóstico",
    description: "Evaluación institucional integral y ruta de mejora.",
    path: "/capitulo-2",
    iconName: "building",
    category: "Capítulo 2",
  },
  {
    id: "cap2-instrument",
    label: "Cédula de Diagnóstico",
    description: "Cuestionario operativo para levantar capacidades y hallazgos.",
    path: "/capitulo-2/instrumento",
    iconName: "filecheck",
    category: "Capítulo 2",
  },
  {
    id: "recursos-hub",
    label: "Repositorio de Recursos",
    description: "Acceso a la guía rectora, anexos en 8 fragmentos y casos prácticos.",
    path: "/recursos",
    iconName: "layers",
    category: "Recursos",
  },
  {
    id: "guia-pdf",
    label: "Manual Rector Completo (PDF)",
    description: "Descarga o consulta en línea el documento rector íntegro.",
    path: "/manual/Manual_BuenGobiernoyGobernanza_vf.pdf",
    iconName: "file",
    category: "Recursos",
    isExternal: true,
  },
  {
    id: "tracking",
    label: "Seguimiento Institucional",
    description: "Monitoreo del avance y retroalimentación de la BUAP.",
    path: "/seguimiento",
    iconName: "shield",
    category: "Gestión",
  },
  {
    id: "help",
    label: "Centro de Ayuda y Soporte",
    description: "Guías, preguntas frecuentes y asistencia de la plataforma.",
    path: "/ayuda",
    iconName: "help",
    category: "Gestión",
  },
];

export const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  AVAILABLE_SHORTCUTS[0], // Cap 1
  AVAILABLE_SHORTCUTS[1], // Autoevaluacion
  AVAILABLE_SHORTCUTS[5], // Recursos
];

