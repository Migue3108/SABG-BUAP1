import { ThemePreferences } from "@/components/preferences/theme-preferences";

export default function CoordinatorPreferencesPage() {
  return (
    <ThemePreferences
      eyebrow="Coordinación"
      title="Preferencias de Coordinación"
      description="Personaliza el tema visual de tu cuenta. El cambio se guarda automáticamente en tu perfil."
      themeHint="Elige el estilo visual para el panel de coordinación"
    />
  );
}
