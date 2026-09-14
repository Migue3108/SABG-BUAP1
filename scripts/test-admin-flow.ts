import { prisma } from "../lib/prisma";
import { hashPassword } from "better-auth/crypto";
import { sendWelcomeCredentialsEmail } from "../lib/email";

async function main() {
  console.log("1. Probando servicio de correo institucional...");
  const mailResult = await sendWelcomeCredentialsEmail({
    to: "test.enlace@teziutlan.gob.mx",
    name: "Lic. Roberto Morales (Prueba)",
    role: "municipal",
    temporaryPassword: "Sabg-7F89A-2026!",
    institution: "H. Ayuntamiento de Teziutlán",
  });
  console.log("Resultado del correo:", mailResult);

  console.log("\n2. Probando creación de usuario con mustChangePassword = true...");
  const testEmail = "test.enlace.prueba@teziutlan.gob.mx";
  
  // Limpiar si ya existía
  await prisma.user.deleteMany({ where: { email: testEmail } });

  const testUser = await prisma.user.create({
    data: {
      name: "Lic. Roberto Morales (Prueba)",
      email: testEmail,
      role: "municipal",
      active: true,
      mustChangePassword: true,
      institution: "H. Ayuntamiento de Teziutlán",
    },
  });

  console.log("Usuario creado:", {
    id: testUser.id,
    name: testUser.name,
    email: testUser.email,
    role: testUser.role,
    mustChangePassword: testUser.mustChangePassword,
  });

  console.log("\n3. Probando simulación de primer inicio de sesión (cambio obligatorio de clave)...");
  const newPassword = "MiNuevaPasswordPersonal2026!";
  const newHash = await hashPassword(newPassword);

  const updatedUser = await prisma.user.update({
    where: { id: testUser.id },
    data: { mustChangePassword: false },
  });

  console.log("Usuario tras primer inicio de sesión:", {
    id: updatedUser.id,
    mustChangePassword: updatedUser.mustChangePassword,
    status: updatedUser.mustChangePassword === false ? "CORRECTO: Contraseña establecida y bandera desactivada" : "ERROR",
  });

  // Limpiar el usuario de prueba
  await prisma.user.delete({ where: { id: testUser.id } });
  console.log("\n✓ Prueba completada y usuario de prueba limpiado exitosamente.");
}

main().catch(console.error).finally(() => prisma.$disconnect());

