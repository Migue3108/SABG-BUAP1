/**
 * Copia texto al portapapeles de manera robusta y compatible con todos los navegadores
 * (incluyendo contextos no seguros HTTP por IP local donde navigator.clipboard está bloqueado).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // 1. Intentar con Clipboard API moderna
  if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("[CLIPBOARD] navigator.clipboard falló, intentando método alternativo:", err);
    }
  }

  // 2. Método alternativo de respaldo con textarea (compatible con HTTP, móviles y navegadores antiguos)
  try {
    if (typeof document === "undefined") return false;

    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Evitar scroll o saltos visuales en la página
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    textArea.style.opacity = "0";
    textArea.setAttribute("readonly", "");

    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999); // Para dispositivos móviles

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    return successful;
  } catch (err) {
    console.error("[CLIPBOARD ERROR] No se pudo copiar al portapapeles:", err);
    return false;
  }
}

