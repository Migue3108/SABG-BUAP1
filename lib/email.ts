import nodemailer from "nodemailer";

type SendCredentialsParams = {
  to: string;
  name: string;
  role: string;
  temporaryPassword: string;
  institution?: string | null;
  loginUrl?: string;
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador del Sistema",
  coordinator: "Coordinación SABG–BUAP / Observatorio",
  teacher: "Docente Asesor",
  student: "Estudiante de Servicio Social / Práctica Profesional",
  municipal: "Enlace / Usuario Municipal",
};

export async function sendWelcomeCredentialsEmail({
  to,
  name,
  role,
  temporaryPassword,
  institution,
  loginUrl = "https://sabg-buap-1.vercel.app/auth/login",
}: SendCredentialsParams) {
  const roleLabel = ROLE_LABELS[role] || role;

  const subject = `Bienvenido(a) a SABG–BUAP · Tus credenciales de acceso`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; color: #17212b; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: #0b2341; padding: 28px 32px; text-align: center; border-bottom: 4px solid #b98927; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { color: #d6e2ed; margin: 6px 0 0 0; font-size: 13px; }
    .content { padding: 32px; }
    .greeting { font-size: 18px; font-weight: 700; color: #0b2341; margin-bottom: 12px; }
    .text { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }
    .card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .card-row { margin-bottom: 10px; font-size: 14px; }
    .card-row:last-child { margin-bottom: 0; }
    .card-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px; display: block; margin-bottom: 2px; }
    .card-value { font-size: 16px; font-weight: 700; color: #0b2341; word-break: break-all; }
    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700; }
    .alert-box { background: #fffbeb; border-left: 4px solid #b98927; padding: 14px 18px; border-radius: 6px; margin: 20px 0; font-size: 13.5px; color: #78350f; line-height: 1.5; }
    .btn-container { text-align: center; margin: 32px 0 20px 0; }
    .btn { background: #0b2341; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block; transition: background 0.2s ease; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SABG–BUAP</h1>
      <p>Sistema de Acompañamiento del Buen Gobierno · Benemérita Universidad Autónoma de Puebla</p>
    </div>
    <div class="content">
      <div class="greeting">Estimado(a) ${name}:</div>
      <p class="text">
        Se ha creado exitosamente tu cuenta institucional en la plataforma <strong>SABG–BUAP</strong> para colaborar en los procesos de intervención, acompañamiento y fortalecimiento municipal.
      </p>
      
      <div class="card">
        <div class="card-row">
          <span class="card-label">Rol asignado</span>
          <span class="badge">${roleLabel}</span>
        </div>
        ${institution ? `
        <div class="card-row" style="margin-top: 12px;">
          <span class="card-label">Institución / Dependencia</span>
          <span class="card-value" style="font-size: 14px; font-weight: 600;">${institution}</span>
        </div>` : ""}
        <div class="card-row" style="margin-top: 12px;">
          <span class="card-label">Correo electrónico (Usuario)</span>
          <span class="card-value">${to}</span>
        </div>
        <div class="card-row" style="margin-top: 12px;">
          <span class="card-label">Contraseña temporal de acceso</span>
          <span class="card-value" style="font-family: monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 4px; letter-spacing: 1px;">${temporaryPassword}</span>
        </div>
      </div>

      <div class="alert-box">
        <strong>Aviso de seguridad obligatorio:</strong> Por políticas institucionales, esta clave es temporal. En tu primer inicio de sesión, el sistema te solicitará obligatoriamente cambiarla por una contraseña personal y confidencial antes de acceder a tus funciones.
      </div>

      <div class="btn-container">
        <a href="${loginUrl}" class="btn">Ingresar al Sistema</a>
      </div>

      <p class="text" style="font-size: 13px; color: #64748b; text-align: center;">
        Si tienes alguna duda o inconveniente para acceder, por favor contacta al administrador técnico institucional de SABG–BUAP.
      </p>
    </div>
    <div class="footer">
      Este es un mensaje institucional automático generado por la Plataforma SABG–BUAP. Por favor no respondas a este correo.
    </div>
  </div>
</body>
</html>
  `;

  // Comprobar si existen credenciales SMTP configuradas
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const port = Number(process.env.SMTP_PORT || 587);
      const secure = port === 465;

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const from = process.env.EMAIL_FROM || `"SABG-BUAP Notificaciones" <${smtpUser}>`;

      await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      console.log(`[EMAIL] Correo enviado exitosamente a: ${to}`);
      return { success: true, simulated: false };
    } catch (error) {
      console.error("[EMAIL ERROR] Falló el envío de correo:", error);
      return { success: false, error, simulated: false };
    }
  }

  // Modo simulación (desarrollo / sin SMTP configurado)
  console.log("================================================================");
  console.log(`[EMAIL SIMULATION] Correo institucional para: ${to}`);
  console.log(`Asunto: ${subject}`);
  console.log(`Usuario: ${name} (${to})`);
  console.log(`Rol: ${roleLabel}`);
  console.log(`Contraseña Temporal: ${temporaryPassword}`);
  console.log("================================================================");

  return { success: true, simulated: true };
}

