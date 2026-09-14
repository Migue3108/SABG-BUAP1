import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

// Uso: npx tsx scripts/create-user.ts "Nombre" "email@ejemplo.com" "password123" "admin"
const args = process.argv.slice(2);

const name = args[0] || "Administrador";
const email = args[1] || "admin@sabg.local";
const password = args[2] || "Admin1234!";
const role = (args[3] as "admin" | "coordinator" | "teacher" | "municipal") || "admin";

async function main() {
    try {
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            const result = await auth.api.signUpEmail({
                body: { name, email, password },
            });

            user = await prisma.user.findUniqueOrThrow({
                where: { id: result.user.id },
            });
        }

        user = await prisma.user.update({
            where: { id: user.id },
            data: {
                name,
                role,
                active: true,
                emailVerified: true,
            },
        });

        console.log("=========================================");
        console.log(" Usuario registrado/actualizado con éxito");
        console.log("=========================================");
        console.log({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            password: password,
            active: user.active,
        });
        console.log("=========================================");
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}

main();

