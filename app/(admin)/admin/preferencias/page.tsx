import { ThemePreferences } from "@/components/preferences/theme-preferences";

export default function AdminPreferencesPage() {
  return (
    <ThemePreferences
      eyebrow="Panel Administrativo"
      title="Preferencias del Administrador"
      description="Personaliza el tema visual para tu cuenta administrativa. El cambio se guarda automáticamente en tu perfil."
      themeHint="Elige el estilo visual para el panel de administración"
    />
  );
}
