import type { Metadata } from "next";
import {
  Users,
  ShieldAlert,
  Mail,
  Building2,
  Lock,
  FileCheck,
  LifeBuoy,
  ChevronRight,
  Terminal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Centro de Ayuda Administrativa | SABG-BUAP",
  description: "Guías operativas y soporte técnico para administradores del sistema SABG-BUAP.",
};

export default function AdminAyudaPage() {
  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Encabezado */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-semibold text-primary mb-3">
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>Soporte Técnico y Guía Operativa</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Centro de Ayuda para Administradores
        </h1>
        <p className="text-sm text-text-secondary mt-1 max-w-2xl">
          Documentación técnica y procedimientos estándar para la administración de
          usuarios, configuración de seguridad, asignación de los 217 municipios y gestión de correos.
        </p>
      </div>

      {/* Grid de temas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gestión de Usuarios */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs hover:border-primary/30 transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Gestión y Creación de Usuarios
              </h2>
              <p className="text-xs text-text-secondary">Alta en sistema cerrado</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
            <p>
              El SABG–BUAP opera bajo una arquitectura de <strong>sistema cerrado</strong>.
              Ningún usuario puede autoregistrarse en la plataforma pública.
            </p>
            <ul className="list-disc pl-4 space-y-1 pt-1">
              <li>
                <strong>Generación de Contraseña Temporal:</strong> Al dar de alta a un usuario,
                el sistema crea una clave temporal segura de 12 caracteres.
              </li>
              <li>
                <strong>Primer Acceso Forzoso:</strong> El nuevo usuario será retenido en la
                pantalla de cambio de contraseña hasta establecer una definitiva que cumpla con
                los requisitos de seguridad (mayúscula, minúscula, número, símbolo y 8+ caracteres).
              </li>
              <li>
                <strong>Invalidación Inmediata:</strong> En cuanto el usuario establece su nueva
                clave, la temporal queda invalidada de forma irreversible.
              </li>
            </ul>
          </div>
        </div>

        {/* Notificaciones y Envío de Correo */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs hover:border-primary/30 transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Configuración del Servicio de Correo (SMTP)
              </h2>
              <p className="text-xs text-text-secondary">Envío real de credenciales</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
            <p>
              Para que los correos de bienvenida se envíen directamente a las bandejas de entrada
              de los usuarios y no solo se registren en auditoría:
            </p>
            <div className="bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-[11px] overflow-x-auto my-2">
              <p className="text-slate-400"># Configuración en .env</p>
              <p>EMAIL_ENABLED=true</p>
              <p>SMTP_HOST=smtp.gmail.com # o smtp.office365.com</p>
              <p>SMTP_PORT=587</p>
              <p>SMTP_USER=tu-cuenta@institucion.edu.mx</p>
              <p>SMTP_PASSWORD=tu-app-password-segura</p>
              <p>EMAIL_FROM=SABG-BUAP &lt;no-reply@institucion.edu.mx&gt;</p>
            </div>
            <p>
              Si las credenciales no están configuradas, el sistema activará el modo de respaldo
              automático, registrando las contraseñas temporales en los logs del servidor para
              que el administrador pueda compartirlas manualmente.
            </p>
          </div>
        </div>

        {/* Catálogo de Municipios de Puebla */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs hover:border-primary/30 transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Catálogo Oficial de 217 Municipios
              </h2>
              <p className="text-xs text-text-secondary">Adscripción y asignaciones</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
            <p>
              El sistema cuenta con el catálogo oficial validado por la Secretaría de Bienestar e
              INEGI de los <strong>217 municipios del Estado de Puebla</strong>.
            </p>
            <ul className="list-disc pl-4 space-y-1 pt-1">
              <li>
                <strong>Filtro en tiempo real:</strong> En los formularios de registro y edición,
                basta escribir las primeras letras para localizar el municipio.
              </li>
              <li>
                <strong>Usuarios Académicos:</strong> Para docentes y alumnos, se ofrecen las
                opciones de dependencias de la BUAP (Facultad de Administración, Servicio Social, etc.).
              </li>
            </ul>
          </div>
        </div>

        {/* Aislamiento de Roles y Seguridad */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs hover:border-primary/30 transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Aislamiento de Privilegios y Confidencialidad
              </h2>
              <p className="text-xs text-text-secondary">Seguridad institucional</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
            <p>
              Por políticas de confidencialidad de la información municipal auditada:
            </p>
            <ul className="list-disc pl-4 space-y-1 pt-1">
              <li>
                El <strong>Administrador Técnico</strong> supervisa la infraestructura, los
                accesos, las cuentas y las auditorías de seguridad. No tiene acceso a las
                cédulas confidenciales ni a la captura operativa municipal.
              </li>
              <li>
                Los <strong>Docentes, Estudiantes y Enlaces Municipales</strong> interactúan
                exclusivamente con la plataforma operativa de los 8 capítulos.
              </li>
              <li>
                Cualquier intento de navegación cruzada es redirigido automáticamente a su panel
                correspondiente mediante guardas de servidor.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
